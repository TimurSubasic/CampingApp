import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../_layout";
import { updateUsername } from "./userStore";

const Signup = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username) {
      newErrors.username = "Username is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      // TODO: Implement actual authentication
      updateUsername(username);
      signIn();
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Account
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-2">Username</Text>
            <TextInput
              className={`border rounded-lg p-4 text-gray-800 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Choose a username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
              autoCapitalize="none"
            />
            {errors.username ? (
              <Text className="text-sm text-red-500 mt-1">
                {errors.username}
              </Text>
            ) : null}
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
              className={`border rounded-lg p-4 text-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email ? (
              <Text className="text-sm text-red-500 mt-1">{errors.email}</Text>
            ) : null}
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-lg p-4 text-gray-800 pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text className="text-sm text-red-500 mt-1">
                {errors.password}
              </Text>
            ) : null}
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Confirm Password</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-lg p-4 text-gray-800 pr-12 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
              >
                <FontAwesome
                  name={showConfirmPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            className="bg-[#0D7377] rounded-lg p-4 mt-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-4"
          >
            <Text className="text-[#0D7377] text-center">
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
