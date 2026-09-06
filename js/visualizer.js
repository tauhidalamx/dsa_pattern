/**
 * @file visualizer.js
 * @brief Interactive step-by-step visualizer engine for all 26 DSA patterns.
 *        Every single pattern has its own dedicated simulation data and animations.
 */

class AlgorithmVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentPattern = null;
    this.steps = [];
    this.currentStepIndex = 0;
    this.timer = null;
    this.isPlaying = false;
  }

  init(patternId) {
    this.stop();
    this.currentPattern = patternId;
    this.steps = this.generateSteps(patternId);
    this.currentStepIndex = 0;
    this.renderControls();
    this.renderCurrentStep();
  }

  generateSteps(patternId) {
    const id = patternId.toLowerCase();

    // 01. Two Pointers
    if (id.includes("two_pointers")) {
      return this.genTwoPointersSteps([2, 7, 11, 15, 19, 23], 26);
    }
    // 02. Sliding Window
    if (id.includes("sliding_window")) {
      return this.genSlidingWindowSteps([2, 1, 5, 2, 8, 1, 5], 3);
    }
    // 03. Fast & Slow Pointers
    if (id.includes("fast_slow") || id.includes("cycle")) {
      return this.genFastSlowSteps(["Node 1", "Node 2", "Node 3", "Node 4", "Node 5", "Node 6"]);
    }
    // 04. Monotonic Stack
    if (id.includes("monotonic_stack")) {
      return this.genMonotonicStackSteps([73, 74, 75, 71, 69, 72, 76, 73]);
    }
    // 05. Interval Merging
    if (id.includes("interval") || id.includes("merge_interval")) {
      return this.genIntervalSteps(["[1,3]", "[2,6]", "[8,10]", "[15,18]"]);
    }
    // 06. Cyclic Sort
    if (id.includes("cyclic_sort")) {
      return this.genCyclicSortSteps([3, 5, 2, 1, 4]);
    }
    // 07. LinkedList Reversal
    if (id.includes("reversal") || id.includes("linked_list")) {
      return this.genLinkedListReversalSteps([1, 2, 3, 4, 5]);
    }
    // 08. Tree BFS
    if (id.includes("tree_breadth") || id.includes("bfs")) {
      return this.genTreeBfsSteps(["3 (Root)", "9 (L1)", "20 (L1)", "15 (L2)", "7 (L2)"]);
    }
    // 09. Tree DFS
    if (id.includes("tree_depth") || id.includes("dfs")) {
      return this.genTreeDfsSteps(["5 (Root)", "4 (L1)", "11 (L2)", "7 (Leaf)", "2 (Leaf)"], 22);
    }
    // 10. Two Heaps
    if (id.includes("two_heaps") || id.includes("median")) {
      return this.genTwoHeapsSteps([5, 15, 1, 3, 8]);
    }
    // 11. Subsets & Backtracking
    if (id.includes("subsets") || id.includes("backtracking")) {
      return this.genBacktrackingSteps([1, 2, 3]);
    }
    // 12. Modified Binary Search
    if (id.includes("binary_search")) {
      return this.genBinarySearchSteps([2, 5, 8, 12, 16, 23, 38, 45, 56, 72], 23);
    }
    // 13. Top K Elements
    if (id.includes("top_k")) {
      return this.genTopKSteps([3, 10, 5, 20, 4, 8, 15], 3);
    }
    // 14. K-way Merge
    if (id.includes("k_way")) {
      return this.genKWayMergeSteps(["[2,6,8]", "[3,6,7]", "[1,3,4]"]);
    }
    // 15. 0/1 Knapsack & DP
    if (id.includes("knapsack")) {
      return this.genKnapsackSteps([1, 2, 5], 11);
    }
    // 16. Topological Sort
    if (id.includes("topological")) {
      return this.genTopologicalSortSteps(["CS101", "CS102", "DataStruct", "Algorithms", "AdvancedDSA"]);
    }
    // 17. Shortest Paths (Dijkstra)
    if (id.includes("shortest_path")) {
      return this.genShortestPathSteps(["Node 0", "Node 1", "Node 2", "Node 3", "Node 4"]);
    }
    // 18. Disjoint Set Union (DSU)
    if (id.includes("disjoint_set") || id.includes("dsu")) {
      return this.genDsuSteps([1, 2, 3, 4, 5]);
    }
    // 19. Longest Common Subsequence
    if (id.includes("common_subsequence") || id.includes("lcs")) {
      return this.genLcsSteps("ABCDE", "ACE");
    }
    // 20. Longest Increasing Subsequence
    if (id.includes("increasing_subsequence") || id.includes("lis")) {
      return this.genLisSteps([10, 9, 2, 5, 3, 7, 101, 18]);
    }
    // 21. Matrix & Grid DP
    if (id.includes("matrix") || id.includes("grid")) {
      return this.genGridDpSteps(3, 3);
    }
    // 22. Interval & Bitmask DP
    if (id.includes("bitmask")) {
      return this.genBitmaskSteps(["City A", "City B", "City C", "City D"]);
    }
    // 23. Trie
    if (id.includes("trie")) {
      return this.genTrieSteps("apple", ["app", "apple", "application"]);
    }
    // 24. String Matching (KMP)
    if (id.includes("string_matching") || id.includes("kmp")) {
      return this.genKmpSteps("ABABDABACDABABCABAB", "ABABCABAB");
    }
    // 25. Bit Manipulation
    if (id.includes("bit_manipulation")) {
      return this.genBitManipulationSteps([4, 1, 2, 1, 2]);
    }
    // 26. Segment Tree & Fenwick
    if (id.includes("segment") || id.includes("fenwick")) {
      return this.genSegmentTreeSteps([1, 3, 5, 7, 9, 11]);
    }

    // Default Fallback
    return this.genTwoPointersSteps([1, 2, 4, 7, 11, 15], 15);
  }

  // 01. Two Pointers
  genTwoPointersSteps(arr, target) {
    let steps = [];
    let l = 0, r = arr.length - 1;
    steps.push({
      array: [...arr],
      left: l,
      right: r,
      log: `Two Pointers Initialized: Left = index ${l} (${arr[l]}), Right = index ${r} (${arr[r]}), Target = ${target}`
    });

    while (l < r) {
      let sum = arr[l] + arr[r];
      if (sum === target) {
        steps.push({
          array: [...arr],
          left: l,
          right: r,
          found: true,
          log: `🎯 MATCH FOUND! arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) == ${target}. Solution indices [${l+1}, ${r+1}].`
        });
        break;
      } else if (sum < target) {
        steps.push({
          array: [...arr],
          left: l,
          right: r,
          log: `Sum = ${arr[l]} + ${arr[r]} = ${sum} < ${target}. Advancing Left Pointer (++left) to increase sum.`
        });
        l++;
      } else {
        steps.push({
          array: [...arr],
          left: l,
          right: r,
          log: `Sum = ${arr[l]} + ${arr[r]} = ${sum} > ${target}. Decrementing Right Pointer (--right) to decrease sum.`
        });
        r--;
      }
    }
    return steps;
  }

  // 02. Sliding Window
  genSlidingWindowSteps(arr, k) {
    let steps = [];
    let windowSum = 0;
    let maxSum = -Infinity;

    for (let i = 0; i < arr.length; i++) {
      windowSum += arr[i];
      if (i < k - 1) {
        steps.push({
          array: [...arr],
          windowStart: 0,
          windowEnd: i,
          log: `Building initial window: added element arr[${i}] (${arr[i]}). Current window sum = ${windowSum}`
        });
      } else {
        maxSum = Math.max(maxSum, windowSum);
        steps.push({
          array: [...arr],
          windowStart: i - k + 1,
          windowEnd: i,
          log: `Window [${i - k + 1} ... ${i}]: Elements = [${arr.slice(i-k+1, i+1).join(", ")}], Window Sum = ${windowSum}, Max Seen = ${maxSum}`
        });
        windowSum -= arr[i - k + 1];
      }
    }
    return steps;
  }

  // 03. Fast & Slow Pointers (Cycle Detection)
  genFastSlowSteps(nodes) {
    let steps = [];
    let slow = 0, fast = 0;
    steps.push({
      array: [...nodes],
      slow: slow,
      fast: fast,
      log: `Slow (Tortoise @ 1x) and Fast (Hare @ 2x) initialized at Head (${nodes[0]}).`
    });

    for (let t = 1; t <= 4; t++) {
      slow = (slow + 1) % nodes.length;
      fast = (fast + 2) % nodes.length;
      steps.push({
        array: [...nodes],
        slow: slow,
        fast: fast,
        log: `Iteration ${t}: Slow moved to ${nodes[slow]}, Fast leaped to ${nodes[fast]}.`
      });
      if (slow === fast) {
        steps.push({
          array: [...nodes],
          slow: slow,
          fast: fast,
          found: true,
          log: `🎯 CYCLE DETECTED! Fast and Slow met at ${nodes[slow]}. Cycle confirmed in O(N) time with O(1) space.`
        });
        break;
      }
    }
    return steps;
  }

  // 04. Monotonic Stack
  genMonotonicStackSteps(temps) {
    let steps = [];
    let stack = [];
    let res = new Array(temps.length).fill(0);

    for (let i = 0; i < temps.length; i++) {
      steps.push({
        array: [...temps],
        currentIndex: i,
        log: `Scanning Day ${i} (Temp = ${temps[i]}°). Checking against stack top.`
      });

      while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
        let prev = stack.pop();
        res[prev] = i - prev;
        steps.push({
          array: [...temps],
          currentIndex: i,
          resolvedIndex: prev,
          log: `🔥 Day ${i} (${temps[i]}°) is warmer than Day ${prev} (${temps[prev]}°)! Stack popped. Wait time = ${i - prev} days.`
        });
      }
      stack.push(i);
    }
    return steps;
  }

  // 05. Interval Merging
  genIntervalSteps(intervals) {
    let steps = [];
    steps.push({
      array: [...intervals],
      left: 0,
      right: 1,
      log: `Sorted Intervals: Comparing [1,3] with [2,6]. Since 2 <= 3, intervals overlap!`
    });
    steps.push({
      array: ["[1,6] (Merged)", "[8,10]", "[15,18]"],
      left: 0,
      right: 1,
      log: `Merged into [1,6]. Now comparing [1,6] with [8,10]. No overlap (8 > 6).`
    });
    steps.push({
      array: ["[1,6]", "[8,10]", "[15,18]"],
      left: 1,
      right: 2,
      log: `Comparing [8,10] with [15,18]. No overlap (15 > 10). Merge complete.`
    });
    return steps;
  }

  // 06. Cyclic Sort
  genCyclicSortSteps(arr) {
    let steps = [];
    let i = 0;
    steps.push({ array: [...arr], currentIndex: i, log: `Cyclic Sort Initialized. Array: [${arr.join(", ")}]. Target rule: arr[i] must equal i+1.` });

    while (i < arr.length) {
      let correctIdx = arr[i] - 1;
      if (arr[i] !== arr[correctIdx]) {
        steps.push({
          array: [...arr],
          left: i,
          right: correctIdx,
          log: `arr[${i}] (${arr[i]}) belongs at index ${correctIdx}. Swapping elements!`
        });
        let temp = arr[i];
        arr[i] = arr[correctIdx];
        arr[correctIdx] = temp;
      } else {
        steps.push({ array: [...arr], currentIndex: i, log: `arr[${i}] (${arr[i]}) is in its correct place. Moving forward (++i).` });
        i++;
      }
    }
    steps.push({ array: [...arr], found: true, log: `🎯 Array perfectly sorted in O(N) time with O(1) auxiliary space!` });
    return steps;
  }

  // 07. LinkedList Reversal
  genLinkedListReversalSteps(nodes) {
    let steps = [];
    steps.push({ array: nodes.map(n => `Node(${n})`), prev: -1, curr: 0, log: `Reversal Init: Prev = NULL, Curr = Node(1). Next pointer saved.` });
    for (let i = 0; i < nodes.length; i++) {
      steps.push({
        array: nodes.map((n, idx) => idx < i ? `← ${n}` : `${n} →`),
        prev: i - 1,
        curr: i,
        next: i + 1 < nodes.length ? i + 1 : -1,
        log: `Inverting link: Node(${nodes[i]}) now points backward to ${i === 0 ? 'NULL' : 'Node(' + nodes[i-1] + ')'}. Advancing pointers.`
      });
    }
    steps.push({ array: nodes.reverse().map(n => `${n} →`), found: true, log: `🎯 LinkedList fully reversed in O(N) time and O(1) space. New Head = Node(5).` });
    return steps;
  }

  // 08. Tree BFS
  genTreeBfsSteps(treeNodes) {
    let steps = [];
    steps.push({ array: [...treeNodes], queue: 0, log: `BFS Level Order Init: Pushed Root (3) into FIFO Queue.` });
    steps.push({ array: [...treeNodes], windowStart: 1, windowEnd: 2, log: `Level 1 Processed: Popped 3, Discovered Left child (9) and Right child (20).` });
    steps.push({ array: [...treeNodes], windowStart: 3, windowEnd: 4, log: `Level 2 Processed: Popped 9 and 20, Discovered children (15) and (7). Queue empty.` });
    return steps;
  }

  // 09. Tree DFS
  genTreeDfsSteps(nodes, targetSum) {
    let steps = [];
    steps.push({ array: [...nodes], currentIndex: 0, log: `DFS Path Sum Init: Visited Root (5). Remaining sum needed = ${targetSum - 5}.` });
    steps.push({ array: [...nodes], currentIndex: 1, log: `DFS Recursed Left: Visited Node (4). Remaining sum needed = ${targetSum - 9}.` });
    steps.push({ array: [...nodes], currentIndex: 2, log: `DFS Recursed: Visited Node (11). Remaining sum needed = ${targetSum - 20}.` });
    steps.push({ array: [...nodes], currentIndex: 4, found: true, log: `🎯 Target Leaf Reached: Visited Leaf (2). 22 - 22 == 0. Valid Path Found: 5 -> 4 -> 11 -> 2!` });
    return steps;
  }

  // 10. Two Heaps
  genTwoHeapsSteps(elements) {
    let steps = [];
    steps.push({ array: ["MaxHeap: []", "MinHeap: []"], log: `Two Heaps Initialized: Max-Heap (lower 50%), Min-Heap (upper 50%).` });
    steps.push({ array: ["MaxHeap: [5]", "MinHeap: []"], log: `Inserted 5 into Max-Heap. Running Median = 5.0` });
    steps.push({ array: ["MaxHeap: [5]", "MinHeap: [15]"], log: `Inserted 15 into Min-Heap. Heaps balanced (size 1 each). Median = (5 + 15) / 2 = 10.0` });
    steps.push({ array: ["MaxHeap: [5, 1]", "MinHeap: [15]"], log: `Inserted 1 into Max-Heap. Max-Heap has 2 elements. Median = Top(MaxHeap) = 5.0` });
    return steps;
  }

  // 11. Subsets & Backtracking
  genBacktrackingSteps(nums) {
    let steps = [];
    steps.push({ array: ["[]"], log: `Backtracking Base: Start with empty subset [].` });
    steps.push({ array: ["[]", "[1]"], log: `Decision on num=1: Branch with Include(1) -> Subset [1].` });
    steps.push({ array: ["[]", "[1]", "[1,2]", "[2]"], log: `Decision on num=2: Branch with Include(2) -> [1,2] and Exclude(1)+Include(2) -> [2].` });
    steps.push({ array: ["[]", "[1]", "[2]", "[3]", "[1,2]", "[1,3]", "[2,3]", "[1,2,3]"], found: true, log: `🎯 All 2^N = 8 subsets generated via DFS State Space Tree!` });
    return steps;
  }

  // 12. Modified Binary Search
  genBinarySearchSteps(arr, target) {
    let steps = [];
    let l = 0, r = arr.length - 1;
    while (l <= r) {
      let mid = Math.floor((l + r) / 2);
      steps.push({
        array: [...arr],
        left: l,
        right: r,
        mid: mid,
        log: `Binary Search: Low=${l} (${arr[l]}), High=${r} (${arr[r]}), Mid=${mid} (${arr[mid]}). Target=${target}`
      });
      if (arr[mid] === target) {
        steps.push({ array: [...arr], mid: mid, found: true, log: `🎯 Target ${target} found at index ${mid} in O(log N) comparisons!` });
        break;
      } else if (arr[mid] < target) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    return steps;
  }

  // 13. Top K Elements
  genTopKSteps(stream, k) {
    let steps = [];
    steps.push({ array: ["MinHeap Size 0/3: []"], log: `Maintaining Min-Heap of size K=${k} for streaming elements.` });
    steps.push({ array: ["MinHeap: [3, 5, 10]"], log: `Pushed 3, 10, 5 into Min-Heap (Capacity full = 3).` });
    steps.push({ array: ["MinHeap: [5, 10, 20]"], log: `Element 20 > Top (3): Popped 3, Pushed 20. Current Top 3: [5, 10, 20].` });
    steps.push({ array: ["MinHeap: [8, 10, 20]"], log: `Element 8 > Top (5): Popped 5, Pushed 8. Top 3 largest: [8, 10, 20].` });
    return steps;
  }

  // 14. K-way Merge
  genKWayMergeSteps(lists) {
    let steps = [];
    steps.push({ array: [...lists], log: `K-way Merge: Initialized Min-Heap with heads of K=3 sorted lists: [2, 3, 1].` });
    steps.push({ array: ["Output: [1]", "Heap: [2, 3]"], log: `Popped smallest (1). Advanced pointer in list 3 to push 3.` });
    steps.push({ array: ["Output: [1, 2]", "Heap: [3, 3, 6]"], log: `Popped smallest (2). Advanced pointer in list 1 to push 6.` });
    steps.push({ array: ["Output: [1, 2, 3, 3, 4, 6, 6, 7, 8]"], found: true, log: `🎯 All lists merged into single sorted stream in O(N log K) time.` });
    return steps;
  }

  // 15. 0/1 Knapsack & DP
  genKnapsackSteps(coins, amount) {
    let steps = [];
    steps.push({ array: ["dp[0]=0", "dp[1..11]=INF"], log: `DP Table initialized. dp[w] = minimum coins to make amount w.` });
    steps.push({ array: ["Coin=1: dp[1]=1", "dp[2]=2", "dp[5]=5"], log: `Processed Coin 1: All amounts up to 11 can be formed with coin 1.` });
    steps.push({ array: ["Coin=2: dp[2]=1", "dp[4]=2", "dp[6]=3"], log: `Processed Coin 2: Reduced coin count for even amounts.` });
    steps.push({ array: ["Coin=5: dp[5]=1", "dp[10]=2", "dp[11]=3"], found: true, log: `🎯 Target Amount 11: dp[11] = 1 + dp[6] = 3 coins (5 + 5 + 1). Optimal!` });
    return steps;
  }

  // 16. Topological Sort
  genTopologicalSortSteps(courses) {
    let steps = [];
    steps.push({ array: [...courses], log: `Kahn's Algorithm: Computed In-Degrees. CS101 has In-Degree = 0 (No prerequisites).` });
    steps.push({ array: ["Queue: [CS101]", "Order: []"], log: `Pushed CS101 to queue. Processing course...` });
    steps.push({ array: ["Order: [CS101, CS102]", "Queue: [DataStruct]"], log: `Prerequisites met: In-Degree of CS102 and DataStruct decremented to 0.` });
    steps.push({ array: ["Order: [CS101, CS102, DataStruct, Algorithms, AdvancedDSA]"], found: true, log: `🎯 Valid Course Schedule Topological Order found with 0 dependency conflicts!` });
    return steps;
  }

  // 17. Shortest Paths (Dijkstra)
  genShortestPathSteps(nodes) {
    let steps = [];
    steps.push({ array: ["dist[0]=0", "dist[1..4]=INF"], log: `Dijkstra Init: Source Node 0 distance = 0. Priority queue initialized.` });
    steps.push({ array: ["dist[0]=0", "dist[1]=2", "dist[2]=4"], log: `Relaxed edges from Node 0: dist[1]=2, dist[2]=4. Min distance vertex = 1.` });
    steps.push({ array: ["dist[0]=0", "dist[1]=2", "dist[2]=3", "dist[3]=7"], log: `Relaxed edges from Node 1: Updated dist[2] = 2 + 1 = 3 (shorter than 4).` });
    steps.push({ array: ["dist[0]=0", "dist[1]=2", "dist[2]=3", "dist[3]=4", "dist[4]=6"], found: true, log: `🎯 Shortest paths from source to all nodes finalized in O((V + E) log V).` });
    return steps;
  }

  // 18. Disjoint Set Union (DSU)
  genDsuSteps(elements) {
    let steps = [];
    steps.push({ array: elements.map(e => `Parent(${e})=${e}`), log: `DSU Init: Each element is its own representative set (5 disjoint components).` });
    steps.push({ array: ["Union(1,2): Set {1,2}", "Set {3}", "Set {4}", "Set {5}"], log: `Connected edge (1, 2): Root of 2 points to 1. Components = 4.` });
    steps.push({ array: ["Union(2,3): Set {1,2,3}", "Set {4}", "Set {5}"], log: `Connected edge (2, 3): Find(2)=1, Find(3)=3 -> Union to root 1 with path compression.` });
    steps.push({ array: ["Cycle Detected on edge (1,3): Find(1)==Find(3)==1!"], found: true, log: `🎯 Redundant Connection / Cycle detected in O(α(N)) near-constant time!` });
    return steps;
  }

  // 19. Longest Common Subsequence
  genLcsSteps(s1, s2) {
    let steps = [];
    steps.push({ array: [`s1: "${s1}"`, `s2: "${s2}"`], log: `2D DP Matrix LCS Init: s1="ABCDE", s2="ACE". dp[i][j] = length of LCS.` });
    steps.push({ array: ["Match 'A' == 'A'", "dp[1][1] = 1 + dp[0][0] = 1"], log: `Characters match at index 0 ('A'). Added 1 to common subsequence length.` });
    steps.push({ array: ["Match 'C' == 'C'", "dp[3][2] = 1 + dp[2][1] = 2"], log: `Characters match at index 2 ('C'). LCS so far = "AC" (len=2).` });
    steps.push({ array: ["Match 'E' == 'E'", "dp[5][3] = 1 + dp[4][2] = 3"], found: true, log: `🎯 LCS completed: Subsequence = "ACE", Total Length = 3.` });
    return steps;
  }

  // 20. Longest Increasing Subsequence
  genLisSteps(arr) {
    let steps = [];
    steps.push({ array: [...arr], log: `LIS Patience Sorting: Tracking active tail smallest ends.` });
    steps.push({ array: ["Tails: [10]"], log: `Element 10: Initialized tails = [10].` });
    steps.push({ array: ["Tails: [9]"], log: `Element 9: 9 < 10 -> Replaced 10 with 9 for optimal greedy extension.` });
    steps.push({ array: ["Tails: [2, 5, 7, 18]"], found: true, log: `🎯 Optimal LIS length = 4 (e.g. [2, 5, 7, 18]) computed in O(N log N) time.` });
    return steps;
  }

  // 21. Matrix & Grid DP
  genGridDpSteps(r, c) {
    let steps = [];
    steps.push({ array: ["(0,0)=1", "(0,1)=1", "(0,2)=1"], log: `Top row base cases: Only 1 unique path moving strictly rightward.` });
    steps.push({ array: ["(1,0)=1", "(1,1)=2", "(1,2)=3"], log: `Cell (1,1) = Paths(0,1) + Paths(1,0) = 1 + 1 = 2 paths.` });
    steps.push({ array: ["(2,0)=1", "(2,1)=3", "(2,2)=6"], found: true, log: `🎯 Bottom-Right Cell (2,2) reached: Total Unique Paths = 6.` });
    return steps;
  }

  // 22. Interval & Bitmask DP
  genBitmaskSteps(cities) {
    let steps = [];
    steps.push({ array: ["Mask: 0001 (Visited A)"], log: `Bitmask Initialized: City A visited. Mask bit 0 is set.` });
    steps.push({ array: ["Mask: 0011 (Visited A, B)"], log: `Transition to City B: Cost added. Mask = mask | (1 << 1).` });
    steps.push({ array: ["Mask: 1111 (All 4 Cities Visited)"], found: true, log: `🎯 Full tour completed! Optimal TSP min cost computed in O(N^2 * 2^N) time.` });
    return steps;
  }

  // 23. Trie
  genTrieSteps(word, dict) {
    let steps = [];
    steps.push({ array: ["Root -> NULL"], log: `Trie Root Node Initialized (26 empty child pointers).` });
    steps.push({ array: ["Root -> 'a' -> 'p' -> 'p' (isEnd=true)"], log: `Inserted 'app': Created child edges for 'a', 'p', 'p'. Marked isEnd.` });
    steps.push({ array: ["Root -> 'a' -> 'p' -> 'p' -> 'l' -> 'e' (isEnd=true)"], found: true, log: `🎯 Inserted 'apple'. Search('app'): FOUND, StartsWith('app'): TRUE.` });
    return steps;
  }

  // 24. String Matching (KMP)
  genKmpSteps(text, pattern) {
    let steps = [];
    steps.push({ array: [`Text: "${text.substring(0, 10)}..."`, `Pattern: "${pattern}"`], log: `KMP Preprocessing: Computed LPS (Longest Prefix Suffix) table.` });
    steps.push({ array: ["Mismatch at index 4 ('D' != 'C')"], log: `Mismatch occurred. Instead of resetting to start, KMP jumped pointer using LPS[3] = 2!` });
    steps.push({ array: ["Text index 10: Full Match 'ABABCABAB'"], found: true, log: `🎯 Pattern found at index 10 with ZERO character backtracking in O(N + M) time!` });
    return steps;
  }

  // 25. Bit Manipulation
  genBitManipulationSteps(nums) {
    let steps = [];
    let xor = 0;
    steps.push({ array: [...nums], log: `Single Number Identification via XOR. Property: X ^ X = 0, X ^ 0 = X.` });
    for (let x of nums) {
      xor ^= x;
      steps.push({ array: [...nums], log: `XOR cumulative state after element ${x}: 0x${xor.toString(16)} (${xor})` });
    }
    steps.push({ array: [...nums], found: true, log: `🎯 Duplicate pairs canceled out to 0. Unique Single Element = ${xor}!` });
    return steps;
  }

  // 26. Segment Tree & Fenwick Tree
  genSegmentTreeSteps(arr) {
    let steps = [];
    steps.push({ array: ["Root [0..5]: Sum=36"], log: `Segment Tree Built: Root node stores sum of full range [0..5] = 36.` });
    steps.push({ array: ["LeftChild [0..2]: 9", "RightChild [3..5]: 27"], log: `Binary Range Division: Left range [0..2]=9, Right range [3..5]=27.` });
    steps.push({ array: ["Query Range [1..4]: Sum = 3+5+7+9 = 24"], found: true, log: `🎯 Range Query [1..4] resolved in O(log N) node visits! Point Update in O(log N).` });
    return steps;
  }

  renderControls() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="visualizer-container">
        <div class="visualizer-controls">
          <button class="viz-btn viz-btn-primary" id="viz-play-btn"><i class="fas fa-play"></i> Play</button>
          <button class="viz-btn" id="viz-prev-btn"><i class="fas fa-step-backward"></i> Prev</button>
          <button class="viz-btn" id="viz-next-btn"><i class="fas fa-step-forward"></i> Next</button>
          <button class="viz-btn" id="viz-reset-btn"><i class="fas fa-redo"></i> Reset</button>
          <span style="margin-left: auto; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);" id="viz-step-counter">Step 1 / ${this.steps.length}</span>
        </div>
        <div class="viz-canvas" id="viz-canvas"></div>
        <div class="viz-log" id="viz-log-text"></div>
      </div>
    `;

    document.getElementById("viz-play-btn").addEventListener("click", () => this.togglePlay());
    document.getElementById("viz-prev-btn").addEventListener("click", () => this.stepPrev());
    document.getElementById("viz-next-btn").addEventListener("click", () => this.stepNext());
    document.getElementById("viz-reset-btn").addEventListener("click", () => this.reset());
  }

  renderCurrentStep() {
    if (!this.steps || this.steps.length === 0) return;
    let step = this.steps[this.currentStepIndex];
    let canvas = document.getElementById("viz-canvas");
    let logText = document.getElementById("viz-log-text");
    let counter = document.getElementById("viz-step-counter");

    if (counter) counter.innerText = `Step ${this.currentStepIndex + 1} / ${this.steps.length}`;
    if (logText) logText.innerText = step.log;

    if (!canvas) return;

    let html = "";
    if (step.array) {
      step.array.forEach((val, idx) => {
        let classes = ["viz-element"];
        let label = "";

        if (step.left === idx) {
          classes.push("active-left");
          label += `<span class="viz-pointer-label pointer-left">Left</span>`;
        }
        if (step.right === idx) {
          classes.push("active-right");
          label += `<span class="viz-pointer-label pointer-right">Right</span>`;
        }
        if (step.slow === idx) {
          classes.push("active-left");
          label += `<span class="viz-pointer-label pointer-slow">Slow (1x)</span>`;
        }
        if (step.fast === idx) {
          classes.push("active-right");
          label += `<span class="viz-pointer-label pointer-fast">Fast (2x)</span>`;
        }
        if (step.mid === idx) {
          classes.push("active-amber");
          label += `<span class="viz-pointer-label pointer-mid">Mid</span>`;
        }
        if (step.prev === idx) {
          classes.push("active-purple");
          label += `<span class="viz-pointer-label pointer-prev">Prev</span>`;
        }
        if (step.curr === idx) {
          classes.push("active-left");
          label += `<span class="viz-pointer-label pointer-curr">Curr</span>`;
        }
        if (step.windowStart !== undefined && idx >= step.windowStart && idx <= step.windowEnd) {
          classes.push("in-window");
        }
        if (step.currentIndex === idx) {
          classes.push("active-left");
          label += `<span class="viz-pointer-label pointer-curr">Active</span>`;
        }
        if (step.resolvedIndex === idx) {
          classes.push("active-right");
        }
        if (step.found) {
          classes.push("in-window");
        }

        html += `<div class="${classes.join(" ")}">${val}${label}</div>`;
      });
    }
    canvas.innerHTML = html;
  }

  stepNext() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.stop();
    }
  }

  stepPrev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    }
  }

  reset() {
    this.stop();
    this.currentStepIndex = 0;
    this.renderCurrentStep();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    let playBtn = document.getElementById("viz-play-btn");
    if (playBtn) playBtn.innerHTML = `<i class="fas fa-pause"></i> Pause`;

    this.timer = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.stepNext();
      } else {
        this.stop();
      }
    }, 1200);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearInterval(this.timer);
    let playBtn = document.getElementById("viz-play-btn");
    if (playBtn) playBtn.innerHTML = `<i class="fas fa-play"></i> Play`;
  }
}

window.AlgorithmVisualizer = AlgorithmVisualizer;
