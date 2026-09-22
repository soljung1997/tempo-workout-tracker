{/* Basic Imports */}
import { Pressable, Text, View } from "react-native";
import { useCallback, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { formatLocalDateKey } from "../../src/core/utils/calendarDates";

{/* Type, Repo Imports */}
import type { PlannedWorkout } from "../../src/core/domain/models/plannedWorkout";
import type { User } from "../../src/core/domain/models/user";
import type { WorkoutPlan } from  "../../src/core/domain/models/workoutPlan";
import { createPlannedWorkoutService } from "../../src/core/domain/services/plannedWorkoutService";
import { sqlitePlannedWorkoutRepository } from "../../src/core/data/repositories/plannedWorkout/sqlitePlannedWorkoutRepository";
import { createWorkoutPlanTemplateService } from "../../src/core/domain/services/workoutPlanTemplateService";
import { sqliteWorkoutPlanRepository } from "../../src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";
import { sqlitePlanExerciseRepository } from "../../src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";


{/*Styles import */}
import { globalStyles as styles, theme } from "../../constants/styles";
import { screenStyles } from "../../constants/screenStyles";
import { calendarStyles } from "../../constants/calendarStyles";
import { Ionicons } from "@expo/vector-icons";

{/* Component Imports */}
import { CalendarHeader } from "../../components/calendar/CalendarHeader";
import { WeekdayHeader } from "../../components/calendar/WeekdayHeader";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { SelectedDayPanel } from "@/components/calendar/SelectedDayPanel";

const MVP_USER_ID = 1;

const workoutPlanTemplateService = 
  createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository,
  );

const plannedWorkoutService = createPlannedWorkoutService(sqlitePlannedWorkoutRepository);

export default function DashboardScreen() {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(),
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]);

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);


  const loadCalendarData = useCallback(async() => {
    setIsLoading(true);
    setErrorMessage(null);

    try{
      const [
        activePlannedWorkouts,
        activeWorkoutPlans,
      ] = await Promise.all([
        plannedWorkoutService.listPlannedWorkoutsForUser(MVP_USER_ID),
        workoutPlanTemplateService.listWorkoutPlanTemplates(MVP_USER_ID),
      ]);

      setPlannedWorkouts(activePlannedWorkouts);
      setWorkoutPlans(activeWorkoutPlans);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load calendar data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCalendarData();
    }, [loadCalendarData]),
  );

  function changeMonth(amount: number) {
    const newMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + amount,
      1,
    );

    setVisibleMonth(newMonth);
    setSelectedDate(newMonth);
  }

  function goToPreviousMonth() {
    changeMonth(-1);
  }

  function goToNextMonth() {
    changeMonth(+1);
  }

  const selectedDateKey = formatLocalDateKey(selectedDate);
  
  const visiblePlannedWorkouts = 
    plannedWorkouts.filter((plannedWorkout) => {
      return plannedWorkout.status !== "cancelled";
    });

  const selectedDateWorkouts = 
    visiblePlannedWorkouts.filter((plannedWorkout) => {
      return (
        plannedWorkout.plannedDate === selectedDateKey
      );
    })
    .map((plannedWorkout) => {
      const matchingPlan = workoutPlans.find(
        (workoutPlan) => {
          return (
            workoutPlan.id === plannedWorkout.workoutPlanId
          );
        },
      );

      return {
        id: plannedWorkout.id,
        name:
          matchingPlan?.name ??
          "Unknown workout plan",
          status: plannedWorkout.status,
      };
    });
  
  return (
    <View style={styles.screen}>
        {/* Calendar header */}
        <CalendarHeader
          visibleMonth={visibleMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
        <WeekdayHeader/>
        <MonthGrid 
          visibleMonth={visibleMonth}
          selectedDate={selectedDate}
          plannedWorkouts={visiblePlannedWorkouts}
          onSelectDate={setSelectedDate}
        />
        {isLoading ? (
          <Text style={screenStyles.emptyText}>Loading Workouts...</Text>
        ) : errorMessage ? (
          <View>
            <Text style={screenStyles.errorText}>
              {errorMessage}
            </Text>

            <Pressable
              style={screenStyles.secondaryButton}
              onPress={loadCalendarData}
            >
              <Text style={screenStyles.secondaryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (<SelectedDayPanel
          dateLabel={selectedDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          workouts={selectedDateWorkouts}
          onSchedulePress={() => {
            router.push({
              pathname: "/planned-workout",
              params: {
                date: formatLocalDateKey(selectedDate),
              },
            });
          }}
          onEditWorkoutPress={(workoutId) => {
            router.push({
              pathname:"/planned-workout",
              params: {
                plannedWorkoutId: workoutId.toString(),
              },
            });
          }}
        />
        )}
    </View>
  );
}


