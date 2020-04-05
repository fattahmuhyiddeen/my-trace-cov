import BackgroundTimer from 'react-native-background-timer';
import { BleManager } from 'react-native-ble-plx';
import BLEPeripheral from 'react-native-ble-peripheral';

const manager = new BleManager();

// Note - backgroundtimer might only work in android
const scanDevice = (timeout = 1000) => {
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
      var _a;
      if (error != null) {
        clearSubscriptions();
        reject(error);
      }
      if (scannedDevice != null) {
        scannedDevices.add(scannedDevice);
      }
    });
  });
};

const startAdvertise = async (serviceUUID, name) => {
  console.log('StartAdvertising');
  if (await BLEPeripheral.isAdvertising()) return Promise.resolve('Is advertising');
  BLEPeripheral.addService(serviceUUID, false);
  BLEPeripheral.addCharacteristicToService(serviceUUID, serviceUUID, 128, 128, '');
  BLEPeripheral.setName(name);
  return BLEPeripheral.start();
};

const uuidDummy = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
const scheduleBackgroundProcessingTask = async (serviceUUID=uuidDummy, name='TraceCov') => {
  const scanDeviceTimer = 5000;

  // BackgroundTimer only runs once - consistent
  BLEPeripheral.stop() // just to make sure everything is stopped here
  (async function() {
    BackgroundTimer.runBackgroundTimer(() => {
      // TODO: scanDevice response should be written to persistent storage
      scanDevice().then(console.log);
      startAdvertise(serviceUUID, name).then(console.log).catch(console.log);
    }, scanDeviceTimer);
  }());
  // console.log(BackgroundTimer);
};

export default async () => {
  // if backgroundtimer running, do nothing
  scheduleBackgroundProcessingTask();
  // BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
};
