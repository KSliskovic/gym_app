import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AddWorkoutModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, category: string, duration: number, notes: string) => Promise<void>;
};

const CATEGORIES = ["Prsa", "Leđa", "Noge", "Ruke", "Ramena", "Cardio", "Ostalo"];

export default function AddWorkoutModal({ visible, onClose, onAdd }: AddWorkoutModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Prsa");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Molimo unesite naziv treninga.");
      return;
    }
    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setError("Trajanje mora biti pozitivan broj.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onAdd(name.trim(), category, durationNum, notes.trim());
      // Reset fields
      setName("");
      setCategory("Prsa");
      setDuration("");
      setNotes("");
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Greška prilikom spremanja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Novi trening 🏋️‍♂️</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-outline" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
            {/* Name */}
            <Text style={styles.label}>Naziv treninga</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="npr. Chest Day, Jutarnje trčanje..."
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Category Select */}
            <Text style={styles.label}>Kategorija</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[styles.categoryBtn, selected && styles.categoryBtnSelected]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryBtnText,
                        selected && styles.categoryBtnTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Duration */}
            <Text style={styles.label}>Trajanje (minute)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="npr. 45, 60..."
                placeholderTextColor="#6B7280"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
            </View>

            {/* Notes */}
            <Text style={styles.label}>Bilješke / Opis (opcionalno)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Što si danas radio? Kako si se osjećao?"
                placeholderTextColor="#6B7280"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Error message */}
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Action buttons */}
            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.submitBtnText}>Spremi trening</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    height: 52,
    color: "#F8FAFC",
    fontSize: 15,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#0F172A",
  },
  categoryBtnSelected: {
    borderColor: "#F97316",
    backgroundColor: "#F9731620",
  },
  categoryBtnText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },
  categoryBtnTextSelected: {
    color: "#F97316",
    fontWeight: "700",
  },
  textAreaWrapper: {
    paddingVertical: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#450A0A",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: "#F87171",
    fontSize: 13,
    flex: 1,
  },
  submitBtn: {
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
});
