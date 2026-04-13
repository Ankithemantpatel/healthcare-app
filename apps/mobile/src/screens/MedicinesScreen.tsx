import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Medicine, MedicineSortOption } from "shared";
import { useAppDispatch } from "../redux/hooks";
import { addToCart, decrementCartItem } from "../redux/medicinesSlice";
import type { SharedStyles } from "./types";
import { Pill, PrimaryButton } from "./ui";

export const MedicinesScreenView = ({
  medicines,
  allMedicines,
  status,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  cartQuantityById,
  totalCartItems,
  totalCartAmount,
  onCheckout,
  styles,
}: {
  medicines: Medicine[];
  allMedicines: Medicine[];
  status: string;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: MedicineSortOption;
  setSortBy: (value: MedicineSortOption) => void;
  cartQuantityById: Record<string, number>;
  totalCartItems: number;
  totalCartAmount: number;
  onCheckout: () => void;
  styles: SharedStyles;
}) => {
  const dispatch = useAppDispatch();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Online Pharmacy</Text>
        <Text style={styles.heroTitle}>Medicines & Essentials</Text>
        <Text style={styles.heroCopy}>
          Search, filter, and order the same 200-item catalog available on web.
        </Text>
      </View>

      <View style={styles.cartSummaryCard}>
        <View>
          <Text style={styles.cartSummaryTitle}>Cart</Text>
          <Text style={styles.cartSummaryCopy}>
            {totalCartItems} items • ${totalCartAmount.toFixed(2)}
          </Text>
        </View>
        <PrimaryButton
          label="Checkout"
          onPress={onCheckout}
          compact
          styles={styles}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.fieldLabel}>Search medicines</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Try Paracetamol, Azee, Fever..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />

        <Text style={styles.fieldLabel}>Sort by</Text>
        <View style={styles.inlineRow}>
          <Pill
            label="Relevant"
            active={sortBy === "popular"}
            onPress={() => setSortBy("popular")}
            styles={styles}
          />
          <Pill
            label="Low to High"
            active={sortBy === "priceAsc"}
            onPress={() => setSortBy("priceAsc")}
            styles={styles}
          />
          <Pill
            label="High to Low"
            active={sortBy === "priceDesc"}
            onPress={() => setSortBy("priceDesc")}
            styles={styles}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {categories.map((category) => (
            <Pill
              key={category}
              label={category}
              active={activeCategory === category}
              onPress={() => setActiveCategory(category)}
              styles={styles}
            />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultsText}>
        Showing {medicines.length} of {allMedicines.length} medicines
      </Text>
      {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
      {medicines.map((medicine) => {
        const quantity = cartQuantityById[medicine.id] ?? 0;
        return (
          <View key={medicine.id} style={styles.medicineCard}>
            <Image
              source={{ uri: medicine.image }}
              style={styles.medicineImage}
            />
            <View style={styles.medicineBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicinePrice}>
                  ${medicine.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.medicineMeta}>
                {medicine.brand} • {medicine.category}
              </Text>
              <View style={styles.rowBetween}>
                <Text style={styles.medicineMeta}>{medicine.packSize}</Text>
                <View
                  style={[
                    styles.badge,
                    medicine.requiresPrescription
                      ? styles.badgeWarning
                      : styles.badgeSuccess,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {medicine.requiresPrescription ? "Rx Required" : "OTC"}
                  </Text>
                </View>
              </View>

              {quantity === 0 ? (
                <PrimaryButton
                  label="Add to Cart"
                  onPress={() => dispatch(addToCart(medicine))}
                  styles={styles}
                />
              ) : (
                <View style={styles.stepperWrap}>
                  <Pressable
                    onPress={() => dispatch(decrementCartItem(medicine.id))}
                    style={[styles.stepperButton, styles.stepperButtonDark]}
                  >
                    <Text style={styles.stepperSymbol}>-</Text>
                  </Pressable>
                  <View style={styles.stepperCountWrap}>
                    <Text style={styles.stepperCount}>{quantity}</Text>
                  </View>
                  <Pressable
                    onPress={() => dispatch(addToCart(medicine))}
                    style={[styles.stepperButton, styles.stepperButtonAccent]}
                  >
                    <Text style={styles.stepperSymbolDark}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};
