import React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { sharedUiCopy, type UserProfile } from "shared";
import { saveProfile } from "shared/redux";
import { useAppDispatch } from "shared/redux/hooks";
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

  const trimmedProfile = React.useMemo(
    () => ({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      condition: condition.trim(),
    }),
    [address, condition, email, name, phone],
  );

  const hasIncompleteRequiredFields = Object.values(trimmedProfile).some(
    (value) => value.length === 0,
  );

  const isUnchanged =
    profile != null &&
    trimmedProfile.name === profile.name.trim() &&
    trimmedProfile.email === profile.email.trim() &&
    trimmedProfile.phone === profile.phone.trim() &&
    trimmedProfile.address === profile.address.trim() &&
    trimmedProfile.condition === profile.condition.trim();

  const isSaveDisabled =
    status === "loading" ||
    saveStatus === "loading" ||
    profile == null ||
    hasIncompleteRequiredFields ||
    isUnchanged;

  if (!user) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{sharedUiCopy.profile.title}</Text>
          <Text style={styles.sectionCopy}>
            {sharedUiCopy.profile.unauthenticatedMessage}
          </Text>
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
        <Text style={styles.sectionTitle}>{sharedUiCopy.profile.title}</Text>
        <Text style={styles.sectionCopy}>
          {sharedUiCopy.profile.description}
        </Text>
        {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
        <InputField
          label={sharedUiCopy.profile.labels.name}
          value={name}
          onChangeText={setName}
          placeholder={sharedUiCopy.profile.placeholders.name}
          styles={styles}
        />
        <InputField
          label={sharedUiCopy.profile.labels.email}
          value={email}
          onChangeText={setEmail}
          placeholder={sharedUiCopy.profile.placeholders.email}
          styles={styles}
        />
        <InputField
          label={sharedUiCopy.profile.labels.phone}
          value={phone}
          onChangeText={setPhone}
          placeholder={sharedUiCopy.profile.placeholders.phone}
          styles={styles}
        />
        <InputField
          label={sharedUiCopy.profile.labels.address}
          value={address}
          onChangeText={setAddress}
          placeholder={sharedUiCopy.profile.placeholders.address}
          multiline
          styles={styles}
        />
        <InputField
          label={sharedUiCopy.profile.labels.condition}
          value={condition}
          onChangeText={setCondition}
          placeholder={sharedUiCopy.profile.placeholders.condition}
          styles={styles}
        />
        <PrimaryButton
          label={
            saveStatus === "loading"
              ? sharedUiCopy.profile.buttons.saving
              : sharedUiCopy.profile.buttons.save
          }
          disabled={isSaveDisabled}
          onPress={async () => {
            if (isSaveDisabled) {
              return;
            }

            await dispatch(
              saveProfile({
                userId: user.id,
                updates: trimmedProfile,
              }),
            ).unwrap();
            Alert.alert(
              sharedUiCopy.profile.messages.updatedTitle,
              sharedUiCopy.profile.messages.updatedBody,
            );
          }}
          styles={styles}
        />
      </View>
    </ScrollView>
  );
};
