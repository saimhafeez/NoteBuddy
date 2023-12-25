import MyText from "../../MyText";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../theme/ThemeManager";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import hexToRbg from "../../../utils/hexToRbg";
import MyIcon from "../../MyIcon";
import { addNewToDoCategory } from "../../../db/TodoCategories";
import { useModal } from "../ModalContext";
import TimeSelection from "./TimeSelection";
import TaskRepeat from "./TaskRepeat";

function TaskSchedule({ data }) {
  const [schedule, setSchedule] = useState({
    date: (data && data.date) || getCurrentDate(),
    time: (data && data.time) || "",
    repeat: (data && data.repeat) || "",
  });

  const {
    stackCloseModalAndDispose,
    setDataForModal,
    getModalData,
    openModal,
    stackCloseModal,
  } = useModal();
  const { myStyles, currentTheme, fonts } = useTheme();

  useEffect(() => {
    const mData = getModalData("TaskSchedule");
    setDataForModal("TaskSchedule", {
      ...mData,
      date: schedule.date,
    });
  }, [schedule.date]);

  const scheduleTask = () => {
    // console.log('data', getModalData('AddNewTask'))
    // console.log('schedule', schedule)

    const mData = getModalData("AddNewTask");

    // console.log('-------> ', mData);

    mData
      ? setDataForModal("AddNewTask", {
          ...mData,
          schedule,
        })
      : setDataForModal("AddNewTask", {
          schedule,
        });
    stackCloseModalAndDispose();
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 10 }}>
      <View
        style={[
          myStyles.flexRowWithGap,
          { alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        <TouchableOpacity
          onPress={() => stackCloseModalAndDispose()}
          style={[
            myStyles.flexRowWithGap,
            {
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              padding: 5,
            },
          ]}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 0,
              alignItems: "center",
            }}
          >
            <MyIcon
              iconPack="AntDesign"
              color={currentTheme.linkColorDanger}
              size={26}
              name="back"
            />
            {/*<MyText style={{fontWeight: 'bold', color: currentTheme.linkColorDanger}}>Back</MyText>*/}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={scheduleTask}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 5,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 0,
              alignItems: "center",
            }}
          >
            <MyText
              style={{ fontWeight: "bold", color: currentTheme.linkColor }}
            >
              Save
            </MyText>
          </View>
        </TouchableOpacity>
      </View>

      <Calendar
        style={{
          borderRadius: 10,
        }}
        collapsable={true}
        theme={{
          calendarBackground: currentTheme.TextFieldBackground,
          textSectionTitleColor: currentTheme.linkColor,
          selectedDayBackgroundColor: currentTheme.linkColor,
          selectedDayTextColor: currentTheme.Background,
          todayTextColor: currentTheme.linkColor,
          dayTextColor: currentTheme.TextColor,
          textDisabledColor: `rgba(${hexToRbg(currentTheme.TextColor)},0.34)`,
          monthTextColor: currentTheme.linkColor,
          arrowColor: currentTheme.linkColor,
          textDayFontFamily: fonts.futura_lig,
          textMonthFontFamily: fonts.futura_lig,
          todayButtonFontFamily: fonts.futura_lig,
          textDayHeaderFontFamily: fonts.futura_lig,
        }}
        onDayPress={(day) => {
          setSchedule((prevState) => ({ ...prevState, date: day.dateString }));
        }}
        markedDates={{
          [schedule.date]: { selected: true, disableTouchEvent: true },
        }}
      />

      <View style={[myStyles.flexRowWithGap, { flexWrap: "wrap" }]}>
        <TouchableOpacity
          style={[
            myStyles.button,
            schedule.date === "" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() =>
            setSchedule((prevState) => ({ ...prevState, date: "" }))
          }
        >
          <MyText
            style={
              schedule.date === "" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            No Date
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            schedule.date === getDateFromNow(0) && {
              backgroundColor: currentTheme.linkColor,
            },
          ]}
          onPress={() =>
            setSchedule((prevState) => ({
              ...prevState,
              date: getDateFromNow(0),
            }))
          }
        >
          <MyText
            style={
              schedule.date === getDateFromNow(0) && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            Today
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            schedule.date === getDateFromNow(1) && {
              backgroundColor: currentTheme.linkColor,
            },
          ]}
          onPress={() =>
            setSchedule((prevState) => ({
              ...prevState,
              date: getDateFromNow(1),
            }))
          }
        >
          <MyText
            style={
              schedule.date === getDateFromNow(1) && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            Tomorrow
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            schedule.date === getDateFromNow(3) && {
              backgroundColor: currentTheme.linkColor,
            },
          ]}
          onPress={() =>
            setSchedule((prevState) => ({
              ...prevState,
              date: getDateFromNow(3),
            }))
          }
        >
          <MyText
            style={
              schedule.date === getDateFromNow(3) && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            3 Days Later
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            schedule.date === getNearestSundayDate() && {
              backgroundColor: currentTheme.linkColor,
            },
          ]}
          onPress={() =>
            setSchedule((prevState) => ({
              ...prevState,
              date: getNearestSundayDate(),
            }))
          }
        >
          <MyText
            style={
              schedule.date === getNearestSundayDate() && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            This Sunday
          </MyText>
        </TouchableOpacity>
      </View>

      <View style={myStyles.flexColumnWithGap}>
        <TouchableOpacity
          onPress={() => openModal(TimeSelection)}
          style={[
            myStyles.flexRowWithGap,
            { justifyContent: "space-between" },
            myStyles.button,
          ]}
        >
          <View style={myStyles.flexRowWithGap}>
            <MyIcon
              iconPack="MaterialIcons"
              name="timer"
              color={currentTheme.linkColor}
              size={26}
            />
            <MyText>Time</MyText>
          </View>
          <MyText>{schedule.time || "No"}</MyText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openModal(TaskRepeat)}
          style={[
            myStyles.flexRowWithGap,
            { justifyContent: "space-between" },
            myStyles.button,
          ]}
        >
          <View style={myStyles.flexRowWithGap}>
            <MyIcon
              iconPack="MaterialIcons"
              name="repeat"
              color={currentTheme.linkColor}
              size={26}
            />
            <MyText>Repeat</MyText>
          </View>
          <MyText>{schedule.repeat || "No"}</MyText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => console.log(schedule)}>
        <MyText>save</MyText>
      </TouchableOpacity>
    </ScrollView>
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
});

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are 0-based
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function getDateFromNow(days) {
  const currentDate = new Date();
  const targetDate = new Date(
    currentDate.getTime() + days * 24 * 60 * 60 * 1000
  );

  // Format the target date as "YYYY-MM-DD"
  return formatDate(targetDate);
}

function getNearestSundayDate() {
  const currentDate = new Date();
  const daysUntilSunday = 7 - currentDate.getDay(); // Calculate the number of days until Sunday (0: Sunday, 1: Monday, ..., 6: Saturday)

  // Calculate the date of the nearest Sunday in the future
  const nearestSundayDate = new Date(
    currentDate.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000
  );

  // Format the nearest Sunday date as "YYYY-MM-DD"
  return formatDate(nearestSundayDate);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are 0-based
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default TaskSchedule;
