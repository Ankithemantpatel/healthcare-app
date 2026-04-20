import { Pressable, ScrollView, Text, View } from "react-native";
import type { SharedStyles } from "./types";
import { StatCard } from "../components";

export const DashboardScreenView = ({
  userName,
  doctorCount,
  appointmentsCount,
  pendingCount,
  nextAppointment,
  onOpenDoctors,
  onOpenAppointments,
  onOpenMedicines,
  onOpenProfile,
  styles,
}: {
  userName: string;
  doctorCount: number;
  appointmentsCount: number;
  pendingCount: number;
  nextAppointment: {
    doctor: string;
    date: string;
    time: string;
    type: string;
  } | null;
  onOpenDoctors: () => void;
  onOpenAppointments: () => void;
  onOpenMedicines: () => void;
  onOpenProfile: () => void;
  styles: SharedStyles;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
  >
    <View style={styles.heroCard}>
      <Text style={styles.heroEyebrow}>Dashboard</Text>
      <Text style={styles.heroTitle}>Welcome back, {userName}</Text>
      <Text style={styles.heroCopy}>
        Track appointments, specialists, and your current care activity in one
        place.
      </Text>
    </View>

    <View style={styles.statsGrid}>
      <StatCard
        label="Specialists"
        value={`${doctorCount}`}
        caption="Available now"
        styles={styles}
      />
      <StatCard
        label="Appointments"
        value={`${appointmentsCount}`}
        caption={`${pendingCount} pending`}
        styles={styles}
      />
    </View>

    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Services</Text>
      <Text style={styles.sectionCopy}>
        Quick shortcuts to core services available in the app.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.serviceCarousel}
      >
        <Pressable
          style={[styles.serviceCard, styles.serviceCardDoctors]}
          onPress={onOpenDoctors}
        >
          <Text style={styles.serviceTitle}>Find Doctors</Text>
          <Text style={styles.serviceCopy}>
            Browse specialists and availability.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardAppointments]}
          onPress={onOpenAppointments}
        >
          <Text style={styles.serviceTitle}>Book Visits</Text>
          <Text style={styles.serviceCopy}>
            Schedule consultations and follow-ups.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardMedicines]}
          onPress={onOpenMedicines}
        >
          <Text style={styles.serviceTitle}>Order Medicines</Text>
          <Text style={styles.serviceCopy}>
            Search catalog and checkout quickly.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardProfile]}
          onPress={onOpenProfile}
        >
          <Text style={styles.serviceTitle}>Profile</Text>
          <Text style={styles.serviceCopy}>
            Keep contact details and address updated.
          </Text>
        </Pressable>
      </ScrollView>
    </View>

    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Next visit</Text>
      {nextAppointment ? (
        <>
          <Text style={styles.sectionHeadline}>{nextAppointment.doctor}</Text>
          <Text style={styles.sectionCopy}>
            {nextAppointment.type} on {nextAppointment.date} at{" "}
            {nextAppointment.time}
          </Text>
        </>
      ) : (
        <Text style={styles.sectionCopy}>No upcoming appointment yet.</Text>
      )}
    </View>
  </ScrollView>
);
