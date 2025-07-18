class Battle {
    constructor() {
        this.combatants = {
            "player1": new Combatant({
                ...Pizzas["s001"],
                team: "player", // or enemy
                hp: 50,
                maxHp: 50,
                xp: 100,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
            "enemy1": new Combatant({
                ...Pizzas["v001"],
                team: "enemy",
                hp: 50,
                maxHp: 50,
                xp: 20,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
            "enemy2": new Combatant({
                ...Pizzas["f001"],
                team: "enemy",
                hp: 50,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null,
            }, this)
        },

        this.activeCombatants = {
            player: "player1",
            enemy: "enemy1"
        }
    }

    createElement() {
        console.log(this.combatants)
        this.element = document.createElement("div");
        this.element.classList.add("Battle")
        this.element.innerHTML = (`
        <div class="Battle_hero">
            <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
        </div>    
        <div class="Battle_enemy">
            <img src="${'/images/characters/people/npc3.png'}" alt="Enemy" />
        </div>  
        `)
    }

    init(container) {
        // create a screen of battle with 2 images: player and enemy
        this.createElement();
        container.appendChild(this.element);

        // loop through of combatants and call the init method
        Object.keys(this.combatants).forEach(key => {
            const combatant = this.combatants[key]
            combatant.id = key;
            combatant.init(this.element);
        })
    }
}