import { questData } from "../questData.js"

const PAGE = document.querySelector(".page")

function clearPage() {
    while (PAGE.lastElementChild) {
        PAGE.removeChild(PAGE.lastElementChild)
    }
}

function createInventoryElement() {
    const xp = questData.inventory.xp
    console.log(xp)
    const epic = questData.inventory.epic
    const rare = questData.inventory.rare

    const inventory = document.createElement("nav")
    inventory.classList.add("inventory")

    const name = document.createElement("span")
    name.classList.add("inventory-name")
    name.innerText = `Level ${Math.floor(xp/100)} Adventurer`

    const level = document.createElement("span")
    level.classList.add("inventory-level")
    level.innerText = `${xp%100} / 100 XP`

    const epicItem = document.createElement("span")
    epicItem.classList.add("inventory-epic-item")
    epicItem.innerText = `${epic}`

    const rareItem = document.createElement("span")
    rareItem.classList.add("inventory-rare-item")
    rareItem.innerText = `${rare}`

    inventory.append(...[name, level, epicItem, rareItem])

    return inventory
}

export {PAGE, clearPage, createInventoryElement}