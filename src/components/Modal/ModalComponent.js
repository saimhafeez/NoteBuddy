import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

import { useModal } from "./ModalContext";
import hexToRbg from "../../utils/hexToRbg";
import { useTheme } from "../../theme/ThemeManager";

export default function ModalComponent() {
  const {
    modalVisible,
    modalContent,
    closeModal,
    getModalData,
    setModalVisible,
  } = useModal();
  const { currentTheme } = useTheme();

  if (!modalVisible) {
    return null;
  }

  return (
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
          onPress={closeModal} // Hide modal when the overlay is pressed
        />
      </Animated.View>

      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={styles.modal}
      >
        <KeyboardAvoidingView behavior="padding">
          <View
            style={[
              styles.modalView,
              { backgroundColor: currentTheme.bottomModalBackground },
            ]}
          >
            {modalContent && (
              <modalContent.content data={getModalData(modalContent.name)} />
            )}
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
