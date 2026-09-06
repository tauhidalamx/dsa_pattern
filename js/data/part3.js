// ============================================================================
// PART 3: PATTERNS 14 TO 20 (Graph Algorithms & Advanced Dynamic Programming)
// ============================================================================

window.PATTERNS_PART_3 = [
  // --------------------------------------------------------------------------
  // PATTERN 14: Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)
  // --------------------------------------------------------------------------
  {
    id: "14_shortest_paths",
    num: 14,
    name: "Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)",
    category: "Graph Theory",
    difficulty: "Medium-Hard",
    badge: "Weighted Graphs",
    shortDesc: "Find optimal cost paths in weighted graphs with non-negative edges (Dijkstra), negative edge cycles (Bellman-Ford), or all-pairs shortest paths (Floyd-Warshall).",
    theory: {
      what: "A family of graph optimization algorithms that compute the minimum weight path between nodes. Dijkstra uses a greedy min-heap approach for non-negative edges (O((V+E)log V)). Bellman-Ford relaxes edges V-1 times and detects negative cycles (O(V*E)). Floyd-Warshall uses 3 nested loops (O(V^3)) for all-pairs distances.",
      when: "Routing networks, cheapest flight tickets with k stops, network delay times, currency arbitrage detection, matrix maze with path weights, and reachability with minimum energy/cost.",
      coreIdea: "Distance relaxation: if `dist[u] + weight(u, v) < dist[v]`, update `dist[v] = dist[u] + weight(u, v)`. Dijkstra processes nodes in increasing order of tentative distance so each node is finalized once visited.",
      edgeCases: "Disconnected components (distance remains INF), cycles with zero or negative total cost, parallel edges between same pair with different weights, single node graph (dist=0)."
    },
    diagram: `flowchart TD
    Start["Start at Source Node"] --> Init["Set dist[src]=0, all other dist=INF<br/>Push {0, src} into Priority Queue"]
    Init --> CheckEmpty{"PQ Empty?"}
    CheckEmpty -- Yes --> End["Return dist array"]
    CheckEmpty -- No --> Pop["Pop {d, u} with minimum d"]
    Pop --> Valid{"d > dist[u]?"}
    Valid -- Yes (Outdated) --> CheckEmpty
    Valid -- No --> LoopEdges["For each neighbor {v, weight}:"]
    LoopEdges --> Relax{"dist[u] + weight < dist[v]?"}
    Relax -- Yes --> Update["dist[v] = dist[u] + weight<br/>Push {dist[v], v} into PQ"]
    Relax -- No --> LoopEdges
    Update --> LoopEdges`,
    visualizerType: "binary_search",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

// Dijkstra's Algorithm using Min-Heap: O((V + E) log V)
vector<int> dijkstra(int n, int src, const vector<vector<pair<int, int>>>& adj) {
    vector<int> dist(n, 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      brute: `// Bellman-Ford Algorithm: O(V * E) - Detects Negative Weight Cycles
#include <iostream>
#include <vector>

using namespace std;

vector<int> bellmanFord(int n, int src, const vector<vector<int>>& edges) {
    vector<int> dist(n, 1e9);
    dist[src] = 0;

    for (int i = 0; i < n - 1; ++i) {
        for (const auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != 1e9 && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return dist;
}`,
      template: `// Floyd-Warshall All-Pairs Shortest Path: O(V^3)
void floydWarshall(vector<vector<int>>& matrix, int n) {
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][k] != 1e9 && matrix[k][j] != 1e9) {
                    matrix[i][j] = min(matrix[i][j], matrix[i][k] + matrix[k][j]);
                }
            }
        }
    }
}`
    },
    solutions: [
      {
        title: "Q1. Network Delay Time (Dijkstra Standard)",
        diff: "Medium",
        time: "O(E log V)",
        space: "O(V + E)",
        intuition: "Model network routers as a directed weighted graph. Run Dijkstra from node k to find the shortest time signal reaches every node. The answer is max(dist[1..n]), or -1 if any node remains unreachable.",
        cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int, int>>> adj(n + 1);
    for (const auto& t : times) {
        adj[t[0]].push_back({t[1], t[2]});
    }

    vector<int> dist(n + 1, 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[k] = 0;
    pq.push({0, k});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (const auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    int maxDelay = 0;
    for (int i = 1; i <= n; ++i) {
        if (dist[i] == 1e9) return -1;
        maxDelay = max(maxDelay, dist[i]);
    }
    return maxDelay;
}`
      },
      {
        title: "Q2. Cheapest Flights Within K Stops",
        diff: "Medium",
        time: "O(K * E)",
        space: "O(V)",
        intuition: "Use modified Bellman-Ford / BFS queue restricted to at most k+1 edge relaxations. Using a previous step distance snapshot prevents multiple relaxations in the same level.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> dist(n, 1e9);
    dist[src] = 0;

    for (int i = 0; i <= k; ++i) {
        vector<int> temp = dist;
        for (const auto& f : flights) {
            int u = f[0], v = f[1], price = f[2];
            if (dist[u] != 1e9 && dist[u] + price < temp[v]) {
                temp[v] = dist[u] + price;
            }
        }
        dist = move(temp);
    }

    return dist[dst] == 1e9 ? -1 : dist[dst];
}`
      },
      {
        title: "Q3. Path With Minimum Effort (2D Matrix Dijkstra)",
        diff: "Medium",
        time: "O(R * C log(R * C))",
        space: "O(R * C)",
        intuition: "Treat matrix grid cells as graph vertices. The edge weight is absolute height difference. Use Dijkstra where the path cost is the maximum edge weight encountered so far.",
        cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <cmath>

using namespace std;

int minimumEffortPath(vector<vector<int>>& heights) {
    int rows = heights.size(), cols = heights[0].size();
    vector<vector<int>> effort(rows, vector<int>(cols, 1e9));
    
    // min-heap: {current_effort, r, c}
    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;
    
    effort[0][0] = 0;
    pq.push({0, 0, 0});
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};

    while (!pq.empty()) {
        auto top = pq.top();
        pq.pop();
        int d = top[0], r = top[1], c = top[2];

        if (r == rows - 1 && c == cols - 1) return d;
        if (d > effort[r][c]) continue;

        for (int i = 0; i < 4; ++i) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int nextEffort = max(d, abs(heights[nr][nc] - heights[r][c]));
                if (nextEffort < effort[nr][nc]) {
                    effort[nr][nc] = nextEffort;
                    pq.push({nextEffort, nr, nc});
                }
            }
        }
    }
    return 0;
}`
      },
      {
        title: "Q4. Minimum Cost to Make at Least One Valid Path in a Grid",
        diff: "Hard",
        time: "O(R * C)",
        space: "O(R * C)",
        intuition: "0-1 BFS or Dijkstra on grid. Changing an arrow sign costs 1, following existing arrow costs 0. A double-ended queue (deque) allows 0-cost transitions at front and 1-cost at back in O(V+E).",
        cpp: `#include <iostream>
#include <vector>
#include <deque>

using namespace std;

int minCost(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, 1e9));
    deque<pair<int, int>> dq;

    dist[0][0] = 0;
    dq.push_back({0, 0});

    // 1: right, 2: left, 3: lower, 4: upper
    int dr[] = {0, 0, 0, 1, -1};
    int dc[] = {0, 1, -1, 0, 0};

    while (!dq.empty()) {
        auto [r, c] = dq.front();
        dq.pop_front();

        for (int dir = 1; dir <= 4; ++dir) {
            int nr = r + dr[dir], nc = c + dc[dir];
            int cost = (grid[r][c] == dir) ? 0 : 1;

            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                if (dist[r][c] + cost < dist[nr][nc]) {
                    dist[nr][nc] = dist[r][c] + cost;
                    if (cost == 0) dq.push_front({nr, nc});
                    else dq.push_back({nr, nc});
                }
            }
        }
    }
    return dist[m - 1][n - 1];
}`
      },
      {
        title: "Q5. Number of Restricted Paths From First to Last Node",
        diff: "Medium",
        time: "O(E log V + V log V)",
        space: "O(V + E)",
        intuition: "First run Dijkstra from destination node n to find shortest distance to all nodes. Then use Memoized DFS / DP to count paths from 1 to n where each step strictly decreases the distance to target.",
        cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

const int MOD = 1e9 + 7;

int dfs(int u, int n, const vector<vector<pair<int, int>>>& adj, const vector<int>& dist, vector<int>& memo) {
    if (u == n) return 1;
    if (memo[u] != -1) return memo[u];

    long long count = 0;
    for (const auto& [v, w] : adj[u]) {
        if (dist[u] > dist[v]) {
            count = (count + dfs(v, n, adj, dist, memo)) % MOD;
        }
    }
    return memo[u] = count;
}

int countRestrictedPaths(int n, vector<vector<int>>& edges) {
    vector<vector<pair<int, int>>> adj(n + 1);
    for (const auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    vector<int> dist(n + 1, 2e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[n] = 0;
    pq.push({0, n});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (const auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    vector<int> memo(n + 1, -1);
    return dfs(1, n, adj, dist, memo);
}`
      },
      {
        title: "Q6. Find the City With the Smallest Number of Neighbors at a Threshold Distance",
        diff: "Medium",
        time: "O(V^3)",
        space: "O(V^2)",
        intuition: "Run Floyd-Warshall to compute all-pairs shortest paths. Then for each city count reachable neighbors with dist <= distanceThreshold, selecting city with minimum count (breaking ties by largest index).",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
    vector<vector<int>> dist(n, vector<int>(n, 1e9));
    for (int i = 0; i < n; ++i) dist[i][i] = 0;
    for (const auto& e : edges) {
        dist[e[0]][e[1]] = e[2];
        dist[e[1]][e[0]] = e[2];
    }

    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (dist[i][k] != 1e9 && dist[k][j] != 1e9) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    int minReachable = 1e9, bestCity = -1;
    for (int i = 0; i < n; ++i) {
        int reachable = 0;
        for (int j = 0; j < n; ++j) {
            if (i != j && dist[i][j] <= distanceThreshold) {
                reachable++;
            }
        }
        if (reachable <= minReachable) {
            minReachable = reachable;
            bestCity = i;
        }
    }
    return bestCity;
}`
      },
      {
        title: "Q7. Shortest Path Visiting All Nodes (State-Space BFS with Bitmask)",
        diff: "Hard",
        time: "O(N * 2^N)",
        space: "O(N * 2^N)",
        intuition: "BFS on state space `(currentNode, visitedBitmask)`. The first state reaching bitmask `(1<<n)-1` is guaranteed to have minimal path length.",
        cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int shortestPathLength(vector<vector<int>>& graph) {
    int n = graph.size();
    if (n <= 1) return 0;

    int allVisited = (1 << n) - 1;
    // queue elements: {u, mask, dist}
    queue<vector<int>> q;
    vector<vector<bool>> visited(n, vector<bool>(1 << n, false));

    for (int i = 0; i < n; ++i) {
        q.push({i, 1 << i, 0});
        visited[i][1 << i] = true;
    }

    while (!q.empty()) {
        auto curr = q.front();
        q.pop();
        int u = curr[0], mask = curr[1], dist = curr[2];

        if (mask == allVisited) return dist;

        for (int v : graph[u]) {
            int nextMask = mask | (1 << v);
            if (!visited[v][nextMask]) {
                visited[v][nextMask] = true;
                q.push({v, nextMask, dist + 1});
            }
        }
    }
    return -1;
}`
      }
    ],
    problems: [
      { id: "SP01", title: "Network Delay Time", diff: "Medium", tags: ["Dijkstra"], time: "O(E log V)", space: "O(V)" },
      { id: "SP02", title: "Cheapest Flights Within K Stops", diff: "Medium", tags: ["Bellman-Ford", "BFS"], time: "O(K*E)", space: "O(V)" },
      { id: "SP03", title: "Path With Minimum Effort", diff: "Medium", tags: ["Dijkstra", "Grid"], time: "O(RC log RC)", space: "O(RC)" },
      { id: "SP04", title: "Swim in Rising Water", diff: "Hard", tags: ["Dijkstra", "Binary Search"], time: "O(N^2 log N)", space: "O(N^2)" },
      { id: "SP05", title: "Path with Maximum Minimum Value", diff: "Medium", tags: ["Dijkstra", "Heap"], time: "O(RC log RC)", space: "O(RC)" },
      { id: "SP06", title: "Find the City With Smallest Neighbors", diff: "Medium", tags: ["Floyd-Warshall"], time: "O(V^3)", space: "O(V^2)" },
      { id: "SP07", title: "Minimum Cost to Make Valid Path Grid", diff: "Hard", tags: ["0-1 BFS", "Deque"], time: "O(RC)", space: "O(RC)" },
      { id: "SP08", title: "Shortest Path to Get All Keys", diff: "Hard", tags: ["Bitmask BFS"], time: "O(RC * 2^K)", space: "O(RC * 2^K)" },
      { id: "SP09", title: "Shortest Path Visiting All Nodes", diff: "Hard", tags: ["Bitmask BFS"], time: "O(N * 2^N)", space: "O(N * 2^N)" },
      { id: "SP10", title: "Minimum Cost to Reach Destination in Time", diff: "Hard", tags: ["Dijkstra", "State DP"], time: "O(E * MaxTime)", space: "O(V * MaxTime)" },
      { id: "SP11", title: "Second Minimum Time to Reach Destination", diff: "Hard", tags: ["BFS", "Dijkstra"], time: "O(V + E)", space: "O(V)" },
      { id: "SP12", title: "Number of Ways to Arrive at Destination", diff: "Medium", tags: ["Dijkstra", "DP"], time: "O(E log V)", space: "O(V)" },
      { id: "SP13", title: "Restricted Paths from Source to Dest", diff: "Medium", tags: ["Dijkstra", "DFS"], time: "O(E log V)", space: "O(V+E)" },
      { id: "SP14", title: "Minimum Cost Path with Left-Right Jumps", diff: "Medium", tags: ["Dijkstra"], time: "O(N log N)", space: "O(N)" },
      { id: "SP15", title: "Currency Arbitrage Detection", diff: "Medium", tags: ["Bellman-Ford", "Log Transform"], time: "O(V*E)", space: "O(V)" },
      { id: "SP16", title: "All Pairs Shortest Paths", diff: "Medium", tags: ["Floyd-Warshall"], time: "O(V^3)", space: "O(V^2)" },
      { id: "SP17", title: "Minimum Cost to Connect Points (Dijkstra/Prim)", diff: "Medium", tags: ["MST", "Heap"], time: "O(N^2)", space: "O(N)" },
      { id: "SP18", title: "Cat and Mouse Game II", diff: "Hard", tags: ["Game Theory", "Minimax"], time: "O(States)", space: "O(States)" },
      { id: "SP19", title: "Minimum Weighted Subgraph With Required Paths", diff: "Hard", tags: ["3x Dijkstra"], time: "O(E log V)", space: "O(V+E)" },
      { id: "SP20", title: "Maximum Path Quality of a Graph", diff: "Hard", tags: ["Backtracking Dijkstra"], time: "O(10! + E log V)", space: "O(V)" },
      { id: "SP21", title: "Reachable Nodes In Subdivided Graph", diff: "Hard", tags: ["Dijkstra"], time: "O(E log V)", space: "O(V+E)" },
      { id: "SP22", title: "Shortest Path in Binary Matrix", diff: "Medium", tags: ["8-Direction BFS"], time: "O(N^2)", space: "O(N^2)" },
      { id: "SP23", title: "As Far from Land as Possible", diff: "Medium", tags: ["Multi-source BFS"], time: "O(N^2)", space: "O(N^2)" },
      { id: "SP24", title: "Shortest Distance from All Buildings", diff: "Hard", tags: ["Multi-source BFS"], time: "O(B * RC)", space: "O(RC)" },
      { id: "SP25", title: "Path with Maximum Probability", diff: "Medium", tags: ["Dijkstra (Max Product)"], time: "O(E log V)", space: "O(V+E)" },
      { id: "SP26", title: "Shortest Path in a Grid with Obstacles Elimination", diff: "Hard", tags: ["3D State BFS"], time: "O(RC * K)", space: "O(RC * K)" },
      { id: "SP27", title: "Minimum Cost to Cut a Stick / Graph Hybrid", diff: "Hard", tags: ["Interval DP"], time: "O(M^3)", space: "O(M^2)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 15: Disjoint Set Union (DSU) & Minimum Spanning Tree (MST)
  // --------------------------------------------------------------------------
  {
    id: "15_dsu_mst",
    num: 15,
    name: "Disjoint Set Union (DSU) & Minimum Spanning Tree",
    category: "Graph Theory",
    difficulty: "Medium-Hard",
    badge: "Connected Components & MST",
    shortDesc: "Manage dynamic partitions of elements into disjoint sets in near-constant time O(alpha(N)) with Path Compression and Union by Rank.",
    theory: {
      what: "Disjoint Set Union (DSU) or Union-Find maintains dynamic connectivity between elements. When augmented with Kruskal's algorithm (sorting edges by weight and unioning non-cycle edges), it computes Minimum Spanning Trees (MST) in O(E log E).",
      when: "Dynamic connectivity queries, cycle detection in undirected graphs, spanning forest construction, redundant connection detection, accounts merging, and grid percolation.",
      coreIdea: "1. `find(i)`: recursively traverse parent pointers and flatten tree (`parent[i] = find(parent[i])`).\n2. `unite(i, j)`: attach shallower tree to deeper tree root (`rank` or `size`).",
      edgeCases: "Elements already in same component (cycle detected), disjoint components remaining after all operations, 1-based indexing offsets."
    },
    diagram: `flowchart TD
    Find["find(x) Called"] --> RootCheck{"parent[x] == x?"}
    RootCheck -- Yes --> ReturnRoot["Return x"]
    RootCheck -- No --> Compress["parent[x] = find(parent[x])<br/>(Path Compression)"]
    Compress --> ReturnRoot
    
    Union["unite(x, y) Called"] --> GetRoots["rx = find(x), ry = find(y)"]
    GetRoots --> CheckSame{"rx == ry?"}
    CheckSame -- Yes (Cycle) --> DoneCycle["Already connected (Return false)"]
    CheckSame -- No --> CompareRank{"rank[rx] < rank[ry]?"}
    CompareRank -- Yes --> AttachX["parent[rx] = ry"]
    CompareRank -- No --> AttachY["parent[ry] = rx<br/>If rank equal: rank[rx]++"]
    AttachX --> ReturnTrue["Return true"]
    AttachY --> ReturnTrue`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

// Production Grade Disjoint Set Union with Path Compression & Union by Rank
class DSU {
public:
    vector<int> parent, rank, size;
    int numComponents;

    DSU(int n) : parent(n), rank(n, 0), size(n, 1), numComponents(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path Compression
    }

    bool unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) return false; // Cycle detected

        // Union by Rank
        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
            size[rootJ] += size[rootI];
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        } else {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
            rank[rootI]++;
        }
        numComponents--;
        return true;
    }
};`,
      brute: `// Kruskal's MST Algorithm
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

