const mongoose = require("mongoose")
const files = require("./files")
const uniqid = require("uniqid")

const testData = {
    quests: [
        {
            id: "testid",
            title: "Test Quest",
            description: "Slay the Test Dragon",
            objectives: [
            {
                text: "Journey to the Test Mountain",
                completed: false
            },
            {
                text: "Find the Sword of Test Legends",
                completed: false
            },
            {
                text: "Kill the big guy",
                completed: false
            }
            ],
            rewards: {
                xp: 500,
                epic: 5,
                rare: 1
            }
        }
    ],
    inventory: {
        xp: 0,
        epic: 0,
        rare: 0
    },
    activeQuest: "testid"
}

const JSONDatabase = (() => {

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
        },
        editReward: (questID, rewardType, rewardValue) => {
            if (!questID in dbData.quests) return
            dbData.quests[questID].rewards[rewardType] = parseInt(rewardValue)
            saveData()
        }
    }
})()

const MONGODatabase = (() => {
    const questLogSchema = new mongoose.Schema({
        quests: [{
            id: String,
            title: String,
            description: String,
            objectives: [{ text: String, completed: Boolean }],
            rewards: {
                xp: Number,
                epic: Number,
                rare: Number
            }
        }],
        inventory: {
            xp: Number,
            epic: Number,
            rare: Number
        },
        activeQuest: String
    })

    const QuestLog = mongoose.model("questLog", questLogSchema)

    return {
        init: async (dbURL) => {
            return new Promise(async (resolve) => {
                const connection = await mongoose.connect(dbURL)
                resolve(connection)
            })
        },
        getData: async () => {
            return new Promise(async (resolve) => {
                const questLog = await QuestLog.findOne()
                resolve({
                    quests: questLog.quests,
                    inventory: questLog.inventory,
                    activeQuest: questLog.activeQuest
                })
            })
        },
        addQuest: async (title, description, objectives, rewards) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()

                const id = uniqid()
                const formattedObjectives = []
                objectives.forEach((objectiveText) => {
                    formattedObjectives.push({text: objectiveText, completed: false})
                })
    
                questLog.quests.push({
                    id,
                    title,
                    description,
                    objectives: formattedObjectives,
                    rewards
                })

                try {
                    await questLog.save()
                    resolve("test success")
                } catch(error) {
                    reject(error)
                }
            })
        },
        editTitle: async (questID, newTitle) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()
                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    quest.title = newTitle
                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        },
        editDescription: async (questID, newDescription) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()
                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    quest.description = newDescription
                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        },
        setObjectiveState: async (questID, objectiveIndex, completed) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()
                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    console.log("match")

                    quest.objectives[objectiveIndex].completed = completed

                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        console.log(error)
                        reject(error)
                    }

                    break
                }
            })
        },
        completeQuest: async (questID) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()
                for (let i = 0; i < questLog.quests.length; i++) {
                    const quest = questLog.quests[i]
                    if (quest.id !== questID) continue

                    questLog.inventory.xp += quest.rewards.xp
                    questLog.inventory.epic += quest.rewards.epic
                    questLog.inventory.rare += quest.rewards.rare

                    questLog.quests.splice(i, 1)

                    try {
                        await questLog.save()
                        resolve()
                    } catch(error) {
                        reject(error)
                    }

                    break
                }
            })
        },
        addObjective: async (questID, objectiveText) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()

                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    
                    quest.objectives.push({
                        text: objectiveText,
                        completed: false
                    })

                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        },
        removeObjective: async (questID, objectiveIndex) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()

                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    
                    quest.objectives.splice(objectiveIndex, 1)

                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        },
        editObjective: async (questID, objectiveIndex, newObjectiveText) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()

                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    
                    quest.objectives[objectiveIndex].text = newObjectiveText

                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        },
        editReward: async (questID, rewardType, rewardValue) => {
            return new Promise(async (resolve, reject) => {
                const questLog = await QuestLog.findOne()

                for (let quest of questLog.quests) {
                    if (quest.id !== questID) continue
                    
                    quest.rewards[rewardType] = rewardValue

                    try {
                        await questLog.save()
                        resolve("test success")
                    } catch(error) {
                        reject(error)
                    }
                    break
                }
            })
        }
    }
})()

module.exports = MONGODatabase