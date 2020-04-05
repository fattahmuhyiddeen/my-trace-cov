import AsyncStorage from '@react-native-community/async-storage';
import storage from '@react-native-firebase/storage';

export const uploadScannedDevicesDataPast21Days = async (userUUID) => {
  console.log('uploadScannedDevicesDataPast21Days');
  const storagePrefix = 'user_contacts';
  const now = new Date();

  // start from 1 (yesterday), does not include today
  const daysAgo = 21;
  const numDaysAgo = [...Array(daysAgo).keys()].map(i => i + 1); // TODO: make sure this is + 1
  // getting the data into "raw" object
  // [date, userUUID, contacts]
  const historyContents = [];
  await Promise.all(numDaysAgo.map(async (days) => {
    const dateDaysAgo = new Date();
    dateDaysAgo.setDate(now.getDate() - days);
    // get the data from async storage
    const dateAgo = dateDaysAgo.toISOString().split('T')[0];
    const history = await AsyncStorage.getItem(dateAgo);
    const parsedHistory = history? JSON.parse(history) : []; // need to parse here

    historyContents.push({
      date: dateAgo,
      userUUID: userUUID,
      contacts: parsedHistory,
    });
  }));

  const dateStart = new Date();
  dateStart.setDate(now.getDate() - daysAgo);
  const dateEnd = new Date();
  dateEnd.setDate(now.getDate() - 1);
  const refName = `/${storagePrefix}/${userUUID}-${dateStart.toISOString().split('T')[0]}-${dateEnd.toISOString().split('T')[0]}.json`;
  const ref = storage().ref(refName);

  // convert json object into blob for upload purpose
  const blobJSON = new Blob([JSON.stringify(historyContents)], { type: 'application/json' });

  const putRes = await ref.put(blobJSON);
  console.log({putRes});
  return true;
};
