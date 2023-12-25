import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import {
  ref,
  push,
  serverTimestamp,
  getDatabase,
  get,
  update,
  set,
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMqmVeH8_a_ol2ZEL-IcGDywNsOqXS5Iw",
  authDomain: "madproject-8f396.firebaseapp.com",
  projectId: "madproject-8f396",
  storageBucket: "madproject-8f396.appspot.com",
  messagingSenderId: "639537316218",
  appId: "1:639537316218:web:2e3e9bd4532c5a7d1916c3",
  measurementId: "G-3BRFX3Y8WY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getDatabase(app);
const plansRef = ref(db, "plans");

export const createNewUser = async (userData) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
  );
  return userCredential.user;
};

export const loginUser = async (userData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // console.log("User logged in successfully:", user);
    return user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

export const storeDataInRealtimeDatabase = async (data) => {
  try {
    // Ensure the user is authenticated before storing data
    if (auth.currentUser) {
      // Push the data to a new child node under 'plans' with the provided data
      const newPlanRef = push(plansRef, {
        ...data,
        dateAdded: serverTimestamp(),
        dateModified: serverTimestamp(),
        userId: auth.currentUser.uid, // Add the user ID to associate data with a user
      });

      // console.log('Data stored successfully with key:', newPlanRef.key);
    } else {
      console.error("User not authenticated. Data not stored.");
    }
  } catch (error) {
    console.error("Error storing data:", error.message);
  }
};

export const getAllPlans = async () => {
  try {
    // Ensure the user is authenticated before retrieving data
    if (auth.currentUser) {
      // Get the snapshot of the 'plans' collection
      const snapshot = await get(plansRef);

      // Extract the plans from the snapshot
      const plans = [];
      snapshot.forEach((childSnapshot) => {
        const plan = childSnapshot.val();
        if (plan.emails.includes(auth.currentUser.email))
          plans.push({
            ...plan,
            id: childSnapshot.key,
          });
      });

      // console.log('Plans retrieved successfully:', plans);
      return plans;
    } else {
      console.error("User not authenticated. Unable to retrieve plans.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving plans:", error.message);
    throw error;
  }
};

export const updatePlanById = async (planId, updatedData) => {
  try {
    // Ensure the user is authenticated before updating data
    if (auth.currentUser) {
      // Construct the reference to the plan using its planId
      const planRef = ref(db, "plans/" + planId);

      // Perform the update operation

      await update(planRef, updatedData);
      // console.log('Plan updated successfully:', planId, updatedData);
    } else {
      console.error("User not authenticated. Unable to update plan.");
    }
  } catch (error) {
    console.error("Error updating plan:", error.message);
    throw error;
  }
};

export const fetchDocumentById = async (docId) => {
  const db = getDatabase();
  const docRef = ref(db, `plans/${docId}`); // Adjust 'yourCollectionName' to your actual collection name

  try {
    const snapshot = await get(docRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // console.log('Document data:', data);
      return data;
    } else {
      console.log("Document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error.message);
    throw error;
  }
};

export const getCurrentUserEmail = () => {
  const user = auth.currentUser;

  if (user) {
    return user.email;
  } else {
    // User is not logged in or authentication information is not available
    return null;
  }
};

export { auth };
