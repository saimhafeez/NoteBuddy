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

import hexToRbg from "../../utils/hexToRbg";
import { useTheme } from "../../theme/ThemeManager";
import MyText from "../MyText";
import { TaskSymbols } from "../../utils/TaskSymbols";
import MyIcon from "../MyIcon";

export default function TaskSymbolSelectionModal({
  setModalVisible,
  onSymbolSelection,
}) {
  const { myStyles, currentTheme } = useTheme();

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
          onPress={() => setModalVisible(false)} // Hide modal when the overlay is pressed
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
            <View style={{ gap: 10 }}>
              <View
                style={[
                  myStyles.flexRowWithGap,
                  { justifyContent: "space-between" },
                ]}
              >
                <MyText
                  style={{ color: currentTheme.linkColor, fontWeight: "bold" }}
                >
                  Mark with symbol
                </MyText>
                <TouchableOpacity>
                  <MyText
                    style={{
                      color: currentTheme.linkColorDanger,
                      fontWeight: "bold",
                    }}
                  >
                    Clear
                  </MyText>
                </TouchableOpacity>
              </View>

              <View style={styles.popoverIconContainer}>
                <MyText>Flag</MyText>
                <View style={styles.popoverIconList}>
                  {TaskSymbols.flags.map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onSymbolSelection(data)}
                      >
                        <MyIcon
                          iconPack={data.iconPack}
                          name={data.name}
                          color={data.color}
                          size={26}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.popoverIconContainer}>
                <MyText>Progress</MyText>
                <View style={styles.popoverIconList}>
                  {TaskSymbols.progress.map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onSymbolSelection(data)}
                      >
                        <MyIcon
                          key={index}
                          iconPack={data.iconPack}
                          name={data.name}
                          color={data.color}
                          size={26}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
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
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    margin: 100,
    borderTopColor: "pink",
  },
  background: {
    // backgroundColor: 'transparent',
  },
});
