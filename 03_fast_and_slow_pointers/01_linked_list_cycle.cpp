/**
 * @file 01_linked_list_cycle.cpp
 * @brief Problem: Given head, the head of a linked list, determine if the linked list has a cycle in it.
 * 
 * LeetCode Equivalent: LC 141 - Linked List Cycle
 * Difficulty: Easy
 */

#include <iostream>
#include <unordered_set>
#include <cassert>

// Definition for singly-linked list node.
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    /**
     * @brief Approach 1: Hash Set (Extra Space)
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    bool hasCycleHashSet(ListNode *head) {
        std::unordered_set<ListNode*> visited;
        ListNode* curr = head;
        while (curr != nullptr) {
            if (visited.find(curr) != visited.end()) {
                return true;
            }
            visited.insert(curr);
            curr = curr->next;
        }
        return false;
    }

    /**
     * @brief Approach 2: Floyd's Tortoise and Hare (Optimal)
     * Intuition:
     * - 'slow' moves 1 step, 'fast' moves 2 steps.
     * - If there is a cycle, fast will eventually lap slow and they will collide.
     * - If there is no cycle, fast will reach the end (nullptr).
     * 
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    bool hasCycleOptimal(ListNode *head) {
        if (!head || !head->next) return false;

        ListNode *slow = head;
        ListNode *fast = head;

        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;

            if (slow == fast) {
                return true; // Cycle detected
            }
        }
        return false; // Reached end of list
    }
};

int main() {
    Solution solver;

    // Test Case 1: List with cycle: 3 -> 2 -> 0 -> -4 -> (points back to 2)
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(0);
    ListNode* n4 = new ListNode(-4);
    n1->next = n2;
    n2->next = n3;
    n3->next = n4;
    n4->next = n2; // Creates cycle

    assert(solver.hasCycleOptimal(n1) == true);
    assert(solver.hasCycleHashSet(n1) == true);
    std::cout << "Test Case 1 Passed: Cycle [3 -> 2 -> 0 -> -4 -> 2] correctly detected!\n";

    // Test Case 2: List without cycle: 1 -> 2 -> nullptr
    ListNode* a1 = new ListNode(1);
    ListNode* a2 = new ListNode(2);
    a1->next = a2;
    assert(solver.hasCycleOptimal(a1) == false);
    assert(solver.hasCycleHashSet(a1) == false);
    std::cout << "Test Case 2 Passed: No Cycle [1 -> 2 -> null] correctly identified!\n";

    // Clean up non-cyclic nodes
    delete a1;
    delete a2;
    // Break cycle for cleanup
    n4->next = nullptr;
    delete n1; delete n2; delete n3; delete n4;

    std::cout << "All Linked List Cycle tests successfully passed!\n";
    return 0;
}
