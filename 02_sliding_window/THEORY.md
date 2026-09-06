# 🪟 Pattern 02: Sliding Window Technique

---

## 📖 1. Theoretical Blueprint & Intuition

The **Sliding Window** technique is designed to convert nested loops $O(N^2)$ or $O(N \cdot K)$ into linear $O(N)$ operations over **contiguous** sequences (subarrays or substrings).

Instead of recalculating state from scratch for every subarray, a window defined by indices `[window_start, window_end]` shifts forward across the data structure:
1. **Expanding Phase**: `window_end` increments, adding the incoming element `arr[window_end]` to the window's state (sum, character frequency map, product, etc.).
2. **Shrinking Phase**: When the window violates a constraint (e.g., exceeds size $K$, sum $\ge S$, or contains too many distinct characters), `window_start` increments, removing `arr[window_start]` from the state until validity is restored.

```
       [ 2   1   5   2   8 ]   K = 3
Pass 1: |-------|              Sum = 8
Pass 2:     |-------|          Sum = 8 - 2 + 2 = 8
Pass 3:         |-------|      Sum = 8 - 1 + 8 = 15 (Max!)
```

---

## 🧠 2. When to Use the Sliding Window Pattern?

Look for these **hallmark characteristics**:
- ✅ The problem asks for contiguous segments: **"longest subarray / substring"**, **"shortest subarray with sum $\ge S$"**, **"maximum / minimum sum of subarray of size $K$"**.
- ✅ The problem has a monotonic constraint (adding elements expands property, removing elements reduces property).
- ✅ You need to optimize an $O(N \cdot K)$ or $O(N^2)$ brute-force subsegment calculation down to $O(N)$.

---

## ⚙️ 3. Algorithmic Templates (C++)

### Template A: Fixed-Size Window (Length = K)
```cpp
int window_sum = 0;
int max_sum = INT_MIN;

for (int window_end = 0; window_end < n; ++window_end) {
    window_sum += arr[window_end]; // Add incoming element

    if (window_end >= k - 1) { // Window has reached size K
        max_sum = std::max(max_sum, window_sum);
        window_sum -= arr[window_end - k + 1]; // Evict outgoing element
    }
}
```

### Template B: Dynamic / Variable-Size Window (Finding Minimum Subarray)
```cpp
int window_start = 0;
int current_sum = 0;
int min_len = INT_MAX;

for (int window_end = 0; window_end < n; ++window_end) {
    current_sum += arr[window_end]; // Expand window

    // Shrink window as long as condition is satisfied
    while (current_sum >= target_sum) {
        min_len = std::min(min_len, window_end - window_start + 1);
        current_sum -= arr[window_start];
        window_start++;
    }
}
```

### Template C: Hash Map Window (Longest Substring with $K$ Distinct Characters)
```cpp
std::unordered_map<char, int> freq;
int window_start = 0;
int max_len = 0;

for (int window_end = 0; window_end < (int)s.size(); ++window_end) {
    freq[s[window_end]]++; // Add character

    // Shrink when invalid
    while ((int)freq.size() > k) {
        freq[s[window_start]]--;
        if (freq[s[window_start]] == 0) {
            freq.erase(s[window_start]);
        }
        window_start++;
    }
    max_len = std::max(max_len, window_end - window_start + 1);
}
```

---

## 📊 4. Complexity Analysis Matrix

| Approach | Time Complexity | Space Complexity | Notes |
|---|:---:|:---:|---|
| **Brute Force (Nested Loops)** | $O(N^2)$ or $O(N \cdot K)$ | $O(1)$ | Recomputes contiguous states repeatedly |
| **Fixed Sliding Window** | $O(N)$ single pass | $O(1)$ | Each element is added and removed exactly once |
| **Dynamic Window with Map** | $O(N)$ amortized | $O(\Sigma)$ (Alphabet size / Unique items) | `window_start` moves at most $N$ times overall |

---

## ⚠️ 5. Common Edge Cases & Pitfalls
1. **Negative Numbers**: Standard dynamic sliding window algorithms assume non-negative sums (monotonicity). If negative numbers exist, use a **Prefix Sum + Hash Map / Monotonic Deque** (e.g., Shortest Subarray with Sum at Least K - LC 862).
2. **Empty String or $K = 0$**: Always guard against empty inputs and handle $K > \text{array size}$.
3. **Map Size Management**: When frequency reaches 0, `freq.erase()` MUST be called, otherwise `freq.size()` will count keys with value 0.
