import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getLoginStatus } from "../db/User";
import { useTheme } from "../theme/ThemeManager";
import hexToRbg from "../utils/hexToRbg";
import MyIcon from "../components/MyIcon";
import MyText from "../components/MyText";
import {
  createNewUser,
  getAllPlans,
  getCurrentUserEmail,
  loginUser,
} from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";

function EventPlanner({ navigation }) {
  const { currentTheme, myStyles } = useTheme();

  const navigator = useNavigation();

  const [plans, setPlans] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    isLoading: true,
    status: false,
    user: null,
  });

  const [isLogging, setIsLogging] = useState(true);
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const checkLoginStatus = async () => {
    // await AsyncStorage.removeItem('user);
    const value = await AsyncStorage.getItem("user");
    console.log("value", value);
    setCurrentUser((pre) => ({
      ...pre,
      isLoading: false,
      status: value !== null ? true : false,
      user: value,
    }));
  };

  useEffect(() => {
    checkLoginStatus();
    if (currentUser.user) {
      getAllPlans().then((_plans) => {
        setPlans(_plans);
        // console.log('_plans', _plans);
      });
    }
  }, []);

  const handleSignin = async () => {
    if (!isLogging) {
      const user = await createNewUser(userInput);
      setCurrentUser((pre) => ({
        ...pre,
        isLoading: false,
        status: true,
        user: user,
      }));
      AsyncStorage.setItem("user", user.email);
      console.log("user after creation", user);
    } else {
      const user = await loginUser(userInput);
      setCurrentUser((pre) => ({
        ...pre,
        isLoading: false,
        status: true,
        user: user,
      }));
      AsyncStorage.setItem("user", user.email);
      console.log("user after login", user);
    }
  };

  const navigateToPlan = (item) => {
    console.log("pressed", item.id);
    // setSelectedNoteForDeletion(null)

    navigator.navigate("PlannerEditor", {
      ...item,
    });
  };

  useEffect(() => {
    if (!currentUser.user) return;

    const unsubscribe = navigation.addListener("focus", () => {
      getAllPlans().then((_plans) => {
        setPlans(_plans);
        console.log("_plans", _plans);
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!currentUser.user) return;

    const unsubscribe = navigation.addListener("focus", () => {
      const dbRef = ref(getDatabase(), "plans");

      // Set up a listener for changes in the plans
      const plansListener = onValue(dbRef, (snapshot) => {
        // const updatedPlans = snapshot.val();
        // setPlans(updatedPlans || []);
        console.log("update");
        getAllPlans().then((_plans) => {
          setPlans(_plans);
          // console.log('_plans', _plans);
        });
      });

      // Remove the listener when the component is unmounted or loses focus
      return () => {
        plansListener(); // Detach the listener
      };
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {!currentUser.user ? (
        <KeyboardAvoidingView
          style={{
            gap: 10,
            backgroundColor: currentTheme.Background,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 20,
          }}
          behavior="padding"
        >
          {/* {!isLogging && <TextInput
                style={[myStyles.input, { borderColor: currentTheme.TextFieldBackground, color: currentTheme.TextColor, backgroundColor: currentTheme.TextFieldBackground }]}
                placeholder={'Enter Name'}
                placeholderTextColor={`rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`}
                value={userInput.name}
                onChangeText={(text) => {
                    setUserInput(prevState => ({
                        ...prevState,
                        name: text
                    }))
                }}
            />} */}

          <TextInput
            style={[
              myStyles.input,
              {
                borderColor: currentTheme.TextFieldBackground,
                color: currentTheme.TextColor,
                backgroundColor: currentTheme.TextFieldBackground,
              },
            ]}
            keyboardType="email-address"
            placeholder={"Enter Email"}
            value={userInput.email}
            onChangeText={(text) => {
              setUserInput((pre) => ({
                ...pre,
                email: text,
              }));
            }}
          />

          <TextInput
            style={[
              myStyles.input,
              {
                borderColor: currentTheme.TextFieldBackground,
                color: currentTheme.TextColor,
                backgroundColor: currentTheme.TextFieldBackground,
              },
            ]}
            placeholder={"Enter Password"}
            keyboardType="visible-password"
            placeholderTextColor={`rgba(${hexToRbg(
              currentTheme.TextColor
            )}, 0.34)`}
            value={userInput.password}
            onChangeText={(text) => {
              setUserInput((pre) => ({
                ...pre,
                password: text,
              }));
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleSignin}
              style={[
                myStyles.button,
                {
                  backgroundColor: currentTheme.newTaskIconBackgroundColor,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <MyText style={{ color: "white" }}>
                {isLogging ? "Login" : "Register"}
              </MyText>
              <MyIcon
                iconPack="MaterialCommunityIcons"
                name="login-variant"
                color={currentTheme.newTaskIconColor}
              />
            </TouchableOpacity>
            <MyText>OR</MyText>
            <TouchableOpacity onPress={() => setIsLogging((pre) => !pre)}>
              <MyText
                style={{ color: currentTheme.newTaskIconBackgroundColor }}
              >
                {isLogging ? "Register" : "Login"}
              </MyText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ flex: 1, backgroundColor: currentTheme.Background }}>
          <View
            style={[
              myStyles.flexRowWithGap,
              {
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              },
            ]}
          >
            <MyText>{getCurrentUserEmail()}</MyText>

            <TouchableOpacity
              onPress={() => {
                navigator.navigate("NewPlannerEditor");
              }}
            >
              <MyIcon
                iconPack="MaterialCommunityIcons"
                name="note-plus-outline"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            contentContainerStyle={{ padding: 10, gap: 10 }}
            data={plans}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onLongPress={() => {}}
                  onPress={() => navigateToPlan(item)}
                  style={[
                    myStyles.input,
                    myStyles.flexRowWithGap,
                    { justifyContent: "space-between", alignItems: "center" },
                  ]}
                >
                  <View
                    style={[myStyles.flexRowWithGap, { alignItems: "center" }]}
                  >
                    {item.password && (
                      <MyIcon name="lock" iconPack="MaterialCommunityIcons" />
                    )}
                    <MyText style={{ fontWeight: "bold" }}>{item.title}</MyText>
                  </View>
                  <MyText>
                    {new Date(item.dateModified).toLocaleDateString()}
                  </MyText>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    // height: 40,
    width: "100%",
    // margin: 12,
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 10,
  },
  iconWrapper: {
    transform: [{ rotate: "-45deg" }],
    backgroundColor: "red",
    borderRadius: 21,
    width: 42,
    height: 42,
    padding: 5,
  },
  content: {
    // padding: 16,
    // backgroundColor: 'pink',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // Android shadow'
  },
  popoverIconContainer: {
    gap: 10,
  },
  popoverIconList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  arrow: {
    margin: 300,
    borderTopColor: "pink",
  },
  background: {
    // backgroundColor: 'transparent',
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default EventPlanner;
