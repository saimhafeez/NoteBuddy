import React, { useRef, useState } from 'react'
import { Text, View, Button, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, TextInput, TouchableOpacity, Alert, Linking, FlatList, Switch } from "react-native";
import MyText from '../MyText'
import * as ImagePicker from 'expo-image-picker';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from "react-native";
import { useTheme } from '../../theme/ThemeManager';
import MyIcon from '../MyIcon';
import uuid from 'react-native-uuid';
import { uploadImageToCloudinary } from '../../cloudinary/cloudinary';
import hexToRbg from '../../utils/hexToRbg';
import { Modal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { createNote, updateNote } from '../../db/NotesOperations';
import { useNavigation } from '@react-navigation/native';

global.Buffer = global.Buffer || require('buffer').Buffer

const checkbox_unchecked = 'https://res.cloudinary.com/dvs8f5xki/image/upload/v1699860162/ywcme6rizv4mcazsdpxp.png'
const checkbox_checked = 'https://res.cloudinary.com/dvs8f5xki/image/upload/v1699860158/jc1fqz3gfytsflhv2ztz.png'

function NoteEditor({ route, navigation }) {

    const { width } = useWindowDimensions();
    const { myStyles, currentTheme } = useTheme()
    const editorInputRef = useRef(null)
    const editNoteInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const scrollViewRef = useRef(null);
    const [lockNote, setLockNote] = useState(false)

    // const navigation = useNavigation()

    const [editorActions, setEditorActions] = useState({
        fontWeight: 'regular',
        fontSize: 'p',
        textAlign: 'left',
        isCheckbox: false,
    })

    const [selectedInputText, setSelectedInputText] = useState({
        value: '',
        uid: '',
        type: '',
        state: '',
    })
    const [modalVisible, setModalVisible] = useState(false);


    const [note, setNote] = useState(route.params ? route.params : {
        id: '',
        title: '',
        content: '',
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        password: ''
    })

    // {
    //     html: `
    // <a href='#' style='text-decoration: none; color: black'>
    // <p style="text-align: center;">
    // Hi <strong>Saim 1</strong>
    // you have news today!
    // </p>
    // <p style="font-size: 1rem">
    // Hi <strong>Saim 1</strong>
    // you have news today!
    // </p>
    // </a>
    // <a href='image'>
    // <img src='https://images.hdqwalls.com/wallpapers/bthumb/red-hood-evolution-5k-ne.jpg'/>
    // </a>
    // <a href='https://www.google.com'>
    // <p>saim</p>
    // </a>
    //   `
    // }

    // const [source, setSource] = useState();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
            // base64: true,
            quality: 1,
        });

        // console.log(result);

        if (!result.canceled) {

            const uid = uuid.v4()

            // uploading image
            uploadImageToCloudinary({
                uri: result.assets[0].uri,
                type: `${result.assets[0].uri.split("/")[result.assets[0].uri.split("/").length - 1].split(".")[0]}/${result.assets[0].uri.split(".")[1]}`,
                name: `${result.assets[0].uri.split("/")[result.assets[0].uri.split("/").length - 1].split(".")[0]}.${result.assets[0].uri.split(".")[1]}`
            }).then((imageSource) => {
                setNote(pre => ({
                    ...pre,
                    content: pre.content + `
                    <a href='#${uid}_image#' style='text-decoration: none; color: black; margin:0px; padding:0px'>    
                        <img src='${imageSource.url}' loading="lazy" />
                    </a>`
                }))
            })
        }
    };

    function onPress(event, href) {
        if (href.includes('about:///')) {
            // Alert.alert(`You just pressed ${href}`);
            // console.log(Object.keys(event.currentTarget));
            // console.log('saom')
            // Linking.openURL(href)

            const seleted_uid = href.split('#')[1].split('_')[0]

            const type = href.split('#')[1].split('_')[1]

            // console.log(seleted_uid, type);

            // scrapping

            const chunks_unfiltered = note.content.split('</a>');

            console.log('chunks_unfiltered', chunks_unfiltered);

            // removes last element since it will be empty always
            chunks_unfiltered.pop()

            // iterating over the remaining
            chunks_unfiltered.map((chunk, index) => {

                // console.log(index, chunk);

                const uid = chunk.split('#')[1].split('_')[0]

                const value = chunk.split('>')[2].split('</')[0].trim()

                // console.log('value', value[2].split('</')[0].trim());

                // console.log(index, uid);

                if (uid === seleted_uid) {

                    // console.log(value);
                    if (type === 'checkbox') {

                        const _source = chunk.split('src=')[1].split(' ')[0];

                        setModalVisible(true);
                        setSelectedInputText({
                            value,
                            uid,
                            type,
                            state: _source === checkbox_unchecked ? 'unchecked' : 'checked'
                        })
                    } else {
                        setModalVisible(true);

                        setSelectedInputText({
                            value,
                            uid,
                            type
                        })
                    }
                    // editorInputRef.current.value = value

                }

            })

        } else {
        }
        // console.log(note.content)
    }

    const editNode = (deleteNode = false) => {
        // scrapping
        const chunks_unfiltered = note.content.split('</a>');
        // removes last element since it will be empty always
        chunks_unfiltered.pop()
        var newHTML = ''
        // iterating over the remaining
        chunks_unfiltered.map((chunk, index) => {
            const uid = chunk.split('#')[1].split('_')[0]
            if (selectedInputText.uid === uid) {
                if (!deleteNode) {
                    if (selectedInputText.type === 'checkbox') {

                        const source = chunk.split('src=')[1].split(' ')[0];
                        console.log('source', source);
                        const newSource = source === checkbox_checked ? checkbox_unchecked : checkbox_checked;
                        const newChunk = chunk.replace(source, newSource)
                        newHTML = `${newHTML} ${newChunk}
                        </a>`
                        console.log('newChunk', newChunk);
                        console.log('newHTML', newHTML);
                    } else {
                        const newChunk = `
                        ${chunk.split('>')[0]}>${chunk.split('>')[1]}>
                        ${editNoteInputRef.current.value}
                        </p>
                        </a>
                        `
                        newHTML = `${newHTML} ${newChunk}`
                    }
                }
            } else {
                newHTML = `${newHTML} ${chunk} </a>`
            }
        })
        setNote((pre) => ({
            ...pre,
            content: newHTML
        }))
        setSelectedInputText({
            value: '',
            uid: '',
            type: ''
        })
        setModalVisible(false)
    }

    const renderersProps = {
        a: {
            onPress: onPress,
            // onPressLong: () => { console.log('yoooo'); },
        }
    };

    const addNode = () => {
        var dataNode;

        const uid = uuid.v4()

        if (editorActions.isCheckbox) {
            dataNode = `<a href='#${uid}_checkbox#' style='text-decoration: none; color: black; margin:0px; padding:0px'>
            <div style='display: flex; flex-direction: row; gap: 5px; align-items: center'>
                <img src=`+ checkbox_unchecked + ` style='width: ${editorActions.fontSize === 'p' ? '1.5rem' : editorActions.fontSize === 'h1' ? '2.5rem' : editorActions.fontSize === 'h2' ? '2rem' : '1.7rem'}; align-self: center'>
                <p
                style='
                    margin:0px; padding:0px
                    text-align: ${editorActions.textAlign};
                    font-weight: ${editorActions.fontWeight};
                    font-size: ${editorActions.fontSize === 'p' ? '1rem' : editorActions.fontSize === 'h1' ? '2.5rem' : editorActions.fontSize === 'h2' ? '2rem' : '1.5rem'};
                    text-align: ${editorActions.textAlign}
                '>
                ${editorInputRef.current.value}
                </p>
            </div>
            </a>`
        } else {
            dataNode = `<a href='#${uid}_text#' style='text-decoration: none; color: black; margin:0px; padding:0px'>
        <p
        style='
            margin:0px; padding:0px
            text-align: ${editorActions.textAlign};
            font-weight: ${editorActions.fontWeight};
            font-size: ${editorActions.fontSize === 'p' ? '1rem' : editorActions.fontSize === 'h1' ? '2.5rem' : editorActions.fontSize === 'h2' ? '2rem' : '1.5rem'};
            text-align: ${editorActions.textAlign}

        '>
            ${editorInputRef.current.value}
        </p>
        </a>`
        }

        setNote((pre) => ({
            ...pre,
            content: pre.content + dataNode
        }))
        editorInputRef.current.clear()
    }

    const makeNote = () => {
        setSelectedInputText(pre => ({
            ...pre,
            value: 'Enter Title',
            type: 'addNote'
        }))
        setModalVisible(true)

    }

    const saveToDB = () => {
        // createNote()
        const data = {
            title: editNoteInputRef.current.value,
            content: note.content,
            dateAdded: note.dateAdded,
            dateModified: note.dateModified,
            password: passwordInputRef.current && passwordInputRef.current.value || null,
        }
        console.log(data);
        createNote(data).then((result) => {
            console.log('result', result);
            setModalVisible(false)
            navigation.goBack()
        })
    }

    const updateToDB = () => {
        // createNote()
        const data = {
            id: note.id,
            title: note.title,
            content: note.content,
            dateAdded: note.dateAdded,
            dateModified: new Date().toISOString(),
            password: note.password
        }
        // console.log(data);
        updateNote(data).then((result) => {
            console.log('result', result);
            setModalVisible(false)
            navigation.goBack()
        })
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme.Background }}>
            <ScrollView
                style={{ paddingHorizontal: 10 }}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                onLayout={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <RenderHtml
                    renderersProps={renderersProps}
                    contentWidth={width}
                    source={note.content === '' ? { html: '<p>Your Content will display here</p>' } : {
                        html: note.content
                    }}
                    enableExperimentalMarginCollapsing={true}
                />
            </ScrollView>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 10 }}>
                <View style={[myStyles.input, myStyles.flexRowWithGap, { alignItems: 'center' }]}>
                    <TextInput
                        // value={currentInputText}
                        placeholder='Write Here'
                        ref={editorInputRef}
                        onChangeText={text => editorInputRef.current.value = text}
                        multiline
                        style={[{ flex: 1 }]}
                    />
                    <TouchableOpacity onPress={addNode}>
                        <MyIcon iconPack='MaterialIcons' name='add' />
                    </TouchableOpacity>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5, backgroundColor: 'black' }} onPress={() => note.id === '' ? makeNote() : updateToDB()}>
                        <MyText style={{ fontWeight: 'bold', color: 'white' }}>{note.id === '' ? 'Done' : 'Save'}</MyText>
                        <MyIcon iconPack='MaterialCommunityIcons' name='note-plus-outline' color={'white'} />
                    </TouchableOpacity>
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode='none'
                        horizontal
                        contentContainerStyle={{ gap: 4 }}
                        data={[
                            {
                                groupColor: "#bcb8b1",
                                components: [{
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-bold',
                                    action: 'fontWeight',
                                    activeValue: 'bold',
                                    defaultValue: 'regular'
                                },
                                {
                                    iconPack: 'MaterialIcons',
                                    name: 'format-italic',
                                    action: 'fontSize',
                                    activeValue: 'h3',
                                    defaultValue: 'p'
                                }]
                            },
                            {
                                groupColor: "#bcb8b1",
                                components: [{
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-paragraph',
                                    action: 'fontSize',
                                    activeValue: 'p',
                                    defaultValue: 'p'
                                },
                                {
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-header-1',
                                    action: 'fontSize',
                                    activeValue: 'h1',
                                    defaultValue: 'p'
                                },
                                {
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-header-2',
                                    action: 'fontSize',
                                    activeValue: 'h2',
                                    defaultValue: 'p'
                                },
                                {
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-header-3',
                                    action: 'fontSize',
                                    activeValue: 'h3',
                                    defaultValue: 'p'
                                }]
                            },
                            {
                                groupColor: "#bcb8b1",
                                components: [{
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-list-checks',
                                    action: 'isCheckbox',
                                    activeValue: true,
                                    defaultValue: false
                                }, {
                                    iconPack: 'MaterialIcons',
                                    name: 'insert-photo',
                                    action: 'insertPhoto'
                                }, {
                                    iconPack: 'MaterialIcons',
                                    name: 'insert-link',
                                    action: 'insertLink',
                                }]
                            },
                            {
                                groupColor: "#bcb8b1",
                                components: [{
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-align-left',
                                    action: 'textAlign',
                                    activeValue: 'left',
                                    defaultValue: 'left'
                                },
                                {
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-align-center',
                                    action: 'textAlign',
                                    activeValue: 'center',
                                    defaultValue: 'left'
                                },
                                {
                                    iconPack: 'MaterialCommunityIcons',
                                    name: 'format-align-right',
                                    action: 'textAlign',
                                    activeValue: 'right',
                                    defaultValue: 'left'
                                }]
                            },
                        ]}
                        renderItem={({ item, index }) => {
                            return <View key={index} style={{ display: 'flex', flexDirection: 'row', gap: 2, borderWidth: 2, borderColor: currentTheme.linkColor, borderRadius: 5 }}>
                                {item.components.map((_item, _index) => {
                                    return <TouchableOpacity
                                        key={index + _index}
                                        onPress={() => {
                                            if (_item.action === 'insertPhoto') {
                                                pickImage()
                                            } else if (_item.action === 'insertLink') {

                                            } else {
                                                setEditorActions(pre => ({
                                                    ...pre,
                                                    [_item.action]: editorActions[_item.action] === _item.activeValue ? _item.defaultValue : _item.activeValue
                                                }))
                                            }
                                        }}
                                        style={{
                                            // backgroundColor: editorActions[item.action] === item.activeValue ? currentTheme.linkColor : 'white',
                                            padding: 2,
                                            borderRadius: 5
                                        }}>
                                        <MyIcon
                                            iconPack={_item.iconPack}
                                            name={_item.name}
                                            color={editorActions[_item.action] === _item.activeValue ? currentTheme.linkColorDanger : currentTheme.linkColor}
                                        />
                                    </TouchableOpacity>
                                })}
                            </View>
                        }}
                    />
                </View>

            </View>

            {modalVisible && <View
                style={styles.modalContainer}
            >
                <Animated.View
                    style={[styles.centeredView, { backgroundColor: `rgba(${hexToRbg(currentTheme.bottomModalBackgroundOverlay)},0.34)` }]}
                    entering={FadeIn}
                    exiting={FadeOut}
                >
                    <Pressable
                        style={{ height: '100%', width: '100%', flex: 1 }}
                        onPress={() => setModalVisible(false)} // Hide modal when the overlay is pressed
                    />

                </Animated.View>

                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={styles.modal}
                >
                    <KeyboardAvoidingView
                        behavior='padding'
                    >
                        <View
                            style={[styles.modalView, { backgroundColor: currentTheme.bottomModalBackground }]}>

                            {selectedInputText.type === 'addNote' && <View style={[myStyles.flexRowWithGap, { justifyContent: "flex-end", alignItems: "center" }]}>
                                <MyText>Lock Note</MyText>
                                <Switch
                                    trackColor={{ false: '#5b6569', true: '#81b0ff' }}
                                    thumbColor={lockNote ? currentTheme.linkColor : '#1d2021'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => setLockNote(pre => !pre)}
                                    value={lockNote}
                                />
                            </View>}

                            {selectedInputText.type !== 'checkbox' && <View style={[myStyles.input, myStyles.flexRowWithGap, { alignItems: 'center' }]}>
                                <TextInput
                                    // value={}
                                    placeholder={selectedInputText.value}
                                    ref={editNoteInputRef}
                                    onChangeText={text => editNoteInputRef.current.value = text}
                                    multiline
                                    style={[{ flex: 1 }]}
                                />
                            </View>}

                            {selectedInputText.type === 'addNote' && lockNote &&
                                <View>
                                    <View style={[myStyles.input, myStyles.flexRowWithGap, { alignItems: 'center' }]}>
                                        <TextInput
                                            // value={}
                                            placeholder={'Enter Password'}
                                            textContentType='none'
                                            keyboardType='visible-password'
                                            ref={passwordInputRef}
                                            onChangeText={text => passwordInputRef.current.value = text}
                                            multiline
                                            style={[{ flex: 1 }]}
                                        />
                                    </View>

                                </View>
                            }

                            <View style={[myStyles.flexRowWithGap, { justifyContent: 'flex-end' }]}>

                                {selectedInputText.type !== 'addNote' && <TouchableOpacity onPress={() => editNode(true)} style={[myStyles.button, { backgroundColor: currentTheme.linkColorDanger }]}>
                                    <MyText style={{ color: 'white' }}>Delete</MyText>
                                </TouchableOpacity>
                                }

                                {selectedInputText.type !== 'checkbox' && <TouchableOpacity style={[myStyles.button]} onPress={() => selectedInputText.type !== 'addNote' ? editNode(false) : saveToDB()}>
                                    <MyText>Save</MyText>
                                </TouchableOpacity>}

                                {selectedInputText.type === 'checkbox' &&
                                    <TouchableOpacity style={[myStyles.button]} onPress={() => editNode(false)}>
                                        <MyText>{selectedInputText.state && selectedInputText.state === 'checked' ? 'Mark as Undone' : 'Mark as Done'}</MyText>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Animated.View>

            </View>}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flex: 1,
        height: '100%'
    },
    modal: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flex: 1,
    },
    centeredView: {
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    }
});

export default NoteEditor