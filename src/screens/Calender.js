import { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, Button, StyleSheet, FlatList } from 'react-native';
import { Audio } from 'expo-av'

function Calender() {

    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [timer, setTimer] = useState(0)
    const [waveforms, setWaveforms] = useState([])

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {

                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                recording.setOnRecordingStatusUpdate((props) => {
                    // console.log({ durationMillis, isRecording, isDoneRecording });
                    // Object.keys(props).map((p, i) => console.log('prop', p))
                    // setTimer(durationMillis)
                    console.log(props.metering)
                    setWaveforms((pre) => ([...pre, props.metering]))
                    setTimer(props.durationMillis)
                });
                recording.setProgressUpdateInterval(200);
                setRecording(recording);
            }

        } catch (err) { }


    }

    async function stopRecording() {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        let allRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(allRecordings);
    }

    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style={styles.row}>
                    <Text style={styles.fill}>
                        Recording #{index + 1} | {recordingLine.duration}
                    </Text>
                    <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
                </View>
            );
        });
    }

    function clearRecordings() {
        setRecordings([])
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function makeWavefroms(arr) {
        const max = 160;

        return arr.map(value => {
            if (value === 0) {
                return max;
            } else if (value < 0) {
                return max + value;
            } else {
                return max - value;
            }
        });
    }

    return (
        <View style={styles.container}>
            <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
            {recording && <View>
                <Text>Duration: {millisToMinutesAndSeconds(timer)}</Text>
                <FlatList
                    // style={{
                    //     flex: 1
                    // }}
                    inverted
                    data={[...makeWavefroms(waveforms)].reverse()}
                    horizontal={true}
                    contentContainerStyle={{
                        gap: 2
                    }}
                    // initialScrollIndex={waveforms.length - 1}
                    renderItem={({ item }) => {
                        return <View
                            style={{
                                // position: 'absolute',
                                marginTop: 200,
                                height: item * 0.3,
                                width: 4,
                                backgroundColor: 'red'
                            }}
                        />

                    }}
                />
            </View>}
            {getRecordingLines()}
            {recordings.length > 0 && <Button title='Clear Recordings' onPress={clearRecordings} />}
            <Button title='output' onPress={() => {
                console.log(recording.durationMillis);
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 40
    },
    fill: {
        flex: 1,
        margin: 15
    }
});

export default Calender;
