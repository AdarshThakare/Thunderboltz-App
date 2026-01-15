import { Colors } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native"; // if using react-navigation
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";

// ---------- helpers ----------
const getOrientation = () => {
  const { width, height } = Dimensions.get("window");
  return width > height ? "landscape" : "portrait";
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const getBatteryColor = (p: number) => {
  if (p <= 15) return "#FF3B30";
  if (p <= 40) return "#FF9F0A";
  if (p <= 70) return "#FACC15";
  return "#22C55E";
};

// Mock data generator (replace with real live data)
const generateMockData = () => ({
  timestamp: new Date().toISOString(),
  speed_kmh: 15 + Math.random() * 45,
  battery: {
    soc_percent: Math.floor(Math.random() * 100),
    voltage_v: 48 + Math.random() * 6,
    current_a: Math.random() * 15,
    temperature_c: 20 + Math.random() * 20,
  },
  indicators: {
    left_turn: Math.random() > 0.85,
    right_turn: Math.random() > 0.85,
    headlight_high: Math.random() > 0.85,
    headlight_low: Math.random() > 0.6,
    smoke_detected: Math.random() > 0.97,
  },
  safety: {
    accident_alert: Math.random() > 0.985,
  },
  odometer_km: 3747.5 + Math.random() * 10,
});

// ---------- UI bits ----------
function StatRow({
  icon,
  label,
  value,
  colors,
  rightColor,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  colors: any;
  rightColor?: string;
}) {
  return (
    <View style={[styles.statRow, { backgroundColor: colors.surface }]}>
      <View style={styles.statLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
          <MaterialCommunityIcons name={icon} size={18} color={colors.icon} />
        </View>
        <Text style={[styles.statLabel, { color: colors.icon }]}>{label}</Text>
      </View>

      <Text style={[styles.statValue, { color: rightColor ?? colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

function BoolPill({
  label,
  value,
  colors,
}: {
  label: string;
  value: boolean;
  colors: any;
}) {
  const bg = value ? colors.tint + "22" : colors.background;
  const border = value ? colors.tint : colors.icon;

  return (
    <View
      style={[styles.boolPill, { backgroundColor: bg, borderColor: border }]}
    >
      <Text style={[styles.boolLabel, { color: colors.icon }]}>{label}</Text>
      <Text
        style={[styles.boolValue, { color: value ? colors.tint : colors.text }]}
      >
        {value ? "TRUE" : "FALSE"}
      </Text>
    </View>
  );
}

function BatteryBar({ percent, colors }: { percent: number; colors: any }) {
  const p = clamp(percent, 0, 100);
  const accent = getBatteryColor(p);

  return (
    <View style={[styles.batteryCard, { backgroundColor: colors.surface }]}>
      <View style={styles.batteryTop}>
        <Text style={[styles.cardTitle, { color: colors.icon }]}>
          Battery SOC
        </Text>
        <Text style={[styles.batteryPct, { color: colors.text }]}>{p}%</Text>
      </View>

      <View
        style={[styles.batteryTrack, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.batteryFill,
            {
              width: `${p}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

function MiniLineChart({
  title,
  data,
  colors,
}: {
  title: string;
  data: number[];
  colors: any;
}) {
  const width = 320;
  const height = 90;

  // ✅ remove invalid values
  const clean = data.filter((v) => Number.isFinite(v));

  // ✅ if no valid points, return safe UI
  if (clean.length < 2) {
    return (
      <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.icon }]}>{title}</Text>
        <Text style={{ marginTop: 10, color: colors.icon, opacity: 0.7 }}>
          No data yet
        </Text>
      </View>
    );
  }

  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;

  const points = clean
    .map((v, i) => {
      const x = (i / (clean.length - 1)) * (width - 10) + 5;
      const y = height - ((v - min) / range) * (height - 20) - 10;

      // ✅ force safe numbers
      const safeX = Number.isFinite(x) ? x : 0;
      const safeY = Number.isFinite(y) ? y : height / 2;

      return `${safeX},${safeY}`;
    })
    .join(" ");

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.icon }]}>{title}</Text>

      <View style={{ marginTop: 10 }}>
        <Svg width={width} height={height}>
          <Polyline
            points={points}
            fill="none"
            stroke={colors.tint}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.9}
          />
        </Svg>
      </View>
    </View>
  );
}

function AlertModal({
  visible,
  title,
  description,
  onClose,
  colors,
}: {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  colors: any;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          <View style={styles.modalTop}>
            <View style={styles.iconDanger}>
              <MaterialCommunityIcons name="alert" size={22} color="#FF3B30" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {title}
            </Text>
          </View>

          <Text style={[styles.modalDesc, { color: colors.icon }]}>
            {description}
          </Text>

          <View style={styles.modalActions}>
            <Pressable
              onPress={onClose}
              style={[styles.btn, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>
                Dismiss
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={[styles.btn, { backgroundColor: "#FF3B30" }]}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ---------- Screen ----------
export default function BikeDashboardScreen() {
  const navigation = useNavigation();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [orientation, setOrientation] = useState(getOrientation());
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  const [data, setData] = useState(generateMockData());

  // History for charts
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);
  const [socHistory, setSocHistory] = useState<number[]>([]);

  // Alerts
  const [smokeOpen, setSmokeOpen] = useState(false);
  const [accidentOpen, setAccidentOpen] = useState(false);

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
      setOrientation(getOrientation());
    });

    return () => {
      subscription?.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // mock update loop (replace with your real telemetry updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = generateMockData();
      setData(fresh);

      setSpeedHistory((prev) => [...prev.slice(-19), fresh.speed_kmh]);
      setSocHistory((prev) => [...prev.slice(-19), fresh.battery.soc_percent]);

      if (fresh.indicators.smoke_detected) setSmokeOpen(true);
      if (fresh.safety.accident_alert) setAccidentOpen(true);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const isLandscape = orientation === "landscape";

  const statsList = useMemo(
    () => [
      {
        id: "timestamp",
        label: "Timestamp",
        icon: "clock-outline",
        value: data.timestamp,
      },
      {
        id: "speed",
        label: "Speed",
        icon: "speedometer",
        value: `${data.speed_kmh.toFixed(1)} km/h`,
      },
      {
        id: "odometer",
        label: "Odometer",
        icon: "road-variant",
        value: `${data.odometer_km.toFixed(1)} km`,
      },

      {
        id: "voltage",
        label: "Voltage",
        icon: "flash",
        value: `${data.battery.voltage_v.toFixed(1)} V`,
      },
      {
        id: "current",
        label: "Current",
        icon: "current-dc",
        value: `${data.battery.current_a.toFixed(1)} A`,
      },
      {
        id: "temp",
        label: "Battery Temp",
        icon: "thermometer",
        value: `${data.battery.temperature_c.toFixed(1)} °C`,
      },
    ],
    [data]
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" hidden />

      {/* Header with Back */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={colors.text}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Dashboard
          </Text>
          <Text style={[styles.headerSub, { color: colors.icon }]}>
            Live Analysis & Stats
          </Text>
        </View>
      </View>

      {/* Portrait vs Landscape Layout */}
      {!isLandscape ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 30 }}
          ListHeaderComponent={
            <View style={{ gap: 14, paddingHorizontal: 16 }}>
              {/* Charts */}
              <MiniLineChart
                title="Speed Trend (km/h)"
                data={speedHistory.length ? speedHistory : [0, 0]}
                colors={colors}
              />
              <MiniLineChart
                title="Battery SOC Trend (%)"
                data={socHistory.length ? socHistory : [0, 0]}
                colors={colors}
              />

              {/* Battery Bar */}
              <BatteryBar percent={data.battery.soc_percent} colors={colors} />

              {/* Boolean indicators */}
              <View
                style={[
                  styles.sectionCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.cardTitle, { color: colors.icon }]}>
                  Indicators
                </Text>

                <View style={{ gap: 10, marginTop: 12 }}>
                  <BoolPill
                    label="Left Turn"
                    value={data.indicators.left_turn}
                    colors={colors}
                  />
                  <BoolPill
                    label="Right Turn"
                    value={data.indicators.right_turn}
                    colors={colors}
                  />
                  <BoolPill
                    label="Headlight High"
                    value={data.indicators.headlight_high}
                    colors={colors}
                  />
                  <BoolPill
                    label="Headlight Low"
                    value={data.indicators.headlight_low}
                    colors={colors}
                  />
                  <BoolPill
                    label="Smoke Detected"
                    value={data.indicators.smoke_detected}
                    colors={colors}
                  />
                  <BoolPill
                    label="Accident Alert"
                    value={data.safety.accident_alert}
                    colors={colors}
                  />
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.icon }]}>
                Metrics
              </Text>
            </View>
          }
          data={statsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
              <StatRow
                icon={item.icon as any}
                label={item.label}
                value={item.value}
                colors={colors}
              />
            </View>
          )}
        />
      ) : (
        // LANDSCAPE: 2-column layout
        <ScrollView>
          <View style={styles.landscapeWrap}>
            <View style={styles.leftCol}>
              <MiniLineChart
                title="Speed Trend (km/h)"
                data={speedHistory.length ? speedHistory : [0, 0]}
                colors={colors}
              />
              <MiniLineChart
                title="Battery SOC Trend (%)"
                data={socHistory.length ? socHistory : [0, 0]}
                colors={colors}
              />
              <BatteryBar percent={data.battery.soc_percent} colors={colors} />
            </View>

            <View style={styles.rightCol}>
              <View
                style={[
                  styles.sectionCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.cardTitle, { color: colors.icon }]}>
                  Indicators
                </Text>

                <View style={{ gap: 10, marginTop: 12 }}>
                  <BoolPill
                    label="Left Turn"
                    value={data.indicators.left_turn}
                    colors={colors}
                  />
                  <BoolPill
                    label="Right Turn"
                    value={data.indicators.right_turn}
                    colors={colors}
                  />
                  <BoolPill
                    label="Headlight High"
                    value={data.indicators.headlight_high}
                    colors={colors}
                  />
                  <BoolPill
                    label="Headlight Low"
                    value={data.indicators.headlight_low}
                    colors={colors}
                  />
                  <BoolPill
                    label="Smoke Detected"
                    value={data.indicators.smoke_detected}
                    colors={colors}
                  />
                  <BoolPill
                    label="Accident Alert"
                    value={data.safety.accident_alert}
                    colors={colors}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 12, gap: 10 }}>
            {statsList.map((item) => (
              <StatRow
                key={item.id}
                icon={item.icon as any}
                label={item.label}
                value={item.value}
                colors={colors}
              />
            ))}
          </View>
          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* Alerts */}
      <AlertModal
        visible={smokeOpen}
        title="Smoke Detected"
        description="Possible smoke or overheating detected near the battery/vehicle. Please stop safely and check immediately."
        onClose={() => setSmokeOpen(false)}
        colors={colors}
      />

      <AlertModal
        visible={accidentOpen}
        title="Accident Alert"
        description="Possible accident detected. If you are safe, dismiss this. Otherwise seek help immediately."
        onClose={() => setAccidentOpen(false)}
        colors={colors}
      />
    </View>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    paddingTop: 34,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  headerSub: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 6,
    marginBottom: 10,
  },

  statRow: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    opacity: 0.9,
  },

  statValue: {
    fontSize: 13,
    fontWeight: "900",
  },

  sectionCard: {
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  boolPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },

  boolLabel: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.85,
  },

  boolValue: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  batteryCard: {
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  batteryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  batteryPct: {
    fontSize: 14,
    fontWeight: "900",
  },

  batteryTrack: {
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 12,
  },

  batteryFill: {
    height: "100%",
    borderRadius: 999,
  },

  chartCard: {
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Landscape
  landscapeWrap: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 18,
    gap: 14,
  },

  leftCol: {
    flex: 1,
    gap: 12,
  },

  rightCol: {
    flex: 1,
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  modalCard: {
    width: "100%",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  modalTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  iconDanger: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B3022",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    opacity: 0.9,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontWeight: "800",
    fontSize: 13,
  },
});
