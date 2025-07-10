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
                obj: gameObj
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






    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        
        // Init the direction input listener, every single time we put down an arrow key, we have direction
        // example: this.directionInput.getDirection = "down" 
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Start the gameeee!
        this.startGameLoop();
    }
}