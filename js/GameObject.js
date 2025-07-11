class GameObject {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.direction = config.direction || "down";
        this.isMounted = false;
        this.sprite = new Sprite({
            src: config.src || "./images/characters/people/hero.png",
            useShadow: config.useShadow || false,
            gameObject: this,
        })
    }

    mount(map) {
        map.addWall(this.x, this.y);
        this.isMounted = true;
    }

    update() {

    }
}