int kruskalMST(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    int totalWeight = 0, edgesCount = 0;

    for (const auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            totalWeight += e.weight;
            if (++edgesCount == n - 1) break;
        }
    }
    return (edgesCount == n - 1) ? totalWeight : -1;
}`,
      template: `// Prim's Algorithm for MST
int primMST(int n, const vector<vector<pair<int, int>>>& adj) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<bool> inMST(n, false);
    pq.push({0, 0});
    int totalCost = 0;

    while (!pq.empty()) {
        auto [weight, u] = pq.top();
        pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        totalCost += weight;

        for (const auto& [v, w] : adj[u]) {
            if (!inMST[v]) pq.push({w, v});
        }
    }
    return totalCost;
}`
    },
    solutions: [
      {
        title: "Q1. Redundant Connection (Cycle Detection in Graph)",
        diff: "Medium",
        time: "O(N * alpha(N))",
        space: "O(N)",
        intuition: "In a tree with N nodes and N edges, exactly one edge creates a cycle. Iterate through edges and unite vertices with DSU. The first edge whose endpoints already share a common root is the redundant edge.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class DSU {
public:
    vector<int> parent;
    DSU(int n) : parent(n + 1) {
        for (int i = 0; i <= n; ++i) parent[i] = i;
    }
    int find(int i) {
        return parent[i] == i ? i : parent[i] = find(parent[i]);
    }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        parent[rootI] = rootJ;
        return true;
    }
};

vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    DSU dsu(n);
    for (const auto& edge : edges) {
        if (!dsu.unite(edge[0], edge[1])) {
            return edge; // Cycle creating edge
        }
    }
    return {};
}`
      },
      {
        title: "Q2. Min Cost to Connect All Points (Kruskal MST)",
        diff: "Medium",
        time: "O(N^2 log N)",
        space: "O(N^2)",
        intuition: "Construct complete graph where edge weight is Manhattan distance between coordinate pairs. Sort all N*(N-1)/2 edges and greedily unite endpoints using DSU.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& o) const { return weight < o.weight; }
};

int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<Edge> edges;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            int dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]);
            edges.push_back({i, j, dist});
        }
    }
    sort(edges.begin(), edges.end());

    vector<int> parent(n);
    for (int i = 0; i < n; ++i) parent[i] = i;
    auto find = [&](auto self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };

    int totalCost = 0, connected = 0;
    for (const auto& [u, v, w] : edges) {
        int ru = find(find, u), rv = find(find, v);
        if (ru != rv) {
            parent[ru] = rv;
            totalCost += w;
            if (++connected == n - 1) break;
        }
    }
    return totalCost;
}`
      },
      {
        title: "Q3. Number of Operations to Make Network Connected",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V)",
        intuition: "To connect N computers, we need at least N-1 cables. If total cables < n-1, return -1. Count the number of connected components using DSU. Moving cables requires `components - 1` operations.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int makeConnected(int n, vector<vector<int>>& connections) {
    if ((int)connections.size() < n - 1) return -1;

    vector<int> parent(n);
    for (int i = 0; i < n; ++i) parent[i] = i;

    auto find = [&](auto self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };

    int components = n;
    for (const auto& c : connections) {
        int ru = find(find, c[0]), rv = find(find, c[1]);
        if (ru != rv) {
            parent[ru] = rv;
            components--;
        }
    }
    return components - 1;
}`
      },
      {
        title: "Q4. Accounts Merge (String Component Grouping)",
        diff: "Medium",
        time: "O(N * K log(NK))",
        space: "O(NK)",
        intuition: "Map each email to an integer ID and union emails belonging to the same account. Group emails by component root, sort them alphabetically, and attach the account owner's name.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

class DSU {
public:
    vector<int> parent;
    DSU(int n) : parent(n) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        return parent[i] == i ? i : parent[i] = find(parent[i]);
    }
    void unite(int i, int j) {
        parent[find(i)] = find(j);
    }
};

vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    int n = accounts.size();
    DSU dsu(n);
    unordered_map<string, int> emailToAcc;

    for (int i = 0; i < n; ++i) {
        for (size_t j = 1; j < accounts[i].size(); ++j) {
            string email = accounts[i][j];
            if (emailToAcc.count(email)) {
                dsu.unite(i, emailToAcc[email]);
            } else {
                emailToAcc[email] = i;
            }
        }
    }

    unordered_map<int, vector<string>> merged;
    for (const auto& [email, accIdx] : emailToAcc) {
        int root = dsu.find(accIdx);
        merged[root].push_back(email);
    }

    vector<vector<string>> result;
    for (auto& [root, emails] : merged) {
        sort(emails.begin(), emails.end());
        vector<string> entry = {accounts[root][0]};
        entry.insert(entry.end(), emails.begin(), emails.end());
        result.push_back(entry);
    }
    return result;
}`
      },
      {
        title: "Q5. Smallest String With Swaps",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Pairs define an equivalence relation (swaps are transitive). Elements within the same connected component can be rearranged into any permutation. For each component, sort the characters and indices independently.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

string smallestStringWithSwaps(string s, vector<vector<int>>& pairs) {
    int n = s.size();
    vector<int> parent(n);
    for (int i = 0; i < n; ++i) parent[i] = i;

    auto find = [&](auto self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };

    for (const auto& p : pairs) {
        int ru = find(find, p[0]), rv = find(find, p[1]);
        if (ru != rv) parent[ru] = rv;
    }

    unordered_map<int, vector<int>> compIndices;
    unordered_map<int, vector<char>> compChars;

    for (int i = 0; i < n; ++i) {
        int root = find(find, i);
        compIndices[root].push_back(i);
        compChars[root].push_back(s[i]);
    }

    for (auto& [root, chars] : compChars) {
        sort(chars.begin(), chars.end());
        const auto& indices = compIndices[root];
        for (size_t i = 0; i < indices.size(); ++i) {
            s[indices[i]] = chars[i];
        }
    }
    return s;
}`
      },
      {
        title: "Q6. Satisfiability of Equality Equations",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "First pass: process all '==' equations to union variable equivalence classes. Second pass: check all '!=' equations; if two variables evaluate to the same root, the system is unsatisfiable.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool equationsPossible(vector<string>& equations) {
    vector<int> parent(26);
    for (int i = 0; i < 26; ++i) parent[i] = i;

    auto find = [&](auto self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };

    // Union equal variables
    for (const string& eq : equations) {
        if (eq[1] == '=') {
            int u = eq[0] - 'a', v = eq[3] - 'a';
            parent[find(find, u)] = find(find, v);
        }
    }

    // Verify inequality constraints
    for (const string& eq : equations) {
        if (eq[1] == '!') {
            int u = eq[0] - 'a', v = eq[3] - 'a';
            if (find(find, u) == find(find, v)) return false;
        }
    }
    return true;
}`
      },
      {
        title: "Q7. Optimize Water Distribution in a Village (Super Node MST)",
        diff: "Hard",
        time: "O(E log E)",
        space: "O(V + E)",
        intuition: "Introduce a dummy virtual node 0. Building a well at house i with cost W[i] is modeled as an edge between node 0 and node i with weight W[i]. Run Kruskal's MST on all houses + virtual well node.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge {
    int u, v, cost;
    bool operator<(const Edge& o) const { return cost < o.cost; }
};

int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
    vector<Edge> edges;
    for (int i = 1; i <= n; ++i) {
        edges.push_back({0, i, wells[i - 1]}); // Virtual well edge
    }
    for (const auto& p : pipes) {
        edges.push_back({p[0], p[1], p[2]});
    }

    sort(edges.begin(), edges.end());

    vector<int> parent(n + 1);
    for (int i = 0; i <= n; ++i) parent[i] = i;

    auto find = [&](auto self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };

    int totalCost = 0, count = 0;
    for (const auto& [u, v, cost] : edges) {
        int ru = find(find, u), rv = find(find, v);
        if (ru != rv) {
            parent[ru] = rv;
            totalCost += cost;
            if (++count == n) break; // Connected all n houses + root 0
        }
    }
    return totalCost;
}`
      }
    ],
    problems: [
      { id: "DSU01", title: "Redundant Connection", diff: "Medium", tags: ["DSU", "Cycle"], time: "O(N alpha(N))", space: "O(N)" },
      { id: "DSU02", title: "Min Cost to Connect All Points", diff: "Medium", tags: ["MST", "Kruskal"], time: "O(N^2 log N)", space: "O(N^2)" },
      { id: "DSU03", title: "Number of Operations to Make Network Connected", diff: "Medium", tags: ["DSU"], time: "O(N)", space: "O(N)" },
      { id: "DSU04", title: "Accounts Merge", diff: "Medium", tags: ["DSU", "Hash"], time: "O(NK log NK)", space: "O(NK)" },
      { id: "DSU05", title: "Smallest String With Swaps", diff: "Medium", tags: ["DSU", "Sort"], time: "O(N log N)", space: "O(N)" },
      { id: "DSU06", title: "Satisfiability of Equality Equations", diff: "Medium", tags: ["DSU"], time: "O(N)", space: "O(1)" },
      { id: "DSU07", title: "Optimize Water Distribution in Village", diff: "Hard", tags: ["MST", "Super Node"], time: "O(E log E)", space: "O(V+E)" },
      { id: "DSU08", title: "Number of Provinces", diff: "Easy", tags: ["DSU", "Components"], time: "O(N^2)", space: "O(N)" },
      { id: "DSU09", title: "Earliest Moment When Everyone Become Friends", diff: "Medium", tags: ["DSU", "Sort"], time: "O(M log M)", space: "O(N)" },
      { id: "DSU10", title: "Graph Valid Tree", diff: "Medium", tags: ["DSU", "Tree"], time: "O(V+E)", space: "O(V)" },
      { id: "DSU11", title: "Number of Connected Components in Graph", diff: "Medium", tags: ["DSU"], time: "O(V+E)", space: "O(V)" },
      { id: "DSU12", title: "Similar String Groups", diff: "Hard", tags: ["DSU", "Strings"], time: "O(N^2 * L)", space: "O(N)" },
      { id: "DSU13", title: "Evaluate Division", diff: "Medium", tags: ["Weighted DSU"], time: "O(Q * alpha(N))", space: "O(N)" },
      { id: "DSU14", title: "Lexicographically Smallest Equivalent String", diff: "Medium", tags: ["DSU"], time: "O(N)", space: "O(1)" },
      { id: "DSU15", title: "Couples Holding Hands", diff: "Hard", tags: ["DSU", "Greedy"], time: "O(N)", space: "O(N)" },
      { id: "DSU16", title: "Checking Existence of Edge Length Limited Paths", diff: "Hard", tags: ["Offline DSU", "Sort"], time: "O((E+Q) log(E+Q))", space: "O(V)" },
      { id: "DSU17", title: "Swim in Rising Water (DSU Online)", diff: "Hard", tags: ["DSU Grid"], time: "O(N^2 alpha(N^2))", space: "O(N^2)" },
      { id: "DSU18", title: "Remove Max Number of Edges to Keep Graph Traversible", diff: "Hard", tags: ["Dual DSU"], time: "O(E alpha(V))", space: "O(V)" },
      { id: "DSU19", title: "Bricks Falling When Hit", diff: "Hard", tags: ["Reverse DSU"], time: "O(RC alpha(RC))", space: "O(RC)" },
      { id: "DSU20", title: "Find Critical and Pseudo-Critical Edges in MST", diff: "Hard", tags: ["Kruskal MST"], time: "O(E^2 alpha(V))", space: "O(V+E)" },
      { id: "DSU21", title: "Process Restricted Friend Requests", diff: "Hard", tags: ["DSU"], time: "O(Req * Rest)", space: "O(N)" },
      { id: "DSU22", title: "Number of Islands II (Dynamic DSU)", diff: "Hard", tags: ["Dynamic DSU"], time: "O(K alpha(RC))", space: "O(RC)" },
      { id: "DSU23", title: "Making A Large Island", diff: "Hard", tags: ["Component Size"], time: "O(N^2)", space: "O(N^2)" },
      { id: "DSU24", title: "Regions Cut By Slashes", diff: "Medium", tags: ["Grid Triangles DSU"], time: "O(N^2)", space: "O(N^2)" },
      { id: "DSU25", title: "GCD Sort of an Array", diff: "Hard", tags: ["Sieve + DSU"], time: "O(N sqrt(MAX))", space: "O(MAX)" },
      { id: "DSU26", title: "Count Unreachable Pairs of Nodes in Undirected Graph", diff: "Medium", tags: ["DSU Counting"], time: "O(V+E)", space: "O(V)" },
      { id: "DSU27", title: "Largest Component Size by Common Factor", diff: "Hard", tags: ["DSU Prime Factors"], time: "O(N sqrt(MAX))", space: "O(MAX)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 16: DP - 0/1 & Unbounded Knapsack
  // --------------------------------------------------------------------------
  {
    id: "16_knapsack_dp",
    num: 16,
    name: "DP - 0/1 & Unbounded Knapsack",
    category: "Dynamic Programming",
    difficulty: "Medium-Hard",
    badge: "Item Selection & Subsets",
    shortDesc: "Optimize item selection within capacity constraints where each item can be chosen at most once (0/1) or infinitely many times (Unbounded).",
    theory: {
      what: "A core dynamic programming framework where state `dp[w]` represents optimal value or reachable state for capacity `w`. In 0/1 Knapsack, the capacity loop runs backwards (from W down to weight) to prevent reusing the same item. In Unbounded Knapsack, the capacity loop runs forwards (from weight up to W) allowing repeated item pick.",
      when: "Partition equal subset sum, coin change, target sum (+/- signs), rod cutting, bounded knapsack, combination sum IV.",
      coreIdea: "0/1 Knapsack recurrence: `dp[w] = max(dp[w], dp[w - weight[i]] + value[i])` (iterated backwards).\nUnbounded recurrence: `dp[w] = max(dp[w], dp[w - weight[i]] + value[i])` (iterated forwards).",
      edgeCases: "Capacity 0 (result is 0 or 1 depending on problem), item weights larger than max capacity, target sum not divisible by 2 for equal partition."
    },
    diagram: `flowchart TD
    Start["Item with weight W, value V"] --> CheckType{"0/1 or Unbounded?"}
    CheckType -- 0/1 (At Most Once) --> Loop01["Loop capacity cap = Target DOWN TO weight:"]
    Loop01 --> Trans01["dp[cap] = max(dp[cap], dp[cap - weight] + value)"]
    Trans01 --> Loop01
    CheckType -- Unbounded (Unlimited) --> LoopUnb["Loop capacity cap = weight UP TO Target:"]
    LoopUnb --> TransUnb["dp[cap] = max(dp[cap], dp[cap - weight] + value)"]
    TransUnb --> LoopUnb`,
    visualizerType: "sliding_window",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

// 0/1 Knapsack with 1D Space Optimization: O(N * W) time, O(W) space
int knapsack01(int W, const vector<int>& weights, const vector<int>& values) {
    int n = weights.size();
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; ++i) {
        // Traverse backwards to avoid using the same item multiple times
        for (int w = W; w >= weights[i]; --w) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}`,
      brute: `// Unbounded Knapsack: O(N * W) time, O(W) space
int unboundedKnapsack(int W, const vector<int>& weights, const vector<int>& values) {
    int n = weights.size();
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; ++i) {
        // Traverse forwards to allow unlimited item reuse
        for (int w = weights[i]; w <= W; ++w) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}`,
      template: `// Partition Equal Subset Sum Template
bool canPartition(const vector<int>& nums) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % 2 != 0) return false;
    int target = sum / 2;

    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int num : nums) {
        for (int w = target; w >= num; --w) {
            dp[w] = dp[w] || dp[w - num];
        }
    }
    return dp[target];
}`
    },
    solutions: [
      {
        title: "Q1. Partition Equal Subset Sum (0/1 Knapsack Boolean)",
        diff: "Medium",
        time: "O(N * Target)",
        space: "O(Target)",
        intuition: "Problem reduces to finding if a subset of elements sums to `TotalSum / 2`. Use a 1D boolean array iterating backwards from `target` down to `num`.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 != 0) return false;
    int target = total / 2;

    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int num : nums) {
        for (int w = target; w >= num; --w) {
            if (dp[w - num]) dp[w] = true;
        }
    }
    return dp[target];
}`
      },
      {
        title: "Q2. Coin Change (Unbounded Minimum Selection)",
        diff: "Medium",
        time: "O(Amount * Coins)",
        space: "O(Amount)",
        intuition: "Each coin has infinite supply. `dp[w]` stores minimum coins to make amount `w`. Iterate forwards from coin face value up to target amount.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, 1e9);
    dp[0] = 0;

    for (int coin : coins) {
        for (int w = coin; w <= amount; ++w) {
            if (dp[w - coin] != 1e9) {
                dp[w] = min(dp[w], dp[w - coin] + 1);
            }
        }
    }
    return dp[amount] == 1e9 ? -1 : dp[amount];
}`
      },
      {
        title: "Q3. Coin Change II (Unbounded Combinations Count)",
        diff: "Medium",
        time: "O(Amount * Coins)",
        space: "O(Amount)",
        intuition: "Outer loop iterates over coins and inner loop iterates forwards over amounts. This strictly counts order-independent combinations rather than permutations.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int change(int amount, vector<int>& coins) {
    vector<unsigned int> dp(amount + 1, 0);
    dp[0] = 1;

    for (int coin : coins) {
        for (int w = coin; w <= amount; ++w) {
            dp[w] += dp[w - coin];
        }
    }
    return dp[amount];
}`
      },
      {
        title: "Q4. Target Sum (0/1 Subset Sum Transformation)",
        diff: "Medium",
        time: "O(N * Target)",
        space: "O(Target)",
        intuition: "Partition array into positive subset P and negative subset N. P - N = target and P + N = sum => P = (target + sum) / 2. Count subsets with sum equal to P.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>
#include <cmath>

using namespace std;

int findTargetSumWays(vector<int>& nums, int target) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if ((sum + target) % 2 != 0 || abs(target) > sum) return 0;
    int subsetTarget = (sum + target) / 2;

    vector<int> dp(subsetTarget + 1, 0);
    dp[0] = 1;

    for (int num : nums) {
        for (int w = subsetTarget; w >= num; --w) {
            dp[w] += dp[w - num];
        }
    }
    return dp[subsetTarget];
}`
      },
      {
        title: "Q5. Ones and Zeroes (2D Capacity 0/1 Knapsack)",
        diff: "Medium",
        time: "O(Len * M * N)",
        space: "O(M * N)",
        intuition: "Each string has two costs: zero count and one count. Maintain a 2D DP table `dp[i][j]` representing max subset size formed using at most i zeros and j ones, iterating both dimensions backwards.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int findMaxForm(vector<string>& strs, int m, int n) {
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (const string& s : strs) {
        int zeros = count(s.begin(), s.end(), '0');
        int ones = s.size() - zeros;

        for (int i = m; i >= zeros; --i) {
            for (int j = n; j >= ones; --j) {
                dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1);
            }
        }
    }
    return dp[m][n];
}`
      },
      {
        title: "Q6. Last Stone Weight II (Minimum Subset Difference)",
        diff: "Medium",
        time: "O(N * Sum)",
        space: "O(Sum)",
        intuition: "Smashing stones reduces to finding two subsets of stones with minimal difference in their sums. Find the maximum subset sum <= totalSum / 2.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

int lastStoneWeightII(vector<int>& stones) {
    int total = accumulate(stones.begin(), stones.end(), 0);
    int target = total / 2;

    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int s : stones) {
        for (int w = target; w >= s; --w) {
            if (dp[w - s]) dp[w] = true;
        }
    }

    for (int w = target; w >= 0; --w) {
        if (dp[w]) {
            return total - 2 * w;
        }
    }
    return 0;
}`
      },
      {
        title: "Q7. Profitable Schemes (Bounded 2D Knapsack with Profit Floor)",
        diff: "Hard",
        time: "O(N * G * P)",
        space: "O(G * P)",
        intuition: "Knapsack with crime group size (capacity G) and minProfit threshold. `dp[i][j]` tracks ways with `i` members and at least `j` profit. When calculating profit, cap at `minProfit` (`min(minProfit, j + p)`).",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

const int MOD = 1e9 + 7;

int profitableSchemes(int n, int minProfit, vector<int>& group, vector<int>& profit) {
    int m = group.size();
    vector<vector<int>> dp(n + 1, vector<int>(minProfit + 1, 0));
    dp[0][0] = 1;

    for (int k = 0; k < m; ++k) {
        int members = group[k];
        int p = profit[k];

        for (int i = n; i >= members; --i) {
            for (int j = minProfit; j >= 0; --j) {
                int nextP = min(minProfit, j + p);
                dp[i][nextP] = (dp[i][nextP] + dp[i - members][j]) % MOD;
            }
        }
    }

    int total = 0;
    for (int i = 0; i <= n; ++i) {
        total = (total + dp[i][minProfit]) % MOD;
    }
    return total;
}`
      }
    ],
    problems: [
      { id: "KP01", title: "Partition Equal Subset Sum", diff: "Medium", tags: ["0/1 Knapsack"], time: "O(N*Sum)", space: "O(Sum)" },
      { id: "KP02", title: "Coin Change", diff: "Medium", tags: ["Unbounded Knapsack"], time: "O(N*Amt)", space: "O(Amt)" },
      { id: "KP03", title: "Coin Change II", diff: "Medium", tags: ["Unbounded Knapsack"], time: "O(N*Amt)", space: "O(Amt)" },
      { id: "KP04", title: "Target Sum", diff: "Medium", tags: ["0/1 Knapsack"], time: "O(N*Sum)", space: "O(Sum)" },
      { id: "KP05", title: "Ones and Zeroes", diff: "Medium", tags: ["2D Knapsack"], time: "O(L*M*N)", space: "O(MN)" },
      { id: "KP06", title: "Last Stone Weight II", diff: "Medium", tags: ["0/1 Knapsack"], time: "O(N*Sum)", space: "O(Sum)" },
      { id: "KP07", title: "Profitable Schemes", diff: "Hard", tags: ["Bounded Knapsack"], time: "O(N*G*P)", space: "O(GP)" },
      { id: "KP08", title: "Combination Sum IV", diff: "Medium", tags: ["Permutation DP"], time: "O(Target*N)", space: "O(Target)" },
      { id: "KP09", title: "Perfect Squares", diff: "Medium", tags: ["Unbounded Knapsack"], time: "O(N sqrt N)", space: "O(N)" },
      { id: "KP10", title: "Integer Break", diff: "Medium", tags: ["Unbounded Knapsack"], time: "O(N^2)", space: "O(N)" },
      { id: "KP11", title: "Shopping Offers", diff: "Medium", tags: ["Multi-dimension Knapsack"], time: "O(Offers * 6^N)", space: "O(6^N)" },
      { id: "KP12", title: "Tallest Billboard", diff: "Hard", tags: ["Difference Knapsack"], time: "O(N*Sum)", space: "O(Sum)" },
      { id: "KP13", title: "Partition to K Equal Sum Subsets", diff: "Medium", tags: ["Backtracking", "Bitmask"], time: "O(K * 2^N)", space: "O(2^N)" },
      { id: "KP14", title: "Fair Distribution of Cookies", diff: "Medium", tags: ["Bitmask Knapsack"], time: "O(K * 3^N)", space: "O(2^N)" },
      { id: "KP15", title: "Form Largest Integer With Digits That Add to Target", diff: "Hard", tags: ["Unbounded DP"], time: "O(9*Target)", space: "O(Target)" },
      { id: "KP16", title: "Minimum Cost For Tickets", diff: "Medium", tags: ["1D DP"], time: "O(365)", space: "O(365)" },
      { id: "KP17", title: "Greatest Sum Divisible by Three", diff: "Medium", tags: ["Modulo Knapsack"], time: "O(N)", space: "O(1)" },
      { id: "KP18", title: "Maximum Value of K Coins From Piles", diff: "Hard", tags: ["Prefix Sum + Knapsack"], time: "O(K * TotalCoins)", space: "O(K)" },
      { id: "KP19", title: "Tossing Strange Coins", diff: "Medium", tags: ["Probability DP"], time: "O(N*Target)", space: "O(Target)" },
      { id: "KP20", title: "Number of Dice Rolls With Target Sum", diff: "Medium", tags: ["Bounded DP"], time: "O(D*Target*F)", space: "O(Target)" },
      { id: "KP21", title: "Ways to Express an Integer as Sum of Powers", diff: "Medium", tags: ["0/1 Knapsack"], time: "O(N * N^(1/x))", space: "O(N)" },
      { id: "KP22", title: "Champagne Tower", diff: "Medium", tags: ["Simulation DP"], time: "O(R^2)", space: "O(R^2)" },
      { id: "KP23", title: "House Robber III", diff: "Medium", tags: ["Tree DP"], time: "O(N)", space: "O(H)" },
      { id: "KP24", title: "Maximum Profit in Job Scheduling", diff: "Hard", tags: ["Binary Search + DP"], time: "O(N log N)", space: "O(N)" },
      { id: "KP25", title: "Find the Maximum Achievable Threshold", diff: "Medium", tags: ["Knapsack"], time: "O(N)", space: "O(1)" },
      { id: "KP26", title: "Minimum Swaps To Make Sequences Increasing", diff: "Hard", tags: ["State DP"], time: "O(N)", space: "O(1)" },
      { id: "KP27", title: "Constrained Subsequence Sum", diff: "Hard", tags: ["Monotonic Deque DP"], time: "O(N)", space: "O(K)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 17: DP - LCS & String Sequences
  // --------------------------------------------------------------------------
  {
    id: "17_lcs_strings",
    num: 17,
    name: "DP - Longest Common Subsequence & Edit Distance",
    category: "Dynamic Programming",
    difficulty: "Medium-Hard",
    badge: "String Alignment & Matching",
    shortDesc: "Compute optimal sequence alignment, character conversions, insertions, and deletions across two strings.",
    theory: {
      what: "A 2D DP matrix where `dp[i][j]` relates prefix `s1[0..i-1]` with `s2[0..j-1]`. If `s1[i-1] == s2[j-1]`, match character (`dp[i-1][j-1] + 1`). Otherwise, take best sub-problem transition (insert, delete, replace).",
      when: "Longest common subsequence, edit distance (Levenshtein), regex / wildcard matching, palindrome partitioning, shortest common supersequence, distinct subsequences.",
      coreIdea: "LCS Recurrence:\n`if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1`\n`else dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.\nSpace can be reduced from O(M*N) to O(min(M, N)) with two rolling rows.",
      edgeCases: "Empty strings, identical strings, completely disjoint character sets, single character strings."
    },
    diagram: `flowchart TD
    Start["Examine s1[i-1] and s2[j-1]"] --> Match{"s1[i-1] == s2[j-1]?"}
    Match -- Yes --> Diag["dp[i][j] = 1 + dp[i-1][j-1]<br/>(Match diagonal)"]
    Match -- No --> Branch["Take best non-matching transition:"]
    Branch --> Choice["max(dp[i-1][j], dp[i][j-1])<br/>or min(insert, delete, replace)"]`,
    visualizerType: "sliding_window",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Longest Common Subsequence: O(M * N) time, O(N) space
int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<int> prev(n + 1, 0), curr(n + 1, 0);

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) {
                curr[j] = 1 + prev[j - 1];
            } else {
                curr[j] = max(prev[j], curr[j - 1]);
            }
        }
        prev = curr;
    }
    return prev[n];
}`,
      brute: `// Edit Distance (Levenshtein Distance): O(M * N) time, O(M * N) space
