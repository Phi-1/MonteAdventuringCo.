import { processURL } from "./routing.js"
import { bindSocketEvent, sendSocketEvent } from "./socket.js"
import { renderQuestList } from "./pages/questList.js"
import { questData } from "./questData.js"
import { renderViewQuest } from "./pages/viewQuest.js"
import { renderAddQuest } from "./pages/addQuest.js"

function onDataUpdate(data) {
    questData.quests = data["quests"]
    questData.inventory = data["inventory"]
    questData.activeQuest = data["activeQuest"]

    const [route, options] = processURL()

    if (route === "") {
        renderQuestList()
    } else if (route === "commission") {
        renderAddQuest()
    } else if (route === "quests") {
        if (!options) {
            window.alert("Quest ID not found")
            return
        }
        renderViewQuest(options[0])
    }
}

function main() {
    bindSocketEvent("update", onDataUpdate)
    sendSocketEvent("request_update")
}

main()