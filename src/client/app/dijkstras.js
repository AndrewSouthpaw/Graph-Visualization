/* jshint ignore:start */
function Dijkstras(graphObject) {
  var graph = graphObject;

  var processedNodes = {};//set of processed nodes
  var shortestDistance = {}; //shortest distnace to any node
  var shortestPath = {}; //holds the shortest path to each node

  var scoreHeap = new BinaryHeap(function(node) {
    //find the minimum score of all edges with tail in X and this is the head
    return graph[node].score;
  });

  //add all nodes to heap
  for (var item in graph) {
    graph[item].score = Number.MAX_VALUE;
    scoreHeap.push(item);
  }

  function calculate(start, end) {
    //here we pick a node to add to X
    var nodeToProcess = start;
    graph[nodeToProcess].score = 0;
    shortestDistance[nodeToProcess] = 0;


    for (var i = 0; i < Object.keys(graph).length; i++) {
      var n = nodeToProcess;
      var node = graph[n];
      scoreHeap.remove(n);
      processedNodes[n] = true;
      shortestDistance[n] = node.score;

      //find the lowest score by looping through each edge because these are the only new ones
      for (var targetNode in node.edges) {
        var edgeValue = node.edges[targetNode];
        var score = node.score + edgeValue;

        //if the other node is not already processed update the nodes score if it now has
        //a lower score
        if (!processedNodes[targetNode] && score < graph[targetNode].score) {
          graph[targetNode].score = score;
          shortestPath[targetNode] = n;
        }

        //force the node to be rescored if its still on the heap
        if (!processedNodes[targetNode]) {
          scoreHeap.remove(targetNode);
          scoreHeap.push(targetNode);
        }//end if target not in X
      }
      nodeToProcess = scoreHeap.pop();
    }//end for each node on heap

    //calc the path by walking backward
    var shortestPathNode = end;
    var path = String(end);

    while (shortestPathNode != start) {
      var previousNode = shortestPath[shortestPathNode];
      path = previousNode + ' ' + path;
      shortestPathNode = previousNode;
    }

    return [shortestDistance[end], path];
  }

  return {
    calc: calculate
  };
}
/* jshint ignore:end */
