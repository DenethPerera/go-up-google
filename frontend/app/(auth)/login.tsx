import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ICONS } from "../../constants/icon";
import { IMAGES } from "../../constants/image";
import { useAuth } from "../../context/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || error?.message || "";
    if (code.includes("auth/invalid-email"))
      return "Invalid email address format.";
    if (
      code.includes("auth/user-not-found") ||
      code.includes("auth/wrong-password") ||
      code.includes("auth/invalid-credential")
    ) {
      return "Incorrect email or password.";
    }
    if (code.includes("auth/network-request-failed"))
      return "Network error. Please check your connection.";
    if (code.includes("auth/too-many-requests"))
      return "Too many login attempts. Try again later.";
    return error?.message || "An unexpected error occurred. Please try again.";
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await signInWithEmail(email.trim(), password);
      router.replace("/(tabs)" as any);
    } catch (error: any) {
      console.error("Email Login Error:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setErrorMessage("");
    try {
      await signInWithGoogle();
      router.replace("/(tabs)" as any);
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (
        !error?.message?.includes("developer_error") &&
        !error?.message?.includes("CANCELED") &&
        !error?.message?.includes("12501")
      ) {
        setErrorMessage(getFriendlyErrorMessage(error));
      }
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}
      className="auth-shell"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="container-centered">
          {/* Header Section */}
          <View className="mb-8 items-center">
           
            <View className="mb-4 items-center justify-center">
              <Image source={IMAGES.HeaderLogo} style={{ width: 200, height: 200 }} />
            </View>
           
            <Text className="mt-2 text-center text-sm font-medium text-muted-foreground">
              Sign in to continue to your workspace.
            </Text>
          </View>

          {/* Form Card */}
          <View className="auth-card w-full max-w-md">
            {/* Error State */}
            {errorMessage ? (
              <View className="mb-5 flex-row items-center rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5">
                <Feather name="alert-circle" size={18} color="#ef4444" />
                <Text className="ml-2 flex-1 text-sm font-semibold text-destructive">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View className="mb-5">
              <Text className="input-label">Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor="#6ea2b3" // Using your border/muted tone
                keyboardType="email-address"
                autoCapitalize="none"
                className="input-field"
                editable={!submitting}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <View className="mb-1.5 flex-row items-center justify-between">
                <Text className="input-label mb-0">Password</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Reset Password", "Contacting support...")
                  }
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-sm font-semibold text-primary">
                    Forgot?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom wrapping to match .input-field visually while allowing the icon */}
              <View className="flex-row items-center rounded-2xl border border-border bg-input-background px-4 focus-within:border-primary">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#6ea2b3"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-base text-foreground"
                  editable={!submitting}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#49769f" // Matches --muted-foreground
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Submit Button */}
            <TouchableOpacity
              onPress={handleEmailLogin}
              disabled={submitting}
              className="btn-primary"
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-primary-foreground">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-border/50" />
              <Text className="mx-4 text-sm font-semibold text-muted-foreground">
                OR
              </Text>
              <View className="h-px flex-1 bg-border/50" />
            </View>

            {/* Secondary Provider Button */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={submitting}
              className="btn-base border border-border bg-card"
              activeOpacity={0.8}
            >
              {/* Fixed invalid color prop here */}
              <ICONS.GoogleLogo width={24} height={24} />
              <Text className="ml-3 text-base font-semibold text-foreground">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 flex-row items-center justify-center">
            <Text className="text-base font-medium text-muted-foreground">
              Don’t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              disabled={submitting}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="ml-1.5 text-base font-bold text-primary">
                Create one
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}