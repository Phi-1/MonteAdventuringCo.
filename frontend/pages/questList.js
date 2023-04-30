import { questData } from "../questData.js"
import { redirect, routes } from "../router.js"
import {PAGE, clearPage, createInventoryElement} from "./common.js"

function createQuestListElement() {
    const questList = document.createElement("main")
    questList.classList.add("quest-list")
    return questList
}

function createQuestElement(title, xp, epic, rare) {
    const quest = document.createElement("div")
    quest.classList.add("quest")

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
        redirect(routes.addQuest)
    })

    return addQuest
}

export function renderQuestList(quests) {
    clearPage()
    const inventory = createInventoryElement()
    PAGE.appendChild(inventory)
    const questList = createQuestListElement()
    PAGE.appendChild(questList)
    const addQuest = createAddQuestElement()
    PAGE.appendChild(addQuest)

    for (let quest in questData.quests) {
        const title = questData.quests[quest]["title"]
        const xp = questData.quests[quest]["rewards"]["xp"]
        const epic = questData.quests[quest]["rewards"]["epic"]
        const rare = questData.quests[quest]["rewards"]["rare"]
        questList.appendChild(createQuestElement(title, xp, epic, rare))
    }
}