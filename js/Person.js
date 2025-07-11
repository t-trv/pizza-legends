// Person has been extended from gameobject because the person have to walk around, moving around the map
// and we need to create a specical class for them, and right here, we handle for person moving, start their behavior and something else

class Person extends GameObject {
    constructor(config) {
        super(config);

        // this gonna be += 16 because we need to keep track the person have to go to the next cell, and can't do anything else before go to there
        this.movingProgressRemaining = 0;

        // Overright the direction
        this.direction = "down";

        // this is the map for direction update
        this.directionUpdate = {
            "up"   : ["y",-1],
            "down" : ["y", 1],
            "left" : ["x",-1],
            "right": ["x", 1], 
        }

        this.isPlayerControlled = config.isPlayerControlled || false;
    }

    // state is an object contains arrow from player input, map reference,..
    // every single frames, if we have state.arrow, instantlly update the movingprogressremaining and tell the person to go to the next cell
    // if the person have done their ways yet then we can not move the person to the next cell
    update(state) {
        // 1. after we have arrow input then we update gameobject direction = state arrow
        // 2. += 16 movingprogress and call update sprite
        // 3. updateSprite check movingprogress > 16 then pass the walk with direction to sprite and update animation
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            // More case will come here
            // 
            // 

            // this case: we're keyboard ready and have an arrow pressed  
            if (this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow,
                })
            }

            // if movingprogress = 0 then the person's animation will be set as idle
            this.updateSprite();
        }
    }

    startBehavior(state, behavior) {
        this.direction = behavior.direction;

        if (behavior.type == "walk") {
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }
            this.movingProgressRemaining += 16;

            // if the person is going to walk then we move the wall follow that person
            state.map.moveWall(this.x, this.y, this.direction);
        }
    }


    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            // Array destructuring, the property is x of y, and change is +1 or -1 unit from the gameobject position
            // after -/+1 from the gameobject position, we need to -1 movingprogress util it's zero
            const [ property, change ] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.updateCurrentAnimation(`walk-`+this.direction);
            return;
        }

        this.sprite.updateCurrentAnimation(`idle-`+this.direction);
    }
}