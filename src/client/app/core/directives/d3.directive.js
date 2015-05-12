;(function() {

  'use strict';

  angular
    .module('app.core')
    .directive('d3Bars', d3Bars);

  /* @ngInject */
  function d3Bars($window, $timeout, d3Service) {
    return {
      restrict: 'EA',
      scope: {
        // data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

          var width = 960,
              height = 500;

          var color = d3.scale.category20();

          var force = d3.layout.force()
              .charge(-500)
              // .linkDistance(30)
              .linkDistance(function(link) { return link.value * 12; })
              .size([width, height]);

          var svg = d3.select('body').append('svg')
              .attr('width', width)
              .attr('height', height);

          var nodes = [
            {name: 0},
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4},
            {name: 5},
            {name: 6},
            {name: 7},
            {name: 8}
          ];

          var links = [
            { source: 0, target: 1, value: 4 },
            { source: 0, target: 7, value: 8 },
            { source: 1, target: 2, value: 8 },
            { source: 1, target: 7, value: 11 },
            { source: 2, target: 3, value: 7 },
            { source: 2, target: 8, value: 2 },
            { source: 3, target: 4, value: 9 },
            { source: 3, target: 5, value: 14 },
            { source: 5, target: 4, value: 10 },
            { source: 5, target: 2, value: 4 },
            { source: 6, target: 5, value: 2 },
            { source: 6, target: 8, value: 6 },
            { source: 7, target: 6, value: 1 },
            { source: 8, target: 7, value: 7 }
          ];

          var selectedNode = null;
          var selectedNodeD3 = null;

          force
              .nodes(nodes)
              .links(links)
              .start();

          svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('refX', 6 + 3) /*must be smarter way to calculate shift*/
            .attr('refY', 2)
            .attr('markerWidth', 6)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('path')
              .attr('d', 'M 0,0 V 4 L6,2 Z'); //this is actual shape for arrowhead


          var link = svg.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#arrowhead)')
            .style('stroke-width', 2);
            // .style('stroke-width', function(d) { return Math.sqrt(d.value); });

          // Create the groups under svg
          var gnodes = svg.selectAll('g.gnode')
            .data(nodes)
            .enter()
            .append('g')
            .classed('gnode', true)
            .on('mousedown', function(d) {
              // console.log(d3.select(this).attr('fill'))
              // d3.select(this).attr('class', 'selected');
              if (selectedNode === d) return;
              // remove formatting for previous node
              if (selectedNodeD3) {
                selectedNodeD3.select('circle').style('fill', 'red');
              }

              selectedNode = d;
              selectedNodeD3 = d3.select(this);
              selectedNodeD3.select('circle').style('fill', 'blue');
            })
            // .on('mouseover', function(d) {
            //   // if(!mousedown_node || d === mousedown_node) return;
            //   // enlarge target node
            //   var newTransform = d3.select(this).attr('transform') + ' scale(1.5)';
            //   d3.select(this).attr('transform', newTransform);
            // })
            // .on('mouseout', function(d) {
            //   // if(!mousedown_node || d === mousedown_node) return;
            //   // unenlarge target node
            //   var current = d3.select(this).attr('transform');
            //   d3.select(this).attr('transform', current.substring(0, current.indexOf(')') + 1));
            // });

          var node = gnodes.append('circle')
              .attr('class', 'node')
              .attr('r', 10)
              .style('fill', 'red')
              .call(force.drag);

          var labels = gnodes.append('text')
            .text(function(d) { return d.name.toString(); })
            .style('fill', 'white');

          node.append('title')
              .text(function(d) { return d.name; });

          force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            gnodes.attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')';
            });

            labels.attr('transform', function(d) {
              return 'translate(' + [-2, 5] + ')';
            });

            // node.attr('cx', function(d) { return d.x; })
            //     .attr('cy', function(d) { return d.y; });
          });

        });
      }
    };
  }

}).call(this);

