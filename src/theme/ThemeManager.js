import { createContext, useContext, useState } from "react";
import { StyleSheet } from "react-native";

const ThemeContext = createContext();
function ThemeManager({ children }) {
    const [currentTheme, setCurrentTheme] = useState(Light)

    const myStyles = StyleSheet.create({
        container: {
            backgroundColor: Theme.Dark.Background,
            color: Theme.Dark.TextColor
        },
        flexRowWithGap: {
            display: "flex",
            flexDirection: 'row',
            gap: 5
        },
        flexColumnWithGap: {
            display: "flex",
            flexDirection: 'column',
            gap: 5
        },
        input: {

            // width: '100%',
            borderWidth: 0.5,
            borderRadius: 15,
            padding: 10,
            borderColor: currentTheme.TextFieldBackground,
            color: currentTheme.TextColor,
            backgroundColor: currentTheme.TextFieldBackground,
            fontFamily: fonts.futura_lig
        },
        button: {
            borderWidth: 0.5,
            borderRadius: 15,
            padding: 10,
            borderColor: 'transparent',
            backgroundColor: currentTheme.TextFieldBackground,
            fontFamily: fonts.futura_lig
        }
    })

    return (
        <ThemeContext.Provider value={{ myStyles, currentTheme, setCurrentTheme, fonts }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);
}

const fonts = {
    poppins_regular: 'poppins_regular',
    poppins_bold: 'poppins_bold',
    futura_lig: 'futura_lig',
    futura_medium: 'futura_medium',
}

const Light = StyleSheet.create({
    Background: '#f9ffff',
    TextColor: '#000000',
    IconColor: '#c281ff',
    TaskItemContainerBackgroundColor: '#f4f9fb',
    linkColor: "#4685ec",
    linkColorDanger: "#ed4d7f",
    bottomModalBackground: '#f9ffff',
    bottomModalBackgroundOverlay: '#000000',
    newTaskIconColor: '#fff',
    newTaskIconBackgroundColor: '#4685ec',
    TextFieldBackground: '#f3f7f8'
})

const Dark = StyleSheet.create({
    Background: '#000',
    TextColor: '#fff',
    IconColor: '#fff',
    TaskItemContainerBackgroundColor: '#1F2020',
    linkColor: "#4685ec",
    linkColorDanger: "#ed4d7f",
    bottomModalBackground: '#1F2020',
    bottomModalBackgroundOverlay: '#000000',
    newTaskIconColor: '#fff',
    newTaskIconBackgroundColor: '#4685ec',
    TextFieldBackground: '#313438'
})

export const Theme = {
    Light,
    Dark
}

export default ThemeManager
