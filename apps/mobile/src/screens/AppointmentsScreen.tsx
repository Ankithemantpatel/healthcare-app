import { useCallback, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { Doctor } from "shared";
import { createAppointment } from "shared/redux";
import { useAppDispatch } from "shared/redux/hooks";
import type { SharedStyles } from "./types";
import { InputField, Pill, PrimaryButton } from "../components";

const createInitialAppointmentDate = () => {
  const value = new Date();
  value.setDate(value.getDate() + 1);
  value.setHours(11, 0, 0, 0);
  return value;
};

const formatAppointmentDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatAppointmentTime = (value: Date) => {
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatAppointmentDateLabel = (value: Date) =>
  value.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatAppointmentTimeLabel = (value: Date) =>
  value.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const showAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

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
  const [doctor, setDoctor] = useState(prefilledDoctor);
  const [type, setType] = useState("Consultation");
  const [appointmentDateTime, setAppointmentDateTime] = useState(
    createInitialAppointmentDate,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (prefilledDoctor) {
      setDoctor(prefilledDoctor);
    }
  }, [prefilledDoctor]);

  const closePickers = useCallback(() => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, []);

  const togglePicker = useCallback((target: "date" | "time") => {
    if (target === "date") {
      setShowTimePicker(false);
      setShowDatePicker((current) => !current);
      return;
    }

    setShowDatePicker(false);
    setShowTimePicker((current) => !current);
  }, []);

  const pickerMode = showDatePicker ? "date" : showTimePicker ? "time" : null;

  const validateInput = () => {
    if (!userId) {
      showAlert("Login required", "Please login to confirm your appointment.");
      onRequireAuth();
      return false;
    }

    if (!doctor) {
      showAlert("Missing details", "Please select a doctor.");
      return false;
    }

    if (!reason.trim()) {
      showAlert(
        "Missing details",
        "Please provide a reason for the appointment.",
      );
      return false;
    }

    if (reason.trim().length < 10) {
      showAlert(
        "Invalid reason",
        "Reason must be at least 10 characters long.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (createStatus === "loading") {
      return;
    }

    if (!validateInput()) {
      return;
    }

    const appointmentPayload = {
      userId,
      doctor,
      date: formatAppointmentDate(appointmentDateTime),
      time: formatAppointmentTime(appointmentDateTime),
      type,
      reason: reason.trim(),
    };

    try {
      console.log("Submitting appointment:", appointmentPayload);

      const result = await dispatch(
        createAppointment(appointmentPayload),
      ).unwrap();

      console.log("Appointment created successfully:", result);

      setReason("");
      showAlert(
        "Appointment created",
        "Your appointment request has been saved.",
      );
    } catch (error) {
      showAlert(
        "Error",
        "Failed to create appointment. Please try again later.",
      );
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
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

        <View style={styles.inputBlock}>
          <Text style={styles.fieldLabel}>Date</Text>
          <Pressable
            onPress={() => togglePicker("date")}
            style={styles.pickerTrigger}
          >
            <Text style={styles.pickerTriggerValue}>
              {formatAppointmentDateLabel(appointmentDateTime)}
            </Text>
            <Text style={styles.pickerTriggerMeta}>Tap to change</Text>
          </Pressable>
          {showDatePicker && Platform.OS === "android" ? (
            <View style={styles.pickerSurface}>
              <DateTimePicker
                value={appointmentDateTime}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(_, selectedValue) => {
                  setShowDatePicker(false);

                  if (!selectedValue) {
                    return;
                  }

                  setAppointmentDateTime((current) => {
                    const next = new Date(current);
                    next.setFullYear(
                      selectedValue.getFullYear(),
                      selectedValue.getMonth(),
                      selectedValue.getDate(),
                    );
                    return next;
                  });
                }}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.fieldLabel}>Time</Text>
          <Pressable
            onPress={() => togglePicker("time")}
            style={styles.pickerTrigger}
          >
            <Text style={styles.pickerTriggerValue}>
              {formatAppointmentTimeLabel(appointmentDateTime)}
            </Text>
            <Text style={styles.pickerTriggerMeta}>Tap to change</Text>
          </Pressable>
          {showTimePicker && Platform.OS === "android" ? (
            <View style={styles.pickerSurface}>
              <DateTimePicker
                value={appointmentDateTime}
                mode="time"
                display="default"
                onChange={(_, selectedValue) => {
                  setShowTimePicker(false);

                  if (!selectedValue) {
                    return;
                  }

                  setAppointmentDateTime((current) => {
                    const next = new Date(current);
                    next.setHours(
                      selectedValue.getHours(),
                      selectedValue.getMinutes(),
                      0,
                      0,
                    );
                    return next;
                  });
                }}
              />
            </View>
          ) : null}
        </View>
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

      {Platform.OS === "ios" && pickerMode ? (
        <Modal
          transparent
          animationType="fade"
          visible
          onRequestClose={closePickers}
        >
          <Pressable style={styles.pickerBackdrop} onPress={closePickers}>
            <Pressable
              style={styles.pickerModalCard}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>
                  {pickerMode === "date" ? "Select date" : "Select time"}
                </Text>
                <Pressable onPress={closePickers}>
                  <Text style={styles.pickerModalDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={appointmentDateTime}
                mode={pickerMode}
                display="spinner"
                minimumDate={pickerMode === "date" ? new Date() : undefined}
                textColor="#0f172a"
                themeVariant="light"
                style={styles.pickerControl}
                onChange={(_, selectedValue) => {
                  if (!selectedValue) {
                    return;
                  }

                  setAppointmentDateTime((current) => {
                    const next = new Date(current);

                    if (pickerMode === "date") {
                      next.setFullYear(
                        selectedValue.getFullYear(),
                        selectedValue.getMonth(),
                        selectedValue.getDate(),
                      );
                      return next;
                    }

                    next.setHours(
                      selectedValue.getHours(),
                      selectedValue.getMinutes(),
                      0,
                      0,
                    );
                    return next;
                  });
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </ScrollView>
  );
};
