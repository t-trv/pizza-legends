class Combatant {
    constructor(config, battle) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })
        this.battle = battle;
    }
    // Exemple
    // hp: 50
    // icon: "/images/icons/veggie.png"
    // level: 1
    // maxHp: 50
    // name: "Call Me Kale"
    // src: "/images/characters/pizzas/v001.png"
    // status: null
    // team: "enemy"
    // type: "veggie"
    // xp: 20

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent() {
        const percent = this.xp / this.maxXp * 100;
        return percent > 100 ? 100 : percent;
    }

    get isActive() {
        return this.battle.activeCombatants[this.team] === this.id;
    }
    
    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team)
        this.hudElement.innerHTML = (`
            <p class="Combatant_name">${this.name}</p>
            <p class="Combatant_level"></p>
            <div class="Combatant_character_crop">
                <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
            </div>
            <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x="0" y="0" width="0%" height="1" fill="#82ff71" />
                <rect x="0" y="1" width="0%" height="2" fill="#3ef126" />
            </svg>
            <svg viewBox="0 0 26 2" class="Combatant_xp-container">
                <rect x="0" y="0" width="0%" height="1" fill="#ffd76a" />
                <rect x="0" y="1" width="0%" height="2" fill="#ffc934" />
            </svg>
            <p class="Combatant_status"></p>
        `);

        // set up a pizza combatant's image
        this.pizzaElement = document.createElement("img");
        this.pizzaElement.classList.add("Pizza");
        this.pizzaElement.setAttribute("src", this.src);
        this.pizzaElement.setAttribute("alt", this.name);
        this.pizzaElement.setAttribute("data-team", this.team);

        // get all of rect inside the life-container & xp-container
        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
    }

    update(changes={}) {
        // update anything incoming
        Object.keys(changes).forEach(key => {
            console.log(key)
            this[key] = changes[key]
        })

        // Update active flag to show the correct pizza and hud
        this.hudElement.setAttribute("data-active", this.isActive);
        this.pizzaElement.setAttribute("data-active", this.isActive);

        // Update HP & XP percent fills
        this.hpFills.forEach(rect => rect.setAttribute("width", `${this.hpPercent}%`));
        this.xpFills.forEach(rect => rect.setAttribute("width", `${this.xpPercent}%`));

        // Update level on the screen
        this.hudElement.querySelector(".Combatant_level").innerText = this.level;
    }

    init(container) {
        // create a hud of combatant like hp, xp, level, type, name | create combatant image
        // append child
        this.createElement();
        container.appendChild(this.hudElement)
        container.appendChild(this.pizzaElement)

        // call the update initial state
        this.update()
    }
}