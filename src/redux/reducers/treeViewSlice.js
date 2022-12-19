import { createSlice } from '@reduxjs/toolkit';
var updateData = {};
var copyDirObj = {};
var existsFileCount = 0;

const createFileItem = (path, name, type, description) => {
    return {
        path: path + "/" + name,
        label: name,
        type: type,
        create_At: new Date().toDateString(),
        parentpath: path,
        isDelete: false,
        description: description,
        updated_At: null,
        children: []
    };
};
const cretaeFie = (path, name, description, create_At) => {
    return createFileItem(path, name, '1', description, create_At);
};

const cretaeFolder = (path, name, description, create_At) => {
    return createFileItem(path, name, '0', description, create_At);
};

const findDir = (path, items = []) => {
    if (path === '/Home') return items;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path)
            return item.children;
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = findDir(path, item.children);
            if (res != null) {
                return res;
            };
        };
    };
    return null;
};

export const findDirObj = (path, items = []) => {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path)
            return item;
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = findDirObj(path, item.children);
            if (res != null) {
                return res;
            };
        };
    };
    return null;
};
export const findDirArray = (path, items = []) => {
    let array = []
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path)
            array.push(item);
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = findDirArray(path, item.children);
            if (res != null) {
                return res;
            };
        };
    };
    return array;
};

const resstoreFileItem = (path, items = []) => {
    let fileItemObej = findDirObj(path, items);
    if (!fileItemObej) {
        return "Error"
    }
    if (fileItemObej.isDelete == true) {
        fileItemObej.isDelete = false;
        let parent = findDirObj(fileItemObej.parentpath, items);
        if (parent && parent.isDelete) {
            parent.isDelete = false;
        }
        if (fileItemObej.children.length > 0) {
            let children = fileItemObej.children;
            for (let j = 0; j < children.length; j++) {
                children[j].isDelete = false;
                if (children[j].type === '0') {
                    resstoreFileItem(children[j].path, children[j].children)
                }
            }
        }
    };
};

export const filterDir = (items = []) => {
    let deletedItem = []
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.isDelete == true) {
            deletedItem.push(item)
            if (item.type === '0') {
                continue;
            }
        }
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = filterDir(item.children);
            if (res.length > 0) {
                deletedItem = [...deletedItem, ...res];
            };
        };
    };
    return deletedItem;
};

const deleteFileItem = (path, items = []) => {
    debugger
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path) {
            item.isDelete = true;
            if (Array.isArray(item.children) && item.children.length > 0) {
                let children = item.children;
                for (let j = 0; j < children.length; j++) {
                    children[j].isDelete = true;
                    if (children[j].type === '0') {
                        deleteFileItem(children[j].path, children[j].children)
                    }
                }
            }
        }
        if (item.type === '0') {
            deleteFileItem(path, item.children)
        }
    }
};

const selectedDirEdit = (path, items = []) => {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.path === path) {
            item.label = updateData.name;
            item.description = updateData.description;
            item.updated_At = new Date().toDateString();
        } else if (item.children.length > 0) {
            selectedDirEdit(path, item.children);
        };
    }
};

const selectedViewDir = (path, items = []) => {
    let item;
    for (let i = 0; i < items.length; i++) {
        item = items[i];
        if (item.path === path) {
            return item;
        }
        if (item.children.length > 0) {
            let data = selectedViewDir(path, item.children);
            if (data) {
                return data;
            };
        };
    };
    return null;
};

const findExisFile = (path, items = []) => {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (path === item.path) {
            for (let j = 0; j < item.children.length; j++) {
                let children = item.children[j];
                if (children.type == '1') {
                    if (children.label === copyDirObj.label) {
                        existsFileCount = existsFileCount + 1
                    }
                }
            }
        }
        if (item.type === '0') {
            findExisFile(path, item.children)
        }
    }
}
const initialState = {
    curPath: 'Home',
    currTab: 'home',
    currType: 'Home',
    setView: false,
    serachKeyWord: '',
    currCopyObj: {},
    viewCurrDir: {},
    currLable: 'Home',
    files: [
        {
            label: "Home",
            type: "0",
            path: "Home",
            isDelete: false,
            parentpath: null,
            children: [
                cretaeFolder('Home', 'Test', '', new Date().toString(), false)
            ]
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
            const newPath = JSON.parse(localStorage.getItem('newItem'))?.currPath;
            let target = findDir(newPath, state.files);
            if (!!Array.isArray(target)) {
                target.push(createFileItem(newPath, action.payload.name, action.payload.type, action.payload.description, action.payload.created_At));
            } else {
                alert("facing error to create dire path:" + newPath);
            };
        },
        setCurTab: (state, action) => {
            state.currTab = action.payload.currTab
        },
        deleteDir: (state, action) => {
            deleteFileItem(action.payload.path, state.files);
        },
        restoreDir: (state, action) => {
            resstoreFileItem(action.payload.path, state.files);
        },
        editDir: (state, action) => {
            updateData = action.payload
            selectedDirEdit(action.payload.currPath, state.files);
        },
        getDataByCurrPath: (state, action) => {
            let target = selectedViewDir(action.payload.path, state.files);
            state.viewCurrDir = target;
        },
        searchDir: (state, action) => {
            state.serachKeyWord = action.payload.text;
        },
        copyDir: (state, action) => {
            copyDirObj = action.payload.currObj;
            state.curPath = action.payload.path
        },
        pasteDir: (state, action) => {
            const objCopy = { ...copyDirObj };
            let target = findDir(action.payload.currObj.path, state.files);
            findExisFile(action.payload.currObj.path, state.files);
            if (copyDirObj.type == '1') {
                let extistFileLabel = `${copyDirObj.label + `(${existsFileCount})`}`
                objCopy.label = extistFileLabel
            }
            if (target == null) {
                alert("First copy or cut dir")
            }
            if (copyDirObj.type == '0' && copyDirObj.path === action.payload.path) {
                alert(`${copyDirObj.label} already exist dir`);
            } else {
                target.push(objCopy)
            }
        },
        setView: (state, action) => {
            state.setView = action.payload
        },
    },
})

export const { setPath, createDir, setType, deleteDir, copyDir, cutDir, pasteDir, setCurTab, searchDir, editDir, getDataByCurrPath, setView, restoreDir, setTrasbin } = treeViewSlice.actions;

export default treeViewSlice.reducer;
