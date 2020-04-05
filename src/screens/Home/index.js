import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid, NativeModules } from 'react-native'
import { Icon } from 'react-native-elements'
import { BleManager, Service, Characteristic } from 'react-native-ble-plx'
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'

import { SAView } from '@components/Container'
import { BUnderline } from '@components/Button'
import Colors from '@utils/colors'

const BLEPeripheral = NativeModules.BLEPeripheral;
// import BLEPeripheral from 'react-native-ble-peripheral';

const HomeScreen = () => {

    const [bluetoothOn, setBluetoothOn] = useState(false)
    const [locationOn, setLocationOn] = useState(false)
    const [devicesScanned, setDevicesScanned] = useState([])

    let bleManager
    let subscription

    let characteristicWithResponseListener
    let characteristicWithoutResponseListener

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("location ALLOWED");
                return true
            } else {
                console.log("location DENIED");
                return false
            }
        } catch (err) {
            console.log(err);
            return false
        }
    }

    const initializeBluetooth = () => {
        console.log('subscription CREATE')
        bleManager = new BleManager()
        subscription = bleManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                console.log('bluetooth ON');
                startAdvertising();
                setBluetoothOn(true)
                if (Platform.OS === 'android') {
                    const permission = requestLocationPermission();
                    if (permission) {
                        beginBLEScan()
                    }
                    else {
                        console.log("location OFF")
                        setLocationOn(false)
                    }
                }
                else if (Platform.OS === 'ios') {
                    beginBLEScan()
                }
            }
            else if (state === 'PoweredOff') {
                console.log('bluetooth OFF')
                setBluetoothOn(false)
            }
            else if (state === 'Unauthorized') {
                console.log('bluetooth UNAUTHORIZED')
                setBluetoothOn(false)
            }
        }, true)
    }

    const startAdvertising = async () => {
        // TODO: Define where to define the uuid
        const serviceUUID = '55c14520-9b41-4e13-a229-e29059c00e47';
        BLEPeripheral.addService(serviceUUID, false);
        BLEPeripheral.addCharacteristicToService(
          serviceUUID,
          serviceUUID,
          128,
          128,
          '',
        );
        if (await BLEPeripheral.isAdvertising()) {
            return;
        }
        BLEPeripheral.sendNotificationToDevices(serviceUUID, serviceUUID, "JJKoh");
        BLEPeripheral.setName("JunTest");
        BLEPeripheral.start()
          .then(res => {
            // Success
            console.log("Successful")
          })
          .catch(error => {
            console.log(error);
          });
      };

    const beginBLEScan = () => {
        console.log('scan START')
        bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.log('BLE scan error', error)
                if (error.errorCode === 601) {
                    console.log('location OFF')
                    setLocationOn(false)
                }
                return
            }
            else {
                if (!locationOn) {
                    console.log('location ON')
                    setLocationOn(true)
                }
                if (!devicesScanned.includes(device.name)) {
                    setDevicesScanned([...devicesScanned, device.name]);
                }
                console.log('scan DEVICE', device.id, device.name, devicesScanned);
                // if (devicesScanned.length > 0) {
                //     if (devicesScanned.some(dvc => dvc.id === device.id)) {
                //         bleManager.stopDeviceScan()
                //         connectToBLEDevice(device)
                //     }
                // }
                // else {
                //     console.log('scan DEVICE', device.id)
                //     const devices = [...devicesScanned]
                //     devices.push(device)
                //     setDevicesScanned(devices)
                // }
            }
            // if (POSSIBLE_DEVICE_NAMES.includes(device.name)) {
            // bleManager.stopDeviceScan()
            // connectToBLEDevice(device)
            // }
        })
    }

    const connectToBLEDevice = async device => {
        console.log('Connecting to BLE device')
        // Connect to our BLE device and save it to redux state
        let connectedBLEDevice = await device.connect()
        connectedBLEDevice.onDisconnected(handleBLEDeviceDisconnect)

        // Discover all services and characteristics of our BLE device
        await connectedBLEDevice.discoverAllServicesAndCharacteristics()

        // Save all BLE device services to state
        let connectedBLEDeviceServices = await connectedBLEDevice.services()
        connectedBLEDeviceServices = connectedBLEDeviceServices.map(service => new Service(service, bleManager))
        // console.log({connectedBLEDeviceServices});

        // Save all BLE device characteristics to state
        let connectedBLEDeviceCharacteristics = await connectedBLEDeviceServices[0].characteristics()
        connectedBLEDeviceCharacteristics = connectedBLEDeviceCharacteristics.map(characteristic => new Characteristic(characteristic, bleManager))

        // Handle a base64 encoded message from our BLE device's writable characteristic
        characteristicWithResponseListener = connectedBLEDeviceCharacteristics[0].monitor(handleCharacteristicWithResponse)
        characteristicWithoutResponseListener = connectedBLEDeviceCharacteristics[1].monitor(handleCharacteristicWithoutResponse)

        // Send a base64 encoded message to our BLE device's writable characteristic
        // this.props.actions.writeWithResponseToBLEDevice(`Hello from ${Platform.OS === 'ios' ? 'iPhone' : 'Android'}!`)
    }

    const handleCharacteristicWithResponse = (error, characteristic) => {
        if (error && error.code !== 201) { // 201 means device was disconnected
            console.log('BLE receive error', error)
            handleBLEDeviceDisconnect();
            return
        }
        // Read our BLE device's writable characteristic's base64 encoded value
        let response = JSON.parse(base64.decode(characteristic.value))
        if (response.ok) {
            handleBLEResponse(response, true)
        }
        console.log('handleCharacteristicWithResponse', response.value)
    }

    const handleCharacteristicWithoutResponse = (error, characteristic) => {
        if (error && error.code !== 201) { // 201 means device was disconnected
            console.log('BLE receive error', error)
            handleBLEDeviceDisconnect();
            return
        }
        // Read our BLE device's writable characteristic's base64 encoded value
        let response = JSON.parse(base64.decode(characteristic.value))
        if (response.ok) {
            handleBLEResponse(response, false)
        }
        console.log('handleCharacteristicWithoutResponse', response.value)
    }

    const handleBLEResponse = (response, withResponse) => {
        switch (response.type) {
            default:
                return console.log(`👋🏻 from BLE device with${!withResponse ? 'out' : ''} response:`, response)
        }
    }

    const handleBLEDeviceDisconnect = () => {
        console.log("BLE device disconnected! Resetting bluetooth state and restarting scan.")
        characteristicWithResponseListener.remove()
        characteristicWithoutResponseListener.remove()
        beginBLEScan()
    }

    const removeSubscription = () => {
        console.log('subscription REMOVE')
        bleManager.destroy()
        subscription.remove()
    }


    useEffect(() => {
        initializeBluetooth()
        return () => {
            removeSubscription()
        }
    }, [initializeBluetooth, removeSubscription])

    return (
        <SAView>
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Device Status</Text>
                    <Icon
                        name='ios-refresh'
                        type='ionicon'
                        color='black'
                        size={30}
                        onPress={() => {
                            removeSubscription()
                            initializeBluetooth()
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
