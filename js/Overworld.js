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

        // draw the lower map's img
        this.map.drawLowerImage(this.ctx);

        // Loop through all of overworldmap's gameobject and doing sth...
        Object.values(this.map.gameObjects).forEach((gameObj) => {
            // update the state of gameobject
            gameObj.update({
                arrow: this.directionInput.getDirection
            })

            // draw the gameobject on the canvas
            gameObj.sprite.draw(this.ctx)
        })

        // draw the upper map's img
        this.map.drawUpperImage(this.ctx);
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