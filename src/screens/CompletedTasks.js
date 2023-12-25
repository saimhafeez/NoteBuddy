import { FlatList, Text, View } from "react-native";
import MyText from "../components/MyText";
import { useTheme } from "../theme/ThemeManager";
import { useEffect, useState } from "react";
import { getTodos } from "../db/ToDoOperations";
import Task from "../components/Tasks/Task";
import MyIcon from "../components/MyIcon";
import Animated, { FadeIn } from "react-native-reanimated";

function CompletedTasks() {
  const { currentTheme, fonts, myStyles } = useTheme();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const todos = [];
    getTodos().then((results) => {
      for (const todo of results) {
        if (todo.isCompleted) {
          todos.push(todo);
        }
      }
    });
    setTodos(todos);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.Background }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // gap: 10,
          paddingHorizontal: 12,
        }}
        data={todos}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeIn.delay(index * 150)}
            style={[
              myStyles.flexRowWithGap,
              {
                // backgroundColor: 'red',
                // borderRightWidth: 5,
                // borderRightColor: 'pink',
                position: "relative",
              },
            ]}
          >
            <View
              style={[
                myStyles.flexRowWithGap,
                {
                  paddingVertical: 10,
                  marginLeft: 5,
                  flex: 1,
                  // backgroundColor: 'blue'
                },
              ]}
            >
              <View
                style={{
                  marginLeft: 10,
                  padding: 10,
                  backgroundColor: currentTheme.TextFieldBackground,
                  flex: 1,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MyText>{item.task.title}</MyText>
                {item.task.schedule.date && (
                  <MyText style={{ fontSize: 10 }}>
                    {item.task.schedule.date.replaceAll("-", "/")}
                  </MyText>
                )}
              </View>
              {/* <MyText>{item.task.schedule.date}</MyText> */}
            </View>

            {/* <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}>

              <Text>Centered text</Text>
            </View> */}

            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                justifyContent: index === 0 ? "flex-end" : "flex-start",
              }}
            >
              <View
                style={{
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // flex: 0.1,
                  height:
                    index === 0 || index === todos.length - 1 ? "50%" : "100%",
                  borderLeftWidth: 1,
                  borderLeftColor: currentTheme.IconColor,
                  marginLeft: 6,
                }}
              />
            </View>

            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MyIcon name="circle" size={15} iconPack="FontAwesome" />
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

export default CompletedTasks;
