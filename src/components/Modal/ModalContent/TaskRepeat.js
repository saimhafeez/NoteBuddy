import { FlatList, TouchableOpacity, View } from "react-native";
import MyText from "../../MyText";
import { useEffect, useState } from "react";
import { useTheme } from "../../../theme/ThemeManager";
import { useModal } from "../ModalContext";
import MyIcon from "../../MyIcon";
import { addNewToDoCategory } from "../../../db/TodoCategories";

function TaskRepeat() {
  const { setDataForModal, getModalData, stackCloseModal } = useModal();

  const { currentTheme, myStyles } = useTheme();

  const [repeat, setRepeat] = useState("");

  useEffect(() => {
    const mData = getModalData("TaskSchedule");
    if (Object.keys(mData).includes("repeat")) setRepeat(mData.repeat);
  }, []);

  getSelectedTaskStyle = (item) => {
    return repeat === item
      ? {
          color: currentTheme.Background,
          backgroundColor: currentTheme.linkColor,
          fontWeight: "bold",
        }
      : {};
  };

  return (
    <View style={{ gap: 5 }}>
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
              repeat,
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
            // width: 100,
            // backgroundColor: currentTheme.TextFieldBackground
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

      <FlatList
        contentContainerStyle={{ justifyContent: "center", gap: 5 }}
        columnWrapperStyle={{ gap: 5 }}
        // horizontal={true}
        data={["Daily", "Weekly", "Monthly", "Yearly"]}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setRepeat(item)}>
            <MyText
              style={{
                ...myStyles.button,
                textAlign: "center",
                ...getSelectedTaskStyle(item),
              }}
            >
              {item}
            </MyText>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => setRepeat("")}>
        <MyText
          style={{
            ...myStyles.button,
            textAlign: "center",
            ...getSelectedTaskStyle(""),
          }}
        >
          No Repeat
        </MyText>
      </TouchableOpacity>
    </View>
  );
}

export default TaskRepeat;
