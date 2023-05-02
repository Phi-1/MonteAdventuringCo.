import { questData } from "../questData.js";
import { navigateToRoute } from "../routing.js";
import { sendSocketEvent } from "../socket.js";
import { PAGE, clearPage, createInventoryElement } from "./common.js";

function createObjectivesListElement(questObjectives) {
    const objectivesList = document.createElement("ul")
    objectivesList.classList.add("view-quest-objectives")

    questObjectives.forEach((objective) => {
        const li = document.createElement("li")
        li.classList.add("view-quest-objective")
        if (objective.completed) li.classList.add("objective-complete")
        li.innerText = objective.text
        const markComplete = document.createElement("div")
        markComplete.classList.add("view-quest-mark-objective-complete")
        li.appendChild(markComplete)
        objectivesList.appendChild(li)
    })

    return objectivesList
}

function createRewardsListElement(questID, questRewards) {
    const list = document.createElement("ul")
    list.classList.add("view-quest-rewards")

    const xpReward = document.createElement("li")
    xpReward.classList.add("view-quest-xp-reward")
    xpReward.innerText = `${questRewards.xp} XP`

    // TODO: only show epic or rare rewards when they are > 0
    const epicReward = document.createElement("li")
    epicReward.classList.add("view-quest-epic-reward")
    epicReward.innerText = `${questRewards.epic}`

    const rareReward = document.createElement("li")
    rareReward.classList.add("view-quest-rare-reward")
    rareReward.innerText = `${questRewards.rare}`

    const completeButtonLi = document.createElement("li")
    const completeButton = document.createElement("div")
    completeButton.classList.add("view-quest-complete-quest-button")
    completeButton.innerText = "Complete"
    completeButtonLi.appendChild(completeButton)
    completeButton.addEventListener("click", () => {
        sendSocketEvent("complete_quest", { id: questID })
        navigateToRoute("")
    })

    list.append(...[xpReward, epicReward, rareReward, completeButtonLi])

    return list
}

function createMainElement(questID, questTitle, questDescription, questObjectives, questRewards) {
    const main = document.createElement("main")
    main.classList.add("view-quest")

    const title = document.createElement("h1")
    title.classList.add("view-quest-title")
    title.innerText = questTitle

    const description = document.createElement("p")
    description.classList.add("view-quest-description")
    description.innerText = questDescription

    const objectivesList = createObjectivesListElement(questObjectives)

    const rewardsList = createRewardsListElement(questID, questRewards)

    main.append(...[title, description, objectivesList, rewardsList])
    return main
}

export function renderViewQuest(questID) {
    clearPage()
    const inventory = createInventoryElement()
    PAGE.appendChild(inventory)
    const main = createMainElement(questID, questData.quests[questID].title, questData.quests[questID].description, questData.quests[questID].objectives, questData.quests[questID].rewards)
    PAGE.appendChild(main)
}