int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 0; i <= m; ++i) dp[i][0] = i;
    for (int j = 0; j <= n; ++j) dp[0][j] = j;

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j],      // Delete
                                    dp[i][j - 1],      // Insert
                                    dp[i - 1][j - 1]});// Replace
            }
        }
    }
    return dp[m][n];
}`,
      template: `// Distinct Subsequences Template (s containing t as subsequence)
int numDistinct(string s, string t) {
    int m = s.size(), n = t.size();
    vector<unsigned long long> dp(n + 1, 0);
    dp[0] = 1;

    for (int i = 1; i <= m; ++i) {
        for (int j = n; j >= 1; --j) {
            if (s[i - 1] == t[j - 1]) {
                dp[j] += dp[j - 1];
            }
        }
    }
    return dp[n];
}`
    },
    solutions: [
      {
        title: "Q1. Longest Common Subsequence",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(min(M, N))",
        intuition: "If characters at current prefix match, we extend the LCS of both previous prefixes. Otherwise, take the maximum from excluding either character.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<int> dp(n + 1, 0);

    for (int i = 1; i <= m; ++i) {
        int prevDiag = 0;
        for (int j = 1; j <= n; ++j) {
            int temp = dp[j];
            if (text1[i - 1] == text2[j - 1]) {
                dp[j] = 1 + prevDiag;
            } else {
                dp[j] = max(dp[j], dp[j - 1]);
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`
      },
      {
        title: "Q2. Edit Distance (Levenshtein Distance)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "Operations: Insert (left), Delete (top), Replace (diagonal). Compute minimum edit steps to convert word1 into word2.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<int> dp(n + 1);
    for (int j = 0; j <= n; ++j) dp[j] = j;

    for (int i = 1; i <= m; ++i) {
        int prevDiag = dp[0];
        dp[0] = i;
        for (int j = 1; j <= n; ++j) {
            int temp = dp[j];
            if (word1[i - 1] == word2[j - 1]) {
                dp[j] = prevDiag;
            } else {
                dp[j] = 1 + min({dp[j], dp[j - 1], prevDiag});
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`
      },
      {
        title: "Q3. Wildcard Matching ('?' and '*')",
        diff: "Hard",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "'?' matches any single char, '*' matches empty sequence or sequence of any length. `*` transition: `dp[i][j] = dp[i-1][j] || dp[i][j-1]`.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<bool> dp(n + 1, false);
    dp[0] = true;

    for (int j = 1; j <= n; ++j) {
        if (p[j - 1] == '*') dp[j] = dp[j - 1];
    }

    for (int i = 1; i <= m; ++i) {
        bool prevDiag = dp[0];
        dp[0] = false;
        for (int j = 1; j <= n; ++j) {
            bool temp = dp[j];
            if (p[j - 1] == '*') {
                dp[j] = dp[j] || dp[j - 1];
            } else if (p[j - 1] == '?' || s[i - 1] == p[j - 1]) {
                dp[j] = prevDiag;
            } else {
                dp[j] = false;
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`
      },
      {
        title: "Q4. Regular Expression Matching ('.' and '*')",
        diff: "Hard",
        time: "O(M * N)",
        space: "O(M * N)",
        intuition: "'*' in regex matches zero or more preceding elements. If `p[j-1] == '*'`, we either ignore pattern element (`dp[i][j-2]`) or match if preceding char matches `s[i-1]` (`dp[i-1][j]`).",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
    dp[0][0] = true;

    for (int j = 2; j <= n; j += 2) {
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
    }

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (p[j - 1] == '*') {
                dp[i][j] = dp[i][j - 2]; // Zero occurrences
                if (p[j - 2] == '.' || p[j - 2] == s[i - 1]) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j]; // One or more occurrences
                }
            } else if (p[j - 1] == '.' || p[j - 1] == s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    }
    return dp[m][n];
}`
      },
      {
        title: "Q5. Shortest Common Supersequence",
        diff: "Hard",
        time: "O(M * N)",
        space: "O(M * N)",
        intuition: "First compute the LCS matrix. Then backtrack from `(m, n)` to `(0, 0)`: when characters match, include once; otherwise include the character from string whose state was chosen in max transition.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

string shortestCommonSupersequence(string str1, string str2) {
    int m = str1.size(), n = str2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (str1[i - 1] == str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    string res = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] == str2[j - 1]) {
            res += str1[i - 1];
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            res += str1[i - 1];
            i--;
        } else {
            res += str2[j - 1];
            j--;
        }
    }
    while (i > 0) res += str1[--i];
    while (j > 0) res += str2[--j];

    reverse(res.begin(), res.end());
    return res;
}`
      },
      {
        title: "Q6. Distinct Subsequences",
        diff: "Hard",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "Count occurrences of `t` as subsequence in `s`. If `s[i-1] == t[j-1]`, we can either include or exclude `s[i-1]` (`dp[j] += dp[j-1]`).",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int numDistinct(string s, string t) {
    int m = s.size(), n = t.size();
    vector<unsigned long long> dp(n + 1, 0);
    dp[0] = 1;

    for (int i = 1; i <= m; ++i) {
        for (int j = n; j >= 1; --j) {
            if (s[i - 1] == t[j - 1]) {
                dp[j] += dp[j - 1];
            }
        }
    }
    return dp[n];
}`
      },
      {
        title: "Q7. Longest Palindromic Subsequence",
        diff: "Medium",
        time: "O(N^2)",
        space: "O(N)",
        intuition: "The longest palindromic subsequence of string `s` is equivalent to the Longest Common Subsequence of `s` and `reverse(s)`.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int longestPalindromeSubseq(string s) {
    string r = s;
    reverse(r.begin(), r.end());
    int n = s.size();
    vector<int> dp(n + 1, 0);

    for (int i = 1; i <= n; ++i) {
        int prevDiag = 0;
        for (int j = 1; j <= n; ++j) {
            int temp = dp[j];
            if (s[i - 1] == r[j - 1]) {
                dp[j] = 1 + prevDiag;
            } else {
                dp[j] = max(dp[j], dp[j - 1]);
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`
      }
    ],
    problems: [
      { id: "LCS01", title: "Longest Common Subsequence", diff: "Medium", tags: ["2D DP"], time: "O(MN)", space: "O(N)" },
      { id: "LCS02", title: "Edit Distance", diff: "Medium", tags: ["Levenshtein DP"], time: "O(MN)", space: "O(N)" },
      { id: "LCS03", title: "Wildcard Matching", diff: "Hard", tags: ["Pattern DP"], time: "O(MN)", space: "O(N)" },
      { id: "LCS04", title: "Regular Expression Matching", diff: "Hard", tags: ["Regex DP"], time: "O(MN)", space: "O(MN)" },
      { id: "LCS05", title: "Shortest Common Supersequence", diff: "Hard", tags: ["LCS Backtracking"], time: "O(MN)", space: "O(MN)" },
      { id: "LCS06", title: "Distinct Subsequences", diff: "Hard", tags: ["1D DP"], time: "O(MN)", space: "O(N)" },
      { id: "LCS07", title: "Longest Palindromic Subsequence", diff: "Medium", tags: ["LCS Reverse"], time: "O(N^2)", space: "O(N)" },
      { id: "LCS08", title: "Minimum Insertion Steps to Make a String Palindrome", diff: "Medium", tags: ["LPS DP"], time: "O(N^2)", space: "O(N)" },
      { id: "LCS09", title: "Delete Operation for Two Strings", diff: "Medium", tags: ["LCS"], time: "O(MN)", space: "O(N)" },
      { id: "LCS10", title: "Interleaving String", diff: "Medium", tags: ["2D DP"], time: "O(MN)", space: "O(N)" },
      { id: "LCS11", title: "Uncrossed Lines", diff: "Medium", tags: ["LCS Variant"], time: "O(MN)", space: "O(N)" },
      { id: "LCS12", title: "Max Dot Product of Two Subsequences", diff: "Hard", tags: ["DP Sequence"], time: "O(MN)", space: "O(N)" },
      { id: "LCS13", title: "Minimum ASCII Delete Sum for Two Strings", diff: "Medium", tags: ["Weighted LCS"], time: "O(MN)", space: "O(N)" },
      { id: "LCS14", title: "Palindromic Substrings (Count)", diff: "Medium", tags: ["Center Expansion"], time: "O(N^2)", space: "O(1)" },
      { id: "LCS15", title: "Palindrome Partitioning II", diff: "Hard", tags: ["1D DP + Palindrome"], time: "O(N^2)", space: "O(N^2)" },
      { id: "LCS16", title: "Count Different Palindromic Subsequences", diff: "Hard", tags: ["Interval DP"], time: "O(N^2)", space: "O(N^2)" },
      { id: "LCS17", title: "Scramble String", diff: "Hard", tags: ["3D Memo DP"], time: "O(N^4)", space: "O(N^3)" },
      { id: "LCS18", title: "Word Break II", diff: "Hard", tags: ["Memoized DFS"], time: "O(2^N)", space: "O(2^N)" },
      { id: "LCS19", title: "Concatenated Words", diff: "Hard", tags: ["Trie / Word Break"], time: "O(N * L^2)", space: "O(N*L)" },
      { id: "LCS20", title: "Number of Music Playlists", diff: "Hard", tags: ["Combinatorics DP"], time: "O(Goal * N)", space: "O(N)" },
      { id: "LCS21", title: "Distinct Subsequences II", diff: "Hard", tags: ["Last Occurrence DP"], time: "O(N)", space: "O(1)" },
      { id: "LCS22", title: "Longest String Chain", diff: "Medium", tags: ["Hash Map DP"], time: "O(N * L^2)", space: "O(N)" },
      { id: "LCS23", title: "String Compression II", diff: "Hard", tags: ["Run-length DP"], time: "O(N^2 * K)", space: "O(NK)" },
      { id: "LCS24", title: "Form Largest Integer With Digits", diff: "Hard", tags: ["Unbounded DP"], time: "O(9*Target)", space: "O(Target)" },
      { id: "LCS25", title: "Restore The Array", diff: "Hard", tags: ["BigInt DP"], time: "O(N log K)", space: "O(N)" },
      { id: "LCS26", title: "Minimum Cost to Cut a Stick", diff: "Hard", tags: ["Interval DP"], time: "O(M^3)", space: "O(M^2)" },
      { id: "LCS27", title: "Maximum Deletions on a String", diff: "Hard", tags: ["LCP + DP"], time: "O(N^2)", space: "O(N^2)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 18: DP - Longest Increasing Subsequence (LIS)
  // --------------------------------------------------------------------------
  {
    id: "18_lis_patience",
    num: 18,
    name: "DP - Longest Increasing Subsequence & Patience Sorting",
    category: "Dynamic Programming",
    difficulty: "Medium-Hard",
    badge: "Binary Search + DP",
    shortDesc: "Find optimal strictly increasing or non-decreasing subsequences in O(N log N) using Patience Sorting / Binary Search (std::lower_bound).",
    theory: {
      what: "Classic LIS DP is O(N^2) (`dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i]`). With Patience Sorting, maintain an array `tails` where `tails[len]` holds the minimum ending value of an increasing subsequence of length `len+1`. Binary search (`std::lower_bound`) updates `tails` in O(N log N).",
      when: "LIS, Russian Doll Envelopes, Longest Substring in Order, Largest Divisible Subset, Building Bridges, Box Stacking.",
      coreIdea: "For each `x`: binary search `tails` for first element `>= x`. If found, replace it with `x` (lowering the threshold for future elements). If `x` is larger than all elements, append `x` to `tails`.",
      edgeCases: "Duplicates (use `lower_bound` for strictly increasing, `upper_bound` for non-decreasing), strictly decreasing array (LIS length = 1)."
    },
    diagram: `flowchart TD
    Start["For each element x in nums:"] --> BS["Binary Search in 'tails' for first element >= x<br/>(std::lower_bound)"]
    BS --> Found{"Found index it in tails?"}
    Found -- "No (x > all tails)" --> Append["tails.push_back(x)<br/>(Extends LIS length)"]
    Found -- "Yes (it != tails.end())" --> Replace["*it = x<br/>(Greedily lowers tail value)"]
    Append --> Next["Next element"]
    Replace --> Next`,
    visualizerType: "binary_search",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Patience Sorting O(N log N) time, O(N) space
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;

    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }
    return tails.size();
}`,
      brute: `// Classic O(N^2) Dynamic Programming
int lengthOfLIS_DP(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int maxLen = 1;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }
    return maxLen;
}`,
      template: `// Russian Doll Envelopes (2D LIS)
