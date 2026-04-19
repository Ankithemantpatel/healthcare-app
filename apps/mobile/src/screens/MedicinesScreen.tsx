import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Medicine, MedicineSortOption } from "shared";
import { addToCart, decrementCartItem } from "shared/redux";
import { useAppDispatch } from "shared/redux/hooks";
import type { SharedStyles } from "./types";
import { Pill, PrimaryButton } from "./ui";

// Optimized image loading with caching and progressive rendering
const MedicineImage = React.memo(
  ({ uri, style }: { uri: string; style: any }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    return (
      <View style={[style, { backgroundColor: "#f1f5f9" }]}>
        <Image
          source={error ? require("../assets/placeholder-avatar.png") : { uri }}
          style={style}
          onLoadEnd={() => setLoading(false)}
          onError={() => setError(true)}
          progressiveRenderingEnabled={true}
        />
        {loading && (
          <View
            style={[
              style,
              {
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <ActivityIndicator size="small" color="#67e8f9" />
          </View>
        )}
      </View>
    );
  },
);

MedicineImage.displayName = "MedicineImage";

// Memoized medicine card component for performance
const MedicineCard = React.memo(
  ({
    medicine,
    quantity,
    dispatch,
    styles,
  }: {
    medicine: Medicine;
    quantity: number;
    dispatch: ReturnType<typeof useAppDispatch>;
    styles: SharedStyles;
  }) => {
    console.log("MedicineCard actual render:", medicine.name, "qty:", quantity);

    return (
      <View style={styles.medicineCard}>
        <MedicineImage uri={medicine.image} style={styles.medicineImage} />
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.medicine.id === nextProps.medicine.id &&
      prevProps.quantity === nextProps.quantity
    );
  },
);

MedicineCard.displayName = "MedicineCard";

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

  const keyExtractor = useCallback((item: Medicine) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Medicine }) => (
      <MedicineCard
        medicine={item}
        quantity={cartQuantityById[item.id] ?? 0}
        dispatch={dispatch}
        styles={styles}
      />
    ),
    [cartQuantityById, dispatch, styles],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Online Pharmacy</Text>
          <Text style={styles.heroTitle}>Medicines & Essentials</Text>
          <Text style={styles.heroCopy}>
            Browse our catalog of 2000+ medicines & essentials with fast
            delivery.
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
          <View>
            <Text style={styles.fieldLabel}>Search medicines</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Try Paracetamol, Azee, Fever..."
              placeholderTextColor="#64748b"
              style={styles.searchInput}
            />
          </View>

          <View>
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
          </View>

          <View>
            <Text style={styles.fieldLabel}>Categories</Text>
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
        </View>

        <Text style={styles.resultsText}>
          Showing {medicines.length} of {allMedicines.length} medicines
        </Text>
        {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
      </View>
    ),
    [
      styles,
      totalCartItems,
      totalCartAmount,
      onCheckout,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      categories,
      activeCategory,
      setActiveCategory,
      medicines.length,
      allMedicines.length,
      status,
    ],
  );

  return (
    <FlatList
      data={medicines}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.screenContent}
      style={styles.screen}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
    />
  );
};

/*
  BAD EXAMPLE: Uncomment inside MedicinesScreenView to compare with the optimized version above.

  Also temporarily replace the MedicineCard log above with:
  console.log("BAD MedicineCard actual render:", medicine.name, "qty:", quantity);

  return (
    <FlatList
      data={medicines}
      renderItem={({ item }) => {
        return (
          <MedicineCard
            medicine={item}
            quantity={cartQuantityById[item.id] ?? 0}
            dispatch={dispatch}
            // BAD: Inline style object causes new prop every render
            styles={{ ...styles, borderWidth: 1 }}
          />
        );
      }}
      keyExtractor={item => item.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.screenContent}
      style={styles.screen}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
    />
  );
  */
