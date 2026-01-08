// import { HelloWave } from "@/components/hello-wave";
// import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { database } from "@/constants/config";
// import { Image } from "expo-image";
// import { onValue, ref, set } from "firebase/database";
// import { useEffect, useState } from "react";
// import { StyleSheet, TextInput } from "react-native";

// export default function HomeScreen() {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");

//   // Separate state for showing DB values
//   const [dbEmail, setDbEmail] = useState("");
//   const [dbName, setDbName] = useState("");

//   // Save data to Firebase on text change
//   function writeUserData(newName: string, newEmail: string) {
//     if (!newEmail) return; // don’t write empty keys
//     set(ref(database, "users/" + newEmail.replace(/\./g, "_")), {
//       username: newName,
//       email: newEmail,
//     });
//   }

//   // Listen to DB whenever email changes
//   useEffect(() => {
//     if (!email) return;

//     const emailKey = email.replace(/\./g, "_");
//     const userRef = ref(database, "users/" + emailKey);

//     const unsubscribe = onValue(userRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setDbEmail(data.email);
//         setDbName(data.username);
//       } else {
//         setDbEmail("");
//         setDbName("");
//       }
//     });

//     return () => unsubscribe();
//   }, [email]);

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>

//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Enter your Email</ThemedText>
//         <TextInput
//           value={email}
//           onChangeText={(text) => {
//             setEmail(text);
//             writeUserData(name, text);
//           }}
//           style={styles.input}
//         />

//         <ThemedText type="subtitle">Enter your Name</ThemedText>
//         <TextInput
//           value={name}
//           onChangeText={(text) => {
//             setName(text);
//             writeUserData(text, email);
//           }}
//           style={styles.input}
//         />
//       </ThemedView>

//       {/* DETAILS from DB, not state */}
//       <ThemedText type="title">DETAILS (From DB)</ThemedText>
//       <ThemedText type="subtitle" style={{ color: "yellow" }}>
//         {dbEmail || "No email stored"}
//       </ThemedText>
//       <ThemedText type="subtitle" style={{ color: "yellow" }}>
//         {dbName || "No name stored"}
//       </ThemedText>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
//   input: {
//     borderColor: "#bbb",
//     borderWidth: 1,
//     color: "white",
//     borderRadius: 20,
//     padding: 10,
//     marginVertical: 10,
//   },
// });
import { Image, Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
