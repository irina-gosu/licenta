var GND = 0;
var value = -25;
var vcc_value = 1;

function raspberryPiBoard () {
	this.name = "raspberryPiBoard";
	this.pins = [];

	this.pins[0] = new Pin (["OUT1"], "OUT1", -1);
	this.pins[1] = new Pin (["OUT1"], "OUT1", -1);
	this.pins[2] = new Pin (["GPIO_IN", "GPIO_OUT", "I2C_SDA"], "GPIO_IN", 8);
	this.pins[3] = new Pin (["OUT1"], "OUT1", -1);
	this.pins[4] = new Pin (["GPIO_IN", "GPIO_OUT", "I2C_SCL"], "GPIO_IN", 9);
	this.pins[5] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[6] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 7);
	this.pins[7] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 15);
	this.pins[8] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[9] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 16);

	this.pins[10] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 0);
	this.pins[11] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK", "PWM"], "GPIO_IN", 1);
	this.pins[12] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 2);
	this.pins[13] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[14] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 3);
	this.pins[15] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 4);
	this.pins[16] = new Pin (["OUT1"], "OUT1", -1);
	this.pins[17] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 5);
	this.pins[18] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_MOSI"], "GPIO_IN", 12);
	this.pins[19] = new Pin (["OUT0"], "OUT0", -1);

	this.pins[20] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_MISO"], "GPIO_IN", 13);
	this.pins[21] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 6);
	this.pins[22] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 14);
	this.pins[23] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_SS"], "GPIO_IN", 10); //random "spi_ss"
	this.pins[24] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[25] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_SS"], "GPIO_IN", 11); //random "spi_ss"

	//26 vs 40 pini pt raspberryPi
	this.pins[26] = new Pin (["I2C_SDA"], "I2C_SDA", -1);
	this.pins[27] = new Pin (["I2C_SCL"], "I2C_SCL", -1);
	this.pins[28] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 21);
	this.pins[29] = new Pin (["OUT0"], "OUT0", -1);

	this.pins[30] = new Pin (["GPIO_IN", "GPIO_OUT", "SPI_CLK"], "GPIO_IN", 22);
	this.pins[31] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 26);
	this.pins[32] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 23);
	this.pins[33] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[34] = new Pin (["GPIO_IN", "GPIO_OUT", "PWM"], "GPIO_IN", 24);
	this.pins[35] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 27);
	this.pins[36] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 25);
	this.pins[37] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 28);
	this.pins[38] = new Pin (["OUT0"], "OUT0", -1);
	this.pins[39] = new Pin (["GPIO_IN", "GPIO_OUT"], "GPIO_IN", 29);


	this.piBoard = new Board(this.name, this.pins);
	return this.piBoard;
}