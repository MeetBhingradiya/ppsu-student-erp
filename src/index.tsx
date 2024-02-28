import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import CredentialsProvider from './Credentials.provider';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <CredentialsProvider>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = 'home';
                            } else if (route.name === 'Settings') {
                                iconName = 'settings';
                            }

                            return <Ionicons name={iconName as any} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Settings" component={SettingsScreen} />
                </Tab.Navigator>
            </CredentialsProvider>
        </NavigationContainer>
    );
}
