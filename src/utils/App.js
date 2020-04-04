import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, Button, View, FlatList, AppState, } from 'react-native';
import { establishConnection, cancelAllConnections, executeJob, scheduleBackgroundProcessingTask, } from './BleManager';
import { addLogListener, removeLogListener, clearAllLogs, collectLogs, log, } from './Utils';
/**
 * This is an application widget containing simple buttons and list of
 * persisted logs.
 */
const App = () => {
    return (
        <Text>Hello world</Text>
    );
};
export default App;