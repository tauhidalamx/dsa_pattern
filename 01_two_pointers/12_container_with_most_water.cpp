/**
 * @file 12_container_with_most_water.cpp
 * @brief Problem: Given n non-negative integers height[0], height[1], ..., height[n-1],
 *        where each represents a point at coordinate (i, height[i]).
 *        n vertical lines are drawn such that the two endpoints of the line i is at (i, height[i]) and (i, 0).
 *        Find two lines that together with the x-axis form a container, such that the container contains the most water.
 * 
 * LeetCode Equivalent: LC 11 - Container With Most Water
 * Difficulty: Medium
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Brute Force (Check all pairs)
     * Time Complexity: O(N^2)
     * Space Complexity: O(1)
     */
    int maxAreaBruteForce(const std::vector<int>& height) {
        int max_water = 0;
        int n = height.size();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                int h = std::min(height[i], height[j]);
                int w = j - i;
                max_water = std::max(max_water, h * w);
            }
        }
        return max_water;
    }

    /**
     * @brief Approach 2: Two Pointers (Greedy Inward Shrinkage - Optimal)
     * Intuition:
     * - We start with the widest possible container: left = 0, right = n - 1.
     * - The water capacity is constrained by the shorter line: min(height[left], height[right]) * (right - left).
     * - Moving the taller line inward can NEVER increase the area (width decreases, height is still bounded by shorter line).
     * - Therefore, our only chance to find a larger area is to move the shorter line inward!
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1)
     */
    int maxAreaOptimal(const std::vector<int>& height) {
        int left = 0;
        int right = (int)height.size() - 1;
        int max_water = 0;

        while (left < right) {
            int h = std::min(height[left], height[right]);
            int w = right - left;
            max_water = std::max(max_water, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return max_water;
    }
};

int main() {
    Solution solver;

    // Test Case 1: [1,8,6,2,5,4,8,3,7] -> 49
    std::vector<int> height1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    assert(solver.maxAreaOptimal(height1) == 49);
    assert(solver.maxAreaBruteForce(height1) == 49);
    std::cout << "Test Case 1 Passed: [1,8,6,2,5,4,8,3,7] -> 49\n";

    // Test Case 2: [1, 1] -> 1
    std::vector<int> height2 = {1, 1};
    assert(solver.maxAreaOptimal(height2) == 1);
    std::cout << "Test Case 2 Passed: [1, 1] -> 1\n";

    // Test Case 3: [4, 3, 2, 1, 4] -> 16
    std::vector<int> height3 = {4, 3, 2, 1, 4};
    assert(solver.maxAreaOptimal(height3) == 16);
    std::cout << "Test Case 3 Passed: [4, 3, 2, 1, 4] -> 16\n";

    std::cout << "All Container With Most Water tests successfully passed!\n";
    return 0;
}
