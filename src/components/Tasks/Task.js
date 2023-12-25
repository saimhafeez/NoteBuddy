import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../theme/ThemeManager";
import MyText from "../MyText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Popover, usePopover } from "react-native-modal-popover";
import { TaskSymbols } from "../../utils/TaskSymbols";
import { useEffect, useState } from "react";
import MyIcon from "../MyIcon";
import { useModal } from "../Modal/ModalContext";
import TaskSymbolSelectionModal from "../Modal/TaskSymbolSelectionModal";
import TaskSymbolSelection from "../Modal/ModalContent/TaskSymbolSelection";
import {
  createTodoTask,
  getTodoById,
  updateTodoTask,
} from "../../db/ToDoOperations";
import { useUiRefresh } from "../../context/UiRefreshContext";
import { TwentyFourHoursFormat } from "../../utils/TwentyFourHoursFormat";
import GetNextRepeatingDate from "../../utils/GetNextRepeatingDate";
import moment from "moment";

function Task({ data }) {
  const { myStyles, currentTheme } = useTheme();
  const { openModal, setDataForModal } = useModal();
  const {
    setTaskSymbolChanged,
    taskSymbolChanged,
    taskMarkChanged,
    setTaskMarkChanged,
  } = useUiRefresh();
  const [_data, set_data] = useState(null);

  useEffect(() => {
    // console.log('id -->', data.id)
    getTodoById(data.id)
      .then((results) => {
        set_data(results);
      })
      .catch((err) => {
        console.log("err -->", err);
      });
  }, [taskSymbolChanged]);

  const markToDo = () => {
    if (_data.isCompleted) {
      return;
    }

    const completedOn = _data.isCompleted ? "" : new Date().toISOString();

    updateTodoTask(
      data.id,
      JSON.stringify(_data.task),
      !_data.isCompleted,
      completedOn,
      JSON.stringify(_data.symbol)
    ).then((r) => {
      // Make New Repeating Task if Task is repeatable
      if (_data.task.schedule && _data.task.schedule.repeat) {
        const _task = _data.task;

        _task.schedule.date = GetNextRepeatingDate(
          _data.task.schedule.date,
          _data.task.schedule.repeat.toLocaleLowerCase()
        );

        createTodoTask(
          JSON.stringify(_task),
          false,
          "",
          JSON.stringify(TaskSymbols.default)
        ).then((r) => {
          setTaskMarkChanged(!taskMarkChanged);
        });
      }
      setTaskMarkChanged(!taskMarkChanged);
    });
  };

  const taskRepeatStyle = () => {
    const prev_date = moment(
      TwentyFourHoursFormat(_data.task.schedule).toISOString().split("T")[0],
      "YYYY-MM-DD"
    );
    const current_date = moment(getCurrentDate(), "YYYY-MM-DD");
    return _data.task && !_data.isCompleted && prev_date.isBefore(current_date)
      ? currentTheme.linkColorDanger
      : currentTheme.TextColor;
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are 0-based
    const day = currentDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onLongPress = () => {
    setDataForModal("DeleteModal", {
      id: 2,
    });
  };

  return (
    _data && (
      <View
        style={[
          styles.container,
          { backgroundColor: currentTheme.TaskItemContainerBackgroundColor },
        ]}
      >
        <TouchableOpacity onPress={markToDo}>
          <MyIcon
            iconPack="MaterialIcons"
            name={_data.isCompleted ? "check-circle" : "radio-button-unchecked"}
            size={26}
            color={currentTheme.IconColor}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
          <MyText numberOfLines={1}>{_data.task.title}</MyText>
          {_data.task.schedule.repeat && (
            <View
              style={[
                myStyles.flexRowWithGap,
                { alignItems: "center", gap: 0 },
              ]}
            >
              <MyText
                // style={ TwentyFourHoursFormat(_data.task.schedule) && {color: currentTheme.linkColorDanger, fontSize: 11}}
                style={{
                  fontWeight: "bold",
                  opacity: 0.34,
                  fontSize: 11,
                  color: taskRepeatStyle(),
                }}
              >
                {_data.task.schedule.date
                  .toLocaleLowerCase()
                  .replaceAll("-", "/")}
              </MyText>
              {!_data.completedOn && (
                <MyIcon
                  iconPack="MaterialCommunityIcons"
                  name="repeat"
                  size={16}
                />
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setDataForModal("TaskSymbolSelection", _data);
            openModal(TaskSymbolSelection);
          }}
        >
          <MyIcon
            iconPack={_data.symbol.iconPack}
            name={_data.symbol.name}
            size={26}
            color={
              _data.symbol.name === "flag-outline"
                ? currentTheme.IconColor
                : _data.symbol.color
            }
          />
        </TouchableOpacity>
      </View>
    )
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

export default Task;
