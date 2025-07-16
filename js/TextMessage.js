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
            <p class="TextMessage_p">${this.who}: ${this.text}</p>    
            <button class="TextMessage_button">CONTINUE</button>
        `)

        this.element.querySelector(".TextMessage_button").addEventListener("click", () => {
            // Close the text message
            this.done();
        })

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done();
        })

    }

    done() {
        this.element.remove();
        this.onComplete();
        this.actionListener.unbind();
    }
    
    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}