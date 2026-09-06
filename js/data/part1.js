/**
 * @file part1.js
 * @brief Patterns 01 to 06: Real distinct C++ solutions and 27+ practice questions.
 */

const PATTERNS_PART_1 = [
  // ==========================================
  // PATTERN 01: TWO POINTERS
  // ==========================================
  {
    id: "01_two_pointers",
    num: "01",
    name: "Two Pointers Technique",
    category: "Linear & Pointer",
    difficulty: "Easy to Hard",
    badge: "Essential",
    shortDesc: "Converging or parallel pointers navigating sorted arrays/strings in O(N) time with O(1) space.",
    theory: {
      what: "The Two Pointers pattern involves using two integer references (indices) to iterate through a data structure simultaneously. Pointers move toward each other (converging), in the same direction at varying speeds (reader-writer / fast-slow), or outward from a center point.",
      when: [
        "The input is sorted (or sorting it in O(N log N) is acceptable).",
        "Searching for pairs, triplets, or subsegments satisfying a target sum or constraint.",
        "In-place array modifications (removing duplicates, moving zeroes, partition).",
        "Reversing arrays, palindrome verification, or comparing from dual boundaries."
      ],
      coreIdea: "In a sorted sequence, moving the left pointer rightward strictly increases the pair sum, while moving the right pointer leftward strictly decreases it. This monotonic property eliminates candidate pairs in O(1) time per step.",
      edgeCases: [
        "Duplicate elements (must skip duplicate indices in 3Sum to avoid duplicate triplets).",
        "Integer overflow during sum (cast to 1LL * a + b).",
        "Array lengths less than required tuple size (n < 2 or n < 3)."
      ]
    },
    diagram: `graph LR
    A["Left Pointer [i = 0]"] -->|Sum < Target: ++left| B["(arr[left] + arr[right])"]
    C["Right Pointer [j = n-1]"] -->|Sum > Target: --right| B
    B -->|Sum == Target| D["Pair Found!"]`,
    visualizerType: "two_pointers",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSumSorted(const vector<int>& numbers, int target) {
    int left = 0, right = (int)numbers.size() - 1;
    while (left < right) {
        long long sum = 1LL * numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      brute: `// Brute Force: Nested Loops O(N^2)`,
      template: `// Universal Two Pointers Template
int left = 0, right = n - 1;
while (left < right) {
    if (condition(arr[left], arr[right])) {
        process(); left++; right--;
    } else if (should_increase()) {
        left++;
    } else {
        right--;
    }
}`
    },
    solutions: [
      {
        title: "1. Pair with Target Sum (Two Sum II - LC 167)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Place pointers at left = 0 and right = n - 1. If sum < target, advance left. If sum > target, advance right. Guaranteed linear convergence.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0, r = numbers.size() - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return {l + 1, r + 1};
        if (sum < target) l++;
        else r--;
    }
    return {};
}`
      },
      {
        title: "2. Remove Duplicates from Sorted Array (LC 26)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Use reader-writer pointers. 'slow' tracks the write position for unique elements, 'fast' scans forward.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int slow = 0;
    for (size_t fast = 1; fast < nums.size(); ++fast) {
        if (nums[fast] != nums[slow]) {
            nums[++slow] = nums[fast];
        }
    }
    return slow + 1;
}`
      },
      {
        title: "3. Squaring a Sorted Array (LC 977)",
        diff: "Easy",
        time: "O(N)",
        space: "O(N)",
        intuition: "Largest squares come from either extreme left (negative numbers) or extreme right. Fill result array backwards.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> sortedSquares(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n);
    int l = 0, r = n - 1, pos = n - 1;
    while (l <= r) {
        int left_sq = nums[l] * nums[l];
        int right_sq = nums[r] * nums[r];
        if (left_sq > right_sq) {
            res[pos--] = left_sq;
            l++;
        } else {
            res[pos--] = right_sq;
            r--;
        }
    }
    return res;
}`
      },
      {
        title: "4. 3Sum - Triplet Sum to Zero (LC 15)",
        diff: "Medium",
        time: "O(N^2)",
        space: "O(1)",
        intuition: "Sort array. Fix nums[i], then run two pointers on remaining range [i+1, n-1]. Skip duplicates to prevent duplicate triplets.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();
    for (int i = 0; i < n - 2; ++i) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                result.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return result;
}`
      },
      {
        title: "5. Dutch National Flag - Sort Colors (LC 75)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Maintain 3 pointers: low (boundary of 0s), mid (current), high (boundary of 2s). Single pass O(N).",
        cpp: `#include <bits/stdc++.h>
using namespace std;

void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = (int)nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`
      },
      {
        title: "6. Container With Most Water (LC 11)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Area = min(h[l], h[r]) * (r - l). Greedily advance the shorter wall inward because moving taller wall cannot increase capacity.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, max_w = 0;
    while (l < r) {
        int h = min(height[l], height[r]);
        max_w = max(max_w, h * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return max_w;
}`
      },
      {
        title: "7. Trapping Rain Water (LC 42)",
        diff: "Hard",
        time: "O(N)",
        space: "O(1)",
        intuition: "Maintain left_max and right_max. Whichever side is shorter dictates trapped water at that boundary.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int trap(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int l_max = 0, r_max = 0, total = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= l_max) l_max = height[l];
            else total += l_max - height[l];
            l++;
        } else {
            if (height[r] >= r_max) r_max = height[r];
            else total += r_max - height[r];
            r--;
        }
    }
    return total;
}`
      }
    ],
    problems: [
      { name: "Two Sum II (Sorted Array)", diff: "Easy", lc: "167", company: "Google, Amazon, Meta" },
      { name: "Remove Duplicates from Sorted Array", diff: "Easy", lc: "26", company: "Microsoft, Apple" },
      { name: "Squares of a Sorted Array", diff: "Easy", lc: "977", company: "Meta, Google" },
      { name: "Valid Palindrome", diff: "Easy", lc: "125", company: "Meta, Microsoft" },
      { name: "Move Zeroes", diff: "Easy", lc: "283", company: "Meta, Amazon" },
      { name: "Reverse String", diff: "Easy", lc: "344", company: "Apple, Adobe" },
      { name: "Reverse Vowels of a String", diff: "Easy", lc: "345", company: "Google, Amazon" },
      { name: "Valid Palindrome II (At Most 1 Delete)", diff: "Easy", lc: "680", company: "Meta, Microsoft" },
      { name: "Sort Array By Parity", diff: "Easy", lc: "905", company: "Amazon, Google" },
      { name: "Long Pressed Name", diff: "Easy", lc: "925", company: "Google" },
      { name: "3Sum (Unique Triplets)", diff: "Medium", lc: "15", company: "Meta, Apple, Microsoft" },
      { name: "3Sum Closest", diff: "Medium", lc: "16", company: "Amazon, Google" },
      { name: "3Sum Smaller", diff: "Medium", lc: "259", company: "Google, Meta" },
      { name: "4Sum", diff: "Medium", lc: "18", company: "Amazon, Microsoft" },
      { name: "Sort Colors (Dutch National Flag)", diff: "Medium", lc: "75", company: "Microsoft, Amazon" },
      { name: "Container With Most Water", diff: "Medium", lc: "11", company: "Amazon, Google, Meta" },
      { name: "Subarrays with Product Less than Target", diff: "Medium", lc: "713", company: "Google, Meta" },
      { name: "Boats to Save People", diff: "Medium", lc: "881", company: "Amazon, Uber" },
      { name: "Interval List Intersections", diff: "Medium", lc: "986", company: "Meta, Uber" },
      { name: "Bag of Tokens", diff: "Medium", lc: "948", company: "Google" },
      { name: "Rotate Array (3 Reversals)", diff: "Medium", lc: "189", company: "Microsoft, Amazon" },
      { name: "Valid Triangle Number", diff: "Medium", lc: "611", company: "Amazon, Bloomberg" },
      { name: "Partition Labels", diff: "Medium", lc: "763", company: "Amazon, Google" },
      { name: "Shortest Unsorted Continuous Subarray", diff: "Medium", lc: "581", company: "Google, Meta" },
      { name: "Trapping Rain Water", diff: "Hard", lc: "42", company: "Google, Amazon, Meta, Apple" },
      { name: "Backspacing String Compare", diff: "Easy", lc: "844", company: "Google, Meta" },
      { name: "4Sum II (Count Tuples)", diff: "Medium", lc: "454", company: "Amazon, Apple" }
    ]
  },

  // ==========================================
  // PATTERN 02: SLIDING WINDOW
  // ==========================================
  {
    id: "02_sliding_window",
    num: "02",
    name: "Sliding Window Technique",
    category: "Linear & Pointer",
    difficulty: "Medium to Hard",
    badge: "High Frequency",
    shortDesc: "Maintain a dynamic or fixed contiguous window to optimize subarray/substring queries from O(N^2) to O(N).",
    theory: {
      what: "The Sliding Window technique tracks a contiguous subsegment [window_start, window_end] across an array or string. Elements enter from the right (expansion) and exit from the left (shrinkage) based on constraint validity.",
      when: [
        "Finding longest/shortest subarray or substring satisfying a monotonic condition.",
        "Fixed length K problems (e.g. maximum sum of any subarray of size K).",
        "String matching with character frequencies (anagrams, permutations, minimum window)."
      ],
      coreIdea: "Instead of recalculating state for every subarray from scratch in O(K), reuse the state from the previous window by adding the new element and subtracting the evicted element in O(1).",
      edgeCases: [
        "Negative numbers in sum constraints (invalidates monotonic expansion; use Prefix Sum + Monotonic Deque).",
        "Character frequency reaching 0 (must explicitly erase key from map or handle zero count).",
        "Window size larger than array size (guard condition k > n)."
      ]
    },
    diagram: `graph TD
    A[Expand Window: ++window_end] --> B{Is Window Valid?}
    B -->|Yes| C[Update Global Answer / Max Length]
    B -->|No| D[Shrink Window: ++window_start until Valid]
    D --> B
    C --> A`,
    visualizerType: "sliding_window",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    vector<int> last_seen(128, -1);
    int window_start = 0, max_len = 0;
    for (int window_end = 0; window_end < (int)s.size(); ++window_end) {
        char c = s[window_end];
        if (last_seen[(unsigned char)c] >= window_start) {
            window_start = last_seen[(unsigned char)c] + 1;
        }
        last_seen[(unsigned char)c] = window_end;
        max_len = max(max_len, window_end - window_start + 1);
    }
    return max_len;
}`,
      brute: `// Brute Force: Check all substrings O(N^2)`,
      template: `// Dynamic Sliding Window Template
int window_start = 0;
for (int window_end = 0; window_end < n; ++window_end) {
    add_to_state(arr[window_end]);
    while (is_invalid()) {
        remove_from_state(arr[window_start]);
        window_start++;
    }
    update_best(window_end - window_start + 1);
}`
    },
    solutions: [
      {
        title: "1. Maximum Sum Subarray of Size K (LC 643)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Maintain fixed window of size K. Add incoming element and subtract outgoing element.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

double findMaxAverage(vector<int>& nums, int k) {
    double sum = 0;
    for (int i = 0; i < k; ++i) sum += nums[i];
    double max_sum = sum;
    for (size_t i = k; i < nums.size(); ++i) {
        sum += nums[i] - nums[i - k];
        max_sum = max(max_sum, sum);
    }
    return max_sum / k;
}`
      },
      {
        title: "2. Smallest Subarray with a Given Sum (LC 209)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Expand window until sum >= target. Shrink from start to find minimum length while maintaining sum >= target.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int minSubArrayLen(int target, vector<int>& nums) {
    int start = 0, sum = 0, min_len = INT_MAX;
    for (int end = 0; end < (int)nums.size(); ++end) {
        sum += nums[end];
        while (sum >= target) {
            min_len = min(min_len, end - start + 1);
            sum -= nums[start++];
        }
    }
    return min_len == INT_MAX ? 0 : min_len;
}`
      },
      {
        title: "3. Longest Substring Without Repeating Characters (LC 3)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Store last seen index of each char. On duplicate, jump start pointer to last_seen + 1.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    vector<int> last(128, -1);
    int start = 0, max_l = 0;
    for (int i = 0; i < (int)s.size(); ++i) {
        if (last[s[i]] >= start) start = last[s[i]] + 1;
        last[s[i]] = i;
        max_l = max(max_l, i - start + 1);
    }
    return max_l;
}`
      },
      {
        title: "4. Longest Repeating Character Replacement (LC 424)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Window is valid if (window_length - max_char_freq <= k). Otherwise shrink window.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int characterReplacement(string s, int k) {
    vector<int> freq(26, 0);
    int start = 0, max_f = 0, max_len = 0;
    for (int end = 0; end < (int)s.size(); ++end) {
        max_f = max(max_f, ++freq[s[end] - 'A']);
        if ((end - start + 1) - max_f > k) {
            freq[s[start++] - 'A']--;
        }
        max_len = max(max_len, end - start + 1);
    }
    return max_len;
}`
      },
      {
        title: "5. Max Consecutive Ones III (LC 1004)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Track count of 0s in current window. Shrink window whenever zero count exceeds k.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int longestOnes(vector<int>& nums, int k) {
    int start = 0, zeros = 0, max_len = 0;
    for (int end = 0; end < (int)nums.size(); ++end) {
        if (nums[end] == 0) zeros++;
        while (zeros > k) {
            if (nums[start++] == 0) zeros--;
        }
        max_len = max(max_len, end - start + 1);
    }
    return max_len;
}`
      },
      {
        title: "6. Permutation in String (LC 567)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Use fixed window of size s1.length() and compare 26-char frequency vectors in O(1).",
        cpp: `#include <bits/stdc++.h>
