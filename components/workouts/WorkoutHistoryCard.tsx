import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { session: any };

const formatDuration = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
};

export default function WorkoutHistoryCard({ session }: Props) {
  let dateStr = "Nedavno";
  if (session.finishedAt?.toDate) {
    dateStr = session.finishedAt.toDate().toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } else if (session.startedAt?.toDate) {
    dateStr = session.startedAt.toDate().toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const exerciseCount = session.exercises?.length ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.splitBadge}>
          <Ionicons name="barbell-outline" size={13} color="#F97316" />
          <Text style={styles.splitName} numberOfLines={1}>
            {session.splitName ?? "Slobodan trening"}
          </Text>
        </View>
        <Text style={styles.date}>{dateStr}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={16} color="#38BDF8" />
          <Text style={styles.statValue}>
            {formatDuration(session.durationSec ?? 0)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="barbell-outline" size={16} color="#F97316" />
          <Text style={styles.statValue}>
            {(session.totalVolumeKg ?? 0).toLocaleString()} kg
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="list-outline" size={16} color="#4ADE80" />
          <Text style={styles.statValue}>
            {session.completedSets ?? 0}/{session.totalSets ?? 0} setova
          </Text>
        </View>
      </View>

      {exerciseCount > 0 && (
        <Text style={styles.exercises}>
          {(session.exercises ?? [])
            .slice(0, 4)
            .map((e: any) => e.exerciseName)
            .join(" · ")}
          {exerciseCount > 4 ? ` +${exerciseCount - 4}` : ""}
        </Text>
      )}
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
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  splitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9731615",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  splitName: { fontSize: 12, fontWeight: "700", color: "#F97316" },
  date: { fontSize: 12, color: "#64748B" },
  statsRow: { flexDirection: "row", gap: 16 },
  stat: { flexDirection: "row", alignItems: "center", gap: 5 },
  statValue: { fontSize: 13, color: "#94A3B8", fontWeight: "600" },
  exercises: {
    fontSize: 12,
    color: "#475569",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 8,
    lineHeight: 18,
  },
});
