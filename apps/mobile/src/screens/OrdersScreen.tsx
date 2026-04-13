import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import type { MedicineOrder } from "shared";
import type { SharedStyles } from "./types";

export const OrdersScreenView = ({
  orders,
  status,
  styles,
}: {
  orders: MedicineOrder[];
  status: string;
  styles: SharedStyles;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
  >
    <View style={styles.panelHeader}>
      <Text style={styles.sectionTitle}>Orders</Text>
      <Text style={styles.sectionCopy}>
        Track your medicine orders and delivery status.
      </Text>
    </View>
    {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
    {orders.length === 0 && status !== "loading" ? (
      <View style={styles.panel}>
        <Text style={styles.sectionCopy}>No medicine orders yet.</Text>
      </View>
    ) : null}
    {orders.map((order) => (
      <View key={order.id} style={styles.panel}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionHeadline}>Order #{order.id}</Text>
          <Text style={styles.statusBadge}>{order.status}</Text>
        </View>
        <Text style={styles.sectionCopy}>
          Placed: {new Date(order.placedAt).toLocaleString()}
        </Text>
        <Text style={styles.sectionCopy}>ETA: {order.eta}</Text>
        <Text style={styles.fieldLabel}>Items</Text>
        {order.items.map((item) => (
          <Text
            key={`${order.id}-${item.medicine.id}`}
            style={styles.sectionCopy}
          >
            • {item.medicine.name} x {item.quantity}
          </Text>
        ))}
        <Text style={styles.sectionHeadline}>
          Total: ${order.totalAmount.toFixed(2)}
        </Text>
      </View>
    ))}
  </ScrollView>
);
