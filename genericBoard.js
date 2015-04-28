
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

function AIO (value) {
	this.value = value;
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
	for (var i = 0; i < this.pins.length; i++) {
		if (this.pins[i].number === number)
			return this.pins[i];
	}
};

Board.prototype.digitalRead = function(pin) {

	for (var i = 0; i < this.pins.length; i++) {
		if (this.pins[i].number === pin.number) {
			if (this.pins[i].pin_capacities.indexOf("GPIO_IN") === -1) {
				console.log("This is wrong. This will break. We are not doing this.");
				return;
			}
		}
	}
	this.pins[pin].currentMode = GPIO_IN;
	return this.pins[pin].value;
};

Board.prototype.digitalWrite = function(pin, val) {
	for (var i = 0; i < this.pins.length; i++) {
		if (this.pins[i].number === pin.number) {
			if (this.pins[i].pin_capacities.indexOf("GPIO_OUT") === -1) {
				console.log("This is wrong. This will break. We are not doing this.");
				return;
			}
		}
	}
	this.pins[pin].currentMode = GPIO_OUT;
	this.pins[pin].value = val;
};

Board.prototype.pinMode = function(pin, mode) {
	if (this.pins_description[pin] === "GPIO") {
		var value = this.pins[pin].value;
		this.pins[pin] = GPIO (value, mode);
		this.pins[pin].setMode(mode);
	}
};

var pi = raspberryPiBoard();
console.log(pi);
