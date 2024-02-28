import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCredentials } from '../Credentials.provider';

const SettingsScreen = () => {
    const { Credentials, SetCredentials } = useCredentials();
    const [username, setUsername] = useState('Enter your username');
    const [password, setPassword] = useState('Enter your password');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSaveCredentials = () => {
        SetCredentials({ ...Credentials, username, password });
        Alert.alert('Settings saved successfully');
    };

    useEffect(() => {
        setUsername(Credentials.username);
        setPassword(Credentials.password);
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                style={styles.input}
                right={<Ionicons
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    name={passwordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="black"
                />
                }
            />
            <Button mode="contained" onPress={handleSaveCredentials} style={styles.button}>
                Save Credentials
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: "##5ba8ec"
    },
    button: {
        marginTop: 16,
        backgroundColor: "#001b4c",
        color: "#f4f9ff"
    }
});

export default SettingsScreen;
