class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {
            this.gameLoop();
            // Set up rq animation frame for gameloop, step function always be called every single frame
            requestAnimationFrame(() => {
                step();
            })
        }
        step()
    }


    gameLoop() {
        // Clear rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
        // set up the camera person |  we pass cameraPerson into draw method, because we want camera feature
        const cameraPerson = this.map.gameObjects.hero;

        // Loop through all of overworldmap's object and update them
        Object.values(this.map.gameObjects).forEach((gameObj) => {
            // update the state of gameobject
            gameObj.update({
                arrow: this.directionInput.getDirection,
                map: this.map,
            })
        })

        // draw the lower map's img
        this.map.drawLowerImage(this.ctx, cameraPerson);

        // Loop through all of overworldmap's gameobject and draw them
        Object.values(this.map.gameObjects).sort((a, b) => a.y - b.y).forEach((gameObj) => {
            // draw the gameobject on the canvas
            gameObj.sprite.draw(this.ctx, cameraPerson)
        })

        // draw the upper map's img
        this.map.drawUpperImage(this.ctx, cameraPerson);
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // Check is there a person to talk to
            this.map.checkForActionCutscene();

        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                // Hero's position has changed
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();
        
        // Init the direction input listener, every single time we put down an arrow key, we have direction
        // example: this.directionInput.getDirection = "down" 
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Start the gameeee!
        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "hero", type: "walk", direction: "down" },
        //     { who: "hero", type: "walk", direction: "down" },
        //     { who: "hero", type: "walk", direction: "down" },
        //     { who: "hero", type: "stand", direction: "right", time: 100 },
        //     { who: "npcA", type: "walk", direction: "left" },
        //     { who: "npcA", type: "textMessage", text: "Hello trvv!" },
        // ])
    }
}