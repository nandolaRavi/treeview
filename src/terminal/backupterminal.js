
// export function createCommand(cmdName, numberOfargs, fn) {
//     return {
//         name: cmdName,
//         numberOfargs: numberOfargs,
//         process: fn
//     }
// }
// //this will create a new terminal
// export default function createTerminal() {
//     return {
//         commands: [],
//         history: [],
//         prompt1: "$",
//         prompt2: "/",
//         outputLines: [],
//         subscribe: function () {
//             console.log("this is old subscribe");
//         },
//         setSubscribe: function (cn) {
//             this.subscribe = cn;
//         },
//         printLine: function (line) {
//             this.outputLines.push(line);
//             this.subscribe();
//         },
//         userInput: "",
//         addCommand: function (cmd) {
//             // console.log("its called")
//             if (!cmd) {
//                 alert("Invalid value");
//                 return;
//             };
//             if (this.isValidCommand(cmd.name)) {
//                 let index = this.commands.findIndex(t => t.name === cmd.name)
//                 if (index >= 0) {
//                     if (this.commands[index].process = cmd.process) {
//                         // alert("Its an error")
//                         //at this point we are getting the same error
//                     };
//                     this.commands[index] = cmd;
//                 }
//                 return;
//             };
//             this.commands.push(cmd);
//         },
//         setPrompt: function (decor) {
//             this.prompt2 = decor;
//         },
//         getPrompt: function () {
//             return this.prompt2 + this.prompt1;
//         },
//         setUserInput: function (input) {
//             this.userInput = input;
//         },
//         isValidCommand: function (cmdName) {
//             return this.commands.map(t => t.name).includes(cmdName);
//         },
//         processUserInput: function () {
//             let inputData = this.userInput.trim().split(" ");
//             let fechOperator = inputData.filter((t) => { return t === '&&' || t === '||' });
//             let mode = 'sequence';
//             if (fechOperator[0] === '&&') {
//                 console.log('sequence', mode);
//             } else {
//                 mode = 'parallel'
//                 console.log('parallel', mode)
//             }
//             if (inputData.length == 0) {
//                 console.error("invalid input given");
//                 return;
//             };
//             let userCommand = inputData[0];
//             this.printLine(this.getPrompt() + " " + this.userInput);
//             if (!this.isValidCommand(userCommand)) {
//                 this.printLine(userCommand + " : " + " invalid command");
//                 return;
//             }
//             let cmd = this.commands.find(t => t.name === userCommand);
//             if (cmd.userCommandnumberOfargs > inputData.length - 1) {
//                 this.printLine(userCommand + " : " + " Too few argument required for " + userCommand);
//                 return;
//             }

//             if (cmd.numberOfargs < inputData.length - 1) {
//                 this.printLine(userCommand + " : " + " Too many argument provided ");
//                 return;
//             };

//             cmd.process(inputData.splice(1, inputData.length), this);
//             this.history.push(this.userInput)
//         }
//     };
// };


// // index js

// import _, { create } from "lodash";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createDir, createFile, cutDir, deleteDir, findDirObj, setPath } from "../redux/reducers/TreeViewSlice";
// import createTerminal, { createCommand } from "./terminal";

// let myTerminal = createTerminal();

// window.myterm = myTerminal;

// myTerminal.addCommand(createCommand("set-prompt", 1, (args, terminal) => {
//     terminal.setPrompt(args[0]);
//     // terminal.printLine("Hello "+args[0]);
// }))

// function registerTerminalCommands(_curState, dispatch) {
//     function cd(args, terminal) {
//         de
//         let fileObj = findDirObj(_curState.curPath, _curState.files);
//         let targetDir = null;

//         if (args[0] === "..") {
//             if (fileObj.path === 'Home') {
//                 return;
//             }
//             targetDir = findDirObj(fileObj.parentpath, _curState.files);
//         } else {
//             targetDir = findDirObj(_curState.curPath + "/" + args[0], fileObj.children);
//         };

//         if (!targetDir) {
//             terminal.printLine("cd : not found " + args[0]);
//             return;
//         }
//         if (targetDir.type !== '0') {
//             terminal.printLine("cd : " + args[0] + " is not a dir");
//             return;
//         };
//         if (args[0] === '..') {
//             dispatch(setPath({ path: fileObj.parentpath }));
//         } else {
//             dispatch(setPath({ path: _curState.curPath + "/" + args[0] }));
//         }
//         return _.cloneDeep(_curState);
//     }

//     function dir(args, terminal) {
//         let fileObj = findDirObj(_curState.curPath, _curState.files);
//         fileObj.children.forEach(element => {
//             if (!element.isDelete) {
//                 terminal.printLine(element.label)
//             }
//         });
//     }

