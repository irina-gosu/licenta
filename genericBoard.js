
var maxPWM = 255;
var maxAIO = 1023;
var vcc_value3 = 3.3; //3.3
var vcc_value5 = 5; //3.3
var gnd_value = 0;

// check .h wyliodrin
var INPUT = 0;
var OUTPUT = 1;


// function GPIO (value, mode) {
// 	this.mode = mode;
// 	this.value = value;
//     return this;
// }
// GPIO.prototype.getMode = function() {
// 	return this.mode;
// };
// GPIO.prototype.setMode = function(mode) {
// 	this.mode = mode;
// };

// function PWM (value) {
// 	if (value > maxPWM)
// 		value = maxPWM;
// 	if (value < 0)
// 		value = 0;
// 	this.value = value;
// }

// function AIO (value, mode) {
// 	this.value = value;
// 	this.mode = mode;
// }

// function VCC3 () {
// 	this.value = vcc_value3;
// }

// function VCC5 () {
// 	this.value = vcc_value5;
// }

// function GND (gnd_value) {
// 	this.value = value;
// }


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
	this.changePinMode = 1;
	this.componentId = -1;
	this.pins = pins;
	this.assignPinPos();
	return this;
}

Board.prototype.assignPinPos = function() {
	for (var i = 0; i < this.pins.length; i++) {
		this.pins[i].pos = i;
	}
};

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
		console.log("This is wrong. This will break. We are not doing this. " + pin);
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


function connectPins (component1, pin1, component2, pin2) {
	// consideram componenta1/pin1 = output; componenta2/pin2 input
	// pin1 si pin2 sunt obiecte Pin, nu numere de pini

	switch(pin1.currentMode.toLowerCase()) {
	case "OUT0".toLowerCase():
		if (pin2.currentMode.toLowerCase() === "OUT0".toLowerCase()) {
			pin2.neighbors.push(new Neighbor (component1.componentId, pin1));

		} else {
			console.log("This is wrong. This will break. We are not doing this. ");
			return;
		}
	break;
	case "GPIO_IN".toLowerCase():
		// pinMode will return error if the operation is not permitted
		component1.pinMode(pin1.number, OUTPUT);
	break;
	case "INPUT".toLowerCase(): //led sau buton (piese simple)
		console.log("This is wrong. This will break. We are not doing this. ");
		return;
	break;
	default: //"output" sau "GPIO_OUT"
		switch(pin2.currentMode.toLowerCase()) {
		case "OUT0".toLowerCase():
			console.log("This is wrong. This will break. We are not doing this. ");
			return;
		break;
		case "GPIO_OUT".toLowerCase():
			component2.pinMode(pin2.number, INPUT);
		break;
		case "OUTPUT".toLowerCase():
			console.log("This is wrong. This will break. We are not doing this. ");
			return;
		break;
		default:
		}
	}
	pin1.neighbors.push(new Neighbor (component2.componentId, pin2));
	pin2.value = pin1.value;
}



var components = [];

pi.componentId = components.length;
components.push(pi);
led.componentId = components.length;
components.push(led);


//daca mut asta mai jos iau : Uncaught TypeError: Converting circular structure to JSON
var components_json = JSON.stringify(components, null, 4);
var div = document.getElementById('content');
div.innerHTML = components_json;

// // am conectat un led pe pinul 5 (GND) si pinul 17 (GPIO_5)
components[0].setPin(components[0].pins[17].number, 1);
connectPins(components[0], components[0].pins[17], components[1], components[1].input);

connectPins(components[0], components[0].pins[5], components[1], components[1].gnd);

console.log(components[0].pins[17]);
console.log(components[1].state = components[1].getState());


// var components_json = JSON.stringify(components);
// var components_json = JSON.stringify(components, null, 4);

// var div = document.getElementById('content');
// div.innerHTML = components_json;