var Z = -100;
var U = -99;

var ON = 1;
var OFF = 0;

var GND = 0;
var value = -25;
var vcc_value = 1;


function Neighbor (componentId, neighborPin) {
	this.componentId = componentId;
	this.neighborPin = neighborPin;
}

function Pin (pin_capacities, currentMode, number, value) {
	// pin_capacities_options = [GPIO_IN, GPIO_OUT, PWM, AIO_IN, AIO_OUT,
	// I2C_SCL, I2C_SDA, SPI_MISO, SPI_MOSI, SPI_CLK, SPI_SS];
	this.currentMode = currentMode;
	this.number = number;
	this.pos = -1;
	this.value = value;
	this.pin_capacities = pin_capacities;
	this.neighbors = [];
	return this;
}
Pin.prototype.setValueFromOutside = function(value) {
	// this. should do what ?!
};

function Led (input, gnd) {
	this.name = "Led";
	this.changePinMode = 0;
	this.input = new Pin (["input"], "input", 1, Z);
	this.gnd = new Pin (["OUT0"], "OUT0", 0, Z);
	this.state = this.getState();
	this.componentId = -1;
}

Led.prototype.getState = function() {
	if (this.input.value === 1 & this.gnd.value === 0)
		return this.state = ON;
	else return this.state = OFF;
};


function Button (input, output) {
	this.name = "Button";
	this.changePinMode = 0;
	this.input = new Pin (["input"], "input", 1, Z);
	this.output = new Pin (["output"], "output", 0, Z);
	this.state = OFF;
	this.componentId = -1;
}
Button.prototype.pushed = function(state) {
	if (state === 1 & this.output.neighbors != null) { //apasat
		this.output.value = this.input.value;
		this.output.neighbors.push(new Neighbor (this.componentId, this.input));
	}
	// return this.output; // reuturnez ceva sau nu ?
};

var led = new Led (0, 0);
// console.log("led " + led.state);

// var buton = new Button (5, 6);
// console.log("buton " + buton.pushed(1));
