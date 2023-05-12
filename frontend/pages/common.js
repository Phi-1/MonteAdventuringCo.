
const PAGE = document.querySelector(".page")

function clearPage() {
    while (PAGE.lastElementChild) {
        PAGE.removeChild(PAGE.lastElementChild)
    }
}

function createInventoryElement(inventoryData) {
    const xp = inventoryData.xp
    const epic = inventoryData.epic
    const rare = inventoryData.rare

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

function createMenu(mouseX, mouseY, options, optionCallbacks) {
    const menu = document.createElement("div")
    menu.classList.add("options-menu")
    menu.style.setProperty("--xPos", `${mouseX}px`)
    menu.style.setProperty("--yPos", `${mouseY}px`)
    menu.style.setProperty("--nCols", options.length)

    PAGE.appendChild(menu)

    setTimeout(() => {
        options.forEach((optionText, index) => {
            const optionElement = document.createElement("div")
            optionElement.classList.add("options-menu-option")
            optionElement.innerText = optionText
            optionElement.addEventListener("click", () => {
                optionCallbacks[index]()
                menu.remove()
            })
            menu.appendChild(optionElement)
        })
    
        window.addEventListener("click", () => {
            if (!menu) return
            menu.remove()
        })
    }, 10)
}

export {PAGE, clearPage, createInventoryElement, createMenu}