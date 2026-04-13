import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppDispatch } from "../redux/hooks";
import { loginUser, registerUser } from "../redux/authSlice";
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
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("admin123");
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
        <Text style={styles.heroEyebrow}>Unified care, wherever you are</Text>
        <Text style={styles.heroTitle}>
          CareBridge mobile carries the full web experience.
        </Text>
        <Text style={styles.heroCopy}>
          Sign in to book visits, browse doctors, manage your medicines, and
          keep your profile synced.
        </Text>
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
              Login
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
              Register
            </Text>
          </Pressable>
        </View>

        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          styles={styles}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          styles={styles}
        />

        {mode === "register" ? (
          <>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              styles={styles}
            />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              styles={styles}
            />
            <InputField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              styles={styles}
            />
            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Street, city, state"
              multiline
              styles={styles}
            />
          </>
        ) : null}

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <PrimaryButton
          label={
            authStatus === "loading"
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"
          }
          onPress={handleSubmit}
          styles={styles}
        />

        <View style={styles.quickAccessRow}>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername("admin");
              setPassword("admin123");
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Use admin demo</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername("patient1");
              setPassword("patient123");
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Use patient demo</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};
