import { Colors } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  temperatureC: number;
  voltageV: number;
  currentA: number;
};

function getTempTheme(t: number) {
  if (t < 10) return { label: "Cold", color: "#3B82F6", bg: "#3B82F61A" };
  if (t < 35) return { label: "Normal", color: "#22C55E", bg: "#22C55E1A" };
  if (t < 45) return { label: "Warm", color: "#FACC15", bg: "#FACC151A" };
  if (t < 55) return { label: "Hot", color: "#FB923C", bg: "#FB923C1A" };
  return { label: "Critical", color: "#EF4444", bg: "#EF44441A" };
}

function StatTile({
  icon,
  label,
  value,
  suffix,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  suffix: string;
}) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.tile, { backgroundColor: colors.background }]}>
      <View style={styles.tileTop}>
        <View style={[styles.iconBubble, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name={icon} size={18} color={colors.icon} />
        </View>
        <Text style={[styles.tileLabel, { color: colors.icon }]}>{label}</Text>
      </View>

      <View style={styles.tileValueRow}>
        <Text style={[styles.tileValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.tileSuffix, { color: colors.icon }]}>
          {suffix}
        </Text>
      </View>
    </View>
  );
}

export default function BatteryAccordion({
  temperatureC,
  voltageV,
  currentA,
}: Props) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [open, setOpen] = useState(false);

  // Smooth fade/slide for body
  const bodyAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);

    Animated.timing(bodyAnim, {
      toValue: open ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const temp = getTempTheme(temperatureC);

  const rotate = bodyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const bodyStyle = {
    opacity: bodyAnim,
    transform: [
      {
        translateY: bodyAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0], // slide up feel
        }),
      },
    ],
  };

  return (
    <View style={[styles.container]}>
      {/* Header (clickable) */}
      <Pressable onPress={toggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[styles.batteryIcon, { backgroundColor: colors.background }]}
          >
            <MaterialCommunityIcons
              name="battery"
              size={20}
              color={colors.tint}
            />
          </View>

          <View>
            <Text style={[styles.title, { color: colors.text }]}>Battery</Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Tap to view details
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Temperature mini badge always visible */}
          <View
            style={[
              styles.tempMini,
              { backgroundColor: temp.bg, borderColor: temp.color },
            ]}
          >
            <MaterialCommunityIcons
              name="thermometer"
              size={14}
              color={temp.color}
            />
            <Text style={[styles.tempMiniText, { color: colors.text }]}>
              {temperatureC.toFixed(1)}°C
            </Text>
          </View>

          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={colors.icon}
            />
          </Animated.View>
        </View>
      </Pressable>

      {/* Body (Accordion content) */}
      {open && (
        <Animated.View style={[styles.body, bodyStyle]}>
          <View
            style={[
              styles.tempChip,
              { backgroundColor: temp.bg, borderColor: temp.color },
            ]}
          >
            <View
              style={[
                styles.tempIconWrap,
                { backgroundColor: temp.color + "22" },
              ]}
            >
              <MaterialCommunityIcons
                name="thermometer"
                size={18}
                color={temp.color}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.tempLabel, { color: colors.icon }]}>
                Temperature
              </Text>
              <Text style={[styles.tempValue, { color: colors.text }]}>
                {temperatureC.toFixed(1)}°C
              </Text>
            </View>

            <View
              style={[styles.tempBadge, { backgroundColor: temp.color + "22" }]}
            >
              <Text style={[styles.tempBadgeText, { color: temp.color }]}>
                {temp.label}
              </Text>
            </View>
          </View>

          <View style={styles.tilesRow}>
            <StatTile
              icon="flash"
              label="Voltage"
              value={voltageV.toFixed(1)}
              suffix="V"
            />
            <StatTile
              icon="current-dc"
              label="Current"
              value={currentA.toFixed(1)}
              suffix="A"
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  batteryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
    marginTop: 1,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  tempMini: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },

  tempMiniText: {
    fontSize: 12,
    fontWeight: "800",
  },

  body: {
    marginTop: 14,
    gap: 12,
  },

  tempChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },

  tempIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  tempLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
  },

  tempValue: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 1,
  },

  tempBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  tempBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  tilesRow: {
    flexDirection: "row",
    gap: 12,
  },

  tile: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
  },

  tileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  tileLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    opacity: 0.85,
  },

  tileValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },

  tileValue: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  tileSuffix: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.85,
  },
});
