"use strict";

/* Object definitions */

var initialCell;

var config = {
    gridWidth: 800,
    gridHeight: 600,
    cellWidth: 5,
    cellHeight: 5,
    cellColors: ['#177e03', '#2bbe01', '#24db49', '#26a5d9'],
    cellTypes: [
        { color: "#177e03", name: "DarkGreen", replicationChance: 10 },
        { color: "#2bbe01", name: "MidGreen", replicationChance: 5 },
        { color: "#24db49", name: "LightGreen", replicationChance: 0 }
    ],
    liveCellType: { color: "#000", name: "LiveCell", replicationChance: 0 },
    deadCellType: { color: "#26a5d9", name: "DeadCell", replicationChance: 0 },
    gameSpeedMilliSec: 100
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

grid.addInitialCell = function (cell) {

    if (!initialCell) {

        cell.type = config.liveCellType;

        initialCell = cell;

        cell.draw();

        /* Update */

        var update = function () {

            for (var j = 0; j < this.gameCells.length; j++) {

                var cell = this.gameCells[j];

                // If this cell isn't live, skip
                if (cell.type !== config.liveCellType) {
                    continue;
                }

                var nearbyCells = cell.getNearbyCells();

                var numNearbyLiveCells = 0;

                for (var i = 0; i < nearbyCells.length; i++) {
                    if (nearbyCells[i] !== undefined && nearbyCells[i].type === config.liveCellType) {
                        numNearbyLiveCells++;
                    }
                }

                if (numNearbyLiveCells > 1) {
                    cell.type = cell.initialType;
                    cell.draw();
                    continue;
                }

                for (var i = 0; i < nearbyCells.length; i++) {

                    // If nearby cell isn't a cell, skip
                    if (nearbyCells[i] === undefined) {
                        continue;
                    }

                    var nearbyCell = nearbyCells[i];
                    var dieRoll = config.getRandomInt(100);
                    var replicateCell = nearbyCell.type.replicationChance > dieRoll;

                    if (replicateCell) {
                        nearbyCell.type = config.liveCellType;
                        nearbyCell.draw();
                    }
                }
            }
        }.bind(this);

        setInterval(update, config.gameSpeedMilliSec);
    }
};

var numCells = (config.gridWidth / config.cellWidth) * (config.gridHeight / config.cellHeight);

function Cell(id) {

    var self = this;

    this.type = config.getRandomCellType();
    this.initialType = this.type;
    this.element = document.createElement("div");
    this.id = id;
    this.element.id = id;
    this.element.className = this.className;
    this.element.style.width = this.getCSSWidth();
    this.element.style.height = this.getCSSHeight();
    this.element.style.backgroundColor = this.type.color;

    this.element.addEventListener("click", function () {
        grid.addInitialCell(self);
    });
}

Cell.prototype.width = config.cellWidth;
Cell.prototype.height = config.cellHeight;
Cell.prototype.getCSSWidth = function () { return this.width + "px"; };
Cell.prototype.getCSSHeight = function () { return this.height + "px"; };
Cell.prototype.className = "gridCell";
Cell.prototype.getElement = function () { return this.element; };
Cell.prototype.draw = function () { this.getElement().style.backgroundColor = this.type.color; };

Cell.prototype.getNearbyCells = function () {
    return [
        grid.gameCells[this.id - (grid.numCellsInRow + 1)],
        grid.gameCells[this.id - grid.numCellsInRow],
        grid.gameCells[(this.id + 1) - grid.numCellsInRow],
        grid.gameCells[this.id - 1],
        grid.gameCells[this.id + 1],
        grid.gameCells[this.id + grid.numCellsInRow - 1],
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