import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addFriends"
        options={{
          title: "Add Friends",
        }}
      />
      <Stack.Screen
        name="changeUsername"
        options={{
          title: "Change Username",
        }}
      />
      <Stack.Screen
        name="changePhoto"
        options={{
          title: "Change Profile Photo",
        }}
      />
      <Stack.Screen
        name="upcomingTrips"
        options={{
          title: "Upcoming Trips",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="pastTrips"
        options={{
          title: "Past Trips",
        }}
      />
    </Stack>
  );
}
