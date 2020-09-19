"use strict";

/* Object definitions */

var config = {
    gridWidth: 800,
    gridHeight: 600,
    cellWidth: 25,
    cellHeight: 25,
    cellColors: ['#177e03', '#2bbe01', '#24db49', '#26a5d9']
};

config.getRandomCellColor = function () {
    var total = this.cellColors.length - 1;
    return this.cellColors[Math.round(Math.random() * total)];
};

var grid = document.getElementById("grid");
grid.style.width = config.gridWidth + "px";
grid.style.height = config.gridHeight + "px";

grid.gameCells = [];

var numCells = (config.gridWidth / config.cellWidth) * (config.gridHeight / config.cellHeight);

function Cell(id) {
    this.element = document.createElement("div");
    this.element.id = id;
    this.element.className = this.className;
    this.element.style.width = this.getCSSWidth();
    this.element.style.height = this.getCSSHeight();
    this.element.style.backgroundColor = config.getRandomCellColor();
    var self = this;
    this.element.addEventListener("click", function () { self.getElement().style.backgroundColor = "#000"; });
}

Cell.prototype.width = config.cellWidth;
Cell.prototype.height = config.cellHeight;
Cell.prototype.getCSSWidth = function () { return this.width + "px"; };
Cell.prototype.getCSSHeight = function () { return this.height + "px"; };
Cell.prototype.className = "gridCell";
Cell.prototype.getElement = function () { return this.element; };

/* Render */

for(var i = 0; i < numCells; i++) {
    var cell = new Cell("cell" + i);
    grid.gameCells.push(cell);
    grid.appendChild(cell.getElement());
}