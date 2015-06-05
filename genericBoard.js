
var maxPWM = 255;
var maxAIO = 1023;
var vcc_value3 = 3.3; //3.3
var vcc_value5 = 5; //3.3
var gnd_value = 0;

// check .h wyliodrin
var INPUT = 0;
var OUTPUT = 1;


function GPIO (value, mode) {
	this.mode = mode;
	this.value = value;
    return this;
}
GPIO.prototype.getMode = function() {
	return this.mode;
};
GPIO.prototype.setMode = function(mode) {
	this.mode = mode;
};

function PWM (value) {
	if (value > maxPWM)
		value = maxPWM;
	if (value < 0)
		value = 0;
	this.value = value;
}

function AIO (value, mode) {
	this.value = value;
	this.mode = mode;
}

function VCC3 () {
	this.value = vcc_value3;
}

function VCC5 () {
	this.value = vcc_value5;
}

function GND (gnd_value) {
	this.value = value;
}

function Pin (pin_capacities, currentMode, number, value) {
	// pin_capacities_options = [GPIO_IN, GPIO_OUT, PWM, AIO_IN, AIO_OUT,
	// I2C_SCL, I2C_SDA, SPI_MISO, SPI_MOSI, SPI_CLK, SPI_SS];
	this.currentMode = currentMode;
	this.number = number;
	this.value = value;
	this.pin_capacities = pin_capacities;
	this.neighbors = [];
	return this;
}
Pin.prototype.setValueFromOutside = function(value) {
	// this. should do what ?!
};

function returnPin (currentMode, value, number) {
	this.mode = currentMode;
	this.value = value;
	this.number = number;
	return this;
}

function Board (name, picture, pins_description, pins, numberOfPins) {
	this.name = name;
	this.picture = picture;
	// this.pins_description = pins_description;
	this.numberOfPins = numberOfPins;
	this.componentId = -1;
	this.pins = pins;
	return this;
}

Board.prototype.searchPin = function(number) {
	for (var i = 0; i < this.pins.length; i++) {
		if (this.pins[i].number === number)
			return this.pins[i];
	}
};

Board.prototype.digitalRead = function(pin) {
	this.pinMode(pin, INPUT);
	return this.searchPin(pin).value;
};

Board.prototype.digitalWrite = function(pin, val) {
	this.pinMode(pin, OUTPUT);
	this.searchPin(pin).value = val;
};

Board.prototype.pinMode = function(pin, mode) {
	var thisPin = this.searchPin(pin);
	var modePin = typeof mode;

	if (thisPin.pin_capacities.indexOf("GPIO_IN") != -1 ||
			thisPin.pin_capacities.indexOf("GPIO_OUT") != -1) {

		if (modePin === "string") {
			if (mode.toLowerCase() === "INPUT".toLowerCase()) {
				thisPin.currentMode = "GPIO_IN";
			}
			if (mode.toLowerCase() === "OUTPUT".toLowerCase()) {
				thisPin.currentMode = "GPIO_OUT";
			}
		} else {
			if (mode === INPUT) {
				thisPin.currentMode = "GPIO_IN";
			}
			if (mode === OUTPUT) {
				thisPin.currentMode = "GPIO_OUT";
			}
		}
	} else {
		console.log("This is wrong. This will break. We are not doing this.");
		return;
	}
	return thisPin.currentMode;
};


Board.prototype.getPin = function(pin) {
	var thatPin = this.searchPin(pin);
	if (thatPin != null) {
		var thisPin = new returnPin(thatPin.currentMode, thatPin.value, thatPin.number);
		return thisPin;
	} else {
		console.log("Found null");
		return;
	}
};

Board.prototype.setPin = function(pin, value) {
	var thisPin = this.searchPin(pin);
	// verificari daca se poate face setPin. cand nu se poate?
	thisPin.value = value;
};

Board.prototype.dump = function() {
	var pin_array = [];
	for (var i = 0; i < this.numberOfPins; i++) {
		if (this.getPin(i) != null) {
			pin_array.push(this.getPin(i));
		} else {
			console.log("There is no pin " + i);
		}
	}
	return pin_array;
};

var pi = raspberryPiBoard();
console.log(pi);

// pi.digitalWrite(15, 666);
// console.log(pi.searchPin(15));

// console.log(pi.digitalRead(15));

// console.log(pi.pinMode(15, "output"));
// console.log(pi.pinMode(15, 1));

// console.log(pi.dump());


var components = [];

pi.componentId = components.length;
components.push(pi);
led.componentId = components.length;
components.push(led);

var components_json = JSON.stringify(components);

console.log(components_json);

var div = document.getElementById('content');
div.innerHTML = components_json;


