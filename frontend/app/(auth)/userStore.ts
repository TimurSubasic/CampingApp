let userStore = {
  username: "",
  request: true,
  invitation: true,
  other: false,
  basePressure: null as number | null,
};

export function updateUsername(newUsername: string) {
  userStore.username = newUsername;
}

export function getUsername() {
  return userStore.username;
}

export function updateNotification(
  key: "request" | "invitation" | "other",
  value: boolean
) {
  userStore[key] = value;
}

export function getNotification(key: "request" | "invitation" | "other") {
  return userStore[key];
}

export function setBasePressure(pressure: number) {
  userStore.basePressure = pressure;
}

export function resetBasePressure() {
  userStore.basePressure = null as number | null;
}

export function getBasePressure() {
  return userStore.basePressure;
}

export default userStore;
