import { Text, View } from "react-native";
import type { SharedStyles } from "./types";

export const SummaryRow = ({
  label,
  value,
  strong,
  styles,
}: {
  label: string;
  value: string;
  strong?: boolean;
  styles: SharedStyles;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, strong && styles.summaryLabelStrong]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, strong && styles.summaryValueStrong]}>
      {value}
    </Text>
  </View>
);
