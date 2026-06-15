import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const formatTime = (seconds: number) => {
  const h = Math.floor(Number(seconds) / 3600);
  const m = Math.floor((Number(seconds) % 3600) / 60);
  const s = Number(seconds) % 60;
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
};

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    sessionId: string;
    durationSec: string;
    totalVolumeKg: string;
    completedSets: string;
    totalSets: string;
    splitName: string;
    exerciseCount: string;
  }>();

  const durationSec = Number(params.durationSec ?? 0);
  const totalVolumeKg = Number(params.totalVolumeKg ?? 0);
  const completedSets = Number(params.completedSets ?? 0);
  const totalSets = Number(params.totalSets ?? 0);
  const exerciseCount = Number(params.exerciseCount ?? 0);
  const splitName = params.splitName || "Slobodan trening";

  const completionPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const stats = [
    { icon: "time-outline",      color: "#38BDF8", label: "Trajanje",         value: formatTime(durationSec) },
    { icon: "barbell-outline",   color: "#F97316", label: "Ukupna kilaža",    value: `${totalVolumeKg.toLocaleString()} kg` },
    { icon: "list-outline",      color: "#4ADE80", label: "Setovi",           value: `${completedSets}/${totalSets}` },
    { icon: "body-outline",      color: "#A78BFA", label: "Vježbi",           value: String(exerciseCount) },
    { icon: "trending-up-outline",color: "#FBBF24",label: "Kompletiranost",   value: `${completionPct}%` },
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top > 0 ? insets.top + 20 : 60,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      {/* Trophy */}
      <View style={styles.trophySection}>
        <View style={styles.trophyCircle}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </View>
        <Text style={styles.congrats}>Trening završen!</Text>
        <Text style={styles.splitLabel}>{splitName}</Text>
      </View>

      {/* Stats grid */}
      <Text style={styles.sectionTitle}>Rezultati</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <Ionicons name={stat.icon as any} size={22} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Completion bar */}
      <View style={styles.completionCard}>
        <View style={styles.completionRow}>
          <Text style={styles.completionLabel}>Kompletiranost treninga</Text>
          <Text style={styles.completionPct}>{completionPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionPct}%` as any,
                backgroundColor: completionPct >= 100 ? "#4ADE80" : "#F97316",
              },
            ]}
          />
        </View>
        <Text style={styles.completionSub}>
          {completionPct >= 100
            ? "🎉 Savršen trening! Svi setovi završeni!"
            : completionPct >= 70
            ? "Odlično! Nastavite ovim tempom! 💪"
            : "Svaki trening je korak naprijed! 🚀"}
        </Text>
      </View>

      {/* Personal record notice */}
      {totalVolumeKg > 1000 && (
        <View style={styles.prCard}>
          <Ionicons name="star-outline" size={22} color="#FBBF24" />
          <View style={{ flex: 1 }}>
            <Text style={styles.prTitle}>Veliki volumen! 🔥</Text>
            <Text style={styles.prSub}>
              Podigao si više od {Math.floor(totalVolumeKg / 1000)} tone danas!
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <Pressable
        style={styles.homeBtn}
        onPress={() => router.replace("/(tabs)/two")}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#0F172A" />
        <Text style={styles.homeBtnText}>Natrag na treninge</Text>
      </Pressable>

      <Pressable
        style={styles.dashBtn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Ionicons name="home-outline" size={18} color="#64748B" />
        <Text style={styles.dashBtnText}>Na Dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 20, alignItems: "stretch" },

  // Trophy
  trophySection: { alignItems: "center", marginBottom: 32, gap: 10 },
  trophyCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#FBBF2415", borderWidth: 2, borderColor: "#FBBF2430",
    alignItems: "center", justifyContent: "center",
    marginBottom: 6,
  },
  trophyEmoji: { fontSize: 48 },
  congrats: { fontSize: 28, fontWeight: "800", color: "#F8FAFC" },
  splitLabel: { fontSize: 15, color: "#64748B", fontWeight: "600" },

  // Stats
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: "#F8FAFC",
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 10, marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#1E293B", borderRadius: 18,
    padding: 16, alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "#334155",
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12, color: "#64748B", textAlign: "center" },

  // Completion bar
  completionCard: {
    backgroundColor: "#1E293B", borderRadius: 18,
    padding: 18, borderWidth: 1, borderColor: "#334155",
    marginBottom: 16, gap: 10,
  },
  completionRow: { flexDirection: "row", justifyContent: "space-between" },
  completionLabel: { fontSize: 14, color: "#94A3B8", fontWeight: "600" },
  completionPct: { fontSize: 14, color: "#F97316", fontWeight: "800" },
  progressTrack: {
    height: 8, backgroundColor: "#0F172A",
    borderRadius: 4, overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  completionSub: { fontSize: 13, color: "#94A3B8" },

  // PR card
  prCard: {
    flexDirection: "row", alignItems: "center",
    gap: 12, backgroundColor: "#1E293B",
    borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: "#FBBF2430",
    marginBottom: 16,
  },
  prTitle: { fontSize: 15, fontWeight: "700", color: "#FBBF24" },
  prSub: { fontSize: 13, color: "#94A3B8", marginTop: 2 },

  // Buttons
  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#F97316",
    borderRadius: 18, paddingVertical: 16, marginBottom: 12,
  },
  homeBtnText: { color: "#0F172A", fontWeight: "700", fontSize: 16 },
  dashBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#1E293B",
    borderRadius: 18, paddingVertical: 14,
    borderWidth: 1, borderColor: "#334155",
  },
  dashBtnText: { color: "#64748B", fontWeight: "600", fontSize: 14 },
});
