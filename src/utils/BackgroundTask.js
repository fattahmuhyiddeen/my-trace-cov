import BackgroundTimer from 'react-native-background-timer';
import { BleManager } from 'react-native-ble-plx';
import BLEPeripheral from 'react-native-ble-peripheral';
import UUIDGenerator from 'react-native-uuid-generator'
import AsyncStorage from '@react-native-community/async-storage';

const manager = new BleManager();

const getTodayDate = () => {
  const now = (new Date()).toISOString().split('T')[0];
  return now;
};

const setScannedDevices = async (scannedDevices) => {
  const key = getTodayDate();
  try {
    const existingValues = await AsyncStorage.getItem(key);
    console.log({existingValues});
    if (existingValues === null) {
      // set here
      return AsyncStorage.setItem(key, JSON.stringify(scannedDevices));
    }
    console.log({existingValues});
    const newSet = new Set(JSON.parse(existingValues)); // make sure this is array
    console.log(newSet);
    scannedDevices.forEach((d) => newSet.add(d));
    return AsyncStorage.setItem(key, JSON.stringify(Array.from(newSet)));
  } catch (err) {
    // handler
    console.log(err);
    return;
  }
};

// Note - backgroundtimer might only work in android
const scanDevice = (timeout = 10000) => {
  console.log('ScanDevice');
  const scannedDevices = new Set();
  return new Promise((resolve, reject) => {
    // Define subscriptions.
    const subscriptions = { timeout: null };
    // Function to clear all subscriptions.
    const clearSubscriptions = () => {
      manager.stopDeviceScan();
      if (subscriptions.timeout) {
        BackgroundTimer.clearTimeout(subscriptions.timeout);
        subscriptions.timeout = null;
      }
    };
    // Specify timeout if value is larger than 0.
    if (timeout > 0) {
      subscriptions.timeout = BackgroundTimer.setTimeout(() => {
        subscriptions.timeout = null;
        clearSubscriptions();
        resolve(Array.from(scannedDevices));
      }, timeout);
    }

    // Start scanning.
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error != null) {
        clearSubscriptions();
        reject(error);
      }
      if (scannedDevice !== null) {
        console.log(scannedDevice.name, scannedDevice.serviceUUIDs);
        // TODO: make sure serviceUUIDs make sense
        const dummyList = [Math.random()];
        console.log({scannedDevices});
        dummyList.forEach((v) => scannedDevices.add(v));
        // if (scannedDevice.serviceUUIDs !== null) {
        //   scannedDevice.serviceUUIDs.forEach(scannedDevices.add);
        // }
      }
    });
  });
};

const startAdvertise = async (serviceUUID, name) => {
  console.log('StartAdvertising');
  if (await BLEPeripheral.isAdvertising()) return Promise.resolve('Is advertising');
  BLEPeripheral.addService(serviceUUID, false);
  BLEPeripheral.addCharacteristicToService(serviceUUID, serviceUUID, 1, 2, '');
  BLEPeripheral.setName(name);
  return BLEPeripheral.start();
};

const runBackgroundTask = async (name = 'TraceCov') => {

  const serviceUUID = await AsyncStorage.getItem('serviceUUID')
  console.log('GET ASYNC UUID', serviceUUID)

  const scanDeviceTimer = 10000;
  // BackgroundTimer only runs once - consistent
  manager.stopDeviceScan();
  if (await BLEPeripheral.isAdvertising()) BLEPeripheral.stop();
  (async function () {
    BackgroundTimer.runBackgroundTimer(() => {
      // TODO: scanDevice response should be written to persistent storage
      scanDevice().then(setScannedDevices).catch(console.log);
      startAdvertise(serviceUUID, name).then(console.log).catch(console.log);
    }, scanDeviceTimer);
  }());
  console.log(BackgroundTimer);
};

export default class BackgroundTask {
  static isRunning = false;

  static scheduleBackgroundProcessingTask() {
    if (BackgroundTask.isRunning) {
      return;
    }
    BackgroundTask.isRunning = true; // make this to true
    runBackgroundTask();
  }
}
