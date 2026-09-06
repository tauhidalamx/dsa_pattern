/**
 * @file part2.js
 * @brief Patterns 07 to 13: Real distinct C++ solutions and 27+ practice questions.
 */

const PATTERNS_PART_2 = [
  // ==========================================
  // PATTERN 07: IN-PLACE LINKED LIST REVERSAL
  // ==========================================
  {
    id: "07_inplace_linked_list_reversal",
    num: "07",
    name: "In-Place Linked List Reversal",
    category: "Linked List",
    difficulty: "Easy to Hard",
    badge: "Core",
    shortDesc: "Rewire next pointers iteratively in O(N) time and O(1) space to reverse single nodes, sub-lists, or K-groups.",
    theory: {
      what: "Reversing linked lists by reassigning next pointers without allocating new node objects or modifying values.",
      when: ["Reversing an entire linked list.", "Reversing nodes between positions Left and Right.", "Reversing nodes in contiguous K-sized groups."],
      coreIdea: "Maintain three pointers: prev, curr, and next_node. Save next_node = curr->next, redirect curr->next = prev, advance prev = curr, and move curr = next_node.",
      edgeCases: ["Empty list or single node.", "K larger than list length."]
    },
    diagram: `graph LR
    P[prev] --> C[curr]
    C --> N[next_node]
    C -.->|curr->next = prev| P`,
    visualizerType: "linked_list",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };

ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode *nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
      brute: `// Stack-based Reversal O(N) Space`,
      template: `// 3-Pointer Reversal Loop
ListNode *prev = nullptr, *curr = head;
while (curr) {
    ListNode *nxt = curr->next;
    curr->next = prev;
    prev = curr;
    curr = nxt;
}`
    },
    solutions: [
      {
        title: "1. Reverse Linked List (LC 206)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Iteratively redirect curr->next to prev and advance pointers.",
        cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode *nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`
      },
      {
        title: "2. Reverse Linked List II - Sub-list (LC 92)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Reach node prior to 'left'. Iteratively move subsequent nodes to the front of sublist.",
        cpp: `ListNode* reverseBetween(ListNode* head, int left, int right) {
    if (!head || left == right) return head;
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    for (int i = 1; i < left; ++i) prev = prev->next;
    ListNode* curr = prev->next;
    for (int i = 0; i < right - left; ++i) {
        ListNode* temp = curr->next;
        curr->next = temp->next;
        temp->next = prev->next;
        prev->next = temp;
    }
    return dummy.next;
}`
      },
      {
        title: "3. Reverse Nodes in k-Group (LC 25)",
        diff: "Hard",
        time: "O(N)",
        space: "O(1)",
        intuition: "Verify if at least K nodes remain. Reverse K nodes and recursively attach next group.",
        cpp: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* curr = head;
    int count = 0;
    while (curr && count < k) { curr = curr->next; count++; }
    if (count == k) {
        ListNode *prev = nullptr, *c = head;
        for (int i = 0; i < k; ++i) {
            ListNode *nxt = c->next;
            c->next = prev; prev = c; c = nxt;
        }
        head->next = reverseKGroup(curr, k);
        return prev;
    }
    return head;
}`
      },
      {
        title: "4. Rotate List by K (LC 61)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Form circular ring by connecting tail to head. Break the ring at node (N - K % N).",
        cpp: `ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next || k == 0) return head;
    int len = 1;
    ListNode* tail = head;
    while (tail->next) { tail = tail->next; len++; }
    tail->next = head; // Form ring
    k = k % len;
    int steps = len - k;
    while (steps--) tail = tail->next;
    ListNode* new_head = tail->next;
    tail->next = nullptr; // Break ring
    return new_head;
}`
      },
      {
        title: "5. Swapping Nodes in a Linked List (LC 1721)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Find K-th node from start, and advance a second pointer from head as fast reaches end.",
        cpp: `ListNode* swapNodes(ListNode* head, int k) {
    ListNode *n1 = nullptr, *n2 = nullptr, *curr = head;
    for (int i = 1; i < k; ++i) curr = curr->next;
    n1 = curr;
    ListNode *fast = curr->next;
    n2 = head;
    while (fast) { fast = fast->next; n2 = n2->next; }
    swap(n1->val, n2->val);
    return head;
}`
      },
      {
        title: "6. Palindrome Linked List (LC 234)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Find midpoint, reverse second half in-place, and compare both halves sequentially.",
        cpp: `bool isPalindrome(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
    ListNode *prev = nullptr, *curr = slow->next;
    while (curr) { ListNode *nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }
    ListNode *p1 = head, *p2 = prev;
    while (p2) {
        if (p1->val != p2->val) return false;
        p1 = p1->next; p2 = p2->next;
    }
    return true;
}`
      },
      {
        title: "7. Reorder List (LC 143)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Split list in half, reverse second half, and interleave nodes alternatingly.",
        cpp: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
    ListNode *prev = nullptr, *curr = slow->next; slow->next = nullptr;
    while (curr) { ListNode *nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }
    ListNode *p1 = head, *p2 = prev;
    while (p2) {
        ListNode *t1 = p1->next, *t2 = p2->next;
        p1->next = p2; p2->next = t1;
        p1 = t1; p2 = t2;
    }
}`
      }
    ],
    problems: [
      { name: "Reverse Linked List", diff: "Easy", lc: "206", company: "Google, Amazon, Meta, Microsoft" },
      { name: "Reverse Linked List II (Sub-list)", diff: "Medium", lc: "92", company: "Meta, Amazon" },
      { name: "Reverse Nodes in k-Group", diff: "Hard", lc: "25", company: "Google, Meta, Amazon, Microsoft" },
      { name: "Swapping Nodes in a Linked List", diff: "Medium", lc: "1721", company: "Amazon" },
      { name: "Rotate List", diff: "Medium", lc: "61", company: "Amazon, Meta" },
      { name: "Reorder List", diff: "Medium", lc: "143", company: "Meta, Google" },
      { name: "Palindrome Linked List", diff: "Easy", lc: "234", company: "Meta, Amazon" },
      { name: "Swap Nodes in Pairs", diff: "Medium", lc: "24", company: "Amazon, Microsoft" },
      { name: "Odd Even Linked List", diff: "Medium", lc: "328", company: "Microsoft, Google" },
      { name: "Reverse Alternate K Nodes", diff: "Medium", lc: "GFG", company: "Amazon" },
      { name: "Add Two Numbers", diff: "Medium", lc: "2", company: "Amazon, Meta" },
      { name: "Add Two Numbers II", diff: "Medium", lc: "445", company: "Microsoft" },
      { name: "Partition List", diff: "Medium", lc: "86", company: "Meta" },
      { name: "Split Linked List in Parts", diff: "Medium", lc: "725", company: "Google" },
      { name: "Maximum Twin Sum of a Linked List", diff: "Medium", lc: "2130", company: "Meta, Amazon" },
      { name: "Double a Number Represented as Linked List", diff: "Medium", lc: "2816", company: "Amazon" },
      { name: "Merge Nodes in Between Zeros", diff: "Medium", lc: "2181", company: "Google" },
      { name: "Insert Greatest Common Divisors in Linked List", diff: "Medium", lc: "2807", company: "Google" },
      { name: "Delete the Middle Node of a Linked List", diff: "Medium", lc: "2095", company: "Google" },
      { name: "Linked List in Binary Tree", diff: "Medium", lc: "1367", company: "Amazon" },
      { name: "Flatten a Multilevel Doubly Linked List", diff: "Medium", lc: "430", company: "Bloomberg" },
      { name: "Copy List with Random Pointer", diff: "Medium", lc: "138", company: "Amazon, Meta" },
      { name: "Sort List (Merge Sort on LinkedList)", diff: "Medium", lc: "148", company: "Google, Meta" },
      { name: "Remove Nth Node From End of List", diff: "Medium", lc: "19", company: "Amazon, Google" },
      { name: "Delete Node in a Linked List", diff: "Easy", lc: "237", company: "Adobe, Apple" },
      { name: "Intersection of Two Linked Lists", diff: "Easy", lc: "160", company: "Microsoft, Amazon" },
      { name: "Merge Two Sorted Lists", diff: "Easy", lc: "21", company: "Google, Amazon" }
    ]
  },

  // ==========================================
  // PATTERN 08: MODIFIED BINARY SEARCH
  // ==========================================
  {
    id: "08_binary_search_answer",
    num: "08",
    name: "Binary Search & Search on Answer",
    category: "Binary Search",
    difficulty: "Medium to Hard",
    badge: "Must Master",
    shortDesc: "Halve search space in O(log N) on sorted data or monotonic feasibility functions f(x).",
    theory: {
      what: "Binary Search eliminates half the remaining search space per iteration. Beyond sorted arrays, it optimizes monotonic predicate functions f(mid) -> true/false.",
      when: ["Finding target in sorted or rotated arrays.", "Minimizing maximum or maximizing minimum answers.", "Finding peak elements or median."],
      coreIdea: "Identify a monotonic predicate: if speed mid is feasible, all speeds > mid are also feasible. Binary search over answer domain [low, high].",
      edgeCases: ["Integer overflow in (low + high) / 2 (use low + (high - low) / 2).", "Infinite loop when low == high."]
    },
    diagram: `graph TD
    A["Search Space: [low ... high]"] --> B["mid = low + (high - low) / 2"]
    B --> C{is_feasible(mid)?}
    C -->|True| D["ans = mid; high = mid - 1"]
    C -->|False| E["low = mid + 1"]`,
    visualizerType: "binary_search",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

int minEatingSpeed(const vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end()), ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    return ans;
}`,
      brute: `// Linear scan: O(N * max_pile)`,
      template: `// Binary Search on Answer Template
int low = min_val, high = max_val, ans = -1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (isValid(mid)) { ans = mid; high = mid - 1; }
    else low = mid + 1;
}`
    },
    solutions: [
      {
        title: "1. Binary Search Baseline (LC 704)",
        diff: "Easy",
        time: "O(log N)",
        space: "O(1)",
        intuition: "Compare mid element with target. Narrow search range to left or right half.",
        cpp: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`
      },
      {
        title: "2. Search in Rotated Sorted Array (LC 33)",
        diff: "Medium",
        time: "O(log N)",
        space: "O(1)",
        intuition: "At least one half [l..mid] or [mid..r] is always sorted. Check if target lies within sorted half.",
        cpp: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) return mid;
        if (nums[l] <= nums[mid]) {
            if (target >= nums[l] && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    return -1;
}`
      },
      {
        title: "3. Find Peak Element (LC 162)",
        diff: "Medium",
        time: "O(log N)",
        space: "O(1)",
        intuition: "Follow the rising slope: if nums[mid] < nums[mid + 1], a peak must exist in right half.",
        cpp: `int findPeakElement(vector<int>& nums) {
    int l = 0, r = nums.size() - 1;
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] < nums[mid + 1]) l = mid + 1;
        else r = mid;
    }
    return l;
}`
      },
      {
        title: "4. Koko Eating Bananas (LC 875)",
        diff: "Medium",
        time: "O(N log(max_pile))",
        space: "O(1)",
        intuition: "Binary search eating speed K in range [1, max(piles)]. Feasibility check takes O(N).",
        cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int l = 1, r = *max_element(piles.begin(), piles.end()), ans = r;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) { ans = mid; r = mid - 1; }
        else l = mid + 1;
    }
    return ans;
}`
      },
      {
        title: "5. Capacity To Ship Packages Within D Days (LC 1011)",
        diff: "Medium",
        time: "O(N log(sum - max))",
        space: "O(1)",
        intuition: "Search capacity between max(weights) and sum(weights). Check if capacity ships packages in <= days.",
        cpp: `int shipWithinDays(vector<int>& weights, int days) {
    int l = *max_element(weights.begin(), weights.end());
    int r = accumulate(weights.begin(), weights.end(), 0), ans = r;
    while (l <= r) {
        int cap = l + (r - l) / 2;
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        if (d <= days) { ans = cap; r = cap - 1; }
        else l = cap + 1;
    }
    return ans;
}`
      },
      {
        title: "6. Split Array Largest Sum (LC 410)",
        diff: "Hard",
        time: "O(N log(sum))",
        space: "O(1)",
        intuition: "Binary search on the maximum subarray sum threshold. Minimize the maximum sum in K splits.",
        cpp: `int splitArray(vector<int>& nums, int k) {
    long long l = *max_element(nums.begin(), nums.end());
    long long r = accumulate(nums.begin(), nums.end(), 0LL), ans = r;
    while (l <= r) {
        long long mid = l + (r - l) / 2;
        int splits = 1; long long cur = 0;
        for (int x : nums) {
            if (cur + x > mid) { splits++; cur = 0; }
            cur += x;
        }
        if (splits <= k) { ans = mid; r = mid - 1; }
        else l = mid + 1;
    }
    return ans;
}`
      },
      {
        title: "7. Median of Two Sorted Arrays (LC 4)",
        diff: "Hard",
        time: "O(log(min(N, M)))",
        space: "O(1)",
        intuition: "Binary search partition in smaller array such that left half max elements <= right half min elements.",
        cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
    int m = nums1.size(), n = nums2.size();
    int l = 0, r = m;
    while (l <= r) {
        int p1 = l + (r - l) / 2;
        int p2 = (m + n + 1) / 2 - p1;
        int maxL1 = (p1 == 0) ? INT_MIN : nums1[p1 - 1];
        int minR1 = (p1 == m) ? INT_MAX : nums1[p1];
        int maxL2 = (p2 == 0) ? INT_MIN : nums2[p2 - 1];
        int minR2 = (p2 == n) ? INT_MAX : nums2[p2];
        if (maxL1 <= minR2 && maxL2 <= minR1) {
            if ((m + n) % 2 == 0) return (max(maxL1, maxL2) + min(minR1, minR2)) / 2.0;
            else return max(maxL1, maxL2);
        } else if (maxL1 > minR2) r = p1 - 1;
        else l = p1 + 1;
    }
    return 0.0;
}`
      }
    ],
    problems: [
      { name: "Binary Search", diff: "Easy", lc: "704", company: "Google, Amazon" },
      { name: "Search in Rotated Sorted Array", diff: "Medium", lc: "33", company: "Meta, Google, Amazon, Microsoft" },
      { name: "Find Peak Element", diff: "Medium", lc: "162", company: "Meta, Google, Amazon" },
      { name: "Koko Eating Bananas", diff: "Medium", lc: "875", company: "Google, Amazon, Meta" },
      { name: "Capacity To Ship Packages Within D Days", diff: "Medium", lc: "1011", company: "Amazon, Google" },
      { name: "Split Array Largest Sum", diff: "Hard", lc: "410", company: "Google, Amazon" },
      { name: "Median of Two Sorted Arrays", diff: "Hard", lc: "4", company: "Google, Amazon, Meta, Microsoft" },
      { name: "Search Insert Position", diff: "Easy", lc: "35", company: "Google, Apple" },
      { name: "Find First and Last Position of Element in Sorted Array", diff: "Medium", lc: "34", company: "Meta, Amazon" },
      { name: "Find Minimum in Rotated Sorted Array", diff: "Medium", lc: "153", company: "Microsoft, Amazon" },
      { name: "Single Element in a Sorted Array", diff: "Medium", lc: "540", company: "Google, Amazon" },
      { name: "Search a 2D Matrix", diff: "Medium", lc: "74", company: "Amazon, Meta" },
      { name: "Search a 2D Matrix II", diff: "Medium", lc: "240", company: "Amazon, Google" },
      { name: "Aggressive Cows (Maximize Min Distance)", diff: "Medium", lc: "GFG", company: "Google" },
      { name: "Painter's Partition Problem", diff: "Medium", lc: "GFG", company: "Google, Amazon" },
      { name: "Book Allocation Problem", diff: "Medium", lc: "GFG", company: "Google, Microsoft" },
      { name: "Magnetic Force Between Two Balls", diff: "Medium", lc: "1552", company: "Amazon" },
      { name: "Minimum Limit of Balls in a Bag", diff: "Medium", lc: "1760", company: "Google" },
      { name: "Find the Smallest Divisor Given a Threshold", diff: "Medium", lc: "1283", company: "Google" },
      { name: "Maximum Running Time of N Computers", diff: "Hard", lc: "2141", company: "Google" },
      { name: "Missing Element in Sorted Array", diff: "Medium", lc: "1060", company: "Meta" },
      { name: "H-Index II", diff: "Medium", lc: "275", company: "Amazon" },
      { name: "Count of Range Sum (BIT / Binary Search)", diff: "Hard", lc: "327", company: "Google" },
      { name: "Search in Rotated Sorted Array II (With Duplicates)", diff: "Medium", lc: "81", company: "Amazon" },
      { name: "Find Minimum in Rotated Sorted Array II", diff: "Hard", lc: "154", company: "Amazon" },
      { name: "Divide Two Integers Without / or *", diff: "Medium", lc: "29", company: "Meta" },
      { name: "Square Root (x)", diff: "Easy", lc: "69", company: "Apple, Google" }
    ]
  },

  // ==========================================
  // PATTERN 09: TREE BFS & DFS
  // ==========================================
  {
    id: "09_tree_bfs_dfs",
    num: "09",
    name: "Tree Traversals (BFS / DFS)",
    category: "Trees",
    difficulty: "Easy to Hard",
    badge: "Core",
    shortDesc: "Level-order queue processing (BFS) and recursive/stack depth explorations (DFS) over hierarchical structures.",
    theory: {
      what: "BFS processes nodes level-by-level using a FIFO queue. DFS explores root-to-leaf paths using pre/in/post-order recursion or an explicit stack.",
      when: ["Level-by-level processing, shortest path in tree, tree views.", "Path sums, Lowest Common Ancestor (LCA), tree diameter."],
      coreIdea: "Post-order traversal allows bottom-up aggregation of subtree metrics (height, diameter, validity).",
      edgeCases: ["Empty root (nullptr).", "Skewed tree (stack overflow)."]
    },
    diagram: `graph TD
    Root((1)) --> L((2))
    Root --> R((3))
    L --> LL((4))
    L --> LR((5))
    R --> RL((6))
    R --> RR((7))`,
    visualizerType: "tree",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x): val(x), left(nullptr), right(nullptr) {} };

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      brute: `// DFS Recursive level order`,
      template: `// BFS Level-Order Queue Template
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    int sz = q.size();
    for (int i = 0; i < sz; ++i) {
        TreeNode* curr = q.front(); q.pop();
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
}`
    },
    solutions: [
      {
        title: "1. Binary Tree Level Order Traversal (LC 102)",
        diff: "Medium",
        time: "O(N)",
        space: "O(W)",
        intuition: "Queue FIFO processing with level size tracking.",
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        res.push_back(level);
    }
    return res;
}`
      },
      {
        title: "2. Binary Tree Right Side View (LC 199)",
        diff: "Medium",
        time: "O(N)",
        space: "O(W)",
        intuition: "In level-order traversal, the last element in each level queue is visible from the right side.",
        cpp: `vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        for (int i = 0; i < sz; ++i) {
            TreeNode* n = q.front(); q.pop();
            if (i == sz - 1) res.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return res;
}`
      },
      {
        title: "3. Diameter of Binary Tree (LC 543)",
        diff: "Easy",
        time: "O(N)",
        space: "O(H)",
        intuition: "Post-order DFS: compute max depth of left and right subtrees. Diameter at node is left_depth + right_depth.",
        cpp: `int max_d = 0;
