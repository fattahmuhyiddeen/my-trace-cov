import React from 'react'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Navigator } from '@routes'
import { store, persistor } from '@store'

// import backgroundTask from './utils/backgroundTask';

const App = () => {
  // backgroundTask(); // TODO
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigator />
      </PersistGate>
    </Provider>
  )
}

export default App
