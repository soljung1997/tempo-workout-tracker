import * as SQLite from "expo-sqlite";
import { EXERCISE_CATEGORY_SEEDS } from "../seeds/exerciseCategorySeeds";
import { MUSCLE_GROUP_SEEDS } from "../seeds/muscleGroupSeeds";

export const db = SQLite.openDatabaseSync("tempo.db");

const DATABASE_VERSION = 1;

function normalizeName(name: string): string {
    return name.trim().toLowerCase();
}

const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        display_name TEXT NOT NULL,
        google_account_id TEXT,
        email TEXT,
        sex TEXT CHECK (
            sex IS NULL OR sex IN ('male', 'female', 'intersex', 'preferNotToSay')
        ),
        height_cm REAL,
        birth_year INTEGER,
        is_active INTEGER NOT NULL DEFAULT 1,
        deleted_at TEXT,
        scheduled_hard_delete_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
`;

const createExerciseTableSql = `
    CREATE TABLE IF NOT EXISTS exercise (
        exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        muscle_group_id INTEGER NOT NULL,
        default_sets INTEGER,
        default_reps INTEGER,
        default_weight REAL,
        default_rest_seconds INTEGER,
        notes TEXT,
        is_default INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES exercise_category(exercise_category_id) ON DELETE RESTRICT,
        FOREIGN KEY (muscle_group_id) REFERENCES muscle_group(muscle_group_id) ON DELETE RESTRICT
    );
`;

const createExerciseCategoryTableSql = `
    CREATE TABLE IF NOT EXISTS exercise_category (
        exercise_category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
        UNIQUE(user_id, normalized_name)
    );
`;

const createMuscleGroupTableSql = `
    CREATE TABLE IF NOT EXISTS muscle_group (
        muscle_group_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
        UNIQUE (user_id, normalized_name)
    );
`;

const createPlanExerciseTableSql = `
    CREATE TABLE IF NOT EXISTS plan_exercise (
        plan_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_plan_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        target_sets INTEGER,
        target_reps INTEGER,
        target_weight REAL,
        target_rest_seconds INTEGER,
        notes TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (workout_plan_id) REFERENCES workout_plan(workout_plan_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id) ON DELETE CASCADE,
        UNIQUE (workout_plan_id, order_index)
    );
`;

const createSessionExerciseTableSql = `
    CREATE TABLE IF NOT EXISTS session_exercise (
        session_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_session_id INTEGER NOT NULL,
        exercise_id INTEGER,
        exercise_name_snapshot TEXT NOT NULL,
        category_name_snapshot TEXT,
        muscle_group_name_snapshot TEXT,
        order_index INTEGER NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (workout_session_id) REFERENCES workout_session(workout_session_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id) ON DELETE SET NULL,
        UNIQUE (workout_session_id, order_index)
    );
`;

const createSetLogTableSql = `
    CREATE TABLE IF NOT EXISTS set_log (
        set_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_exercise_id INTEGER NOT NULL,
        set_number INTEGER NOT NULL,
        reps_completed INTEGER,
        weight_used REAL,
        weight_unit TEXT CHECK (
            weight_unit IS NULL OR weight_unit IN ('kg', 'lb')
        ),
        rest_seconds INTEGER,
        rpe INTEGER,
        is_completed INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (session_exercise_id) REFERENCES session_exercise(session_exercise_id) ON DELETE CASCADE,
        UNIQUE (session_exercise_id, set_number)
    );
`;

const createWorkoutPlanTableSql = `
    CREATE TABLE IF NOT EXISTS workout_plan (
        workout_plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        workout_day TEXT CHECK (
            workout_day IS NULL OR workout_day IN (
                'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
            )
        ),
        goal TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
    );
`;

const createWorkoutSessionTableSql = `
    CREATE TABLE IF NOT EXISTS workout_session (
        workout_session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workout_plan_id INTEGER,
        session_name TEXT NOT NULL,
        session_date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        duration_seconds INTEGER,
        energy_rating INTEGER CHECK (energy_rating IS NULL OR energy_rating BETWEEN 1 AND 5),
        difficulty_rating INTEGER CHECK (difficulty_rating IS NULL OR difficulty_rating BETWEEN 1 AND 5),
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'inProgress' CHECK (
        status IN ('inProgress', 'completed', 'discarded')
        ),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
        FOREIGN KEY (workout_plan_id) REFERENCES workout_plan(workout_plan_id) ON DELETE SET NULL
    );
`;

function seedExerciseCategories() {
    const now = new Date().toISOString();

    for (const category of EXERCISE_CATEGORY_SEEDS) {
        const normalizedName = normalizeName(category.name);

        db.runSync(
            `
                INSERT INTO exercise_category (
                user_id,
                name,
                normalized_name,
                is_default,
                is_active,
                created_at,
                updated_at
                )
                SELECT NULL, ?, ?, 1, 1, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM exercise_category
                    WHERE user_id IS NULL
                        AND normalized_name = ?
                );
            `,
            category.name.trim(),
            normalizedName,
            now,
            now,
            normalizedName
        );
    }
}

function seedMuscleGroups() {
    const now = new Date().toISOString();

    for (const muscleGroup of MUSCLE_GROUP_SEEDS) {
        const normalizedName = normalizeName(muscleGroup.name);

        db.runSync(
            `
                INSERT INTO muscle_group (
                user_id,
                name,
                normalized_name,
                is_default,
                is_active,
                created_at,
                updated_at
                )
                SELECT NULL, ?, ?, 1, 1, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM muscle_group
                    WHERE user_id IS NULL
                        AND normalized_name = ?
                );
            `,
            muscleGroup.name.trim(),
            normalizedName,
            now,
            now,
            normalizedName
        );
    }
}

const createIndexesSql = `
  CREATE INDEX IF NOT EXISTS idx_exercise_user_id
    ON exercise(user_id);

  CREATE INDEX IF NOT EXISTS idx_exercise_category_user_id
    ON exercise_category(user_id);

  CREATE INDEX IF NOT EXISTS idx_muscle_group_user_id
    ON muscle_group(user_id);

  CREATE INDEX IF NOT EXISTS idx_workout_plan_user_id
    ON workout_plan(user_id);

  CREATE INDEX IF NOT EXISTS idx_plan_exercise_workout_plan_id
    ON plan_exercise(workout_plan_id);

  CREATE INDEX IF NOT EXISTS idx_workout_session_user_id
    ON workout_session(user_id);

  CREATE INDEX IF NOT EXISTS idx_session_exercise_workout_session_id
    ON session_exercise(workout_session_id);

  CREATE INDEX IF NOT EXISTS idx_set_log_session_exercise_id
    ON set_log(session_exercise_id);
`;

export function initializeDatabase() {
    db.execSync("PRAGMA foreign_keys = ON;");

    db.execSync(createUserTableSql);
    db.execSync(createExerciseCategoryTableSql);
    db.execSync(createMuscleGroupTableSql);
    db.execSync(createExerciseTableSql);
    db.execSync(createWorkoutPlanTableSql);
    db.execSync(createPlanExerciseTableSql);
    db.execSync(createWorkoutSessionTableSql);
    db.execSync(createSessionExerciseTableSql);
    db.execSync(createSetLogTableSql);

    db.execSync(createIndexesSql);
    db.withTransactionSync(() => {
        seedExerciseCategories();
        seedMuscleGroups();
    });

    db.execSync(`PRAGMA user_version = ${DATABASE_VERSION};`);
}