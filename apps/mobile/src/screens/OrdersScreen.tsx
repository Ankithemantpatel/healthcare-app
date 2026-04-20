import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { sharedUiCopy as CONSTANTS, type MedicineOrder } from "shared";
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
      <Text style={styles.sectionTitle}>{CONSTANTS.orders.title}</Text>
      <Text style={styles.sectionCopy}>{CONSTANTS.orders.description}</Text>
    </View>
    {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
    {orders.length === 0 && status !== "loading" ? (
      <View style={styles.panel}>
        <Text style={styles.sectionCopy}>{CONSTANTS.orders.empty}</Text>
      </View>
    ) : null}
    {orders.map((order) => (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderCopy}>
            <Text style={styles.orderEyebrow}>
              {CONSTANTS.orders.orderPrefix}
              {order.id}
            </Text>
            <Text style={styles.orderTitle}>{order.status}</Text>
            <Text style={styles.sectionCopy}>
              {CONSTANTS.orders.placedLabel}:{" "}
              {new Date(order.placedAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.orderEtaBadge}>
            <Text style={styles.orderEtaBadgeText}>
              {CONSTANTS.orders.etaLabel}: {order.eta}
            </Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.orderItemsCard}>
            <Text style={styles.fieldLabel}>{CONSTANTS.orders.itemsLabel}</Text>
            {order.items.map((item) => (
              <View
                key={`${order.id}-${item.medicine.id}`}
                style={styles.orderItemRow}
              >
                <Text style={styles.orderItemText}>{item.medicine.name}</Text>
                <Text style={styles.orderItemQuantity}>x {item.quantity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.orderSummaryCard}>
            <Text style={styles.fieldLabel}>
              {CONSTANTS.orders.summaryLabel}
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {CONSTANTS.orders.itemsLabel}
              </Text>
              <Text style={styles.summaryValue}>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.summaryLabelStrong]}>
                {CONSTANTS.orders.totalLabel}
              </Text>
              <Text style={[styles.summaryValue, styles.summaryValueStrong]}>
                ${order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    ))}
  </ScrollView>
);
