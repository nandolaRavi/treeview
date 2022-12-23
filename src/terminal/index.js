import _, { create } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir, createFile, cutDir, deleteDir, findDirObj, setPath } from "../redux/reducers/TreeViewSlice";
import createTerminal, { createCommand } from "./terminal";

let myTerminal = createTerminal();

window.myterm = myTerminal;

myTerminal.addCommand(createCommand("set-prompt", 1, (args, terminal) => {
    terminal.setPrompt(args[0]);
    // terminal.printLine("Hello "+args[0]);
}))

function registerTerminalCommands(_curState, dispatch) {
    function cd(args, terminal) {
        let fileObj = findDirObj(_curState.curPath, _curState.files);
        let targetDir = null;

        if (args[0] === "..") {
            if (fileObj.path === 'Home') {
                return;
            }
            targetDir = findDirObj(fileObj.parentpath, _curState.files);
        } else {
            targetDir = findDirObj(_curState.curPath + "/" + args[0], fileObj.children);
        };

        if (!targetDir) {
            terminal.printLine("cd : not found " + args[0]);
            return;
        }
        if (targetDir.type !== '0') {
            terminal.printLine("cd : " + args[0] + " is not a dir");
            return;
        };
        if (args[0] === '..') {
            dispatch(setPath({ path: fileObj.parentpath }));
        } else {
            dispatch(setPath({ path: _curState.curPath + "/" + args[0] }));
        }
        return _.cloneDeep(_curState);
    }

    function dir(args, terminal) {
        let fileObj = findDirObj(_curState.curPath, _curState.files);
        fileObj.children.forEach(element => {
            if (!element.isDelete) {
                terminal.printLine(element.label)
            }
        });
    }

    function mkdir(args, terminal) {
        let fileObj = findDirObj(_curState.curPath, _curState.files);

        let targetPath = fileObj.path + "/" + args[0];

        let targetDir = findDirObj(targetPath, fileObj.children);
        if (targetDir) {
            terminal.printLine("mkdir:" + args[0] + " already exist");
            return
        }
        dispatch(createDir({
            name: args[0],
        }));
    }

    function touch(args, terminal) {
        let fileObj = findDirObj(_curState.curPath, _curState.files);

        let targetPath = fileObj.path + "/" + args[0];

        let targetDir = findDirObj(targetPath, fileObj.children);
        if (targetDir) {
            terminal.printLine("touch:" + args[0] + " already exist");
            return
        }
        dispatch(createFile({
            name: args[0],
        }));
    }

    function rm(args, terminal) {
        let fileObj = findDirObj(_curState.curPath, _curState.files);

        let targetPath = fileObj.path + "/" + args[0];

        let targetDir = findDirObj(targetPath, fileObj.children);

        if (!targetDir) {
            targetPath = args[0];
            targetDir = findDirObj(targetPath, _curState.files);
            if (!targetDir) {
                terminal.printLine("rm : " + args[0] + " not found");
                return;
            }
        }
        dispatch(deleteDir({
            path: targetDir.path
        }));
    }

    function pwd(args, terminal) {
        terminal.printLine(_curState.curPath);
    }
    function history(agre, terminal) {
        return;
    }

    function clearFn(args,terminal){
        terminal.outputLines=[];
        terminal.subscribe();
    }

    myTerminal.addCommand(createCommand("cd", 1, cd));
    myTerminal.addCommand(createCommand("dir", 0, dir));
    myTerminal.addCommand(createCommand("mkdir", 1, mkdir));
    myTerminal.addCommand(createCommand("touch", 1, touch));
    myTerminal.addCommand(createCommand("pwd", 0, pwd));
    myTerminal.addCommand(createCommand("rm", 1, rm));
    myTerminal.addCommand(createCommand('history', 0, history))
    myTerminal.addCommand(createCommand('cls',0,clearFn));
}



const Terminal = () => {
    const curState = useSelector(state => ({ ...state.treeView }));
    const [update, setUpdate] = useState("");

    useEffect(() => {
        myTerminal.setSubscribe(() => {
            setUpdate(Math.random() + "");
        })
    }, [setUpdate])

    useEffect(() => {
        myTerminal.setPrompt(curState.curPath);
        setUpdate(v => !v)
    }, [curState.curPath, setUpdate]);

    const dispatch = useDispatch();
    useEffect(() => {
        registerTerminalCommands(curState, dispatch);
        console.log(myTerminal.userInput)
    }, [dispatch, curState])

    const inputElement = useRef(null);
    useOutsideAlerter(inputElement);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            ref.current.focus();
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    ref.current.focus();
                }
            }
            document.addEventListener("click", handleClickOutside)
        }, [ref]);
    }

    return <>
        <div>
            <div style={{ "background": "lightgray", "border": "1px solid gray", "borderRadius": "4px", "marginTop": "5px", "padding": "10px", "fontWeight": "bold" }}>
                {curState.curPath}
            </div>
            <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }}>
                {
                    myTerminal.outputLines.map((t, index) => (
                        <div key={index}>{t}</div>
                    ))
                }
            </div>
            {myTerminal.userInput === 'history' &&
                <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }}>
                    {
                        myTerminal.history.map((t, index) => (
                            <>
                                <div key={index} className="d-flex">
                                    <div className="mx-1">{index + 1}.</div>
                                    <div>
                                        {t}
                                    </div>
                                </div>
                            </>
                        ))
                    }
                </div>
            }
        </div>

        <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }} >
            <span style={{ color: 'lightgreen' }}>
                {myTerminal.getPrompt()}
            </span>

            <input type='text' ref={inputElement}
                style={{ "background": "inherit", "border": "none", "outline": "none", "color": "white", "caretColor": "red", "fontWeight": "bold" }}
                onKeyPress={(e) => {
                    if (e.target.value === '') return;
                    if (e.key !== 'Enter') return;
                    myTerminal.setUserInput(e.target.value);
                    myTerminal.processUserInput();
                    e.target.value='';
                }} /></div>
    </>
}
export default Terminal;