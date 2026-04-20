import { Text, View } from "react-native";
import type { SharedStyles } from "./types";

export const StatCard = ({
  label,
  value,
  caption,
  styles,
}: {
  label: string;
  value: string;
  caption: string;
  styles: SharedStyles;
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statCaption}>{caption}</Text>
  </View>
);
