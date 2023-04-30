import { renderAddQuest } from "./pages/addQuest.js"
import { renderQuestList } from "./pages/questList.js"

export const routes = {
    questList: "listings",
    addQuest: "commission"
}

export function process(oldURL, newURL) {
    const route = newURL.split("#")[1]
    const page = route.split("/")[0]

    switch (page) {
        case routes.questList:
            renderQuestList()
            break
        case routes.addQuest:
            renderAddQuest()
            break
    }
}

export function redirect(route) {
    const baseURL = window.location.href.split("#")[0] + "#"
    window.location.replace(baseURL + route)
}

export function getCurrentBaseRoute() {
    return window.location.href.split("#")[1].split("/")[0]
}