import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const handleBarcodeScanned = async (
  { data }: BarcodeScanningResult
) => {
  setScanned(true);
  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${data}.json`
    );

    const json = await response.json();

    if (json.status === 0) {
      setError("Produkt nie istnieje w bazie");
      return;
    }

    setProduct(json.product);
  } catch (e) {
    setError("Błąd połączenia z API");
  } finally {
    setLoading(false);
  }
};
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Potrzebujemy dostępu do kamery</Text>

        <Button
          onPress={requestPermission}
          title="Daj permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
  style={styles.camera}
  barcodeScannerSettings={{
    barcodeTypes: ["ean13", "ean8"],
  }}
  onBarcodeScanned={
    scanned ? undefined : handleBarcodeScanned
  }
/>

{loading && (
  <Text style={styles.infoText}>
    Ładowanie...
  </Text>
)}
{error ? (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      {error}
    </Text>

    <Button
      title="Spróbuj ponownie"
      onPress={() => {
        setScanned(false);
        setError("");
      }}
    />
  </View>
) : null}

{product && (
  <View style={styles.productContainer}>
    <Text style={styles.productTitle}>
      {product.product_name}
    </Text>

<View style={styles.infoSection}>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>
      Marka
    </Text>

    <Text style={styles.infoValue}>
      {product.brands || "-"}
    </Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>
      Kategorie
    </Text>

    <Text
      numberOfLines={2}
      style={styles.infoValue}
    >
      {product.categories || "-"}
    </Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>
      Nutri Score
    </Text>

    <View style={styles.scoreBadge}>
      <Text style={styles.scoreText}>
        {product.nutriscore_grade?.toUpperCase() || "?"}
      </Text>
    </View>
  </View>

</View>

<View style={styles.nutritionContainer}>
  <Text style={styles.sectionTitle}>
    Wartości odżywcze (100g)
  </Text>

  <View style={styles.nutritionGrid}>

    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionLabel}>
        Kalorie
      </Text>

      <Text style={styles.nutritionValue}>
        {product.nutriments?.["energy-kcal_100g"] || "-"} kcal
      </Text>
    </View>

    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionLabel}>
        Tłuszcz
      </Text>

      <Text style={styles.nutritionValue}>
        {product.nutriments?.fat_100g || "-"} g
      </Text>
    </View>

    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionLabel}>
        Cukry
      </Text>

      <Text style={styles.nutritionValue}>
        {product.nutriments?.sugars_100g || "-"} g
      </Text>
    </View>

    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionLabel}>
        Białko
      </Text>

      <Text style={styles.nutritionValue}>
        {product.nutriments?.proteins_100g || "-"} g
      </Text>
    </View>

    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionLabel}>
        Sól
      </Text>

      <Text style={styles.nutritionValue}>
        {product.nutriments?.salt_100g || "-"} g
      </Text>
    </View>

  </View>
</View>


    <Button
      title="Skanuj ponownie"
      onPress={() => {
        setScanned(false);
        setProduct(null);
        setError("");
      }}
    />
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  productContainer: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  backgroundColor: "white",
  padding: 20,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingBottom: 40,
},

productTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 10,
},

infoText: {
  position: "absolute",
  top: 50,
  alignSelf: "center",
  backgroundColor: "white",
  padding: 10,
},

errorText: {
  color: "white",
  backgroundColor: "red",
  padding: 10,
  borderRadius: 8,
  textAlign: "center",
},
nutritionContainer: {
  marginTop: 20,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

errorContainer: {
  position: "absolute",
  top: 50,
  alignSelf: "center",
  padding: 15,
  borderRadius: 10,
  gap: 10,
},
nutritionGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},

nutritionCard: {
  width: "47%",
  backgroundColor: "#f3f4f6",
  padding: 14,
  borderRadius: 14,
},

nutritionLabel: {
  fontSize: 14,
  color: "#6b7280",
  marginBottom: 6,
},

nutritionValue: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#111827",
},

infoSection: {
  marginTop: 10,
  gap: 12,
},

infoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

infoLabel: {
  fontSize: 15,
  color: "#6b7280",
},

infoValue: {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
  maxWidth: "70%",
  textAlign: "right",
},

scoreBadge: {
  backgroundColor: "#22c55e",
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
},

scoreText: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},
});