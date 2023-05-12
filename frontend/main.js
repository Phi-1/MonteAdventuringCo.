import { processURL } from "./routing.js"
import { bindSocketEvent, sendSocketEvent } from "./socket.js"
import { renderQuestList } from "./pages/questList.js"
import { renderViewQuest } from "./pages/viewQuest.js"
import { renderAddQuest } from "./pages/addQuest.js"

function onDataUpdate(data) {

    const [route, options] = processURL()

    if (route === "") {
        renderQuestList(data["quests"], data["inventory"], data["activeQuest"])
    } else if (route === "commission") {
        renderAddQuest()
    } else if (route === "quests") {
        if (!options) {
            window.alert("Quest ID not found")
            return
        }
        for (let quest of data["quests"]) {
            if (quest.id !== options[0]) continue
            renderViewQuest(quest, data["inventory"])
            return
        }
        window.alert(`Quest with ID ${options[0]} does not exist`)
    }
}

function main() {
    bindSocketEvent("update", onDataUpdate)
    sendSocketEvent("request_update")
}

main()