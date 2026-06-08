import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Workout {
  id?: string;
  userId: string;
  name: string;
  duration: number;
  notes: string;
  category: string;
  createdAt: any;
}

type WorkoutCardProps = {
  workout: Workout;
};

const CATEGORY_COLORS: Record<string, string> = {
  Prsa: "#EF4444",
  Leđa: "#3B82F6",
  Noge: "#10B981",
  Ruke: "#F59E0B",
  Ramena: "#8B5CF6",
  Cardio: "#EC4899",
  Ostalo: "#6B7280",
};

const CATEGORY_ICONS: Record<string, string> = {
  Prsa: "flame-outline",
  Leđa: "body-outline",
  Noge: "walk-outline",
  Ruke: "barbell-outline",
  Ramena: "git-commit-outline",
  Cardio: "heart-outline",
  Ostalo: "help-circle-outline",
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const categoryColor = CATEGORY_COLORS[workout.category] ?? CATEGORY_COLORS.Ostalo;
  const categoryIcon = CATEGORY_ICONS[workout.category] ?? CATEGORY_ICONS.Ostalo;

  // Format date if it exists
  let dateString = "Danas";
  if (workout.createdAt) {
    const date = workout.createdAt.toDate ? workout.createdAt.toDate() : new Date(workout.createdAt);
    dateString = date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20" }]}>
          <Ionicons name={categoryIcon as any} size={16} color={categoryColor} />
          <Text style={[styles.categoryText, { color: categoryColor }]}>{workout.category}</Text>
        </View>
        <Text style={styles.date}>{dateString}</Text>
      </View>

      <Text style={styles.title}>{workout.name}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="#94A3B8" />
          <Text style={styles.metaText}>{workout.duration} min</Text>
        </View>
      </View>

      {workout.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {workout.notes}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
  notes: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 10,
    marginTop: 4,
  },
});
