/**
 * @file 02_start_of_cycle.cpp
 * @brief Problem: Given the head of a linked list, return the node where the cycle begins.
 *        If there is no cycle, return null.
 * 
 * LeetCode Equivalent: LC 142 - Linked List Cycle II
 * Difficulty: Medium
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
     * @brief Approach 1: Hash Set
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    ListNode *detectCycleHashSet(ListNode *head) {
        std::unordered_set<ListNode*> visited;
        ListNode *curr = head;
        while (curr != nullptr) {
            if (visited.find(curr) != visited.end()) {
                return curr; // First node visited twice is the cycle start
            }
            visited.insert(curr);
            curr = curr->next;
        }
        return nullptr;
    }

    /**
     * @brief Approach 2: Floyd's Two Pointers (Optimal)
     * Intuition:
     * Phase 1: Determine if a cycle exists using fast (2x) and slow (1x).
     * Phase 2: Once they meet at node M, reset slow to head.
     *          Move slow and fast both at speed 1.
     *          The node where they meet is the exact cycle entry node!
     * 
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    ListNode *detectCycleOptimal(ListNode *head) {
        if (!head || !head->next) return nullptr;

        ListNode *slow = head;
        ListNode *fast = head;

        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;

            if (slow == fast) {
                // Cycle detected -> Phase 2
                ListNode *ptr1 = head;
                ListNode *ptr2 = slow;

                while (ptr1 != ptr2) {
                    ptr1 = ptr1->next;
                    ptr2 = ptr2->next;
                }
                return ptr1; // Start of cycle
            }
        }
        return nullptr; // No cycle
    }
};

int main() {
    Solution solver;

    // Build: 3 -> 2 -> 0 -> -4 -> (points back to node 2)
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(0);
    ListNode* n4 = new ListNode(-4);
    n1->next = n2;
    n2->next = n3;
    n3->next = n4;
    n4->next = n2; // Cycle starts at n2 (val = 2)

    ListNode* start_node = solver.detectCycleOptimal(n1);
    assert(start_node == n2);
    assert(solver.detectCycleHashSet(n1) == n2);
    std::cout << "Test Case 1 Passed: Cycle start identified as node with value: " << start_node->val << "\n";

    // Clean up
    n4->next = nullptr;
    delete n1; delete n2; delete n3; delete n4;

    std::cout << "All Start of Cycle tests successfully passed!\n";
    return 0;
}
