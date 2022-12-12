import { configureStore } from '@reduxjs/toolkit';
import treeViewSlice from './reducers/treeViewSlice';

const store = configureStore({
    reducer: {
        treeView :  treeViewSlice
    },
})

export default store;