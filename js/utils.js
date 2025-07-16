const utils = {
    withGrid(n) {
        return n * 16;
    },
    asGridCoord(x,y) {
        return `${x*16},${y*16}`;
    },
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16;

        if (direction == "up")    y -= size;
        if (direction == "down")  y += size;
        if (direction == "left")  x -= size;
        if (direction == "right") x += size;

        return {x,y}
    },
    emitEvent(name, detail) {
        const event = new CustomEvent(name, {
            detail: detail
        })

        document.dispatchEvent(event);
    },
    getOppositeDirection(direction) {
        if (direction == "up") return "down"
        if (direction == "down") return "up"
        if (direction == "left") return "right"
        if (direction == "right") return "left"
    }
}