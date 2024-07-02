window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		
		var definitions = ${json.stringify(nabu.misc.workflow.Services.getDefinitions())};
		
		nabu.page.provide("page-format", {
			format: function(value) {
				for (var i = 0; i < definitions.length; i++) {
					if (!definitions[i].states) { 
						continue;
					}
					for (var j = 0; j < definitions[i].states.length; j++) {
						if (definitions[i].states[j].id == value) {
							return definitions[i].states[j].name;
						}
					}
				}
				return null;
			},
			name: "workflow-state",
			namespace: "nabu.workflow"
		});
		
		nabu.page.provide("page-format", {
			format: function(value) {
				for (var i = 0; i < definitions.length; i++) {
					if (!definitions[i].states) { 
						continue;
					}
					for (var j = 0; j < definitions[i].states.length; j++) {
						if (!definitions[i].states[j].transitions) { 
							continue;
						}
						for (var k = 0; k < definitions[i].states[j].transitions.length; k++) {
							if (definitions[i].states[j].transitions[k].id == value) {
								return definitions[i].states[j].transitions[k].name;
							}
						}
					}
				}
				return null;
			},
			name: "workflow-transition",
			namespace: "nabu.workflow"
		});
		
		nabu.page.provide("page-enumerate", {
			name: "workflow-definitions",
			enumerate: function() {
				return definitions.map(function(x) { return x.definitionId });
			}
		})
	})
});