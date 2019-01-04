$(document).ready(function() {
	$.getJSON("conall-cn.json", function(res) {
		makeGrid(res);
		ko.applyBindings(vm);
	});
});

var GRID_WIDTH = 5;
var GRID_HEIGHT = 5;
var TEAM_A_WORDS = 9;
var TEAM_B_WORDS = 8;
var NEUTRAL_WORDS = 7;
var SNITCH_WORDS = 1;

var vm = {
	
	grid : ko.observableArray(),
	words : ko.observable(true),
	key : ko.observable(false)
	
};

function makeElement(initX, initY, initWord, initTeam, initClr) {
	return {
		x : initX,
		y : initY,
		word : ko.observable(initWord),
		team : initTeam,
		clr : initClr,
		guessed : ko.observable(false)
	}
}

function makeGrid(words) {
	var initGrid = [];
	for (var a = 0; a < GRID_HEIGHT; a++) {
		initGrid.push([]);
		for (var b = 0; b < GRID_WIDTH; b++) {
			initGrid[a].push(null);
		}
	}
	var numOfKeysNeeded = (GRID_WIDTH * GRID_HEIGHT);
	var usedPos = [];
	var usedWords = [];
	var elementTypes = [
		{
			type : "A",
			clr : "red",
			numNeeded : TEAM_A_WORDS
		},
		{
			type : "B",
			clr : "blue",
			numNeeded : TEAM_B_WORDS
		},
		{
			type : "Neutral",
			clr : "gray",
			numNeeded : NEUTRAL_WORDS
		},
		{
			type : "Snitch",
			clr : "black",
			numNeeded : SNITCH_WORDS
		}
	];
	for (var i = 0; i < elementTypes.length; i++) {
		for (var j = 0; j < elementTypes[i].numNeeded; j++) {
			var chosenPos = null;
			var done = false;
			while (!done) {
				done = true;
				chosenPos = Math.floor(Math.random() * numOfKeysNeeded);
				for (var k = 0; k < usedPos.length; k++) {
					if (chosenPos == usedPos[k]) {
						done = false;
					}
				}
			}
			usedPos.push(chosenPos);
			var chosenWord = null;
			done = false;
			while (!done) {
				done = true;
				chosenWord = words[Math.floor(Math.random() * words.length)];
				for (var l = 0; l < usedWords.length; l++) {
					if (chosenWord == usedWords[l]) {
						done = false;
					}
				}
			}
			usedWords.push(chosenWord);
			var newX = (chosenPos % GRID_HEIGHT);
			var newY = Math.floor(chosenPos / GRID_HEIGHT);
			var newElement = makeElement(newX, newY, chosenWord, elementTypes[i].type, elementTypes[i].clr);
			initGrid[newY][newX] = newElement;
		}
	}
	vm.grid(initGrid);
}

function clicky(element) {
	element.guessed(true);
	console.log(element);
}

function gridSwitch() {
	var newWords = !vm.words();
	var newKey = !vm.key();
	vm.words(newWords);
	vm.key(newKey);
}