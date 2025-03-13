import { View, Text, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import userStore, {
  getNotification,
  updateNotification,
} from "../../(auth)/userStore";

const Notifications = () => {
  const [settings, setSettings] = useState({
    friendRequests: getNotification("request"),
    tripInvitations: getNotification("invitation"),
    other: getNotification("other"),
  });

  const toggleSetting = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    // Update the store
    if (key === "friendRequests") updateNotification("request", newValue);
    if (key === "tripInvitations") updateNotification("invitation", newValue);
    if (key === "other") updateNotification("other", newValue);
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-col gap-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-semibold text-gray-800">
              Friend Requests
            </Text>
            <Text className="text-sm text-gray-500">
              Get notified when someone sends you a friend request
            </Text>
          </View>
          <Switch
            value={settings.friendRequests}
            onValueChange={() => toggleSetting("friendRequests")}
            trackColor={{ false: "#767577", true: "#0D7377" }}
            thumbColor={settings.friendRequests ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-semibold text-gray-800">
              Trip Invitations
            </Text>
            <Text className="text-sm text-gray-500">
              Get notified when someone invites you to a trip
            </Text>
          </View>
          <Switch
            value={settings.tripInvitations}
            onValueChange={() => toggleSetting("tripInvitations")}
            trackColor={{ false: "#767577", true: "#0D7377" }}
            thumbColor={settings.tripInvitations ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-semibold text-gray-800">
              Other Notifications
            </Text>
            <Text className="text-sm text-gray-500">
              Get notified about other activities
            </Text>
          </View>
          <Switch
            value={settings.other}
            onValueChange={() => toggleSetting("other")}
            trackColor={{ false: "#767577", true: "#0D7377" }}
            thumbColor={settings.other ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>
    </View>
  );
};

export default Notifications;