using namespace std;

bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    vector<int> f1(26, 0), f2(26, 0);
    for (size_t i = 0; i < s1.size(); ++i) {
        f1[s1[i] - 'a']++;
        f2[s2[i] - 'a']++;
    }
    if (f1 == f2) return true;
    for (size_t i = s1.size(); i < s2.size(); ++i) {
        f2[s2[i] - 'a']++;
        f2[s2[i - s1.size()] - 'a']--;
        if (f1 == f2) return true;
    }
    return false;
}`
      },
      {
        title: "7. Minimum Window Substring (LC 76)",
        diff: "Hard",
        time: "O(N + M)",
        space: "O(1)",
        intuition: "Track required char counts and matched unique chars. Shrink left pointer whenever window is valid.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

string minWindow(string s, string t) {
    vector<int> req(128, 0), cur(128, 0);
    int unique = 0;
    for (char c : t) { if (req[c]++ == 0) unique++; }
    int start = 0, matched = 0, min_l = INT_MAX, best_s = 0;
    for (int end = 0; end < (int)s.size(); ++end) {
        if (++cur[s[end]] == req[s[end]] && req[s[end]] > 0) matched++;
        while (matched == unique) {
            if (end - start + 1 < min_l) {
                min_l = end - start + 1;
                best_s = start;
            }
            if (--cur[s[start]] < req[s[start]] && req[s[start]] > 0) matched--;
            start++;
        }
    }
    return min_l == INT_MAX ? "" : s.substr(best_s, min_l);
}`
      }
    ],
    problems: [
      { name: "Maximum Average Subarray I", diff: "Easy", lc: "643", company: "Google, Amazon" },
      { name: "Diet Plan Performance", diff: "Easy", lc: "1176", company: "Amazon" },
      { name: "Minimum Size Subarray Sum", diff: "Medium", lc: "209", company: "Meta, Google" },
      { name: "Longest Substring Without Repeating Characters", diff: "Medium", lc: "3", company: "Amazon, Google, Meta" },
      { name: "Fruit Into Baskets", diff: "Medium", lc: "904", company: "Google, Amazon" },
      { name: "Longest Repeating Character Replacement", diff: "Medium", lc: "424", company: "Google, Amazon" },
      { name: "Max Consecutive Ones III", diff: "Medium", lc: "1004", company: "Meta, Google" },
      { name: "Permutation in String", diff: "Medium", lc: "567", company: "Microsoft, Amazon" },
      { name: "Find All Anagrams in a String", diff: "Medium", lc: "438", company: "Amazon, Meta" },
      { name: "Longest Substring with at Most K Distinct Characters", diff: "Medium", lc: "340", company: "Google, Meta" },
      { name: "Subarray Product Less Than K", diff: "Medium", lc: "713", company: "Google, Meta" },
      { name: "Max Consecutive Ones II", diff: "Medium", lc: "487", company: "Google" },
      { name: "Grumpy Bookstore Owner", diff: "Medium", lc: "1052", company: "Amazon, Google" },
      { name: "Get Equal Substrings Within Budget", diff: "Medium", lc: "1208", company: "Google" },
      { name: "Number of Substrings Containing All Three Characters", diff: "Medium", lc: "1358", company: "Amazon" },
      { name: "Maximum Points You Can Obtain from Cards", diff: "Medium", lc: "1423", company: "Google" },
      { name: "Maximum Number of Vowels in Substring", diff: "Medium", lc: "1456", company: "Amazon" },
      { name: "Longest Subarray of 1s After Deleting One Element", diff: "Medium", lc: "1493", company: "Google" },
      { name: "Minimum Operations to Reduce X to Zero", diff: "Medium", lc: "1658", company: "Google" },
      { name: "Frequency of the Most Frequent Element", diff: "Medium", lc: "1838", company: "Amazon" },
      { name: "Binary Subarrays With Sum", diff: "Medium", lc: "930", company: "Meta" },
      { name: "Count Number of Nice Subarrays", diff: "Medium", lc: "1248", company: "Amazon" },
      { name: "Minimum Window Substring", diff: "Hard", lc: "76", company: "Meta, Google, Uber" },
      { name: "Subarrays with K Different Integers", diff: "Hard", lc: "992", company: "Amazon, Google" },
      { name: "Sliding Window Maximum", diff: "Hard", lc: "239", company: "Amazon, Google" },
      { name: "Shortest Subarray with Sum at Least K", diff: "Hard", lc: "862", company: "Google, Meta" },
      { name: "Minimum Window Subsequence", diff: "Hard", lc: "727", company: "Google" }
    ]
  },

  // ==========================================
  // PATTERN 03: FAST & SLOW POINTERS
  // ==========================================
  {
    id: "03_fast_slow_pointers",
    num: "03",
    name: "Fast & Slow Pointers (Floyd's Algorithm)",
    category: "Linear & Pointer",
    difficulty: "Easy to Medium",
    badge: "Classic",
    shortDesc: "Pointers moving at different velocities (1x and 2x) to detect cycles and identify midpoints in O(1) space.",
    theory: {
      what: "The slow pointer advances 1 step while the fast pointer advances 2 steps per iteration.",
      when: ["Detecting cycles in linked lists or state spaces.", "Finding cycle entry point.", "Locating middle node."],
      coreIdea: "Within a cycle of length C, the relative gap decreases by 1 each step, ensuring collision within C steps.",
      edgeCases: ["Empty or 1-node list.", "Null pointer dereference (check fast && fast->next)."]
    },
    diagram: `graph LR
    Head((Head)) --> N1((Node 1)) --> Entry((Cycle Entry)) --> C1((Cycle Node)) --> Entry`,
    visualizerType: "fast_slow",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };

ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            ListNode *p1 = head, *p2 = slow;
            while (p1 != p2) { p1 = p1->next; p2 = p2->next; }
            return p1;
        }
    }
    return nullptr;
}`,
      brute: `// Hash Set Approach: O(N) space`,
      template: `// Floyd Cycle Template
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next; fast = fast->next->next;
    if (slow == fast) break;
}`
    },
    solutions: [
      {
        title: "1. Linked List Cycle Detection (LC 141)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "If slow and fast pointers meet, a cycle exists. If fast reaches nullptr, no cycle exists.",
        cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`
      },
      {
        title: "2. Start of Linked List Cycle (LC 142)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "After collision, reset one pointer to head. Advance both at 1x speed to meet at cycle entry.",
        cpp: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            ListNode *p1 = head;
            while (p1 != slow) { p1 = p1->next; slow = slow->next; }
            return p1;
        }
    }
    return nullptr;
}`
      },
      {
        title: "3. Middle of the Linked List (LC 876)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "When fast (2x) reaches end, slow (1x) is precisely at middle node.",
        cpp: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`
      },
      {
        title: "4. Happy Number (LC 202)",
        diff: "Easy",
        time: "O(log N)",
        space: "O(1)",
        intuition: "Sum of squared digits generates a sequence. Use slow and fast to detect if cycle ends at 1.",
        cpp: `int getNext(int n) {
    int s = 0; while (n > 0) { int d = n % 10; s += d * d; n /= 10; } return s;
}
bool isHappy(int n) {
    int slow = n, fast = getNext(n);
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    return fast == 1;
}`
      },
      {
        title: "5. Palindrome Linked List (LC 234)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Find middle node, reverse second half in-place, and compare both halves.",
        cpp: `bool isPalindrome(ListNode* head) {
    if (!head || !head->next) return true;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next; fast = fast->next->next;
    }
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
        title: "6. Reorder List (LC 143)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Find middle, reverse second half, and interleave nodes from first and second halves.",
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
      },
      {
        title: "7. Find Duplicate Number in Array (LC 287)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Treat array indices and values as implicit linked list pointers. Cycle entry is the duplicate value.",
        cpp: `int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}`
      }
    ],
    problems: [
      { name: "Linked List Cycle", diff: "Easy", lc: "141", company: "Amazon, Microsoft" },
      { name: "Linked List Cycle II", diff: "Medium", lc: "142", company: "Google, Meta" },
      { name: "Middle of the Linked List", diff: "Easy", lc: "876", company: "Microsoft, Meta" },
      { name: "Happy Number", diff: "Easy", lc: "202", company: "Amazon, Google" },
      { name: "Palindrome Linked List", diff: "Easy", lc: "234", company: "Meta, Amazon" },
      { name: "Reorder List", diff: "Medium", lc: "143", company: "Meta, Google" },
      { name: "Find the Duplicate Number", diff: "Medium", lc: "287", company: "Amazon, Meta" },
      { name: "Delete Node in a Linked List", diff: "Easy", lc: "237", company: "Adobe, Apple" },
      { name: "Remove Nth Node From End of List", diff: "Medium", lc: "19", company: "Amazon, Google" },
      { name: "Intersection of Two Linked Lists", diff: "Easy", lc: "160", company: "Microsoft, Amazon" },
      { name: "Odd Even Linked List", diff: "Medium", lc: "328", company: "Microsoft, Google" },
      { name: "Split Linked List in Parts", diff: "Medium", lc: "725", company: "Google" },
      { name: "Rotate List", diff: "Medium", lc: "61", company: "Amazon, Meta" },
      { name: "Maximum Twin Sum of Linked List", diff: "Medium", lc: "2130", company: "Meta, Amazon" },
      { name: "Delete Middle Node of Linked List", diff: "Medium", lc: "2095", company: "Google" },
      { name: "Swapping Nodes in a Linked List", diff: "Medium", lc: "1721", company: "Amazon" },
      { name: "Linked List Components", diff: "Medium", lc: "817", company: "Google" },
      { name: "Circular Array Loop", diff: "Medium", lc: "457", company: "Google, Meta" },
      { name: "Flatten Multilevel Doubly Linked List", diff: "Medium", lc: "430", company: "Bloomberg" },
      { name: "Copy List with Random Pointer", diff: "Medium", lc: "138", company: "Amazon, Meta" },
      { name: "Add Two Numbers II", diff: "Medium", lc: "445", company: "Microsoft" },
      { name: "Merge Nodes in Between Zeros", diff: "Medium", lc: "2181", company: "Google" },
      { name: "Double a Number Linked List", diff: "Medium", lc: "2816", company: "Amazon" },
      { name: "Insert GCD in Linked List", diff: "Medium", lc: "2807", company: "Google" },
      { name: "Partition List", diff: "Medium", lc: "86", company: "Meta" },
      { name: "Sort List (Merge Sort)", diff: "Medium", lc: "148", company: "Meta, Google" },
      { name: "Next Greater Node In Linked List", diff: "Medium", lc: "1019", company: "Amazon" }
    ]
  },

  // ==========================================
  // PATTERN 04: MONOTONIC STACK & QUEUE
  // ==========================================
  {
    id: "04_monotonic_stack_queue",
    num: "04",
    name: "Monotonic Stack & Deque",
    category: "Data Structures",
    difficulty: "Medium to Hard",
    badge: "FAANG Favorite",
    shortDesc: "Maintain strictly increasing/decreasing order in a stack or deque to find nearest greater/smaller elements in O(N).",
    theory: {
      what: "A monotonic stack preserves elements in strictly sorted order. Elements violating monotonicity are popped before pushing new items.",
      when: [
        "Finding Next Greater Element (NGE) or Previous Greater Element.",
        "Finding Next/Previous Smaller Element (Histogram bars boundaries).",
        "Sliding Window Maximum / Minimum in O(N) time with Monotonic Deque."
      ],
      coreIdea: "Each array element is pushed and popped at most once throughout the entire algorithm, resulting in O(N) amortized time instead of O(N^2) nested scans.",
      edgeCases: ["Duplicate values (decide whether to use strict < or <=).", "Circular arrays (simulate by iterating through 2N elements with modulo indexing)."]
    },
    diagram: `graph TD
    A[Incoming Element X] --> B{Is Stack Top < X?}
    B -->|Yes| C[Pop Stack Top: X is Next Greater Element for Popped Index]
    C --> B
    B -->|No| D[Push Index of X to Stack]`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

vector<int> dailyTemperatures(const vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> answer(n, 0);
    stack<int> st;

    for (int i = 0; i < n; ++i) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prev_idx = st.top(); st.pop();
            answer[prev_idx] = i - prev_idx;
        }
        st.push(i);
    }
    return answer;
}`,
      brute: `// Brute Force: Nested Loops O(N^2)`,
      template: `// Monotonic Stack Next Greater Template
stack<int> st;
for (int i = 0; i < n; ++i) {
    while (!st.empty() && arr[i] > arr[st.top()]) {
        nge[st.top()] = arr[i];
        st.pop();
    }
    st.push(i);
}`
    },
    solutions: [
      {
        title: "1. Next Greater Element I (LC 496)",
        diff: "Easy",
        time: "O(N)",
        space: "O(N)",
        intuition: "Maintain decreasing monotonic stack. When current number > top, current number is NGE for popped elements.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> nge;
    stack<int> st;
    for (int x : nums2) {
        while (!st.empty() && x > st.top()) {
            nge[st.top()] = x; st.pop();
        }
        st.push(x);
    }
    vector<int> res;
    for (int x : nums1) res.push_back(nge.count(x) ? nge[x] : -1);
    return res;
}`
      },
      {
        title: "2. Daily Temperatures (LC 739)",
        diff: "Medium",
        time: "O(N)",
        space: "O(N)",
        intuition: "Store indices in monotonic decreasing stack. When higher temp encountered, diff = current_idx - popped_idx.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prev = st.top(); st.pop();
            ans[prev] = i - prev;
        }
        st.push(i);
    }
    return ans;
}`
      },
      {
        title: "3. Online Stock Span (LC 901)",
        diff: "Medium",
        time: "O(1) amortized",
        space: "O(N)",
        intuition: "Stack stores pairs of {price, span}. Pop all smaller previous prices and accumulate their spans.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

class StockSpanner {
    stack<pair<int, int>> st; // {price, span}
public:
    int next(int price) {
        int span = 1;
        while (!st.empty() && st.top().first <= price) {
            span += st.top().second;
            st.pop();
        }
        st.push({price, span});
        return span;
    }
};`
      },
      {
        title: "4. Next Greater Element II (Circular Array - LC 503)",
        diff: "Medium",
        time: "O(N)",
        space: "O(N)",
        intuition: "Traverse array twice (0 to 2N - 1) using modulo index (i % N) to simulate circular wrapping.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
    for (int i = 0; i < 2 * n; ++i) {
        while (!st.empty() && nums[i % n] > nums[st.top()]) {
            res[st.top()] = nums[i % n];
            st.pop();
        }
        if (i < n) st.push(i);
    }
    return res;
}`
      },
      {
        title: "5. Largest Rectangle in Histogram (LC 84)",
        diff: "Hard",
        time: "O(N)",
        space: "O(N)",
        intuition: "Monotonic increasing stack. When bar < stack top, popped bar's width is bounded by current index and new stack top.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int largestRectangleArea(vector<int>& heights) {
    heights.push_back(0);
    stack<int> st;
    int max_area = 0;
    for (int i = 0; i < (int)heights.size(); ++i) {
        while (!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            max_area = max(max_area, h * w);
        }
        st.push(i);
    }
    return max_area;
}`
      },
      {
        title: "6. Sliding Window Maximum (LC 239)",
        diff: "Hard",
        time: "O(N)",
        space: "O(K)",
        intuition: "Monotonic decreasing deque. Front always holds index of largest element in current window. Pop out-of-window elements from front.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < (int)nums.size(); ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) res.push_back(nums[dq.front()]);
    }
    return res;
}`
      },
      {
        title: "7. Sum of Subarray Minimums (LC 907)",
        diff: "Hard",
        time: "O(N)",
        space: "O(N)",
        intuition: "Contribution technique: find distance to Previous Smaller and Next Smaller elements for each index using monotonic stack.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int sumSubarrayMins(vector<int>& arr) {
    int n = arr.size(), MOD = 1e9 + 7;
    vector<int> prev_s(n), next_s(n);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && arr[st.top()] > arr[i]) st.pop();
        prev_s[i] = st.empty() ? i + 1 : i - st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();
    for (int i = n - 1; i >= 0; --i) {
        while (!st.empty() && arr[st.top()] >= arr[i]) st.pop();
        next_s[i] = st.empty() ? n - i : st.top() - i;
        st.push(i);
    }
    long long ans = 0;
    for (int i = 0; i < n; ++i) {
        ans = (ans + 1LL * arr[i] * prev_s[i] * next_s[i]) % MOD;
    }
    return ans;
}`
      }
    ],
    problems: [
      { name: "Next Greater Element I", diff: "Easy", lc: "496", company: "Amazon, Meta" },
      { name: "Daily Temperatures", diff: "Medium", lc: "739", company: "Amazon, Meta, Google" },
      { name: "Online Stock Span", diff: "Medium", lc: "901", company: "Microsoft, Amazon" },
      { name: "Next Greater Element II", diff: "Medium", lc: "503", company: "Amazon, Google" },
      { name: "Remove K Digits", diff: "Medium", lc: "402", company: "Google, Microsoft" },
      { name: "132 Pattern", diff: "Medium", lc: "456", company: "Amazon, Meta" },
      { name: "Shortest Unsorted Continuous Subarray", diff: "Medium", lc: "581", company: "Google" },
      { name: "Sum of Subarray Minimums", diff: "Medium", lc: "907", company: "Amazon, Google" },
      { name: "Smallest Subsequence of Distinct Characters", diff: "Medium", lc: "1081", company: "Google" },
      { name: "Remove Duplicate Letters", diff: "Medium", lc: "316", company: "Google, Meta" },
      { name: "Largest Rectangle in Histogram", diff: "Hard", lc: "84", company: "Google, Meta, Apple, Uber" },
      { name: "Maximal Rectangle", diff: "Hard", lc: "85", company: "Google, Amazon" },
      { name: "Sliding Window Maximum", diff: "Hard", lc: "239", company: "Amazon, Google" },
      { name: "Trapping Rain Water (Stack Formulation)", diff: "Hard", lc: "42", company: "Amazon, Google" },
      { name: "Constrained Subsequence Sum", diff: "Hard", lc: "1425", company: "Google" },
      { name: "Jump Game VI", diff: "Medium", lc: "1696", company: "Amazon" },
      { name: "Longest Well-Performing Interval", diff: "Medium", lc: "1124", company: "Google" },
      { name: "Subarray With Elements Greater Than Threshold", diff: "Hard", lc: "2334", company: "Google" },
      { name: "Maximum Score of a Good Subarray", diff: "Hard", lc: "1793", company: "Google" },
      { name: "Visible People in a Queue", diff: "Hard", lc: "1944", company: "Google, Meta" },
      { name: "Sum of Subarray Ranges", diff: "Medium", lc: "2104", company: "Amazon" },
      { name: "Car Fleet", diff: "Medium", lc: "853", company: "Google" },
      { name: "Car Fleet II", diff: "Hard", lc: "1776", company: "Google" },
      { name: "Maximum Width Ramp", diff: "Medium", lc: "962", company: "Google" },
      { name: "Find Most Competitive Subsequence", diff: "Medium", lc: "1673", company: "Amazon" },
      { name: "Minimum Cost Tree From Leaf Values", diff: "Medium", lc: "1130", company: "Amazon" },
      { name: "Asteroid Collision", diff: "Medium", lc: "735", company: "Amazon, Google" }
    ]
  },

  // ==========================================
  // PATTERN 05: MERGE INTERVALS
  // ==========================================
  {
    id: "05_merge_intervals",
    num: "05",
    name: "Merge Intervals & Scheduling",
    category: "Intervals",
    difficulty: "Medium",
    badge: "Standard",
    shortDesc: "Sort intervals by start time to detect overlaps, merge continuous blocks, or schedule resources.",
    theory: {
      what: "Interval patterns deal with overlapping ranges [start, end]. Sorting by start time converts multi-dimensional overlap checks into a single linear sweep.",
      when: [
        "Merging overlapping intervals.",
        "Inserting an interval into a sorted non-overlapping set.",
        "Finding minimum meeting rooms / platforms needed (Sweep Line / Min-Heap)."
      ],
      coreIdea: "If intervals are sorted by start time, interval B overlaps with A if and only if B.start <= A.end. When they overlap, merge them into [A.start, max(A.end, B.end)].",
      edgeCases: ["Adjacent intervals with equal boundaries [1, 4] and [4, 5].", "Single interval input."]
    },
    diagram: `graph TD
    A["Sort intervals by start_time"] --> B["Initialize merged with intervals[0]"]
    B --> C["For each interval in intervals[1..n]"]
    C --> D{interval.start <= last_merged.end?}
    D -->|Yes: Overlap| E["last_merged.end = max(last_merged.end, interval.end)"]
    D -->|No: Separate| F["Push interval to merged list"]
    E --> C
    F --> C`,
    visualizerType: "intervals",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());

    vector<vector<int>> merged = {intervals[0]};
    for (size_t i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] <= merged.back()[1]) {
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
      brute: `// Connected Components Graph Approach O(N^2)`,
      template: `// Merge Intervals Template
sort(intervals.begin(), intervals.end());
vector<vector<int>> res = {intervals[0]};
for (int i = 1; i < n; ++i) {
    if (intervals[i][0] <= res.back()[1])
        res.back()[1] = max(res.back()[1], intervals[i][1]);
    else res.push_back(intervals[i]);
}`
    },
    solutions: [
      {
        title: "1. Merge Overlapping Intervals (LC 56)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(1) auxiliary",
        intuition: "Sort by start time. If current interval start <= previous interval end, extend previous interval's end to max(prev.end, curr.end).",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res;
    for (const auto& iv : intervals) {
        if (res.empty() || res.back()[1] < iv[0]) {
            res.push_back(iv);
        } else {
            res.back()[1] = max(res.back()[1], iv[1]);
        }
    }
    return res;
}`
      },
      {
        title: "2. Insert Interval (LC 57)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1) auxiliary",
        intuition: "Add all intervals ending before newInterval starts. Merge all overlapping intervals. Append remaining intervals.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> res;
    int i = 0, n = intervals.size();
    while (i < n && intervals[i][1] < newInterval[0]) res.push_back(intervals[i++]);
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push_back(newInterval);
    while (i < n) res.push_back(intervals[i++]);
    return res;
}`
      },
      {
        title: "3. Non-overlapping Intervals (LC 435)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(1)",
        intuition: "Greedy scheduling: sort by end time. Always pick the interval that finishes earliest to leave maximum room for others.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });
    int count = 0, last_end = INT_MIN;
    for (const auto& iv : intervals) {
        if (iv[0] >= last_end) {
            last_end = iv[1];
        } else {
            count++;
        }
    }
    return count;
}`
      },
      {
        title: "4. Meeting Rooms II (LC 253)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Sort start times and end times separately, or use a Min-Heap tracking end times of active meetings.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> min_heap;
    for (const auto& iv : intervals) {
        if (!min_heap.empty() && min_heap.top() <= iv[0]) {
            min_heap.pop();
        }
        min_heap.push(iv[1]);
    }
    return min_heap.size();
}`
      },
      {
        title: "5. Interval List Intersections (LC 986)",
        diff: "Medium",
        time: "O(N + M)",
        space: "O(1) auxiliary",
        intuition: "Two pointers on both lists. Overlap is [max(s1, s2), min(e1, e2)]. Advance pointer with smaller end time.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
    vector<vector<int>> res;
    size_t i = 0, j = 0;
    while (i < firstList.size() && j < secondList.size()) {
        int start = max(firstList[i][0], secondList[j][0]);
        int end = min(firstList[i][1], secondList[j][1]);
        if (start <= end) res.push_back({start, end});
        if (firstList[i][1] < secondList[j][1]) i++;
        else j++;
    }
    return res;
}`
      },
      {
        title: "6. Minimum Number of Arrows to Burst Balloons (LC 452)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(1)",
        intuition: "Sort balloons by end coordinate. Shoot arrow at balloon's end coordinate to pop all overlapping balloons.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int findMinArrowShots(vector<vector<int>>& points) {
    if (points.empty()) return 0;
    sort(points.begin(), points.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });
    int arrows = 1, last_end = points[0][1];
    for (size_t i = 1; i < points.size(); ++i) {
        if (points[i][0] > last_end) {
            arrows++;
            last_end = points[i][1];
        }
    }
    return arrows;
}`
      },
      {
        title: "7. Range Module (LC 715)",
        diff: "Hard",
        time: "O(K log N)",
        space: "O(N)",
        intuition: "Maintain disjoint sorted intervals in std::map<int, int> representing start -> end. Erase and merge intersecting subranges.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

class RangeModule {
    map<int, int> intervals;
public:
    void addRange(int left, int right) {
        auto it = intervals.upper_bound(left);
        if (it != intervals.begin()) {
            auto prev = std::prev(it);
            if (prev->second >= left) {
                left = prev->first;
                right = max(right, prev->second);
                it = intervals.erase(prev);
            }
        }
        while (it != intervals.end() && it->first <= right) {
            right = max(right, it->second);
            it = intervals.erase(it);
        }
        intervals[left] = right;
    }
    bool queryRange(int left, int right) {
        auto it = intervals.upper_bound(left);
        if (it == intervals.begin()) return false;
        return std::prev(it)->second >= right;
    }
};`
      }
    ],
    problems: [
      { name: "Merge Intervals", diff: "Medium", lc: "56", company: "Meta, Google, Amazon, Microsoft" },
      { name: "Insert Interval", diff: "Medium", lc: "57", company: "Google, Meta, Apple" },
      { name: "Non-overlapping Intervals", diff: "Medium", lc: "435", company: "Meta, Amazon" },
      { name: "Meeting Rooms", diff: "Easy", lc: "252", company: "Amazon, Meta" },
      { name: "Meeting Rooms II", diff: "Medium", lc: "253", company: "Google, Meta, Amazon, Microsoft" },
      { name: "Interval List Intersections", diff: "Medium", lc: "986", company: "Meta, Uber" },
      { name: "Minimum Number of Arrows to Burst Balloons", diff: "Medium", lc: "452", company: "Meta, Amazon" },
      { name: "Car Pooling", diff: "Medium", lc: "1094", company: "Amazon, Google" },
      { name: "My Calendar I", diff: "Medium", lc: "729", company: "Google" },
      { name: "My Calendar II", diff: "Medium", lc: "731", company: "Google" },
      { name: "My Calendar III", diff: "Hard", lc: "732", company: "Google" },
      { name: "Employee Free Time", diff: "Hard", lc: "759", company: "Google, Amazon" },
      { name: "Range Module", diff: "Hard", lc: "715", company: "Google" },
      { name: "Remove Covered Intervals", diff: "Medium", lc: "1288", company: "Amazon" },
      { name: "Teemo Attacking", diff: "Easy", lc: "495", company: "Riot, Amazon" },
      { name: "Summary Ranges", diff: "Easy", lc: "228", company: "Google" },
      { name: "Data Stream as Disjoint Intervals", diff: "Hard", lc: "352", company: "Google" },
      { name: "Describe the Painting", diff: "Medium", lc: "1943", company: "Google" },
      { name: "Count Days Without Meetings", diff: "Medium", lc: "3169", company: "Amazon" },
      { name: "Determine if Two Events Have Conflict", diff: "Easy", lc: "2446", company: "Google" },
      { name: "Average Waiting Time", diff: "Medium", lc: "1701", company: "Amazon" },
      { name: "Video Stitching", diff: "Medium", lc: "1024", company: "Google" },
      { name: "Minimum Interval to Include Each Query", diff: "Hard", lc: "1851", company: "Amazon, Google" },
      { name: "Divide Intervals Into Minimum Number of Groups", diff: "Medium", lc: "2406", company: "Google" },
      { name: "Meeting Scheduler", diff: "Medium", lc: "1229", company: "Amazon" },
      { name: "Max Consecutive Floors Without Special Floors", diff: "Medium", lc: "2274", company: "Google" },
      { name: "Amount of New Area Painted Each Day", diff: "Hard", lc: "2158", company: "Google" }
    ]
  },

  // ==========================================
  // PATTERN 06: CYCLIC SORT
  // ==========================================
  {
    id: "06_cyclic_sort",
    num: "06",
    name: "Cyclic Sort Pattern",
    category: "Array Hashing",
    difficulty: "Easy to Hard",
    badge: "Ingenious",
    shortDesc: "In-place O(N) array sorting when values range between 1..N or 0..N-1 by placing each number at its correct index.",
    theory: {
      what: "Cyclic Sort leverages the constraint that input values fall in a known integer range [1, N]. Each value nums[i] belongs at index nums[i] - 1.",
      when: [
        "Problems asking to find missing, duplicate, or corrupted numbers in range [1..n].",
        "Must be solved in O(N) time with O(1) extra auxiliary space."
      ],
      coreIdea: "Iterate through the array. If nums[i] is not at its correct position (nums[i] != nums[nums[i] - 1]), swap it to its rightful place. Since each swap places at least one number in its correct final spot, at most N swaps occur total.",
      edgeCases: ["Numbers out of range (<= 0 or > N) in First Missing Positive.", "Duplicate values causing infinite loop (check nums[i] == nums[correct_idx] before swapping)."]
    },
    diagram: `graph TD
    A["Current index i = 0"] --> B{nums[i] == nums[nums[i] - 1]?}
    B -->|No| C["Swap nums[i] with nums[nums[i] - 1]"]
    C --> B
    B -->|Yes / In-place| D["++i"]
    D --> E{i < n?}
    E -->|Yes| B
    E -->|No| F["Scan for mismatch: nums[j] != j + 1"]`,
    visualizerType: "cyclic_sort",
    code: {
      optimal: `#include <bits/stdc++.h>
using namespace std;

int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
      brute: `// Hash Set Lookup: O(N) Time, O(N) Space`,
      template: `// Cyclic Sort Template
int i = 0;
while (i < n) {
    int correct_idx = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= n && nums[i] != nums[correct_idx]) {
        swap(nums[i], nums[correct_idx]);
    } else {
        i++;
    }
}`
    },
    solutions: [
      {
        title: "1. Missing Number in Range 0..N (LC 268)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Place each number x at index x. Number missing will be the index i where nums[i] != i.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int missingNumber(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[i] < n && nums[i] != nums[nums[i]]) {
            swap(nums[i], nums[nums[i]]);
        }
    }
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i) return i;
    }
    return n;
}`
      },
      {
        title: "2. Find All Numbers Disappeared in an Array (LC 448)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1) auxiliary",
        intuition: "Cycle sort to place number x at index x - 1. Any index i where nums[i] != i + 1 indicates missing number i + 1.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> findDisappearedNumbers(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    vector<int> res;
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) res.push_back(i + 1);
    }
    return res;
}`
      },
      {
        title: "3. Find the Duplicate Number (LC 287)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Place nums[i] at nums[i] - 1. If destination already has the same number, that number is the duplicate.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int findDuplicate(vector<int>& nums) {
    int i = 0;
    while (i < (int)nums.size()) {
        if (nums[i] != i + 1) {
            int correct = nums[i] - 1;
            if (nums[i] != nums[correct]) {
                swap(nums[i], nums[correct]);
            } else {
                return nums[i]; // Found duplicate!
            }
        } else {
            i++;
        }
    }
    return -1;
}`
      },
      {
        title: "4. Find All Duplicates in an Array (LC 442)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1) auxiliary",
        intuition: "Place each number at index num - 1. After sorting, any index i where nums[i] != i + 1 holds a duplicate value.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> findDuplicates(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    vector<int> res;
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) res.push_back(nums[i]);
    }
    return res;
}`
      },
      {
        title: "5. Set Mismatch - Find Corrupt Pair (LC 645)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Sort numbers to indices nums[i] - 1. Mismatched index gives {duplicate, missing} = {nums[i], i + 1}.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> findErrorNums(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) return {nums[i], i + 1};
    }
    return {};
}`
      },
      {
        title: "6. First Missing Positive (LC 41)",
        diff: "Hard",
        time: "O(N)",
        space: "O(1)",
        intuition: "Ignore non-positive numbers and numbers > N. Swap positive x in range [1..N] to index x - 1.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`
      },
      {
        title: "7. First K Missing Positive Numbers (LC 1539 Extended)",
        diff: "Hard",
        time: "O(N + K)",
        space: "O(K)",
        intuition: "Cyclic sort elements in range [1..N]. Collect missing from range [1..N], then extend with extra numbers > N.",
        cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> findKOrMissing(vector<int>& nums, int k) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            swap(nums[i], nums[nums[i] - 1]);
        }
    }
    vector<int> missing;
    unordered_set<int> extra;
    for (int i = 0; i < n && (int)missing.size() < k; ++i) {
        if (nums[i] != i + 1) {
            missing.push_back(i + 1);
            extra.insert(nums[i]);
        }
    }
    for (int i = 1; (int)missing.size() < k; ++i) {
        int candidate = n + i;
        if (!extra.count(candidate)) missing.push_back(candidate);
    }
    return missing;
}`
      }
    ],
    problems: [
      { name: "Missing Number", diff: "Easy", lc: "268", company: "Amazon, Microsoft" },
      { name: "Find All Numbers Disappeared in an Array", diff: "Easy", lc: "448", company: "Google, Amazon" },
      { name: "Set Mismatch", diff: "Easy", lc: "645", company: "Amazon" },
      { name: "Find the Duplicate Number", diff: "Medium", lc: "287", company: "Amazon, Meta, Google" },
      { name: "Find All Duplicates in an Array", diff: "Medium", lc: "442", company: "Meta, Amazon" },
      { name: "First Missing Positive", diff: "Hard", lc: "41", company: "Google, Meta, Amazon, Apple" },
      { name: "Kth Missing Positive Number", diff: "Easy", lc: "1539", company: "Meta" },
      { name: "Couples Holding Hands (Cyclic Swaps)", diff: "Hard", lc: "765", company: "Google, Uber" },
      { name: "Check If Array Pairs Are Divisible by k", diff: "Medium", lc: "1497", company: "Amazon" },
      { name: "Smallest Range Covering Elements from K Lists", diff: "Hard", lc: "632", company: "Google" },
      { name: "H-Index", diff: "Medium", lc: "274", company: "Amazon, Google" },
      { name: "Maximum Gap (Bucket Sort / Cyclic)", diff: "Medium", lc: "164", company: "Amazon" },
      { name: "Shuffle an Array", diff: "Medium", lc: "384", company: "Google" },
      { name: "Sort an Array (In-place Index Map)", diff: "Medium", lc: "912", company: "Amazon" },
      { name: "Rank Transform of an Array", diff: "Easy", lc: "1331", company: "Google" },
      { name: "Find Peak Element in Cyclic Array", diff: "Medium", lc: "162", company: "Meta" },
      { name: "Relative Sort Array", diff: "Easy", lc: "1122", company: "Amazon" },
      { name: "Sort Transformed Array", diff: "Medium", lc: "360", company: "Google" },
      { name: "Wiggle Sort", diff: "Medium", lc: "280", company: "Google" },
      { name: "Wiggle Sort II", diff: "Medium", lc: "324", company: "Google" },
      { name: "Candy (Two-way Pass Distribution)", diff: "Hard", lc: "135", company: "Google, Amazon" },
      { name: "Find All Lonely Numbers in Array", diff: "Medium", lc: "2150", company: "Google" },
      { name: "Maximum Number of Coins You Can Get", diff: "Medium", lc: "1561", company: "Google" },
      { name: "Minimum Swaps to Sort Array", diff: "Medium", lc: "GFG", company: "Amazon, Microsoft" },
      { name: "Next Greater Permutation Cycle", diff: "Medium", lc: "31", company: "Meta" },
      { name: "Single Number in Range 1..N Array", diff: "Medium", lc: "136", company: "Google" },
      { name: "Maximum Distance in Arrays", diff: "Medium", lc: "624", company: "LinkedIn" }
    ]
  }
];

window.PATTERNS_PART_1 = PATTERNS_PART_1;
