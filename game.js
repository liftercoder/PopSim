"use strict";

/* Object definitions */

var config = {
    gridWidth: 800,
    gridHeight: 600,
    cellWidth: 10,
    cellHeight: 10
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