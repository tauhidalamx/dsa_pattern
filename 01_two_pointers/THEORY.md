# 🎯 Pattern 01: Two Pointers Technique

---

## 📖 1. Theoretical Blueprint & Intuition

The **Two Pointers** pattern is one of the most fundamental and powerful algorithmic strategies for linear data structures (arrays, strings, linked lists). It relies on using two integer indices (or pointers) that iterate through the data structure either:
1. **Opposite Directions (Converging)**: Pointer $A$ starts at index `0` moving right (`++left`), and Pointer $B$ starts at index `n - 1` moving left (`--right`).
2. **Same Direction (Fast & Slow / Reader-Writer)**: Pointer $A$ (slow) writes or tracks valid elements while Pointer $B$ (fast) scans and filters the data.
3. **Diverging (Center Expansion)**: Pointers start at a central index and expand outward (`--left`, `++right`), frequently used for palindrome expansion.
4. **Three Pointers / Partitioning (Dutch National Flag)**: Three pointers (`low`, `mid`, `high`) partition an array into distinct contiguous regions in a single pass $O(N)$ with $O(1)$ extra space.

---

## 🧠 2. When to Use the Two Pointers Pattern?

Look for these **problem trigger signals**:
- ✅ The input array or string is **sorted** (or can be sorted in $O(N \log N)$ without violating requirements).
- ✅ Searching for a **pair, triplet, or k-tuple** that satisfies a target condition (e.g., $A[i] + A[j] == \text{target}$).
- ✅ In-place array mutation is required without allocating $O(N)$ auxiliary memory (e.g., removing duplicates, moving zeroes, partition).
- ✅ Reversing or comparing elements from both ends (e.g., palindrome validation, container with most water).
- ✅ You want to optimize an $O(N^2)$ brute-force double-loop down to linear $O(N)$ time with $O(1)$ space.

---

## ⚙️ 3. Algorithmic Templates (C++)

### Template A: Opposite-Direction (Converging Pointers)
Used for sorted target sum pairs, reversing arrays, container with most water:

```cpp
int left = 0;
int right = n - 1;

while (left < right) {
    int current_sum = arr[left] + arr[right];
    if (current_sum == target) {
        // Found valid pair!
        return {left, right};
    } else if (current_sum < target) {
        left++; // Increase sum by moving left pointer forward
    } else {
        right--; // Decrease sum by moving right pointer backward
    }
}
```

### Template B: Same-Direction (Reader & Writer Pointers)
Used for in-place deduplication, moving zeroes, filtering:

```cpp
int slow = 0; // Writer index
for (int fast = 0; fast < n; ++fast) {
    if (shouldKeep(arr[fast])) {
        arr[slow] = arr[fast];
        slow++;
    }
}
// Array size after modification is 'slow'
```

### Template C: 3-Way Partitioning (Dutch National Flag)
Used for 3-color sorting, quickselect pivot partitioning:

```cpp
int low = 0, mid = 0, high = n - 1;
while (mid <= high) {
    if (arr[mid] == 0) {
        std::swap(arr[low], arr[mid]);
        low++;
        mid++;
    } else if (arr[mid] == 1) {
        mid++;
    } else { // arr[mid] == 2
        std::swap(arr[mid], arr[high]);
        high--;
    }
}
```

---

## 📊 4. Complexity Analysis Matrix

| Approach | Time Complexity | Space Complexity | Notes |
|---|:---:|:---:|---|
| **Brute Force (Nested Loops)** | $O(N^2)$ or $O(N^3)$ | $O(1)$ | Checks all possible tuples $(i, j)$ |
| **Hash Map / Set Approach** | $O(N)$ | $O(N)$ | Good for unsorted inputs when sorting is undesirable |
| **Two Pointers (Optimal)** | $O(N \log N)$ if sorting is needed, $O(N)$ if already sorted | $O(1)$ | Optimal speed with zero heap memory allocation |

---

## ⚠️ 5. Common Edge Cases & Pitfalls
1. **Handling Duplicates**: When finding unique triplets (3Sum), always skip identical consecutive values for both the outer loop and the converging pointers (`while (left < right && arr[left] == arr[left + 1]) left++;`).
2. **Integer Overflow**: When summing large values ($A[i] + A[j] + A[k]$), cast to `long long` to prevent arithmetic overflow.
3. **Strict vs Non-Strict Loop Bounds**: Be careful between `left < right` (distinct elements) and `left <= right` (single element center).
4. **Mutating During Traversal**: When using reader/writer pointers, ensure the writer never overwrites elements that the reader has not processed yet.
