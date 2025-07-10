class Sprite {
    constructor(config) {
        // Set up the img for gameobject
        this.img = new Image();
        this.img.src = config.src;
        this.img.onload = () => {
            this.isLoaded = true;
        }
        // Set up the shadow for gameobject if it has config.useShadow = true (false by default)
        if (config.useShadow) {
            this.shadow = new Image();
            this.shadow.src = "./images/characters/shadow.png";
            this.shadow.onload = () => {
                this.isShadowLoaded = true;
            }
        }

        // Configure animations & initial state
        this.animations = config.animations || {
            "idle-down" : [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up"   : [ [0,2] ],
            "idle-left" : [ [0,3] ],

            "walk-down" : [ [1,0],[0,0],[3,0],[0,0], ],
            "walk-right": [ [1,1],[0,1],[3,1],[0,1], ],
            "walk-up"   : [ [1,2],[0,2],[3,2],[0,2], ],
            "walk-left" : [ [1,3],[0,3],[3,3],[0,3], ]
        }
        this.currentAnimation =  "idle-down" // config.currentAnimation || "idle-down"
        this.currentAnimationFrame = 0;
        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        // Set up the reference to gameObject
        this.gameObject = config.gameObject;
    }


    get getFrame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    // we use this method to update the currrent animation
    // use it from person updateSprite (person.js)
    updateCurrentAnimation(animation) {
        if (animation !== this.currentAnimation) {
            this.currentAnimation = animation;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    // Loop every single frame and update the currentAnimationFrame
    // and then we can get the frame (frameX, frameY) from this.animations[this.currentAnimation][this.currentAniamtionFrame]
    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }
        
        // if frame was out of animations -> reset animationFrame to zero
        this.currentAnimationFrame += 1;
        if (this.currentAnimationFrame === this.animations[this.currentAnimation].length) {
            this.currentAnimationFrame = 0;
        }

        // Reset the counter of animationFrameProgress to initation
        this.animationFrameProgress = this.animationFrameLimit;
    }


    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

        const [frameX, frameY] = this.getFrame;

        this.isShadowLoaded && ctx.drawImage(this.shadow,
            x,y,
            32,32
        )

        this.isLoaded && ctx.drawImage(this.img,
            frameX * 32, frameY * 32,
            32,32,
            x,y,
            32,32
        )

        // 1. every single frame, we call draw method and then call updateAniamtionProgress method
        // 2. every 8 frames, we plus 1 currentAnimationFrame and show the next animation
        this.updateAnimationProgress();
    }
}