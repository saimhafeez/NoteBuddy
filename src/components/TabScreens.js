import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { NavigationContainer } from '@react-navigation/native';
import Tasks from '../screens/Tasks';
import Calender from '../screens/Calender';
import Notes from '../screens/Notes';
import { useTheme } from '../theme/ThemeManager';
import CompletedTasks from '../screens/CompletedTasks';
import NoteEditor from './Notes/NoteEditor';


function TabScreens() {

  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const { currentTheme, fonts } = useTheme();


  function Root() {
    return (
      <Tab.Navigator
        activeColor={currentTheme.linkColor}
        inactiveColor={currentTheme.TextColor}
        shifting={true}
        barStyle={{
          backgroundColor: currentTheme.TaskItemContainerBackgroundColor
        }}
        screenOptions={{
          tabBarColor: currentTheme.TaskItemContainerBackgroundColor,

        }}
      >
        <Tab.Screen
          name="Tasks"
          component={Tasks}
          options={{
            tabBarIcon: 'clipboard-text-clock',
          }}
        />
        <Tab.Screen
          name="Notes"
          component={Notes}
          options={{
            tabBarIcon: 'notebook'
          }}
        />
        <Tab.Screen
          name="Calender"
          component={Calender}
          options={{
            tabBarIcon: 'calendar'

          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Root'
          component={Root}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='CompletedTasks'
          component={CompletedTasks}
        />
        <Stack.Screen
          name='NoteEditor'
          component={NoteEditor}
          options={{
            // headerShown: false,
            headerTitle: 'Add New Note'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer >
  )
}

export default TabScreens