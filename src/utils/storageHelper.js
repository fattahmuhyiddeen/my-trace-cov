import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage';

const uploadLogsToFB = async (logs) => {
  const userId = auth().currentUser.uid
  const ref = database().ref(`/users/${userId}/logs`);
  ref.set(logs)
    .then(() => {
      console.log('uploadLogsToFB RESULT SUCCESS')
    })
    .catch(error => {
      console.log('uploadLogsToFB ERROR', error)
    })
}

export const uploadScannedDevicesDataPast21Days = async () => {
  console.log('uploadScannedDevicesDataPast21Days');
  const userUUID = await AsyncStorage.getItem('serviceUUID');
  const storagePrefix = 'user_contacts';
  const now = new Date();
  // start from 1 (yesterday), does not include today
  const daysAgo = 21;
  const numDaysAgo = [...Array(daysAgo).keys()].map(i => i); // TODO: make sure this is + 1 to exclude today
  // getting the data into "raw" object
  // [date, userUUID, contacts]
  const historyContents = [];
  await Promise.all(numDaysAgo.map(async (days) => {
    const dateDaysAgo = new Date();
    dateDaysAgo.setDate(now.getDate() - days);
    // get the data from async storage
    const dateAgo = dateDaysAgo.toISOString().split('T')[0];
    const history = await AsyncStorage.getItem(dateAgo);
    const parsedHistory = history ? JSON.parse(history) : []; // need to parse here
    historyContents.push(JSON.stringify({
      date: dateAgo,
      userUUID: userUUID,
      contacts: parsedHistory,
    }));
  }));

  // console.log('LOGS RESULT', historyContents)
  // uploadLogsToFB(historyContents)

  const dateStart = new Date();
  dateStart.setDate(now.getDate() - daysAgo);
  const dateEnd = new Date();
  dateEnd.setDate(now.getDate() - 1);
  const refName = `/${storagePrefix}/${userUUID}-${dateStart.toISOString().split('T')[0]}-${dateEnd.toISOString().split('T')[0]}.json`;
  const ref = storage().ref(refName);
  // convert json object into blob for upload purpose
  const blobJSON = new Blob([historyContents.join('\n')], { type: 'application/json', endings: '\n' });
  const putRes = await ref.put(blobJSON);
  console.log({ putRes });
  return true;

};
