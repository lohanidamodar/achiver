import {compose, applyMiddleware, createStore} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'

import { setToday } from './actions/timer';
import reducers from './reducers'
import {AsyncStorage} from 'react-native'



let store = createStore(reducers, undefined,compose(
    autoRehydrate()
));

export default store;