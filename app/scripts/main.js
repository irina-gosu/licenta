var components = [];
var nothing = -1;
var last_led = -1;
var fisier_xml = '';
var fisier_svg = '';
var butonul = -1;
var butonulId = -1;
var editor = ace.edit("code");



function handleGetClick(){
	// $.get('circuit.xml', function(xml){
	$.get(fisier_xml, function(xml){
		var json = $.xml2json(xml);
		parse_netlist(json);
	});
}

function getPinFromComponent(component, pin_name) {

	if (component.name === "raspberryPiBoard") {
		if (pin_name.toLowerCase() === "3V3".toLowerCase()
			|| pin_name.toLowerCase() === "5V".toLowerCase()) {
			for (var i = 0; i < component.pins.length; i++) {
				if (component.pins[i].pin_capacities[0] === "OUT1") {
					return component.pins[i];
				}
			}
		}
		if (pin_name === "GND") {
			for (var i = 0; i < component.pins.length; i++) {
				if (component.pins[i].pin_capacities[0] === "OUT0") {
					return component.pins[i];
				}
			}
		}
		if (_.startsWith(pin_name, "GPIO") || _.startsWith(pin_name, "GIPO")) {
			if (pin_name.length === 5) {
				return component.searchPin(_.parseInt(pin_name[4]));
			}
			if (pin_name.length === 6) {
				return component.searchPin(_.parseInt(pin_name.substr(pin_name.length - 2)));
			}
		}
	}

	if (component.name === "Led") {
		if (pin_name === "cathode") {
			return component.gnd;
		} else {
			if (pin_name === "anode") {
				return component.input;
			} else console.log("Component Led does not have pin "+ pin_name);
		}
	}

	// !!!!!!!! verifica anodul si catodul la buton
	if (component.name === "Button") {
		if (pin_name === "leg1") {
			return component.pin1;
		} else {
			if (pin_name === "leg0") {
				return component.pin0;
			} else console.log("Component Button does not have pin "+ pin_name);
		}
	}
	if (component.name === "Resistor") {
		if (pin_name === "Pin 0") {
			return component.pin0;
		} else {
			if (pin_name === "Pin 1") {
				return component.pin1;
			} else console.log("Component Button does not have pin "+ pin_name);
		}
	}
}

function parse_netlist(json) {

	for (var i = 0; i < json.net.length; i++) {
		var connection = json.net[i].connector;
		if (connection.length > 1) { // am pini de legat intre ei
			var index_componente = [];
			var index = []; // index in array-ul de components
			var pins = []; //arrayul de pini. direct pinii asa

			for (var j = 0; j < connection.length; j++) {
				var found = 0;

				var comp;
				for (var k = 0; k < components.length; k++) {
					if (components[k].label === connection[j].part.label) {
						found = 1;
						comp = components[k];
						index.push(k);
						index_componente.push(comp);
						break;
					}
				}

				if (!found) {
					if (connection[j].part.title.toLowerCase() === "Raspberry Pi 2".toLowerCase()) {
						comp = raspberryPiBoard();
					} else {
						// LED: verifica daca ultimele 3 caractere sunt "LED"
						if (connection[j].part.title.substr(connection[j].part.title.length - 3) === "LED") {
							comp = new Led();
							initializare_led(comp, connection[j]);
							last_led = connection[j].part.id; //componentID
						} else {
							if (connection[j].part.title.toLowerCase() === "Pushbutton".toLowerCase()) {
								comp = new Button();
							} else {
								if (connection[j].part.title.substr(connection[j].part.title.length - 8) === "Resistor") {
									comp = new Resistor();
								} else {
									console.log("What is this component? "+connection[j].part.title);
								}
							}
						}
					}
					comp.label = connection[j].part.label;
					comp.componentId = connection[j].part.id;
					components.push(comp);
					index_componente.push(comp);
					index.push(components.length - 1);
				}
				// parsare pt pin
				var pin = getPinFromComponent(comp, connection[j].name);
				pins.push(pin);
			}

			if (index.length === 2) {
				if (pins[0] != nothing & pins[1] != nothing) {
					connectPins(components[index[0]], pins[0], components[index[1]], pins[1]);
				}
			} else {
				var but = -1;
				var res = -1, piboard = -1;

				for (var j = 1; j < index.length; j++) {

					// console.log(index_componente[j].name);
					switch(index_componente[j].name.toLowerCase()) {
						case "Button".toLowerCase():
							but = j;
						break;
						case "Resistor".toLowerCase():
							res = j;
						break;
						case "raspberryPiBoard".toLowerCase():
							piboard = j;
						break;
						default:
					}

					if (components[index[0]] === components[index[j]]) {
						if (pins[0].number != pins[j].number) {
							connectPins(components[index[0]], pins[0], components[index[j]], pins[j]);
						}

					} else {

						//aici trebuie sa fac conexiunea mai ciudata
						if (but != -1) {
							connectPins(components[index[j]], pins[j], components[index[0]], pins[0]);
						} else {
							connectPins(components[index[0]], pins[0], components[index[j]], pins[j]);
						}
					}
				}
			}
		}
	}

	for (var i = 0; i < components.length; i++) {
		for (var j = 0; j < components[i].pins.length; j++) {
			if (components[i].pins[j].currentMode === "OUT0")
				components[i].pins[j].value = 0;
			if (components[i].pins[j].currentMode === "OUT1")
				components[i].pins[j].value = 1;
		}
		if (components[i].name === "Resistor") {
			components[i].update_values();
		}
		if (components[i].name === "Button") {
			butonul = i;
			butonulId = components[i].componentId;
		}

	}
	console.log(components);
	//findCamera();
}


