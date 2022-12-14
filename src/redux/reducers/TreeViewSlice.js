import { CreateNewFolder, Satellite, Star } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';
import _, { filter, result } from 'lodash';
export var copyDirObj = {};
export var isOPenAlert = false;

const createFileItem = (path, name, type, description) => {
    return {
        path: path + "/" + name,
        label: name,
        type: type,
        create_At: new Date().toDateString(),
        parentpath: path,
        isDelete: false,
        isCut: false,
        description: description,
        updated_At: null,
        children: []
    };
};
const createMessage = (path, value, message, isValidInput) => {
    return {
        path: path,
        value: value,
        message: message,
        isValidInput: isValidInput,
        arg: []
    }
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
        return "Error";
    }
    if (fileItemObej.isDelete === true) {
        fileItemObej.isDelete = false;
    }
    let parent = findDirObj(fileItemObej.parentpath, items);
    if (parent && parent.isDelete) {
        parent.isDelete = false;
    };
    if (fileItemObej.children.length > 0) {
        let children = fileItemObej.children;
        for (let j = 0; j < children.length; j++) {
            let item = children[j]
            item.isDelete = true;
            resstoreFileItem(item.path, item.children);
        }
    }
};

export const filterDeleletdItem = (items = []) => {
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
            let res = filterDeleletdItem(item.children);
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
            if (item.children.length > 0) {
                for (let j = 0; j < item.children.length; j++) {
                    let insideObj = item.children[j];
                    insideObj.isDelete = true;
                    if (insideObj.children.length > 0) {
                        deleteFileItem(insideObj.path, insideObj.children);
                    }
                };
            };
        };
        if (item.type === '0') {
            deleteFileItem(path, item.children)
        };

    };
};

const filterCutObject = (path, items = []) => {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path) {
            item.isCut = true;
            if (Array.isArray(item.children) && item.children.length > 0) {
                let children = item.children;
                for (let j = 0; j < children.length; j++) {
                    children[j].isCut = true;
                    if (children[j].type === '0') {
                        filterCutObject(children[j].path, children[j].children)
                    }
                }
            }
        }
        if (item.type === '0') {
            filterCutObject(path, item.children)
        }
    }
};

