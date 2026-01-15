import { Canvas, PaintStyle, Path, Skia } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const height = 100;
const radius = 45;

const Arc = () => {
  // Create the curved path
  const path = Skia.Path.Make();
  path.moveTo(0, height);
  path.lineTo(0, radius);
  path.quadTo(width / 2, -radius, width, radius);
  path.moveTo(width, height);
  path.close();

  // Create gradient shader (gray -> white -> gray)
  const gradientShader = Skia.Shader.MakeLinearGradient(
    { x: 0, y: 0 },
    { x: width, y: 0 },
    [Skia.Color("black"), Skia.Color("white"), Skia.Color("black")],
    [0, 0.5, 1],
    0
  );

  // Create paint object
  const paint = Skia.Paint();
  paint.setShader(gradientShader);
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeWidth(0.5);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Path path={path} paint={paint} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    bottom: 12,
    left: 5,
    right: 20,
    zIndex: 100, // Ensure it's on top

    height: height,
  },
});

export default Arc;
