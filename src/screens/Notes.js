import {
  Text,
  View,
  Button,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useModal } from "../components/Modal/ModalContext";
import AddAudioNote from "../components/Modal/ModalContent/AddAudioNote";
import { useTheme } from "../theme/ThemeManager";
import MyIcon from "../components/MyIcon";
import React, { useRef, useState, useEffect } from "react";

import { StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteNoteById, getNotes } from "../db/NotesOperations";
import { FlatList } from "react-native";
import MyText from "../components/MyText";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import hexToRbg from "../utils/hexToRbg";

function Notes({ navigation }) {
  const { openModal } = useModal();

  const navigator = useNavigation();

  const { myStyles, currentTheme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [notification, setNofitication] = useState("");

  const passwordInputRef = useRef(null);
  const [selectedNote, setSelectedNote] = useState();
  const [selectedNoteForDeletion, setSelectedNoteForDeletion] = useState();

  const [notes, setNotes] = useState([]);

  const getMyNotes = () => {
    setModalVisible(false);
    getNotes().then((result) => {
      console.log("Notes", result);
      setNotes(result);
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyNotes();
    });
    return unsubscribe;
  }, [navigation]);

  const navigateToNote = (item) => {
    console.log("pressed", item.id);
    setSelectedNoteForDeletion(null);

    if (item.password) {
      setSelectedNote(item);
      setModalVisible(true);
    } else {
      navigator.navigate("NoteEditor", {
        ...item,
      });
    }
  };

  const verifyLogin = () => {
    if (selectedNote.password === passwordInputRef.current.value) {
      setNofitication("");
      navigator.navigate("NoteEditor", {
        ...selectedNote,
      });
    } else {
      setNofitication("Invalid Password!");
    }
  };

  const deleteNoteDialog = (item) => {
    console.log("pressed", item.id);
    setSelectedNote(null);
    setSelectedNoteForDeletion(item);
    setModalVisible(true);
  };

  const editNotePasswordModal = () => {
    return (
      <View
        style={[
          styles.modalView,
          { backgroundColor: currentTheme.bottomModalBackground },
        ]}
      >
        <MyText style={{ color: "red" }}>{notification}</MyText>

        <View
          style={[
            myStyles.input,
            myStyles.flexRowWithGap,
            { alignItems: "center" },
          ]}
        >
          <TextInput
            // value={}
            placeholder="Enter Password"
            ref={passwordInputRef}
            onChangeText={(text) => (passwordInputRef.current.value = text)}
            multiline
            style={[{ flex: 1 }]}
          />

          <TouchableOpacity onPress={verifyLogin}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: currentTheme.newTaskIconBackgroundColor },
              ]}
            >
              <MyIcon
                iconPack="FontAwesome"
                name="location-arrow"
                color={currentTheme.newTaskIconColor}
                size={35}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const deleteNoteModal = () => {
    return (
      <View
        style={[
          styles.modalView,
          { backgroundColor: currentTheme.bottomModalBackground },
        ]}
      >
        <MyText style={{ color: "red" }}>{notification}</MyText>

        <View
          style={[
            selectedNoteForDeletion.password && myStyles.input,
            myStyles.flexRowWithGap,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {selectedNoteForDeletion.password && (
            <TextInput
              // value={}
              placeholder="Enter Password to Delete"
              ref={passwordInputRef}
              onChangeText={(text) => (passwordInputRef.current.value = text)}
              multiline
              style={[{ flex: 1 }]}
            />
          )}

          <TouchableOpacity onPress={deleteNoteFromDB}>
            <View
              style={[
                myStyles.flexRowWithGap,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              {!selectedNoteForDeletion.password && (
                <MyText>Delete Note ? </MyText>
              )}

              <MyIcon
                iconPack="MaterialCommunityIcons"
                name="delete"
                color={currentTheme.linkColorDanger}
                size={35}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const deleteNoteFromDB = () => {
    console.log("deleting");
    if (selectedNoteForDeletion.password) {
      if (selectedNoteForDeletion.password === passwordInputRef.current.value) {
        setNofitication("");
        deleteNoteById(selectedNoteForDeletion.id).then((result) => {
          console.log(result);
          getMyNotes();
        });
      } else {
        setNofitication("Invalid Password!");
      }
    } else {
      deleteNoteById(selectedNoteForDeletion.id).then((result) => {
        console.log(result);
        getMyNotes();
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.Background }}>
      <View
        style={[
          myStyles.flexRowWithGap,
          { justifyContent: "flex-end", padding: 10 },
        ]}
      >
        {/* <MyIcon iconPack='AntDesign' name='addfolder' /> */}
        {/* <MyIcon iconPack='FontAwesome' name='file-audio-o' /> */}
        <TouchableOpacity
          onPress={() => {
            navigator.navigate("NoteEditor");
          }}
        >
          <MyIcon iconPack="MaterialCommunityIcons" name="note-plus-outline" />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 10, gap: 10 }}
        data={notes}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onLongPress={() => deleteNoteDialog(item)}
              onPress={() => navigateToNote(item)}
              style={[
                myStyles.input,
                myStyles.flexRowWithGap,
                { justifyContent: "space-between", alignItems: "center" },
              ]}
            >
              <View style={[myStyles.flexRowWithGap, { alignItems: "center" }]}>
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

      {modalVisible && (
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.centeredView,
              {
                backgroundColor: `rgba(${hexToRbg(
                  currentTheme.bottomModalBackgroundOverlay
                )},0.34)`,
              },
            ]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Pressable
              style={{ height: "100%", width: "100%", flex: 1 }}
              onPress={() => {
                setModalVisible(false);
                setNofitication("");
              }} // Hide modal when the overlay is pressed
            />
          </Animated.View>

          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.modal}
          >
            <KeyboardAvoidingView behavior="padding">
              {selectedNote && editNotePasswordModal()}
              {selectedNoteForDeletion && deleteNoteModal()}
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      )}

      {/* {TempScreen()} */}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 10,
  },
  root: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#eaeaea",
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "white",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
    height: "100%",
  },
  modal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
  },
  centeredView: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    gap: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 19,
  },
  iconWrapper: {
    transform: [{ rotate: "-45deg" }],
    backgroundColor: "red",
    borderRadius: 21,
    width: 42,
    height: 42,
    padding: 5,
  },
  iconWrapperNoTransform: {
    // transform: [{ rotate: '-45deg' }],
    backgroundColor: "red",
    borderRadius: 21,
    width: 42,
    height: 42,
    padding: 5,
  },
});

export default Notes;
