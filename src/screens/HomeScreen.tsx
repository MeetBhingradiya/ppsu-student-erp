import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCredentials } from '../Credentials.provider';

export default function HomeScreen() {
    const { Credentials } = useCredentials();

    const [isLoading, setIsLoading] = useState(false);
    const [refresherEnabled, setEnableRefresher] = React.useState(true);
    const webViewRef = useRef<any>(null);


    const handleScroll = (event: any) => {
        const yOffset = Number(event.nativeEvent.contentOffset.y)
        if (yOffset === 0) {
            setEnableRefresher(true)
        } else {
            setEnableRefresher(false)
        }
    }
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    enabled={refresherEnabled}
                    onRefresh={() => { webViewRef.current.reload() }}
                />
            }
        >
            <WebView
                source={{
                    uri: "https://ppsu.emli.in/student-ppsavani.php",
                    headers: {
                        'Cookie': Credentials.cookies.map((cookie: any) => `${cookie.name}=${cookie.value}`).join('; ')
                    }
                }}
                ref={webViewRef}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                onLoadStart={() => setIsLoading(true)}
                onScroll={handleScroll}
                onMessage={(event) => {
                    let cookies = JSON.parse(event.nativeEvent.data);
                    // saveCredentials({ ...credentials, cookies });
                }}
                onLoadEnd={async (syntheticEvent) => {
                    setIsLoading(false);
                }}
                onLoad={async (syntheticEvent) => {
                    setIsLoading(false);
                    let JSScript = `
                    ? Inject Viewport Meta Tag
                    let meta = document.createElement('meta');
                    meta.setAttribute('name', 'viewport');
                    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
                    document.getElementsByTagName('head')[0].appendChild(meta);

                    let IFrame = document.getElementsByName("iframe")[0].contentDocument;
                    let form = IFrame.getElementsByName("camp_login")[0];

                    if (form) {
                        let username = IFrame.getElementsByName("user_name")[0];
                        let password = IFrame.getElementsByName("password")[0];
                        if (username && password) {
                            username.value = "${Credentials.username}";
                            password.value = "${Credentials.password}";
                        }
                    } else {
                ? Save Cookies to AsyncStorage
                // setTimeout(() => {
                //     let cookies = document.cookie.split(';');
                //     let cookiesArray = [];
                //     for (let i = 0; i < cookies.length; i++) {
                //         let cookie = cookies[i].split('=');
                //         cookiesArray.push({
                //             name: cookie[0],
                //             value: cookie[1]
                //         });
                //     }

                //     window.ReactNativeWebView.postMessage(JSON.stringify(cookiesArray));
                //     }, 1000);

                    }
                    `

                    setTimeout(() => {
                        webViewRef.current?.injectJavaScript(JSScript);
                    }, 500)
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    webView: {
        flex: 1,
    },
});
