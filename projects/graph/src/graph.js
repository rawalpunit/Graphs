/**
 * Edge
 */
export class Edge {
  // !!! IMPLEMENT ME
  constructor(destination, weight = 1) {
    this.destination = destination;
    this.weight = weight;
    // console.log('used the edge ctor');
  }
}

/**
 * Vertex
 */
export class Vertex {
  // !!! IMPLEMENT ME
  constructor(value = 'v0', pos = { x: 0, y: 0 }) {
    this.edges = [];
    this.value = value;
    this.pos = pos;
    // console.log('used the vertex ctor');
  }
}

/**
 * Graph
 */
export class Graph {
  constructor() {
    this.vertexes = [];
    this.queue = [];
    this.currentFoundArr = [];
  }

  // debugCreateTestData() {
  //   console.log('called debug');
  //   let debugVertex1 = new Vertex('v1', {x:100, y:100});
  //   let debugVertex2 = new Vertex('v2', {x:200, y:200});

  //   let debugEdge1 = new Edge(debugVertex2);
  //   debugVertex1.edges.push(debugEdge1);
  //   this.vertexes.push(debugVertex1, debugVertex2);
  // }

  /**
   * Create a random graph
   */
  randomize(width, height, pxBox, probability = 0.6) {
    // Helper function to set up two-way edges
    function connectVerts(v0, v1) {
      v0.edges.push(new Edge(v1));
      v1.edges.push(new Edge(v0));
    }

    let count = 0;

    // Build a grid of verts
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let v = new Vertex();
        //v.value = 'v' + x + ',' + y;
        v.value = 'v' + count++;
        row.push(v);
      }
      grid.push(row);
    }

    // Go through the grid randomly hooking up edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Connect down
        if (y < height - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y + 1][x]);
          }
        }

        // Connect right
        if (x < width - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y][x + 1]);
          }
        }
      }
    }

    // Last pass, set the x and y coordinates for drawing
    const boxBuffer = 0.8;
    const boxInner = pxBox * boxBuffer;
    const boxInnerOffset = (pxBox - boxInner) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].pos = {
          x: (x * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
          y: (y * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
        };
      }
    }

    // Finally, add everything in our grid to the vertexes in this Graph
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.vertexes.push(grid[y][x]);
      }
    }
  }

  /**
   * Dump graph data to the console
   */
  dump() {
    let s;

    for (let v of this.vertexes) {
      if (v.pos) {
        s = v.value + ' (' + v.pos.x + ',' + v.pos.y + '):';
      } else {
        s = v.value + ':';
      }

      for (let e of v.edges) {
        s += ` ${e.destination.value}`;
      }
      console.log(s);
    }
  }

  /**
   * BFS
   */
  // bfs(start) {
  //   // !!! IMPLEMENT ME

  //   this.queue.push(start);
  //   this.currentFoundArr.push(start);
  //   while (this.queue.length > 0) {
  //     this.queue[0].edges.map(edge => {
  //       // for each edge check if vertex is in currFoundArr
  //       if (!this.currentFoundArr.includes(edge.destination)) {
  //         // edge.destination.color = this.getRandomColor();
  //         this.queue.push(edge.destination);
  //         this.currentFoundArr.push(edge.destination);
  //       }
  //       return this.currentFoundArr;
  //     });
  //     this.queue.shift();
  //   }
  // }

  // /**
  //  * Get the connected components
  //  */
  // getConnectedComponents() {
  //   let colorArr = [];
  //   for (let i = 0; i < this.vertexes.length; i++) {
  //     if (!this.currentFoundArr.includes(this.vertexes[i])) {
  //       // this.bfs(this.vertexes[i]);
  //       colorArr.push(this.bfs(this.vertexes[i]));
  //     }
  //   }
  //   return colorArr;
  // }
  bfs(start) {
    // !!! IMPLEMENT ME
    const connectedQueue = [start];
    const connectedVerts = [];

    while (connectedQueue.length > 0) {
      const currentVert = connectedQueue.shift();
      if (currentVert.found) continue;
      else {
        currentVert.found = true;
        connectedVerts.push(currentVert);
        currentVert.edges.forEach(edge => {
          if (!edge.destination.found) {
            connectedQueue.push(edge.destination);
          }
        })
      }
    }
    return connectedVerts;
  }

  dfs(start) {
    const stack = [start];
    const found = [];

    while (stack.length > 0) {
      // case where stack[0] has no connections
      if (stack[0].edges.length === 0) {
        found.push(stack[0]);
      }
      // case where stack[0] is connected
      for (let edge of stack[0].edges) {
        if (!found.includes(edge.destination)) {
          found.push(edge.destination);
          stack.push(edge.destination);
          }
        }
      stack.pop();
    }
    return found;
  }

  /**
   * Get the connected components
   */
  // getConnectedComponents() {
  //   // !!! IMPLEMENT ME
  //   const groups = [];
  //   this.vertexes.forEach(vert => {
  //     // vert.color = 'white';
  //     // vert.parent = null;

  //     // if (!vert.found) {
  //     //   groups.push(this.bfs(vert));
  //     // }

  //     if (!vert.found) {
  //       groups.push(this.dfs(vert));
  //     } 
  //   })

  //   this.vertexes.forEach(vert => vert.color = 'white');
  //   return groups;
  // }

  getConnectedComponents() {
    const ccList = [];

    for (let vertex of this.vertexes) {
      if (vertex.found === false) {
        ccList.push(this.dfs(vertex));
      }
    }
    return ccList;
  }
}
