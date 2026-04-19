import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { sharedUiCopy as CONSTANTS } from "shared";
import { loginUser, registerUser } from "shared/redux";
import { useAppDispatch } from "shared/redux/hooks";
import type { SharedStyles } from "./types";
import { InputField, PrimaryButton } from "./ui";

export const LoginScreenView = ({
  authStatus,
  authError,
  onLoggedIn,
  styles,
}: {
  authStatus: string;
  authError: string | null;
  onLoggedIn: () => void;
  styles: SharedStyles;
}) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [username, setUsername] = React.useState(
    CONSTANTS.auth.demoAccounts.patient.username,
  );
  const [password, setPassword] = React.useState(
    CONSTANTS.auth.demoAccounts.patient.password,
  );
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await dispatch(loginUser({ username, password })).unwrap();
      } else {
        await dispatch(
          registerUser({ username, password, name, email, phone, address }),
        ).unwrap();
      }
      onLoggedIn();
    } catch {
      // slice already stores error
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>{CONSTANTS.auth.heroEyebrow}</Text>
        <Text style={styles.heroTitle}>{CONSTANTS.auth.heroTitle}</Text>
        <Text style={styles.heroCopy}>{CONSTANTS.auth.heroDescription}</Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.segmentRow}>
          <Pressable
            onPress={() => setMode("login")}
            style={[
              styles.segmentButton,
              mode === "login" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentButtonText,
                mode === "login" && styles.segmentButtonTextActive,
              ]}
            >
              {CONSTANTS.auth.tabs.login}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("register")}
            style={[
              styles.segmentButton,
              mode === "register" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentButtonText,
                mode === "register" && styles.segmentButtonTextActive,
              ]}
            >
              {CONSTANTS.auth.tabs.register}
            </Text>
          </Pressable>
        </View>

        <InputField
          label={CONSTANTS.auth.labels.username}
          value={username}
          onChangeText={setUsername}
          placeholder={CONSTANTS.auth.placeholders.username}
          styles={styles}
        />
        <InputField
          label={CONSTANTS.auth.labels.password}
          value={password}
          onChangeText={setPassword}
          placeholder={CONSTANTS.auth.placeholders.password}
          secureTextEntry
          styles={styles}
        />

        {mode === "register" ? (
          <>
            <InputField
              label={CONSTANTS.auth.labels.fullName}
              value={name}
              onChangeText={setName}
              placeholder={CONSTANTS.auth.placeholders.fullName}
              styles={styles}
            />
            <InputField
              label={CONSTANTS.auth.labels.email}
              value={email}
              onChangeText={setEmail}
              placeholder={CONSTANTS.auth.placeholders.email}
              styles={styles}
            />
            <InputField
              label={CONSTANTS.auth.labels.phone}
              value={phone}
              onChangeText={setPhone}
              placeholder={CONSTANTS.auth.placeholders.phone}
              styles={styles}
            />
            <InputField
              label={CONSTANTS.auth.labels.address}
              value={address}
              onChangeText={setAddress}
              placeholder={CONSTANTS.auth.placeholders.address}
              multiline
              styles={styles}
            />
          </>
        ) : null}

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <PrimaryButton
          label={
            authStatus === "loading"
              ? CONSTANTS.auth.buttons.loading
              : mode === "login"
                ? CONSTANTS.auth.buttons.login
                : CONSTANTS.auth.buttons.createAccount
          }
          onPress={handleSubmit}
          styles={styles}
        />

        <View style={styles.quickAccessRow}>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername(CONSTANTS.auth.demoAccounts.admin.username);
              setPassword(CONSTANTS.auth.demoAccounts.admin.password);
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              {CONSTANTS.auth.buttons.useAdminDemo}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername(CONSTANTS.auth.demoAccounts.patient.username);
              setPassword(CONSTANTS.auth.demoAccounts.patient.password);
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              {CONSTANTS.auth.buttons.usePatientDemo}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};
