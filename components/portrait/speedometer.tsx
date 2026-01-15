import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, {
  Defs,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  G,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
  Text,
} from "react-native-svg";

const P_Speedometer = ({ speed }: { speed: number }) => {
  return (
    <>
      {/* P_Speedometer */}
      <View style={styles.P_speedometerContainer}>
        <Svg width={300} height={200} viewBox={"0 0 340 200"}>
          <Defs>
            {/* Multi-color gradient for arc */}
            <SvgLinearGradient
              id="speedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <Stop offset="30%" stopColor="#eab308" stopOpacity="1" />
              <Stop offset="80%" stopColor="#ef4444" stopOpacity="1" />
            </SvgLinearGradient>
            {/* Glow filter */}
            <FeGaussianBlur stdDeviation="4" result="coloredBlur" />
            <FeMerge>
              <FeMergeNode in="coloredBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Defs>

          {/* Background arc track */}
          <Path
            d={"M 40 160 A 130 130 0 0 1 300 160"}
            fill="none"
            stroke="rgba(30, 41, 59, 0.5)"
            strokeWidth={"18"}
            strokeLinecap="round"
          />

          {/* Speed indicator arc with gradient */}
          <Path
            d={"M 40 160 A 130 130 0 0 1 300 160"}
            fill="none"
            stroke="url(#speedGradient)"
            strokeWidth={"18"}
            strokeLinecap="round"
            strokeDasharray={"408"}
            strokeDashoffset={408 - (408 * 50) / 100}
            filter="url(#glow)"
          />

          {/* Tick marks */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map(
            (tick, index) => {
              const angle = -180 + 180 * (tick / 200);
              const radian = (angle * Math.PI) / 180;
              const radius = 130;
              const centerX = 170;
              const centerY = 160;
              const x1 = centerX + radius * Math.cos(radian);
              const y1 = centerY + radius * Math.sin(radian);
              const x2 = centerX + (radius - 12) * Math.cos(radian);
              const y2 = centerY + (radius - 12) * Math.sin(radian);

              return (
                <G key={tick}>
                  <Path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke="rgba(148, 163, 184, 0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </G>
              );
            }
          )}

          {/* Speed labels */}
          {
            <G>
              <Text
                x="50"
                y="175"
                fill="#64748b"
                fontSize="14"
                fontWeight="600"
              >
                0
              </Text>
              <Text x="85" y="95" fill="#64748b" fontSize="14" fontWeight="600">
                20
              </Text>
              <Text
                x="165"
                y="55"
                fill="#64748b"
                fontSize="14"
                fontWeight="600"
              >
                40
              </Text>
              <Text
                x="245"
                y="95"
                fill="#64748b"
                fontSize="14"
                fontWeight="600"
              >
                60
              </Text>
              <Text
                x="278"
                y="175"
                fill="#64748b"
                fontSize="14"
                fontWeight="600"
              >
                80
              </Text>
            </G>
          }
        </Svg>

        {/* Speed value overlay */}
        <View style={styles.speedValueContainer}>
          <Animated.View>
            <ThemedText style={[styles.heroSpeed]}>{speed}</ThemedText>
          </Animated.View>
          <ThemedText style={[styles.heroUnit]}>km/h</ThemedText>
        </View>
      </View>
    </>
  );
};

export default P_Speedometer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e1a",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  scrollContentLandscape: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 40,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  indicatorsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroSectionLandscape: {
    marginBottom: 0,
    marginRight: 40,
  },
  P_speedometerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  speedValueContainer: {
    position: "absolute",
    top: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSpeed: {
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 56,
    textShadowColor: "rgba(59, 130, 246, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  heroSpeedLandscape: {
    fontSize: 56,
    lineHeight: 56,
  },
  heroUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#788aa4",
    letterSpacing: 2,
    marginTop: 4,
  },
  heroUnitLandscape: {
    fontSize: 14,
    marginTop: 2,
  },
  arcContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  bikeSection: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  bikeSectionLandscape: {
    marginBottom: 0,
    marginRight: 40,
  },
  bikeGlowEffect: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    top: "30%",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statsGridLandscape: {
    flexDirection: "column",
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  statCardHighlight: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f1f5f9",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  detailsSection: {
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  detailLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
