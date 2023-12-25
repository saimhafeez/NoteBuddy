import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import hexToRbg from "../../../utils/hexToRbg";
import MyIcon from "../../MyIcon";
import MyText from "../../MyText";
import { useTheme } from "../../../theme/ThemeManager";
import { useEffect, useState } from "react";
import { useModal } from "../ModalContext";
import TaskCategorySelection from "./TaskCategorySelection";
import TaskSchedule from "./TaskSchedule";
import uuid from "react-native-uuid";
import { createTodoTask } from "../../../db/ToDoOperations";
import { useUiRefresh } from "../../../context/UiRefreshContext";

function AddNewTask({ data }) {
  const { currentTheme, myStyles } = useTheme();

  const {
    openModal,
    closeModal,
    getModalData,
    stackOpenModal,
    setDataForModal,
  } = useModal();
  const { taskMarkChanged, setTaskMarkChanged } = useUiRefresh();

  const [task, setTask] = useState({
    title: (data && data.title) || "",
    schedule: (data && data.schedule) || { date: "", repeat: "", time: "" },
    subTasks: (data && data.subTasks) || {},
    category: (data && data.category) || "",
  });

  useEffect(() => {
    // console.log('AddNewTask Rendered', data)
    // console.log('getModalData', getModalData('AddNewTask'))
  }, []);

  useEffect(() => {
    const mData = getModalData("AddNewTask");
    setDataForModal("AddNewTask", {
      ...mData,
      subTasks: task.subTasks,
    });
  }, [task.subTasks]);

  useEffect(() => {
    const mData = getModalData("AddNewTask");
    setDataForModal("AddNewTask", {
      ...mData,
      title: task.title,
    });
  }, [task.title]);

  const addTask = () => {
    if (task.title === "") {
      return;
    }
    createTodoTask(JSON.stringify(task)).then((result) => {
      // console.log('result -->', result)
    });
    closeModal();
    setTaskMarkChanged(!taskMarkChanged);
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <View style={{ flex: 1, gap: 5 }}>
          <TextInput
            style={[
              myStyles.input,
              {
                borderColor: currentTheme.TextFieldBackground,
                color: currentTheme.TextColor,
                backgroundColor: currentTheme.TextFieldBackground,
              },
            ]}
            placeholder={"Input Task Here (Required)"}
            placeholderTextColor={`rgba(${hexToRbg(
              currentTheme.TextColor
            )}, 0.34)`}
            value={task.title}
            onChangeText={(text) => {
              setTask((prevState) => ({
                ...prevState,
                title: text,
              }));
            }}
          />
          {Object.keys(task.subTasks).map((taskKey, index) => {
            return (
              <View
                style={[myStyles.flexRowWithGap, { alignItems: "center" }]}
                key={index}
              >
                <TouchableOpacity
                  onPress={() => {
                    const { [taskKey]: deleted, ...others } = task.subTasks;
                    setTask((prevState) => ({
                      ...prevState,
                      subTasks: others,
                    }));
                  }}
                >
                  <MyIcon
                    name="minuscircle"
                    iconPack="AntDesign"
                    color={currentTheme.linkColorDanger}
                    size={24}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    myStyles.button,
                    {
                      flex: 1,
                      borderColor: currentTheme.TextFieldBackground,
                      color: currentTheme.TextColor,
                      backgroundColor: currentTheme.TextFieldBackground,
                    },
                  ]}
                  placeholder={"Input Sub-Task Here"}
                  placeholderTextColor={`rgba(${hexToRbg(
                    currentTheme.TextColor
                  )}, 0.34)`}
                  value={task.subTasks[taskKey]}
                  onChangeText={(text) => {
                    setTask((prevState) => ({
                      ...prevState,
                      subTasks: { ...prevState.subTasks, [taskKey]: text },
                    }));
                  }}
                />
              </View>
            );
          })}
        </View>
        <TouchableOpacity onPress={addTask}>
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

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: currentTheme.TextFieldBackground,
            borderRadius: 20,
            padding: 5,
          }}
          onPress={() => {
            openModal(TaskCategorySelection);
          }}
        >
          <MyText
            style={{
              color: `rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`,
              fontWeight: "bold",
            }}
          >
            {task.category || "No Category"}
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: currentTheme.TextFieldBackground,
            borderRadius: 20,
            padding: 5,
          }}
          onPress={() => {
            stackOpenModal(TaskSchedule);
          }}
        >
          <MyText
            style={{
              color: `rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`,
              fontWeight: "bold",
            }}
          >
            {(task.schedule && "Scheduled") || "Schedule"}
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: currentTheme.TextFieldBackground,
            borderRadius: 20,
            padding: 5,
          }}
          onPress={() => {
            setTask((prevState) => ({
              ...prevState,
              subTasks: { ...prevState.subTasks, [uuid.v4()]: "" },
            }));
          }}
        >
          <MyText
            style={{
              color: `rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`,
              fontWeight: "bold",
            }}
          >
            Sub Task
          </MyText>
        </TouchableOpacity>
      </View>
    </View>
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

export default AddNewTask;
