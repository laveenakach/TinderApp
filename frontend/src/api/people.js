import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import client from "./client";

// Replace this with your PC's local IP if testing on a device
const API_URL = "http://localhost:8000/api";

// Fetch all people
export const fetchPeople = async ({ page = 1 }) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No token found");

    const response = await client.get(`http://127.0.0.1:8000/api/people?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Return just the data array for Swiper
    return response.data.data.map(person => ({
      ...person,
      pictures: person.pictures?.map(pic => ({
        ...pic,
        path: pic.path.replace(/\\/g, ""), // Clean escaped slashes
      })),
    }));
  } catch (error) {
    console.error("fetchPeople error:", error.response?.data || error.message);
    return [];
  }
};

// Like a person
export const likePerson = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No token found");

    const res = await axios.post(
      `${API_URL}/people/${id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error(`Error liking person ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

export const dislikePerson = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No token found");

    const res = await axios.post(
      `${API_URL}/people/${id}/dislike`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error(`Error disliking person ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

export const fetchLikedPeople = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/liked`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return [];
    }

    const data = await response.json();
    return data.data || []; // Laravel paginate returns 'data' inside the response
  } catch (error) {
    console.error("Error fetching liked people:", error);
    return [];
  }
};


