/**
 * @file 02_remove_duplicates.cpp
 * @brief Problem: Given an integer array nums sorted in non-decreasing order,
 *        remove the duplicates in-place such that each unique element appears only once.
 *        The relative order of the elements should be kept the same.
 *        Return the number of unique elements k.
 * 
 * LeetCode Equivalent: LC 26 - Remove Duplicates from Sorted Array
 * Difficulty: Easy
 */

#include <iostream>
#include <vector>
#include <set>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Using Auxiliary Set (Extra Space)
     * Time Complexity: O(N log N)
     * Space Complexity: O(N)
     */
    int removeDuplicatesSet(std::vector<int>& nums) {
        if (nums.empty()) return 0;
        std::set<int> unique_elements(nums.begin(), nums.end());
        int index = 0;
        for (int val : unique_elements) {
            nums[index++] = val;
        }
        return index;
    }

    /**
     * @brief Approach 2: Two Pointers (Reader-Writer / Fast-Slow)
     * Intuition:
     * - 'slow' tracks the write index for unique values.
     * - 'fast' scans through the array from index 1 to n-1.
     * - Whenever nums[fast] != nums[slow], we increment 'slow' and write nums[fast].
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) in-place modification
     */
    int removeDuplicatesOptimal(std::vector<int>& nums) {
        if (nums.empty()) return 0;

        int slow = 0; // index of the last unique element placed
        for (size_t fast = 1; fast < nums.size(); ++fast) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        return slow + 1; // Count of unique elements
    }
};

int main() {
    Solution solver;

    // Test Case 1: [1, 1, 2]
    std::vector<int> nums1 = {1, 1, 2};
    int k1 = solver.removeDuplicatesOptimal(nums1);
    assert(k1 == 2);
    assert(nums1[0] == 1 && nums1[1] == 2);
    std::cout << "Test Case 1 Passed: [1, 1, 2] -> k = 2, array = [1, 2]\n";

    // Test Case 2: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
    std::vector<int> nums2 = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
    int k2 = solver.removeDuplicatesOptimal(nums2);
    assert(k2 == 5);
    std::vector<int> expected_prefix = {0, 1, 2, 3, 4};
    for (int i = 0; i < k2; ++i) {
        assert(nums2[i] == expected_prefix[i]);
    }
    std::cout << "Test Case 2 Passed: [0,0,1,1,1,2,2,3,3,4] -> k = 5, array = [0,1,2,3,4]\n";

    // Test Case 3: Single element
    std::vector<int> nums3 = {42};
    int k3 = solver.removeDuplicatesOptimal(nums3);
    assert(k3 == 1 && nums3[0] == 42);
    std::cout << "Test Case 3 Passed: [42] -> k = 1\n";

    std::cout << "All Remove Duplicates tests successfully passed!\n";
    return 0;
}
