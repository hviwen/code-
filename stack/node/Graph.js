/**
 * Graph Data Structure Implementation
 * 
 * A graph is a collection of vertices (nodes) connected by edges.
 * This implementation uses an adjacency list representation with a Map.
 */
class Graph {
  constructor() {
    // Use Map for adjacency list - each vertex maps to array of connected vertices
    this.adjacencyList = new Map()
  }

  /**
   * Add a vertex to the graph
   * @param {*} vertex - The vertex to add
   */
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, [])
    }
  }

  /**
   * Add an undirected edge between two vertices
   * @param {*} vertex1 - First vertex
   * @param {*} vertex2 - Second vertex
   */
  addEdge(vertex1, vertex2) {
    this.addVertex(vertex1)
    this.addVertex(vertex2)
    this.adjacencyList.get(vertex1).push(vertex2)
    this.adjacencyList.get(vertex2).push(vertex1)
  }

  /**
   * Remove an edge between two vertices
   * @param {*} vertex1 - First vertex
   * @param {*} vertex2 - Second vertex
   */
  removeEdge(vertex1, vertex2) {
    // BUG FIX: filter() returns new array, need to assign back
    this.adjacencyList.set(vertex1, this.adjacencyList.get(vertex1).filter(v => v !== vertex2))
    this.adjacencyList.set(vertex2, this.adjacencyList.get(vertex2).filter(v => v !== vertex1))
  }

  /**
   * Remove a vertex and all its edges from the graph
   * @param {*} vertex - The vertex to remove
   */
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) return
    // Remove all edges connected to this vertex
    for (const adjacentVertex of this.adjacencyList.get(vertex)) {
      this.removeEdge(vertex, adjacentVertex)
    }
    this.adjacencyList.delete(vertex)
  }

  /**
   * Print the graph structure
   */
  print() {
    for (let [v, neighbors] of this.adjacencyList) {
      console.log(v, '->', neighbors.join(', '))
    }
  }
}

// Example usage
const graph = new Graph()
;['A', 'B', 'C', 'D', 'E'].forEach(v => graph.addVertex(v))
graph.addEdge('A', 'B')
graph.addEdge('A', 'C')
graph.addEdge('B', 'D')
graph.addEdge('C', 'E')
graph.print()

/**
 * Breadth-First Search (BFS) Algorithm
 * 
 * Explores graph level by level using a queue.
 * Time Complexity: O(V + E), Space Complexity: O(V)
 * 
 * @param {Object} graph - Graph represented as adjacency list object
 * @param {*} startNode - Starting vertex for traversal
 * @returns {Array} Array of vertices in BFS order
 */
function bfs(graph, startNode) {
  const visited = new Set()
  const queue = [startNode]
  const result = []

  // BUG FIX: Mark start node as visited immediately
  visited.add(startNode)

  while (queue.length > 0) {
    const node = queue.shift()
    result.push(node)

    const neighbors = graph[node]
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }
  return result
}

// Test graph for BFS/DFS
const _graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
}

console.log('BFS traversal:', bfs(_graph, 'A'))

/**
 * Depth-First Search (DFS) Algorithm
 * 
 * Explores graph by going as deep as possible before backtracking.
 * Time Complexity: O(V + E), Space Complexity: O(V)
 * 
 * @param {Object} graph - Graph represented as adjacency list object
 * @param {*} startNode - Starting vertex for traversal
 * @returns {Array} Array of vertices in DFS order
 */
function dfs(graph, startNode) {
  const visited = new Set()
  const result = []

  /**
   * Recursive helper function for DFS traversal
   * @param {*} node - Current node being visited
   */
  function dfsVisited(node) {
    result.push(node)
    visited.add(node)
    
    const neighbors = graph[node]
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsVisited(neighbor)
      }
    }
  }

  dfsVisited(startNode)
  return result
}

console.log('DFS traversal:', dfs(_graph, 'A'))
