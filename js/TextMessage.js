class TextMessage {
    constructor({who, text, onComplete}) {
        this.who = who;
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        // create the element
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");
        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>    
            <button class="TextMessage_button">CONTINUE</button>
        `)

        // Init the typewriter effect
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text,
        })
        this.revealingText.init();

        this.element.querySelector(".TextMessage_button").addEventListener("click", () => {
            // Close the text message
            this.done();
        })

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done();
        })

    }

    done() {
        if (this.revealingText.isDone) {
            this.element.remove();
            this.onComplete();
            this.actionListener.unbind();
        } else {
            this.revealingText.warpToDone();
        }
    }
    
    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}