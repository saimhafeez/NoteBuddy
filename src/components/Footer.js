import {StyleSheet, Text, View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ThemeManager, {Theme, useTheme} from "../theme/ThemeManager";
import MyText from "./MyText";

function Footer({actionCallback}) {

    const { currentTheme, setCurrentTheme } = useTheme()
    return(
        <View style={{
            backgroundColor: currentTheme.Background,
            height: '100%',
            justifyContent: 'center'
        }}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                {/*<MaterialIcons size={40} color='black'  name="menu" />*/}
                {/*<MaterialIcons size={40} color='black'  name="menu" />*/}
                {/*<MaterialIcons size={40} color='black'  name="menu" />*/}
                <MyText onPress={() => setCurrentTheme(Theme.Light)}>Menu</MyText>
                <MyText onPress={() => actionCallback(0)}>Tasks</MyText>
                <MyText onPress={() => actionCallback(1)}>Notes</MyText>
                <MyText onPress={() => actionCallback(2)}>Calender</MyText>
                <MyText onPress={() => setCurrentTheme(Theme.Dark)}>Account</MyText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.Dark.Background,
        color: Theme.Dark.TextColor
    }
})

export default Footer;
