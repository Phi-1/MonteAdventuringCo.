import { navigateToRoute } from "../routing.js"
import { sendSocketEvent } from "../socket.js"
import {PAGE, clearPage, createInventoryElement} from "./common.js"

function createTitleInputElement() {
    const titleInput = document.createElement("input")
    titleInput.classList.add("new-quest-title")
    titleInput.setAttribute("type", "text")
    titleInput.setAttribute("placeholder", "Title")

    return titleInput
}

function createDescriptionInputElement() {
    const descriptionInput = document.createElement("textarea")
    descriptionInput.classList.add("new-quest-description")
    descriptionInput.setAttribute("placeholder", "Description")

    return descriptionInput
}

function createObjectivesListElement() {
    const objectivesList = document.createElement("ul")
    objectivesList.classList.add("new-quest-objectives")

    const newObjectiveInput = document.createElement("input")
    newObjectiveInput.setAttribute("type", "text")
    newObjectiveInput.setAttribute("placeholder", "Enter = add, period = remove")

    window.addEventListener("keypress", (event) => {
        // add objective
        if (document.activeElement === newObjectiveInput && event.key === "Enter") {
            const newObjective = document.createElement("li")
            newObjective.classList.add("quest-objective")
            newObjective.innerText = newObjectiveInput.value
            newObjectiveInput.value = ""
            objectivesList.appendChild(newObjective)
        }

        // remove objective
        if (document.activeElement === newObjectiveInput && event.key === "." && newObjectiveInput.value === "") {
            const lastObjective = objectivesList.lastElementChild
            if (lastObjective.getAttribute("id") === "add-quest-objective") return
            objectivesList.removeChild(lastObjective)
            setTimeout(() => newObjectiveInput.value = "", 10)
        }
    })

    const addObjectiveLi = document.createElement("li")
    addObjectiveLi.classList.add("quest-objective")
    addObjectiveLi.setAttribute("id", "add-quest-objective")
    addObjectiveLi.appendChild(newObjectiveInput)

    objectivesList.appendChild(addObjectiveLi)

    return objectivesList
}

function createRewardsElement() {
    const rewardsContainer = document.createElement("div")
    rewardsContainer.classList.add("new-quest-rewards")

    const label = document.createElement("span")
    label.innerText = "Rewards: "

    const xpRewardInput = document.createElement("input")
    xpRewardInput.setAttribute("id", "xp-reward")
    xpRewardInput.setAttribute("type", "text")
    xpRewardInput.setAttribute("maxlength", "3")
    xpRewardInput.value = "0"

    const epicRewardInput = document.createElement("input")
    epicRewardInput.setAttribute("id", "epic-reward")
    epicRewardInput.setAttribute("type", "text")
    epicRewardInput.setAttribute("maxlength", "3")
    epicRewardInput.value = "0"
    
    const rareRewardInput = document.createElement("input")
    rareRewardInput.setAttribute("id", "rare-reward")
    rareRewardInput.setAttribute("type", "text")
    rareRewardInput.setAttribute("maxlength", "3")
    rareRewardInput.value = "0"

    rewardsContainer.append(...[label, xpRewardInput, epicRewardInput, rareRewardInput])

    return rewardsContainer
}

function createSubmitElement() {
    const submitButton = document.createElement("div")
    submitButton.classList.add("new-quest-submit")
    submitButton.innerText = "Commission"

    return submitButton
}

function sendQuestData(titleElement, descriptionElement, objectivesListElement) {
    // TODO: check required fields. just return and add red border class to missing input
    const title = titleElement.value
    const description = descriptionElement.value
    const objectives = []
    for (let i = 0; i < objectivesListElement.children.length; i++) {
        const objective = objectivesListElement.children[i]
        if (objective.getAttribute("id") === "add-quest-objective") continue
        objectives.push(objective.innerText)
    }
    // TODO: cleaner way of passing in reward elements
    const rewards = {
        xp: document.getElementById("xp-reward").value,
        epic: document.getElementById("epic-reward").value,
        rare: document.getElementById("rare-reward").value
    }

    sendSocketEvent("add_quest", {
        title,
        description,
        objectives,
        rewards
    })
}

function createNewQuestElement() {
    const newQuestElement = document.createElement("main")
    newQuestElement.classList.add("new-quest")

    const titleInput = createTitleInputElement()
    const descriptionInput = createDescriptionInputElement()

    const objectivesTitle = document.createElement("h2")
    objectivesTitle.classList.add("new-quest-objectives-title")
    objectivesTitle.innerText = "Objectives: "

    const objectivesList = createObjectivesListElement()

    const rewards = createRewardsElement()

    const submit = createSubmitElement()

    submit.addEventListener("click", () => {
        // TODO: input checking
        sendQuestData(titleInput, descriptionInput, objectivesList)
        navigateToRoute("")
    })

    newQuestElement.append(...[titleInput, descriptionInput, objectivesTitle, objectivesList, rewards, submit])

    return newQuestElement
}

export function renderAddQuest() {
    clearPage()
    const inventory = createInventoryElement()
    PAGE.appendChild(inventory)
    const newQuestForm = createNewQuestElement()
    PAGE.appendChild(newQuestForm)
}