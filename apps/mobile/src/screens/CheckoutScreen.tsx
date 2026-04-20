import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import type { CartItem } from "shared";
import {
  addToCart,
  clearCart,
  decrementCartItem,
  placeOrder,
  removeFromCart,
} from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";
import type { SharedStyles } from "./types";
import { PrimaryButton, SummaryRow } from "../components";

export const CheckoutScreenView = ({
  userId,
  cart,
  totalItems,
  totalAmount,
  onBack,
  onOrderPlaced,
  styles,
}: {
  userId: string | null;
  cart: CartItem[];
  totalItems: number;
  totalAmount: number;
  onBack: () => void;
  onOrderPlaced: () => void;
  styles: SharedStyles;
}) => {
  const dispatch = useAppDispatch();
  const placeStatus = useAppSelector((state) => state.orders.placeStatus);
  const delivery = totalAmount > 49 ? 0 : totalAmount > 0 ? 4.99 : 0;
  const grandTotal = totalAmount + delivery;

  const handlePlaceOrder = async () => {
    if (!userId) {
      Alert.alert("Login required", "Please login to place medicine orders.");
      return;
    }
    if (cart.length === 0) {
      return;
    }
    await dispatch(
      placeOrder({ userId, items: cart, totalAmount: grandTotal }),
    ).unwrap();
    dispatch(clearCart());
    Alert.alert(
      "Order placed",
      "Your medicine order has been placed successfully.",
    );
    onOrderPlaced();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panelHeaderInline}>
        <View>
          <Text style={styles.sectionTitle}>Medicine checkout</Text>
          <Text style={styles.sectionCopy}>
            Review items before placing the order.
          </Text>
        </View>
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Cart items ({totalItems})</Text>
          <Pressable onPress={() => dispatch(clearCart())}>
            <Text style={styles.linkText}>Clear Cart</Text>
          </Pressable>
        </View>

        {cart.length === 0 ? (
          <Text style={styles.sectionCopy}>Your cart is empty.</Text>
        ) : (
          cart.map((item) => (
            <View key={item.medicine.id} style={styles.checkoutItem}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionHeadline}>
                    {item.medicine.name}
                  </Text>
                  <Text style={styles.sectionCopy}>
                    {item.medicine.brand} • {item.medicine.packSize}
                  </Text>
                </View>
                <Text style={styles.medicinePrice}>
                  ${item.medicine.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <View style={styles.stepperWrapCompact}>
                  <Pressable
                    onPress={() =>
                      dispatch(decrementCartItem(item.medicine.id))
                    }
                    style={[
                      styles.stepperButtonSmall,
                      styles.stepperButtonDark,
                    ]}
                  >
                    <Text style={styles.stepperSmallSymbol}>-</Text>
                  </Pressable>
                  <View style={styles.stepperCountWrapSmall}>
                    <Text style={styles.stepperCountSmall}>
                      {item.quantity}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => dispatch(addToCart(item.medicine))}
                    style={[
                      styles.stepperButtonSmall,
                      styles.stepperButtonAccent,
                    ]}
                  >
                    <Text style={styles.stepperSmallSymbolDark}>+</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => dispatch(removeFromCart(item.medicine.id))}
                >
                  <Text style={styles.linkText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Order summary</Text>
        <SummaryRow
          label="Subtotal"
          value={`$${totalAmount.toFixed(2)}`}
          styles={styles}
        />
        <SummaryRow
          label="Delivery"
          value={delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
          styles={styles}
        />
        <SummaryRow
          label="Total"
          value={`$${grandTotal.toFixed(2)}`}
          strong
          styles={styles}
        />
        <PrimaryButton
          label={
            placeStatus === "loading"
              ? "Placing Order..."
              : cart.length === 0
                ? "Add items to continue"
                : "Place Medicine Order"
          }
          disabled={cart.length === 0}
          onPress={handlePlaceOrder}
          styles={styles}
        />
      </View>
    </ScrollView>
  );
};
