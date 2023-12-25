import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TasksContainer from "../components/Tasks/TasksContainer";
import MyText from "../components/MyText";
import { useTheme } from "../theme/ThemeManager";
import MyIcon from "../components/MyIcon";
import { useEffect, useState } from "react";
import NewTaskModal from "../components/Tasks/NewTaskModal";
import { useModal } from "../components/Modal/ModalContext";
import AddNewTask from "../components/Modal/ModalContent/AddNewTask";
import { getTodos } from "../db/ToDoOperations";
import { TwentyFourHoursFormat } from "../utils/TwentyFourHoursFormat";
import { useUiRefresh } from "../context/UiRefreshContext";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import { TaskSymbols } from "../utils/TaskSymbols";
import lodash from "lodash";
import { getToDoCategories } from "../db/TodoCategories";

function Tasks() {
  const navigation = useNavigation();

  const [taskCategories, setTaskCategories] = useState([]);

  const { currentTheme, myStyles } = useTheme();

  const { stackOpenModal, getModalData, taskSymbolChanged } = useModal(); //TaskSchedule

  const { taskMarkChanged, setTaskMarkChanged } = useUiRefresh();

  const [myTasks, setMyTasks] = useState({
    isLoading: true,
    data: {
      "Completed Today": [],
      Future: [],
    },
  });

  const [filter, setFilter] = useState({
    sort: "asc",
    filterBy: {},
    filterByType: "",
    category: "All",
  });

  useEffect(() => {
    getToDoCategories().then((categories) => {
      setTaskCategories(categories);
    });
    setMyTasks({
      isLoading: true,
      data: {
        "Completed Today": [],
        Previous: [],
        Today: [],
        Future: [],
      },
    });
    getTodos().then((results) => {
      console.log("results", results);

      const filteredResults =
        Object.keys(filter.filterBy).length > 0
          ? results.filter((task) =>
              lodash.isEqual(task.symbol, filter.filterBy)
            )
          : results;

      const _filteredResults =
        filter.category !== "All"
          ? filteredResults.filter((t) => t.task.category === filter.category)
          : filteredResults;

      for (const result of _filteredResults) {
        if (result.task.schedule.date === "" && !result.isCompleted) {
          setMyTasks((prevState) => ({
            ...prevState,
            data: {
              ...prevState.data,
              Future: [...prevState.data.Future, result],
            },
          }));
        } else {
          if (
            TwentyFourHoursFormat(result.task.schedule).toDateString() ===
              new Date().toDateString() &&
            !result.isCompleted
          ) {
            setMyTasks((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                Today: [...prevState.data.Today, result],
              },
            }));
          } else if (
            TwentyFourHoursFormat(result.task.schedule) > new Date() &&
            !result.isCompleted
          ) {
            setMyTasks((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                Future: [...prevState.data.Future, result],
              },
            }));
          } else if (
            TwentyFourHoursFormat(result.task.schedule) < new Date() &&
            !result.isCompleted
          ) {
            setMyTasks((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                Previous: [...prevState.data.Previous, result],
              },
            }));
          } else if (
            result.completedOn.split("T")[0] ===
              new Date().toISOString().split("T")[0] &&
            result.isCompleted
          ) {
            setMyTasks((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                "Completed Today": [
                  ...prevState.data["Completed Today"],
                  result,
                ],
              },
            }));
          }
        }
      }
    });
  }, [taskMarkChanged, filter.filterBy, filter.category]);

  const changeFilter = (filterByType, _data) => {
    if (
      filter.filterByType === filterByType &&
      filter.filterBy.name === _data.name &&
      filter.filterBy.iconPack === _data.iconPack &&
      filter.filterBy.color === _data.color
    ) {
      setFilter((pre) => ({ ...pre, filterBy: {}, filterByType: "" }));
    } else {
      setFilter((pre) => ({
        ...pre,
        filterBy: _data,
        filterByType: filterByType,
      }));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.Background,
        padding: 10,
        position: "relative",
      }}
    >
      <View style={{ paddingVertical: 10 }}>
        <FlatList
          horizontal
          contentContainerStyle={{
            gap: 10,
          }}
          data={[{ name: "All" }, ...taskCategories]}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[
                  {
                    alignItems: "center",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 2,
                    backgroundColor:
                      filter.category === item.name
                        ? currentTheme.IconColor
                        : currentTheme.newTaskIconColor,
                    borderRadius: 15,
                    borderColor: currentTheme.IconColor,
                  },
                ]}
                onPress={() =>
                  setFilter((pre) => ({
                    ...pre,
                    category: item.name,
                  }))
                }
              >
                <MyText
                  style={{
                    fontWeight: "bold",
                    color: filter.category === item.name ? "white" : "black",
                  }}
                >
                  {item.name}
                </MyText>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={[myStyles.input, { height: 60 }]}>
        <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
          <View
            style={[
              myStyles.flexRowWithGap,
              {
                alignItems: "center",
                padding: 3,
                borderWidth: 2,
                borderColor:
                  filter.filterByType === "flag"
                    ? currentTheme.IconColor
                    : currentTheme.newTaskIconColor,
                borderRadius: 6,
              },
            ]}
          >
            <MyText style={{ fontWeight: "bold" }}>Filter by Flag</MyText>

            {TaskSymbols.flags.map((_data, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeFilter("flag", _data)}
                >
                  <MyIcon
                    iconPack={_data.iconPack}
                    name={_data.name}
                    color={_data.color}
                    size={
                      (filter.filterBy &&
                        filter.filterBy.iconPack === _data.iconPack &&
                        filter.filterBy.name === _data.name &&
                        filter.filterBy.color === _data.color &&
                        30) ||
                      20
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={[
              myStyles.flexRowWithGap,
              {
                alignItems: "center",
                padding: 3,
                borderWidth: 2,
                borderColor:
                  filter.filterByType === "progress"
                    ? currentTheme.IconColor
                    : currentTheme.newTaskIconColor,
                borderRadius: 6,
              },
            ]}
          >
            <MyText style={{ fontWeight: "bold" }}>Filter by Progress</MyText>

            {TaskSymbols.progress.map((_data, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeFilter("progress", _data)}
                >
                  <MyIcon
                    iconPack={_data.iconPack}
                    name={_data.name}
                    color={_data.color}
                    size={
                      (filter.filterBy &&
                        filter.filterBy.iconPack === _data.iconPack &&
                        filter.filterBy.name === _data.name &&
                        30) ||
                      20
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            // paddingBottom: 50,
            // minHeight: '100%'
          }
        }
        data={Object.keys(myTasks.data)}
        renderItem={({ item }) => (
          <TasksContainer
            key={myTasks.data[item].id}
            title={item}
            tasks={myTasks.data[item]}
          />
        )}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CompletedTasks");
        }}
      >
        <MyText
          style={{
            textDecorationLine: "underline",
            textAlign: "center",
          }}
        >
          Check All Completed Tasks
        </MyText>
      </TouchableOpacity>

      {/*<TextInput style={myStyles.input} />*/}

      <View style={{ position: "absolute", bottom: 5, right: 5 }}>
        <TouchableOpacity onPress={() => stackOpenModal(AddNewTask)}>
          <MyIcon
            iconPack="MaterialCommunityIcons"
            name="plus-circle"
            color={currentTheme.IconColor}
            size={42}
          />
        </TouchableOpacity>
      </View>

      {/* <NewTaskModal modalVisible={newTaskModalVisible} setModalVisible={setNewTaskModalVisible} /> */}
    </View>
  );
}

export default Tasks;
