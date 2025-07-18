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

    textMessage(resolve) {
        // Handle npc face to hero
        if (this.event.faceHero) {
            const whoFace = this.map.gameObjects[this.event.faceHero];
            whoFace.direction = utils.getOppositeDirection(this.map.gameObjects.hero.direction);
        }

        // init textMessage
        const message = new TextMessage({
            who: this.event.who,
            text: this.event.text,
            onComplete: resolve,
        })
        message.init(document.querySelector(".game-container"));
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init({
            container: document.querySelector(".game-container"),
            callback: () => {    
                this.map.overworld.startMap(window.OverworldMaps[this.event.mapName]);
                resolve();

                sceneTransition.fadeOut();
            }
        })
    }

    battle(resolve) {
        const battle = new Battle()
        battle.init(document.querySelector(".game-container"));
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve);
        })
    }
}