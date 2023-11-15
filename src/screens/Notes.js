import { Text, View, Button, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { useModal } from "../components/Modal/ModalContext";
import AddAudioNote from "../components/Modal/ModalContent/AddAudioNote";
import { useTheme } from "../theme/ThemeManager";
import MyIcon from "../components/MyIcon";
import React, { useRef, useState, useEffect } from "react";

import { StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Notes() {

    const { openModal } = useModal();

    //const _editor = React.createRef();

    const navigator = useNavigation()

    const richText = React.createRef() || useRef();

    const { myStyles, currentTheme } = useTheme()


    const [notes, setNotes] = useState([
        {
            folder: '',
            title: 'Todos',
            content: '',
            dateAdded: '10-14-2023T12:15:00',
            dateModified: '10-18-2023T09:00:00'
        }
    ])
    const [selectedFolder, setSelectedFolder] = useState('')
    //() => openModal(AddAudioNote)


    const ListView = () => {
        return (
            <View>

            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.Background, padding: 10 }}>
            <View style={[myStyles.flexRowWithGap, { justifyContent: 'space-between', padding: 10 }]}>

                <MyIcon iconPack='AntDesign' name='addfolder' />

                <MyIcon iconPack='FontAwesome' name='file-audio-o' />

                <TouchableOpacity onPress={() => {
                    navigator.navigate('NoteEditor')
                }}>
                    <MyIcon iconPack='MaterialCommunityIcons' name='note-plus-outline' />
                </TouchableOpacity>

            </View>

            {/* {TempScreen()} */}
        </View>

    )
}


const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    root: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea',
    },
    editor: {
        flex: 1,
        padding: 0,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 30,
        marginVertical: 5,
        backgroundColor: 'white',
    },
});

export default Notes;