//     function mkdir(args, terminal) {
//         let fileObj = findDirObj(_curState.curPath, _curState.files);

//         let targetPath = fileObj.path + "/" + args[0];

//         let targetDir = findDirObj(targetPath, fileObj.children);
//         if (targetDir) {
//             terminal.printLine("mkdir:" + args[0] + " already exist");
//             return
//         }
//         dispatch(createDir({
//             name: args[0],
//         }));
//     }

//     function touch(args, terminal) {
//         let fileObj = findDirObj(_curState.curPath, _curState.files);

//         let targetPath = fileObj.path + "/" + args[0];

//         let targetDir = findDirObj(targetPath, fileObj.children);
//         if (targetDir) {
//             terminal.printLine("touch:" + args[0] + " already exist");
//             return
//         }
//         dispatch(createFile({
//             name: args[0],
//         }));
//     }

//     function rm(args, terminal) {
//         let fileObj = findDirObj(_curState.curPath, _curState.files);

//         let targetPath = fileObj.path + "/" + args[0];

//         let targetDir = findDirObj(targetPath, fileObj.children);

//         if (!targetDir) {
//             targetPath = args[0];
//             targetDir = findDirObj(targetPath, _curState.files);
//             if (!targetDir) {
//                 terminal.printLine("rm : " + args[0] + " not found");
//                 return;
//             }
//         }
//         dispatch(deleteDir({
//             path: targetDir.path
//         }));
//     }

//     function pwd(args, terminal) {
//         terminal.printLine(_curState.curPath);
//     }
//     function history(agre, terminal) {
//         return;
//     }

//     myTerminal.addCommand(createCommand("cd", 1, cd));
//     myTerminal.addCommand(createCommand("dir", 0, dir));
//     myTerminal.addCommand(createCommand("mkdir", 1, mkdir));
//     myTerminal.addCommand(createCommand("touch", 1, touch));
//     myTerminal.addCommand(createCommand("pwd", 0, pwd));
//     myTerminal.addCommand(createCommand("rm", 1, rm));
//     myTerminal.addCommand(createCommand('history', 0, history))
// }



// const Terminal = () => {
//     const curState = useSelector(state => ({ ...state.treeView }));
//     const [update, setUpdate] = useState("");

//     console.log(myTerminal.userInput)
//     useEffect(() => {
//         myTerminal.setSubscribe(() => {
//             setUpdate(Math.random() + "");
//         })
//     }, [setUpdate])

//     useEffect(() => {
//         myTerminal.setPrompt(curState.curPath);
//         setUpdate(v => !v)
//     }, [curState.curPath, setUpdate]);

//     const dispatch = useDispatch();
//     useEffect(() => {
//         registerTerminalCommands(curState, dispatch)
//     }, [dispatch, curState])

//     const inputElement = useRef(null);
//     useOutsideAlerter(inputElement);

//     function useOutsideAlerter(ref) {
//         useEffect(() => {
//             ref.current.focus();
//             function handleClickOutside(event) {
//                 if (ref.current && !ref.current.contains(event.target)) {
//                     ref.current.focus();
//                 }
//             }
//             document.addEventListener("click", handleClickOutside)
//         }, [ref]);
//     }

//     return <>
//         <div>
//             <div style={{ "background": "lightgray", "border": "1px solid gray", "borderRadius": "4px", "marginTop": "5px", "padding": "10px", "fontWeight": "bold" }}>Head</div>
//             <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }}>
//                 {
//                     myTerminal.outputLines.map((t, index) => (
//                         <div key={index}>{t}</div>
//                     ))
//                 }
//             </div>
//             {myTerminal.userInput === 'history' &&
//                 <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }}>
//                     {
//                         myTerminal.history.map((t, index) => (
//                             <>
//                                 <div key={index} className="d-flex">
//                                     <div className="mx-1">{index + 1}.</div>
//                                     <div>
//                                         {t}
//                                     </div>
//                                 </div>
//                             </>
//                         ))
//                     }
//                 </div>
//             }
//         </div>

//         <div style={{ "background": "#141619", "color": "white", "fontWeight": "bold", "padding": "10px" }} >
//             <span style={{ color: 'lightgreen' }}>
//                 {myTerminal.getPrompt()}
//             </span>

//             <input type='text' ref={inputElement}
//                 style={{ "background": "inherit", "border": "none", "outline": "none", "color": "white", "caretColor": "red", "fontWeight": "bold" }}
//                 onKeyPress={(e) => {
//                     if (e.target.value === '') return;
//                     if (e.key !== 'Enter') return;
//                     myTerminal.setUserInput(e.target.value);
//                     myTerminal.processUserInput();
//                 }} /></div>
//     </>
// }