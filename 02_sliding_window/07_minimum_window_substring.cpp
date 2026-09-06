/**
 * @file 07_minimum_window_substring.cpp
 * @brief Problem: Given two strings s and t of lengths m and n respectively,
 *        return the minimum window substring of s such that every character
 *        in t (including duplicates) is included in the window.
 *        If there is no such substring, return the empty string "".
 * 
 * LeetCode Equivalent: LC 76 - Minimum Window Substring
 * Difficulty: Hard
 */

#include <iostream>
#include <string>
#include <vector>
#include <climits>
#include <cassert>

class Solution {
public:
    /**
     * @brief Optimal Sliding Window with Frequency Match Counting
     * Intuition:
     * 1. Build requirement frequency map from string `t`.
     * 2. Track count of unique characters currently meeting target frequency requirement (`matched_count`).
     * 3. Expand `window_end`:
     *    - Decrement required count for character `s[window_end]`.
     *    - If frequency matches target, increment `matched_count`.
     * 4. Once `matched_count == required_unique_chars`:
     *    - Update minimum window boundaries.
     *    - Shrink from `window_start` to find the minimal valid window.
     * 
     * Time Complexity: O(|S| + |T|)
     * Space Complexity: O(1) using fixed 128-element ASCII array
     */
    std::string minWindow(std::string s, std::string t) {
        if (s.empty() || t.empty() || s.size() < t.size()) return "";

        std::vector<int> target_freq(128, 0);
        int required_unique = 0;
        for (char c : t) {
            if (target_freq[(unsigned char)c] == 0) required_unique++;
            target_freq[(unsigned char)c]++;
        }

        std::vector<int> window_freq(128, 0);
        int matched_unique = 0;
        int window_start = 0;
        int min_len = INT_MAX;
        int best_start = 0;

        for (int window_end = 0; window_end < (int)s.size(); ++window_end) {
            char right_char = s[window_end];
            window_freq[(unsigned char)right_char]++;

            if (target_freq[(unsigned char)right_char] > 0 &&
                window_freq[(unsigned char)right_char] == target_freq[(unsigned char)right_char]) {
                matched_unique++;
            }

            // Try shrinking the window from the left while it remains valid
            while (matched_unique == required_unique) {
                int current_len = window_end - window_start + 1;
                if (current_len < min_len) {
                    min_len = current_len;
                    best_start = window_start;
                }

                char left_char = s[window_start];
                window_freq[(unsigned char)left_char]--;

                if (target_freq[(unsigned char)left_char] > 0 &&
                    window_freq[(unsigned char)left_char] < target_freq[(unsigned char)left_char]) {
                    matched_unique--;
                }
                window_start++;
            }
        }

        return min_len == INT_MAX ? "" : s.substr(best_start, min_len);
    }
};

int main() {
    Solution solver;

    // Test Case 1: s = "ADOBECODEBANC", t = "ABC" -> "BANC"
    std::string s1 = "ADOBECODEBANC";
    std::string t1 = "ABC";
    assert(solver.minWindow(s1, t1) == "BANC");
    std::cout << "Test Case 1 Passed: s=\"ADOBECODEBANC\", t=\"ABC\" -> \"BANC\"\n";

    // Test Case 2: s = "a", t = "a" -> "a"
    std::string s2 = "a";
    std::string t2 = "a";
    assert(solver.minWindow(s2, t2) == "a");
    std::cout << "Test Case 2 Passed: s=\"a\", t=\"a\" -> \"a\"\n";

    // Test Case 3: s = "a", t = "aa" -> ""
    std::string s3 = "a";
    std::string t3 = "aa";
    assert(solver.minWindow(s3, t3) == "");
    std::cout << "Test Case 3 Passed: s=\"a\", t=\"aa\" -> \"\"\n";

    std::cout << "All Minimum Window Substring tests successfully passed!\n";
    return 0;
}
