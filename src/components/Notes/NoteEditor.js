import React, { useRef, useState } from 'react'
import { Text, View, Button, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, TextInput, TouchableOpacity, Alert, Linking, FlatList } from "react-native";
import MyText from '../MyText'
import * as ImagePicker from 'expo-image-picker';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from "react-native";
import { useTheme } from '../../theme/ThemeManager';
import MyIcon from '../MyIcon';

import { encode } from 'base-64';

import { Cloudinary } from "@cloudinary/url-gen";
import { uploadImageToCloudinary } from '../../cloudinary/cloudinary';
import hexToRbg from '../../utils/hexToRbg';

global.Buffer = global.Buffer || require('buffer').Buffer

const checkbox_unchecked = 'https://res.cloudinary.com/dvs8f5xki/image/upload/v1699860162/ywcme6rizv4mcazsdpxp.png'
const checkbox_checked = 'https://res.cloudinary.com/dvs8f5xki/image/upload/v1699860158/jc1fqz3gfytsflhv2ztz.png'

function NoteEditor() {

    const { width } = useWindowDimensions();
    const { myStyles, currentTheme } = useTheme()
    const editorInputRef = useRef(null)
    const scrollViewRef = useRef(null);

    const [editorActions, setEditorActions] = useState({
        fontWeight: 'regular',
        fontSize: 'p',
        textAlign: 'left',
        isCheckbox: false,

    })

    const [currentInputText, setCurrentInputText] = useState('')

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

    const [source, setSource] = useState({
        html: ``
    });

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

            // uploading image
            uploadImageToCloudinary({
                uri: result.assets[0].uri,
                type: `${result.assets[0].uri.split("/")[result.assets[0].uri.split("/").length - 1].split(".")[0]}/${result.assets[0].uri.split(".")[1]}`,
                name: `${result.assets[0].uri.split("/")[result.assets[0].uri.split("/").length - 1].split(".")[0]}.${result.assets[0].uri.split(".")[1]}`
            }).then((imageSource) => {
                setSource(pre => ({
                    ...pre,
                    html: pre.html + `
                    <a href='#image' style='text-decoration: none; color: black; margin:0px; padding:0px'>    
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
            console.log(source.html.split('</a>').length);
            console.log(source.html.split('</a>')[0]);
            console.log(source.html.split('</a>')[1]);
            console.log(source.html.split('</a>')[2]);

        } else {
        }
        // console.log(source)
    }

    const renderersProps = {
        a: {
            onPress: onPress,
            // onPressLong: () => { console.log('yoooo'); },
        }
    };

    const addNode = () => {
        var dataNode;
        if (editorActions.isCheckbox) {
            dataNode = `<a href='#checkbox' style='text-decoration: none; color: black; margin:0px; padding:0px'>
            <div style='display: flex; flex-direction: row; gap: 5px; align-items: center'>
                <img src=`+ checkbox_checked + ` style='width: ${editorActions.fontSize === 'p' ? '1.5rem' : editorActions.fontSize === 'h1' ? '2.5rem' : editorActions.fontSize === 'h2' ? '2rem' : '1.7rem'}; align-self: center'>
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
            dataNode = `<a href='#' style='text-decoration: none; color: black; margin:0px; padding:0px'>
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

        setSource((pre) => ({
            ...pre,
            html: pre.html + dataNode
        }))
        editorInputRef.current.clear()
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme.Background, padding: 10 }}>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                onLayout={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <RenderHtml
                    renderersProps={renderersProps}
                    contentWidth={width}
                    source={source.html === '' ? { html: '<p>Your Content will display here</p>' } : source}
                    enableExperimentalMarginCollapsing={true}
                />
            </ScrollView>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <View style={[myStyles.input, myStyles.flexRowWithGap, { alignItems: 'center' }]}>
                    <TextInput
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

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5, backgroundColor: `rgba(${hexToRbg(currentTheme.TaskItemContainerBackgroundColor)},1)` }}>
                        <MyText style={{ fontWeight: 'bold', color: currentTheme.linkColor }}>Save</MyText>
                        <MyIcon iconPack='MaterialCommunityIcons' name='note-plus-outline' color={currentTheme.linkColor} />
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
        </SafeAreaView>
    )
}

export default NoteEditor