int maxEnvelopes(vector<vector<int>>& envelopes) {
    // Sort width ascending; on tie sort height descending
    sort(envelopes.begin(), envelopes.end(), [](const auto& a, const auto& b) {
        return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];
    });

    vector<int> tails;
    for (const auto& env : envelopes) {
        int h = env[1];
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else *it = h;
    }
    return tails.size();
}`
    },
    solutions: [
      {
        title: "Q1. Longest Increasing Subsequence (Patience Sorting)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Maintain sorted array `tails` storing minimum tail value for every subsequence length. Use `lower_bound` to find where current element fits.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`
      },
      {
        title: "Q2. Russian Doll Envelopes (2D Sort + 1D LIS)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Sort envelopes by width ascending. For identical widths, sort height descending (so identical widths cannot be nested inside each other). Then run 1D LIS on heights.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int maxEnvelopes(vector<vector<int>>& envs) {
    sort(envs.begin(), envs.end(), [](const auto& a, const auto& b) {
        return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];
    });

    vector<int> tails;
    for (const auto& e : envs) {
        int h = e[1];
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else *it = h;
    }
    return tails.size();
}`
      },
      {
        title: "Q3. Number of Longest Increasing Subsequences",
        diff: "Medium",
        time: "O(N^2)",
        space: "O(N)",
        intuition: "Maintain two arrays: `lengths[i]` and `counts[i]`. When extending from `j`, if `lengths[j] + 1 > lengths[i]`, update length and reset count. If equal, add `counts[j]` to `counts[i]`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int findNumberOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> len(n, 1), count(n, 1);
    int maxLen = 1;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                if (len[j] + 1 > len[i]) {
                    len[i] = len[j] + 1;
                    count[i] = count[j];
                } else if (len[j] + 1 == len[i]) {
                    count[i] += count[j];
                }
            }
        }
        maxLen = max(maxLen, len[i]);
    }

    int result = 0;
    for (int i = 0; i < n; ++i) {
        if (len[i] == maxLen) result += count[i];
    }
    return result;
}`
      },
      {
        title: "Q4. Largest Divisible Subset",
        diff: "Medium",
        time: "O(N^2)",
        space: "O(N)",
        intuition: "Sort numbers ascending. If `nums[i] % nums[j] == 0`, then `nums[i]` is divisible by all numbers in `nums[j]`'s subset. Maintain `parent` pointers to reconstruct the subset.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> largestDivisibleSubset(vector<int>& nums) {
    int n = nums.size();
    sort(nums.begin(), nums.end());

    vector<int> dp(n, 1), parent(n, -1);
    int maxIdx = 0;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[i] % nums[j] == 0 && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
        }
        if (dp[i] > dp[maxIdx]) maxIdx = i;
    }

    vector<int> res;
    for (int curr = maxIdx; curr != -1; curr = parent[curr]) {
        res.push_back(nums[curr]);
    }
    reverse(res.begin(), res.end());
    return res;
}`
      },
      {
        title: "Q5. Maximum Length of Pair Chain",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(1)",
        intuition: "Greedy interval scheduling / LIS on pairs: sort pairs by ending time ascending. Greedily pick the pair that ends earliest and starts strictly after previous pair's end.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int findLongestChain(vector<vector<int>>& pairs) {
    sort(pairs.begin(), pairs.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });

    int count = 0, currEnd = -2e9;
    for (const auto& p : pairs) {
        if (p[0] > currEnd) {
            count++;
            currEnd = p[1];
        }
    }
    return count;
}`
      },
      {
        title: "Q6. Longest Mountain in Array (Bi-directional LIS)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Identify peak elements where `arr[i-1] < arr[i] > arr[i+1]`. Expand left and right to compute mountain length in single pass.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int longestMountain(vector<int>& arr) {
    int n = arr.size(), maxLen = 0;
    for (int i = 1; i < n - 1; ++i) {
        if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
            int left = i, right = i;
            while (left > 0 && arr[left] > arr[left - 1]) left--;
            while (right < n - 1 && arr[right] > arr[right + 1]) right++;
            maxLen = max(maxLen, right - left + 1);
        }
    }
    return maxLen;
}`
      },
      {
        title: "Q7. Minimum Number of Removals to Make Mountain Array",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Compute LIS from left to right (`leftLIS[i]`) and LIS from right to left (`rightLIS[i]`). Valid peak has `leftLIS[i] > 1` and `rightLIS[i] > 1`. Max mountain length is `leftLIS[i] + rightLIS[i] - 1`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int minimumMountainRemovals(vector<int>& nums) {
    int n = nums.size();
    vector<int> left(n, 1), right(n, 1);

    vector<int> tails;
    for (int i = 0; i < n; ++i) {
        auto it = lower_bound(tails.begin(), tails.end(), nums[i]);
        if (it == tails.end()) tails.push_back(nums[i]);
        else *it = nums[i];
        left[i] = tails.size();
    }

    tails.clear();
    for (int i = n - 1; i >= 0; --i) {
        auto it = lower_bound(tails.begin(), tails.end(), nums[i]);
        if (it == tails.end()) tails.push_back(nums[i]);
        else *it = nums[i];
        right[i] = tails.size();
    }

    int maxMountain = 0;
    for (int i = 1; i < n - 1; ++i) {
        if (left[i] > 1 && right[i] > 1) {
            maxMountain = max(maxMountain, left[i] + right[i] - 1);
        }
    }
    return n - maxMountain;
}`
      }
    ],
    problems: [
      { id: "LIS01", title: "Longest Increasing Subsequence", diff: "Medium", tags: ["Patience Sorting"], time: "O(N log N)", space: "O(N)" },
      { id: "LIS02", title: "Russian Doll Envelopes", diff: "Hard", tags: ["2D LIS"], time: "O(N log N)", space: "O(N)" },
      { id: "LIS03", title: "Number of Longest Increasing Subsequences", diff: "Medium", tags: ["DP Counting"], time: "O(N^2)", space: "O(N)" },
      { id: "LIS04", title: "Largest Divisible Subset", diff: "Medium", tags: ["DP Reconstruct"], time: "O(N^2)", space: "O(N)" },
      { id: "LIS05", title: "Maximum Length of Pair Chain", diff: "Medium", tags: ["Greedy LIS"], time: "O(N log N)", space: "O(1)" },
      { id: "LIS06", title: "Longest Mountain in Array", diff: "Medium", tags: ["Two Pointers"], time: "O(N)", space: "O(1)" },
      { id: "LIS07", title: "Minimum Removals to Make Mountain Array", diff: "Hard", tags: ["Bidirectional LIS"], time: "O(N log N)", space: "O(N)" },
      { id: "LIS08", title: "Increasing Triplet Subsequence", diff: "Medium", tags: ["Greedy"], time: "O(N)", space: "O(1)" },
      { id: "LIS09", title: "Find in Mountain Array", diff: "Hard", tags: ["Ternary / Binary Search"], time: "O(log N)", space: "O(1)" },
      { id: "LIS10", title: "Best Team With No Conflicts", diff: "Medium", tags: ["Sort + LIS"], time: "O(N^2)", space: "O(N)" },
      { id: "LIS11", title: "Longest Ideal Subsequence", diff: "Medium", tags: ["Alphabet DP"], time: "O(26*N)", space: "O(26)" },
      { id: "LIS12", title: "Make Array Strictly Increasing", diff: "Hard", tags: ["Binary Search DP"], time: "O(N*M log M)", space: "O(N)" },
      { id: "LIS13", title: "Maximum Height by Stacking Cuboids", diff: "Hard", tags: ["Sort + 3D LIS"], time: "O(N^2)", space: "O(N)" },
      { id: "LIS14", title: "Minimum Operations to Make Array K-Increasing", diff: "Hard", tags: ["K-Striped LIS"], time: "O(N log(N/K))", space: "O(N)" },
      { id: "LIS15", title: "Build Bridges Across River", diff: "Hard", tags: ["2D LIS"], time: "O(N log N)", space: "O(N)" },
      { id: "LIS16", title: "Longest Non-Decreasing Subarray from Two Arrays", diff: "Medium", tags: ["State DP"], time: "O(N)", space: "O(1)" },
      { id: "LIS17", title: "Longest Arithmetic Subsequence", diff: "Medium", tags: ["Hash Map DP"], time: "O(N^2)", space: "O(N^2)" },
      { id: "LIS18", title: "Longest Arithmetic Subsequence of Given Difference", diff: "Medium", tags: ["Hash Map DP"], time: "O(N)", space: "O(N)" },
      { id: "LIS19", title: "Delete and Earn", diff: "Medium", tags: ["House Robber LIS"], time: "O(N + MAX)", space: "O(MAX)" },
      { id: "LIS20", title: "Wiggle Subsequence", diff: "Medium", tags: ["Greedy State"], time: "O(N)", space: "O(1)" },
      { id: "LIS21", title: "Minimum Deletions to Make Array Beautiful", diff: "Medium", tags: ["Greedy"], time: "O(N)", space: "O(1)" },
      { id: "LIS22", title: "Maximum Length of Subarray With Positive Product", diff: "Medium", tags: ["State DP"], time: "O(N)", space: "O(1)" },
      { id: "LIS23", title: "Minimum Operations to Make the Array Alternating", diff: "Medium", tags: ["Frequency Analysis"], time: "O(N)", space: "O(MAX)" },
      { id: "LIS24", title: "Minimum Insertion Steps to Make a String Sorted", diff: "Medium", tags: ["LIS"], time: "O(N log N)", space: "O(N)" },
      { id: "LIS25", title: "Maximum Non-Negative Product in a Matrix", diff: "Medium", tags: ["Min/Max DP"], time: "O(MN)", space: "O(MN)" },
      { id: "LIS26", title: "Count Submatrices With Top-Left Element", diff: "Medium", tags: ["Matrix DP"], time: "O(MN)", space: "O(1)" },
      { id: "LIS27", title: "Longest Increasing Subsequence II (Segment Tree + DP)", diff: "Hard", tags: ["Segment Tree DP"], time: "O(N log MAX)", space: "O(MAX)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 19: DP - Grid & Matrix Paths
  // --------------------------------------------------------------------------
  {
    id: "19_grid_dp",
    num: 19,
    name: "DP - Grid & Matrix Paths",
    category: "Dynamic Programming",
    difficulty: "Easy-Medium",
    badge: "2D Matrix Navigation",
    shortDesc: "Solve path counting, minimum cost routing, maximal rectangles, and obstacle navigation on 2D grids.",
    theory: {
      what: "A 2D recurrence model where each cell `(r, c)` receives transitions from its legal arrival directions (typically `(r-1, c)` from top and `(r, c-1)` from left). Space is compressed to O(Cols) with a 1D running array.",
      when: "Unique paths, minimum path sum, maximal square of 1s, cherry pickup, dungeon game, out of boundary paths, knight dialer.",
      coreIdea: "Unique paths: `dp[c] = dp[c] + dp[c-1]`. Min path sum: `dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])`.",
      edgeCases: "Obstacle at start `(0,0)` or end `(m-1,n-1)`, 1x1 grid, single row / single column matrices."
    },
    diagram: `flowchart TD
    Cell["Cell (r, c)"] <-- "From Top (r-1, c)" --> Top["dp[r-1][c]"]
    Cell <-- "From Left (r, c-1)" --> Left["dp[r][c-1]"]
    Top & Left --> Combine["Path Sum: grid[r][c] + min(Top, Left)<br/>Path Ways: Top + Left<br/>Square Size: 1 + min(Top, Left, TopLeft)"]`,
    visualizerType: "sliding_window",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Minimum Path Sum with 1D Space Optimization: O(M * N) time, O(N) space
int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<int> dp(n, 1e9);
    dp[0] = 0;

    for (int r = 0; r < m; ++r) {
        dp[0] += grid[r][0];
        for (int c = 1; c < n; ++c) {
            dp[c] = grid[r][c] + min(dp[c], dp[c - 1]);
        }
    }
    return dp[n - 1];
}`,
      brute: `// Maximal Square of 1s: O(M * N) time, O(M * N) space
int maximalSquare(vector<vector<char>>& matrix) {
    int m = matrix.size(), n = matrix[0].size(), maxSide = 0;
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (matrix[i - 1][j - 1] == '1') {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
                maxSide = max(maxSide, dp[i][j]);
            }
        }
    }
    return maxSide * maxSide;
}`,
      template: `// Unique Paths with Obstacles
