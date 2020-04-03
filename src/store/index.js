import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

import userReducer from '@reducers/user'

const rootReducer = combineReducers({
    user: userReducer,
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'user',
    ],
};

const reducers = persistReducer(persistConfig, rootReducer);

export const store = createStore(reducers)

export const persistor = persistStore(store)