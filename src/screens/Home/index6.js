import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid, NativeEventEmitter, NativeModules, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Icon } from 'react-native-elements'
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import BleManager from 'react-native-ble-manager'

import { SAView } from '@components/Container'
import { BUnderline } from '@components/Button'
import Colors from '@utils/colors'

const onePlusX = 'c0:ee:fb:6c:5e:8e'
const asusX = '18:31:bf:89:f0:05'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const HomeScreen = () => {

    const [bluetoothOn, setBluetoothOn] = useState(false)
    const [locationOn, setLocationOn] = useState(false)
    const [isScan, setScan] = useState(true)
    const [peripherals, setPeripherals] = useState([])

    let handlerDiscover
    let handlerStop
    let handlerDisconnect
    let handlerUpdate

    // const requestLocationPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    //         )
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log("location ALLOWED");
    //             return true
    //         } else {
    //             console.log("location DENIED");
    //             return false
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         return false
    //     }
    // }

    const removeSubscription = () => {
        console.log('subscription REMOVE')

    }

    const initializeBluetooth = () => {
        BleManager.enableBluetooth()
            .then(() => {
                console.log('bluetooth ON')
                BleManager.start({ showAlert: false })
                    .then(() => {
                        console.log('bluetooth START')
                        startScan()
                    })
            })
            .catch((error) => {
                console.log('bluetooth OFF')
            })

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (!result) {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (!result) {
                            console.log('location UNALLOWED')
                        }
                        else {
                            console.log('location ALLOWED')
                        }
                    })
                }
                else {
                    console.log('location ALLOWED')
                }
            })
        }
    }

    const startScan = () => {
        BleManager.scan([], 5, true)
            .then(() => {
                console.log('scan START')
            })
    }

    const connectBle = (peripheralId) => {
        BleManager.connect(peripheralId)
            .then(() => {
                BleManager.retrieveServices(peripheralId)
                    .then((peripheralInfo) => {
                        console.log('peripheral INFO', peripheralInfo)
                    })
            })
            .catch((error) => {
                console.log('connect ble ERROR', error)
            })
    }

    const writeBle = (peripheral) => {

        let user_id = RandomId(15)

        let me = {
            id: user_id,
            full_name: 'APPFES'
        };

        let str = JSON.stringify(me);
        let bytes = bytesCounter.count(str);
        let data = stringToBytes(str);

        const BASE_UUID = '-5659-402b-aeb3-d2f7dcd1b999';
        const PERIPHERAL_ID = '0000';
        const PRIMARY_SERVICE_ID = '0100';

        let primary_service_uuid = PERIPHERAL_ID + PRIMARY_SERVICE_ID + BASE_UUID;
        let ps_characteristic_uuid = PERIPHERAL_ID + '0300' + BASE_UUID;

        BleManager.write(peripheral, primary_service_uuid, ps_characteristic_uuid, data, bytes)
            .then(() => {

            })
            .catch((error) => {
                console.log('write ble ERROR', error)
            })
    }

    handleDiscoverPeripheral = (data) => {
        console.log('peripheral DISCOVER', data)
        setPeripherals(currentPeripherals => [
            ...currentPeripherals,
            data
        ])
    }

    handleDisconnectedPeripheral = (data) => {
        console.log('peripheral DISCONNECTED' + data)
    }

    handleUpdateValueForCharacteristic = (data) => {
        console.log('characteristic UPDATE', data)
    }

    handleStopScan = () => {
        console.log('scan STOP')
        setScan(false)
    }

    useEffect(() => {
        initializeBluetooth()
        console.log('ADD EVENT LISTENER')
        handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral)
        handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan)
        handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral)
        handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic)
        return () => {
            console.log('REMOVE EVENT LISTENER')
            handlerDiscover.remove()
            handlerStop.remove()
            handlerDisconnect.remove()
            handlerUpdate.remove()
        }
    }, [])

    const renderItem = (data) => {
        console.log('renderItem', data)
        return (
            <TouchableOpacity onPress={() => connectBle(data.item.id)} style={{ padding: 8, backgroundColor: 'lightgrey' }}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>{data.item.id}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <SAView>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text1}>Device Status</Text>
                        <Icon
                            name='ios-refresh'
                            type='ionicon'
                            color='black'
                            size={30}
                            onPress={() => {

                            }}
                        />
                    </View>
                    <View style={{ height: 50 }} />
                    <View style={styles.rowContainer}>
                        <View style={styles.statusContainer}>
                            <View style={styles.imageContainer}>
                                <Icon
                                    name='ios-bluetooth'
                                    type='ionicon'
                                    color='white'
                                    size={40}
                                />
                            </View>
                            <View style={{ height: 12 }} />
                            <Text style={styles.text2}>{bluetoothOn ? 'ON' : 'OFF'}</Text>
                        </View>
                        {
                            Platform.OS == 'android' ?
                                <View style={styles.statusContainer}>
                                    <View style={styles.imageContainer}>
                                        <Icon
                                            name='ios-pin'
                                            type='ionicon'
                                            color='white'
                                            size={40}
                                        />
                                    </View>
                                    <View style={{ height: 12 }} />
                                    <Text style={styles.text2}>{locationOn ? 'ON' : 'OFF'}</Text>
                                </View>
                                : null
                        }

                    </View>
                    <View style={{ height: 50 }} />
                    <Text style={styles.text3}>Make sure all features are turned on to run this app properly.</Text>
                </View>
                {
                    !isScan ?
                        <FlatList
                            data={peripherals.filter((value, index, self) => self.map(x => x.id).indexOf(value.id) == index)}
                            renderItem={renderItem.bind(this)}
                            keyExtractor={item => item}
                        />
                        : null
                }

            </ScrollView>
        </SAView >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 22,
    },
    text1: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    text2: {
        fontSize: 20,
    },
    text3: {
        fontSize: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusContainer: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    imageContainer: {
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary
    },
})

export default HomeScreen
