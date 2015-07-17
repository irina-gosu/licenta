var Z = -100;
var U = -99;

var ON = 1;
var OFF = 0;

var GND = 0;
var randomValue = -225;
var vcc_value = 1;


function Neighbor (componentId, neighborPin) {
	this.componentId = componentId;
	this.neighborPin = neighborPin;
}

function Pin (pin_capacities, currentMode, number) {
	this.currentMode = currentMode;
	this.number = number;
	this.pos = -1;
	this.value = randomValue;
	this.connected = 0;
	this.pin_capacities = pin_capacities;
	this.neighbors = [];
	this.canModify = 1;
	return this;
}

Pin.prototype.setPin = function(value) {
	this.value = value;
};


var leds = [940, 880, 850, 			// infrared
			660, 635, 633,			// red
			620, 612, 605,			// orange
			595, 592, 585, 574,		// yellow
			570, 565, 560, 555,		// green
			525, 505, 470, 430, 	// blue
			4500, 6500, 8000 ];		// white

var colours_off = [	"#666666", "#999999", "#c0c0c0",
					"#ff114d", "#ff0000", "#e60000",
					"#ff5b0d", "#ff9a35", "#ff9a35",
					"#fadf47", "#fbe446", "#ffea00", "#deffa2",
					"#17ff8b", "#00d76b", "#00cc80", "#00b33b",
					"#00d9d3", "#07d2fe", "#3851fe", "#0000ee",
					"#cccccc", "#ffffff", "#ffecfe" ];

var colours_on = [	"#ffecfe", "#ffecfe", "#ffecfe",
					"#ffa9bf", "#ffa9bf", "#ffa9bf",
					"#ffbf9e", "#ffbf9e", "#ffbf9e",
					"#ffffad", "#ffffad", "#ffffad", "#ffffad",
					"#5dffae", "#5dffae", "#5dffae", "#5dffae",
					"#80ece9", "#80ece9", "#8897fe", "#8897fe",
					"#ccffff", "#ccffff", "#ccffff" ];

function Led () {
	this.name = "Led";
	this.label = "";
	this.state = 0;
	this.componentId = -1;
	this.type = 0;
	this.input = new Pin (["input"], "input", 1);
	this.gnd = new Pin (["OUT0"], "OUT0", 0);
	this.pins = [];
	this.pins.push(this.input);
	this.pins.push(this.gnd);
	this.state = this.getState();
	this.index = -1;
}

Led.prototype.getState = function() {
	if (this.input.value === 1 & this.gnd.value === 0)
		return this.state = ON;
	else return this.state = OFF;
};

function Resistor () {
	this.name = "Resistor";
	this.label = "";
	this.componentId = -1;
	this.pin0 = new Pin (["input", "output", "OUT0"], "input", 0);
	this.pin1 = new Pin (["input", "output", "OUT0"], "output", 1);
	this.pins = [];
	this.pins.push(this.pin0);
	this.pins.push(this.pin1);
}

Resistor.prototype.update_values = function() {
	var modif = 0;
	if (this.pin0.currentMode === "input" && this.pin1.currentMode === "output") {
		// console.log("[pin0=output] TRECEM REZISTENTA IN currentMode = OUTPUT");
		if (this.pin0.value != this.pin0.value) {
			this.pin0.setPin(this.pin0.value);
		}
	}
	if (this.pin0.currentMode === "output" && this.pin1.currentMode === "input") {
		// console.log("[pin0=input] TRECEM REZISTENTA IN currentMode = OUTPUT");
		if (this.pin1.value != this.pin0.value) {
			this.pin0.setPin(this.pin1.value);
		}
	}

	if (this.pin0.currentMode === "OUT0") {
		this.pin1.currentMode = "output";
		// console.log("[pin0=OUT0] TRECEM REZISTENTA IN currentMode = OUTPUT");
		if (this.pin1.value != this.pin0.value) {
			this.pin1.setPin(this.pin0.value);
			modif = 1;
		}
		// if (this.pin1.value === Z) {
		// 	this.pin1.value = this.pin0.value;
		// 	modif = 1;
		// }
	}

	if (this.pin1.currentMode === "OUT0") {
		// console.log("[pin1=OUT0!!!] TRECEM REZISTENTA IN currentMode = OUTPUT");
		this.pin0.currentMode = "output";
		if (this.pin1.value != this.pin0.value) {
			this.pin0.setPin(this.pin1.value);
			modif = 1;
		}
		// if (this.pin0.value === Z) {
		// 	this.pin0.value = this.pin1.value;
		// 	modif = 1;
		// }
	}

	return modif;
};

function Button () {
	this.name = "Button";
	this.label = "";
	this.pin0 = new Pin (["input", "output"], "output", 0);
	this.pin1 = new Pin (["OUT1"], "OUT1", 1);
	this.pins = [];
	this.pins.push(this.pin0);
	this.pins.push(this.pin1);
	this.pins[0].setPin(Z);
	this.componentId = -1;
}
Button.prototype.pushed = function() {
	var modif = 0;
	if (this.pin0.neighbors != null) { //apasat
		this.pin0.value = this.pin1.value;
		modif = 1;
		for (var i = 0; i < this.pin0.neighbors.length; i++) {
			this.pin0.neighbors[i].neighborPin.setPin(this.pin0.value);
			this.pin0.neighbors[i].neighborPin.canModify = 0;
		}
	}
	return modif;
};
Button.prototype.released = function() {
	var modif = 0;
	if (this.pin0.neighbors != null) { //apasat
		this.pin0.setPin(Z);
		modif = 1;
		for (var i = 0; i < this.pin0.neighbors.length; i++) {
			this.pin0.neighbors[i].neighborPin.setPin(0);
			this.pin0.neighbors[i].neighborPin.canModify = 1;
		}
	}
	return modif;
};
