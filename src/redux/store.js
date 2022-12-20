import { configureStore } from '@reduxjs/toolkit';
import treeViewSlice from './reducers/treeViewSlice';

const store = configureStore({
    reducer: {
        treeView :  treeViewSlice
    },
})

window.store=store;
export default store;