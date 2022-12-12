import { createSlice } from '@reduxjs/toolkit';


const createFileItem = (path, name, type, content) => {
    return {
        path: path + "/" + name,
        label: name,
        type: type,
        content: content,
        children: []
    }
};

const findDir = (path, items = []) => {
    if (path === '/Home') return items;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.type === "0") {
            if (item.path === path)
                return item.children;
        }
        if (item.children && !!Array.isArray(item.children) && item.children.length > 0) {
            let res = findDir(path, item.children);
            if (res != null) {
                return res;
            };
        };
    };
    return null;
};


const initialState ={
    curPath: 'Home',
    currType: 'Home',
    currLable: 'Home',
    files: [
        {
            label: "Home",
            type: "0",
            path: "Home",
            children: []
        },
    ],
};

const treeViewSlice = createSlice({
    name: 'fileSystem',
    initialState,
    reducers: {
        setPath: (state, action) => {
            state.curPath = action.payload.path;
        },
        setType: (state, action) => {
            state.currType = action.payload.type;
        },
        createDir: (state, action) => {
            let newPath = JSON.parse(localStorage.getItem('newItem'))?.currPath;
            let target = findDir(newPath, state.files);
            if (!!Array.isArray(target)) {
                target.push(createFileItem(newPath, action.payload.name, action.payload.type, ""));
            } else {
                alert("facing error to create dire path:" + newPath);
            };
        },
    },
})

export const { setPath, createDir, setType } = treeViewSlice.actions;

export default  treeViewSlice.reducer