int height(TreeNode* root) {
    if (!root) return 0;
    int lh = height(root->left), rh = height(root->right);
    max_d = max(max_d, lh + rh);
    return 1 + max(lh, rh);
}
int diameterOfBinaryTree(TreeNode* root) {
    max_d = 0;
    height(root);
    return max_d;
}`
      },
      {
        title: "4. Lowest Common Ancestor of a Binary Tree (LC 236)",
        diff: "Medium",
        time: "O(N)",
        space: "O(H)",
        intuition: "If root equals p or q, return root. If both left and right subtrees return non-null, root is the LCA.",
        cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
      },
      {
        title: "5. Path Sum III (LC 437)",
        diff: "Medium",
        time: "O(N)",
        space: "O(H)",
        intuition: "Prefix sum + Hash map on Tree DFS. Count paths summing to target in O(N).",
        cpp: `int count = 0;
unordered_map<long long, int> pref;
void dfs(TreeNode* node, long long cur, int target) {
    if (!node) return;
    cur += node->val;
    count += pref[cur - target];
    pref[cur]++;
    dfs(node->left, cur, target);
    dfs(node->right, cur, target);
    pref[cur]--;
}
int pathSum(TreeNode* root, int targetSum) {
    count = 0; pref.clear(); pref[0] = 1;
    dfs(root, 0, targetSum);
    return count;
}`
      },
      {
        title: "6. Binary Tree Maximum Path Sum (LC 124)",
        diff: "Hard",
        time: "O(N)",
        space: "O(H)",
        intuition: "Post-order DFS: each node returns max single branch contribution (ignoring negatives). Global max tracks node + left + right.",
        cpp: `int max_sum = INT_MIN;
