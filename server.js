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
app.get("/quests/:id", (req, res) => {
    const id = req.params["id"]
    res.sendFile(__dirname + "/frontend/index.html")
})

io.on("connection", (socket) => {
    console.log("someone connected")
    socket.on("add_quest", (data) => {
        database.addQuest(data.title, data.description, data.objectives, data.rewards)
        const questData = database.getData()
        io.emit("update", questData)
    })
    socket.on("request_update", () => {
        const questData = database.getData()
        io.emit("update", questData)
    })
    socket.on("complete_quest", (data) => {
        const id = data["id"]
        database.completeQuest(id) // TODO: error checking
        io.emit("update", database.getData())
    })
})

function main() {
    database.init(__dirname + "/db.json")
    server.listen(7890, () => console.log("Server is listening on port 7890"))
}

main()