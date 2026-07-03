import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || error?.message || "";
    if (code.includes("auth/email-already-in-use"))
      return "This email is already registered.";
    if (code.includes("auth/invalid-email"))
      return "Invalid email address format.";
    if (code.includes("auth/weak-password"))
      return "Password is too weak. Must be at least 6 characters.";
    if (code.includes("auth/network-request-failed"))
      return "Network error. Please check your connection.";
    return error?.message || "An unexpected error occurred. Please try again.";
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await signUpWithEmail(email.trim(), password, name.trim());
    } catch (error: any) {
      console.error("Registration Error:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="auth-shell"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-background"
      >
        <View className="flex-1 justify-center px-6 py-8">
          <View className="mb-8 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-sm">
              <AntDesign name="arrow-up" size={28} color="white" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Create account
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              Start fresh with a secure, polished workspace.
            </Text>
          </View>

          <View className="auth-card">
            {errorMessage ? (
              <View className="mb-5 flex-row items-start rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Feather name="alert-circle" size={18} color="#EF4444" />
                <Text className="ml-2 flex-1 text-sm font-medium text-destructive">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="input-label">Full name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor="#7A8797"
                autoCapitalize="words"
                className="input-field"
                editable={!submitting}
              />
            </View>

            <View className="mb-4">
              <Text className="input-label">Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor="#7A8797"
                keyboardType="email-address"
                autoCapitalize="none"
                className="input-field"
                editable={!submitting}
              />
            </View>

            <View className="mb-4">
              <Text className="input-label">Password</Text>
              <View className="flex-row items-center rounded-2xl border border-border bg-input-background px-4 py-3.5">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#7A8797"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="mr-2 flex-1 text-base text-foreground"
                  editable={!submitting}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#5F6B7A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-5">
              <Text className="input-label">Confirm password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor="#7A8797"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="input-field"
                editable={!submitting}
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={submitting}
              className="rounded-2xl bg-primary px-4 py-3.5"
              activeOpacity={0.9}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-base font-semibold text-primary-foreground">
                  Create account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-8 flex-row justify-center">
            <Text className="text-sm text-muted-foreground">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              disabled={submitting}
            >
              <Text className="ml-1 text-sm font-semibold text-primary">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