int maxGain(TreeNode* node) {
    if (!node) return 0;
    int left_gain = max(maxGain(node->left), 0);
    int right_gain = max(maxGain(node->right), 0);
    max_sum = max(max_sum, node->val + left_gain + right_gain);
    return node->val + max(left_gain, right_gain);
}
int maxPathSum(TreeNode* root) {
    max_sum = INT_MIN;
    maxGain(root);
    return max_sum;
}`
      },
      {
        title: "7. Serialize and Deserialize Binary Tree (LC 297)",
        diff: "Hard",
        time: "O(N)",
        space: "O(N)",
        intuition: "Pre-order traversal with '#' for nullptr. Deserialize using stringstream queue reconstruction.",
        cpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "#,";
        return to_string(root->val) + "," + serialize(root->left) + serialize(root->right);
    }
    TreeNode* deserialize(string data) {
        stringstream ss(data);
        string item;
        queue<string> q;
        while (getline(ss, item, ',')) q.push(item);
        return build(q);
    }
private:
    TreeNode* build(queue<string>& q) {
        string s = q.front(); q.pop();
        if (s == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(s));
        node->left = build(q);
        node->right = build(q);
        return node;
    }
};`
      }
    ],
    problems: [
      { name: "Binary Tree Level Order Traversal", diff: "Medium", lc: "102", company: "Amazon, Meta, Google" },
      { name: "Binary Tree Right Side View", diff: "Medium", lc: "199", company: "Meta, Amazon" },
      { name: "Diameter of Binary Tree", diff: "Easy", lc: "543", company: "Meta, Google, Amazon" },
      { name: "Lowest Common Ancestor of Binary Tree", diff: "Medium", lc: "236", company: "Meta, Amazon, Microsoft, Apple" },
      { name: "Path Sum III", diff: "Medium", lc: "437", company: "Amazon, Google" },
      { name: "Binary Tree Maximum Path Sum", diff: "Hard", lc: "124", company: "Meta, Google, Amazon" },
      { name: "Serialize and Deserialize Binary Tree", diff: "Hard", lc: "297", company: "Meta, Amazon, Microsoft" },
      { name: "Maximum Depth of Binary Tree", diff: "Easy", lc: "104", company: "Google, Amazon" },
      { name: "Invert Binary Tree", diff: "Easy", lc: "226", company: "Google, Meta" },
      { name: "Symmetric Tree", diff: "Easy", lc: "101", company: "Amazon, Microsoft" },
      { name: "Balanced Binary Tree", diff: "Easy", lc: "110", company: "Google, Amazon" },
      { name: "Binary Tree Zigzag Level Order Traversal", diff: "Medium", lc: "103", company: "Amazon, Microsoft" },
      { name: "Populating Next Right Pointers in Each Node", diff: "Medium", lc: "116", company: "Meta, Amazon" },
      { name: "Construct Binary Tree from Preorder and Inorder", diff: "Medium", lc: "105", company: "Amazon, Google" },
      { name: "Flatten Binary Tree to Linked List", diff: "Medium", lc: "114", company: "Meta, Amazon" },
      { name: "Binary Tree Cameras", diff: "Hard", lc: "968", company: "Google" },
      { name: "Vertical Order Traversal of Binary Tree", diff: "Hard", lc: "987", company: "Meta, Amazon" },
      { name: "Boundary of Binary Tree", diff: "Medium", lc: "545", company: "Amazon" },
      { name: "All Nodes Distance K in Binary Tree", diff: "Medium", lc: "863", company: "Meta, Amazon" },
      { name: "Count Complete Tree Nodes", diff: "Medium", lc: "222", company: "Google" },
      { name: "Sum Root to Leaf Numbers", diff: "Medium", lc: "129", company: "Meta" },
      { name: "Path Sum II", diff: "Medium", lc: "113", company: "Amazon" },
      { name: "Step-By-Step Directions From Binary Tree Node to Another", diff: "Medium", lc: "2096", company: "Google" },
      { name: "Delete Nodes And Return Forest", diff: "Medium", lc: "1110", company: "Google" },
      { name: "Distribute Coins in Binary Tree", diff: "Medium", lc: "979", company: "Google" },
      { name: "Maximum Width of Binary Tree", diff: "Medium", lc: "662", company: "Amazon" },
      { name: "Recover Binary Search Tree", diff: "Medium", lc: "99", company: "Amazon" }
    ]
  },

  // ==========================================
  // PATTERNS 10 - 13
  // ==========================================
  {
    id: "10_two_heaps_top_k",
    num: "10",
    name: "Two Heaps & Top-K Elements",
    category: "Heap / Priority Queue",
    difficulty: "Medium to Hard",
    badge: "Streaming",
    shortDesc: "Balance Max-Heap and Min-Heap to track running medians, or use a size-K Min-Heap to find top K elements.",
    theory: {
      what: "Two Heaps maintain dynamic partitioning of data into a lower half (Max-Heap) and upper half (Min-Heap). A size-K Min-Heap filters top K largest elements in O(N log K).",
      when: ["Finding median from continuous data streams.", "Top K frequent or Kth largest elements.", "Task scheduling."],
      coreIdea: "Maintaining max_heap.size() == min_heap.size() (+1) allows O(1) median queries with O(log N) inserts.",
      edgeCases: ["Rebalancing when sizes differ by > 1.", "Even vs odd count."]
    },
    diagram: `graph TD
    A[Data Stream] --> B["Max-Heap (Lower 50%)"]
    A --> C["Min-Heap (Upper 50%)"]
    B <-->|Rebalance size diff <= 1| C
    B --> M["Median = Top or Avg(Tops)"]
    C --> M`,
    visualizerType: "two_heaps",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
class MedianFinder {
    priority_queue<int> max_h;
    priority_queue<int, vector<int>, greater<int>> min_h;
public:
    void addNum(int num) {
        if (max_h.empty() || num <= max_h.top()) max_h.push(num);
        else min_h.push(num);
        if (max_h.size() > min_h.size() + 1) { min_h.push(max_h.top()); max_h.pop(); }
        else if (min_h.size() > max_h.size()) { max_h.push(min_h.top()); min_h.pop(); }
    }
    double findMedian() {
        return max_h.size() > min_h.size() ? max_h.top() : (max_h.top() + min_h.top()) / 2.0;
    }
};`,
      brute: `// Sorting on every query: O(N log N)`,
      template: `// Top K Elements with Min-Heap
priority_queue<int, vector<int>, greater<int>> min_heap;
for (int x : nums) {
    min_heap.push(x);
    if (min_heap.size() > k) min_heap.pop();
}`
    },
    solutions: [
      {
        title: "1. Kth Largest Element in an Array (LC 215)",
        diff: "Medium",
        time: "O(N log K)",
        space: "O(K)",
        intuition: "Maintain min-heap of size K. The root will always store the Kth largest element.",
        cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if (pq.size() > k) pq.pop();
    }
    return pq.top();
}`
      },
      {
        title: "2. Top K Frequent Elements (LC 347)",
        diff: "Medium",
        time: "O(N log K)",
        space: "O(N)",
        intuition: "Count frequencies in hash map. Push pairs {freq, val} into min-heap of size K.",
        cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    for (auto [val, f] : freq) {
        pq.push({f, val});
        if (pq.size() > k) pq.pop();
    }
    vector<int> res;
    while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }
    return res;
}`
      },
      {
        title: "3. Find Median from Data Stream (LC 295)",
        diff: "Hard",
        time: "O(log N) insert, O(1) query",
        space: "O(N)",
        intuition: "Max-heap stores lower half, min-heap stores upper half. Rebalance to maintain equal sizes.",
        cpp: `class MedianFinder {
    priority_queue<int> max_h;
    priority_queue<int, vector<int>, greater<int>> min_h;
public:
    void addNum(int num) {
        if (max_h.empty() || num <= max_h.top()) max_h.push(num);
        else min_h.push(num);
        if (max_h.size() > min_h.size() + 1) { min_h.push(max_h.top()); max_h.pop(); }
        else if (min_h.size() > max_h.size()) { max_h.push(min_h.top()); min_h.pop(); }
    }
    double findMedian() {
        return max_h.size() > min_h.size() ? max_h.top() : (max_h.top() + min_h.top()) / 2.0;
    }
};`
      },
      {
        title: "4. Merge k Sorted Lists (LC 23)",
        diff: "Hard",
        time: "O(N log K)",
        space: "O(K)",
        intuition: "Min-heap stores node pointers from the head of each list. Pop smallest node and insert its next node.",
        cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto l : lists) if (l) pq.push(l);
    ListNode dummy(0); ListNode* tail = &dummy;
    while (!pq.empty()) {
        ListNode* top = pq.top(); pq.pop();
        tail->next = top; tail = tail->next;
        if (top->next) pq.push(top->next);
    }
    return dummy.next;
}`
      },
      {
        title: "5. Task Scheduler (LC 621)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Formula based on most frequent task: (max_freq - 1) * (n + 1) + count(max_freq_tasks).",
        cpp: `int leastInterval(vector<char>& tasks, int n) {
    vector<int> freq(26, 0);
    for (char c : tasks) freq[c - 'A']++;
    int max_f = *max_element(freq.begin(), freq.end());
    int max_count = count(freq.begin(), freq.end(), max_f);
    int empty_slots = (max_f - 1) * (n + 1) + max_count;
    return max((int)tasks.size(), empty_slots);
}`
      },
      {
        title: "6. IPO - Maximize Capital (LC 502)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Sort projects by capital requirement. Push available projects' profits into max-heap to pick most profitable.",
        cpp: `int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n = profits.size();
    vector<pair<int, int>> projects(n);
    for (int i = 0; i < n; ++i) projects[i] = {capital[i], profits[i]};
    sort(projects.begin(), projects.end());
    priority_queue<int> max_p;
    int i = 0;
    while (k--) {
        while (i < n && projects[i].first <= w) max_p.push(projects[i++].second);
        if (max_p.empty()) break;
        w += max_p.top(); max_p.pop();
    }
    return w;
}`
      },
      {
        title: "7. Reorganize String (LC 767)",
        diff: "Medium",
        time: "O(N log Sigma)",
        space: "O(Sigma)",
        intuition: "Max-heap of character frequencies. Greedily place the two most frequent distinct characters adjacent to each other.",
        cpp: `string reorganizeString(string s) {
    vector<int> freq(26, 0);
    for (char c : s) freq[c - 'a']++;
    priority_queue<pair<int, char>> pq;
    for (int i = 0; i < 26; ++i) if (freq[i]) pq.push({freq[i], 'a' + i});
    string res = "";
    while (pq.size() >= 2) {
        auto [f1, c1] = pq.top(); pq.pop();
        auto [f2, c2] = pq.top(); pq.pop();
        res += c1; res += c2;
        if (--f1 > 0) pq.push({f1, c1});
        if (--f2 > 0) pq.push({f2, c2});
    }
    if (!pq.empty()) {
        if (pq.top().first > 1) return "";
        res += pq.top().second;
    }
    return res;
}`
      }
    ],
    problems: [
      { name: "Kth Largest Element in an Array", diff: "Medium", lc: "215", company: "Meta, Amazon, Google" },
      { name: "Top K Frequent Elements", diff: "Medium", lc: "347", company: "Amazon, Meta, Google" },
      { name: "Find Median from Data Stream", diff: "Hard", lc: "295", company: "Google, Amazon, Meta, Microsoft" },
      { name: "Merge k Sorted Lists", diff: "Hard", lc: "23", company: "Meta, Amazon, Google, Microsoft" },
      { name: "Task Scheduler", diff: "Medium", lc: "621", company: "Meta, Amazon" },
      { name: "IPO (Capital Maximizer)", diff: "Hard", lc: "502", company: "Google, Amazon" },
      { name: "Reorganize String", diff: "Medium", lc: "767", company: "Amazon, Google" },
      { name: "K Closest Points to Origin", diff: "Medium", lc: "973", company: "Meta, Amazon" },
      { name: "Sort Characters By Frequency", diff: "Medium", lc: "451", company: "Amazon, Bloomberg" },
      { name: "Find K Closest Elements", diff: "Medium", lc: "658", company: "Google, Meta" },
      { name: "Sliding Window Median", diff: "Hard", lc: "480", company: "Meta, Google" },
      { name: "Find K Pairs with Smallest Sums", diff: "Medium", lc: "373", company: "Google, Amazon" },
      { name: "Kth Smallest Element in a Sorted Matrix", diff: "Medium", lc: "378", company: "Amazon, Google" },
      { name: "Last Stone Weight", diff: "Easy", lc: "1046", company: "Amazon" },
      { name: "Maximum Product of Two Elements in Array", diff: "Easy", lc: "1464", company: "Google" },
      { name: "Seat Reservation Manager", diff: "Medium", lc: "1845", company: "Amazon" },
      { name: "Minimum Cost to Connect Sticks", diff: "Medium", lc: "1167", company: "Amazon" },
      { name: "Design Twitter", diff: "Medium", lc: "355", company: "Twitter, Amazon" },
      { name: "Smallest Range Covering Elements from K Lists", diff: "Hard", lc: "632", company: "Google" },
      { name: "Maximum Subsequence Score", diff: "Medium", lc: "2542", company: "Amazon" },
      { name: "Total Cost to Hire K Workers", diff: "Medium", lc: "2462", company: "Google" },
      { name: "Single-Threaded CPU", diff: "Medium", lc: "1834", company: "Google" },
      { name: "Course Schedule III (Greedy Heap)", diff: "Hard", lc: "630", company: "Google" },
      { name: "Construct Target Array With Multiple Sums", diff: "Hard", lc: "1354", company: "Google" },
      { name: "Furthest Building You Can Reach", diff: "Medium", lc: "1642", company: "Google" },
      { name: "Minimum Deletions to Make Character Frequencies Unique", diff: "Medium", lc: "1647", company: "Microsoft" },
      { name: "Process Tasks Using Servers", diff: "Medium", lc: "1882", company: "Google" }
    ]
  },

  {
    id: "11_backtracking_subsets",
    num: "11",
    name: "Subsets, Permutations & Backtracking",
    category: "Backtracking",
    difficulty: "Medium to Hard",
    badge: "Exhaustive",
    shortDesc: "Systematically explore state-space search trees using the Choose -> Explore -> Undo paradigm.",
    theory: {
      what: "Backtracking incrementally builds candidate solutions and abandons (prunes) branches as soon as validity is violated.",
      when: ["Generating all subsets, combinations, or permutations.", "Constraint satisfaction (N-Queens, Sudoku).", "Partitioning (Palindrome Partitioning)."],
      coreIdea: "Choose a branch -> Recurse down -> Undo the state change on return.",
      edgeCases: ["Duplicate choices causing duplicate solutions.", "Missing undo step before sibling branch."]
    },
    diagram: `graph TD
    Root["[]"] --> A["[1]"]
    Root --> B["[2]"]
    A --> A1["[1,2]"]`,
    visualizerType: "backtracking",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
void backtrack(int start, const vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);
    for (int i = start; i < (int)nums.size(); ++i) {
        curr.push_back(nums[i]);
        backtrack(i + 1, nums, curr, res);
        curr.pop_back();
    }
}`,
      brute: `// Cascading Power Set`,
      template: `// Backtracking Template
void backtrack(State& st, int idx) {
    if (goal(st)) { res.push_back(st); return; }
    for (auto choice : choices) {
        if (valid(choice)) {
            apply(choice); backtrack(st, next); undo(choice);
        }
    }
}`
    },
    solutions: [
      {
        title: "1. Subsets (Power Set - LC 78)",
        diff: "Medium",
        time: "O(N * 2^N)",
        space: "O(N)",
        intuition: "At each step, add current subset to result. Loop from start to n-1 to explore extending subsets.",
        cpp: `void backtrack(int start, vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);
    for (int i = start; i < (int)nums.size(); ++i) {
        curr.push_back(nums[i]);
        backtrack(i + 1, nums, curr, res);
        curr.pop_back();
    }
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res; vector<int> curr;
    backtrack(0, nums, curr, res);
    return res;
}`
      },
      {
        title: "2. Subsets II (With Duplicates - LC 90)",
        diff: "Medium",
        time: "O(N * 2^N)",
        space: "O(N)",
        intuition: "Sort array. Skip duplicate adjacent elements in the same loop iteration (`if (i > start && nums[i] == nums[i-1]) continue;`).",
        cpp: `void backtrack(int start, vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);
    for (int i = start; i < (int)nums.size(); ++i) {
        if (i > start && nums[i] == nums[i - 1]) continue;
        curr.push_back(nums[i]);
        backtrack(i + 1, nums, curr, res);
        curr.pop_back();
    }
}
vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res; vector<int> curr;
    backtrack(0, nums, curr, res);
    return res;
}`
      },
      {
        title: "3. Permutations (LC 46)",
        diff: "Medium",
        time: "O(N * N!)",
        space: "O(N)",
        intuition: "Backtrack by swapping elements in-place to construct all N! permutations.",
        cpp: `void backtrack(int start, vector<int>& nums, vector<vector<int>>& res) {
    if (start == (int)nums.size()) { res.push_back(nums); return; }
    for (int i = start; i < (int)nums.size(); ++i) {
        swap(nums[start], nums[i]);
        backtrack(start + 1, nums, res);
        swap(nums[start], nums[i]);
    }
}
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> res;
    backtrack(0, nums, res);
    return res;
}`
      },
      {
        title: "4. Combination Sum (LC 39)",
        diff: "Medium",
        time: "O(2^T)",
        space: "O(T/min)",
        intuition: "Can reuse the same element: pass index `i` (not `i + 1`) to recursive call. Prune when remaining target < 0.",
        cpp: `void backtrack(int start, int target, vector<int>& candidates, vector<int>& curr, vector<vector<int>>& res) {
    if (target == 0) { res.push_back(curr); return; }
    for (int i = start; i < (int)candidates.size(); ++i) {
        if (candidates[i] > target) continue;
        curr.push_back(candidates[i]);
        backtrack(i, target - candidates[i], candidates, curr, res);
        curr.pop_back();
    }
}
vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> res; vector<int> curr;
    backtrack(0, target, candidates, curr, res);
    return res;
}`
      },
      {
        title: "5. Word Search in Grid (LC 79)",
        diff: "Medium",
        time: "O(M * N * 3^L)",
        space: "O(L)",
        intuition: "DFS from each cell matching first char. Temporarily mark grid[r][c] = '#' to avoid revisiting during path search.",
        cpp: `bool dfs(int r, int c, int idx, vector<vector<char>>& board, string& word) {
    if (idx == (int)word.size()) return true;
    if (r < 0 || r >= (int)board.size() || c < 0 || c >= (int)board[0].size() || board[r][c] != word[idx]) return false;
    char temp = board[r][c];
    board[r][c] = '#';
    bool found = dfs(r+1, c, idx+1, board, word) || dfs(r-1, c, idx+1, board, word) ||
                 dfs(r, c+1, idx+1, board, word) || dfs(r, c-1, idx+1, board, word);
    board[r][c] = temp;
    return found;
}
bool exist(vector<vector<char>>& board, string word) {
    for (size_t i = 0; i < board.size(); ++i)
        for (size_t j = 0; j < board[0].size(); ++j)
            if (dfs(i, j, 0, board, word)) return true;
    return false;
}`
      },
      {
        title: "6. Palindrome Partitioning (LC 131)",
        diff: "Medium",
        time: "O(N * 2^N)",
        space: "O(N)",
        intuition: "If prefix s[start..i] is a palindrome, choose it and backtrack on remainder s[i+1..n-1].",
        cpp: `bool isPal(string& s, int l, int r) {
    while (l < r) if (s[l++] != s[r--]) return false;
    return true;
}
void backtrack(int start, string& s, vector<string>& curr, vector<vector<string>>& res) {
    if (start == (int)s.size()) { res.push_back(curr); return; }
    for (int i = start; i < (int)s.size(); ++i) {
        if (isPal(s, start, i)) {
            curr.push_back(s.substr(start, i - start + 1));
            backtrack(i + 1, s, curr, res);
            curr.pop_back();
        }
    }
}
vector<vector<string>> partition(string s) {
    vector<vector<string>> res; vector<string> curr;
    backtrack(0, s, curr, res);
    return res;
}`
      },
      {
        title: "7. N-Queens (LC 51)",
        diff: "Hard",
        time: "O(N!)",
        space: "O(N)",
        intuition: "Row by row placement. Track occupied columns, main diagonals (r + c), and anti-diagonals (r - c + n) using boolean vectors.",
        cpp: `void solve(int r, int n, vector<string>& board, vector<bool>& cols, vector<bool>& d1, vector<bool>& d2, vector<vector<string>>& res) {
    if (r == n) { res.push_back(board); return; }
    for (int c = 0; c < n; ++c) {
        if (cols[c] || d1[r + c] || d2[r - c + n]) continue;
        board[r][c] = 'Q'; cols[c] = d1[r + c] = d2[r - c + n] = true;
        solve(r + 1, n, board, cols, d1, d2, res);
        board[r][c] = '.'; cols[c] = d1[r + c] = d2[r - c + n] = false;
    }
}
vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<string> board(n, string(n, '.'));
    vector<bool> cols(n, false), d1(2*n, false), d2(2*n, false);
    solve(0, n, board, cols, d1, d2, res);
    return res;
}`
      }
    ],
    problems: [
      { name: "Subsets", diff: "Medium", lc: "78", company: "Meta, Amazon, Google" },
      { name: "Subsets II", diff: "Medium", lc: "90", company: "Amazon, Meta" },
      { name: "Permutations", diff: "Medium", lc: "46", company: "Meta, Amazon, Microsoft" },
      { name: "Permutations II", diff: "Medium", lc: "47", company: "Google, Amazon" },
      { name: "Combination Sum", diff: "Medium", lc: "39", company: "Google, Meta, Amazon" },
      { name: "Combination Sum II", diff: "Medium", lc: "40", company: "Meta, Amazon" },
      { name: "Combination Sum III", diff: "Medium", lc: "216", company: "Google, Amazon" },
      { name: "Word Search", diff: "Medium", lc: "79", company: "Amazon, Meta, Google" },
      { name: "Palindrome Partitioning", diff: "Medium", lc: "131", company: "Google, Amazon" },
      { name: "N-Queens", diff: "Hard", lc: "51", company: "Meta, Amazon, Microsoft" },
      { name: "N-Queens II", diff: "Hard", lc: "52", company: "Amazon" },
      { name: "Sudoku Solver", diff: "Hard", lc: "37", company: "Google, Meta" },
      { name: "Generate Parentheses", diff: "Medium", lc: "22", company: "Amazon, Meta, Google" },
      { name: "Letter Combinations of a Phone Number", diff: "Medium", lc: "17", company: "Amazon, Google" },
      { name: "Restore IP Addresses", diff: "Medium", lc: "93", company: "Amazon, Google" },
      { name: "Word Break II", diff: "Hard", lc: "140", company: "Amazon, Google" },
      { name: "Target Sum", diff: "Medium", lc: "494", company: "Meta, Google" },
      { name: "Matchsticks to Square", diff: "Medium", lc: "473", company: "Google" },
      { name: "Partition to K Equal Sum Subsets", diff: "Medium", lc: "698", company: "Google, Amazon" },
      { name: "Letter Tile Possibilities", diff: "Medium", lc: "1079", company: "Google" },
      { name: "Combinations (n choose k)", diff: "Medium", lc: "77", company: "Google" },
      { name: "Beautiful Arrangement", diff: "Medium", lc: "526", company: "Google" },
      { name: "All Paths From Source to Target", diff: "Medium", lc: "797", company: "Amazon" },
      { name: "Find Unique Binary String", diff: "Medium", lc: "1980", company: "Google" },
      { name: "Maximum Length of a Concatenated String with Unique Characters", diff: "Medium", lc: "1239", company: "Google" },
      { name: "Non-decreasing Subsequences", diff: "Medium", lc: "491", company: "Google" },
      { name: "Split a String Into the Max Number of Unique Substrings", diff: "Medium", lc: "1593", company: "Google" }
    ]
  },

  {
    id: "12_graph_bfs_dfs",
    num: "12",
    name: "Graph Traversal & Connected Components",
    category: "Graphs",
    difficulty: "Medium",
    badge: "Core",
    shortDesc: "BFS and DFS over adjacency lists to find connected components, cycles, and shortest paths in unweighted graphs.",
    theory: {
      what: "Graphs represent vertices (nodes) and edges (connections). BFS explores nearest neighbors first; DFS explores depth along each branch.",
      when: ["Connected components (Number of Islands).", "Shortest path in unweighted graphs.", "Cycle detection."],
      coreIdea: "Maintain a visited array or set to avoid infinite loops in cyclic graphs.",
      edgeCases: ["Disconnected components.", "Self loops."]
    },
    diagram: `graph LR
    0((0)) --- 1((1))
    0 --- 2((2))
    1 --- 3((3))`,
    visualizerType: "graph",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
void dfs(int r, int c, vector<vector<char>>& grid) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(r+1, c, grid); dfs(r-1, c, grid); dfs(r, c+1, grid); dfs(r, c-1, grid);
}`,
      brute: `// Explicit set of visited coordinates`,
      template: `// Graph DFS Adjacency List Template
void dfs(int u, const vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v, adj, vis);
}`
    },
    solutions: [
      {
        title: "1. Number of Islands (LC 200)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(M * N)",
        intuition: "Traverse grid. Whenever '1' encountered, increment island count and sink island via DFS/BFS.",
        cpp: `void dfs(int r, int c, vector<vector<char>>& grid) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(r+1, c, grid); dfs(r-1, c, grid); dfs(r, c+1, grid); dfs(r, c-1, grid);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (size_t i = 0; i < grid.size(); ++i)
        for (size_t j = 0; j < grid[0].size(); ++j)
            if (grid[i][j] == '1') { count++; dfs(i, j, grid); }
    return count;
}`
      },
      {
        title: "2. Clone Graph (LC 133)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V)",
        intuition: "DFS with unordered_map<Node*, Node*> mapping original nodes to newly cloned nodes.",
        cpp: `unordered_map<Node*, Node*> clones;
Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    if (clones.count(node)) return clones[node];
    Node* copy = new Node(node->val);
    clones[node] = copy;
    for (Node* neighbor : node->neighbors) copy->neighbors.push_back(cloneGraph(neighbor));
    return copy;
}`
      },
      {
        title: "3. Rotting Oranges - Multi-source BFS (LC 994)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(M * N)",
        intuition: "Queue all initially rotten oranges. Advance time layer by layer, rotting adjacent fresh oranges.",
        cpp: `int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), fresh = 0;
    queue<pair<int, int>> q;
    for (int i = 0; i < m; ++i)
        for (int j = 0; j < n; ++j) {
            if (grid[i][j] == 2) q.push({i, j});
            else if (grid[i][j] == 1) fresh++;
        }
    if (fresh == 0) return 0;
    int mins = -1;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.empty()) {
        mins++;
        int sz = q.size();
        for (int i = 0; i < sz; ++i) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2; fresh--;
                    q.push({nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? mins : -1;
}`
      },
      {
        title: "4. Pacific Atlantic Water Flow (LC 417)",
        diff: "Medium",
        time: "O(M * N)",
        space: "O(M * N)",
        intuition: "Reverse DFS from ocean borders upward to find cells reachable from both Pacific and Atlantic.",
        cpp: `void dfs(int r, int c, vector<vector<bool>>& vis, vector<vector<int>>& heights) {
    vis[r][c] = true;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (auto& d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < (int)heights.size() && nc >= 0 && nc < (int)heights[0].size() &&
            !vis[nr][nc] && heights[nr][nc] >= heights[r][c])
            dfs(nr, nc, vis, heights);
    }
}
vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int m = heights.size(), n = heights[0].size();
    vector<vector<bool>> pac(m, vector<bool>(n, false)), atl(m, vector<bool>(n, false));
    for (int i = 0; i < m; ++i) { dfs(i, 0, pac, heights); dfs(i, n - 1, atl, heights); }
    for (int j = 0; j < n; ++j) { dfs(0, j, pac, heights); dfs(m - 1, j, atl, heights); }
    vector<vector<int>> res;
    for (int i = 0; i < m; ++i)
        for (int j = 0; j < n; ++j)
            if (pac[i][j] && atl[i][j]) res.push_back({i, j});
    return res;
}`
      },
      {
        title: "5. Word Ladder (LC 127)",
        diff: "Hard",
        time: "O(M * N * 26)",
        space: "O(N * M)",
        intuition: "Shortest transformation sequence in unweighted graph: use BFS mutating 1 character at a time.",
        cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (!dict.count(endWord)) return 0;
    queue<string> q; q.push(beginWord);
    int step = 1;
    while (!q.empty()) {
        int sz = q.size();
        for (int i = 0; i < sz; ++i) {
            string w = q.front(); q.pop();
            if (w == endWord) return step;
            for (int j = 0; j < (int)w.size(); ++j) {
                char orig = w[j];
                for (char c = 'a'; c <= 'z'; ++c) {
                    w[j] = c;
                    if (dict.count(w)) { dict.erase(w); q.push(w); }
                }
                w[j] = orig;
            }
        }
        step++;
    }
    return 0;
}`
      },
      {
        title: "6. Shortest Bridge (LC 934)",
        diff: "Medium",
        time: "O(N^2)",
        space: "O(N^2)",
        intuition: "Find first island with DFS and push all its cells into a queue. Run multi-source BFS expanding outward to reach second island.",
        cpp: `int shortestBridge(vector<vector<int>>& grid) {
    int n = grid.size();
    queue<pair<int, int>> q;
    bool found = false;
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] != 1) return;
        grid[r][c] = 2; q.push({r, c});
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
    };
    for (int i = 0; i < n && !found; ++i)
        for (int j = 0; j < n && !found; ++j)
            if (grid[i][j] == 1) { dfs(i, j); found = true; }
    int steps = 0, dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                    if (grid[nr][nc] == 1) return steps;
                    if (grid[nr][nc] == 0) { grid[nr][nc] = 2; q.push({nr, nc}); }
                }
            }
        }
        steps++;
    }
    return -1;
}`
      },
      {
        title: "7. Is Graph Bipartite? (LC 785)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V)",
        intuition: "2-color BFS/DFS: assign alternating colors (1 and -1) to adjacent nodes. If neighbor has same color, graph is not bipartite.",
        cpp: `bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, 0);
    for (int i = 0; i < n; ++i) {
        if (color[i] != 0) continue;
        queue<int> q; q.push(i); color[i] = 1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : graph[u]) {
                if (color[v] == 0) {
                    color[v] = -color[u];
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`
      }
    ],
    problems: [
      { name: "Number of Islands", diff: "Medium", lc: "200", company: "Amazon, Google, Meta, Microsoft" },
      { name: "Clone Graph", diff: "Medium", lc: "133", company: "Meta, Amazon" },
      { name: "Rotting Oranges", diff: "Medium", lc: "994", company: "Amazon, Microsoft" },
      { name: "Pacific Atlantic Water Flow", diff: "Medium", lc: "417", company: "Google, Amazon" },
      { name: "Word Ladder", diff: "Hard", lc: "127", company: "Amazon, Google, Meta" },
      { name: "Shortest Bridge", diff: "Medium", lc: "934", company: "Google" },
      { name: "Is Graph Bipartite?", diff: "Medium", lc: "785", company: "Meta, Amazon" },
      { name: "Max Area of Island", diff: "Medium", lc: "695", company: "Amazon, Google" },
      { name: "Surrounded Regions", diff: "Medium", lc: "130", company: "Google, Amazon" },
      { name: "01 Matrix (Nearest 0 BFS)", diff: "Medium", lc: "542", company: "Google, Amazon" },
      { name: "As Far from Land as Possible", diff: "Medium", lc: "1162", company: "Amazon" },
      { name: "Shortest Path in Binary Matrix", diff: "Medium", lc: "1091", company: "Meta, Amazon" },
      { name: "Number of Enclaves", diff: "Medium", lc: "1020", company: "Google" },
      { name: "Number of Closed Islands", diff: "Medium", lc: "1254", company: "Google" },
      { name: "Reorder Routes to Make All Paths Lead to City Zero", diff: "Medium", lc: "1466", company: "Amazon" },
      { name: "Keys and Rooms", diff: "Medium", lc: "841", company: "Amazon, Google" },
      { name: "Find Eventual Safe States", diff: "Medium", lc: "802", company: "Google" },
      { name: "Time Needed to Inform All Employees", diff: "Medium", lc: "1376", company: "Amazon" },
      { name: "Shortest Path with Alternating Colors", diff: "Medium", lc: "1129", company: "Amazon" },
      { name: "Open the Lock (BFS State Space)", diff: "Medium", lc: "752", company: "Google" },
      { name: "Minimum Jumps to Reach Home", diff: "Medium", lc: "1654", company: "Google" },
      { name: "Word Ladder II", diff: "Hard", lc: "126", company: "Amazon" },
      { name: "Cut Off Trees for Golf Event", diff: "Hard", lc: "675", company: "Amazon" },
      { name: "Making A Large Island", diff: "Hard", lc: "827", company: "Google, Meta" },
      { name: "Longest Increasing Path in a Matrix", diff: "Hard", lc: "329", company: "Google, Meta" },
      { name: "Trapping Rain Water II (2D Min-Heap BFS)", diff: "Hard", lc: "407", company: "Google" },
      { name: "Alien Dictionary (Graph Model)", diff: "Hard", lc: "269", company: "Meta, Google" }
    ]
  },

  {
    id: "13_topological_sort",
    num: "13",
    name: "Topological Sort (Kahn's & DFS)",
    category: "Graphs",
    difficulty: "Medium",
    badge: "DAG Essential",
    shortDesc: "Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every edge u -> v, u comes before v.",
    theory: {
      what: "Topological sorting resolves dependencies in DAGs. Kahn's Algorithm uses in-degrees and a queue; DFS pushes nodes onto a stack in post-order.",
      when: ["Course prerequisite scheduling, package compilation dependencies.", "Detecting cycles in directed graphs."],
      coreIdea: "Nodes with in-degree 0 have no dependencies and can be processed immediately.",
      edgeCases: ["Graph has cycles (topo sort length < V).", "Multiple valid topological orders."]
    },
    diagram: `graph LR
    CS101[CS101 In-deg: 0] --> CS201[CS201 In-deg: 1]
    CS102[CS102 In-deg: 0] --> CS201`,
    visualizerType: "topo_sort",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> in_deg(numCourses, 0);
    for (const auto& e : prerequisites) { adj[e[1]].push_back(e[0]); in_deg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (in_deg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    return (int)order.size() == numCourses ? order : vector<int>{};
}`,
      brute: `// O(V^2) scan for in-degree 0`,
      template: `// Kahn's Algorithm Template
queue<int> q;
for (int i = 0; i < n; ++i) if (in_deg[i] == 0) q.push(i);
while (!q.empty()) {
    int u = q.front(); q.pop(); topo.push_back(u);
    for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
}`
    },
    solutions: [
      {
        title: "1. Course Schedule I - Cycle Detection (LC 207)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V + E)",
        intuition: "Use Kahn's algorithm. If count of processed nodes == numCourses, no cycle exists.",
        cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> in_deg(numCourses, 0);
    for (auto& e : prerequisites) { adj[e[1]].push_back(e[0]); in_deg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (in_deg[i] == 0) q.push(i);
    int processed = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); processed++;
        for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    return processed == numCourses;
}`
      },
      {
        title: "2. Course Schedule II - Order Extraction (LC 210)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V + E)",
        intuition: "Record the exact order in which in-degree 0 nodes are popped from queue.",
        cpp: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> in_deg(numCourses, 0);
    for (auto& e : prerequisites) { adj[e[1]].push_back(e[0]); in_deg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (in_deg[i] == 0) q.push(i);
    vector<int> res;
    while (!q.empty()) {
        int u = q.front(); q.pop(); res.push_back(u);
        for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    return (int)res.size() == numCourses ? res : vector<int>{};
}`
      },
      {
        title: "3. Alien Dictionary (LC 269)",
        diff: "Hard",
        time: "O(Total Characters)",
        space: "O(1) alphabet",
        intuition: "Compare adjacent words to find first differing characters, build DAG, and return topological sort.",
        cpp: `string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> adj;
    unordered_map<char, int> in_deg;
    for (string& w : words) for (char c : w) in_deg[c] = 0;
    for (size_t i = 0; i < words.size() - 1; ++i) {
        string &w1 = words[i], &w2 = words[i+1];
        if (w1.size() > w2.size() && w1.rfind(w2, 0) == 0) return "";
        for (size_t j = 0; j < min(w1.size(), w2.size()); ++j) {
            if (w1[j] != w2[j]) {
                if (!adj[w1[j]].count(w2[j])) {
                    adj[w1[j]].insert(w2[j]);
                    in_deg[w2[j]]++;
                }
                break;
            }
        }
    }
    queue<char> q;
    for (auto [c, deg] : in_deg) if (deg == 0) q.push(c);
    string res = "";
    while (!q.empty()) {
        char u = q.front(); q.pop(); res += u;
        for (char v : adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    return res.size() == in_deg.size() ? res : "";
}`
      },
      {
        title: "4. Minimum Height Trees (LC 310)",
        diff: "Medium",
        time: "O(V)",
        space: "O(V)",
        intuition: "Leaf-trimming topological BFS: trim degree 1 leaf nodes until 1 or 2 centroid roots remain.",
        cpp: `vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    if (n == 1) return {0};
    vector<unordered_set<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].insert(e[1]); adj[e[1]].insert(e[0]); }
    vector<int> leaves;
    for (int i = 0; i < n; ++i) if (adj[i].size() == 1) leaves.push_back(i);
    while (n > 2) {
        n -= leaves.size();
        vector<int> new_leaves;
        for (int leaf : leaves) {
            int neighbor = *adj[leaf].begin();
            adj[neighbor].erase(leaf);
            if (adj[neighbor].size() == 1) new_leaves.push_back(neighbor);
        }
        leaves = new_leaves;
    }
    return leaves;
}`
      },
      {
        title: "5. Sequence Reconstruction (LC 444)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V + E)",
        intuition: "Verify if topological sort is UNIQUE (queue size must be strictly 1 at every step).",
        cpp: `bool sequenceReconstruction(vector<int>& nums, vector<vector<int>>& sequences) {
    int n = nums.size();
    vector<vector<int>> adj(n + 1);
    vector<int> in_deg(n + 1, 0);
    for (auto& seq : sequences) {
        for (size_t i = 0; i < seq.size() - 1; ++i) {
            adj[seq[i]].push_back(seq[i + 1]);
            in_deg[seq[i + 1]]++;
        }
    }
    queue<int> q;
    for (int i = 1; i <= n; ++i) if (in_deg[i] == 0) q.push(i);
    int idx = 0;
    while (!q.empty()) {
        if (q.size() > 1) return false; // Non-unique ordering!
        int u = q.front(); q.pop();
        if (nums[idx++] != u) return false;
        for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    return idx == n;
}`
      },
      {
        title: "6. Find Eventual Safe States (LC 802)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V + E)",
        intuition: "Reverse graph edges and run Kahn's algorithm starting from terminal nodes (out-degree 0).",
        cpp: `vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<vector<int>> rev_adj(n);
    vector<int> in_deg(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : graph[u]) {
            rev_adj[v].push_back(u);
            in_deg[u]++;
        }
    queue<int> q;
    for (int i = 0; i < n; ++i) if (in_deg[i] == 0) q.push(i);
    vector<int> safe;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        safe.push_back(u);
        for (int v : rev_adj[u]) if (--in_deg[v] == 0) q.push(v);
    }
    sort(safe.begin(), safe.end());
    return safe;
}`
      },
      {
        title: "7. Parallel Courses (LC 1136)",
        diff: "Medium",
        time: "O(V + E)",
        space: "O(V + E)",
        intuition: "Layer-by-layer topological BFS: count number of semester steps required to take all courses.",
        cpp: `int minimumSemesters(int n, vector<vector<int>>& relations) {
    vector<vector<int>> adj(n + 1);
    vector<int> in_deg(n + 1, 0);
    for (auto& r : relations) { adj[r[0]].push_back(r[1]); in_deg[r[1]]++; }
    queue<int> q;
    for (int i = 1; i <= n; ++i) if (in_deg[i] == 0) q.push(i);
    int semesters = 0, taken = 0;
    while (!q.empty()) {
        semesters++;
        int sz = q.size();
        while (sz--) {
            int u = q.front(); q.pop(); taken++;
            for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
        }
    }
    return taken == n ? semesters : -1;
}`
      }
    ],
    problems: [
      { name: "Course Schedule", diff: "Medium", lc: "207", company: "Amazon, Google, Meta" },
      { name: "Course Schedule II", diff: "Medium", lc: "210", company: "Amazon, Google, Meta" },
      { name: "Alien Dictionary", diff: "Hard", lc: "269", company: "Meta, Google, Amazon" },
      { name: "Minimum Height Trees", diff: "Medium", lc: "310", company: "Google, Amazon" },
      { name: "Sequence Reconstruction", diff: "Medium", lc: "444", company: "Google" },
      { name: "Find Eventual Safe States", diff: "Medium", lc: "802", company: "Google" },
      { name: "Parallel Courses", diff: "Medium", lc: "1136", company: "Google" },
      { name: "Sort Items by Groups Respecting Dependencies", diff: "Hard", lc: "1203", company: "Google" },
      { name: "Longest Increasing Path in Matrix", diff: "Hard", lc: "329", company: "Google, Meta" },
      { name: "Course Schedule IV (Transitive Prereqs)", diff: "Medium", lc: "1462", company: "Amazon" },
      { name: "Loud and Rich", diff: "Medium", lc: "851", company: "Google" },
      { name: "Build a Matrix With Conditions", diff: "Hard", lc: "2392", company: "Google" },
      { name: "Strange Printer II", diff: "Hard", lc: "1591", company: "Google" },
      { name: "Find All Possible Recipes from Given Supplies", diff: "Medium", lc: "2115", company: "Google" },
      { name: "Parallel Courses II", diff: "Hard", lc: "1494", company: "Google" },
      { name: "Parallel Courses III", diff: "Hard", lc: "2050", company: "Google" },
      { name: "Game of Routes in DAG", diff: "Medium", lc: "GFG", company: "Amazon" },
      { name: "Ancestors of Node in a Directed Acyclic Graph", diff: "Medium", lc: "2192", company: "Google" },
      { name: "Reconstruct Itinerary (Eulerian DFS)", diff: "Hard", lc: "332", company: "Google" },
      { name: "Longest Path in DAG", diff: "Medium", lc: "GFG", company: "Microsoft" },
      { name: "Shortest Path in Directed Acyclic Graph", diff: "Medium", lc: "GFG", company: "Amazon" },
      { name: "Smallest String With Swaps", diff: "Medium", lc: "1202", company: "Amazon" },
      { name: "Count Unreachable Pairs of Nodes", diff: "Medium", lc: "2316", company: "Amazon" },
      { name: "Minimum Cost to Reach City With Tolls", diff: "Medium", lc: "1928", company: "Google" },
      { name: "Cat and Mouse (Game Theory DAG)", diff: "Hard", lc: "913", company: "Google" },
      { name: "Valid Arrangement of Pairs", diff: "Hard", lc: "2097", company: "Google" },
      { name: "Course Schedule V", diff: "Hard", lc: "GFG", company: "Google" }
    ]
  }
];

window.PATTERNS_PART_2 = PATTERNS_PART_2;
