import { createSlice } from '@reduxjs/toolkit';
var updateData = {};
export var copyDirObj = {};
var existsFileCount = 0;
export var isOPenAlert = false

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

window.findDir = findDirObj;

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
};

const removeChildren = (path, items) => {
    debugger
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.path === path) {
            item.children = [];
            return item
        }
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = removeChildren(path, item.children);
            if (res != null) {
                return res;
            };
        };
    };
    return null;
}
const findExistDir = (items = {}, lable) => {
    debugger
    for (let i = 0; i < items.children.length; i++) {
        let item = items.children[i];
        if (item.label === lable) {
            isOPenAlert = true
            return item
        }
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            let res = findExistDir(item.children, lable);
            if (res != null) {
                return res;
            };
        };

    }
}
const initialState = {
    curPath: 'Home',
    currTab: 'home',
    currType: 'Home',
    setView: false,

    sourcePath: '',//this will have path when you copy something
    destinationPath: '',

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
            let currObj = findDirObj(state.curPath, state.files);
            if (!currObj.children.map(t => t.label).includes(action.payload.name)) {
                let target = findDir(state.curPath, state.files);
                if (!!Array.isArray(target)) {
                    target.push(createFileItem(state.curPath, action.payload.name, action.payload.type, action.payload.description, action.payload.created_At));
                } else {
                    alert("facing error to create dir path:" + state.curPath);
                };
            } else {
                alert("already existsdir in:" + state.curPath)
            }
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
            state.destinationPath = action.payload.path;
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));
            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            }
            let destinationFileObject = findDirObj(state.destinationPath, state.files);
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

            if (destChild) {
                state.isConflict = true;
                return;
            };
            destinationFileObject.children.push(sourceFileObjectCopy);
        },

        mergeDir: (state, action) => {
            let sourceFileObject = findDirObj(state.sourcePath, state.files);
            let sourceFileObjectCopy = JSON.parse(JSON.stringify(sourceFileObject));
            if (!sourceFileObjectCopy) {
                alert("Error : invalid source path");
                return;
            }
            let destinationFileObject = findDirObj(state.destinationPath, state.files);

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

        replaseDir: (state, action) => {
            let destObj = findDirObj(state.destinationPath, state.files);
            if (!!destObj) {
                let srcObj = findDirObj(state.sourcePath, state.files);
                let sourceFileObjectCopy = JSON.parse(JSON.stringify(srcObj));
                let conflictObj = destObj.children.find(t => { return t.lable == sourceFileObjectCopy.lable });
                sourceFileObjectCopy.children.forEach(t => {
                    t.path = conflictObj.path + '/' + t.label;
                });
                conflictObj.children = sourceFileObjectCopy.children;
            }
        },

        //this will set the source path from where we want to copy data
        setCopySourcePath: (state, action) => {
            state.sourcePath = action.payload
        },
        setView: (state, action) => {
            state.setView = action.payload
        },
    },
})

export const { setPath, setCopySourcePath, createDir, replaseDir, mergeDir, setType, deleteDir, checkConfing, copyDir, cutDir, pasteDir, setCurTab, searchDir, editDir, getDataByCurrPath, setView, restoreDir, setTrasbin } = treeViewSlice.actions;

export default treeViewSlice.reducer;