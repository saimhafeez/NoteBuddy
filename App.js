import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'
import NavigationBar from './src/components/NavigationBar'
import Footer from "./src/components/Footer";
import { useCallback, useEffect, useState } from "react";
import Tasks from "./src/screens/Tasks";
import Notes from "./src/screens/Notes";
import Calender from "./src/screens/Calender";
import ThemeManager from "./src/theme/ThemeManager";
import db, { todo, todo_categories } from "./src/db/Connection";
import { TaskSymbols } from "./src/utils/TaskSymbols";
import { ModalProvider } from "./src/components/Modal/ModalContext";
import ModalComponent from "./src/components/Modal/ModalComponent";
import TaskSymbolSelectionModal from "./src/components/Modal/TaskSymbolSelectionModal";
import { getTodos } from "./src/db/ToDoOperations";
import { UiRefreshProvider } from "./src/context/UiRefreshContext";

import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

import TabScreens from './src/components/TabScreens';


export default function App() {


    useEffect(() => {

        // getTodos().then((r) => console.log(r))

        // Define the data to be inserted
        // const dataToInsert = {
        //     title: 'Book reading',
        //     isCompleted: true,
        //     symbol: JSON.stringify(TaskSymbols.default),
        // };
        //
        //
        // db.transaction((tx) => {
        //     tx.executeSql(
        //         'INSERT INTO todo (title, isCompleted, symbol) VALUES (?, ?, ?)',
        //         [dataToInsert.title, dataToInsert.isCompleted, dataToInsert.symbol],
        //         (_, results) => {
        //             if (results.rowsAffected > 0) {
        //                 // Data was successfully inserted, now retrieve the inserted data
        //                 tx.executeSql(
        //                     'SELECT * FROM todo WHERE id = last_insert_rowid()',
        //                     [],
        //                     (_, { rows }) => {
        //                         const insertedData = rows.item(0);
        //                         console.log('Inserted Data:', insertedData);
        //                     }
        //                 );
        //             } else {
        //                 console.error('Insert failed');
        //             }
        //         }
        //     );
        // });


        // db.transaction((tx) => {
        //     tx.executeSql(`DROP TABLE IF EXISTS ${todo}`, [], (_, result) => {
        //         console.log(`Table todo dropped successfully`);
        //     });
        // });

        // createTodo('Reading is nice', true).then((data) => console.log(data)).catch((err) => console.log(err));
    }, [])


    const [fontsLoaded, setFontsLoaded] = useState(false);

    const getFonts = async () => {
        await Font.loadAsync({
            'poppins_bold': require('./assets/fonts/Poppins-Bold.ttf'),
            'poppins_regular': require('./assets/fonts/Poppins-Regular.ttf'),
            'futura_lig': require('./assets/fonts/Futura-Lig.ttf'),
            'futura_medium': require('./assets/fonts/futura_medium.ttf'),
        })
        setFontsLoaded(true);
    }

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded])

    useEffect(() => {
        getFonts();
    }, [])

    if (!fontsLoaded) {
        return null;
    }

    return (
        <UiRefreshProvider>
            <ThemeManager>
                <ModalProvider>
                    <SafeAreaView style={styles.app} onLayout={onLayoutRootView}>
                        <TabScreens />
                        <ModalComponent />
                    </SafeAreaView>
                </ModalProvider>
            </ThemeManager>
        </UiRefreshProvider>

    );
}

const styles = StyleSheet.create({
    app: {
        flex: 1
    },
    header: {
        flex: 0.05
    },
    appView: {
        flex: 0.9
    },
    footer: {
        flex: 0.05,
    }

});
