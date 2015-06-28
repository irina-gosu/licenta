var Z = -100;
var U = -99;

var ON = 1;
var OFF = 0;

var GND = 0;
var randomValue = -25;
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
	this.pin0 = new Pin (["input", "output"], "input", 0);
	this.pin1 = new Pin (["input", "output"], "output", 1);
	this.pins = [];
	this.pins.push(this.pin0);
	this.pins.push(this.pin1);
}

Resistor.prototype.update_values = function() {
	var modif = 0;
	if (this.pin0.currentMode === "input" && this.pin1.currentMode === "output") {
		if (this.pin0.value != this.pin0.value) {
			this.pin0.setPin(this.pin0.value);
		}
	}
	if (this.pin0.currentMode === "output" && this.pin1.currentMode === "input") {
		if (this.pin1.value != this.pin0.value) {
			this.pin0.setPin(this.pin1.value);
		}
	}
	return modif;
};

function Button () {
	this.name = "Button";
	this.label = "";
	this.input = new Pin (["input"], "input", 0);
	this.output = new Pin (["output"], "output", 1);
	this.state = OFF;
	this.pins = [];
	this.pins.push(this.input);
	this.pins.push(this.output);
	this.componentId = -1;
}
Button.prototype.pushed = function(state) {
	if (state === 1 & this.output.neighbors != null) { //apasat
		this.output.value = this.input.value;
		this.output.neighbors.push(new Neighbor (this.componentId, this.input));
	}
	// return this.output; // reuturnez ceva sau nu ?
};

