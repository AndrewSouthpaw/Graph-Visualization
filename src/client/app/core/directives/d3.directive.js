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
              .linkDistance(function(link) { return link.value * 10 })
              .size([width, height]);

          var svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

          var nodes = [
            {name: 0, group: 0},
            {name: 1, group: 0},
            {name: 2, group: 0},
            {name: 3, group: 0},
            {name: 4, group: 0},
            {name: 5, group: 0},
            {name: 6, group: 0},
            {name: 7, group: 0},
            {name: 8, group: 0}
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

          force
              .nodes(nodes)
              .links(links)
              .start();

          var link = svg.selectAll(".link")
              .data(links)
            .enter().append("line")
              .attr("class", "link")
              .style("stroke-width", function(d) { return Math.sqrt(d.value); });

          // Create the groups under svg
          var gnodes = svg.selectAll('g.gnode')
            .data(nodes)
            .enter()
            .append('g')
            .classed('gnode', true);

          var node = gnodes.append("circle")
              .attr("class", "node")
              .attr("r", 10)
              .style("fill", function(d) { return color(d.group); })
              .call(force.drag);

          var labels = gnodes.append('text')
            .text(function(d) { return d.name.toString(); });

          node.append("title")
              .text(function(d) { return d.name; });

          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            gnodes.attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')';
            });

            labels.attr('transform', function(d) {
              return 'translate(' + [-2, 5] + ')';
            })

            // node.attr("cx", function(d) { return d.x; })
            //     .attr("cy", function(d) { return d.y; });
          });

        });
      }
    };
  }

}).call(this);

