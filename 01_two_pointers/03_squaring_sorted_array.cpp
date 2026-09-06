/**
 * @file 03_squaring_sorted_array.cpp
 * @brief Problem: Given an integer array nums sorted in non-decreasing order,
 *        return an array of the squares of each number sorted in non-decreasing order.
 * 
 * LeetCode Equivalent: LC 977 - Squares of a Sorted Array
 * Difficulty: Easy
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Square and Sort (Trivial)
     * Time Complexity: O(N log N)
     * Space Complexity: O(1) auxiliary (ignoring output)
     */
    std::vector<int> sortedSquaresBruteForce(std::vector<int> nums) {
        for (int& x : nums) {
            x = x * x;
        }
        std::sort(nums.begin(), nums.end());
        return nums;
    }

    /**
     * @brief Approach 2: Two Pointers (Optimal - Opposite Ends Fill Backwards)
     * Intuition:
     * - The largest squared values must come from either the most negative number (far left)
     *   or the largest positive number (far right).
     * - We place pointers at left = 0 and right = n - 1, compare squares, and place the larger
     *   one into the result array from index n - 1 down to 0.
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) auxiliary (O(N) for output)
     */
    std::vector<int> sortedSquaresOptimal(const std::vector<int>& nums) {
        int n = nums.size();
        std::vector<int> result(n);
        int left = 0;
        int right = n - 1;
        int write_pos = n - 1;

        while (left <= right) {
            int left_sq = nums[left] * nums[left];
            int right_sq = nums[right] * nums[right];

            if (left_sq > right_sq) {
                result[write_pos--] = left_sq;
                left++;
            } else {
                result[write_pos--] = right_sq;
                right--;
            }
        }
        return result;
    }
};

int main() {
    Solution solver;

    // Test Case 1
    std::vector<int> nums1 = {-4, -1, 0, 3, 10};
    std::vector<int> expected1 = {0, 1, 9, 16, 100};
    assert(solver.sortedSquaresOptimal(nums1) == expected1);
    assert(solver.sortedSquaresBruteForce(nums1) == expected1);
    std::cout << "Test Case 1 Passed: [-4, -1, 0, 3, 10] -> [0, 1, 9, 16, 100]\n";

    // Test Case 2
    std::vector<int> nums2 = {-7, -3, 2, 3, 11};
    std::vector<int> expected2 = {4, 9, 9, 49, 121};
    assert(solver.sortedSquaresOptimal(nums2) == expected2);
    std::cout << "Test Case 2 Passed: [-7, -3, 2, 3, 11] -> [4, 9, 9, 49, 121]\n";

    std::cout << "All Squaring Sorted Array tests successfully passed!\n";
    return 0;
}
