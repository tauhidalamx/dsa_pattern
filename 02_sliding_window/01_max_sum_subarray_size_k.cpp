/**
 * @file 01_max_sum_subarray_size_k.cpp
 * @brief Problem: Given an array of positive numbers and a positive number 'k',
 *        find the maximum sum of any contiguous subarray of size 'k'.
 * 
 * LeetCode Equivalent: LC 643 - Maximum Average Subarray I (Variant)
 * Difficulty: Easy
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Brute Force (Evaluate all subarrays of length K)
     * Time Complexity: O(N * K)
     * Space Complexity: O(1)
     */
    int findMaxSumSubArrayBruteForce(int k, const std::vector<int>& arr) {
        int max_sum = INT_MIN;
        int n = arr.size();
        for (int i = 0; i <= n - k; ++i) {
            int current_sum = 0;
            for (int j = i; j < i + k; ++j) {
                current_sum += arr[j];
            }
            max_sum = std::max(max_sum, current_sum);
        }
        return max_sum;
    }

    /**
     * @brief Approach 2: Fixed-Size Sliding Window (Optimal)
     * Intuition:
     * - Compute the sum of the first k elements.
     * - As the window shifts one element right, subtract the element exiting from the left
     *   and add the new element entering from the right.
     * - Each step is O(1).
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1)
     */
    int findMaxSumSubArrayOptimal(int k, const std::vector<int>& arr) {
        int n = arr.size();
        if (n < k || k <= 0) return 0;

        int window_sum = 0;
        int max_sum = INT_MIN;

        for (int window_end = 0; window_end < n; ++window_end) {
            window_sum += arr[window_end]; // Add incoming element

            if (window_end >= k - 1) {
                max_sum = std::max(max_sum, window_sum);
                window_sum -= arr[window_end - k + 1]; // Evict outgoing element
            }
        }
        return max_sum;
    }
};

int main() {
    Solution solver;

    // Test Case 1: [2, 1, 5, 1, 3, 2], k = 3 -> 9 (Subarray [5, 1, 3])
    std::vector<int> arr1 = {2, 1, 5, 1, 3, 2};
    int k1 = 3;
    assert(solver.findMaxSumSubArrayOptimal(k1, arr1) == 9);
    assert(solver.findMaxSumSubArrayBruteForce(k1, arr1) == 9);
    std::cout << "Test Case 1 Passed: [2, 1, 5, 1, 3, 2], k=3 -> Max Sum = 9\n";

    // Test Case 2: [2, 3, 4, 1, 5], k = 2 -> 7 (Subarray [3, 4])
    std::vector<int> arr2 = {2, 3, 4, 1, 5};
    int k2 = 2;
    assert(solver.findMaxSumSubArrayOptimal(k2, arr2) == 7);
    std::cout << "Test Case 2 Passed: [2, 3, 4, 1, 5], k=2 -> Max Sum = 7\n";

    std::cout << "All Maximum Sum Subarray Size K tests successfully passed!\n";
    return 0;
}
