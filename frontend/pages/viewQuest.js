import { questData } from "../questData.js";
import { navigateToRoute } from "../routing.js";
import { sendSocketEvent } from "../socket.js";
import { PAGE, clearPage, createInventoryElement } from "./common.js";

function onTitleClick(questID, titleElement) {
    const currentTitle = titleElement.innerText
    const titleInput = document.createElement("input")
    titleInput.setAttribute("type", "text")
    titleInput.classList.add("view-quest-title")
    titleInput.value = currentTitle
    titleInput.addEventListener("focusout", () => {
        const newTitleElement = createTitleElement()
        newTitleElement.innerText = titleInput.value
        titleInput.replaceWith(newTitleElement)
        // TODO: send new title to server
    })
    titleElement.replaceWith(titleInput)
    titleInput.focus()
}

function createTitleElement(questID, questTitle) {
    const title = document.createElement("h1")
    title.classList.add("view-quest-title")
    title.innerText = questTitle

    title.addEventListener("click", () => onTitleClick(questID, title))

    return title
}

function onDescriptionClick(questID, descriptionElement) {
    const currentDescription = descriptionElement.innerText
    const descriptionInput = document.createElement("textarea")
    descriptionInput.classList.add("view-quest-description")
    descriptionInput.value = currentDescription
    descriptionInput.addEventListener("focusout", () => {
        const newDescriptionElement = createDescriptionElement()
        newDescriptionElement.innerText = descriptionInput.value
        descriptionInput.replaceWith(newDescriptionElement)
        // TODO: send new description to server
    })
    descriptionElement.replaceWith(descriptionInput)
    descriptionInput.focus()
}

function createDescriptionElement(questID, questDescription) {
    const description = document.createElement("p")
    description.classList.add("view-quest-description")
    description.innerText = questDescription

    description.addEventListener("click", () => onDescriptionClick(questID, description))

    return description
}

function onAddObjective(questID, objectivesListElement, addObjectiveElement) {
    const objectiveInput = document.createElement("input")
    objectiveInput.setAttribute("type", "text")
    objectiveInput.classList.add("view-quest-objective")
}

function createObjectivesListElement(questID, questObjectives) {
    const objectivesList = document.createElement("ul")
    objectivesList.classList.add("view-quest-objectives")

    questObjectives.forEach((objective, index) => {
        const li = document.createElement("li")
        li.classList.add("view-quest-objective")
        if (objective.completed) li.classList.add("objective-complete")
        li.innerText = objective.text

        const markComplete = document.createElement("div")
        markComplete.classList.add("view-quest-mark-objective-complete")
        markComplete.addEventListener("click", () => {
            if (objective.completed) {
                sendSocketEvent("set_objective_state", { questID, objective: index, completed: false })
            } else {
                sendSocketEvent("set_objective_state", { questID, objective: index , completed: true })
            }
        })

        li.appendChild(markComplete)
        objectivesList.appendChild(li)
    })

    const addObjectiveLi = document.createElement("li")
    addObjectiveLi.classList.add("view-quest-objective")
    addObjectiveLi.innerText = "Click to add objective"
    addObjectiveLi.addEventListener("click", () => onAddObjective(questID, objectivesList, addObjectiveLi))
    objectivesList.appendChild(addObjectiveLi)

    return objectivesList
}

function createRewardsListElement(questID, questRewards) {
    const list = document.createElement("ul")
    list.classList.add("view-quest-rewards")

    const xpReward = document.createElement("li")
    xpReward.classList.add("view-quest-xp-reward")
    xpReward.innerText = `${questRewards.xp} XP`
    list.appendChild(xpReward)

    if (parseInt(questRewards.epic) > 0) {
        const epicReward = document.createElement("li")
        epicReward.classList.add("view-quest-epic-reward")
        epicReward.innerText = `${questRewards.epic}`
        list.appendChild(epicReward)
    }
    
    if (parseInt(questRewards.rare) > 0) {
        const rareReward = document.createElement("li")
        rareReward.classList.add("view-quest-rare-reward")
        rareReward.innerText = `${questRewards.rare}`
        list.appendChild(rareReward)
    }

    const completeButtonLi = document.createElement("li")
    const completeButton = document.createElement("div")
    completeButton.classList.add("view-quest-complete-quest-button")
    completeButton.innerText = "Complete"
    completeButtonLi.appendChild(completeButton)
    completeButton.addEventListener("click", () => {
        sendSocketEvent("complete_quest", { id: questID })
        navigateToRoute("")
    })
    list.appendChild(completeButtonLi)

    return list
}

function createMainElement(questID, questTitle, questDescription, questObjectives, questRewards) {
    const main = document.createElement("main")
    main.classList.add("view-quest")

    const title = createTitleElement(questID, questTitle)

    const description = createDescriptionElement(questID, questDescription)

    const objectivesList = createObjectivesListElement(questID, questObjectives)

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