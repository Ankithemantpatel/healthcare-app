import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { SharedStyles } from "./types";

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  styles,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  styles: SharedStyles;
}) => (
  <View style={styles.inputBlock}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#7c8aa5"
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      style={[styles.textInput, multiline && styles.textArea]}
    />
  </View>
);

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

export const Pill = ({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: SharedStyles;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillText, active && styles.pillTextActive]}>
      {label}
    </Text>
  </Pressable>
);

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
