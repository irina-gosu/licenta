function handleGetClick(){

	$.get('Sketch_netlist.xml', function(xml){
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

function parse_netlist(json) {
	console.log(json);
}


$(document).ready(function() {
/** work when all HTML loaded except images and DOM is ready **/
	handleGetClick();
});

