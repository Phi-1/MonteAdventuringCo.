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
        },
        editTitle: (questID, newTitle) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].title = newTitle
            saveData()
        },
        editDescription: (questID, newDescription) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].description = newDescription
            saveData()
        },
        setObjectiveState: (questID, objectiveIndex, completed) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].objectives[objectiveIndex].completed = completed
            saveData()
        },
        completeQuest: (id) => {
            if (!id in dbData.quests) return
            const rewards = dbData.quests[id]["rewards"]
            dbData.inventory.xp = `${parseInt(dbData.inventory.xp) + parseInt(rewards.xp)}`
            dbData.inventory.epic = `${parseInt(dbData.inventory.epic) + parseInt(rewards.epic)}`
            dbData.inventory.rare = `${parseInt(dbData.inventory.rare) + parseInt(rewards.rare)}`
            delete dbData.quests[id]
            saveData()
        },
        addObjective: (questID, objectiveText) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].objectives.push({ text: objectiveText, completed: false })
            saveData()
        },
        removeObjective: (questID, objectiveIndex) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].objectives.splice(objectiveIndex, 1)
            saveData()
        },
        editObjective: (questID, objectiveIndex, newObjectiveText) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].objectives[objectiveIndex].text = newObjectiveText
            saveData()
        }
    }
})()

module.exports = database