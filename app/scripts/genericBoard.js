
var maxPWM = 255;
var maxAIO = 1023;
var vcc_value3 = 3.3; //3.3
var vcc_value5 = 5; //3.3
var gnd_value = 0;

var INPUT = 0;
var OUTPUT = 1;


function returnPin (currentMode, value, number) {
	this.mode = currentMode;
	this.value = value;
	this.number = number;
	return this;
}

function Board (name, pins) {
	this.name = name;
	this.label = "";
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

Board.prototype.digitalRead = function(pin_nr) {
	this.pinMode(pin_nr, INPUT);
	return this.searchPin(pin_nr).value;
};

Board.prototype.digitalWrite = function(pin_nr, val) {
	this.pinMode(pin_nr, OUTPUT);
	this.searchPin(pin_nr).value = val;
	simulate();
};

Board.prototype.pinMode = function(pin_nr, mode) {
	var thisPin = this.searchPin(pin_nr);
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



function connectPins (component1, pin1, component2, pin2) {
	// consideram componenta1/pin1 = output; componenta2/pin2 input
	// pin1 si pin2 sunt obiecte Pin, nu numere de pini
// console.log("component1 " + pin1.currentMode+ " "+component1.name + " ||| component2 " + pin2.currentMode + " "+component2.name);
// console.log(component1);
// console.log(component2);

	switch(pin1.currentMode.toLowerCase()) {
	case "OUT1".toLowerCase():
		if (pin2.currentMode.toLowerCase() === "OUT1".toLowerCase()) {
			pin2.neighbors.push(new Neighbor (component1.componentId, pin1));

		} else {
			console.log("This is wrong. This will break. We are not doing this. ");
			return;
		}

	break;
	case "OUT0".toLowerCase():
		if (pin2.currentMode.toLowerCase() === "OUT0".toLowerCase()) {
			pin2.neighbors.push(new Neighbor (component1.componentId, pin1));

		} else {
			//aici trec rezistenta in OUT0
			if (pin2.pin_capacities.indexOf("OUT0") != -1) {
				pin2.currentMode = "OUT0";
				pin2.neighbors.push(new Neighbor (component1.componentId, pin1));
				component2.update_values();
			} else {
				console.log("This is wrong. This will break. We are not doing this. ");
				return;
			}
		}
	break;
	case "GPIO_IN".toLowerCase():
		// pinMode will return error if the operation is not permitted
		component1.pinMode(pin1.number, OUTPUT);
	break;
	case "INPUT".toLowerCase(): //led sau buton sau rezistenta (piese simple)
		if (component1.name === "Resistor") {
			var number = (pin1.number) ? 0 : 1;
			component1.pins[pin1.number].currentMode = "output";
			component1.pins[number].currentMode = "input";
		} else {
			console.log("This is wrong. This will break. We are not doing this. ");
			return;
		}
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
			if (component2.name === "Resistor") {
				var number = (pin2.number) ? 0 : 1;
				component2.pins[pin2.number].currentMode = "input";
				component2.pins[number].currentMode = "output";
			} else {
				console.log("This is wrong. This will break. We are not doing this. ");
				return;
			}

		break;
		default: // input, GPIO_IN
		}
	}
	pin1.connected = 1;
	pin2.connected = 1;
	pin1.neighbors.push(new Neighbor (component2.componentId, pin2));

}

function disconnectPins (component1, pin1, component2, pin2) {
	for (var i = 0; i < pin1.neighbors.length; i++) {
		if (pin1.neighbors[i].neighborPin === pin2) {
			//scot pinul 2 din lista de vecini a pinului 1
			pin1.neighbors.splice(i, 1);
			if (pin1.currentMode.toLowerCase() === "OUT0".toLowerCase()) {
				for (var j = 0; j < pin2.neighbors.length; j++) {
					if (pin2.neighbors[j].neighborPin === pin1) {
						pin2.neighbors.splice(j, 1);
						pin1.connected = 0;
						pin2.connected = 0;
					}
				}
			}
		}
	}
}
