import {FlatList, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import MyIcon from "../../MyIcon";
import MyText from "../../MyText";
import hexToRbg from "../../../utils/hexToRbg";
import {useTheme} from "../../../theme/ThemeManager";
import {useModal} from "../ModalContext";
import {useEffect, useState} from "react";
import {addNewToDoCategory, getToDoCategories} from "../../../db/TodoCategories";

function TaskCategorySelection(){

    const {myStyles, currentTheme} = useTheme()
    const {stackCloseModal, setDataForModal, getModalData} = useModal()
    const [taskCategories, setTaskCategories] = useState([]);

    const [newCategory, setNewCategory] = useState()

    useEffect(() => {
        getToDoCategories().then((categories) => {
            setTaskCategories(categories)
        })
    }, []);

    return(
        <View style={{gap: 10}}>
            <View style={[myStyles.flexRowWithGap, {alignItems: 'center', justifyContent: 'space-between'}]}>

                <TouchableOpacity
                    onPress={() => stackCloseModal()}
                    style={[myStyles.flexRowWithGap, {
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        padding: 5,
                    }]}>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center'}}>
                        <MyIcon iconPack='AntDesign' color={currentTheme.linkColorDanger} size={26} name='back' />
                        {/*<MyText style={{fontWeight: 'bold', color: currentTheme.linkColorDanger}}>Back</MyText>*/}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        addNewToDoCategory(newCategory).then((data) => {
                            const mData = getModalData('AddNewTask')
                            setDataForModal('AddNewTask', {
                                ...mData,
                                category: newCategory
                            })
                            stackCloseModal()
                        }).catch((err) => console.log(err))
                    }}
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
                        <MyText style={{fontWeight: 'bold', color: currentTheme.linkColor}}>Save</MyText>
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                contentContainerStyle={myStyles.input}
                style={{
                    maxHeight: 130,
                }}
                data={[
                    {name: 'No Category'},
                    ...taskCategories
                ]}
                renderItem={({item}) => <TouchableOpacity style={{paddingVertical: 1}} onPress={() => {
                    const mData = getModalData('AddNewTask')
                    setDataForModal('AddNewTask', {
                        ...mData,
                        category: item.name
                    })
                    stackCloseModal()
                }}>
                    <MyText style={{fontWeight: 'bold', color: item.name === 'No Category' ? currentTheme.linkColorDanger : currentTheme.linkColor}}>{item.name}</MyText>
                </TouchableOpacity>}
            />

            <TextInput
                style={myStyles.input}
                placeholder={'Create new Category'}
                placeholderTextColor={`rgba(${hexToRbg(currentTheme.TextColor)}, 0.34)`}
                onChangeText={(text) => {
                    setNewCategory(text)
                }}
            />
        </View>
    )
}

export default TaskCategorySelection