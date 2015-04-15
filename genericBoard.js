var maxPWM = 255;
var maxAIO = 1023;
var vcc_value3 = 3.3; //3.3
var vcc_value5 = 5; //3.3
var gnd_value = 0;
//in loc de variabilele astea fac functii ceva
var GPIO_IN = -10;
var GPIO_OUT = -11;
var I2C_SDA = -12;
var I2C_SCL = -13;
var AIO_IN = -14;
var AIO_OUT = -15;
var SPI_SS = -16;
var SPI_MISO = -17;
var SPI_MOSI = -18;
var SPI_CLK = -19;


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

function raspberryPiBoard () {
	this.name = "raspberryPiBoard";
	this.picture = "";

	// this.pins_description = [
	// 		VCC3, VCC5, GPIO2, VCC5, GPIO3,
	// 		GND, GPIO4, GPIO14, GND, GPIO15,
	// 		GPIO17, GPIO18, GPIO27, GND, GPIO22,
	// 		GPIO23, VCC3, GPIO24, GPIO10, GND,
	// 		GPIO9, GPIO25, GPIO11, GPIO8, GND, GPIO7
	// ];
	this.pins = [];

	this.pins[1] = new Pin ([VCC3], VCC3, -1);
	this.pins[2] = new Pin ([VCC5], VCC5, -1);
	this.pins[3] = new Pin ([GPIO_IN, GPIO_OUT, I2C_SDA], GPIO_IN, 8);
	this.pins[4] = new Pin ([VCC5], VCC5, -1);
	this.pins[5] = new Pin ([GPIO_IN, GPIO_OUT, I2C_SCL], GPIO_IN, 9);
	this.pins[6] = new Pin ([GND], GND, -1);
	this.pins[7] = new Pin ([GPIO_IN, GPIO_OUT, SPI_CLK], GPIO_IN, 7);
	this.pins[8] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 15);
	this.pins[9] = new Pin ([GND], GND, -1);
	this.pins[10] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 16);

	this.pins[11] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 0);
	this.pins[12] = new Pin ([GPIO_IN, GPIO_OUT, SPI_CLK, PWM], GPIO_IN, 1);
	this.pins[13] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 2);
	this.pins[14] = new Pin ([GND], GND, -1);
	this.pins[15] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 3);
	this.pins[16] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 4);
	this.pins[17] = new Pin ([VCC3], VCC3, -1);
	this.pins[18] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 5);
	this.pins[19] = new Pin ([GPIO_IN, GPIO_OUT, SPI_MOSI], GPIO_IN, 12);
	this.pins[20] = new Pin ([GND], GND, -1);

	this.pins[21] = new Pin ([GPIO_IN, GPIO_OUT, SPI_MISO], GPIO_IN, 13);
	this.pins[22] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 6);
	this.pins[23] = new Pin ([GPIO_IN, GPIO_OUT, SPI_CLK], GPIO_IN, 14);
	this.pins[24] = new Pin ([GPIO_IN, GPIO_OUT, SPI_SS], GPIO_IN, 10); //random spi_ss
	this.pins[25] = new Pin ([GND], GND, -1);
	this.pins[26] = new Pin ([GPIO_IN, GPIO_OUT, SPI_SS], GPIO_IN, 11); //random spi_ss

	//26 vs 40 pini pt raspberryPi
	this.pins[27] = new Pin ([I2C_SDA], I2C_SDA, -1);
	this.pins[28] = new Pin ([I2C_SCL], I2C_SCL, -1);
	this.pins[29] = new Pin ([GPIO_IN, GPIO_OUT, SPI_CLK], GPIO_IN, 21);
	this.pins[30] = new Pin ([GND], GND, 13);

	this.pins[31] = new Pin ([GPIO_IN, GPIO_OUT, SPI_CLK], GPIO_IN, 22);
	this.pins[32] = new Pin ([GPIO_IN, GPIO_OUT, PWM], GPIO_IN, 26);
	this.pins[33] = new Pin ([GPIO_IN, GPIO_OUT, PWM], GPIO_IN, 23);
	this.pins[34] = new Pin ([GND], GND, -1);
	this.pins[35] = new Pin ([GPIO_IN, GPIO_OUT, PWM], GPIO_IN, 24);
	this.pins[36] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 27);
	this.pins[37] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 25);
	this.pins[38] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 28);
	this.pins[39] = new Pin ([GND], GND, -1);
	this.pins[40] = new Pin ([GPIO_IN, GPIO_OUT], GPIO_IN, 29);


	this.piBoard = new Board(this.name, this.picture, this.pins_description, this.pins);
	return this.piBoard;
}

var pi = raspberryPiBoard();
console.log(pi);
