import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import MyIcon from "../../MyIcon";
import { addNewToDoCategory } from "../../../db/TodoCategories";
import MyText from "../../MyText";
import { useTheme } from "../../../theme/ThemeManager";
import { useEffect, useState } from "react";
import { useModal } from "../ModalContext";

function TimeSelection() {
  const { stackCloseModal, setDataForModal, getModalData, stackOpenModal } =
    useModal();
  const { myStyles, currentTheme } = useTheme();

  const [time, setTime] = useState(getCurrentTime12Hour());

  // useEffect(() => {
  //     const mData = getModalData('TaskSchedule')
  //     setDataForModal('TaskSchedule', {
  //         ...mData,
  //         time: time
  //     })
  // }, [time]);

  useEffect(() => {
    const mData = getModalData("TaskSchedule");
    if (Object.keys(mData).includes("time")) setTime(mData.time);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ gap: 10 }}>
      <View
        style={[
          myStyles.flexRowWithGap,
          { alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        <TouchableOpacity
          onPress={() => stackCloseModal()}
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
          onPress={() => {
            const mData = getModalData("TaskSchedule");
            setDataForModal("TaskSchedule", {
              ...mData,
              time: time,
            });
            stackCloseModal();
          }}
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

      <View
        style={[
          myStyles.flexRowWithGap,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <View style={myStyles.flexColumnWithGap}>
          <TextInput
            style={[myStyles.button, { textAlign: "center", height: 50 }]}
            value={time ? time.split(":")[0] : "-"}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              setTime(`${text}:${time.split(":")[1]}`);
            }}
            editable={!!time}
            onEndEditing={(text) => {
              const hour = text.nativeEvent.text;
              if (parseInt(hour) < 1 || parseInt(hour) > 12 || hour === "") {
                setTime(`12:${time.split(":")[1]}`);
              } else {
                setTime(
                  `${parseInt(hour) < 10 ? `0${hour}` : hour}:${
                    time.split(":")[1]
                  }`
                );
              }
            }}
          />
          <MyText>hour</MyText>
        </View>
        <View style={myStyles.flexColumnWithGap}>
          {/*<TextInput*/}
          {/*    style={[{textAlign: 'center'}]}*/}
          {/*    value={':'}*/}
          {/*    keyboardType='decimal-pad'*/}
          {/*/>*/}
          <MyText>:</MyText>
          <MyText></MyText>
        </View>
        <View style={myStyles.flexColumnWithGap}>
          <TextInput
            style={[myStyles.button, { textAlign: "center", height: 50 }]}
            value={time ? time.split(":")[1].split(" ")[0] : "-"}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              //07:30 PM
              setTime(`${time.split(":")[0]}:${text} ${time.split(" ")[1]}`);
            }}
            editable={!!time}
            clearTextOnFocus={true}
            onEndEditing={(text) => {
              const min = text.nativeEvent.text;
              if (parseInt(min) < 0 || parseInt(min) > 59 || min === "") {
                setTime(`${time.split(":")[0]}:00 ${time.split(" ")[1]}`);
              } else {
                setTime(
                  `${time.split(":")[0]}:${
                    parseInt(min) < 10 ? `0${min}` : min
                  } ${time.split(" ")[1]}`
                );
              }
            }}
          />
          <MyText>minute</MyText>
        </View>

        <View style={myStyles.flexColumnWithGap}>
          <TouchableOpacity
            style={[myStyles.button, { justifyContent: "center", height: 50 }]}
            onPress={() =>
              time &&
              time.split(" ")[1] !== "-" &&
              setTime(
                `${time.split(" ")[0]} ${
                  time.split(" ")[1] !== "-" && time.split(" ")[1] === "PM"
                    ? "AM"
                    : "PM"
                }`
              )
            }
          >
            <MyText>{time ? time.split(" ")[1] : "-"}</MyText>
          </TouchableOpacity>
          <MyText></MyText>
        </View>
      </View>

      <View
        style={[
          myStyles.flexRowWithGap,
          { flexWrap: "wrap", justifyContent: "center" },
        ]}
      >
        <TouchableOpacity
          style={[
            myStyles.button,
            time === "" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("")}
        >
          <MyText
            style={
              time === "" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            No Time
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "07:00 AM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("07:00 AM")}
        >
          <MyText
            style={
              time === "07:00 AM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            07:00 AM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "09:00 AM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("09:00 AM")}
        >
          <MyText
            style={
              time === "09:00 AM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            09:00 AM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "10:00 AM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("10:00 AM")}
        >
          <MyText
            style={
              time === "10:00 AM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            10:00 AM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "12:00 PM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("12:00 PM")}
        >
          <MyText
            style={
              time === "12:00 PM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            12:00 PM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "02:00 PM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("02:00 PM")}
        >
          <MyText
            style={
              time === "02:00 PM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            02:00 PM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "04:00 PM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("04:00 PM")}
        >
          <MyText
            style={
              time === "04:00 PM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            04:00 PM
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            myStyles.button,
            time === "06:00 PM" && { backgroundColor: currentTheme.linkColor },
          ]}
          onPress={() => setTime("06:00 PM")}
        >
          <MyText
            style={
              time === "06:00 PM" && {
                color: currentTheme.Background,
                fontWeight: "bold",
              }
            }
          >
            06:00 PM
          </MyText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function getCurrentTime12Hour() {
  const currentDate = new Date();
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time as "hh:mm AM/PM"
  // return {
  //     hour: hours.toString().padStart(2, '0'),
  //     minute: minutes.toString().padStart(2, '0'),
  //     ampm: ampm,
  //     formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`
  // }
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

export default TimeSelection;