const initialState = {
    curPath: 'Home',
    currTab: 'home',
    currType: '0',
    setView: false,

    sourcePath: '',//this will have path when you copy something
    destinationPath: '',
    cutSourePath: '',

    terminalMessge: [],
    validInputArr: [],

    errrorMessArr: [],
    serachKeyWord: '',
    currCopyObj: {},
    viewCurrDir: {},
    currLable: 'Home',
    isConflict: false,
    files: [
        {
            label: "Home",
            type: "0",
            path: "Home",
            isDelete: false,
            parentpath: null,
            children: [
                createFileItem("Home", "A", "0", ""),
                createFileItem("Home", "B", "0", ""),
                createFileItem("Home", "C", "0", "")
            ]
        },
    ],
};
const treeViewSlice = createSlice({
    name: 'fileSystem',
    initialState,
    reducers: {
        setPath: (state, action) => {
            let obj = findDirObj(action.payload.path, state.files);
            if (obj.type == '1') return;
            state.curPath = action.payload.path;
        },
        setType: (state, action) => {
            state.currType = action.payload.type;
        },
        createFile: (state, action) => {
            let currObj = findDirObj(state.curPath, state.files);
            if (currObj.children.map(t => t.label).includes(action.payload.name)) {
                alert("already existsdir in:" + state.curPath);
                return;
            };
            let target = findDir(state.curPath, state.files);
            if (!Array.isArray(target)) {
                alert("facing error to create dir path:" + state.curPath);
                return;
            }
            target.push(createFileItem(state.curPath, action.payload.name, "1", "", new Date()));
        },
        createDir: (state, action) => {
            let currObj = findDirObj(state.curPath, state.files);
            if (currObj.children.map(t => t.label).includes(action.payload.name)) {
                alert("already existsdir in:" + state.curPath);
                return;
            }
            let target = findDir(state.curPath, state.files);
            if (!Array.isArray(target)) {
                alert("facing error to create dir path:" + state.curPath);
                return;
            };
            target.push(createFileItem(state.curPath, action.payload.name, "0", "", new Date()));
        },
        deleteDir: (state, action) => {
            debugger
            deleteFileItem(action.payload.path, state.files);
        },
        restoreDir: (state, action) => {
            resstoreFileItem(action.payload.path, state.files);
        },
        editDir: (state, action) => {
            let obj = findDirObj(action.payload.path, state.files);
            if (!obj) {
                return;
            }
            obj.label = action.payload.name;
            obj.path = obj.parentpath + '/' + action.payload.name;
            state.curPath = obj.type === '1' ? obj.parentpath : obj.path;
            obj['updated_At'] = new Date().toDateString();
        },

        setSearchText: (state, action) => {
            state.serachKeyWord = action.payload.text;
        },
        copyDir: (state, action) => {
            copyDirObj = action.payload.currObj;
            state.curPath = action.payload.path
        },

        pasteDir: (state, action) => {
            state.destinationPath = action.payload.path;
            let destinationFileObject = findDirObj(state.destinationPath, state.files);
            if (!destinationFileObject) {
                alert("Error : invalid destination path");
                return;
            };

            let child = {};

            if (state.cutSourePath !== '') {
                let sourceCutObj = findDirObj(state.cutSourePath, state.files);
                let sourceCutObjCopy = JSON.parse(JSON.stringify(sourceCutObj));
                child = destinationFileObject.children.find((fObj) => {
                    return fObj.label === sourceCutObjCopy.label;
                });
                if (child && child.type === '0') {
                    state.isConflict = true;
                    return;
                };
                sourceCutObjCopy.path = destinationFileObject.path + '/' + sourceCutObjCopy.label;
                destinationFileObject.children.push(sourceCutObjCopy);
                filterCutObject(state.cutSourePath, state.files);
                return;
            };

            //copy
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let existFileCount = 0;

            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));
            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            };
            let destChild = destinationFileObject.children.find((fObj) => {
                return fObj.label === sourceFileObjectCopy.label;
            });

            sourceFileObjectCopy.path = destinationFileObject.path + '/' + sourceFileObjectCopy.label;
            sourceFileObjectCopy.parentpath = destinationFileObject.path
            if (sourceFileObjectCopy.children.length > 0) {
                sourceFileObjectCopy.forEach(element => {
                    element.path = sourceFileObjectCopy.path + '/' + element.label;
                });
            };

            for (let j = 0; j < destinationFileObject.children.length; j++) {
                const element = destinationFileObject.children[j];
                if (element.type === '1' && element.label === sourceFileObjectCopy.label)
                    existFileCount = existFileCount + 1
                if (existFileCount > 0) {
                    sourceFileObjectCopy.label = sourceFileObject.label + `(${existFileCount})`;
                }
            };

            if (destChild && destChild.type === '0') {
                state.isConflict = true;
                return;
            };
            destinationFileObject.children.push(sourceFileObjectCopy);
        },

        mergeDir: (state) => {
            let destinationFileObject = findDirObj(state.destinationPath, state.files);
            if (!destinationFileObject) {
                alert("Error : invalid destination path");
                return;
            };

            if (state.cutSourePath !== '') {
                let sourceCutObj = findDirObj(state.cutSourePath, state.files);
                if (!sourceCutObj) {
                    alert("Error : invalid cutSource path");
                    return;
                };
                let sourceCutObjCopy = JSON.parse(JSON.stringify(sourceCutObj));
                let child = destinationFileObject.children.find((fObj) => {
                    return fObj.label === sourceCutObjCopy.label;
                });
                for (let i = 0; i < sourceCutObjCopy.children.length; i++) {
                    let element = sourceCutObjCopy.children[i];
                    if (!child.children.map(t => t.label).includes(element.label)) {
                        element.path = child.path + '/' + sourceCutObjCopy.children[i].label;
                        element.parentpath = child.path;
                        child.children.push(element);
                    };
                };
                filterCutObject(state.cutSourePath, state.files);
                state.isConflict = false;
                return;
            };

            //files
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));
            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            };
            let destChild = destinationFileObject.children.find((fObj) => {
                return fObj.label === sourceFileObjectCopy.label;
            });

            for (let i = 0; i < sourceFileObjectCopy.children.length; i++) {
                const element = sourceFileObjectCopy.children[i];
                if (!destChild.children.map(t => t.label).includes(element.label)) {
                    element.path = destChild.path + '/' + sourceFileObjectCopy.children[i].label;
                    destChild.children.push(element);
                };
            };
            state.isConflict = false;
        },

        replaseDir: (state) => {
            let destObj = findDirObj(state.destinationPath, state.files);
            if (!!destObj) {
                if (state.cutSourePath !== '') {
                    let sourceCutObj = findDirObj(state.cutSourePath, state.files);
                    let sourceCutObjCopy = JSON.parse(JSON.stringify(sourceCutObj));
                    let conflictObject = destObj.children.find(t => { return t.label == sourceCutObjCopy.label });

                    if (sourceCutObjCopy.children.length > 0) {
                        for (let i = 0; i < sourceCutObjCopy.children.length; i++) {
                            let element = sourceCutObjCopy.children[i];
                            element.path = conflictObject.path + '/' + sourceCutObjCopy.children[i].label;
                        };
                        conflictObject.children = sourceCutObjCopy.children;
                    };

                    filterCutObject(state.cutSourePath, state.files);
                    state.isConflict = false;
                    return;
                };

                let srcObj = findDirObj(state.sourcePath, state.files);
                let sourceFileObjectCopy = JSON.parse(JSON.stringify(srcObj));
                let conflictObj = destObj.children.find(t => { return t.label == sourceFileObjectCopy.label });

                for (let i = 0; i < sourceFileObjectCopy.children.length; i++) {
                    const element = sourceFileObjectCopy.children[i];
                    element.path = conflictObj.path + '/' + sourceFileObjectCopy.children[i].label;
                };

                conflictObj.children = sourceFileObjectCopy.children;
                state.isConflict = false;
                return;
            }
            alert("Error : invalid  destobj");
        },

        setCopySourcePath: (state, action) => {
            state.sourcePath = action.payload;
            state.cutSourePath = ''
        },

        setCutSourePath: (state, action) => {
            state.cutSourePath = action.payload;
        },
        setIsConflict: (state, action) => {
            state.isConflict = false;
        }
    }
});

export const { setPath, setCopySourcePath, setIsConflict, setInputMessage, setCutSourePath, createDir, replaseDir, createFile, mergeDir, setType, deleteDir, copyDir, cutDir, pasteDir, setSearchText, editDir, setEditSourePath, restoreDir, } = treeViewSlice.actions;

export default treeViewSlice.reducer;