import { View, StyleSheet, Text, Pressable, TouchableOpacity, TextInput } from "react-native";
import { useRef, useState } from "react";
import Icon from 'react-native-vector-icons/AntDesign'
import MyText from "../MyText";
import { useTheme } from "../../theme/ThemeManager";
import Task from "./Task";
import TaskSymbolSelectionModal from "../Modal/TaskSymbolSelectionModal";

import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown, SlideInLeft,
    SlideInUp,
    SlideOutDown, SlideOutRight,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';

function TasksContainer({ title, tasks }) {

    const [isCollapse, setIsCollapse] = useState(false);
    const { currentTheme, myStyles } = useTheme()

    return (
        <Animated.View style={styles.container}>
            <TouchableOpacity onPress={() => setIsCollapse(!isCollapse)}>
                <View style={styles.row}>
                    <MyText style={{ ...styles.title, color: currentTheme.IconColor }}>{title}</MyText>
                    <Icon name={isCollapse ? 'caretdown' : 'caretup'} color={currentTheme.IconColor} size={16} />
                </View>
            </TouchableOpacity>
            {
                !isCollapse &&
                <View
                    style={{ flex: 1, gap: 5, display: "flex" }}
                >
                    {tasks.map((task, index) => {
                        // console.log('task', task)
                        return <Animated.View
                            key={index}
                            entering={SlideInLeft.delay((index * 100))}
                        // exiting={SlideOutRight}
                        >
                            <Task data={task} key={index} />
                        </Animated.View>
                    })}
                </View>
            }
            {/*<TextInput style={myStyles.input} />*/}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        marginVertical: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    }
})

export default TasksContainer