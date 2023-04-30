const files = require("./files")
const uniqid = require("uniqid")

const database = (() => {

    let dbData = {
        quests: {
            testid: {
                title: "Test Quest",
                description: "Slay the Test Dragon",
                objectives: [
                    { text: "Journey to the Test Mountain", completed: false },
                    { text: "Find the Test Sword of Test Legends", completed: false },
                    { text: "Kill the big guy", completed: false }
                ],
                rewards: {
                    xp: 300,
                    epic: 1,
                    rare: 1
                }
            }
        },
        inventory: {
            xp: 0,
            epic: 0,
            rare: 0
        },
        activeQuest: "testid"
    }
    let dbPath = ""

    async function saveData() {
        await files.write(dbPath, JSON.stringify(dbData))
    }

    return {
        init: async (filepath) => {
            const exists = await files.exists(filepath)
            dbPath = filepath
            if (exists) {
                const data = await files.read(dbPath)
                if (data) {
                    dbData = JSON.parse(data)
                } else {
                    console.error(`[DATABASE ERROR] Database file was read but no data was received, check integrity of file ${path}`)
                }
            } else {
                saveData()
            }
        },
        getData: () => {
            return dbData
        },
        addQuest: (title, description, objectives, rewards) => {
            const id = uniqid()
            const formattedObjectives = []
            objectives.forEach((objectiveText) => {
                formattedObjectives.push({text: objectiveText, completed: false})
            })

            dbData["quests"][id] = {
                title,
                description,
                objectives: formattedObjectives,
                rewards
            }

            saveData()
        }
    }
})()

module.exports = database