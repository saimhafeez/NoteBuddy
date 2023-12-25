import { useEffect, useState } from "react";
import MyText from "../../MyText";
import {
  FlatList,
  TouchableOpacity,
  View,
  Button,
  TextInput,
} from "react-native";
import { useTheme } from "../../../theme/ThemeManager";
import MyIcon from "../../MyIcon";
import { Audio } from "expo-av";
import Animated, { FadeIn, FadeOut, SlideInUp } from "react-native-reanimated";
import { useModal } from "../ModalContext";
import * as FileSystem from "expo-file-system";

function AddAudioNote() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState();
  const [timer, setTimer] = useState();
  const [waveforms, setWaveforms] = useState([]);
  const [audioPlayback, setAudioPlayback] = useState(false);
  const [recordingData, setRecordingData] = useState({
    title: "",
    sound: null,
    duration: null,
    file: null,
  });

  const { myStyles, currentTheme } = useTheme();
  const { setDataForModal } = useModal();

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        recording.setOnRecordingStatusUpdate((props) => {
          // console.log({ durationMillis, isRecording, isDoneRecording });
          // Object.keys(props).map((p, i) => console.log('prop', p))
          // setTimer(durationMillis)
          // console.log(props.metering)
          setIsRecording(props.isRecording);
          props.metering && setWaveforms((pre) => [...pre, props.metering]);
          setTimer(props.durationMillis);
        });
        recording.setProgressUpdateInterval(200);
        setCurrentRecording(recording);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function stopRecording() {
    console.log("recoder stopped", currentRecording);
    if (currentRecording) {
      await currentRecording.stopAndUnloadAsync();
      const { sound, status } =
        await currentRecording.createNewLoadedSoundAsync();
      setRecordingData((pre) => ({
        ...pre,
        sound,
        duration: getDurationFormatted(status.durationMillis),
        file: currentRecording.getURI(),
      }));
    }
  }

  async function saveFile() {
    const fileName = `audio_${new Date().getTime()}_${recordingData.title}.m4a`;

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Move the recorded audio file to the app's document directory
    await FileSystem.moveAsync({
      from: recordingData.file,
      to: fileUri,
    });

    // setRecordingData((pre) => ({
    //   ...pre,
    //   sound,
    //   duration: getDurationFormatted(status.durationMillis),
    //   file: fileUri, // Save the file URI in the recording data
    // }));
  }

  async function getAllAudioFiles() {
    try {
      console.log("getAllAudioFiles");
      // Get all files in the document directory
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );

      // Filter out only audio files based on your naming convention or file extension
      const audioFiles = files.filter(
        (file) => file.startsWith("audio_") && file.endsWith(".m4a")
      );

      // Return an array of file URIs
      return audioFiles.map(
        (fileName) => `${FileSystem.documentDirectory}${fileName}`
      );
    } catch (error) {
      console.error("Error getting audio files:", error);
      return [];
    }
  }

  function startPlayback() {
    console.log(
      "keys",
      Object.keys(recordingData.sound),
      recordingData.sound.getStatusAsync
    );
    recordingData.sound.replayAsync();
  }

  function stopPlayback() {
    // currentRecording.sound
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function makeWavefroms(arr) {
    const max = 160;

    return arr.map((value) => {
      if (value === 0) {
        return max + 5;
      } else if (value < 0) {
        return max + value;
      } else {
        return max - value;
      }
    });
  }

  return (
    <View style={myStyles.flexColumnWithGap}>
      {timer && (
        <View
          style={[myStyles.flexRowWithGap, { justifyContent: "space-between" }]}
        >
          <MyText>Duration: {getDurationFormatted(timer)}</MyText>

          <TouchableOpacity onPress={startPlayback}>
            <MyIcon
              iconPack="FontAwesome"
              name={audioPlayback ? "pause-circle" : "play-circle"}
              color={
                isRecording
                  ? currentTheme.linkColorDanger
                  : currentTheme.IconColor
              }
            />
            {/* <MyText>{currentRecording ? 'Play' : 'Pause'}</MyText> */}
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          myStyles.flexRowWithGap,
          myStyles.input,
          {
            width: "100%",
            flex: 1,
            alignItems: "center",
            minHeight: 160 * 0.4,
          },
        ]}
      >
        <FlatList
          entering={SlideInUp.delay(400)}
          // style={{
          //   flex: 1
          // }}
          inverted
          data={[...makeWavefroms(waveforms)].reverse()}
          horizontal={true}
          contentContainerStyle={{
            gap: 2,
            alignItems: "center",
          }}
          // initialScrollIndex={waveforms.length - 1}
          renderItem={({ item }) => {
            return (
              <Animated.View
                // entering={FadeIn}
                // exiting={FadeOut}
                style={{
                  // position: 'absolute',
                  // marginTop: 200,
                  height: item * 0.4,
                  width: 4,
                  borderRadius: 4,
                  backgroundColor: currentTheme.linkColor,
                }}
              />
            );
          }}
        />

        <TouchableOpacity
          onPress={currentRecording ? stopRecording : startRecording}
        >
          <MyIcon
            iconPack="MaterialCommunityIcons"
            name="record-circle-outline"
            color={
              isRecording
                ? currentTheme.linkColorDanger
                : currentTheme.IconColor
            }
          />
          <MyText>{currentRecording ? "Stop" : "Start"}</MyText>
        </TouchableOpacity>

        {/* <Button title="log" onPress={() => console.log('log', currentRecording)} /> */}
      </View>

      <View style={myStyles.flexRowWithGap}>
        <TextInput
          placeholder="Give Title"
          style={[myStyles.input, { flex: 1 }]}
          onChangeText={(text) => {
            setRecordingData((pre) => ({
              ...pre,
              title: text,
            }));
          }}
        />

        <TouchableOpacity
          style={[
            myStyles.button,
            {
              justifyContent: "center",
              backgroundColor: currentTheme.linkColor,
            },
          ]}
          onPress={() => {}}
        >
          <MyText style={{ color: "white", fontWeight: "bold" }}>Save</MyText>
        </TouchableOpacity>
      </View>

      <Button title="saveFile" onPress={saveFile} />
      <Button title="getAllAudioFiles" onPress={getAllAudioFiles} />
    </View>
  );
}

export default AddAudioNote;
