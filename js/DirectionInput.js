class DirectionInput {
    constructor(config) {
        this.heldDiretions = [];

        // this is a map, convert from keycode to direction
        this.map = {
            "KeyW": "up",
            "KeyS": "down",
            "KeyA": "left",
            "KeyD": "right",

            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
        }
    }

    get getDirection() {
        return this.heldDiretions[0];
    }


    init() {
        document.addEventListener("keydown", e => {
            const direction = this.map[e.code];

            if (direction && this.heldDiretions.indexOf(direction) === -1) {
                this.heldDiretions.unshift(direction);
            }
        })

        document.addEventListener("keyup", e => {
            const direction = this.map[e.code];
            const index = this.heldDiretions.indexOf(direction);

            if (direction && index > -1) {
                this.heldDiretions.splice(index, 1);
            }
        })
    }
}