import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import type { Doctor } from "shared";
import type { SharedStyles } from "./types";
import { PrimaryButton } from "./ui";

export const DoctorsScreenView = ({
  doctors,
  status,
  onBook,
  styles,
}: {
  doctors: Doctor[];
  status: string;
  onBook: (doctorName: string) => void;
  styles: SharedStyles;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
  >
    <View style={styles.panelHeader}>
      <Text style={styles.sectionTitle}>Doctors</Text>
      <Text style={styles.sectionCopy}>
        Browse the same specialist directory available on the web app.
      </Text>
    </View>
    {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
    {doctors.map((doctor) => (
      <View key={doctor.id} style={styles.doctorCard}>
        <Image source={{ uri: doctor.image }} style={styles.doctorAvatar} />
        <View style={styles.doctorBody}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorMeta}>
            {doctor.specialty} • {doctor.hospital}
          </Text>
          <Text style={styles.doctorMeta}>
            Fee ${doctor.consultationFee} • {doctor.experienceYears} yrs •{" "}
            {doctor.rating}/5
          </Text>
          <Text style={styles.doctorMeta}>
            Availability: {doctor.availability}
          </Text>
          <PrimaryButton
            label="Book Appointment"
            onPress={() => onBook(doctor.name)}
            compact
            styles={styles}
          />
        </View>
      </View>
    ))}
  </ScrollView>
);
