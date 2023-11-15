import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'


import { useTheme } from "../theme/ThemeManager";




function MyIcon({ name, iconPack, size = 26, color }) {

    const { currentTheme } = useTheme();

    if (!color) {
        color = currentTheme.IconColor
    }

    if (iconPack === 'MaterialIcons') {
        return <MaterialIcons name={name} size={size} color={color} />
    } else if (iconPack === 'Ionicons') {
        return <Ionicons name={name} size={size} color={color} />
    } else if (iconPack === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={name} size={size} color={color} />
    } else if (iconPack === 'FontAwesome') {
        return <FontAwesome name={name} size={size} color={color} />
    } else if (iconPack === 'AntDesign') {
        return <AntDesign name={name} size={size} color={color} />
    }
}

export default MyIcon