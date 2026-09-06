/**
 * @file 05_longest_substring_without_repeats.cpp
 * @brief Problem: Given a string s, find the length of the longest substring
 *        without duplicate characters.
 * 
 * LeetCode Equivalent: LC 3 - Longest Substring Without Repeating Characters
 * Difficulty: Medium
 */

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <cassert>

class Solution {
public:
    /**
     * @brief Approach 1: Sliding Window with Unordered Map / Frequency
     * Time Complexity: O(2N) = O(N)
     * Space Complexity: O(min(N, Sigma))
     */
    int lengthOfLongestSubstringFreq(const std::string& s) {
        std::unordered_map<char, int> freq;
        int window_start = 0;
        int max_len = 0;

        for (int window_end = 0; window_end < (int)s.size(); ++window_end) {
            char right_char = s[window_end];
            freq[right_char]++;

            while (freq[right_char] > 1) {
                char left_char = s[window_start];
                freq[left_char]--;
                window_start++;
            }
            max_len = std::max(max_len, window_end - window_start + 1);
        }
        return max_len;
    }

    /**
     * @brief Approach 2: Sliding Window with Last Seen Index Table (Direct Jump - Optimal)
     * Intuition:
     * - Instead of advancing window_start step-by-step, maintain the last index where each character appeared.
     * - When character s[window_end] is seen again, directly jump window_start to max(window_start, last_index + 1).
     * 
     * Time Complexity: O(N) single pass
     * Space Complexity: O(1) fixed 128/256 size ASCII table
     */
    int lengthOfLongestSubstringOptimal(const std::string& s) {
        std::vector<int> last_seen(128, -1);
        int window_start = 0;
        int max_len = 0;

        for (int window_end = 0; window_end < (int)s.size(); ++window_end) {
            char current_char = s[window_end];

            // If the character is found inside the current window, jump window_start
            if (last_seen[(unsigned char)current_char] >= window_start) {
                window_start = last_seen[(unsigned char)current_char] + 1;
            }

            last_seen[(unsigned char)current_char] = window_end;
            max_len = std::max(max_len, window_end - window_start + 1);
        }
        return max_len;
    }
};

int main() {
    Solution solver;

    // Test Case 1: "abcabcbb" -> 3 ("abc")
    std::string s1 = "abcabcbb";
    assert(solver.lengthOfLongestSubstringOptimal(s1) == 3);
    assert(solver.lengthOfLongestSubstringFreq(s1) == 3);
    std::cout << "Test Case 1 Passed: \"abcabcbb\" -> 3\n";

    // Test Case 2: "bbbbb" -> 1 ("b")
    std::string s2 = "bbbbb";
    assert(solver.lengthOfLongestSubstringOptimal(s2) == 1);
    std::cout << "Test Case 2 Passed: \"bbbbb\" -> 1\n";

    // Test Case 3: "pwwkew" -> 3 ("wke")
    std::string s3 = "pwwkew";
    assert(solver.lengthOfLongestSubstringOptimal(s3) == 3);
    std::cout << "Test Case 3 Passed: \"pwwkew\" -> 3\n";

    std::cout << "All Longest Substring Without Repeating Characters tests passed!\n";
    return 0;
}
