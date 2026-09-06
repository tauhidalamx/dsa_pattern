/**
 * @file 13_trapping_rain_water.cpp
 * @brief Problem: Given n non-negative integers representing an elevation map
 *        where the width of each bar is 1, compute how much water it can trap after raining.
 * 
 * LeetCode Equivalent: LC 42 - Trapping Rain Water
 * Difficulty: Hard
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Dynamic Programming (Prefix Max & Suffix Max Arrays)
     * Intuition:
     * Water trapped at index i = max(0, min(max_left[i], max_right[i]) - height[i])
     * 
     * Time Complexity: O(N) with 3 passes
     * Space Complexity: O(N) for prefix/suffix arrays
     */
    int trapDP(const std::vector<int>& height) {
        int n = height.size();
        if (n <= 2) return 0;

        std::vector<int> left_max(n), right_max(n);
        left_max[0] = height[0];
        for (int i = 1; i < n; ++i) {
            left_max[i] = std::max(left_max[i - 1], height[i]);
        }

        right_max[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; --i) {
            right_max[i] = std::max(right_max[i + 1], height[i]);
        }

        int total_water = 0;
        for (int i = 0; i < n; ++i) {
            total_water += std::min(left_max[i], right_max[i]) - height[i];
        }
        return total_water;
    }

    /**
     * @brief Approach 2: Two Pointers (Optimal $O(1)$ Space)
     * Intuition:
     * - We place left at 0 and right at n - 1, keeping track of left_max and right_max.
     * - If left_max < right_max: we know for sure the water at 'left' is bounded by left_max
     *   (because right_max is already larger, so the right wall will not be the limiting factor).
     *   Hence, water += left_max - height[left], and we increment left.
     * - Else: water at 'right' is bounded by right_max.
     *   water += right_max - height[right], and we decrement right.
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) space
     */
    int trapOptimal(const std::vector<int>& height) {
        int n = height.size();
        if (n <= 2) return 0;

        int left = 0, right = n - 1;
        int left_max = 0, right_max = 0;
        int total_water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= left_max) {
                    left_max = height[left];
                } else {
                    total_water += left_max - height[left];
                }
                left++;
            } else {
                if (height[right] >= right_max) {
                    right_max = height[right];
                } else {
                    total_water += right_max - height[right];
                }
                right--;
            }
        }
        return total_water;
    }
};

int main() {
    Solution solver;

    // Test Case 1: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6
    std::vector<int> h1 = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    assert(solver.trapOptimal(h1) == 6);
    assert(solver.trapDP(h1) == 6);
    std::cout << "Test Case 1 Passed: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6 units\n";

    // Test Case 2: [4,2,0,3,2,5] -> 9
    std::vector<int> h2 = {4, 2, 0, 3, 2, 5};
    assert(solver.trapOptimal(h2) == 9);
    assert(solver.trapDP(h2) == 9);
    std::cout << "Test Case 2 Passed: [4,2,0,3,2,5] -> 9 units\n";

    // Test Case 3: Flat or strictly decreasing
    std::vector<int> h3 = {5, 4, 3, 2, 1};
    assert(solver.trapOptimal(h3) == 0);
    std::cout << "Test Case 3 Passed: [5,4,3,2,1] -> 0 units\n";

    std::cout << "All Trapping Rain Water tests successfully passed!\n";
    return 0;
}
