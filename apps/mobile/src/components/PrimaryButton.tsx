import { Pressable, Text } from "react-native";
import type { SharedStyles } from "./types";

export const PrimaryButton = ({
  label,
  onPress,
  compact,
  disabled,
  styles,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
  disabled?: boolean;
  styles: SharedStyles;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.primaryButton,
      compact && styles.primaryButtonCompact,
      disabled && styles.primaryButtonDisabled,
    ]}
  >
    <Text style={styles.primaryButtonText}>{label}</Text>
  </Pressable>
);
