import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, useSegments } from "expo-router";

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth pages
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments]);

  const signIn = () => {
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthContext.Provider>
  );
}
