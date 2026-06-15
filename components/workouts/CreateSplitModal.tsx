import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import ExerciseLibraryModal from "@/components/exercises/ExerciseLibraryModal";
import { CATEGORY_COLORS, type AnyExercise } from "@/constants/exercises";
import type { Split } from "@/components/workouts/SplitCard";

const SPLIT_COLORS = [
  "#F97316", "#EF4444", "#3B82F6", "#10B981",
  "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4",
];

type Props = {
  visible: boolean;
  onClose: () => void;
  editSplit?: Split | null;
  customExercises?: AnyExercise[];
};

export default function CreateSplitModal({ visible, onClose, editSplit, customExercises = [] }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(SPLIT_COLORS[0]);
  const [selectedExercises, setSelectedExercises] = useState<AnyExercise[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editSplit) {
      setName(editSplit.name);
      setDescription(editSplit.description);
      setColor(editSplit.color);
      // Reconstruct exercise objects from names/ids for display
      setSelectedExercises(
        editSplit.exerciseIds.map((id, i) => ({
          id,
          name: editSplit.exerciseNames[i] ?? id,
          category: "Prsa" as const,
          muscleGroup: "",
          equipment: "Šipka" as const,
          isGlobal: true as const,
        }))
      );
    } else {
      setName("");
      setDescription("");
      setColor(SPLIT_COLORS[0]);
      setSelectedExercises([]);
    }
  }, [editSplit, visible]);

  const handleAddExercises = (exercises: AnyExercise[]) => {
    setSelectedExercises((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const toAdd = exercises.filter((e) => !existingIds.has(e.id));
      return [...prev, ...toAdd];
    });
  };

  const handleRemoveExercise = (id: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSelectedExercises((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    setSelectedExercises((prev) => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Greška", "Unesite naziv splita.");
    if (!user) return;

    setLoading(true);
    const data = {
      userId: user.uid,
      name: name.trim(),
      description: description.trim(),
      color,
      exerciseIds: selectedExercises.map((e) => e.id),
      exerciseNames: selectedExercises.map((e) => e.name),
    };

    try {
      if (editSplit?.id) {
        await updateDoc(doc(firestore, "splits", editSplit.id), data);
      } else {
        await addDoc(collection(firestore, "splits"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (e) {
      Alert.alert("Greška", "Nije moguće spremiti split.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editSplit?.id) return;
    Alert.alert(
      "Obriši split",
      `Obrisati "${editSplit.name}"?`,
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Obriši",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(firestore, "splits", editSplit.id!));
              onClose();
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{editSplit ? "Uredi split" : "Novi split"}</Text>
              <View style={styles.headerRight}>
                {editSplit && (
                  <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                )}
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close-outline" size={24} color="#94A3B8" />
                </Pressable>
              </View>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
              {/* Name */}
              <Text style={styles.label}>Naziv splita</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="npr. Push Day 💪, Leg Day 🦵..."
                  placeholderTextColor="#475569"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Description */}
              <Text style={styles.label}>Opis (opcionalno)</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="npr. Prsa, ramena i triceps..."
                  placeholderTextColor="#475569"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Color picker */}
              <Text style={styles.label}>Boja</Text>
              <View style={styles.colorRow}>
                {SPLIT_COLORS.map((c) => (
                  <Pressable
                    key={c}
                    style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
                    onPress={() => setColor(c)}
                  >
                    {color === c && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </Pressable>
                ))}
              </View>

              {/* Exercises */}
              <View style={styles.exercisesHeader}>
                <Text style={styles.label}>Vježbe ({selectedExercises.length})</Text>
                <Pressable style={styles.addExBtn} onPress={() => setLibraryOpen(true)}>
                  <Ionicons name="add-outline" size={18} color="#F97316" />
                  <Text style={styles.addExBtnText}>Dodaj vježbe</Text>
                </Pressable>
              </View>

              {selectedExercises.length === 0 ? (
                <Pressable style={styles.emptyExercises} onPress={() => setLibraryOpen(true)}>
                  <Ionicons name="barbell-outline" size={28} color="#334155" />
                  <Text style={styles.emptyExText}>Dodaj vježbe iz biblioteke</Text>
                </Pressable>
              ) : (
                selectedExercises.map((ex, index) => {
                  const color = CATEGORY_COLORS[ex.category];
                  return (
                    <View key={ex.id} style={styles.exRow}>
                      <View style={[styles.exDot, { backgroundColor: color }]} />
                      <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
                      <Pressable onPress={() => moveUp(index)} hitSlop={6}>
                        <Ionicons name="chevron-up" size={16} color="#475569" />
                      </Pressable>
                      <Pressable onPress={() => moveDown(index)} hitSlop={6}>
                        <Ionicons name="chevron-down" size={16} color="#475569" />
                      </Pressable>
                      <Pressable onPress={() => handleRemoveExercise(ex.id)} hitSlop={6}>
                        <Ionicons name="close-circle" size={18} color="#EF444460" />
                      </Pressable>
                    </View>
                  );
                })
              )}

              <Pressable
                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveBtnText}>
                  {editSplit ? "Spremi izmjene" : "Kreiraj split"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ExerciseLibraryModal
        visible={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={() => {}}
        multiSelect
        selectedIds={selectedExercises.map((e) => e.id)}
        onMultiConfirm={handleAddExercises}
        customExercises={customExercises}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.8)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#334155",
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  headerRight: { flexDirection: "row", gap: 8 },
  title: { fontSize: 20, fontWeight: "800", color: "#F8FAFC" },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#450A0A", alignItems: "center", justifyContent: "center",
  },
  closeBtn: { padding: 4 },
  scroll: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: "700", color: "#94A3B8", marginBottom: 8, marginTop: 14 },
  inputWrap: {
    backgroundColor: "#0F172A", borderWidth: 1, borderColor: "#334155",
    borderRadius: 14, paddingHorizontal: 14,
  },
  input: { height: 50, color: "#F8FAFC", fontSize: 15 },
  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  colorDotActive: {
    borderWidth: 3, borderColor: "#fff",
    shadowColor: "#fff", shadowOpacity: 0.3, shadowRadius: 6,
  },
  exercisesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  addExBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#F9731615", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: "#F9731640",
  },
  addExBtnText: { color: "#F97316", fontSize: 13, fontWeight: "700" },
  emptyExercises: {
    backgroundColor: "#0F172A", borderRadius: 14, borderWidth: 1,
    borderColor: "#334155", borderStyle: "dashed",
    alignItems: "center", padding: 24, gap: 8, marginTop: 0,
  },
  emptyExText: { color: "#475569", fontSize: 13 },
  exRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F172A", borderRadius: 12, padding: 12,
    marginBottom: 6, gap: 8, borderWidth: 1, borderColor: "#1E293B",
  },
  exDot: { width: 8, height: 8, borderRadius: 4 },
  exName: { flex: 1, color: "#E2E8F0", fontSize: 14, fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#F97316", borderRadius: 16,
    paddingVertical: 16, alignItems: "center", marginTop: 24,
  },
  saveBtnText: { color: "#0F172A", fontSize: 16, fontWeight: "700" },
});
