"use strict";

/* Object definitions */

var initialCell;

var config = {
    gridWidth: 800,
    gridHeight: 800,
    cellWidth: 10,
    cellHeight: 10,
    liveCellType: { id: 1, color: "#fff", name: "LiveCell" },
    emptyCellType: { id: 2, color: "#000", name: "EmptyCell" },
    gameSpeedMilliSec: 30
};

config.getRandomInt = function (max) {
    return Math.round(Math.random() * max);
};

config.getRandomCellType = function () {
    var total = this.cellTypes.length - 1;
    return config.cellTypes[config.getRandomInt(total)];
};

var grid = document.getElementById("grid");
grid.style.width = config.gridWidth + "px";
grid.style.height = config.gridHeight + "px";
grid.numCellsInRow = config.gridWidth / config.cellWidth;

grid.gameCells = [];

var numLiveCells = 0;

grid.addLiveCell = function (cell) {

    cell.type = config.liveCellType;
    numLiveCells++;
    cell.draw();
    updateLiveCellCounter();

};

function getNumNearbyLiveCells(nearbyCells) {

    var numNearbyLiveCells = 0;

    for (var i = 0; i < nearbyCells.length; i++) {

        if (nearbyCells[i] === undefined) {
            continue;
        }

        if (nearbyCells[i].type.id === config.liveCellType.id) {
            numNearbyLiveCells++;
        }
    }

    return numNearbyLiveCells;
}

var liveCellCounter = document.getElementById("liveCellCounter").children[0];

function updateLiveCellCounter() {
    liveCellCounter.innerHTML = numLiveCells;
}

grid.start = function () {

    var update = function () {

        updateLiveCellCounter();

        for (var j = 0; j < this.gameCells.length; j++) {

            var cell = this.gameCells[j];

            var numNearbyLiveCells = getNumNearbyLiveCells(cell.getNearbyCells());

            if (cell.type.id === config.liveCellType.id) {

                if (numNearbyLiveCells < 2 || numNearbyLiveCells > 3) {
                    cell.futureType = config.emptyCellType;
                }

            }

            if(cell.type.id === config.emptyCellType.id) {
                if (numNearbyLiveCells === 3) {
                    cell.futureType = config.liveCellType;
                }
            }
        }

        for (var j = 0; j < this.gameCells.length; j++) {

            var cell = this.gameCells[j];
            cell.type = cell.futureType || cell.type;
            cell.draw();
        }

    }.bind(this);

    setInterval(update, config.gameSpeedMilliSec);
};

document.getElementById("startButton").addEventListener("click", function () { grid.start(); });


var numCells = (config.gridWidth / config.cellWidth) * (config.gridHeight / config.cellHeight);

function Cell(id) {

    var self = this;

    this.type = config.emptyCellType;
    this.initialType = this.type;
    this.element = document.createElement("div");
    this.id = id;
    this.element.id = id;
    this.element.className = this.className;
    this.element.style.width = this.getCSSWidth();
    this.element.style.height = this.getCSSHeight();
    this.element.style.backgroundColor = this.type.color;

    this.element.addEventListener("click", function () {
        grid.addLiveCell(self);
    });
}

Cell.prototype.width = config.cellWidth;
Cell.prototype.height = config.cellHeight;

Cell.prototype.getCSSWidth = function () {
    return this.width + "px";
};
Cell.prototype.getCSSHeight = function () {
    return this.height + "px";
};

Cell.prototype.className = "gridCell";

Cell.prototype.getElement = function () {
    return this.element;
};

Cell.prototype.draw = function () {
    this.getElement().style.backgroundColor = this.type.color;
};

Cell.prototype.getNearbyCells = function () {
    return [
        grid.gameCells[this.id - (grid.numCellsInRow + 1)],
        grid.gameCells[this.id - grid.numCellsInRow],
        grid.gameCells[(this.id + 1) - grid.numCellsInRow],
        grid.gameCells[this.id - 1],
        grid.gameCells[this.id + 1],
        grid.gameCells[(this.id + grid.numCellsInRow) - 1],
        grid.gameCells[this.id + grid.numCellsInRow],
        grid.gameCells[this.id + grid.numCellsInRow + 1],
    ];
}

/* Render */

for(var i = 0; i < numCells; i++) {
    var cell = new Cell(i);
    grid.gameCells.push(cell);
    grid.appendChild(cell.getElement());
}