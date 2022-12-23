import { configureStore } from '@reduxjs/toolkit';
import treeViewSlice from './reducers/TreeViewSlice';

const Store = configureStore({
    reducer: {
        treeView :  treeViewSlice
    },
})

export default Store;