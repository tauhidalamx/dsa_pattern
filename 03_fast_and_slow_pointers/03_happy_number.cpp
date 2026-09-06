/**
 * @file 03_happy_number.cpp
 * @brief Problem: Write an algorithm to determine if a number n is happy.
 *        A happy number is a number defined by the following process:
 *        - Starting with any positive integer, replace the number by the sum of the squares of its digits.
 *        - Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
 *        - Those numbers for which this process ends in 1 are happy.
 * 
 * LeetCode Equivalent: LC 202 - Happy Number
 * Difficulty: Easy
 */

#include <iostream>
#include <unordered_set>
#include <cassert>

class Solution {
private:
    int getNext(int n) {
        int total_sum = 0;
        while (n > 0) {
            int digit = n % 10;
            total_sum += digit * digit;
            n /= 10;
        }
        return total_sum;
    }

public:
    /**
     * @brief Approach 1: Hash Set Cycle Detection
     * Time Complexity: O(log N)
     * Space Complexity: O(log N)
     */
    bool isHappyHashSet(int n) {
        std::unordered_set<int> seen;
        while (n != 1 && seen.find(n) == seen.end()) {
            seen.insert(n);
            n = getNext(n);
        }
        return n == 1;
    }

    /**
     * @brief Approach 2: Floyd's Cycle Finding (Optimal O(1) Space)
     * Intuition:
     * - The sequence of sum-of-squares forms an implicit singly linked list.
     * - 'slow' computes getNext(slow) (1 step).
     * - 'fast' computes getNext(getNext(fast)) (2 steps).
     * - If they meet at 1, it's a happy number. If they meet at any number != 1, there's a loop.
     * 
     * Time Complexity: O(log N)
     * Space Complexity: O(1)
     */
    bool isHappyOptimal(int n) {
        int slow = n;
        int fast = getNext(n);

        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        return fast == 1;
    }
};

int main() {
    Solution solver;

    // Test Case 1: 19 is happy
    // 1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0 + 0 = 1
    assert(solver.isHappyOptimal(19) == true);
    assert(solver.isHappyHashSet(19) == true);
    std::cout << "Test Case 1 Passed: 19 is a happy number!\n";

    // Test Case 2: 2 is not happy (loops into 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4)
    assert(solver.isHappyOptimal(2) == false);
    assert(solver.isHappyHashSet(2) == false);
    std::cout << "Test Case 2 Passed: 2 is NOT a happy number (cycle detected)!\n";

    // Test Case 3: 1 is happy
    assert(solver.isHappyOptimal(1) == true);
    std::cout << "Test Case 3 Passed: 1 is a happy number!\n";

    std::cout << "All Happy Number tests successfully passed!\n";
    return 0;
}
