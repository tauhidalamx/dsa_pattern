/**
 * @file 04_triplet_sum_to_zero_3sum.cpp
 * @brief Problem: Given an integer array nums, return all unique triplets
 *        [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k,
 *        and nums[i] + nums[j] + nums[k] == 0.
 *        The solution set must not contain duplicate triplets.
 * 
 * LeetCode Equivalent: LC 15 - 3Sum
 * Difficulty: Medium
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Brute Force with Set Deduplication
     * Time Complexity: O(N^3 log K)
     * Space Complexity: O(N) for set storage
     */
    std::vector<std::vector<int>> threeSumBruteForce(std::vector<int> nums) {
        int n = nums.size();
        std::sort(nums.begin(), nums.end());
        std::set<std::vector<int>> unique_triplets;

        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                for (int k = j + 1; k < n; ++k) {
                    if ((long long)nums[i] + nums[j] + nums[k] == 0) {
                        unique_triplets.insert({nums[i], nums[j], nums[k]});
                    }
                }
            }
        }
        return std::vector<std::vector<int>>(unique_triplets.begin(), unique_triplets.end());
    }

    /**
     * @brief Approach 2: Sort + Two Pointers (Optimal)
     * Intuition:
     * 1. Sort nums in non-decreasing order.
     * 2. Iterate i from 0 to n-1:
     *    - If nums[i] > 0, we can break early (sum of 3 positives > 0).
     *    - If i > 0 and nums[i] == nums[i-1], skip to avoid outer duplicate triplets.
     *    - Run Two Pointers with left = i + 1, right = n - 1 looking for sum = -nums[i].
     *    - When found, record triplet and skip duplicate inner values.
     * 
     * Time Complexity: O(N^2)
     * Space Complexity: O(1) auxiliary (or O(log N) sorting stack)
     */
    std::vector<std::vector<int>> threeSumOptimal(std::vector<int> nums) {
        int n = nums.size();
        std::vector<std::vector<int>> result;
        if (n < 3) return result;

        std::sort(nums.begin(), nums.end());

        for (int i = 0; i < n - 2; ++i) {
            // Early break optimization
            if (nums[i] > 0) break;

            // Skip duplicate outer elements
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int target = -nums[i];
            int left = i + 1;
            int right = n - 1;

            while (left < right) {
                int sum = nums[left] + nums[right];
                if (sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});

                    // Skip duplicate left values
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // Skip duplicate right values
                    while (left < right && nums[right] == nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
};

int main() {
    Solution solver;

    // Test Case 1: Standard case
    std::vector<int> nums1 = {-1, 0, 1, 2, -1, -4};
    auto res1 = solver.threeSumOptimal(nums1);
    // Expected triplets: [[-1, -1, 2], [-1, 0, 1]]
    assert(res1.size() == 2);
    std::cout << "Test Case 1 Passed: 3Sum on [-1, 0, 1, 2, -1, -4] found " << res1.size() << " triplets.\n";

    // Test Case 2: All zeros
    std::vector<int> nums2 = {0, 0, 0, 0};
    auto res2 = solver.threeSumOptimal(nums2);
    assert(res2.size() == 1);
    assert(res2[0] == (std::vector<int>{0, 0, 0}));
    std::cout << "Test Case 2 Passed: 3Sum on [0, 0, 0, 0] -> [[0, 0, 0]]\n";

    // Test Case 3: No valid triplets
    std::vector<int> nums3 = {0, 1, 1};
    auto res3 = solver.threeSumOptimal(nums3);
    assert(res3.empty());
    std::cout << "Test Case 3 Passed: 3Sum on [0, 1, 1] -> empty\n";

    std::cout << "All 3Sum tests successfully passed!\n";
    return 0;
}
