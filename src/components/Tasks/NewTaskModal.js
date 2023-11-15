import {
    StyleSheet,
    View,
    Modal,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity, FlatList
} from "react-native";
import {useEffect, useState} from "react";
import hexToRbg from "../../utils/hexToRbg";
import {useTheme} from "../../theme/ThemeManager";
import MyText from "../MyText";
import MyIcon from "../MyIcon";
import {getToDoCategories} from "../../db/TodoCategories";


function NewTaskModal({children, modalVisible, setModalVisible}) {

    const {currentTheme} = useTheme()
    const [categorySelectionModal, setCategorySelectionModal] = useState({
        setActive: false,
        categories: []
    });

    const [task, setTask] = useState({
        title: '',
        schedule: '',
        subTasks: [],
        category: ''
    });

    useEffect(() => {
        getToDoCategories().then((results) => {
            setCategorySelectionModal(prevState => ({
                ...prevState,
                categories: results
            }))
        })
    }, []);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={modalVisible}
            // statusBarTranslucent={true}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <TouchableOpacity
                activeOpacity={1} // To prevent any opacity change
                style={[styles.centeredView, {backgroundColor: `rgba(${hexToRbg(currentTheme.bottomModalBackgroundOverlay)},0.34)`}]}
                onPress={() => setModalVisible(!modalVisible)} // Hide modal when the overlay is pressed
            />
            <KeyboardAvoidingView
                style={[{backgroundColor: `rgba(${hexToRbg(currentTheme.bottomModalBackgroundOverlay)},0.34)`}]}
                behavior='padding'>
                {
                    categorySelectionModal.setActive ? <View style={[styles.modalView, {backgroundColor: currentTheme.bottomModalBackground}]}>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                            <TouchableOpacity
                                onPress={() => setCategorySelectionModal(prevState => ({
                                    ...prevState,
                                    setActive: false
                                }))}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    padding: 5,
                                    // width: 100,
                                    // backgroundColor: currentTheme.TextFieldBackground
                                }}>
                                <View style={{display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center'}}>
                                    <MyIcon iconPack='AntDesign' color={currentTheme.linkColorDanger} size={26} name='back' />
                                    {/*<MyText style={{fontWeight: 'bold', color: currentTheme.linkColorDanger}}>Back</MyText>*/}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            contentContainerStyle={{
                                backgroundColor: currentTheme.TextFieldBackground,
                                borderRadius: 10,
                                padding: 5
                            }}
                            style={{
                                maxHeight: 130,
                            }}
                            data={[
                                {name: 'No Category'},
                                ...categorySelectionModal.categories
                            ]}
                            renderItem={({item}) => <TouchableOpacity style={{paddingVertical: 1}} onPress={() => {
                                setTask(prevState => ({
                                    ...prevState,
                                    category: item.name === 'No Category' ? '' : item.name
                                }))
                                setCategorySelectionModal(prevState => ({
                                    ...prevState,
                                    setActive: false
                                }))
                            }}>
                                <MyText style={{fontWeight: 'bold', color: item.name === 'No Category' ? currentTheme.linkColorDanger : currentTheme.linkColor}}>{item.name}</MyText>
                            </TouchableOpacity>}
                        />

                            <TextInput
                                style={[styles.input, {borderColor: currentTheme.TextFieldBackground, color: currentTheme.TextColor, backgroundColor: currentTheme.TextFieldBackground}]}
                                placeholder={'Create new Category'}
                                placeholderTextColor={`rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`}
                                onChangeText={(text) => {
                                    setTask(prevState => ({
                                        ...prevState,
                                        title: text
                                    }))
                                }}
                                // value={''}
                            />
                    </View> :
                        <View style={[styles.modalView, {backgroundColor: currentTheme.bottomModalBackground}]}>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10}} >
                                <View style={{flex: 1}}>
                                    <TextInput
                                        style={[styles.input, {borderColor: currentTheme.TextFieldBackground, color: currentTheme.TextColor, backgroundColor: currentTheme.TextFieldBackground}]}
                                        placeholder={'Input Task Here'}
                                        placeholderTextColor={`rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`}
                                        onChangeText={(text) => {
                                            setTask(prevState => ({
                                                ...prevState,
                                                title: text
                                            }))
                                        }}
                                        // value={''}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => console.log(task)}>
                                    <View style={[styles.iconWrapper, {backgroundColor: currentTheme.newTaskIconBackgroundColor}]}>
                                        <MyIcon iconPack='FontAwesome' name='location-arrow' color={currentTheme.newTaskIconColor} size={35} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: currentTheme.TextFieldBackground,
                                        borderRadius: 20,
                                        padding: 5
                                    }}
                                    onPress={() => setCategorySelectionModal(prevState => ({
                                        ...prevState,
                                        setActive: true
                                    }))}
                                >
                                    <MyText style={{color: `rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`, fontWeight: 'bold'}}>
                                        {task.category || 'No Category'}
                                    </MyText>
                                </TouchableOpacity>
                                <MyText>Schedule</MyText>
                                <MyText>Sub Task</MyText>
                            </View>
                        </View>
                }
            </KeyboardAvoidingView>

        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // marginTop: 22,
        // backgroundColor: "rgba(0,0,0,0.36)"
    },

    modalView: {
        width: "100%",
        gap: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 19,
    },
    input: {
        // height: 40,
        width: '100%',
        // margin: 12,
        borderWidth: 0.5,
        borderRadius: 15,
        padding: 10,
    },
    iconWrapper: {
        transform: [{ rotate: '-45deg' }],
        backgroundColor: 'red',
        borderRadius: 21,
        width: 42,
        height: 42,
        padding: 5
    },
    content: {
        // padding: 16,
        // backgroundColor: 'pink',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Android shadow'
    },
    popoverIconContainer: {
        gap: 10
    },
    popoverIconList: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15
    },
    arrow: {
        margin: 300,
        borderTopColor: 'pink'
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
    }
})

export default NewTaskModal