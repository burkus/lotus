function Slider(x, y) {
    this.x = x;
    this.y = y;
    this.color = 0;
}

function drawFooter(x, y) {
    push();
    rectMode(CORNER);
    fill(45);
    rect(x, y, width, 100);
    slider.draw();
    pop();
}

Slider.prototype.draw = function() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, 25, 25);
    pop();
};
