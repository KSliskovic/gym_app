import { usePedometer } from "@/services/pedometer";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DAILY_GOAL = 10000;
const KCAL_PER_STEP = 0.04;
const METERS_PER_STEP = 0.762;

export default function StepsScreen() {
  const insets = useSafeAreaInsets();
  const {
    isAvailable,
    isLoading,
    todaySteps,
    permissionGranted,
    requestPermission,
    refresh,
  } = usePedometer();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressPercent = Math.min(todaySteps / DAILY_GOAL, 1);
  const calories = Math.round(todaySteps * KCAL_PER_STEP);
  const distanceKm = ((todaySteps * METERS_PER_STEP) / 1000).toFixed(2);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const ringFill = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handleNotAvailable = () => {
    Alert.alert(
      "Senzor nije dostupan",
      Platform.OS === "android"
        ? "Instaliraj Health Connect aplikaciju iz Play Storea i dozvoli pristup podacima o koracima."
        : "Tvoj uređaj ne podržava pedometar ili je potrebno odobriti dozvolu za praćenje aktivnosti.",
      [{ text: "OK" }],
    );
  };

  const showNotAvailable = !isLoading && !isAvailable;
  const showPermissionPrompt = !isLoading && isAvailable && !permissionGranted;
  const showData = !isLoading && isAvailable && permissionGranted;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top > 0 ? insets.top + 16 : 40,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 40 : 60,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Koraci 🚶</Text>
          <Text style={styles.headerSub}>Dnevni pregled aktivnosti</Text>
        </View>
        {showData && Platform.OS === "android" && (
          <Pressable style={styles.refreshBtn} onPress={refresh}>
            <Ionicons name="refresh-outline" size={20} color="#64748B" />
          </Pressable>
        )}
        {showData && Platform.OS === "ios" && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Not available */}
      {showNotAvailable && (
        <Pressable style={styles.unavailableCard} onPress={handleNotAvailable}>
          <Ionicons name="warning-outline" size={32} color="#F97316" />
          <Text style={styles.unavailableTitle}>Pedometar nije dostupan</Text>
          <Text style={styles.unavailableSub}>
            {Platform.OS === "android"
              ? "Health Connect nije pronađen. Instaliraj ga iz Play Storea."
              : "Senzor nije podržan na ovom uređaju ili emulatorima.\nTestiraj na fizičkom uređaju."}
          </Text>
        </Pressable>
      )}

      {/* Permission prompt (Android) */}
      {showPermissionPrompt && (
        <Pressable style={styles.permissionCard} onPress={requestPermission}>
          <Ionicons name="footsteps-outline" size={32} color="#38BDF8" />
          <Text style={styles.permissionTitle}>Dozvoli praćenje koraka</Text>
          <Text style={styles.permissionSub}>
            Tap za otvaranje Health Connect dozvola.
          </Text>
          <View style={styles.permissionBtn}>
            <Text style={styles.permissionBtnText}>Dozvoli pristup</Text>
          </View>
        </Pressable>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.ringCard}>
          <Text style={styles.ringLabel}>Učitavanje...</Text>
        </View>
      )}

      {/* Main progress ring */}
      {showData && (
        <View style={styles.ringCard}>
          <Text style={styles.ringLabel}>Dnevni cilj</Text>
          <View style={styles.ringOuter}>
            <View style={styles.ringTrack}>
              <Animated.View
                style={[
                  styles.ringFill,
                  {
                    height: ringFill,
                    backgroundColor:
                      progressPercent >= 1 ? "#4ADE80" : "#F97316",
                  },
                ]}
              />
            </View>
            <View style={styles.ringCenter}>
              <Text
                style={[
                  styles.stepCount,
                  { color: progressPercent >= 1 ? "#4ADE80" : "#F8FAFC" },
                ]}
              >
                {todaySteps.toLocaleString()}
              </Text>
              <Text style={styles.stepUnit}>koraka</Text>
              <Text style={styles.stepGoal}>
                / {DAILY_GOAL.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: ringFill,
                  backgroundColor: progressPercent >= 1 ? "#4ADE80" : "#F97316",
                },
              ]}
            />
          </View>

          <Text style={styles.progressLabel}>
            {progressPercent >= 1
              ? "🎉 Cilj ostvaren! Odlično!"
              : `${Math.round(progressPercent * 100)}% ostvareno`}
          </Text>
        </View>
      )}

      {/* Stats row */}
      {showData && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: "#F9731630" }]}>
            <Ionicons name="flame-outline" size={22} color="#F97316" />
            <Text style={[styles.statValue, { color: "#F97316" }]}>
              {calories}
            </Text>
            <Text style={styles.statLabel}>kcal</Text>
          </View>

          <View style={[styles.statCard, { borderColor: "#38BDF830" }]}>
            <Ionicons name="map-outline" size={22} color="#38BDF8" />
            <Text style={[styles.statValue, { color: "#38BDF8" }]}>
              {distanceKm}
            </Text>
            <Text style={styles.statLabel}>km</Text>
          </View>

          <View style={[styles.statCard, { borderColor: "#A78BFA30" }]}>
            <Ionicons name="trending-up-outline" size={22} color="#A78BFA" />
            <Text style={[styles.statValue, { color: "#A78BFA" }]}>
              {DAILY_GOAL - todaySteps > 0
                ? (DAILY_GOAL - todaySteps).toLocaleString()
                : "✓"}
            </Text>
            <Text style={styles.statLabel}>
              {DAILY_GOAL - todaySteps > 0 ? "do cilja" : "završeno!"}
            </Text>
          </View>
        </View>
      )}

      {/* Android note — no historical week data */}
      {showData && Platform.OS === "android" && (
        <View style={styles.androidNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#64748B"
          />
          <Text style={styles.androidNoteText}>
            Tjedni graf nije dostupan na Androidu — Health Connect ne pruža
            povijesne podatke po danu..
          </Text>
        </View>
      )}

      {/* Tips card */}
      {showData && (
        <View style={styles.tipsCard}>
          <Ionicons name="bulb-outline" size={22} color="#FBBF24" />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipsTitle}>Savjet dana</Text>
            <Text style={styles.tipsSub}>
              10.000 koraka dnevno odgovara ~5 km hodanja i pomaže u poboljšanju
              kardiovaskularnog zdravlja i sagorijevanju kalorija.
            </Text>
          </View>
        </View>
      )}

      {Platform.OS !== "ios" && Platform.OS !== "android" && (
        <Text style={styles.platformNote}>
          Pedometar radi samo na fizičkim iOS/Android uređajima.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 20, gap: 0 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#F8FAFC" },
  headerSub: { fontSize: 13, color: "#64748B", marginTop: 2 },

  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4ADE80" },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4ADE80",
    letterSpacing: 1,
  },

  unavailableCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F9731630",
    marginBottom: 20,
  },
  unavailableTitle: { fontSize: 17, fontWeight: "700", color: "#F8FAFC" },
  unavailableSub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },

  permissionCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#38BDF830",
    marginBottom: 20,
  },
  permissionTitle: { fontSize: 17, fontWeight: "700", color: "#F8FAFC" },
  permissionSub: { fontSize: 13, color: "#64748B", textAlign: "center" },
  permissionBtn: {
    backgroundColor: "#38BDF8",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  permissionBtnText: { color: "#0F172A", fontWeight: "800", fontSize: 14 },

  ringCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
    gap: 16,
  },
  ringLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ringOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    borderColor: "#0F172A",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ringTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: "#0F172A",
    borderRadius: 90,
    overflow: "hidden",
  },
  ringFill: { width: "100%", opacity: 0.25 },
  ringCenter: { alignItems: "center", zIndex: 1 },
  stepCount: { fontSize: 36, fontWeight: "800", color: "#F8FAFC" },
  stepUnit: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  stepGoal: { fontSize: 11, color: "#475569", marginTop: 2 },

  progressBarTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#0F172A",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressLabel: { fontSize: 13, color: "#94A3B8", fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, color: "#64748B", textAlign: "center" },

  androidNote: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  androidNoteText: { fontSize: 12, color: "#475569", flex: 1, lineHeight: 18 },

  tipsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FBBF2430",
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FBBF24",
    marginBottom: 4,
  },
  tipsSub: { fontSize: 12, color: "#94A3B8", lineHeight: 19 },

  platformNote: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
  },
});
