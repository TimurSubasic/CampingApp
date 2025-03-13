import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { getUsername } from "../../(auth)/userStore";
import { updateUsername } from "../../(auth)/userStore";
import { useRouter } from "expo-router";

const ChangeUsername = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const handleSubmit = () => {
    if (newUsername === "") {
      setError("Username cannot be empty");
      return;
    }
    // TODO: Implement username update
    updateUsername(newUsername);
    router.back();
    setError("");
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="space-y-4">
        <View>
          <Text className="text-gray-600 mb-2">Current Username</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {getUsername()}
          </Text>
        </View>

        <View className="mt-10">
          <Text className="text-gray-600 mb-2">New Username</Text>
          <TextInput
            className={`border rounded-lg p-4 text-gray-800 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter new username"
            onChangeText={(text) => {
              setNewUsername(text);
              setError("");
            }}
            autoCapitalize="none"
          />
          {error ? (
            <Text className="text-sm text-red-500 mt-1">{error}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-[#0D7377] rounded-lg p-4 mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Update Username
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeUsername;
