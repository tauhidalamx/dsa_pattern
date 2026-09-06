/**
 * @file 02_smallest_subarray_given_sum.cpp
 * @brief Problem: Given an array of positive integers nums and a positive integer target,
 *        return the minimal length of a contiguous subarray [nums[l], ..., nums[r]]
 *        of which the sum is greater than or equal to target.
 *        If there is no such subarray, return 0 instead.
 * 
 * LeetCode Equivalent: LC 209 - Minimum Size Subarray Sum
 * Difficulty: Medium
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Brute Force (Check all subarrays)
     * Time Complexity: O(N^2)
     * Space Complexity: O(1)
     */
    int minSubArrayLenBruteForce(int target, const std::vector<int>& nums) {
        int n = nums.size();
        int min_length = INT_MAX;

        for (int i = 0; i < n; ++i) {
            int current_sum = 0;
            for (int j = i; j < n; ++j) {
                current_sum += nums[j];
                if (current_sum >= target) {
                    min_length = std::min(min_length, j - i + 1);
                    break; // Since numbers are positive, extending will only increase length
                }
            }
        }
        return min_length == INT_MAX ? 0 : min_length;
    }

    /**
     * @brief Approach 2: Dynamic / Variable-Size Sliding Window (Optimal)
     * Intuition:
     * 1. Add elements to 'current_sum' from the right (window_end).
     * 2. While 'current_sum >= target', record the window length and shrink from the left (window_start).
     * 3. Because all numbers are strictly positive, shrinking decreases the sum and expanding increases it.
     * 
     * Time Complexity: O(N) — each pointer moves at most N steps.
     * Space Complexity: O(1) auxiliary memory.
     */
    int minSubArrayLenOptimal(int target, const std::vector<int>& nums) {
        int n = nums.size();
        int window_start = 0;
        int current_sum = 0;
        int min_length = INT_MAX;

        for (int window_end = 0; window_end < n; ++window_end) {
            current_sum += nums[window_end]; // Expand window

            // Shrink window while the constraint sum >= target is maintained
            while (current_sum >= target) {
                min_length = std::min(min_length, window_end - window_start + 1);
                current_sum -= nums[window_start];
                window_start++;
            }
        }
        return min_length == INT_MAX ? 0 : min_length;
    }
};

int main() {
    Solution solver;

    // Test Case 1: target = 7, nums = [2,3,1,2,4,3] -> 2 ([4, 3])
    std::vector<int> nums1 = {2, 3, 1, 2, 4, 3};
    int target1 = 7;
    assert(solver.minSubArrayLenOptimal(target1, nums1) == 2);
    assert(solver.minSubArrayLenBruteForce(target1, nums1) == 2);
    std::cout << "Test Case 1 Passed: target=7, nums=[2,3,1,2,4,3] -> Min Len = 2\n";

    // Test Case 2: target = 4, nums = [1,4,4] -> 1 ([4])
    std::vector<int> nums2 = {1, 4, 4};
    int target2 = 4;
    assert(solver.minSubArrayLenOptimal(target2, nums2) == 1);
    std::cout << "Test Case 2 Passed: target=4, nums=[1,4,4] -> Min Len = 1\n";

    // Test Case 3: target = 11, nums = [1,1,1,1,1,1,1,1] -> 0 (Not possible)
    std::vector<int> nums3 = {1, 1, 1, 1, 1, 1, 1, 1};
    int target3 = 11;
    assert(solver.minSubArrayLenOptimal(target3, nums3) == 0);
    std::cout << "Test Case 3 Passed: target=11, nums=[1,1,...] -> Min Len = 0\n";

    std::cout << "All Minimum Size Subarray Sum tests successfully passed!\n";
    return 0;
}
