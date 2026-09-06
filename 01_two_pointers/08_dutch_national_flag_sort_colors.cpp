/**
 * @file 08_dutch_national_flag_sort_colors.cpp
 * @brief Problem: Given an array nums with n objects colored red, white, or blue,
 *        sort them in-place so that objects of the same color are adjacent,
 *        with the colors in the order red (0), white (1), and blue (2).
 *        You must solve this without using the library's sort function.
 * 
 * LeetCode Equivalent: LC 75 - Sort Colors
 * Difficulty: Medium
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Counting Sort (Two Passes)
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    void sortColorsTwoPass(std::vector<int>& nums) {
        int count0 = 0, count1 = 0, count2 = 0;
        for (int x : nums) {
            if (x == 0) count0++;
            else if (x == 1) count1++;
            else count2++;
        }
        int idx = 0;
        while (count0--) nums[idx++] = 0;
        while (count1--) nums[idx++] = 1;
        while (count2--) nums[idx++] = 2;
    }

    /**
     * @brief Approach 2: Dutch National Flag Algorithm (Optimal One-Pass 3-Pointers)
     * Intuition:
     * Maintain 3 pointers:
     * - 'low': boundary for 0s. Everything strictly left of 'low' is 0.
     * - 'mid': current element being examined.
     * - 'high': boundary for 2s. Everything strictly right of 'high' is 2.
     * 
     * Transitions:
     * 1. If nums[mid] == 0: swap(nums[low], nums[mid]), low++, mid++
     * 2. If nums[mid] == 1: mid++
     * 3. If nums[mid] == 2: swap(nums[mid], nums[high]), high-- (do NOT advance mid since swapped item is uninspected)
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) in-place
     */
    void sortColorsOptimal(std::vector<int>& nums) {
        int low = 0;
        int mid = 0;
        int high = (int)nums.size() - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                std::swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else { // nums[mid] == 2
                std::swap(nums[mid], nums[high]);
                high--;
            }
        }
    }
};

int main() {
    Solution solver;

    // Test Case 1: [2, 0, 2, 1, 1, 0]
    std::vector<int> nums1 = {2, 0, 2, 1, 1, 0};
    solver.sortColorsOptimal(nums1);
    std::vector<int> expected1 = {0, 0, 1, 1, 2, 2};
    assert(nums1 == expected1);
    std::cout << "Test Case 1 Passed: [2,0,2,1,1,0] -> [0,0,1,1,2,2]\n";

    // Test Case 2: [2, 0, 1]
    std::vector<int> nums2 = {2, 0, 1};
    solver.sortColorsOptimal(nums2);
    std::vector<int> expected2 = {0, 1, 2};
    assert(nums2 == expected2);
    std::cout << "Test Case 2 Passed: [2,0,1] -> [0,1,2]\n";

    // Test Case 3: Already sorted
    std::vector<int> nums3 = {0, 0, 1, 2};
    solver.sortColorsOptimal(nums3);
    assert(nums3 == (std::vector<int>{0, 0, 1, 2}));
    std::cout << "Test Case 3 Passed: [0,0,1,2] -> [0,0,1,2]\n";

    std::cout << "All Sort Colors tests successfully passed!\n";
    return 0;
}
