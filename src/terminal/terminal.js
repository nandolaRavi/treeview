
export function createCommand(cmdName, numberOfargs, fn) {
    return {
        name: cmdName,
        numberOfargs: numberOfargs,
        process: fn
    }
}
//this will create a new terminal
export default function createTerminal() {
    return {
        commands: [],
        history: [],
        prompt1: "$",
        prompt2: "/homedfsdfsdf",
        outputLines: [],
        dirArry: [],
        subscribe: function () {
            console.log("this is old subscribe");
        },
        setSubscribe: function (cn) {
            this.subscribe = cn;
        },
        printLine: function (line) {
            this.outputLines.push(line);
            this.subscribe();
        },
        userInput: "",
        addCommand: function (cmd) {
            // console.log("its called")
            if (!cmd) {
                alert("Invalid value");
                return;
            };
            if (this.isValidCommand(cmd.name)) {
                let index = this.commands.findIndex(t => t.name === cmd.name)
                if (index >= 0) {
                    if (this.commands[index].process = cmd.process) {
                        // alert("Its an error")
                        //at this point we are getting the same error
                    };
                    this.commands[index] = cmd;
                }
                return;
            };
            this.commands.push(cmd);
        },
        setPrompt: function (decor) {
            this.prompt2 = decor;
        },
        getPrompt: function () {
            return this.prompt2 + this.prompt1;
        },
        setUserInput: function (input) {
            this.userInput = input;
        },
        isValidCommand: function (cmdName) {
            return this.commands.map(t => t.name).includes(cmdName);
        },
        processUserInputOld: function () {
            let inputData = this.userInput.trim().split(" ");
            if (inputData.length == 0) {
                console.error("invalid input given");
                return;
            };
            let userCommand = inputData[0];
            this.printLine(this.getPrompt() + " " + this.userInput);
            if (!this.isValidCommand(userCommand)) {
                this.printLine(userCommand + " : " + " invalid command");
                return;
            }
            let cmd = this.commands.find(t => t.name === userCommand);
            if (cmd.numberOfargs > inputData.length - 1) {
                this.printLine(userCommand + " : " + " Too few argument required for " + userCommand);
                return;
            }

            if (cmd.numberOfargs < inputData.length - 1) {
                this.printLine(userCommand + " : " + " Too many argument provided ");
                return;
            }
            cmd.process(inputData.splice(1, inputData.length), this);
            this.history.push(this.userInput)
        },
        process: function (exCommand = '') {
            let inputData = [];
            let cmdStr = exCommand !== '' ? exCommand : this.userInput;

            inputData = cmdStr.trim().split(" ");

            // console.log("processing :",cmdStr);
            // console.log("input data here :", inputData);

            if (inputData.length == 0) {
                console.error("invalid input given");
                return;
            };
            let userCommand = inputData[0];
            this.printLine(this.getPrompt() + " " + this.userInput);
            if (!this.isValidCommand(userCommand)) {
                this.printLine(userCommand + " : " + " invalid command");
                return;
            }
            let cmd = this.commands.find(t => t.name === userCommand);
            if (cmd.numberOfargs > inputData.length - 1) {
                this.printLine(userCommand + " : " + " Too few argument required for " + userCommand);
                return;
            }

            if (cmd.numberOfargs < inputData.length - 1) {
                this.printLine(userCommand + " : " + " Too many argument provided ");
                return;
            }
            cmd.process(inputData.splice(1, inputData.length), this);
            this.history.push(this.userInput)
        },
        processUserInput: function () {
            console.log("user input",this.userInput);
            let inputData = this.userInput.trim().split(" ");
            let operators = inputData.filter((t) => { return t === '&&' || t === '||' });
            if (operators.length === 0) return this.process(this.userInput);

            //when there is operators && and || in user input
            let exeMode = 'SEQ';
            let spitOprt = '';
            spitOprt = operators[0];
            if (operators[0] === '||') {
                exeMode = 'PARA'
            }
            //now we have to spit user input by spitort
            let oprtIndex = this.userInput.indexOf(spitOprt);
            let cmd1 = this.userInput.slice(0, oprtIndex).trim();
            let cmd2 = this.userInput.slice(oprtIndex + 2, this.userInput.length).trim();
            console.log("cmd1", cmd1, "cmd2", cmd2);
            if(exeMode==='SEQ'){
                this.process(cmd1)
                setTimeout(()=>{
                    this.userInput = cmd2;
                    this.processUserInput();
                },1)
                return;
            }
            setTimeout(()=>{
                this.process(cmd1);
            },1)
            setTimeout(()=>{
                this.userInput = cmd2;
                this.processUserInput();
            },1)


            // this.process(cmd2)


            //             if (i >= 0) {
            //             } else {
            //                 var partOne = this.userInput.trim()[0];
            //             }
            //             var partTwo = this.userInput.slice(i + 1, this.userInput.length).trim();


            // this.process("dir");
            return;
            // let inputData = this.userInput.trim().split(" ");
            // if (inputData.length == 0) {
            //     console.error("invalid input given");
            //     return;
            // };
            // let userCommand = inputData[0];
            // this.printLine(this.getPrompt() + " " + this.userInput);
            // if (!this.isValidCommand(userCommand)) {
            //     this.printLine(userCommand + " : " + " invalid command");
            //     return;
            // }
            // let cmd = this.commands.find(t => t.name === userCommand);
            // if (cmd.numberOfargs > inputData.length - 1) {
            //     this.printLine(userCommand + " : " + " Too few argument required for " + userCommand);
            //     return;
            // }

            // if (cmd.numberOfargs < inputData.length - 1) {
            //     this.printLine(userCommand + " : " + " Too many argument provided ");
            //     return;
            // }
            // cmd.process(inputData.splice(1, inputData.length), this);
            // this.history.push(this.userInput)
        }
    };
};