function initializare_led(led, comp) {
	var temp = comp.part.title;
	temp = temp.substring(temp.indexOf("(")+1, temp.indexOf(")"));
	var numberPattern = /\d+/g;
	temp = temp.match( numberPattern );
	led.type = _.parseInt(temp[0]);
	led.index = _.indexOf(leds, led.type);
}

function bfs(node, comp) {
	var queue = [],
		next = node;
	if (comp.name === "Button") {
		return;
	}

	var modified = 0;
	while (next) {
		if (next.neighbors) {
			for (var i = 0; i < next.neighbors.length; i++) {

				if (next.neighbors[i].neighborPin.value != node.value && next.neighbors[i].neighborPin.canModify) {
						next.neighbors[i].neighborPin.setPin(node.value);
						queue.push(next.neighbors[i].neighborPin);
						modified = 1;
				}
			}
		}
		next = queue.shift();
	}
	return modified;
}



function change_led (led, state) {
	if (state) {
		// $("#svg1 svg g[partID=57430] #color_path32").attr ('fill', '#0f0f0f')
		var ledul = $("#svg1 svg g[partID=" + led.componentId + "] #color_path32").attr ('fill', colours_on[led.index]);
	} else {
		var ledul = $("#svg1 svg g[partID=" + led.componentId + "] #color_path32").attr ('fill', colours_off[led.index]);
	}
}

function runLedCode() {
	if (butonul != -1) {
		var gpio_placa = components[0].digitalRead(4);
		var gpio_led = components[0].digitalRead(25);

		if (gpio_placa === 1) {
			if (gpio_led != 1){
				components[0].digitalWrite(25, 1);
				//switchTheLight(true);
			}
		} else {
			if (gpio_led === 1){
				components[0].digitalWrite(25, 0);
				//switchTheLight(false);
			}
		}
	}
}

function simulate () {
	// console.log(components);
	if (components.length === 0) {
		return;
	}
	var modified = 1;
	while (modified === 1) {
		modified = 0;
		var mod = 0;
		for (var i = 0; i < components.length; i++) {
			if (components[i].name.toLowerCase() === "Resistor".toLowerCase()) {
				mod = components[i].update_values();
				modified = (mod  === 1 || modified === 1) ? 1 : 0;
			}
			for (var j = 0; j < components[i].pins.length; j++) {
				mod = bfs(components[i].pins[j], components[i]);
				modified = (mod  === 1 || modified === 1) ? 1 : 0;
			}
		}
	}
	runLedCode();

	for (var i = 0; i < components.length; i++) {
		if (components[i].name === "Led") {
			if (components[i].getState()) {
				// var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+components[i].componentId+'"] #color_path32').attr('fill', led_on);
				change_led(components[i], ON);
			} else {
				// var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+components[i].componentId+'"] #color_path32').attr('fill', led_off);
				change_led(components[i], OFF);
			}
		}
	}

}