int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<long long> dp(n, 0);
    dp[0] = (grid[0][0] == 0);

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (grid[r][c] == 1) dp[c] = 0;
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`
    },
    solutions: [
      {
        title: "Q1. Unique Paths (Combinatorics / 1D DP)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "Robot can only move down or right. Number of ways to reach `(r, c)` is sum of ways to reach `(r-1, c)` and `(r, c-1)`. Compress into 1D array.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int r = 1; r < m; ++r) {
        for (int c = 1; c < n; ++c) {
            dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`
      },
      {
        title: "Q2. Unique Paths II (With Obstacles)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "If `obstacleGrid[r][c] == 1`, ways to reach this cell becomes 0. Otherwise update `dp[c] = dp[c] + dp[c-1]`.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
    int m = obstacleGrid.size(), n = obstacleGrid[0].size();
    vector<long long> dp(n, 0);
    dp[0] = (obstacleGrid[0][0] == 0);

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (obstacleGrid[r][c] == 1) dp[c] = 0;
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`
      },
      {
        title: "Q3. Minimum Path Sum",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "Cost to reach `(r, c)` is `grid[r][c] + min(cost(r-1, c), cost(r, c-1))`. Initialize boundaries carefully.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<int> dp(n, 0);
    dp[0] = grid[0][0];

    for (int c = 1; c < n; ++c) dp[c] = dp[c - 1] + grid[0][c];

    for (int r = 1; r < m; ++r) {
        dp[0] += grid[r][0];
        for (int c = 1; c < n; ++c) {
            dp[c] = grid[r][c] + min(dp[c], dp[c - 1]);
        }
    }
    return dp[n - 1];
}`
      },
      {
        title: "Q4. Maximal Square",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "If `matrix[r][c] == '1'`, largest square ending at `(r, c)` is `1 + min(top, left, topleft)`. Track global maximum side length.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int maximalSquare(vector<vector<char>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<int> dp(n + 1, 0);
    int maxSide = 0, prevDiag = 0;

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            int temp = dp[j];
            if (matrix[i - 1][j - 1] == '1') {
                dp[j] = 1 + min({dp[j], dp[j - 1], prevDiag});
                maxSide = max(maxSide, dp[j]);
            } else {
                dp[j] = 0;
            }
            prevDiag = temp;
        }
    }
    return maxSide * maxSide;
}`
      },
      {
        title: "Q5. Dungeon Game (Reverse Bottom-Up Health DP)",
        diff: "Hard",
        time: "O(M * N)",
        space: "O(N)",
        intuition: "Starting forward causes dependency on future damage. Instead, work backward from princess `(m-1, n-1)` to knight `(0, 0)`: `minHealth[r][c] = max(1, min(health(right), health(down)) - dungeon[r][c])`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int calculateMinimumHP(vector<vector<int>>& dungeon) {
    int m = dungeon.size(), n = dungeon[0].size();
    vector<int> dp(n + 1, 1e9);
    dp[n - 1] = 1; // Base required health to survive princess cell

    for (int r = m - 1; r >= 0; --r) {
        for (int c = n - 1; c >= 0; --c) {
            int need;
            if (r == m - 1 && c == n - 1) need = 1 - dungeon[r][c];
            else need = min(dp[c], dp[c + 1]) - dungeon[r][c];
            dp[c] = max(1, need);
        }
        dp[n] = 1e9;
    }
    return dp[0];
}`
      },
      {
        title: "Q6. Cherry Pickup (Dual Synchronous Walkers DP)",
        diff: "Hard",
        time: "O(N^3)",
        space: "O(N^2)",
        intuition: "Two people walking simultaneously from `(0,0)` to `(n-1, n-1)` take same step count `k = r1 + c1 = r2 + c2`. State `dp[r1][r2]` transitions across 4 combinations of down/right moves.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int cherryPickup(vector<vector<int>>& grid) {
    int n = grid.size();
    vector<vector<int>> dp(n, vector<int>(n, -1));
    dp[0][0] = grid[0][0];

    for (int step = 1; step <= 2 * n - 2; ++step) {
        vector<vector<int>> nextDp(n, vector<int>(n, -1));

        for (int r1 = max(0, step - (n - 1)); r1 <= min(n - 1, step); ++r1) {
            int c1 = step - r1;
            for (int r2 = max(0, step - (n - 1)); r2 <= min(n - 1, step); ++r2) {
                int c2 = step - r2;

                if (grid[r1][c1] == -1 || grid[r2][c2] == -1) continue;

                int cherries = grid[r1][c1] + (r1 != r2 ? grid[r2][c2] : 0);
                int maxPrev = -1;

                for (int dr1 : {0, -1}) {
                    for (int dr2 : {0, -1}) {
                        int pr1 = r1 + dr1, pr2 = r2 + dr2;
                        if (pr1 >= 0 && pr2 >= 0 && dp[pr1][pr2] != -1) {
                            maxPrev = max(maxPrev, dp[pr1][pr2]);
                        }
                    }
                }

                if (maxPrev != -1) {
                    nextDp[r1][r2] = maxPrev + cherries;
                }
            }
        }
        dp = move(nextDp);
    }
    return max(0, dp[n - 1][n - 1]);
}`
      },
      {
        title: "Q7. Cherry Pickup II (Dual Robots Top-to-Bottom DP)",
        diff: "Hard",
        time: "O(Rows * Cols^2)",
        space: "O(Cols^2)",
        intuition: "Robots move row by row down the grid. Robot 1 is at `c1`, Robot 2 is at `c2`. For next row, try all 9 combinations of `(dc1 in {-1,0,1}, dc2 in {-1,0,1})`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int cherryPickup(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dp(cols, vector<int>(cols, -1));
    dp[0][cols - 1] = grid[0][0] + grid[0][cols - 1];

    for (int r = 1; r < rows; ++r) {
        vector<vector<int>> nextDp(cols, vector<int>(cols, -1));

        for (int c1 = 0; c1 < cols; ++c1) {
            for (int c2 = 0; c2 < cols; ++c2) {
                if (dp[c1][c2] == -1) continue;

                for (int d1 = -1; d1 <= 1; ++d1) {
                    for (int d2 = -1; d2 <= 1; ++d2) {
                        int nc1 = c1 + d1, nc2 = c2 + d2;
                        if (nc1 >= 0 && nc1 < cols && nc2 >= 0 && nc2 < cols) {
                            int gain = (nc1 == nc2) ? grid[r][nc1] : grid[r][nc1] + grid[r][nc2];
                            nextDp[nc1][nc2] = max(nextDp[nc1][nc2], dp[c1][c2] + gain);
                        }
                    }
                }
            }
        }
        dp = move(nextDp);
    }

    int maxCherries = 0;
    for (int c1 = 0; c1 < cols; ++c1) {
        for (int c2 = 0; c2 < cols; ++c2) {
            maxCherries = max(maxCherries, dp[c1][c2]);
        }
    }
    return maxCherries;
}`
      }
    ],
    problems: [
      { id: "GDP01", title: "Unique Paths", diff: "Medium", tags: ["1D DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP02", title: "Unique Paths II", diff: "Medium", tags: ["Obstacles DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP03", title: "Minimum Path Sum", diff: "Medium", tags: ["Grid DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP04", title: "Maximal Square", diff: "Medium", tags: ["2D DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP05", title: "Dungeon Game", diff: "Hard", tags: ["Reverse DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP06", title: "Cherry Pickup", diff: "Hard", tags: ["Synchronous 3D DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "GDP07", title: "Cherry Pickup II", diff: "Hard", tags: ["3D DP"], time: "O(R * C^2)", space: "O(C^2)" },
      { id: "GDP08", title: "Triangle", diff: "Medium", tags: ["Bottom-Up DP"], time: "O(N^2)", space: "O(N)" },
      { id: "GDP09", title: "Minimum Falling Path Sum", diff: "Medium", tags: ["Grid DP"], time: "O(N^2)", space: "O(N)" },
      { id: "GDP10", title: "Minimum Falling Path Sum II", diff: "Hard", tags: ["Grid DP O(1) Search"], time: "O(N^2)", space: "O(N)" },
      { id: "GDP11", title: "Out of Boundary Paths", diff: "Medium", tags: ["3D Memo DP"], time: "O(MN * MaxMove)", space: "O(MN)" },
      { id: "GDP12", title: "Knight Dialer", diff: "Medium", tags: ["Graph / Matrix DP"], time: "O(N)", space: "O(1)" },
      { id: "GDP13", title: "Knight Probability in Chessboard", diff: "Medium", tags: ["3D Matrix DP"], time: "O(K * N^2)", space: "O(N^2)" },
      { id: "GDP14", title: "Maximal Rectangle", diff: "Hard", tags: ["Histogram Stack DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP15", title: "Count Submatrices With All Ones", diff: "Medium", tags: ["Histogram DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP16", title: "Count Square Submatrices with All Ones", diff: "Medium", tags: ["Matrix DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP17", title: "Where Will the Ball Fall", diff: "Medium", tags: ["Matrix Simulation DP"], time: "O(MN)", space: "O(1)" },
      { id: "GDP18", title: "Number of Paths with Max Score", diff: "Hard", tags: ["Path Counting DP"], time: "O(N^2)", space: "O(N^2)" },
      { id: "GDP19", title: "Paths in Matrix Whose Sum Is Divisible by K", diff: "Hard", tags: ["3D Modulo DP"], time: "O(MN * K)", space: "O(N * K)" },
      { id: "GDP20", title: "Longest Increasing Path in a Matrix", diff: "Hard", tags: ["DFS + Memo"], time: "O(MN)", space: "O(MN)" },
      { id: "GDP21", title: "Bomb Enemy", diff: "Medium", tags: ["Row/Col Prefix DP"], time: "O(MN)", space: "O(N)" },
      { id: "GDP22", title: "Matrix Block Sum", diff: "Medium", tags: ["2D Prefix Sum"], time: "O(MN)", space: "O(MN)" },
      { id: "GDP23", title: "Range Sum Query 2D - Immutable", diff: "Medium", tags: ["2D Prefix Sum"], time: "O(1) query", space: "O(MN)" },
      { id: "GDP24", title: "Maximum Side Length of a Square with Sum <= Threshold", diff: "Medium", tags: ["Prefix + Binary Search"], time: "O(MN)", space: "O(MN)" },
      { id: "GDP25", title: "Check if There is a Valid Path in a Grid", diff: "Medium", tags: ["BFS / DSU Grid"], time: "O(MN)", space: "O(MN)" },
      { id: "GDP26", title: "Number of Ways to Form Target Words", diff: "Hard", tags: ["Char Count DP"], time: "O(L * Target)", space: "O(Target)" },
      { id: "GDP27", title: "Shortest Path Visiting All Nodes in Matrix", diff: "Hard", tags: ["Bitmask BFS"], time: "O(MN * 2^K)", space: "O(MN * 2^K)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 20: DP - Interval & Bitmask DP
  // --------------------------------------------------------------------------
  {
    id: "20_interval_bitmask_dp",
    num: 20,
    name: "DP - Interval & Bitmask DP",
    category: "Dynamic Programming",
    difficulty: "Hard",
    badge: "Non-Linear Optimization",
    shortDesc: "Tackle sub-array range merges O(N^3) (Burst Balloons, Matrix Chain) and exponential state subsets O(N^2 * 2^N) (Traveling Salesperson, Assignment).",
    theory: {
      what: "1. Interval DP: `dp[i][j]` represents optimal answer for sub-segment `[i, j]`. Loop over sub-segment length `len` from 2 to N, then partition with intermediate index `k` between `i` and `j`.\n2. Bitmask DP: state `(mask, u)` where bit `i` in `mask` indicates whether element `i` is included.",
      when: "Burst balloons, matrix chain multiplication, minimum cost to merge stones, remove boxes, TSP (Traveling Salesperson), matchsticks to square, shortest superstring, assignment problem.",
      coreIdea: "Interval DP transition:\n`dp[i][j] = min/max(dp[i][k] + dp[k+1][j] + cost(i, k, j))` across all `i <= k < j`.\nBitmask DP transition:\n`dp[mask | (1<<v)][v] = min(dp[mask | (1<<v)][v], dp[mask][u] + dist[u][v])`.",
      edgeCases: "Empty intervals, intervals of length 1 (base cases), bitmask shifts exceeding 30 (use `1ULL << i`), bitmask base states with 0 or 1 bits set."
    },
    diagram: `flowchart TD
    Interval["Interval [i, j] of length L"] --> LoopK["Iterate partition point k from i to j-1:"]
    LoopK --> Merge["dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + merge_cost)"]
    Merge --> LoopK
    
    Bitmask["Bitmask State (mask, currNode)"] --> Unvisited["Iterate next node v where (mask & (1<<v)) == 0:"]
    Unvisited --> NextState["nextMask = mask | (1<<v)<br/>dp[nextMask][v] = min(..., dp[mask][u] + cost[u][v])"]`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Burst Balloons (Interval DP): O(N^3) time, O(N^2) space
int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> b(n + 2, 1);
    for (int i = 0; i < n; ++i) b[i + 1] = nums[i];

    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));

    // Iterate over sub-interval lengths
    for (int len = 1; len <= n; ++len) {
        for (int i = 1; i <= n - len + 1; ++i) {
            int j = i + len - 1;
            for (int k = i; k <= j; ++k) {
                // Balloon k is the LAST balloon burst in range [i, j]
                int coins = b[i - 1] * b[k] * b[j + 1] + dp[i][k - 1] + dp[k + 1][j];
                dp[i][j] = max(dp[i][j], coins);
            }
        }
    }
    return dp[1][n];
}`,
      brute: `// Traveling Salesperson Problem (Bitmask DP): O(N^2 * 2^N)
int tsp(int n, const vector<vector<int>>& dist) {
    int allVisited = (1 << n) - 1;
    vector<vector<int>> dp(1 << n, vector<int>(n, 1e9));
    dp[1][0] = 0; // Start at city 0 with mask 00...01

    for (int mask = 1; mask < (1 << n); ++mask) {
        for (int u = 0; u < n; ++u) {
            if (!(mask & (1 << u))) continue;
            for (int v = 0; v < n; ++v) {
                if (!(mask & (1 << v))) {
                    int nextMask = mask | (1 << v);
                    dp[nextMask][v] = min(dp[nextMask][v], dp[mask][u] + dist[u][v]);
                }
            }
        }
    }
    int ans = 1e9;
    for (int i = 1; i < n; ++i) ans = min(ans, dp[allVisited][i] + dist[i][0]);
    return ans;
}`,
      template: `// Minimum Cost to Merge Stones (Interval DP with Step K-1)
int mergeStones(vector<int>& stones, int k) {
    int n = stones.size();
    if ((n - 1) % (k - 1) != 0) return -1;

    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + stones[i];

    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = k; len <= n; ++len) {
        for (int i = 0; i <= n - len; ++i) {
            int j = i + len - 1;
            dp[i][j] = 1e9;
            for (int m = i; m < j; m += k - 1) {
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m + 1][j]);
            }
            if ((len - 1) % (k - 1) == 0) {
                dp[i][j] += prefix[j + 1] - prefix[i];
            }
        }
    }
    return dp[0][n - 1];
}`
    },
    solutions: [
      {
        title: "Q1. Burst Balloons (Interval DP)",
        diff: "Hard",
        time: "O(N^3)",
        space: "O(N^2)",
        intuition: "Instead of choosing which balloon to burst first (which breaks sub-problem independence), choose which balloon `k` is burst LAST in range `[i, j]`. The boundary balloons remain `b[i-1]` and `b[j+1]`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> b(n + 2, 1);
    for (int i = 0; i < n; ++i) b[i + 1] = nums[i];

    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));

    for (int len = 1; len <= n; ++len) {
        for (int i = 1; i <= n - len + 1; ++i) {
            int j = i + len - 1;
            for (int k = i; k <= j; ++k) {
                int gain = b[i - 1] * b[k] * b[j + 1] + dp[i][k - 1] + dp[k + 1][j];
                dp[i][j] = max(dp[i][j], gain);
            }
        }
    }
    return dp[1][n];
}`
      },
      {
        title: "Q2. Minimum Cost Tree From Leaf Values (Interval DP)",
        diff: "Medium",
        time: "O(N^3)",
        space: "O(N^2)",
        intuition: "For each interval `[i, j]`, partition at `k`: `dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + max(arr[i..k]) * max(arr[k+1..j]))`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int mctFromLeafValues(vector<int>& arr) {
    int n = arr.size();
    vector<vector<int>> dp(n, vector<int>(n, 1e9));
    vector<vector<int>> maxVal(n, vector<int>(n, 0));

    for (int i = 0; i < n; ++i) {
        dp[i][i] = 0;
        maxVal[i][i] = arr[i];
        for (int j = i + 1; j < n; ++j) {
            maxVal[i][j] = max(maxVal[i][j - 1], arr[j]);
        }
    }

    for (int len = 2; len <= n; ++len) {
        for (int i = 0; i <= n - len; ++i) {
            int j = i + len - 1;
            for (int k = i; k < j; ++k) {
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + maxVal[i][k] * maxVal[k + 1][j]);
            }
        }
    }
    return dp[0][n - 1];
}`
      },
      {
        title: "Q3. Minimum Cost to Merge Stones",
        diff: "Hard",
        time: "O(N^3 / K)",
        space: "O(N^2)",
        intuition: "Merge range `[i, j]` into 1 pile. Elements can only be grouped if `(len - 1) % (k - 1) == 0`. Intermediate splits advance in strides of `k - 1`.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

int mergeStones(vector<int>& stones, int k) {
    int n = stones.size();
    if ((n - 1) % (k - 1) != 0) return -1;

    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + stones[i];

    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = k; len <= n; ++len) {
        for (int i = 0; i <= n - len; ++i) {
            int j = i + len - 1;
            dp[i][j] = 1e9;
            for (int m = i; m < j; m += k - 1) {
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m + 1][j]);
            }
            if ((len - 1) % (k - 1) == 0) {
                dp[i][j] += prefix[j + 1] - prefix[i];
            }
        }
    }
    return dp[0][n - 1];
}`
      },
      {
        title: "Q4. Matchsticks to Square (Bitmask Partition DP)",
        diff: "Medium",
        time: "O(N * 2^N)",
        space: "O(2^N)",
        intuition: "Sum must be divisible by 4 (`target = sum / 4`). `dp[mask]` stores the accumulated side remainder when subset `mask` of matchsticks is assembled. If `dp[mask] + stick <= target`, transition is valid.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

bool makesquare(vector<int>& matchsticks) {
    int total = accumulate(matchsticks.begin(), matchsticks.end(), 0);
    if (total % 4 != 0) return false;
    int target = total / 4;

    int n = matchsticks.size();
    int totalMasks = 1 << n;
    vector<int> dp(totalMasks, -1);
    dp[0] = 0;

    for (int mask = 0; mask < totalMasks; ++mask) {
        if (dp[mask] == -1) continue;

        for (int i = 0; i < n; ++i) {
            if (!(mask & (1 << i))) {
                if (dp[mask] + matchsticks[i] <= target) {
                    dp[mask | (1 << i)] = (dp[mask] + matchsticks[i]) % target;
                }
            }
        }
    }
    return dp[totalMasks - 1] == 0;
}`
      },
      {
        title: "Q5. Partition to K Equal Sum Subsets",
        diff: "Medium",
        time: "O(N * 2^N)",
        space: "O(2^N)",
        intuition: "Similar to matchsticks square: total sum must be divisible by k (`target = sum / k`). `dp[mask]` stores remainder sum modulo target for subsets.",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

bool canPartitionKSubsets(vector<int>& nums, int k) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % k != 0) return false;
    int target = total / k;

    int n = nums.size();
    int totalMasks = 1 << n;
    vector<int> dp(totalMasks, -1);
    dp[0] = 0;

    for (int mask = 0; mask < totalMasks; ++mask) {
        if (dp[mask] == -1) continue;

        for (int i = 0; i < n; ++i) {
            if (!(mask & (1 << i))) {
                if (dp[mask] + nums[i] <= target) {
                    dp[mask | (1 << i)] = (dp[mask] + nums[i]) % target;
                }
            }
        }
    }
    return dp[totalMasks - 1] == 0;
}`
      },
      {
        title: "Q6. Shortest Path Visiting All Nodes (State Bitmask)",
        diff: "Hard",
        time: "O(N * 2^N)",
        space: "O(N * 2^N)",
        intuition: "Multi-source BFS on state `(node, visitedMask)`. The shortest queue distance reaching mask `(1<<N)-1` is the answer.",
        cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int shortestPathLength(vector<vector<int>>& graph) {
    int n = graph.size();
    int target = (1 << n) - 1;
    queue<vector<int>> q;
    vector<vector<bool>> visited(n, vector<bool>(1 << n, false));

    for (int i = 0; i < n; ++i) {
        q.push({i, 1 << i, 0});
        visited[i][1 << i] = true;
    }

    while (!q.empty()) {
        auto curr = q.front();
        q.pop();
        int u = curr[0], mask = curr[1], d = curr[2];

        if (mask == target) return d;

        for (int v : graph[u]) {
            int nextMask = mask | (1 << v);
            if (!visited[v][nextMask]) {
                visited[v][nextMask] = true;
                q.push({v, nextMask, d + 1});
            }
        }
    }
    return 0;
}`
      },
      {
        title: "Q7. Find the Shortest Superstring (Bitmask TSP)",
        diff: "Hard",
        time: "O(N^2 * 2^N)",
        space: "O(N * 2^N)",
        intuition: "Precompute maximum overlapping suffix-to-prefix overlap between every string pair `(i, j)`. Transform to TSP searching for the Hamiltonian path maximizing total overlap.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

string shortestSuperstring(vector<string>& words) {
    int n = words.size();
    vector<vector<int>> overlap(n, vector<int>(n, 0));

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i == j) continue;
            for (int k = min(words[i].size(), words[j].size()); k > 0; --k) {
                if (words[i].substr(words[i].size() - k) == words[j].substr(0, k)) {
                    overlap[i][j] = k;
                    break;
                }
            }
        }
    }

    vector<vector<int>> dp(1 << n, vector<int>(n, 0));
    vector<vector<int>> parent(1 << n, vector<int>(n, -1));

    for (int mask = 1; mask < (1 << n); ++mask) {
        for (int j = 0; j < n; ++j) {
            if (!(mask & (1 << j))) continue;
            int prevMask = mask ^ (1 << j);
            if (prevMask == 0) continue;

            for (int i = 0; i < n; ++i) {
                if ((prevMask & (1 << i))) {
                    int val = dp[prevMask][i] + overlap[i][j];
                    if (val > dp[mask][j]) {
                        dp[mask][j] = val;
                        parent[mask][j] = i;
                    }
                }
            }
        }
    }

    int lastNode = 0, maxVal = -1;
    int fullMask = (1 << n) - 1;
    for (int i = 0; i < n; ++i) {
        if (dp[fullMask][i] > maxVal) {
            maxVal = dp[fullMask][i];
            lastNode = i;
        }
    }

    vector<int> path;
    int currMask = fullMask, currNode = lastNode;
    while (currNode != -1) {
        path.push_back(currNode);
        int prev = parent[currMask][currNode];
        currMask ^= (1 << currNode);
        currNode = prev;
    }
    reverse(path.begin(), path.end());

    string res = words[path[0]];
    for (size_t i = 1; i < path.size(); ++i) {
        int u = path[i - 1], v = path[i];
        res += words[v].substr(overlap[u][v]);
    }
    return res;
}`
      }
    ],
    problems: [
      { id: "IB01", title: "Burst Balloons", diff: "Hard", tags: ["Interval DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "IB02", title: "Minimum Cost Tree From Leaf Values", diff: "Medium", tags: ["Interval DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "IB03", title: "Minimum Cost to Merge Stones", diff: "Hard", tags: ["Interval DP"], time: "O(N^3 / K)", space: "O(N^2)" },
      { id: "IB04", title: "Matchsticks to Square", diff: "Medium", tags: ["Bitmask Partition"], time: "O(N * 2^N)", space: "O(2^N)" },
      { id: "IB05", title: "Partition to K Equal Sum Subsets", diff: "Medium", tags: ["Bitmask DP"], time: "O(N * 2^N)", space: "O(2^N)" },
      { id: "IB06", title: "Shortest Path Visiting All Nodes", diff: "Hard", tags: ["Bitmask BFS"], time: "O(N * 2^N)", space: "O(N * 2^N)" },
      { id: "IB07", title: "Find the Shortest Superstring", diff: "Hard", tags: ["TSP Bitmask"], time: "O(N^2 * 2^N)", space: "O(N * 2^N)" },
      { id: "IB08", title: "Remove Boxes", diff: "Hard", tags: ["3D Interval DP"], time: "O(N^4)", space: "O(N^3)" },
      { id: "IB09", title: "Strange Printer", diff: "Hard", tags: ["Interval DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "IB10", title: "Guess Number Higher or Lower II", diff: "Medium", tags: ["Minimax Interval DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "IB11", title: "Zuma Game", diff: "Hard", tags: ["Memoized Search"], time: "O(States)", space: "O(States)" },
      { id: "IB12", title: "Smallest Sufficient Team", diff: "Hard", tags: ["Bitmask DP"], time: "O(People * 2^Skills)", space: "O(2^Skills)" },
      { id: "IB13", title: "Maximum Students Taking Exam", diff: "Hard", tags: ["Row Bitmask DP"], time: "O(R * 2^C * 2^C)", space: "O(2^C)" },
      { id: "IB14", title: "Number of Ways to Wear Different Hats", diff: "Hard", tags: ["Bitmask Assignment"], time: "O(40 * 2^N)", space: "O(2^N)" },
      { id: "IB15", title: "Can I Win", diff: "Medium", tags: ["Minimax Bitmask"], time: "O(2^N)", space: "O(2^N)" },
      { id: "IB16", title: "Distribute Repeating Integers", diff: "Hard", tags: ["Bitmask DP"], time: "O(N * 3^M)", space: "O(2^M)" },
      { id: "IB17", title: "Maximum Compatibility Score Sum", diff: "Medium", tags: ["Bitmask Matching"], time: "O(M * 2^M)", space: "O(2^M)" },
      { id: "IB18", title: "Fair Distribution of Cookies (Bitmask DP)", diff: "Medium", tags: ["Submask Enumeration"], time: "O(K * 3^N)", space: "O(2^N)" },
      { id: "IB19", title: "Number of Squareful Arrays", diff: "Hard", tags: ["Hamiltonian Bitmask"], time: "O(N^2 * 2^N)", space: "O(N * 2^N)" },
      { id: "IB20", title: "Allocate Mailboxes", diff: "Hard", tags: ["Interval + 2D DP"], time: "O(N^2 * K)", space: "O(NK)" },
      { id: "IB21", title: "Palindrome Removal", diff: "Hard", tags: ["Interval DP"], time: "O(N^3)", space: "O(N^2)" },
      { id: "IB22", title: "Minimum XOR Sum of Two Arrays", diff: "Hard", tags: ["Bitmask DP"], time: "O(N * 2^N)", space: "O(2^N)" },
      { id: "IB23", title: "Maximum Score Words Formed by Letters", diff: "Hard", tags: ["Bitmask Knapsack"], time: "O(2^N)", space: "O(26)" },
      { id: "IB24", title: "Parallel Courses II", diff: "Hard", tags: ["Submask BFS"], time: "O(3^N)", space: "O(2^N)" },
      { id: "IB25", title: "Find Minimum Time to Finish All Jobs", diff: "Hard", tags: ["Submask DP"], time: "O(K * 3^N)", space: "O(2^N)" },
      { id: "IB26", title: "K-th Smallest Subarray Sum", diff: "Hard", tags: ["Binary Search + Sliding Window"], time: "O(N log(Sum))", space: "O(1)" },
      { id: "IB27", title: "Minimum Cost to Cut a Stick (Interval DP)", diff: "Hard", tags: ["Interval DP"], time: "O(M^3)", space: "O(M^2)" }
    ]
  }
];
