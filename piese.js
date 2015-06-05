var Z = -100;
var U = -99;

var ON = 1;
var OFF = 0;

function Led (input, gnd) {
	this.input = input;
	this.gnd = gnd;
	this.state = this.getState();
	this.componentId = -1;
}

Led.prototype.getState = function() {
	if (this.input === 1 & this.gnd === 0)
		return this.state = ON;
	else return this.state = OFF;
};

function Button (input, output) {
	this.input = input;
	this.output = output;
	this.state = OFF;
	this.componentId = -1;
}
Button.prototype.pushed = function(state) {
	if (state === 1) //apasat
		this.output = this.input;
	return this.output; // reuturnez ceva sau nu ?
};

var led = new Led (0, 0);
// console.log("led " + led.state);

// var buton = new Button (5, 6);
// console.log("buton " + buton.pushed(1));
