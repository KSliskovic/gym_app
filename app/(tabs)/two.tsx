import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { firestore } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import WorkoutCard, { type Workout } from "@/components/workouts/WorkoutCard";
import AddWorkoutModal from "@/components/workouts/AddWorkoutModal";

export default function WorkoutsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ openAddModal?: string }>();
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (params.openAddModal === "true") {
      setModalVisible(true);
      router.setParams({ openAddModal: undefined });
    }
  }, [params.openAddModal]);

  useEffect(() => {
    if (!user) return;

    // Real-time Firestore query for user-specific workouts
    const q = query(
      collection(firestore, "workouts"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Workout[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Workout);
        });
        // Client-side sort to avoid needing Firestore composite index
        list.sort((a, b) => {
          const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return dateB - dateA;
        });
        setWorkouts(list);
        setLoading(false);
      },
      (error) => {
        console.error("Greška pri dohvaćanju treninga: ", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleAddWorkout = async (
    name: string,
    category: string,
    duration: number,
    notes: string
  ) => {
    if (!user) return;

    // Pokrećemo spremanje bez čekanja mrežne sinkronizacije (optimistično ažuriranje)
    addDoc(collection(firestore, "workouts"), {
      userId: user.uid,
      name,
      category,
      duration,
      notes,
      createdAt: serverTimestamp(),
    }).catch((error) => {
      console.error("Greška pri spremanju u pozadini: ", error);
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 16 : 40 }]}>
        <View>
          <Text style={styles.title}>Moji treninzi</Text>
          <Text style={styles.subtitle}>Ukupno odrađeno: {workouts.length}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-outline" size={24} color="#0F172A" />
        </Pressable>
      </View>

      {/* List / Loading / Empty */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : workouts.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="barbell-outline" size={40} color="#F97316" />
          </View>
          <Text style={styles.emptyTitle}>Još nemaš treninga</Text>
          <Text style={styles.emptySub}>
            Pritisni gumb gore desno i zabilježi svoj prvi trening!
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => <WorkoutCard workout={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Workout Sheet Modal */}
      <AddWorkoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddWorkout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "600",
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  addBtnPressed: {
    opacity: 0.85,
  },
  list: {
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F9731630",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
