import { Platform } from "react-native";

/**
 * App color palette
 */
const tintColorLight = "#0A7EA4";
const tintColorDark = "#FFFFFF";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffffe5",
    surface: "#F2F4F7",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#0B0E11", // dashboard-friendly dark
    surface: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

/**
 * Font system
 * MUST match useFonts() keys exactly
 */
export const Fonts = Platform.select({
  ios: {
    sans: "sup",
    regular: "sup-regular",
    medium: "sup-semibold",
    bold: "sup-bold",
    mono: "mono",
  },
  android: {
    sans: "sup",
    regular: "sup-regular",
    medium: "sup-semibold",
    bold: "sup-bold",
    mono: "mono",
  },
  web: {
    // use loaded font first, then fallbacks
    sans: "sup, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    regular: "sup-regular",
    medium: "sup-semibold",
    bold: "sup-bold",
    mono: "mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  default: {
    sans: "sup",
    regular: "sup-regular",
    medium: "sup-semibold",
    bold: "sup-bold",
    mono: "mono",
  },
});
