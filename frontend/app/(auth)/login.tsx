import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../_layout";
import { updateUsername } from "./userStore";

const Login = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      newErrors.email = "Email/Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      // TODO: Implement actual authentication
      updateUsername(email.split("@")[0]); // Using email prefix as username for now
      signIn();
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Welcome Back
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-2">Email / Username</Text>
            <TextInput
              className={`border rounded-lg p-4 text-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email or username"
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
                placeholder="Enter your password"
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

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#0D7377] rounded-lg p-4 mt-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="mt-4"
          >
            <Text className="text-[#0D7377] text-center">
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
