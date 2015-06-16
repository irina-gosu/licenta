var nothing = -1;

function handleGetClick(){
	$.get('test_trei_leduri_netlist.xml', function(xml){
		var json = $.xml2json(xml);

		parse_netlist(json);

	// 	$("#json").JSONView(json);
	// 	$("#json-collapsed").JSONView(json, { collapsed: true, nl2br: true, recursive_collapser: true });
	// 	$('#collapse-btn').on('click', function() {
	// 		$('#json').JSONView('collapse');
	// 	});
	// 	$('#expand-btn').on('click', function() {
	// 		$('#json').JSONView('expand');
	// 	});
	// 	$('#toggle-btn').on('click', function() {
	// 		$('#json').JSONView('toggle');
	// 	});
	// 	$('#toggle-level1-btn').on('click', function() {
	// 		$('#json').JSONView('toggle', 1);
	// 	});
	// 	$('#toggle-level2-btn').on('click', function() {
	// 		$('#json').JSONView('toggle', 2);
	// 	});
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
						} else {
							if (connection[j].part.title.toLowerCase() === "Button") {
								comp = new Button(42, 12);
							} else {
								console.log("What is this component? "+connection[j].part.title);
							}
						}
					}
					comp.label = connection[j].part.label;
					console.log(connection[j].part.id);
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
					if (components[index[0]] === components[index[j]] ) {
						if (pins[0].number != pins[j].number)
							connectPins(components[index[0]], pins[0], components[index[j]], pins[j]);
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

function traverse (node, comp) {
	var queue = [],
		next = node;

	while(next) {
		if (next.neighbors) {
			$.each(next.neighbors, function (i, neighbor) {
				if (neighbor.neighborPin.value != node.value) {
					neighbor.neighborPin.value = node.value;
					queue.push(neighbor.neighborPin);
					// console.log("vecini ");
					// console.log(neighbor);
					// console.log(neighbor.neighborPin);

				} else {
					return ;
				}
			});
		}
		next = queue.shift();
	}
}


function simulate () {

	for (var i = 0; i < components.length; i++) {
		for (var j = 0; j < components[i].pins.length; j++) {
			if (components[i].pins[j].number != -1) {
				traverse(components[i].pins[j], components[i]);
			}
		}
	}

	for (var i = 0; i < components.length; i++) {
		if (components[i].name === "Led") {
			var led_off = "#e60000",
				led_on = "#ff4d4d";
			if (components[i].getState()) {
				var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+components[i].componentId+'"] #color_path32').attr('fill', led_on);
			} else {
				var ledul = $(document.querySelector("#svg1").getSVGDocument()).find('g[partID="'+components[i].componentId+'"] #color_path32').attr('fill', led_off);
			}
		}
	}

	// console.log(components);
}

$(document).ready(function() {
/** work when all HTML loaded except images and DOM is ready **/
	handleGetClick();
	simulate();
});





