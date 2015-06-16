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
	// pin_capacities_options = [GPIO_IN, GPIO_OUT, PWM, AIO_IN, AIO_OUT,
	// I2C_SCL, I2C_SDA, SPI_MISO, SPI_MOSI, SPI_CLK, SPI_SS];
	this.currentMode = currentMode;
	this.number = number; //GPIOx, number = x
	this.pos = -1;
	this.value = randomValue;	//digitalRead/digitalWrite
	this.connected = 0;
	this.pin_capacities = pin_capacities;
	this.neighbors = [];
	return this;
}
Pin.prototype.setValueFromOutside = function(value) {
	// this. should do what ?!
};

Pin.prototype.setPin = function(value) {
	this.value = value;
};

// function Led (input, gnd) {
function Led () {
	this.name = "Led";
	this.label = "";
	this.state = 0;
	this.componentId = -1;
	this.input = new Pin (["input"], "input", 1);
	this.gnd = new Pin (["OUT0"], "OUT0", 0);
	this.pins = [];
	this.pins.push(this.input);
	this.pins.push(this.gnd);
	this.state = this.getState();
}

Led.prototype.getState = function() {
	if (this.input.value === 1 & this.gnd.value === 0)
		return this.state = ON;
	else return this.state = OFF;
};


function Button (input, output) {
	this.name = "Button";
	this.label = "";
	this.input = new Pin (["input"], "input", 1);
	this.output = new Pin (["output"], "output", 0);
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

// var led = new Led (0, 0);
// var led = new Led ();
// console.log("led " + led.state);

// var buton = new Button (5, 6);
// console.log("buton " + buton.pushed(1));
