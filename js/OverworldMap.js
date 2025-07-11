class OverworldMap {
    constructor(config) {
        // Set up the reference to gameobject 
        this.gameObjects = config.gameObjects;

        // Initial and set up the src for lower and upper img
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;


        // Initial walls
        this.walls = config.walls || {};
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage, 0 + utils.withGrid(10.5) - cameraPerson.x , 0  + utils.withGrid(6) - cameraPerson.y);
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImage, 0 + utils.withGrid(10.5) - cameraPerson.x , 0  + utils.withGrid(6) - cameraPerson.y);
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x,y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(initialX, initialY, direction) {
        this.removeWall(initialX, initialY);
        const {x,y} = utils.nextPosition(initialX, initialY, direction);
        this.addWall(x,y);
    }

    mountObjects() {
        Object.values(this.gameObjects).forEach(gameObj => {
            gameObj.mount(this);
        })
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
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        }
    }
}