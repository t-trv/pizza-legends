class GameObject {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            src: config.src || "./images/characters/people/hero.png",
            useShadow: config.useShadow || false,
            gameObject: this,
        })
    }

    update() {

    }
}