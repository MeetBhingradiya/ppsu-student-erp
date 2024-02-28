import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState , useContext, createContext } from 'react';
import { Alert } from 'react-native';

export const CredentialsContext = createContext<{
    Credentials: {
        username: string;
        password: string;
        cookies: any[];
    };
    LoadCredentials: Function;
    SetCredentials: Function
}>({} as any);

export const useCredentials = () => useContext(CredentialsContext);

export default function CredentialsProvider({ children }: any) {
    const [Credentials, SaveCredentials] = useState({
        username: 'Enter your username',
        password: 'Enter your password',
        cookies: []
    });

    const LoadCredentials = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('pass');
            if (storedUsername !== null) {
                SaveCredentials({ ...Credentials, username: storedUsername });
            }
            if (storedPassword !== null) {
                SaveCredentials({ ...Credentials, password: storedPassword });
            }
        } catch (error) {
            Alert.alert('Error loading settings');
        }
    }

    const SetCredentials = async () => {
        try {
            await AsyncStorage.setItem('email', Credentials.username);
            await AsyncStorage.setItem('pass', Credentials.password);
            Alert.alert('Settings saved successfully');
        } catch (error) {
            Alert.alert('Error saving settings');
        }
    };

    React.useEffect(() => {
        LoadCredentials();
    }, []);

    return (
        <CredentialsContext.Provider value={{Credentials, LoadCredentials, SetCredentials}}>
            {children}
        </CredentialsContext.Provider>
    );
}