var GND = 0;
var value = -25;
var vcc_value = 1;

function raspberryPiBoard () {
	this.name = "raspberryPiBoard";
	this.picture = "";
	this.pins = [];
	this.numberOfPins = 30;

	this.pins[0] = new Pin (["VCC3"], "VCC3", -1, vcc_value);
	this.pins[1] = new Pin (["VCC5"], "VCC5", -1, vcc_value);
	this.pins[2] = new Pin (["GPIO_IN", "GPIO_OUT", "I2C_SDA"], "GPIO_IN", 8, value);
	this.pins[3] = new Pin (["VCC5"], "VCC5", -1, vcc_value);
	this.pins[4] = new Pin (["GPIO_IN", "GPIO_OUT", "I2C_SCL"], "GPIO_IN", 9, value);
	this.pins[5] = new Pin (["GND"], "GND", -1, GND);
	this.pins[6] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 7, value);
	this.pins[7] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 15, value);
	this.pins[8] = new Pin (["GND"], "GND", -1, GND);
	this.pins[9] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 16, value);

	this.pins[10] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 0, value);
	this.pins[11] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK", "PWM"], "GPIO_IN", 1, value);
	this.pins[12] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 2, value);
	this.pins[13] = new Pin (["GND"], "GND", -1, GND);
	this.pins[14] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 3, value);
	this.pins[15] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 4, value);
	this.pins[16] = new Pin (["VCC3"], "VCC3", -1, vcc_value);
	this.pins[17] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 5, value);
	this.pins[18] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_MOSI"], "GPIO_IN", 12, value);
	this.pins[19] = new Pin (["GND"], "GND", -1, GND);

	this.pins[20] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_MISO"], "GPIO_IN", 13, value);
	this.pins[21] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 6, value);
	this.pins[22] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 14, value);
	this.pins[23] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_SS"], "GPIO_IN", 10, value); //random "spi_ss"
	this.pins[24] = new Pin (["GND"], "GND", -1, GND);
	this.pins[25] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_SS"], "GPIO_IN", 11, value); //random "spi_ss"

	//26 vs 40 pini pt raspberryPi
	this.pins[26] = new Pin (["I2C_SDA"], "I2C_SDA", -1, value);
	this.pins[27] = new Pin (["I2C_SCL"], "I2C_SCL", -1, value);
	this.pins[28] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 21, value);
	this.pins[29] = new Pin (["GND"], "GND", -1, GND);

	this.pins[30] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 22, value);
	this.pins[31] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 26, value);
	this.pins[32] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 23, value);
	this.pins[33] = new Pin (["GND"], "GND", -1, GND);
	this.pins[34] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 24, value);
	this.pins[35] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 27, value);
	this.pins[36] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 25, value);
	this.pins[37] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 28, value);
	this.pins[38] = new Pin (["GND"], "GND", -1, GND);
	this.pins[39] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 29, value);


	this.piBoard = new Board(this.name, this.picture, this.pins_description, this.pins, this.numberOfPins);
	return this.piBoard;
}