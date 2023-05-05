/* data 
quests: {
    id: {
        title,
        description,
        rewards,
        objectives: [
            text
        ]
    }
}
inventory: {
    xp, ancient coins (epic), (rare)
}
active quest: id
*/

const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const database = require("./backend/database")
const io = new Server(server)

app.use(express.static(__dirname + "/frontend"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html")
})
app.get("/commission", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html")
})
app.get("/quests", (req, res) => {
    res.redirect("/")
})
app.get("/quests/:id", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html")
})

// TODO: big input checking everywhere for safety
io.on("connection", (socket) => {
    socket.on("add_quest", (data) => {
        // TODO: check that numerical values dont contain text
        database.addQuest(data.title, data.description, data.objectives, data.rewards)
        const questData = database.getData()
        io.emit("update", questData)
    })
    socket.on("request_update", () => {
        const questData = database.getData()
        socket.emit("update", questData)
    })
    socket.on("edit_title", (data) => {
        const questID = data["questID"]
        const title = data["title"]
        database.editTitle(questID, title)
        io.emit("update", database.getData())
    })
    socket.on("edit_description", (data) => {
        const questID = data["questID"]
        const description = data["description"]
        database.editDescription(questID, description)
        io.emit("update", database.getData())
    })
    socket.on("set_objective_state", (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objective"]
        const completed = data["completed"]
        database.setObjectiveState(questID, objectiveIndex, completed)
        io.emit("update", database.getData())
    })
    socket.on("complete_quest", (data) => {
        const id = data["id"]
        database.completeQuest(id) // TODO: error checking
        io.emit("update", database.getData())
    })
    socket.on("edit_objective", (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objectiveIndex"]
        const objectiveText = data["objectiveText"]
        database.editObjective(questID, objectiveIndex, objectiveText)
        io.emit("update", database.getData())
    })
    socket.on("add_objective", (data) => {
        const questID = data["questID"]
        const objectiveText = data["objectiveText"]
        database.addObjective(questID, objectiveText)
        io.emit("update", database.getData())
    })
    socket.on("delete_objective", (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objectiveIndex"]
        database.removeObjective(questID, objectiveIndex)
        io.emit("update", database.getData())
    })
    socket.on("edit_reward", (data) => {
        const questID = data["questID"]
        const rewardType = data["rewardType"]
        const rewardValue = data["rewardValue"]
        database.editReward(questID, rewardType, rewardValue)
        io.emit("update", database.getData())
    })
})

function main() {
    database.init(__dirname + "/db.json")
    server.listen(7890, () => console.log("Server is listening on port 7890"))
}

main()