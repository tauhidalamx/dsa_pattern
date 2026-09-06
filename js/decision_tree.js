/**
 * @file decision_tree.js
 * @brief Interactive "Which Pattern Should I Use?" Decision Questionnaire.
 */

const DECISION_TREE = {
  id: "root",
  question: "What type of data structure or problem input are you working with?",
  options: [
    {
      text: "Linear Array or String (Contiguous / Sequential)",
      next: "linear_type"
    },
    {
      text: "Linked List (Nodes with Pointers)",
      next: "linked_list_type"
    },
    {
      text: "Hierarchical Tree or Binary Search Tree (BST)",
      pattern: "09_tree_bfs_dfs",
      reason: "Hierarchical structures require Tree BFS (level-by-level queue) or Tree DFS (pre/in/post-order recursion)."
    },
    {
      text: "Graph with Vertices and Edges (Dependencies / Networks)",
      next: "graph_type"
    },
    {
      text: "Finding Optimal Solution with Overlapping Subproblems",
      next: "dp_type"
    },
    {
      text: "Need to generate All Subsets, Permutations, or solve Sudoku/N-Queens",
      pattern: "11_backtracking_subsets",
      reason: "Exhaustive combinatorial exploration requires the Backtracking Choose -> Explore -> Undo paradigm."
    }
  ],
  linear_type: {
    question: "Is the array sorted, or are you looking for contiguous subsegments?",
    options: [
      {
        text: "The input array is SORTED, and I need to find pairs/triplets with a target sum",
        pattern: "01_two_pointers",
        reason: "Two Pointers converging from both ends finds target pairs in O(N) time with O(1) space."
      },
      {
        text: "I need to find the LONGEST or SHORTEST contiguous subarray/substring meeting a condition",
        pattern: "02_sliding_window",
        reason: "Contiguous subsegment optimizations with monotonic constraints map directly to Sliding Window."
      },
      {
        text: "I need the NEXT GREATER or NEXT SMALLER element for every position",
        pattern: "04_monotonic_stack_queue",
        reason: "Monotonic Stack processes nearest greater/smaller elements in linear O(N) amortized time."
      },
      {
        text: "The array contains numbers in range 1..N and I need to find missing/duplicates in O(1) space",
        pattern: "06_cyclic_sort",
        reason: "Cyclic Sort places each number at index nums[i]-1 in O(N) time and O(1) space."
      },
      {
        text: "I need to MINIMIZE a maximum value or MAXIMIZE a minimum value",
        pattern: "08_binary_search_answer",
        reason: "Optimization problems with monotonic feasibility functions f(x) require Binary Search on Answer Space."
      }
    ]
  },
  linked_list_type: {
    question: "What operation do you need on the Linked List?",
    options: [
      {
        text: "Detect a cycle, find cycle entry, or find the middle node in a single pass",
        pattern: "03_fast_slow_pointers",
        reason: "Floyd's Tortoise and Hare (Fast & Slow Pointers) finds cycles and midpoints in O(1) extra space."
      },
      {
        text: "Reverse the list, sub-list, or reverse in groups of K",
        pattern: "07_inplace_linked_list_reversal",
        reason: "Iterative 3-pointer pointer rewiring (prev, curr, next_node) reverses nodes in-place in O(N)."
      }
    ]
  },
  graph_type: {
    question: "What is the primary graph objective?",
    options: [
      {
        text: "Prerequisites, compilation order, or dependency scheduling in a DAG",
        pattern: "13_topological_sort",
        reason: "Dependency resolution requires Kahn's Algorithm (in-degrees BFS) or DFS Topological Sort."
      },
      {
        text: "Shortest path with weighted positive edges",
        pattern: "14_shortest_path_dijkstra",
        reason: "Dijkstra's Algorithm with a Min-Heap finds single-source shortest paths in O((V + E) log V)."
      },
      {
        text: "Dynamic connectivity, component grouping, or cycle detection in undirected graph",
        pattern: "15_dsu_kruskal",
        reason: "Disjoint Set Union (DSU / Union-Find) with path compression handles dynamic connectivity in ~O(1)."
      }
    ]
  },
  dp_type: {
    question: "What is the state structure of your Dynamic Programming problem?",
    options: [
      {
        text: "Selecting items under a capacity or budget constraint (0/1 or Unbounded)",
        pattern: "16_dp_knapsack",
        reason: "0/1 Knapsack (traverse capacity backwards) or Unbounded Knapsack (traverse forwards)."
      },
      {
        text: "Matching or comparing two strings / sequences (LCS, Edit Distance)",
        pattern: "17_dp_lcs_edit_distance",
        reason: "2D state matrix dp[i][j] comparing prefixes S1[0..i] and S2[0..j]."
      },
      {
        text: "Longest Increasing Subsequence (LIS)",
        pattern: "18_dp_lis",
        reason: "Patience sorting with binary search (lower_bound) finds LIS in O(N log N) time."
      },
      {
        text: "Grid paths (moving right and down in 2D matrix)",
        pattern: "19_dp_grid",
        reason: "2D Grid DP with row-by-row 1D memory optimization."
      }
    ]
  }
};

class DecisionTreeController {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.currentNode = DECISION_TREE;
    this.history = [];
  }

  open() {
    this.currentNode = DECISION_TREE;
    this.history = [];
    this.render();
    this.modal.classList.add("active");
  }

  close() {
    this.modal.classList.remove("active");
  }

  render() {
    let container = document.getElementById("quiz-content");
    if (!container) return;

    if (this.currentNode.pattern) {
      let pat = DSA_PATTERNS.find(p => p.id === this.currentNode.pattern);
      container.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎯</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">Recommended Pattern:</h3>
          <div style="display: inline-block; padding: 0.5rem 1.25rem; background: rgba(6, 182, 212, 0.15); border: 1px solid var(--accent-cyan); border-radius: var(--radius-md); color: var(--accent-cyan); font-weight: 700; font-size: 1.2rem; margin-bottom: 1rem;">
            ${pat.num}. ${pat.name}
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${this.currentNode.reason}</p>
          <button class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;" onclick="app.selectPattern('${pat.id}'); decisionTree.close();">
            Explore Pattern Details & C++ Code <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
      return;
    }

    let html = `
      <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #fff; margin-bottom: 1.25rem;">
        ${this.currentNode.question}
      </h3>
      <div>
    `;

    this.currentNode.options.forEach((opt, idx) => {
      html += `
        <button class="quiz-option-btn" onclick="decisionTree.choose(${idx})">
          <span>${opt.text}</span>
          <i class="fas fa-chevron-right" style="color: var(--text-muted); font-size: 0.8rem;"></i>
        </button>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  choose(optionIndex) {
    let opt = this.currentNode.options[optionIndex];
    if (opt.pattern) {
      this.currentNode = opt;
    } else if (opt.next && DECISION_TREE[opt.next]) {
      this.history.push(this.currentNode);
      this.currentNode = DECISION_TREE[opt.next];
    }
    this.render();
  }
}

window.DecisionTreeController = DecisionTreeController;
