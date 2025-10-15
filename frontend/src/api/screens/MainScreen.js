import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
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
import { dislikePerson, fetchPeople, likePerson } from "../people";

const { width, height } = Dimensions.get("window");

export default function MainScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const swiperRef = useRef(null);

  // Fetch people from API

  const loadPeople = async (p = 1, reset = false) => {
    try {
      if (reset) setLoading(true);
      const data = await fetchPeople({ page: p });
      if (reset) {
        setPeople(data || []);
        setPage(1);
      } else {
        setPeople((prev) => [...prev, ...(data || [])]);
      }
    } catch (err) {
      console.error("Error fetchPeople:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadPeople(page);
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.replace("SplashScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLikePress = () => swiperRef.current?.swipeRight();
  const handleNopePress = () => swiperRef.current?.swipeLeft();

  const handleRefresh = () => {
    // Reload first page and reset swiper
    loadPeople(1, true);
    swiperRef.current?.jumpToCardIndex(0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!people.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No recommendations yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

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

      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>🔥 tinder</Text>
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={people}
          cardIndex={0}
          loop // ⬅ repeat cards infinitely
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={10}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedRight={(i) => likePerson(people[i]?.id)}
          onSwipedLeft={(i) => dislikePerson(people[i]?.id)}
          onSwiped={(i) => {
            // Fetch more pages when reaching last 4 cards
            if (people.length - i <= 4 && !isFetchingMore) {
              setIsFetchingMore(true);
              setPage((p) => {
                const nextPage = p + 1;
                loadPeople(nextPage);
                return nextPage;
              });
            }
          }}
          renderCard={(person) => {
            if (!person) return <View style={styles.cardEmpty} />;
            const imageSource =
              person.pictures && person.pictures.length > 0
                ? { uri: person.pictures[0].path }
                : null;
            return (
              <View style={styles.card}>
                <ImageBackground source={imageSource} style={styles.cardImage} resizeMode="cover">
                  <View style={styles.fallbackGradient} />
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.nameText}>{person.name}, </Text>
                      <Text style={styles.ageText}>{person.age}</Text>
                    </View>
                    <Text style={styles.locationText}>{person.location}</Text>
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

        <TouchableOpacity style={[styles.actionBtn, styles.nopeBtn]} onPress={handleNopePress}>
          <MaterialIcons name="close" size={30} color="#fff" />
        </TouchableOpacity>

            <TouchableOpacity
            style={[styles.actionBtn, styles.starBtn]}
             onPress={() => navigation.navigate("LikedScreen")}>
              <Ionicons name="star" size={28} color="#fff" />
            </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={handleLikePress}>
          <MaterialIcons name="favorite" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
     <TouchableOpacity onPress={logout} style={styles.logoutBtn}> <Text style={{ color: "black", fontSize: 14 }}>Log Out</Text>
      </TouchableOpacity>
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
  card: { width: "100%", height: height * 0.65, borderRadius: 20, overflow: "hidden", backgroundColor: "#fff", elevation: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12 },
  cardImage: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%", justifyContent: "flex-end" },
  fallbackGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  cardInfo: { paddingHorizontal: 14, paddingVertical: 18 },
  nameRow: { flexDirection: "row", alignItems: "baseline" },
  nameText: { fontSize: 24, fontWeight: "800", color: "white" },
  ageText: { fontSize: 20, fontWeight: "700", color: "white", marginLeft: 6 },
  locationText: { marginTop: 6, color: "white", fontSize: 15 },
  cardEmpty: { width: width * 0.92, height: height * 0.65, borderRadius: 16, backgroundColor: "#fafafa", alignItems: "center", justifyContent: "center" },
  actions: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", paddingVertical: 20, borderTopWidth: 1, borderColor: "#f1f1f1", marginBottom: -10 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", elevation: 4 },
  refreshBtn: { backgroundColor: "#60a5fa" },
  nopeBtn: { backgroundColor: "#9ca3af" },
  starBtn: { backgroundColor: "#facc15" },
  likeBtn: { backgroundColor: "#ff6b6b" },
  logoutBtn: { alignSelf: "center", paddingVertical: 10, marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#374151" },
});