var lines;

function runCode(code) {
	eval (code);
}

function getFile(file) {
	fisier_svg = file + '.svg';
	fisier_xml = file + '.xml';
}

var el = $("#execute");
el.click(function() {
	var cod = editor.getSession().getValue();
	console.log(cod);
	runCode(cod);
});

var push = 0;
function pushButton() {
	push++;
	if (butonul != -1) {
		if (push % 2 === 0) {
			components[butonul].released();
		} else {
			//push
			components[butonul].pushed();
		}
		simulate();
	}
}

var load = $("#load");
load.click(function() {
	$("#file").val();
	getFile($("#file").val());

	var xhr = new XMLHttpRequest();
	xhr.open("GET", fisier_svg, false);
	xhr.overrideMimeType("image/svg+xml");
	xhr.send("");
	document.getElementById("svg1").appendChild(xhr.responseXML.documentElement);

	handleGetClick();
	teste($("#file").val());

	// $(document).ready(function() {
	// 	handleGetClick();
	// 	simulate();
	// 	teste($("#file").val());
	// });

	if ($("#file").val() === "buton") {
		var but = $("#push");
		but.click(function() {
			pushButton();
		});
	}
});


// function teste(file) {
// 	switch(file.toLowerCase())
// 	{
// 		case "demo".toLowerCase():
// 			setInterval(timeout, 1000);
// 			break;
// 		case "demo2".toLowerCase():
// 			setInterval(timeout2, 500);
// 			break;
// 		case "demo3".toLowerCase():
// 			setInterval(timeout3, 200);
// 			break;
// 		case "buton".toLowerCase():
// 			// setInterval(timeout4, 200);
// 			break;
// 		case "simple".toLowerCase():
// 			// setInterval(timeout4, 200);
// 			break;

// 	}
// }

function teste(file) {

	var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
	editor.getSession().setMode(new JavaScriptMode());

	if (file === "demo" || file === "demo2" || file === "demo3") {
		$.get (file+'.txt', function (data)
		{
			editor.getSession().setValue(data);
		});
	} else {
		editor.getSession().setValue("");
	}


	// switch(file.toLowerCase())
	// {
	// 	case "demo".toLowerCase():

	// 		var timeout1;
	// 		$.get("timeout1.txt", function(data) {
	// 		    timeout1 = data;
	// 		});
	// 		console.log(timeout1);
	// 		editor.getSession().setValue(timeout1);
	// 		var cod = editor.getSession().getValue();
	// 		runCode(cod);
	// 		// $('#code').val($('#code').val()+timeout1);

	// 		//setInterval(timeout, 1000);
	// 		break;
	// 	case "demo2".toLowerCase():
	// 		editor.getSession().setValue(timeout2);
	// 		var cod = editor.getSession().getValue();
	// 		runCode(cod);

	// 		// $('#code').val($('#code').val()+timeout2);
	// 		//setInterval(timeout2, 500);
	// 		break;
	// 	case "demo3".toLowerCase():
	// 		editor.getSession().setValue(timeout3);
	// 		var cod = editor.getSession().getValue();
	// 		runCode(cod);
	// 		// $('#code').val($('#code').val()+timeout3);
	// 		//setInterval(timeout3, 200);
	// 		break;
	// 	case "buton".toLowerCase():
	// 		editor.getSession().setValue("");
	// 		// setInterval(timeout4, 200);
	// 		break;
	// 	case "simple".toLowerCase():
	// 		editor.getSession().setValue("");
	// 		// setInterval(timeout4, 200);
	// 		break;

	// 		// var cod = editor.getSession().getValue();
	// 		// runCode(cod);

	// }

}
