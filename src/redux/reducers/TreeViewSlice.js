import { CreateNewFolder } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';
export var copyDirObj = {};
export var isOPenAlert = false

var commandLineArray = ['cd', 'cd..', 'cls'];
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
                    resstoreFileItem(children[j].path, children[j].children);
                }
            }
        }
    };
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

const findDirChildrenLable = (path, items = []) => {

}

const initialState = {
    curPath: 'Home',
    currTab: 'home',
    currType: '0',
    setView: false,

    sourcePath: '',//this will have path when you copy something
    destinationPath: '',

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
            state.curPath = action.payload.path;
        },
        setType: (state, action) => {
            state.currType = action.payload.type;
        },
        createFile: (state, action) => {
            let currObj = findDirObj(state.curPath, state.files);
            if (!currObj.children.map(t => t.label).includes(action.payload.name)) {
                let target = findDir(state.curPath, state.files);
                if (!!Array.isArray(target)) {
                    target.push(createFileItem(state.curPath, action.payload.name,"1","", new Date()));
                } else {
                    alert("facing error to create dir path:" + state.curPath);
                };
            } else {
                alert("already existsdir in:" + state.curPath)
            }
        },
        createDir: (state, action) => {
            let currObj = findDirObj(state.curPath, state.files);
            if (!currObj.children.map(t => t.label).includes(action.payload.name)) {
                let target = findDir(state.curPath, state.files);
                if (!!Array.isArray(target)) {
                    target.push(createFileItem(state.curPath, action.payload.name,"0","", new Date()));
                } else {
                    alert("facing error to create dir path:" + state.curPath);
                };
            } else {
                alert("already existsdir in:" + state.curPath)
            }
        },
        deleteDir: (state, action) => {
            deleteFileItem(action.payload.path, state.files);
        },
        restoreDir: (state, action) => {
            debugger
            resstoreFileItem(action.payload.path, state.files);
        },
        editDir: (state, action) => {
            // updateData = action.payload;
            // selectedDirEdit(action.payload.currPath, state.files);
        },
        setEditSourePath: (state, action) => {
            //    //    let target = selectedViewDir(action.payload.path, state.files);
            //     state.viewCurrDir = target;
        },
        setSearchText: (state, action) => {
            state.serachKeyWord = action.payload.text;
        },
        copyDir: (state, action) => {
            copyDirObj = action.payload.currObj;
            state.curPath = action.payload.path
        },

        pasteDir: (state, action) => {
            let existFileCount = 0;
            state.destinationPath = action.payload.path;
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));

            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            }
            let destinationFileObject = findDirObj(state.destinationPath, state.files);
            if (!destinationFileObject) {
                alert("Error : invalid destination path");
                return;

            }
            let destChild = destinationFileObject.children.find((fObj) => {
                return fObj.label === sourceFileObjectCopy.label;
            })
            sourceFileObjectCopy.path = destinationFileObject.path + '/' + sourceFileObjectCopy.label;

            if (sourceFileObjectCopy.children.length > 0) {
                for (let i = 0; i < sourceFileObjectCopy.children.length; i++) {
                    const element = sourceFileObjectCopy.children[i];
                    element.path = sourceFileObjectCopy.path + '/' + element.label;
                };
            };

            for (let j = 0; j < destinationFileObject.children.length; j++) {
                const element = destinationFileObject.children[j];
                if (element.type === '1' && element.label === sourceFileObjectCopy.label)
                    existFileCount = existFileCount + 1
                if (existFileCount > 0) {
                    sourceFileObjectCopy.label = sourceFileObject.label + `(${existFileCount})`;
                }
            }

            if (destChild && destChild.type === '0') {
                state.isConflict = true;
                return;
            };

            destinationFileObject.children.push(sourceFileObjectCopy);
        },

        mergeDir: (state) => {
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));
            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            };

            let destinationFileObject = findDirObj(state.destinationPath, state.files);
            if (!destinationFileObject) {
                alert("Error : invalid destination path");
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
        },

        replaseDir: (state) => {
            let destObj = findDirObj(state.destinationPath, state.files);

            if (!!destObj) {
                let srcObj = findDirObj(state.sourcePath, state.files);
                let sourceFileObjectCopy = JSON.parse(JSON.stringify(srcObj));
                let conflictObj = destObj.children.find(t => { return t.label == sourceFileObjectCopy.label });
                sourceFileObjectCopy.children.forEach(t => {
                    t.path = conflictObj.path + '/' + t.label;
                });
                for (let i = 0; i < sourceFileObjectCopy.children.length; i++) {
                    const element = sourceFileObjectCopy.children[i];
                    element.path = conflictObj.path + '/' + sourceFileObjectCopy.children[i].label;
                };
                conflictObj.children = sourceFileObjectCopy.children
            }
            alert("Error : invalid  destobj");
            return;
            ;
        },
        //this will set the source path from where we want to copy data
        setCopySourcePath: (state, action) => {
            state.sourcePath = action.payload
        },

        setInputMessage: (state, action) => {
            let cur_commandName = commandLineArray.find(item => { return item === action.payload.value.split(' ')[0] });
            if (cur_commandName) {
                state.terminalMessge.push(createMessage(action.payload.path, action.payload.value, 'No such file or directory', false));

            } else {
                switch (action.payload.value) {
                    case 'cls': {
                        state.terminalMessge = [];
                        return;
                    }
                    case 'cd..': {
                        let filterObj = findDirObj(action.payload.path, state.files);
                        if (!filterObj) {
                            state.terminalMessge.push(createMessage(action.payload.path, action.payload.value, "command not found", action.payload.isValidInput));
                            return;
                        };
                        let filterPerentObj = findDirObj(filterObj.parentpath, state.files);
                        if (!filterPerentObj) {
                            state.terminalMessge.push(createMessage(action.payload.path, action.payload.value, 'command not found', action.payload.isValidInput));
                            return;
                        };
                        state.curPath = filterPerentObj.path;
                        state.terminalMessge.push(createMessage(action.payload.path, action.payload.value, 'command not found', true));
                        return;
                    };
                };
            }

            state.terminalMessge.push(createMessage(action.payload.path, action.payload.value, action.payload.isValidInput));
        }
    },
})

export const { setPath, setCopySourcePath, setInputMessage, createDir, replaseDir,createFile, mergeDir, setType, deleteDir, copyDir, cutDir, pasteDir, setSearchText, editDir, setEditSourePath, restoreDir, } = treeViewSlice.actions;

export default treeViewSlice.reducer;