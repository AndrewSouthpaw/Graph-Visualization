;(function() {

  'use strict';

  angular
    .module('app.core')
    .directive('d3Graph', d3Graph);

  /* @ngInject */
  function d3Graph($window, $timeout, d3Service) {
    return {
      restrict: 'EA',
      scope: {
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        // wait for d3 to load
        d3Service.d3().then(function(d3) {

          // data to describe the graph
          var nodes = [
            {name: 0, color: 'red'},
            {name: 1, color: 'red'},
            {name: 2, color: 'red'},
            {name: 3, color: 'red'},
            {name: 4, color: 'red'},
            {name: 5, color: 'red'},
            {name: 6, color: 'red'},
            {name: 7, color: 'red'},
            {name: 8, color: 'red'}
          ];

          var graphObject = {
            0: {edges: {1: 4, 7: 8}},
            1: {edges: {2: 8, 7: 11}},
            2: {edges: {3: 7, 8: 2}},
            3: {edges: {4: 9, 5: 14}},
            4: {edges: {}},
            5: {edges: {4: 10, 2: 4}},
            6: {edges: {5: 2, 8: 6}},
            7: {edges: {6: 1}},
            8: {edges: {7: 7}}
          };

          var links = [
            { source: 0, target: 1, value: 4, color: 'gray' },
            { source: 0, target: 7, value: 8, color: 'gray' },
            { source: 1, target: 2, value: 8, color: 'gray' },
            { source: 1, target: 7, value: 11, color: 'gray' },
            { source: 2, target: 3, value: 7, color: 'gray' },
            { source: 2, target: 8, value: 2, color: 'gray' },
            { source: 3, target: 4, value: 9, color: 'gray' },
            { source: 3, target: 5, value: 14, color: 'gray' },
            { source: 5, target: 4, value: 10, color: 'gray' },
            { source: 5, target: 2, value: 4, color: 'gray' },
            { source: 6, target: 5, value: 2, color: 'gray' },
            { source: 6, target: 8, value: 6, color: 'gray' },
            { source: 7, target: 6, value: 1, color: 'gray' },
            { source: 8, target: 7, value: 7, color: 'gray' }
          ];

          // set SVG properties
          var width = 960,
              height = 500;

          var svg = d3.select('body').append('svg')
              .attr('width', width)
              .attr('height', height);

          // variables to track which nodes and D3 equivalents are selected
          var fromNode = null;
          var fromNodeD3 = null;
          var toNode = null;
          var toNodeD3 = null;

          // add arrowheads on links, based on http://bit.ly/1QJg7vc
          svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('refX', 6 + 3)
            .attr('refY', 2)
            .attr('markerWidth', 6)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('path')
              .attr('d', 'M 0,0 V 4 L6,2 Z'); //this is actual shape for arrowhead

          // create grouping for links and their labels
          var glinks = svg.selectAll('g.glink')
            .data(links)
            .enter()
            .append('g')
            .classed('glink', true);

          // create link line
          var link = glinks.append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#arrowhead)')
            .style('stroke', function(d) { return d.color; })
            .style('stroke-width', 2);

          // create labels for links, displaying link length
          var linkLabels = glinks.append('text')
            .text(function(d) { return d.value.toString(); })
            .style('fill', 'black');

          /**
           * Helper function to cycle through links and update their color
           * display based on their properties
           * @param  {Object} options Options object
           *                            reset: sets all links to default color
           * @return {undefined}
           */
          function updateLinkColors(options) {
            if (options && options.reset) {
              links.forEach(function(link) { link.color = 'gray'; });
            }

            svg.selectAll('.link')
              .data(links)
              .style('stroke', function(d) {
                return d.color;
              });
          }

          /**
           * Finds the index of a link in the links object that connects
           * two nodes
           * @note  Returns -1 if link not found
           * @param  {Number} from Node number source
           * @param  {Number} to   Node number destination
           * @return {Number}      Index of link connecting the two nodes
           */
          function findLinkIndex(from, to) {
            return links.reduce(function(acc, link, index) {
              if (link.source.name === from && link.target.name === to) {
                return index;
              } else {
                return acc;
              }
            }, -1);
          }

          // Create groups for nodes and labels in SVG
          var gnodes = svg.selectAll('g.gnode')
            .data(nodes)
            .enter()
            .append('g')
            .classed('gnode', true)
            .on('mousedown', function(d) {

              // if shortest path has been calculated, clear selections
              if (fromNode && toNode) {
                // reset formatting
                fromNodeD3.select('circle').style('fill', 'red');
                toNodeD3.select('circle').style('fill', 'red');

                // clear selections
                fromNode = fromNodeD3 = null;
                toNode = toNodeD3 = null;
                updateLinkColors({ reset: true });
                svg.selectAll('circle').style('fill', 'red');
              }

              // deselect if first one is re-selected
              if (fromNode === d) {
                fromNodeD3.select('circle').style('fill', 'red');
                fromNode = fromNodeD3 = null;
                return;
              }

              // color first node if not yet selected
              if (!fromNode) {
                fromNode = d;
                fromNodeD3 = d3.select(this);
                fromNodeD3.select('circle').style('fill', 'blue');

              // otherwise color the second node and show shortest path
              } else {
                // select destination node and color
                toNode = d;
                toNodeD3 = d3.select(this);
                toNodeD3.select('circle').style('fill', 'blue');

                // calculate shortest path
                var dijk = new Dijkstras(graphObject); // jshint ignore:line
                var result = dijk.calc(fromNode.name, toNode.name);
                var path = result[1].split(' ').map(function(n) { return parseInt(n); });

                /**
                 * update link colors on the path in a lookahead fashion, so
                 * don't use the destination node
                 */
                for (var i = 0; i < path.length - 1; i++) {
                  // change link color
                  var linkIndex = findLinkIndex(path[i], path[i + 1]);
                  links[linkIndex].color = 'blue';
                }

                // update node colors not including start or destination
                var nodesToColor = path.slice(1, -1);
                svg.selectAll('circle').filter(function(d) {
                  return nodesToColor.indexOf(d.name) > -1 ? d : undefined;
                }).style('fill', '#add8e6');

                // refresh colors on SVG
                updateLinkColors();
              }

            })
            // enlarge target node on mouseover
            .on('mouseover', function(d) {
              // take current transform and append a scaling factor
              var newTransform = d3.select(this).attr('transform') + ' scale(1.25)';
              d3.select(this).attr('transform', newTransform);
            })
            // unenlarge target node on mouseout
            .on('mouseout', function(d) {
              // slice off scaling factor of current transform
              var current = d3.select(this).attr('transform');
              var newTransform = current.substring(0, current.indexOf(')') + 1);
              d3.select(this).attr('transform', newTransform);
            });

          // create node circles
          var node = gnodes.append('circle')
              .attr('class', 'node')
              .attr('r', 10)
              .style('fill', 'red');

          // place labels on nodes
          var labels = gnodes.append('text')
            .text(function(d) { return d.name.toString(); })
            .style('fill', 'white');

          // describe the force properties of layout
          var force = d3.layout.force()
            .charge(-500)
            .linkDistance(function(link) { return link.value * 12; })
            .size([width, height]);

          // initialize data in force layout
          force
            .nodes(nodes)
            .links(links)
            .start();

          // allow nodes to be dragged by user
          node.call(force.drag);

          // describe positioning of elements in force layout
          force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
              .attr('y1', function(d) { return d.source.y; })
              .attr('x2', function(d) { return d.target.x; })
              .attr('y2', function(d) { return d.target.y; });

            gnodes.attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')';
            });

            // offset node labels slightly to center in circle
            labels.attr('transform', function(d) {
              return 'translate(' + [-2, 5] + ')';
            });

            // position link labels to be midway along link
            linkLabels
              .attr('x', function(d) {
                return d.source.x + (d.target.x - d.source.x) / 2;
              })
              .attr('y', function(d) {
                return d.source.y + (d.target.y - d.source.y) / 2;
              });

          });

        });
      }
    };
  }

}).call(this);

