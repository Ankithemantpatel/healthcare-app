import { Text, TextInput, View } from "react-native";
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
