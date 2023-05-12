import { navigateToRoute } from "../routing.js"
import {PAGE, clearPage, createInventoryElement} from "./common.js"

function createQuestListElement() {
    const questList = document.createElement("main")
    questList.classList.add("quest-list")
    return questList
}

function createQuestElement(id, title, xp, epic, rare) {
    const quest = document.createElement("div")
    quest.classList.add("quest")

    quest.addEventListener("click", (event) => {
        navigateToRoute(`quests/${id}`)
    })

    const questTitle = document.createElement("span")
    questTitle.classList.add("quest-title")
    questTitle.innerText = title

    const questRewards = document.createElement("ul")
    questRewards.classList.add("quest-rewards")
    const xpReward = document.createElement("li")
    xpReward.classList.add("xp-reward")
    xpReward.innerText = `${xp} XP`
    questRewards.appendChild(xpReward)
    if (epic > 0) {
        const epicReward = document.createElement("li")
        epicReward.classList.add("epic-item-reward")
        epicReward.innerText = `${epic}`
        questRewards.appendChild(epicReward)
    }
    if (rare > 0) {
        const rareReward = document.createElement("li")
        rareReward.classList.add("rare-item-reward")
        rareReward.innerText = `${rare}`
        questRewards.appendChild(rareReward)
    }

    quest.append(...[questTitle, questRewards])

    return quest
}

function createAddQuestElement() {
    const addQuest = document.createElement("div")
    addQuest.classList.add("add-quest-button")

    addQuest.addEventListener("click", (event) => {
        navigateToRoute("commission")
    })

    return addQuest
}

export function renderQuestList(quests, inventoryData, activeQuestID) {
    // TODO: active quest
    clearPage()
    const inventory = createInventoryElement(inventoryData)
    PAGE.appendChild(inventory)
    const questList = createQuestListElement()
    PAGE.appendChild(questList)
    const addQuest = createAddQuestElement()
    PAGE.appendChild(addQuest)

    for (let quest of quests) {
        const id = quest["id"]
        const title = quest["title"]
        const xp = quest["rewards"]["xp"]
        const epic = quest["rewards"]["epic"]
        const rare = quest["rewards"]["rare"]
        questList.appendChild(createQuestElement(id, title, xp, epic, rare))
    }
}