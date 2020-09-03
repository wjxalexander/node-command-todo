const db = require("./db.js")
const inquirer = require("inquirer")

async function add(...tasks) {
    const list = await db.read()
    const extractTasks = tasks.length > 1 ? [...tasks].pop() : []
    const newList = list.concat(extractTasks.map(item => ({
        title: item,
        done: false
    })))
    await db.write(newList)
}

async function clear(...tasks) {
    await db.write([])
}

async function showAll() {
    const list = await db.read()
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "list",
                name: "index",
                message: "请选择任务",
                choices: [{
                    name: "quit",
                    value: "-1"
                }, ...list.map(({
                    title,
                    done
                }, index) => ({
                    name: `${done ? "[x]" : "[_]"}${index + 1} - ${title}`,
                    value: index.toString()
                })), {
                    name: "+ add task",
                    value: "-2"
                }]
            },
        ])
        .then(answers => {
            // Use user feedback for... whatever!!
            const {
                index
            } = answers
            switch (parseInt(index)) {
                case -2:
                    break;
                case -1:
                    break;
                default:
                    inquirer.prompt({
                        type: "list",
                        name: "action",
                        message: "choose next step",
                        choices: [{
                                name: "quit",
                                value: "quit"
                            },
                            {
                                name: "done",
                                value: "markAsDone"
                            },
                            {
                                name: "todo",
                                value: "markAsUnDone"
                            },
                            {
                                name: "edit title",
                                value: "updateTitle"
                            },
                            {
                                name: "delete",
                                value: "remove"
                            }
                        ]
                    }).then(answers2 => {
                        
                        const {
                            action
                        } = answers2
                        const chosenIdx = parseInt(index)
                        switch (action) {
                            case 'markAsDone':
                                list[chosenIdx].done = true
                                db.write(list)
                                break;
                            case 'markAsUnDone':
                                list[chosenIdx].done = false
                                db.write(list)
                                break;
                            case 'updateTitle':
                                inquirer.prompt({
                                    type: "input",
                                    name: "title",
                                    message: "what is your new title",
                                    default: list[chosenIdx].title 
                                }).then(ans=>{
                                    list[chosenIdx].title = ans.title
                                    db.write(list)
                                })
                                break;
                            case "delete":
                                list.splice(chosenIdx,1)
                                db.write(list)
                                break;
                            default:
                                break;
                        }
                    })
                    break;
            }
        })
        .catch(error => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
}


module.exports = {
    add,
    clear,
    showAll
}