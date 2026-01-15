import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

type Props = {
  socPercent: number; // 0 to 100
  bars?: number; // number of bars inside battery
};

const clamp = (v: number) => Math.max(0, Math.min(100, v));

const getBatteryColor = (p: number) => {
  if (p <= 15) return "#FF3B30";
  if (p <= 40) return "#FF9F0A";
  if (p <= 70) return "#FACC15";
  return "#22C55E";
};

export default function BatteryPercentage({ socPercent, bars = 5 }: Props) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const pct = clamp(socPercent);
  const accent = getBatteryColor(pct);

  // how many bars should be ON
  const activeBars = Math.round((pct / 100) * bars);

  return (
    <View style={[styles.container]}>
      {/* Battery Icon */}
      <View style={styles.row}>
        <View style={styles.batteryWrap}>
          {/* battery body */}
          <View
            style={[
              styles.batteryBody,
              { borderColor: colors.icon, backgroundColor: colors.background },
            ]}
          >
            <View style={styles.barsRow}>
              {Array.from({ length: bars }).map((_, i) => {
                const on = i < activeBars;
                return (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      {
                        backgroundColor: on ? accent : "transparent",
                        opacity: on ? 1 : 0.25,
                        borderColor: colors.icon,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* battery tip */}
          <View
            style={[
              styles.batteryTip,
              { backgroundColor: colors.icon, opacity: 0.6 },
            ]}
          />
        </View>

        {/* Percentage */}
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.percent, { color: colors.text }]}>{pct}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 14,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    alignSelf: "flex-start",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  batteryWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  batteryBody: {
    width: 60,
    height: 24,
    borderRadius: 10,
    borderWidth: 1.2,
    padding: 4,
    justifyContent: "center",
  },

  barsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },

  bar: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    borderWidth: 0.2,
  },

  batteryTip: {
    width: 6,
    height: 14,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: 4,
  },

  percent: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});
