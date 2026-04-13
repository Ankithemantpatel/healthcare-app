import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import type { Doctor } from "shared";
import { useAppDispatch } from "../redux/hooks";
import { createAppointment } from "../redux/appointmentsSlice";
import type { SharedStyles } from "./types";
import { InputField, Pill, PrimaryButton } from "./ui";

export const AppointmentsScreenView = ({
  doctors,
  userId,
  appointments,
  createStatus,
  prefilledDoctor,
  onRequireAuth,
  styles,
}: {
  doctors: Doctor[];
  userId: string | null;
  appointments: Array<{
    id: string;
    doctor: string;
    date: string;
    time: string;
    type: string;
    reason: string;
    status: string;
  }>;
  createStatus: string;
  prefilledDoctor: string;
  onRequireAuth: () => void;
  styles: SharedStyles;
}) => {
  const dispatch = useAppDispatch();
  const [doctor, setDoctor] = React.useState(prefilledDoctor);
  const [type, setType] = React.useState("Consultation");
  const [date, setDate] = React.useState("2026-04-25");
  const [time, setTime] = React.useState("11:00");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (prefilledDoctor) {
      setDoctor(prefilledDoctor);
    }
  }, [prefilledDoctor]);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert(
        "Login required",
        "Please login to confirm your appointment.",
      );
      onRequireAuth();
      return;
    }
    if (!(doctor && date && time && reason)) {
      Alert.alert("Missing details", "Complete all appointment details first.");
      return;
    }

    await dispatch(
      createAppointment({ userId, doctor, date, time, type, reason }),
    ).unwrap();
    setReason("");
    Alert.alert(
      "Appointment created",
      "Your appointment request has been saved.",
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Book appointment</Text>
        <Text style={styles.sectionCopy}>
          You can browse as guest, but login is required to confirm the booking.
        </Text>

        <Text style={styles.fieldLabel}>Select doctor</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {doctors.map((item) => (
            <Pill
              key={item.id}
              label={item.name}
              active={doctor === item.name}
              onPress={() => setDoctor(item.name)}
              styles={styles}
            />
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Appointment type</Text>
        <View style={styles.inlineRow}>
          {["Consultation", "Follow-up", "Routine Check"].map((item) => (
            <Pill
              key={item}
              label={item}
              active={type === item}
              onPress={() => setType(item)}
              styles={styles}
            />
          ))}
        </View>

        <InputField
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          styles={styles}
        />
        <InputField
          label="Time"
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM"
          styles={styles}
        />
        <InputField
          label="Reason"
          value={reason}
          onChangeText={setReason}
          placeholder="Describe symptoms or consultation purpose"
          multiline
          styles={styles}
        />

        <PrimaryButton
          label={
            createStatus === "loading"
              ? "Submitting..."
              : userId
                ? "Confirm Appointment"
                : "Login to Confirm"
          }
          onPress={handleSubmit}
          styles={styles}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>My appointments</Text>
        {appointments.length === 0 ? (
          <Text style={styles.sectionCopy}>No appointments yet.</Text>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.sectionHeadline}>{appointment.doctor}</Text>
              <Text style={styles.sectionCopy}>
                {appointment.type} on {appointment.date} at {appointment.time}
              </Text>
              <Text style={styles.sectionCopy}>
                Reason: {appointment.reason}
              </Text>
              <Text style={styles.statusBadge}>{appointment.status}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};
