$(document).ready(function() {
	$.getJSON("conall-cn.json", function(res) {
		makeGrid(res);
		ko.applyBindings(vm);
	});
});

var GRID_WIDTH = 5;
var GRID_HEIGHT = 5;
var TEAM_RED_WORDS = 9;
var TEAM_BLUE_WORDS = 8;
var NEUTRAL_WORDS = 7;
var X_WORDS = 1;

var vm = {
	
	grid : ko.observableArray(),
	ptsRed : ko.observable(0),
	ptsBlue : ko.observable(0),
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
			type : "Red",
			clr : "LightCoral",
			numNeeded : TEAM_RED_WORDS
		},
		{
			type : "Blue",
			clr : "LightSkyBlue",
			numNeeded : TEAM_BLUE_WORDS
		},
		{
			type : "Neutral",
			clr : "LightSteelBlue",
			numNeeded : NEUTRAL_WORDS
		},
		{
			type : "x",
			clr : "Black",
			numNeeded : X_WORDS
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
	if (!element.guessed()) {
		element.guessed(true);
		if (element.team == "Red") {
			var newPtsRed = vm.ptsRed() + 1;
			vm.ptsRed(newPtsRed);
			if (newPtsRed == TEAM_RED_WORDS) {
				setTimeout(function() {
					alert("Congratulations Red Team, you win this round! Refresh the page to play again!");
				}, 10);
			}
		} else if (element.team == "Blue") {
			var newPtsBlue = vm.ptsBlue() + 1;
			vm.ptsBlue(newPtsBlue);
			if (newPtsBlue == TEAM_BLUE_WORDS) {
				setTimeout(function() {
					alert("Congratulations Blue Team, you win this round! Refresh the page to play again!");
				}, 10);
			}
		} else if (element.team == "x") {
			setTimeout(function() {
				alert("Uh oh, game over, whichever team just guessed loses! Refresh the page to play again!");
			}, 10);
		}
	}
}

function gridSwitch() {
	if (!vm.words() || confirm("**WARNING!** only the spymasters should ever use the Key View, do you want to continue?")) {
		var newWords = !vm.words();
		var newKey = !vm.key();
		vm.words(newWords);
		vm.key(newKey);
	}
}