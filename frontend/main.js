import { getCurrentBaseRoute, process, redirect, routes } from "./router.js"
import { bindSocketEvent, sendSocketEvent } from "./socket.js"
import { renderQuestList } from "./pages/questList.js"
import { questData } from "./questData.js"

function onDataUpdate(data) {
    questData.quests = data["quests"]
    questData.inventory = data["inventory"]
    questData.activeQuest = data["activeQuest"]

    if (getCurrentBaseRoute() === routes.questList) {
        renderQuestList()
    }
}

function main() {
    bindSocketEvent("update", onDataUpdate)
    sendSocketEvent("request_update")

    window.addEventListener("hashchange", (event) => process(event.oldURL, event.newURL))
    // TODO: loading site to a different route than questlist redirects to questlist immediately
    // redirect(routes.questList)
}

main()