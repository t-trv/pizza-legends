class GameObject {
    constructor(config) {
        this.id = null;
        this.x = config.x;
        this.y = config.y;
        this.direction = config.direction || "down";
        this.isMounted = false;
        this.sprite = new Sprite({
            src: config.src || "./images/characters/people/hero.png",
            useShadow: config.useShadow || false,
            gameObject: this,
        })
        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
    }

    getPosition() {
        const x = this.x;
        const y = this.y;
        return {x,y};
    }

    update() {

    }

    mount(map) {
        map.addWall(this.x, this.y);
        this.isMounted = true;

        // If the GameObject has behaviorLoop then after we create GameObject
        // we gonna kick off their behaviorLoop after short delay
        // why? because the global cutscene will come in first
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }

    async doBehaviorEvent(map) {
        // if gameobject has no behaviorloop or global cutsence is playing => we gonna stop do behavior loop
        if (this.behaviorLoop.length === 0 || map.isCutscenePlaying || this.isStanding) {
            return;
        }

        // Initial event config
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // Create an event instance out of our next event config
        const eventHandler = new OverworldEvent({map: map, event: eventConfig});
        await eventHandler.init();

        // Setting the next event to fire | if we run out of event to fire, we will set to 0 (loop)
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        // Do it again
        this.doBehaviorEvent(map);
    }

}