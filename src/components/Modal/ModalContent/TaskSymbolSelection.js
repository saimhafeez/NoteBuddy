import { StyleSheet, TouchableOpacity, View } from "react-native";
import MyText from "../../MyText";
import { TaskSymbols } from "../../../utils/TaskSymbols";
import MyIcon from "../../MyIcon";
import React from "react";
import { useTheme } from "../../../theme/ThemeManager";
import { updateTodoTask } from "../../../db/ToDoOperations";
import { useModal } from "../ModalContext";
import { useUiRefresh } from "../../../context/UiRefreshContext";

function TaskSymbolSelection({ data }) {
  const { myStyles, currentTheme } = useTheme();
  const { closeModal } = useModal();
  const { setTaskSymbolChanged, taskSymbolChanged } = useUiRefresh();

  const onSymbolSelection = (symbol) => {
    // console.log('---------------------------')
    // console.log(symbol)
    // console.log('---------------------------')
    updateTodoTask(
      data.id,
      JSON.stringify(data.task),
      data.isCompleted,
      data.completedOn,
      JSON.stringify(symbol)
    ).then((result) => {
      // console.log('task updated', result)
    });
    setTaskSymbolChanged(!taskSymbolChanged);
    closeModal();
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={[myStyles.flexRowWithGap, { justifyContent: "space-between" }]}
      >
        <MyText style={{ color: currentTheme.linkColor, fontWeight: "bold" }}>
          Mark with symbol
        </MyText>
        <TouchableOpacity>
          <MyText
            style={{ color: currentTheme.linkColorDanger, fontWeight: "bold" }}
          >
            Clear
          </MyText>
        </TouchableOpacity>
      </View>

      <View style={styles.popoverIconContainer}>
        <MyText>Flag</MyText>
        <View style={styles.popoverIconList}>
          {TaskSymbols.flags.map((_data, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSymbolSelection(_data)}
              >
                <MyIcon
                  iconPack={_data.iconPack}
                  name={_data.name}
                  color={_data.color}
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
          {TaskSymbols.progress.map((_data, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSymbolSelection(_data)}
              >
                <MyIcon
                  key={index}
                  iconPack={_data.iconPack}
                  name={_data.name}
                  color={_data.color}
                  size={26}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default TaskSymbolSelection;
