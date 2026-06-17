import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_COLORS, GLOBAL_EXERCISES, type AnyExercise } from "@/constants/exercises";
import ExerciseLibraryModal from "@/components/exercises/ExerciseLibraryModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkoutSet = {
  id: string;
  weightKg: string;
  reps: string;
  completed: boolean;
};

type WorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  category: string;
  sets: WorkoutSet[];
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const makeSet = (): WorkoutSet => ({
  id: Math.random().toString(36).slice(2),
  weightKg: "",
  reps: "",
  completed: false,
});

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SessionScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    splitId?: string;
    splitName?: string;
    exerciseIds?: string;
    exerciseNames?: string;
  }>();

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [saving, setSaving] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Boot exercises from split params
  useEffect(() => {
    const ids = params.exerciseIds ? params.exerciseIds.split(",") : [];
    const names = params.exerciseNames ? params.exerciseNames.split(",") : [];
    if (ids.length > 0) {
      const initial: WorkoutExercise[] = ids.map((id, i) => {
        const found = GLOBAL_EXERCISES.find((e) => e.id === id);
        return {
          exerciseId: id,
          exerciseName: names[i] ?? id,
          category: found?.category ?? "Prsa",
          sets: [makeSet()],
        };
      });
      setExercises(initial);
    }
  }, []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // ── Set mutations ──────────────────────────────────────────────────────────

  const updateSet = (
    exIdx: number,
    setId: string,
    field: keyof WorkoutSet,
    value: string | boolean
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, [field]: value } : s
              ),
            }
      )
    );
  };

  const addSet = (exIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx ? ex : { ...ex, sets: [...ex.sets, makeSet()] }
      )
    );
  };

  const removeSet = (exIdx: number, setId: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        if (ex.sets.length <= 1) return ex; // keep at least one
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      })
    );
  };

  const removeExercise = (exIdx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== exIdx));
  };

  const addExercise = (ex: AnyExercise) => {
    setExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        category: ex.category,
        sets: [makeSet()],
      },
    ]);
  };

  // ── Calculations ──────────────────────────────────────────────────────────

  const totalVolume = exercises.reduce((sum, ex) =>
    sum + ex.sets.reduce((s2, set) => {
      if (!set.completed) return s2;
      const kg = parseFloat(set.weightKg) || 0;
      const reps = parseInt(set.reps) || 0;
      return s2 + kg * reps;
    }, 0), 0
  );

  const completedSets = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0
  );
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  // ── Finish ────────────────────────────────────────────────────────────────

  const handleFinish = () => {
    if (exercises.length === 0) {
      if (Platform.OS === "web") {
        window.alert("Nema vježbi\nDodaj barem jednu vježbu.");
      } else {
        Alert.alert("Nema vježbi", "Dodaj barem jednu vježbu.");
      }
      return;
    }
    
    const msg = `Trajanje: ${formatTime(elapsedSec)}\nUkupna kilaža: ${totalVolume.toFixed(1)} kg\nSetova: ${completedSets}/${totalSets}`;
    
    if (Platform.OS === "web") {
      if (window.confirm(`Završi trening?\n\n${msg}`)) {
        saveSession();
      }
    } else {
      Alert.alert(
        "Završi trening?",
        msg,
        [
          { text: "Nastavi trening", style: "cancel" },
          { text: "Završi i spremi", onPress: saveSession },
        ]
      );
    }
  };

  const saveSession = async () => {
    if (!user) return;
    setSaving(true);
    clearInterval(timerRef.current!);

    const sessionExercises = exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      category: ex.category,
      sets: ex.sets.map((s, idx) => ({
        setNumber: idx + 1,
        weightKg: parseFloat(s.weightKg) || 0,
        reps: parseInt(s.reps) || 0,
        completed: s.completed,
      })),
    }));

    try {
      const docRef = await addDoc(collection(firestore, "workoutSessions"), {
        userId: user.uid,
        splitId: params.splitId ?? null,
        splitName: params.splitName ?? null,
        status: "completed",
        startedAt: new Date(startTime.current),
        finishedAt: serverTimestamp(),
        durationSec: elapsedSec,
        totalVolumeKg: parseFloat(totalVolume.toFixed(1)),
        completedSets,
        totalSets,
        exercises: sessionExercises,
      });

      router.replace({
        pathname: "/workout/summary",
        params: {
          sessionId: docRef.id,
          durationSec: String(elapsedSec),
          totalVolumeKg: String(totalVolume.toFixed(1)),
          completedSets: String(completedSets),
          totalSets: String(totalSets),
          splitName: params.splitName ?? "",
          exerciseCount: String(exercises.length),
        },
      });
    } catch (e) {
      Alert.alert("Greška", "Nije moguće spremiti trening.");
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Odustani od treninga?\nSvi podaci bit će izgubljeni.")) {
        clearInterval(timerRef.current!);
        router.back();
      }
    } else {
      Alert.alert("Odustani od treninga?", "Svi podaci bit će izgubljeni.", [
        { text: "Nastavi trening", style: "cancel" },
        {
          text: "Odustani",
          style: "destructive",
          onPress: () => {
            clearInterval(timerRef.current!);
            router.back();
          },
        },
      ]);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top > 0 ? insets.top + 8 : 48 }]}>
        <Pressable onPress={handleDiscard} style={styles.discardBtn}>
          <Ionicons name="close-outline" size={22} color="#94A3B8" />
        </Pressable>

        <View style={styles.timerContainer}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText}>{formatTime(elapsedSec)}</Text>
        </View>

        <Pressable
          style={[styles.finishBtn, saving && { opacity: 0.6 }]}
          onPress={handleFinish}
          disabled={saving}
        >
          <Text style={styles.finishBtnText}>Završi</Text>
        </Pressable>
      </View>

      {/* ── Split name ───────────────────────────────────────────────── */}
      {params.splitName ? (
        <Text style={styles.splitName}>🏋️ {params.splitName}</Text>
      ) : null}

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalVolume.toFixed(0)} kg</Text>
          <Text style={styles.statLabel}>Volumen</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedSets}</Text>
          <Text style={styles.statLabel}>Setovi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exercises.length}</Text>
          <Text style={styles.statLabel}>Vježbe</Text>
        </View>
      </View>

      {/* ── Exercise list ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {exercises.length === 0 && (
          <Pressable style={styles.emptyCard} onPress={() => setLibraryOpen(true)}>
            <Ionicons name="add-circle-outline" size={40} color="#334155" />
            <Text style={styles.emptyText}>Nema vježbi</Text>
            <Text style={styles.emptySub}>Dodaj prvu vježbu za početak</Text>
          </Pressable>
        )}

        {exercises.map((ex, exIdx) => {
          const color = CATEGORY_COLORS[ex.category as keyof typeof CATEGORY_COLORS] ?? "#F97316";
          return (
            <View key={`${ex.exerciseId}-${exIdx}`} style={styles.exerciseCard}>
              {/* Exercise header */}
              <View style={styles.exerciseHeader}>
                <View style={[styles.exColorBar, { backgroundColor: color }]} />
                <View style={styles.exTitleWrap}>
                  <Text style={styles.exTitle}>{ex.exerciseName}</Text>
                  <Text style={[styles.exCategory, { color }]}>{ex.category}</Text>
                </View>
                <Pressable onPress={() => removeExercise(exIdx)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color="#475569" />
                </Pressable>
              </View>

              {/* Set header labels */}
              <View style={styles.setHeaderRow}>
                <Text style={styles.setHeaderLabel}>#</Text>
                <Text style={[styles.setHeaderLabel, { flex: 2, textAlign: "center" }]}>KG</Text>
                <Text style={[styles.setHeaderLabel, { flex: 2, textAlign: "center" }]}>Reps</Text>
                <Text style={[styles.setHeaderLabel, { width: 40, textAlign: "center" }]}>✓</Text>
              </View>

              {/* Sets */}
              {ex.sets.map((set, setIdx) => (
                <View
                  key={set.id}
                  style={[styles.setRow, set.completed && styles.setRowCompleted]}
                >
                  {/* Set number */}
                  <Text style={styles.setNumber}>{setIdx + 1}</Text>

                  {/* Weight */}
                  <View style={[styles.setInput, { flex: 2 }]}>
                    <TextInput
                      style={[styles.setInputText, set.completed && styles.setInputDone]}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor="#334155"
                      value={set.weightKg}
                      onChangeText={(v) => updateSet(exIdx, set.id, "weightKg", v)}
                      editable={!set.completed}
                    />
                    <Text style={styles.setUnit}>kg</Text>
                  </View>

                  {/* Reps */}
                  <View style={[styles.setInput, { flex: 2 }]}>
                    <TextInput
                      style={[styles.setInputText, set.completed && styles.setInputDone]}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor="#334155"
                      value={set.reps}
                      onChangeText={(v) => updateSet(exIdx, set.id, "reps", v)}
                      editable={!set.completed}
                    />
                    <Text style={styles.setUnit}>×</Text>
                  </View>

                  {/* Complete toggle */}
                  <Pressable
                    style={[styles.checkBtn, set.completed && { backgroundColor: "#4ADE8025", borderColor: "#4ADE80" }]}
                    onPress={() => updateSet(exIdx, set.id, "completed", !set.completed)}
                  >
                    <Ionicons
                      name={set.completed ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={set.completed ? "#4ADE80" : "#334155"}
                    />
                  </Pressable>

                  {/* Remove set */}
                  {ex.sets.length > 1 && (
                    <Pressable onPress={() => removeSet(exIdx, set.id)} hitSlop={8}>
                      <Ionicons name="remove-circle-outline" size={18} color="#475569" />
                    </Pressable>
                  )}
                </View>
              ))}

              {/* Add set */}
              <Pressable style={styles.addSetBtn} onPress={() => addSet(exIdx)}>
                <Ionicons name="add-outline" size={16} color="#64748B" />
                <Text style={styles.addSetText}>Dodaj set</Text>
              </Pressable>
            </View>
          );
        })}

        {/* Add exercise */}
        <Pressable style={styles.addExBtn} onPress={() => setLibraryOpen(true)}>
          <Ionicons name="add-circle-outline" size={22} color="#F97316" />
          <Text style={styles.addExText}>Dodaj vježbu</Text>
        </Pressable>
      </ScrollView>

      <ExerciseLibraryModal
        visible={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={addExercise}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F172A" },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  discardBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center",
  },
  timerContainer: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#1E293B", paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: "#334155",
  },
  timerDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#4ADE80",
  },
  timerText: { fontSize: 18, fontWeight: "800", color: "#F8FAFC", fontVariant: ["tabular-nums"] },
  finishBtn: {
    backgroundColor: "#F97316", paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 12,
  },
  finishBtnText: { color: "#0F172A", fontWeight: "700", fontSize: 15 },

  // Split name
  splitName: {
    textAlign: "center", color: "#64748B", fontSize: 13,
    fontWeight: "600", paddingTop: 10, paddingBottom: 4,
  },

  // Stats bar
  statsBar: {
    flexDirection: "row", backgroundColor: "#1E293B",
    marginHorizontal: 16, marginTop: 10, borderRadius: 16,
    borderWidth: 1, borderColor: "#334155",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statDivider: { width: 1, backgroundColor: "#334155", marginVertical: 10 },
  statValue: { fontSize: 18, fontWeight: "800", color: "#F8FAFC" },
  statLabel: { fontSize: 11, color: "#64748B", marginTop: 2 },

  // Scroll
  scroll: { flex: 1 },

  // Empty
  emptyCard: {
    backgroundColor: "#1E293B", borderRadius: 20,
    borderWidth: 1, borderColor: "#334155", borderStyle: "dashed",
    alignItems: "center", padding: 40, gap: 10, marginBottom: 16,
  },
  emptyText: { fontSize: 16, fontWeight: "700", color: "#475569" },
  emptySub: { fontSize: 13, color: "#334155" },

  // Exercise card
  exerciseCard: {
    backgroundColor: "#1E293B", borderRadius: 18,
    borderWidth: 1, borderColor: "#334155",
    marginBottom: 14, overflow: "hidden",
  },
  exerciseHeader: {
    flexDirection: "row", alignItems: "center",
    padding: 14, gap: 10,
    borderBottomWidth: 1, borderBottomColor: "#0F172A",
  },
  exColorBar: { width: 4, height: 36, borderRadius: 2 },
  exTitleWrap: { flex: 1 },
  exTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  exCategory: { fontSize: 12, fontWeight: "600", marginTop: 2 },

  // Set rows
  setHeaderRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: "#0F172A",
  },
  setHeaderLabel: { fontSize: 11, color: "#475569", fontWeight: "700", width: 30 },
  setRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8, gap: 8,
    borderTopWidth: 1, borderTopColor: "#0F172A20",
  },
  setRowCompleted: { backgroundColor: "#4ADE8008" },
  setNumber: { width: 22, fontSize: 13, color: "#64748B", fontWeight: "700" },
  setInput: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F172A", borderRadius: 10,
    paddingHorizontal: 10, gap: 4,
    borderWidth: 1, borderColor: "#334155", height: 40,
  },
  setInputText: { flex: 1, color: "#F8FAFC", fontSize: 15, fontWeight: "700" },
  setInputDone: { color: "#4ADE80" },
  setUnit: { fontSize: 11, color: "#475569" },
  checkBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#0F172A", borderWidth: 1, borderColor: "#334155",
    alignItems: "center", justifyContent: "center",
  },

  // Add set
  addSetBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: "#0F172A",
  },
  addSetText: { color: "#64748B", fontSize: 13, fontWeight: "600" },

  // Add exercise
  addExBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#1E293B", borderRadius: 18,
    borderWidth: 1, borderColor: "#F9731640", borderStyle: "dashed",
    paddingVertical: 16, marginBottom: 10,
  },
  addExText: { color: "#F97316", fontSize: 15, fontWeight: "700" },
});
