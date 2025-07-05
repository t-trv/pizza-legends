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

        // Set up the reference to gameObject
        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        const x = this.gameObject.x - 8;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded && ctx.drawImage(this.shadow,
            x,y,
            32,32
        )

        this.isLoaded && ctx.drawImage(this.img,
            0,0,
            32,32,
            x,y,
            32,32
        )
    }
}