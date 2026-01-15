import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    sup: require("../assets/fonts/sup.ttf"),
    "sup-bold": require("../assets/fonts/sup-bold.ttf"),
    "sup-semibold": require("../assets/fonts/sup-semibold.ttf"),
    "sup-regular": require("../assets/fonts/sup-regular.ttf"),
    mono: require("../assets/fonts/sup-mono.ttf"),
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// AppNavigator.tsx
// import { useColorScheme } from "@/hooks/use-color-scheme.web";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Tabs } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import React, { useEffect } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import Animated, {
//   Easing,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// const AnimatedTabIcon = ({
//   focused,
//   children,
// }: {
//   focused: boolean;
//   children: React.ReactNode;
// }) => {
//   const opacity = useSharedValue(focused ? 1 : 0.5);

//   useEffect(() => {
//     opacity.value = withTiming(focused ? 1 : 0.5, {
//       duration: 6000,
//       easing: Easing.out(Easing.exp),
//     });
//   }, [focused]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//   }));

//   return <Animated.View style={animatedStyle}>{children}</Animated.View>;
// };

// SplashScreen.preventAutoHideAsync();

// const CustomTabBarButton = ({ children, onPress }: any) => (
//   <TouchableOpacity
//     style={styles.customButton}
//     onPress={onPress}
//     activeOpacity={0.8}
//   >
//     <View style={styles.yoloButton}>{children}</View>
//   </TouchableOpacity>
// );

// const AppNavigator = () => {
//   const colorScheme = useColorScheme();

//   const [loaded, error] = useFonts({
//     sup: require("../assets/fonts/sup-regular.ttf"),
//     "sup-bold": require("../assets/fonts/sup-bold.ttf"),
//     "sup-semibold": require("../assets/fonts/sup-semibold.ttf"),
//     "sup-regular": require("../assets/fonts/sup.ttf"),
//     mono: require("../assets/fonts/sup-mono.ttf"),
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   if (!loaded && !error) {
//     return null;
//   }

//   return (
//     <>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Tabs
//           screenOptions={{
//             headerShown: false,
//             tabBarShowLabel: true, // Enable label if needed
//             tabBarActiveTintColor: "#fff", // White for active tab
//             tabBarInactiveTintColor: "#666", // Light gray for inactive
//             tabBarLabelStyle: {
//               marginTop: 10,
//               fontSize: 12,
//               fontWeight: "400",
//             },
//             tabBarStyle: styles.tabBar,
//           }}
//         >
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: "home",
//             }}
//           />
//         </Tabs>
//       </ThemeProvider>
//     </>
//   );
// };

// export default AppNavigator;

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tabBar: {
//     position: "absolute",
//     bottom: -50,
//     elevation: 5,
//     backgroundColor: "black",
//     borderColor: "black",
//     height: 130,
//   },
//   customButton: {
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   yoloButton: {
//     width: 65,
//     height: 65,
//     borderRadius: 35,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
// });
