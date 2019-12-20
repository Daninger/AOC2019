module.exports = class Graph {
  neighbors = {}; // Key = vertex, value = array of neighbors.

  addEdge(u, v) {
    let neighbors = this.neighbors;
    if (neighbors[u] === undefined) {
      neighbors[u] = [];
    }
    neighbors[u].push(v);
    if (neighbors[v] === undefined) {
      neighbors[v] = [];
    }
    neighbors[v].push(u);
  }

  bfs(source) {
    const queue = [{ vertex: source, count: 0 }];
    const visited = { source: true };
    let tail = 0;
    while (tail < queue.length) {
      let u = queue[tail].vertex;
      let count = queue[tail++].count;
      (this.neighbors[u] || []).forEach(v => {
        if (!visited[v]) {
          visited[v] = true;
          queue.push({ vertex: v, count: count + 1 });
        }
      });
    }
    return queue;
  }

  shortestPath(source, target) {
    if (source == target) {
      console.log("source === target");
      return;
    }
    const queue = [source];
    const visited = { source: true };
    let predecessor = {};
    let tail = 0;
    while (tail < queue.length) {
      let u = queue[tail++]; // Pop a vertex off the queue.
      for (let v of this.neighbors[u]) {
        if (visited[v]) {
          continue;
        }
        visited[v] = true;
        if (v === target) {
          var path = [v];
          while (u !== source) {
            path.push(u);
            u = predecessor[u];
          }
          path.push(u);
          return { path: path.reverse(), distance: path.length - 1 };
        }
        predecessor[v] = u;
        queue.push(v);
      }
    }
    console.log("there is no path from " + source + " to " + target);
  }
};
