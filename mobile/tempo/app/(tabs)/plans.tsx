import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { globalStyles as styles, theme } from "../../constants/styles";
import { screenStyles } from "../../constants/screenStyles";
import type { WorkoutPlan } from "../../src/core/domain/models/workoutPlan";
import type { WorkoutType } from "../../src/core/domain/models/workoutType";
import { createWorkoutPlanTemplateService } from "../../src/core/domain/services/workoutPlanTemplateService";
import { sqliteWorkoutPlanRepository } from "../../src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";
import { sqlitePlanExerciseRepository } from "../../src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";
import { sqliteWorkoutTypeRepository } from "../../src/core/data/repositories/workoutType/sqliteWorkoutTypeRepository";

const MVP_USER_ID = 1;

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
  sqliteWorkoutPlanRepository,
  sqlitePlanExerciseRepository
);

export default function PlansScreen() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [activePlans, activeWorkoutTypes] = await Promise.all([
        workoutPlanTemplateService.listWorkoutPlanTemplates(MVP_USER_ID),
        sqliteWorkoutTypeRepository.listActiveForUser(MVP_USER_ID),
      ]);

      setPlans(activePlans);
      setWorkoutTypes(activeWorkoutTypes);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load workout plans.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [loadPlans])
  );

  return (
    <View style={styles.screen}>
      <View style={screenStyles.header}>
        <View>
          <Text style={styles.title}>Plans</Text>
          <Text style={styles.subtitle}>
            Build and reuse workout templates.
          </Text>
        </View>

        <Pressable
          style={screenStyles.createButton}
          onPress={() => router.push("/plans/create")}
        >
          <Text style={screenStyles.createButtonText}>Create Plan</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={screenStyles.centerState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={screenStyles.stateText}>Loading plans...</Text>
        </View>
      ) : errorMessage ? (
        <View style={screenStyles.centerState}>
          <Text style={screenStyles.errorText}>{errorMessage}</Text>
          <Pressable style={screenStyles.secondaryButton} onPress={loadPlans}>
            <Text style={screenStyles.secondaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : plans.length === 0 ? (
        <View style={screenStyles.emptyCard}>
          <Text style={screenStyles.emptyTitle}>No Workout Plans Yet</Text>
          <Text style={screenStyles.emptyText}>
            Create your first template so future workouts have a structure to start from.
          </Text>
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(plan) => plan.id.toString()}
          contentContainerStyle={screenStyles.listContent}
          renderItem={({ item }) => (
            <WorkoutPlanCard 
              plan={item} 
              workoutTypes={workoutTypes} 
              onPress={() => 
                router.push({
                  pathname: "/plans/[workoutPlanId]",
                  params: { workoutPlanId: item.id.toString() },
                })}  
            />
          )}
        />
      )}
    </View>
  );
}

function WorkoutPlanCard({
  plan,
  workoutTypes,
  onPress,
}: {
  plan: WorkoutPlan;
  workoutTypes: WorkoutType[];
  onPress: () => void;
}) {
  const workoutTypeName = workoutTypes.find((type) => {
    return type.id === plan.workoutTypeId;
  })?.name;

  return (
    <Pressable style={screenStyles.planCard} onPress={onPress}>
      <View style={screenStyles.planCardHeader}>
        <Text style={screenStyles.planName}>{plan.name}</Text>
        <Text style={screenStyles.openText}>Open</Text>
      </View>

      {plan.description ? (
        <Text style={screenStyles.planDescription}>{plan.description}</Text>
      ) : null}

      <View style={screenStyles.metadataRow}>
        <MetadataPill label={plan.workoutDay ?? "No day"} />
        <MetadataPill label={plan.goal ?? "No goal"} />
        <MetadataPill label={workoutTypeName ?? "No type"} />
      </View>
    </Pressable>
  );
}

function MetadataPill({ label }: { label: string }) {
  return (
    <View style={screenStyles.metadataPill}>
      <Text style={screenStyles.metadataText}>{label}</Text>
    </View>
  );
}