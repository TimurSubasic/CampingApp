import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../_layout";
import { getUsername } from "../../(auth)/userStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Profile = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const options = [
    {
      title: "Add Friends",
      path: "/(tabs)/(profile)/addFriends",
      icon: "user-plus",
    },
    {
      title: "Change Username",
      path: "/(tabs)/(profile)/changeUsername",
      icon: "pencil",
    },
    {
      title: "Change Profile Photo",
      path: "/(tabs)/(profile)/changePhoto",
      icon: "camera",
    },
    {
      title: "Upcoming Trips",
      path: "/(tabs)/(profile)/upcomingTrips",
      icon: "calendar",
    },
    {
      title: "Notifications",
      path: "/(tabs)/(profile)/notifications",
      icon: "bell",
    },
    {
      title: "Past Trips",
      path: "/(tabs)/(profile)/pastTrips",
      icon: "history",
    },
    {
      title: "Logout",
      onPress: () => {
        signOut();
        router.replace("/(auth)/login");
      },
      icon: "sign-out",
    },
  ];

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-between items-center my-10">
        <View className="flex-row items-center gap-4 justify-center">
          <Image
            source={require("../../../assets/images/user.jpg")}
            className="w-14 h-14 rounded-full"
          />
          <View className="flex-col items-start justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              {getUsername()}
            </Text>
            <Text className="text-sm text-gray-500">Welcome back</Text>
          </View>
        </View>
      </View>
      <View className="flex gap-5">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex-row items-center"
            onPress={option.onPress || (() => router.push(option.path as any))}
          >
            <FontAwesome
              name={option.icon as any}
              size={24}
              color="#0D7377"
              className="mr-4"
            />
            <Text className="text-lg font-semibold text-gray-800">
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Profile;
