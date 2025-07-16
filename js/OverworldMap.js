class OverworldMap {
    constructor(config) {
        this.mapId = config.mapId || null;

        // reference overworld
        this.overworld = null;

        // Set up the reference to gameobject 
        this.gameObjects = config.gameObjects;

        // Initial and set up the src for lower and upper img
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;


        // Initial walls
        this.walls = config.walls || {};

        // Initial cutscene spaces
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        // Initial cutscene playing, if we have a global cutsence, it's will be set true, false by default
        this.isCutscenePlaying = false;

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
        // this method below gonna stop doBehaviorLoop from gameobjects
        // so we have to reset gameobject dobehaviorloop
        this.isCutscenePlaying = true;
        
        // start a loop of async events
        // await each one
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({map: this, event: events[i]});
            await eventHandler.init();
        }
        this.isCutscenePlaying = false;
        
        // after startsceen stopped we have to reset gameobject dobehaviorloop
        Object.values(this.gameObjects).forEach(gameObj => {
            gameObj.doBehaviorEvent(this);
        })
    }

    // this method will be called from overworld-bindActionCutscene
    // check xem co person nao de noi chuyen khong, neu co thi startcutsence
    async checkForActionCutscene() {
        const hero = this.gameObjects.hero;
        const nextCoord = utils.nextPosition(hero.x, hero.y, hero.direction);
        // Object.values(this.gameObjects).forEach(gameObj => {
        //     if (JSON.stringify(gameObj.getPosition()) == JSON.stringify(nextCoord)) {
        //         console.log("dang noi chuyen")
        //     }
        // })
        const match = Object.values(this.gameObjects).find(gameObj => {
            return `${gameObj.x},${gameObj.y}` === `${nextCoord.x},${nextCoord.y}`;
        })

        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    // this method will be called from overworld-bindHeroPositionCheck
    // check xem position cua thang hero co trung voi cutscenespace nao khong, neu co thi startcutsence
    async checkForFootstepCutscene() {
        const hero = this.gameObjects.hero;
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]
        if (!this.isCutscenePlaying && match && match.length) {
            this.startCutscene(match[0].events)
        }
    }
}

window.OverworldMaps = {
    DemoRoom: {
        mapId: "DemoRoom",
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                useShadow: true,
                isPlayerControlled: true,
            }),
            dang_test_con_nay: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                useShadow: true,
                src: "./images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 },
                ],
                talking: [
                    {
                        events: [
                            { who: "Lisa", type: "textMessage", text: "Xin chao trvv!", faceHero: "dang_test_con_nay"},
                            { who: "Lisa", type: "textMessage", text: "Di cho khac choi, dang ban valorant roi" },
                        ]
                    }
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                useShadow: true,
                src: "./images/characters/people/npc2.png",
                // behaviorLoop: [
                //     { type: "walk", direction: "left" },
                //     { type: "stand", direction: "down", time: 800 },
                //     { type: "walk", direction: "up" },
                //     { type: "walk", direction: "right" },
                //     { type: "walk", direction: "down" },
                // ]
            })
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7,4)] : [
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "left" },
                        { who: "npcB", type: "stand", direction: "up", time: 100 },
                        { who: "Pony", type: "textMessage", text: "Di ra cho khac coi" },
                        { who: "npcB", type: "walk", direction: "right" },
                        { who: "npcB", type: "stand", direction: "down", time: 100 },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" },
                    ]
                }
            ],
            [utils.asGridCoord(5,10)] : [
                {
                    events: [
                        { type: "changeMap", mapName: "Kitchen" }
                    ]
                }
            ]
        }
    },
    Kitchen: {
        mapId: "Kitchen",
        lowerSrc: "/images/maps/KitchenLower.png",
        upperSrc: "/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(9),
                direction: "up",
                useShadow: true,
                isPlayerControlled: true,
            }),
            npcA: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(7),
                useShadow: true,
                src: "../images/characters/people/erio.png",
                talking: [
                    {
                        events: [
                            { who: "Orio", type: "textMessage", text: "Hello there!", faceHero: "npcA" },
                            { who: "npcA", type: "stand", direction: "down", time: 100},
                        ]
                    },
                ]
            })
        }
    }
}