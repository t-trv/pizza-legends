class OverworldEvent {
    constructor({map, event}) {
        this.map = map;

        // event: {type: "walk", direction: "right", time: 800, who: "hero"}
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: this.event.type,
            direction: this.event.direction,
            time: this.event.time,
        })

        const eventHandler = e => {
            if (this.event.who === e.detail.whoId) {
                document.removeEventListener("PersonStandComplete", eventHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", eventHandler);
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: this.event.type,
            direction: this.event.direction,
            retry: true,
        })

        const eventHandler = e => {
            if (this.event.who === e.detail.whoId) {
                document.removeEventListener("PersonWalkingComplete", eventHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", eventHandler);
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve);
        })
    }
}