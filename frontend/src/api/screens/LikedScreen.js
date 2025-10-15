import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { fetchLikedPeople } from "../people";

const { width, height } = Dimensions.get("window");

export default function LikedScreen({ navigation }) {
  const [likedPeople, setLikedPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const swiperRef = useRef(null);

  const loadLikedPeople = async (p = 1, reset = false) => {
    try {
      if (reset) setLoading(true);
      const data = await fetchLikedPeople({ page: p });
      const mapped = data.map(item => item.people);
      if (reset) {
        setLikedPeople(mapped || []);
        setPage(1);
      } else {
        setLikedPeople(prev => [...prev, ...(mapped || [])]);
      }
    } catch (err) {
      console.error("Error fetching liked people:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadLikedPeople();
  }, []);

  const handleRefresh = () => {
    loadLikedPeople(1, true);
    swiperRef.current?.jumpToCardIndex(0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!likedPeople.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No Liked List</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Status Bar */}
      <View style={styles.statusBarMock}>
        <Text style={styles.statusText}>15:46</Text>
        <View style={styles.statusRight}>
          <Ionicons name="wifi-outline" size={16} color="#000" style={{ marginRight: 4 }} />
          <Ionicons name="battery-half" size={18} color="#000" />
        </View>
      </View>

      {/* App Row */}
      <View style={styles.appRow}>
        <Ionicons name="chevron-back" size={18} color="#000" />
        <Text style={styles.appRowText}>App Store</Text>
      </View>

      {/* Tinder Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>🔥 tinder</Text>
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={likedPeople}
          cardIndex={0}
          loop
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={10}
          verticalSwipe={false}
          animateCardOpacity
          onSwiped={(i) => {
            if (likedPeople.length - i <= 4 && !isFetchingMore) {
              setIsFetchingMore(true);
              setPage((p) => {
                const nextPage = p + 1;
                loadLikedPeople(nextPage);
                return nextPage;
              });
            }
          }}
          renderCard={(item) => {
            if (!item) return <View style={styles.cardEmpty} />;
            const imageSource = item.pictures?.[0]?.path ? { uri: item.pictures[0].path } : null;
            return (
              <View style={styles.card}>
                <ImageBackground source={imageSource} style={styles.cardImage} resizeMode="cover">
                  <View style={styles.overlay} />
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.nameText}>{item.name}, </Text>
                      <Text style={styles.ageText}>{item.age}</Text>
                    </View>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                </ImageBackground>
              </View>
            );
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.refreshBtn]} onPress={handleRefresh}>
          <Ionicons name="refresh" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => navigation.navigate("MainScreen")}
        >
        <Ionicons name="flame" size={28} color="#fff" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  statusBarMock: { width: "100%", height: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 },
  statusText: { fontSize: 12, color: "#000" },
  statusRight: { flexDirection: "row", alignItems: "center" },
  appRow: { width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 2 },
  appRowText: { fontSize: 14, color: "#000", fontWeight: "500" },
  header: { alignItems: "center", justifyContent: "center", marginBottom: 0, paddingTop: 4 },
  logo: { fontSize: 20, fontWeight: "700", color: "#f43f5e" },
  swiperContainer: { flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-start", marginTop: -60 },
  card: { width: width * 0.92, height: height * 0.65, borderRadius: 20, overflow: "hidden", backgroundColor: "#fff", elevation: 10 },
  cardImage: { width: "100%", height: "100%", justifyContent: "flex-end" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  cardInfo: { padding: 14 },
  nameRow: { flexDirection: "row", alignItems: "baseline" },
  nameText: { fontSize: 24, fontWeight: "800", color: "#fff" },
  ageText: { fontSize: 20, fontWeight: "700", color: "#fff", marginLeft: 6 },
  locationText: { fontSize: 15, color: "#fff", marginTop: 6 },
  cardEmpty: { width: width * 0.92, height: height * 0.65, borderRadius: 16, backgroundColor: "#fafafa", alignItems: "center", justifyContent: "center" },
  actions: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", paddingVertical: 20, borderTopWidth: 1, borderColor: "#f1f1f1", marginBottom: 50 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", elevation: 4 },
  refreshBtn: { backgroundColor: "#60a5fa" },
  nopeBtn: { backgroundColor: "#9ca3af" },
  starBtn: { backgroundColor: "#facc15" },
  likeBtn: { backgroundColor: "#ff6b6b" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#374151" },
  mainBtn: {
  backgroundColor: '#FF6B81',
  padding: 12,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
}

});
