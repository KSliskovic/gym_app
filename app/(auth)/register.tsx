import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Sva polja su obavezna.");
      return;
    }
    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 znakova.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await register(email.trim(), password);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("Korisnik s ovim emailom već postoji.");
      } else if (e.code === "auth/invalid-email") {
        setError("Nevažeći format email adrese.");
      } else if (e.code === "auth/weak-password") {
        setError("Lozinka je preslaba.");
      } else {
        setError(e.message ?? "Registracija nije uspjela.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top > 0 ? insets.top + 16 : 40,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="barbell-outline" size={40} color="#F97316" />
          </View>
          <Text style={styles.appName}>GymTracker</Text>
          <Text style={styles.tagline}>Kreiraj račun i počni pratiti napredak</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registracija</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email adresa"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Lozinka (min. 6 znakova)"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <View style={[
            styles.inputWrapper,
            passwordMatch && styles.inputWrapperSuccess,
            passwordMismatch && styles.inputWrapperError,
          ]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={passwordMatch ? "#4ADE80" : passwordMismatch ? "#F87171" : "#9CA3AF"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Potvrdi lozinku"
              placeholderTextColor="#6B7280"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} style={styles.eyeButton}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>

          {/* Password strength hint */}
          {password.length > 0 && password.length < 6 && (
            <Text style={styles.hint}>⚠️ Lozinka mora imati najmanje 6 znakova</Text>
          )}

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Register button */}
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text style={styles.primaryBtnText}>Kreiraj račun</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ili</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login link */}
          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Već imam račun — Prijavi se</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#F97316",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  inputWrapperSuccess: {
    borderColor: "#4ADE80",
  },
  inputWrapperError: {
    borderColor: "#F87171",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 52,
    color: "#F8FAFC",
    fontSize: 15,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  hint: {
    color: "#F59E0B",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#450A0A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: "#F87171",
    fontSize: 13,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryBtnText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#334155",
  },
  dividerText: {
    color: "#64748B",
    fontSize: 13,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
  },
});
