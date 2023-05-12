import { navigateToRoute } from "../routing.js";
import { sendSocketEvent } from "../socket.js";
import { PAGE, clearPage, createInventoryElement, createMenu } from "./common.js";

function onTitleClick(questID, titleElement) {
    const currentTitle = titleElement.innerText
    const titleInput = document.createElement("input")
    titleInput.setAttribute("type", "text")
    titleInput.classList.add("view-quest-title")
    titleInput.value = currentTitle
    titleInput.dataset["dataSent"] = false

    titleInput.addEventListener("focusout", () => {
        if (titleInput.dataset["dataSent"] === "true") return
        const newTitleElement = createTitleElement()
        newTitleElement.innerText = titleInput.value
        titleInput.replaceWith(newTitleElement)
        sendSocketEvent("edit_title", { questID, title: titleInput.value })
    })
    titleInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return
        // TODO: dont allow only whitespace
        if (titleInput.value === "") {
            titleInput.replaceWith(titleElement)
            return
        }
        sendSocketEvent("edit_title", { questID, title: titleInput.value })
        titleInput.dataset["dataSent"] = true
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
        sendSocketEvent("edit_description", { questID, description: descriptionInput.value })
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
    objectiveInput.dataset["dataSent"] = false

    objectiveInput.addEventListener("focusout", () => {
        if (objectiveInput.dataset["dataSent"] === "true") return
        // TODO: dont allow text that is completely whitespace
        if (objectiveInput.value === "") {
            objectiveInput.replaceWith(addObjectiveElement)
            return
        }
        sendSocketEvent("add_objective", { questID, objectiveText: objectiveInput.value })
    })
    objectiveInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return
        if (objectiveInput.value === "") {
            objectiveInput.replaceWith(addObjectiveElement)
            return
        }
        sendSocketEvent("add_objective", { questID, objectiveText: objectiveInput.value })
        objectiveInput.dataset["dataSent"] = true
    })

    addObjectiveElement.replaceWith(objectiveInput)
    objectiveInput.focus()
}

function onEditObjective(questID, objectiveElement, objectiveIndex) {
    const objectiveInput = document.createElement("input")
    objectiveInput.setAttribute("type", "text")
    objectiveInput.classList.add("view-quest-objective")
    objectiveInput.value = objectiveElement.innerText
    objectiveInput.dataset["dataSent"] = false

    objectiveInput.addEventListener("focusout", () => {
        if (objectiveInput.dataset["dataSent"] === "true") return
        // TODO: dont allow text that is completely whitespace
        if (objectiveInput.value === "") {
            objectiveInput.replaceWith(objectiveElement)
            return
        }
        sendSocketEvent("edit_objective", { questID, objectiveIndex, objectiveText: objectiveInput.value })
    })
    objectiveInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return
        if (objectiveInput.value === "") {
            objectiveInput.replaceWith(objectiveElement)
            return
        }
        sendSocketEvent("edit_objective", { questID, objectiveIndex, objectiveText: objectiveInput.value })
        objectiveInput.dataset["dataSent"] = true
    })

    objectiveElement.replaceWith(objectiveInput)
    objectiveInput.focus()
}

function onDeleteObjective(questID, objectiveIndex) {
    sendSocketEvent("delete_objective", {questID, objectiveIndex})
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

        li.addEventListener("click", (event) => {
            if (event.target === markComplete) return
            createMenu(event.clientX, event.clientY,
                ["Edit", "Delete"],
                [() => onEditObjective(questID, li, index), () => onDeleteObjective(questID, index)])
        })

        objectivesList.appendChild(li)
    })

    const addObjectiveLi = document.createElement("li")
    addObjectiveLi.classList.add("view-quest-objective")
    addObjectiveLi.innerText = "Click to add objective"
    addObjectiveLi.addEventListener("click", () => onAddObjective(questID, objectivesList, addObjectiveLi))
    objectivesList.appendChild(addObjectiveLi)

    return objectivesList
}

// TODO: for all editable elements, add colored border around element after completing edit,
// so you can see when the server hasn't updated yet. Update event automatically clears border class
function onEditReward(questID, rewardElement, rewardType) {
    const rewardInput = document.createElement("input")
    rewardInput.setAttribute("type", "text")
    rewardInput.classList.add(`view-quest-${rewardType}-reward`)
    rewardInput.dataset["dataSent"] = false
    rewardInput.value = rewardElement.innerText.replace(/[a-zA-Z ]+/g, "")

    rewardInput.addEventListener("focusout", () => {
        if (rewardInput.dataset["dataSent"] === "true") return
        if (rewardInput.value === "") {
            rewardInput.replaceWith(rewardElement)
            return
        }
        rewardInput.replaceWith(rewardElement)
        // TODO: check input is numerical
        sendSocketEvent("edit_reward", { questID, rewardType, rewardValue: rewardInput.value })
        rewardInput.dataset["dataSent"] = true
        rewardElement.innerText = `${rewardInput.value}`
        if (rewardType === "xp") rewardElement.innerText += " XP"
        rewardInput.replaceWith(rewardElement)
    })
    rewardInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return
        if (rewardInput.value === "") {
            rewardInput.replaceWith(rewardElement)
            return
        }
        // TODO: check input is numerical
        sendSocketEvent("edit_reward", { questID, rewardType, rewardValue: rewardInput.value })
        rewardInput.dataset["dataSent"] = true
        rewardElement.innerText = `${rewardInput.value}`
        if (rewardType === "xp") rewardElement.innerText += " XP"
        rewardInput.replaceWith(rewardElement)
    })

    rewardElement.replaceWith(rewardInput)
    rewardInput.focus()
}

function createRewardsListElement(questID, questRewards) {
    const list = document.createElement("ul")
    list.classList.add("view-quest-rewards")

    const xpReward = document.createElement("li")
    xpReward.classList.add("view-quest-xp-reward")
    xpReward.innerText = `${questRewards.xp} XP`
    xpReward.addEventListener("click", () => onEditReward(questID, xpReward, "xp"))
    list.appendChild(xpReward)

    if (parseInt(questRewards.epic) > 0) {
        const epicReward = document.createElement("li")
        epicReward.classList.add("view-quest-epic-reward")
        epicReward.innerText = `${questRewards.epic}`
        epicReward.addEventListener("click", () => onEditReward(questID, epicReward, "epic"))
        list.appendChild(epicReward)
    }
    
    if (parseInt(questRewards.rare) > 0) {
        const rareReward = document.createElement("li")
        rareReward.classList.add("view-quest-rare-reward")
        rareReward.innerText = `${questRewards.rare}`
        rareReward.addEventListener("click", () => onEditReward(questID, rareReward, "rare"))
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

    // TODO: delete quest button

    main.append(...[title, description, objectivesList, rewardsList])
    return main
}

export function renderViewQuest(quest, inventoryData) {
    // TODO: on all edit functions, replace input element with standard element (and possibly colored border class) while database processes
    clearPage()
    const inventory = createInventoryElement(inventoryData)
    PAGE.appendChild(inventory)
    const main = createMainElement(quest["id"], quest["title"], quest["description"], quest["objectives"], quest["rewards"])
    PAGE.appendChild(main)
}