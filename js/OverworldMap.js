class OverworldMap {
    constructor(config) {
        // Set up the reference to gameobject 
        this.gameObjects = config.gameObjects;

        // Initial and set up the src for lower and upper img
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0);
    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0);
    }
}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                useShadow: true,
                isPlayerControlled: true,
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                useShadow: true,
                src: "./images/characters/people/npc1.png"
            })
        }
    }
}