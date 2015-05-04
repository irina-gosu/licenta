
var maxPWM = 255;
var maxAIO = 1023;
var vcc_value3 = 3.3; //3.3
var vcc_value5 = 5; //3.3
var gnd_value = 0;

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

function Pin (pin_capacities, currentMode, number) {
	// pin_capacities_options = [GPIO_IN, GPIO_OUT, PWM, AIO_IN, AIO_OUT, I2C_SCL, I2C_SDA, SPI_MISO, SPI_MOSI, SPI_CLK, SPI_SS];
	this.pin_capacities = pin_capacities;
	this.currentMode = currentMode;
	this.number = number;
	this.value = null;
	return this;
}
Pin.prototype.setValueFromOutside = function(value) {
	// this. should do what ?!
};

function Board (name, picture, pins_description, pins) {
	this.name = name;
	this.picture = picture;
	// this.pins_description = pins_description;
	this.pins = pins;
	return this;
}

Board.prototype.searchPin = function(number) {
	for (var i = 1; i < this.pins.length; i++) {
		if (this.pins[i].number === number)
			return this.pins[i];
	}
};

Board.prototype.digitalRead = function(pin) {

	if (this.searchPin(pin).pin_capacities.indexOf("GPIO_IN") === -1) {
		console.log("This is wrong. This will break. We are not doing this.");
		return;
	}
	this.searchPin(pin).currentMode = "GPIO_IN";
	return this.searchPin(pin).value;
};

Board.prototype.digitalWrite = function(pin, val) {
	if (this.searchPin(pin).pin_capacities.indexOf("GPIO_OUT") === -1) {
		console.log("This is wrong. This will break. We are not doing this.");
		return;
	}
	this.searchPin(pin).currentMode = "GPIO_OUT";
	this.searchPin(pin).value = val;
};

Board.prototype.pinMode = function(pin, mode) {
	var thisPin = this.searchPin(pin);
	if (thisPin.pin_capacities.indexOf("GPIO_IN") === -1 ||
		thisPin.pin_capacities.indexOf("GPIO_OUT") === -1) {
		var value = thisPin.value;
		thisPin.currentMode = mode;
		if (mode === "input")
			thisPin.currentMode = "GPIO_IN";
		if (mode === "output")
			thisPin.currentMode = "GPIO_OUT";
	}
	// 	thisPin = GPIO (value, mode);
	// 	thisPin.setMode(mode); //todo

};

var pi = raspberryPiBoard();
console.log(pi);
console.log();
// console.log(pi.searchPin(15));

pi.digitalWrite(15, 666);
console.log(pi.searchPin(15));
