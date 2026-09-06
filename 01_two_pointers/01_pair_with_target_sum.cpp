/**
 * @file 01_pair_with_target_sum.cpp
 * @brief Problem: Given an array of integers sorted in ascending order and a target sum,
 *        find two numbers such that they add up to the specific target number.
 *        Return their 0-indexed positions.
 * 
 * LeetCode Equivalent: LC 167 - Two Sum II - Input Array Is Sorted
 * Difficulty: Easy
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Brute Force (Nested Loops)
     * Time Complexity: O(N^2)
     * Space Complexity: O(1)
     */
    std::vector<int> twoSumBruteForce(const std::vector<int>& numbers, int target) {
        int n = numbers.size();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (numbers[i] + numbers[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }

    /**
     * @brief Approach 2: Hash Map (Unsorted Array Method)
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    std::vector<int> twoSumHashMap(const std::vector<int>& numbers, int target) {
        std::unordered_map<int, int> seen;
        for (int i = 0; i < (int)numbers.size(); ++i) {
            int complement = target - numbers[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[numbers[i]] = i;
        }
        return {};
    }

    /**
     * @brief Approach 3: Two Pointers (Optimal - Opposite Direction Converging)
     * Intuition: Because the array is already sorted:
     * - If sum < target: moving left pointer right increases the sum.
     * - If sum > target: moving right pointer left decreases the sum.
     * - If sum == target: answer found!
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) auxiliary memory
     */
    std::vector<int> twoSumOptimal(const std::vector<int>& numbers, int target) {
        int left = 0;
        int right = numbers.size() - 1;

        while (left < right) {
            long long current_sum = (long long)numbers[left] + numbers[right];
            if (current_sum == target) {
                return {left, right};
            } else if (current_sum < target) {
                left++; // Needs a larger value
            } else {
                right--; // Needs a smaller value
            }
        }
        return {};
    }
};

int main() {
    Solution solver;

    // Test Case 1
    std::vector<int> arr1 = {2, 7, 11, 15};
    int target1 = 9;
    std::vector<int> expected1 = {0, 1};
    assert(solver.twoSumOptimal(arr1, target1) == expected1);
    assert(solver.twoSumHashMap(arr1, target1) == expected1);
    assert(solver.twoSumBruteForce(arr1, target1) == expected1);
    std::cout << "Test Case 1 Passed: [2, 7, 11, 15] with target 9 -> indices [0, 1]\n";

    // Test Case 2
    std::vector<int> arr2 = {2, 3, 4};
    int target2 = 6;
    std::vector<int> expected2 = {0, 2};
    assert(solver.twoSumOptimal(arr2, target2) == expected2);
    std::cout << "Test Case 2 Passed: [2, 3, 4] with target 6 -> indices [0, 2]\n";

    // Test Case 3: Negative numbers
    std::vector<int> arr3 = {-10, -3, 0, 5, 9};
    int target3 = -1; // -10 + 9 = -1 -> indices {0, 4}
    std::vector<int> expected3 = {0, 4};
    assert(solver.twoSumOptimal(arr3, target3) == expected3);
    assert(solver.twoSumHashMap(arr3, target3) == expected3);
    assert(solver.twoSumBruteForce(arr3, target3) == expected3);
    std::cout << "Test Case 3 Passed: [-10, -3, 0, 5, 9] with target -1 -> indices [0, 4]\n";

    std::cout << "All Two Sum II tests successfully passed!\n";
    return 0;
}
