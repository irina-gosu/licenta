
var components = [];
var nothing = -1;

function handleGetClick(){
	$.get('circuit.xml', function(xml){
	// $.get('board_cu_rezistenta.xml', function(xml){
		var json = $.xml2json(xml);
		parse_netlist(json);


	$("#json").JSONView(json);
		$("#json-collapsed").JSONView(json, { collapsed: true, nl2br: true, recursive_collapser: true });
		$('#collapse-btn').on('click', function() {
			$('#json').JSONView('collapse');
		});
		$('#expand-btn').on('click', function() {
			$('#json').JSONView('expand');
		});
		$('#toggle-btn').on('click', function() {
			$('#json').JSONView('toggle');
		});
		$('#toggle-level1-btn').on('click', function() {
			$('#json').JSONView('toggle', 1);
		});
		$('#toggle-level2-btn').on('click', function() {
			$('#json').JSONView('toggle', 2);
		});
		$('#toggle-level3-btn').on('click', function() {
			$('#json').JSONView('toggle', 3);
		});
		$('#toggle-level4-btn').on('click', function() {
			$('#json').JSONView('toggle', 4);
		});


	});
}

function getPinFromComponent(component, pin_name) {

	if (component.name === "raspberryPiBoard") {
		if (pin_name.toLowerCase() === "3V3".toLowerCase()
			|| pin_name.toLowerCase() === "5V".toLowerCase()) {
			return nothing;
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
		if (pin_name === "cathode") {
			return component.output;
		} else {
			if (pin_name === "anode") {
				return component.input;
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
						} else {
							if (connection[j].part.title.toLowerCase() === "Button") {
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
				for (var j = 1; j < index.length; j++) {
					if (components[index[0]] === components[index[j]]) {
						if (pins[0].number != pins[j].number) {
							connectPins(components[index[0]], pins[0], components[index[j]], pins[j]);
						}

					} else {
						connectPins(components[index[0]], pins[0], components[index[j]], pins[j]);
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
	}
	console.log(components);
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

	var modified = 0;
	while (next) {
		if (next.neighbors) {
			for (var i = 0; i < next.neighbors.length; i++) {
				if (next.neighbors[i].neighborPin.value != node.value) {
					next.neighbors[i].neighborPin.setPin(node.value);
					queue.push(next.neighbors[i].neighborPin);
					modified = 1;
					if (next.neighbors[i].neighborPin.value != node.value)
						console.log("funck yyou");;
				}
			}
		}
		next = queue.shift();
	}
	return modified;
}

function change_led (led, state) {
	if (state) {
		var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+led.componentId+'"] #color_path32').attr('fill', colours_on[led.index]);
	} else {
		var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+led.componentId+'"] #color_path32').attr('fill', colours_off[led.index]);
	}
}

function simulate () {
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
			if (components[i].name === "Resistor") {
				mod = components[i].update_values();
				modified = (mod  === 1 || modified === 1) ? 1 : 0;
			}

		}
	}

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

$(document).ready(function() {
/** work when all HTML loaded except images and DOM is ready **/
	handleGetClick();
	simulate();
});





