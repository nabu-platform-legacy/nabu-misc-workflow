Vue.view("workflow-graphic", {
	template: "<div class='workflow-graphic'><svg ref='svg'></svg></div>",
	props: {
		definitionId: {
			type: String,
			required: true
		},
		stateId: {
			type: String,
			required: false
		},
		transitionId: {
			type: String,
			required: false
		}
	},
	computed: {
		definitions: function() {
			return ${json.stringify(nabu.misc.workflow.Services.getDefinitions())};
		}
	},
	ready: function() {
		this.draw();
	},
	methods: {
		draw: function() {
			var self = this;
			nabu.utils.elements.clear(this.$refs.svg);
			
			var margin = {top: 20, right: 55, bottom: 30, left: 50};
			var svg = d3.select(this.$refs.svg),
				width = this.$el.offsetWidth - margin.right - margin.left,
				height = this.$el.offsetHeight - margin.top - margin.bottom;
			
			svg.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);
				
			// add support for arrow marker
			svg.append("svg:defs")
				.append("svg:marker")
					.attr("id", "arrow")
					.attr("markerUnits", "strokeWidth")
					.attr("markerWidth", 12)
					.attr("markerHeight", 12)
					.attr("viewBox", "0 0 12 12")
					.attr("refX", 6)
					.attr("refY", 6)
					.attr("orient", "auto")
					.append("path")
						.attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
						.style("fill", "#ccc")
						.style("stroke", "#ccc");
					
			var definition = this.definitions.filter(function(x) { return x.definitionId == self.definitionId })[0];
			if (definition && definition.states) {
				var maxX = 0, maxY = 0;
				// we need the max x,y so we can scale according to the available space
				// we add some additional space as the xy is the top left
				definition.states.forEach(function(state) {
					if (state.x > maxX) {
						maxX = state.x + 100;
					}
					if (state.y > maxY) {
						maxY = state.y + 100;
					}
					if (state.transitions) {
						state.transitions.forEach(function(transition) {
							if (transition.x > maxX) {
								maxX = transition.x + 50;
							}
							if (transition.y > maxY) {
								maxY = transition.y + 50;
							}
						});
					}
				});
				var scaleX = maxX / width;
				var scaleY = maxY / height;
				
				var states = {};
				var target = svg;
				definition.states.forEach(function(state) {
					var rect = target.append("rect")
						.attr("x", state.x / scaleX)
						.attr("y", state.y / scaleY)
						.attr("class", "state");
						
					var text = target.append("text")
						.text(state.name)
						.attr("x", (state.x / scaleX) + 10)
						.attr("y", (state.y / scaleY) + 25);
						
					// resize the box depending on the text size
					var box = text.node().getBBox();
					rect.attr("width", box.width + 20)
						.attr("height", box.height + 20);
						//.style("fill", "#fff")
						//.style("stroke-width", "1px")
						//.style("stroke", "#ccc");
					
					if (state.id == self.stateId) {
						rect.attr("class", "state current-state");
					}
						
					states[state.id] = {
						state: state,
						rect: rect,
						x: state.x / scaleX,
						y: state.y / scaleY,
						width: box.width + 20,
						height: box.height + 20
					};
				});
				
				// once all states are drawn, we can draw the transitions
				definition.states.forEach(function(state) {
					if (state.transitions) {
						state.transitions.forEach(function(transition) {
							var to = states[transition.targetStateId];
							if (to) {
								var transitionX = transition.x / scaleX;
								var transitionY = transition.y / scaleY;
								
								var source = self.selectClosestToRect(transitionX, transitionY, states[state.id]);
								var target = self.selectClosestToRect(transitionX, transitionY, to);
								
								var path = d3.path();
								path.moveTo(source.x, source.y);
								// the transition x,y coordinates are for a circle to be drawn, here we are using it for a point in a line
								// that means positioning it is slightly tricky business height wise, this is a visually correct approximation
								//path.lineTo(transitionX, transitionY + (to.height / 4));
								path.lineTo(transitionX, transitionY);
								path.lineTo(target.x, target.y);
								// when using the quadratic, there are no vertexes for the marker-mid to hang on to: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/marker-mid
								// the marker start and end are not entirely readable
								//path.quadraticCurveTo(transition.x / scaleX, transition.y / scaleY, target.x, target.y);
								//path.closePath();
								
								var line = svg.append("path")
									.attr("d", path.toString())
									//.style("fill", "none")
									//.style("stroke-width", "1px")
									//.style("stroke", "#ccc")
									.attr("marker-mid", "url(#arrow)")
									//.attr("marker-end", "url(#arrow)")
									//.attr("marker-start", "url(#arrow)");
								
								if (transition.id == self.transitionId) {
									line.attr("class", "transition current-transition");
								}
								else {
									line.attr("class", "transition");
								}
							}
						});
					}
				})
				
				// also draw the extensions
				definition.states.forEach(function(state) {
					if (state.extensions) {
						state.extensions.forEach(function(extension) {
							var to = states[extension];
							var from = states[state.id];
							if (to && from) {
								var source = self.selectClosestToRect(from.x, from.y, to);
								var target = self.selectClosestToRect(to.x, to.y, from);
								
								var path = d3.path();
								path.moveTo(source.x, source.y);
								path.lineTo(target.x, target.y);
								svg.append("path")
									.attr("d", path.toString())
									.style("fill", "none")
									.style("stroke-width", "1px")
									.style("stroke", "blue")
									.attr("stroke-dasharray", 7)
									.attr("marker-mid", "url(#arrow)");
							}
						});
					}
				})
			}
		},
		selectClosestToRect: function(x, y, rect) {
			var points = [
				// top center
				{ x: rect.x + (rect.width / 2), y: rect.y },
				// bottom center
				{ x: rect.x + (rect.width / 2), y: rect.y + rect.height },
				// left center
				{ x: rect.x, y: rect.y + (rect.height / 2) },
				// right center
				{ x: rect.x + rect.width, y: rect.y + (rect.height / 2) }
			];
			return this.selectClosestToPoints(x, y, points);
		},
		selectClosestToPoints: function(x, y, points) {
			var minimumDistance = null;
			var optimalPoint = null;
			points.forEach(function(point) {
				var distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
				if (minimumDistance == null || minimumDistance > distance) {
					optimalPoint = point;
					minimumDistance = distance;
				}
			});
			return optimalPoint;
		}
	}
});