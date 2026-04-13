import React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import type { UserProfile } from "shared";
import { useAppDispatch } from "../redux/hooks";
import { saveProfile } from "../redux/profileSlice";
import type { SharedStyles } from "./types";
import { InputField, PrimaryButton } from "./ui";

export const ProfileScreenView = ({
  user,
  profile,
  status,
  saveStatus,
  styles,
}: {
  user: UserProfile | null;
  profile: UserProfile | null;
  status: string;
  saveStatus: string;
  styles: SharedStyles;
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [condition, setCondition] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
      setAddress(profile.address);
      setCondition(profile.condition);
    }
  }, [profile]);

  if (!user) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionCopy}>Login to manage your profile.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Patient profile</Text>
        <Text style={styles.sectionCopy}>
          Keep your contact details, address, and health condition current.
        </Text>
        {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
        <InputField
          label="Name"
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
        <InputField
          label="Condition"
          value={condition}
          onChangeText={setCondition}
          placeholder="Condition"
          styles={styles}
        />
        <PrimaryButton
          label={saveStatus === "loading" ? "Saving..." : "Save Profile"}
          onPress={async () => {
            await dispatch(
              saveProfile({
                userId: user.id,
                updates: { name, email, phone, address, condition },
              }),
            ).unwrap();
            Alert.alert("Profile updated", "Your profile has been saved.");
          }}
          styles={styles}
        />
      </View>
    </ScrollView>
  );
};
