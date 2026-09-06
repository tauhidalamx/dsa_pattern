# 🐢🐇 Pattern 03: Fast and Slow Pointers (Floyd's Tortoise and Hare)

---

## 📖 1. Theoretical Blueprint & Intuition

The **Fast & Slow Pointers** approach (also known as **Floyd's Cycle Finding Algorithm**) uses two pointers moving through a linear structure (linked list, array, or functional state sequence) at **different speeds**:
- **Slow Pointer (`slow`)**: Advances **1 step** per iteration ($s_{t} = s_{t-1} + 1$).
- **Fast Pointer (`fast`)**: Advances **2 steps** per iteration ($f_{t} = f_{t-1} + 2$).

### Mathematical Proof of Cycle Detection:
1. Suppose the cycle length is $C$, and the distance from list head to the start of the cycle is $L$.
2. Once both pointers enter the cycle, the relative distance between them decreases by $1$ in every step because $\text{speed}(fast) - \text{speed}(slow) = 2 - 1 = 1$.
3. Therefore, within at most $C$ steps inside the cycle, the distance between them becomes $0 \pmod C$, guaranteeing they will meet!

### Finding the Cycle Start Node:
When `slow` and `fast` meet at node $M$:
- Distance traveled by `slow` $= L + k_1 \cdot C + d$
- Distance traveled by `fast` $= 2 \cdot \text{dist}(slow) = L + k_2 \cdot C + d$
- By simplifying: $L = (k_2 - 2k_1) \cdot C - d$.
- **Theorem**: If we reset `slow` back to the `head` and keep `fast` at the meeting point $M$, moving both at **1 step per iteration**, they will intersect precisely at the **cycle entry point** after traversing $L$ steps!

```
     Head ----(L)----> [Start of Cycle] ----(d)----> [Meeting Point M]
                             ^                              |
                             |                              |
                             +-----------(C - d)------------+
```

---

## 🧠 2. When to Use the Fast & Slow Pointers Pattern?

Look for these **hallmark characteristics**:
- ✅ Detecting cycles or loops in a **Linked List**, **Array jumps** ($nums[i]$ as next index), or state transitions (e.g. **Happy Number**).
- ✅ Finding the **middle node** of a singly-linked list in a single pass $O(N)$ with $O(1)$ extra space.
- ✅ Checking whether a Singly Linked List is a **Palindrome** (Find middle $\rightarrow$ reverse second half $\rightarrow$ compare).
- ✅ Finding the **K-th element from the end** of a linked list.

---

## ⚙️ 3. Algorithmic Templates (C++)

### Template A: Linked List Cycle Detection
```cpp
ListNode* slow = head;
ListNode* fast = head;

while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) {
        return true; // Cycle detected
    }
}
return false; // Reached null termination
```

### Template B: Finding the Cycle Start Node
```cpp
ListNode* slow = head;
ListNode* fast = head;

while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) {
        // Step 2: Reset slow to head, move both at speed 1
        slow = head;
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }
        return slow; // Cycle start node
    }
}
return nullptr; // No cycle
```

### Template C: Middle of Linked List
```cpp
ListNode* slow = head;
ListNode* fast = head;

while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
}
return slow; // Middle node (for even nodes, returns second middle)
```

---

## 📊 4. Complexity Analysis Matrix

| Approach | Time Complexity | Space Complexity |
|---|:---:|:---:|
| **Hash Set Lookup** | $O(N)$ | $O(N)$ auxiliary memory |
| **Floyd's Fast & Slow (Optimal)** | $O(N)$ single pass | $O(1)$ zero heap allocation |

---

## ⚠️ 5. Common Edge Cases & Pitfalls
1. **Null Pointer Dereference**: Always verify `fast != nullptr && fast->next != nullptr` inside the while condition before calling `fast->next->next`.
2. **Empty List or 1-Node List**: Ensure handling when `head == nullptr` or `head->next == nullptr`.
3. **Restoring State**: When validating palindromes by reversing the second half, always reverse it back before returning if the caller expects the list to remain unmodified.
