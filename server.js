require("dotenv").config()
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
    socket.on("add_quest", async (data) => {
        // TODO: check that numerical values dont contain text
        await database.addQuest(data.title, data.description, data.objectives, data.rewards)
        const questData = await database.getData()
        io.emit("update", questData)
    })
    socket.on("request_update", async () => {
        const questData = await database.getData()
        socket.emit("update", questData)
    })
    socket.on("edit_title", async (data) => {
        const questID = data["questID"]
        const title = data["title"]
        await database.editTitle(questID, title)
        io.emit("update", await database.getData())
    })
    socket.on("edit_description", async (data) => {
        const questID = data["questID"]
        const description = data["description"]
        await database.editDescription(questID, description)
        io.emit("update", await database.getData())
    })
    socket.on("set_objective_state", async (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objective"]
        const completed = data["completed"]
        console.log(await database.setObjectiveState(questID, objectiveIndex, completed))
        io.emit("update", await database.getData())
    })
    socket.on("complete_quest", async (data) => {
        const id = data["id"]
        await database.completeQuest(id) // TODO: error checking
        io.emit("update", await database.getData())
    })
    socket.on("edit_objective", async (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objectiveIndex"]
        const objectiveText = data["objectiveText"]
        await database.editObjective(questID, objectiveIndex, objectiveText)
        io.emit("update", await database.getData())
    })
    socket.on("add_objective", async (data) => {
        const questID = data["questID"]
        const objectiveText = data["objectiveText"]
        await database.addObjective(questID, objectiveText)
        io.emit("update", await database.getData())
    })
    socket.on("delete_objective", async (data) => {
        const questID = data["questID"]
        const objectiveIndex = data["objectiveIndex"]
        await database.removeObjective(questID, objectiveIndex)
        io.emit("update", await database.getData())
    })
    socket.on("edit_reward", async (data) => {
        const questID = data["questID"]
        const rewardType = data["rewardType"]
        const rewardValue = data["rewardValue"]
        await database.editReward(questID, rewardType, rewardValue)
        io.emit("update", await database.getData())
    })
})

async function main() {
    await database.init(process.env["DB_URL"])
    server.listen(7890, () => console.log("Server is listening on port 7890"))
}

main()