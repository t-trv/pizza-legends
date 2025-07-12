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

        // Initial cutscene playing, if we have a global cutsence, it's will be set true, false by default
        this.isCutscenePlaying = true;
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
        Object.keys(this.gameObjects).forEach(key => {

            // Identify the gameObj by thier key when they are created
            // create gameobj's id automatic
            let gameObj = this.gameObjects[key]
            gameObj.id = key;
            
            // call the mount method (gameobj)
            gameObj.mount(this);
        })
    }

    // this method is called from overworld and if the overworld has cutscene then we kick off a loop of events array
    // iscutsceneplaying will be set true, and dobehaviorloop gonna stop
    // after the cutsence has been done, the cutsenceplaying will be set true back
    // and then we call the mountObjects method to dobehaviorloop again!
    async startCutscene(events) {
        this.isCutscenePlaying = true;
        
        // start a loop of async events
        // await each one
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({map: this, event: events[i]});
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;
        this.mountObjects();
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
                src: "./images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 },
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(3),
                y: utils.withGrid(7),
                useShadow: true,
                src: "./images/characters/people/npc2.png",
                behaviorLoop: [
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "down", time: 800 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "down" },
                ]
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