const path = require("path")
const fs = require("fs")

const homedir = process.env.HOME || require("os").homedir()
const dbPath = path.join(homedir, "todo.txt")

module.exports = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {
                flag: "a+"
            }, (error, content) => {
                if (error) {
                    reject(error)
                    return
                }
                let list
                try {
                    list = JSON.parse(content)
                } catch (error) {
                    list = []
                }
                resolve(list)
            })
        }).catch(err=>console.log(err))
    },
    write(list,path = dbPath) {
        return new Promise((resolve, reject) => {
            const str = JSON.stringify(list) + "\n"
            fs.writeFile(path, str, reject)
        }).catch(console.log)

    }
}