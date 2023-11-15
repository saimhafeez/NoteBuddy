import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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




function Tasks() {

    const navigation = useNavigation()

    const { currentTheme, myStyles } = useTheme()

    const { stackOpenModal, getModalData, taskSymbolChanged } = useModal(); //TaskSchedule

    const { taskMarkChanged, setTaskMarkChanged } = useUiRefresh();

    const [myTasks, setMyTasks] = useState({
        isLoading: true,
        data: {
            'Completed Today': [],
            'Future': [],
        }
    })

    useEffect(() => {
        setMyTasks({
            isLoading: true,
            data: {
                'Completed Today': [],
                'Previous': [],
                'Today': [],
                'Future': [],
            }
        })
        getTodos().then((results) => {

            // console.log('results', results[3].task.schedule)

            for (const result of results) {

                if ((result.task.schedule.date === '') && !result.isCompleted) {
                    setMyTasks(prevState => ({
                        ...prevState,
                        data: {
                            ...prevState.data,
                            'Future': [...prevState.data.Future, result]
                        }
                    }))
                } else {
                    if (TwentyFourHoursFormat(result.task.schedule).toDateString() === new Date().toDateString() && !result.isCompleted) {
                        setMyTasks(prevState => ({
                            ...prevState,
                            data: {
                                ...prevState.data,
                                'Today': [...prevState.data.Today, result]
                            }
                        }))
                    } else if (TwentyFourHoursFormat(result.task.schedule) > new Date() && !result.isCompleted) {
                        setMyTasks(prevState => ({
                            ...prevState,
                            data: {
                                ...prevState.data,
                                'Future': [...prevState.data.Future, result]
                            }
                        }))
                    } else if (TwentyFourHoursFormat(result.task.schedule) < new Date() && !result.isCompleted) {
                        setMyTasks(prevState => ({
                            ...prevState,
                            data: {
                                ...prevState.data,
                                'Previous': [...prevState.data.Previous, result]
                            }
                        }))
                    } else if (result.completedOn.split('T')[0] === new Date().toISOString().split('T')[0] && result.isCompleted) {
                        setMyTasks(prevState => ({
                            ...prevState,
                            data: {
                                ...prevState.data,
                                'Completed Today': [...prevState.data['Completed Today'], result]
                            }
                        }))
                    }
                }

            }
        })
    }, [taskMarkChanged]);

    return (
        <View
            style={{ flex: 1, backgroundColor: currentTheme.Background, padding: 10, position: 'relative' }}
        >
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    // paddingBottom: 50,
                    // minHeight: '100%'
                }}
                data={Object.keys(myTasks.data)}
                renderItem={({ item }) => (
                    <TasksContainer key={myTasks.data[item].id} title={item} tasks={myTasks.data[item]} />
                )}
            />

            <TouchableOpacity onPress={() => {
                navigation.navigate('CompletedTasks')
            }}>


                <MyText
                    style={{
                        textDecorationLine: 'underline',
                        textAlign: 'center'
                    }}
                >
                    Check All Completed Tasks
                </MyText>
            </TouchableOpacity>

            {/*<TextInput style={myStyles.input} />*/}

            <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                <TouchableOpacity onPress={() => stackOpenModal(AddNewTask)}>
                    <MyIcon iconPack='MaterialCommunityIcons' name='plus-circle' color={currentTheme.IconColor} size={42} />
                </TouchableOpacity>
            </View>

            {/* <NewTaskModal modalVisible={newTaskModalVisible} setModalVisible={setNewTaskModalVisible} /> */}
        </View>
    )
}

export default Tasks;
