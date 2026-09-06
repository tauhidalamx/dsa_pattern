// ============================================================================
// PART 4: PATTERNS 21 TO 26 (Trie, String Matching, Bitwise & Tree Range Queries)
// ============================================================================

window.PATTERNS_PART_4 = [
  // --------------------------------------------------------------------------
  // PATTERN 21: Trie (Prefix Tree) & Bitwise XOR Trie
  // --------------------------------------------------------------------------
  {
    id: "21_trie_bitwise",
    num: 21,
    name: "Trie (Prefix Tree) & Bitwise XOR Trie",
    category: "Advanced Trees & Strings",
    difficulty: "Medium-Hard",
    badge: "Prefix Trees & Bitwise Lookups",
    shortDesc: "Tree structure storing re-entrant character or binary bit paths. Solves prefix lookups in O(L) and maximum XOR subarray queries in O(32 * N).",
    theory: {
      what: "A Trie (Prefix Tree) is an N-ary tree where each node represents a character or binary bit. Edge traversals construct keys. When applied to 32-bit integers (0/1 Bitwise Trie), it allows greedy queries for the opposite bit at each power of 2 to maximize XOR expressions in O(32) per query.",
      when: "Autocomplete/Typeahead, dictionary word validation, prefix matching, Boggle/Word Search II, IP routing (longest prefix match), Maximum XOR of two numbers, Maximum XOR Subarray.",
      coreIdea: "For standard Trie: maintain `children[26]` and `isEndOfWord` flag.\nFor Bitwise XOR Trie: insert 32-bit integers from MSB (bit 31) down to LSB (bit 0). To maximize `X ^ num`, greedily traverse the complementary bit `1 - bit` if present.",
      edgeCases: "Empty strings, duplicate word insertions, memory limits with deep sparse nodes (use array of pointers or vector pool), word being proper prefix of another word."
    },
    diagram: `flowchart TD
    Insert["Insert 'cat'"] --> Root["Root Node"]
    Root --> C["Child 'c'"]
    C --> A["Child 'a'"]
    A --> T["Child 't' (isEnd = true)"]
    
    Bitwise["Query Max XOR with bit 1"] --> CheckBit{"Opposite bit '0' exists?"}
    CheckBit -- Yes --> Greed["Move to '0'<br/>Contributes (1 << bit) to result"]
    CheckBit -- No --> Fallback["Move to '1'<br/>Contributes 0 to result"]`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Standard 26-ary Alphabet Trie
class Trie {
private:
    struct TrieNode {
        TrieNode* children[26];
        bool isEnd;
        TrieNode() : isEnd(false) {
            for (int i = 0; i < 26; ++i) children[i] = nullptr;
        }
    };
    TrieNode* root;

public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node && node->isEnd;
    }

    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node != nullptr;
    }
};`,
      brute: `// Bitwise 0/1 XOR Trie for Maximum XOR
class BitwiseTrie {
private:
    struct Node {
        Node* children[2] = {nullptr, nullptr};
    };
    Node* root;

public:
    BitwiseTrie() { root = new Node(); }

    void insert(int num) {
        Node* curr = root;
        for (int i = 31; i >= 0; --i) {
            int bit = (num >> i) & 1;
            if (!curr->children[bit]) curr->children[bit] = new Node();
            curr = curr->children[bit];
        }
    }

    int getMaxXOR(int num) {
        Node* curr = root;
        int maxVal = 0;
        for (int i = 31; i >= 0; --i) {
            int bit = (num >> i) & 1;
            int opp = 1 - bit;
            if (curr->children[opp]) {
                maxVal |= (1 << i);
                curr = curr->children[opp];
            } else {
                curr = curr->children[bit];
            }
        }
        return maxVal;
    }
};`,
      template: `// Word Search II Backtracking on Trie
struct TrieNode {
    TrieNode* next[26] = {};
    string word = "";
};

void buildTrie(TrieNode* root, const vector<string>& words) {
    for (const string& w : words) {
        TrieNode* p = root;
        for (char c : w) {
            int i = c - 'a';
            if (!p->next[i]) p->next[i] = new TrieNode();
            p = p->next[i];
        }
        p->word = w;
    }
}`
    },
    solutions: [
      {
        title: "Q1. Implement Trie (Prefix Tree)",
        diff: "Medium",
        time: "O(L) per op",
        space: "O(Total Chars * 26)",
        intuition: "Standard 26-way trie supporting insert, full word search, and prefix matching.",
        cpp: `#include <iostream>
#include <string>

using namespace std;

class Trie {
    struct Node {
        Node* next[26] = {};
        bool isEnd = false;
    } *root;

public:
    Trie() { root = new Node(); }

    void insert(string word) {
        Node* curr = root;
        for (char c : word) {
            if (!curr->next[c - 'a']) curr->next[c - 'a'] = new Node();
            curr = curr->next[c - 'a'];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        Node* curr = root;
        for (char c : word) {
            if (!curr->next[c - 'a']) return false;
            curr = curr->next[c - 'a'];
        }
        return curr && curr->isEnd;
    }

    bool startsWith(string prefix) {
        Node* curr = root;
        for (char c : prefix) {
            if (!curr->next[c - 'a']) return false;
            curr = curr->next[c - 'a'];
        }
        return curr != nullptr;
    }
};`
      },
      {
        title: "Q2. Maximum XOR of Two Numbers in an Array",
        diff: "Medium",
        time: "O(32 * N)",
        space: "O(32 * N)",
        intuition: "Insert all numbers into a binary 0/1 Trie. For each number, greedily navigate towards the complement bit (`1 - bit`) at each power of 2.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct TrieNode {
    TrieNode* next[2] = {};
};

void insert(TrieNode* root, int num) {
    TrieNode* curr = root;
    for (int i = 31; i >= 0; --i) {
        int b = (num >> i) & 1;
        if (!curr->next[b]) curr->next[b] = new TrieNode();
        curr = curr->next[b];
    }
}

int query(TrieNode* root, int num) {
    TrieNode* curr = root;
    int maxVal = 0;
    for (int i = 31; i >= 0; --i) {
        int b = (num >> i) & 1;
        int opp = 1 - b;
        if (curr->next[opp]) {
            maxVal |= (1 << i);
            curr = curr->next[opp];
        } else {
            curr = curr->next[b];
        }
    }
    return maxVal;
}

int findMaximumXOR(vector<int>& nums) {
    TrieNode* root = new TrieNode();
    for (int x : nums) insert(root, x);

    int maxXor = 0;
    for (int x : nums) maxXor = max(maxXor, query(root, x));
    return maxXor;
}`
      },
      {
        title: "Q3. Word Search II (Trie + 2D Backtracking)",
        diff: "Hard",
        time: "O(R * C * 4^L)",
        space: "O(Total Words Length)",
        intuition: "Store all dictionary words into a Trie. DFS across all matrix cells simultaneously traversing the Trie to prune non-existent prefix branches instantly.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct TrieNode {
    TrieNode* next[26] = {};
    string word = "";
};

void insert(TrieNode* root, const string& w) {
    TrieNode* p = root;
    for (char c : w) {
        int i = c - 'a';
        if (!p->next[i]) p->next[i] = new TrieNode();
        p = p->next[i];
    }
    p->word = w;
}

void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node, vector<string>& result) {
    char ch = board[r][c];
    if (ch == '#' || !node->next[ch - 'a']) return;

    node = node->next[ch - 'a'];
    if (!node->word.empty()) {
        result.push_back(node->word);
        node->word = ""; // Avoid duplicates
    }

    board[r][c] = '#';
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};

    for (int i = 0; i < 4; ++i) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < (int)board.size() && nc >= 0 && nc < (int)board[0].size()) {
            dfs(board, nr, nc, node, result);
        }
    }
    board[r][c] = ch;
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    TrieNode* root = new TrieNode();
    for (const string& w : words) insert(root, w);

    vector<string> result;
    for (size_t r = 0; r < board.size(); ++r) {
        for (size_t c = 0; c < board[0].size(); ++c) {
            dfs(board, r, c, root, result);
        }
    }
    return result;
}`
      },
      {
        title: "Q4. Design Add and Search Words Data Structure (Wildcard '.')",
        diff: "Medium",
        time: "O(26^Dots * L)",
        space: "O(Total Chars * 26)",
        intuition: "Trie search where '.' matches any child node via recursive branching across all non-null child pointers.",
        cpp: `#include <iostream>
#include <string>

using namespace std;

class WordDictionary {
    struct Node {
        Node* next[26] = {};
        bool isEnd = false;
    } *root;

    bool match(const string& word, int idx, Node* curr) {
        if (!curr) return false;
        if (idx == (int)word.size()) return curr->isEnd;

        char c = word[idx];
        if (c != '.') {
            return match(word, idx + 1, curr->next[c - 'a']);
        }
        for (int i = 0; i < 26; ++i) {
            if (curr->next[i] && match(word, idx + 1, curr->next[i])) {
                return true;
            }
        }
        return false;
    }

public:
    WordDictionary() { root = new Node(); }

    void addWord(string word) {
        Node* curr = root;
        for (char c : word) {
            if (!curr->next[c - 'a']) curr->next[c - 'a'] = new Node();
            curr = curr->next[c - 'a'];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        return match(word, 0, root);
    }
};`
      },
      {
        title: "Q5. Replace Words (Prefix Stem Replacement)",
        diff: "Medium",
        time: "O(Words * L + Dict * L)",
        space: "O(Dict * L)",
        intuition: "Store all root stems in a Trie. For each word in the sentence, find the shortest prefix stem in the Trie and replace it.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

struct Node {
    Node* next[26] = {};
    bool isEnd = false;
};

string replaceWords(vector<string>& dictionary, string sentence) {
    Node* root = new Node();
    for (const string& rootWord : dictionary) {
        Node* curr = root;
        for (char c : rootWord) {
            if (!curr->next[c - 'a']) curr->next[c - 'a'] = new Node();
            curr = curr->next[c - 'a'];
        }
        curr->isEnd = true;
    }

    stringstream ss(sentence);
    string word, result = "";

    while (ss >> word) {
        if (!result.empty()) result += " ";
        Node* curr = root;
        string prefix = "";
        bool replaced = false;

        for (char c : word) {
            if (!curr->next[c - 'a']) break;
            curr = curr->next[c - 'a'];
            prefix += c;
            if (curr->isEnd) {
                replaced = true;
                break;
            }
        }
        result += replaced ? prefix : word;
    }
    return result;
}`
      },
      {
        title: "Q6. Stream of Characters (Suffix Trie Matching)",
        diff: "Hard",
        time: "O(MaxWordLen) per query",
        space: "O(Total Chars * 26)",
        intuition: "Insert all words in reverse order into the Trie. When characters stream in, maintain a query history and search backward from the newest character.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class StreamChecker {
    struct Node {
        Node* next[26] = {};
        bool isEnd = false;
    } *root;

    string stream = "";

public:
    StreamChecker(vector<string>& words) {
        root = new Node();
        for (const string& w : words) {
            Node* curr = root;
            for (int i = (int)w.size() - 1; i >= 0; --i) {
                int c = w[i] - 'a';
                if (!curr->next[c]) curr->next[c] = new Node();
                curr = curr->next[c];
            }
            curr->isEnd = true;
        }
    }

    bool query(char letter) {
        stream += letter;
        Node* curr = root;

        for (int i = (int)stream.size() - 1; i >= 0; --i) {
            int c = stream[i] - 'a';
            if (!curr->next[c]) return false;
            curr = curr->next[c];
            if (curr->isEnd) return true;
        }
        return false;
    }
};`
      },
      {
        title: "Q7. Maximum Genetic Difference Query (Offline XOR Trie + Tree DFS)",
        diff: "Hard",
        time: "O((N + Q) * 18)",
        space: "O(N * 18)",
        intuition: "Process queries offline during Euler Tour DFS over the tree. Insert/remove node values from the Bitwise Trie upon entering/exiting tree nodes to answer ancestor queries in O(18).",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct TrieNode {
    TrieNode* next[2] = {};
    int count = 0;
};

void update(TrieNode* root, int val, int delta) {
    TrieNode* curr = root;
    for (int i = 18; i >= 0; --i) {
        int b = (val >> i) & 1;
        if (!curr->next[b]) curr->next[b] = new TrieNode();
        curr = curr->next[b];
        curr->count += delta;
    }
}

int query(TrieNode* root, int val) {
    TrieNode* curr = root;
    int maxDiff = 0;
    for (int i = 18; i >= 0; --i) {
        int b = (val >> i) & 1;
        int opp = 1 - b;
        if (curr->next[opp] && curr->next[opp]->count > 0) {
            maxDiff |= (1 << i);
            curr = curr->next[opp];
        } else {
            curr = curr->next[b];
        }
    }
    return maxDiff;
}

void dfs(int u, const vector<vector<int>>& tree, const vector<vector<pair<int, int>>>& queriesByNode,
         TrieNode* trieRoot, vector<int>& ans) {
    update(trieRoot, u, 1);
    for (const auto& [val, qIdx] : queriesByNode[u]) {
        ans[qIdx] = query(trieRoot, val);
    }
    for (int v : tree[u]) {
        dfs(v, tree, queriesByNode, trieRoot, ans);
    }
    update(trieRoot, u, -1);
}

vector<int> maxGeneticDifference(vector<int>& parents, vector<vector<int>>& queries) {
    int n = parents.size(), root = -1;
    vector<vector<int>> tree(n);
    for (int i = 0; i < n; ++i) {
        if (parents[i] == -1) root = i;
        else tree[parents[i]].push_back(i);
    }

    int q = queries.size();
    vector<vector<pair<int, int>>> queriesByNode(n);
    for (int i = 0; i < q; ++i) {
        queriesByNode[queries[i][0]].push_back({queries[i][1], i});
    }

    vector<int> ans(q);
    TrieNode* trieRoot = new TrieNode();
    dfs(root, tree, queriesByNode, trieRoot, ans);
    return ans;
}`
      }
    ],
    problems: [
      { id: "TR01", title: "Implement Trie (Prefix Tree)", diff: "Medium", tags: ["Trie"], time: "O(L)", space: "O(NL)" },
      { id: "TR02", title: "Maximum XOR of Two Numbers in Array", diff: "Medium", tags: ["Bitwise Trie"], time: "O(32N)", space: "O(32N)" },
      { id: "TR03", title: "Word Search II", diff: "Hard", tags: ["Trie Backtracking"], time: "O(RC * 4^L)", space: "O(NL)" },
      { id: "TR04", title: "Design Add and Search Words", diff: "Medium", tags: ["Trie Wildcard"], time: "O(26^D * L)", space: "O(NL)" },
      { id: "TR05", title: "Replace Words", diff: "Medium", tags: ["Prefix Stem"], time: "O(NL)", space: "O(NL)" },
      { id: "TR06", title: "Stream of Characters", diff: "Hard", tags: ["Suffix Trie"], time: "O(L)", space: "O(NL)" },
      { id: "TR07", title: "Maximum Genetic Difference Query", diff: "Hard", tags: ["Bitwise Trie + DFS"], time: "O((N+Q)*18)", space: "O(N*18)" },
      { id: "TR08", title: "Map Sum Pairs", diff: "Medium", tags: ["Trie Prefix Sum"], time: "O(L)", space: "O(NL)" },
      { id: "TR09", title: "Camelcase Matching", diff: "Medium", tags: ["Trie / Two Pointers"], time: "O(NL)", space: "O(1)" },
      { id: "TR10", title: "Multi Search (AC Automaton / Trie)", diff: "Medium", tags: ["Trie Search"], time: "O(B*L + NL)", space: "O(NL)" },
      { id: "TR11", title: "Shortest Unique Prefix", diff: "Medium", tags: ["Trie Frequency"], time: "O(NL)", space: "O(NL)" },
      { id: "TR12", title: "Concatenated Words", diff: "Hard", tags: ["Trie DP"], time: "O(N * L^2)", space: "O(NL)" },
      { id: "TR13", title: "Word Break (Trie Version)", diff: "Medium", tags: ["Trie DP"], time: "O(N^2)", space: "O(NL)" },
      { id: "TR14", title: "Word Break II (Trie Version)", diff: "Hard", tags: ["Trie DFS"], time: "O(2^N)", space: "O(2^N)" },
      { id: "TR15", title: "Palindrome Pairs", diff: "Hard", tags: ["Trie + Manacher"], time: "O(N * L^2)", space: "O(NL)" },
      { id: "TR16", title: "Index Pairs of a String", diff: "Easy", tags: ["Trie Match"], time: "O(TextLen * MaxWord)", space: "O(NL)" },
      { id: "TR17", title: "Search Suggestions System", diff: "Medium", tags: ["Trie Auto-suggest"], time: "O(NL + QL)", space: "O(NL)" },
      { id: "TR18", title: "Remove Sub-Folders from Filesystem", diff: "Medium", tags: ["Trie Path"], time: "O(N log N)", space: "O(NL)" },
      { id: "TR19", title: "Maximum XOR With an Element From Array", diff: "Hard", tags: ["Offline Bitwise Trie"], time: "O((N+Q) log(N+Q))", space: "O(32N)" },
      { id: "TR20", title: "Count Pairs With XOR in a Range", diff: "Hard", tags: ["Bitwise Trie Counting"], time: "O(16N)", space: "O(16N)" },
      { id: "TR21", title: "Sum of Prefix Scores of Strings", diff: "Hard", tags: ["Trie Node Count"], time: "O(NL)", space: "O(NL)" },
      { id: "TR22", title: "Implement Magic Dictionary", diff: "Medium", tags: ["Trie 1-Mismatch"], time: "O(26L)", space: "O(NL)" },
      { id: "TR23", title: "Prefix and Suffix Search (Trie Wrapped)", diff: "Hard", tags: ["Trie Paired"], time: "O(L^2) insert", space: "O(N * L^2)" },
      { id: "TR24", title: "Delete Duplicate Folders in System", diff: "Hard", tags: ["Trie Serialization + Hash"], time: "O(N * Depth)", space: "O(N)" },
      { id: "TR25", title: "Length of the Longest Valid Substring", diff: "Hard", tags: ["Trie + Sliding Window"], time: "O(N * 10)", space: "O(NL)" },
      { id: "TR26", title: "Design File System", diff: "Medium", tags: ["Trie Directory"], time: "O(Depth)", space: "O(Total Paths)" },
      { id: "TR27", title: "Maximum Strong Pair XOR II", diff: "Hard", tags: ["Sliding Window Bitwise Trie"], time: "O(32N)", space: "O(32N)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 22: Advanced String Matching (KMP, Z-Algorithm, Rabin-Karp)
  // --------------------------------------------------------------------------
  {
    id: "22_kmp_z_algorithm",
    num: 22,
    name: "Advanced String Matching (KMP, Z-Algorithm, Rabin-Karp)",
    category: "Advanced Trees & Strings",
    difficulty: "Medium-Hard",
    badge: "Linear String Processing",
    shortDesc: "Find exact substring occurrences, periodicities, and longest prefixes in deterministic linear time O(N + M) without backtracking.",
    theory: {
      what: "KMP computes the π (pi) table / Longest Prefix Suffix (LPS) array to skip redundant comparisons during pattern mismatch. Z-Algorithm computes `Z[i]` = length of longest substring starting at `i` that matches prefix of `s`. Rabin-Karp computes rolling polynomial hashes to compare substrings in O(1) expected time.",
      when: "Exact substring matching, periodic string detection, shortest palindrome prefix additions, rotational string equivalence, repeated substring patterns.",
      coreIdea: "KMP LPS building: `while (len > 0 && p[i] != p[len]) len = lps[len - 1]; if (p[i] == p[len]) len++; lps[i] = len;`.\nWhen mismatch occurs in text: reset `j = lps[j - 1]` without rewinding text pointer `i`.",
      edgeCases: "Pattern longer than text, empty pattern or text, periodic patterns with full overlap (`aaaaa`), hash collisions in Rabin-Karp (use double hashing)."
    },
    diagram: `flowchart TD
    BuildLPS["Build LPS Array for Pattern: O(M)"] --> Stream["Stream Text Characters: O(N)"]
    Stream --> Match{"Text[i] == Pattern[j]?"}
    Match -- Yes --> Advance["i++, j++<br/>If j == M: Pattern Found! j = LPS[j-1]"]
    Match -- No --> Mismatch{"j > 0?"}
    Mismatch -- Yes --> Fallback["j = LPS[j - 1]<br/>(No backtrack on i)"]
    Mismatch -- No --> Skip["i++"]`,
    visualizerType: "sliding_window",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Knuth-Morris-Pratt (KMP) Linear Substring Search: O(N + M)
vector<int> buildLPS(const string& pat) {
    int m = pat.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (pat[i] == pat[len]) {
            lps[i++] = ++len;
        } else if (len > 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}

int strStr(string text, string pattern) {
    if (pattern.empty()) return 0;
    int n = text.size(), m = pattern.size();
    vector<int> lps = buildLPS(pattern);

    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++; j++;
            if (j == m) return i - m; // Found match
        } else if (j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }
    return -1;
}`,
      brute: `// Z-Algorithm: Computes Z-array in O(N)
vector<int> computeZ(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;

    for (int i = 1; i < n; ++i) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}`,
      template: `// Rabin-Karp Rolling Hash Template
long long computeHash(const string& s, int len, long long base, long long mod) {
    long long h = 0;
    for (int i = 0; i < len; ++i) {
        h = (h * base + s[i]) % mod;
    }
    return h;
}`
    },
    solutions: [
      {
        title: "Q1. Find the Index of the First Occurrence in a String (KMP)",
        diff: "Easy",
        time: "O(N + M)",
        space: "O(M)",
        intuition: "Build LPS array on needle and scan haystack in linear time without backtracking.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int strStr(string haystack, string needle) {
    if (needle.empty()) return 0;
    int n = haystack.size(), m = needle.size();
    vector<int> lps(m, 0);

    for (int i = 1, len = 0; i < m;) {
        if (needle[i] == needle[len]) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }

    for (int i = 0, j = 0; i < n;) {
        if (haystack[i] == needle[j]) {
            i++; j++;
            if (j == m) return i - m;
        } else if (j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }
    return -1;
}`
      },
      {
        title: "Q2. Shortest Palindrome (KMP Prefix Reflection)",
        diff: "Hard",
        time: "O(N)",
        space: "O(N)",
        intuition: "Create combined string `s + '#' + reverse(s)`. The LPS value at the end gives length of longest palindromic prefix in `s`. Add remaining non-matching suffix in reverse at front.",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

string shortestPalindrome(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    string combined = s + "#" + rev;

    int n = combined.size();
    vector<int> lps(n, 0);
    for (int i = 1, len = 0; i < n;) {
        if (combined[i] == combined[len]) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }

    int matchedLen = lps.back();
    string prefixToAdd = rev.substr(0, s.size() - matchedLen);
    return prefixToAdd + s;
}`
      },
      {
        title: "Q3. Repeated Substring Pattern (LPS Divisibility)",
        diff: "Easy",
        time: "O(N)",
        space: "O(N)",
        intuition: "Build LPS array of string. If `lps[n-1] > 0` and `n % (n - lps[n-1]) == 0`, the string is formed by repeated copies of prefix of length `n - lps[n-1]`.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool repeatedSubstringPattern(string s) {
    int n = s.size();
    vector<int> lps(n, 0);

    for (int i = 1, len = 0; i < n;) {
        if (s[i] == s[len]) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }

    int len = lps[n - 1];
    return len > 0 && (n % (n - len) == 0);
}`
      },
      {
        title: "Q4. Longest Happy Prefix (Pure LPS Lookup)",
        diff: "Hard",
        time: "O(N)",
        space: "O(N)",
        intuition: "A happy prefix is a prefix that is also a suffix (excluding the entire string). Its maximum length is simply `lps[n-1]`.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

string longestPrefix(string s) {
    int n = s.size();
    vector<int> lps(n, 0);

    for (int i = 1, len = 0; i < n;) {
        if (s[i] == s[len]) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }

    return s.substr(0, lps[n - 1]);
}`
      },
      {
        title: "Q5. String Matching Using Z-Algorithm",
        diff: "Medium",
        time: "O(N + M)",
        space: "O(N + M)",
        intuition: "Construct `pattern + '$' + text`. Compute the Z-array. Any index `i` where `Z[i] == pattern.length()` marks a valid occurrence starting at `i - pattern.length() - 1`.",
        cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

vector<int> searchPatternZ(string text, string pattern) {
    string s = pattern + "$" + text;
    int n = s.size(), m = pattern.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;

    for (int i = 1; i < n; ++i) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }

    vector<int> occurrences;
    for (int i = m + 1; i < n; ++i) {
        if (z[i] == m) {
            occurrences.push_back(i - m - 1);
        }
    }
    return occurrences;
}`
      },
      {
        title: "Q6. Longest Duplicate Substring (Rabin-Karp + Binary Search)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Binary search on duplicate substring length `L`. For fixed `L`, use Rabin-Karp rolling double-hash to detect duplicate substrings in O(N).",
        cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>

using namespace std;

string longestDupSubstring(string s) {
    int n = s.size();
    int low = 1, high = n - 1;
    string best = "";

    const long long MOD = 1e9 + 7, BASE = 31;

    auto check = [&](int len) -> int {
        long long hash = 0, power = 1;
        for (int i = 0; i < len; ++i) {
            hash = (hash * BASE + (s[i] - 'a')) % MOD;
            if (i < len - 1) power = (power * BASE) % MOD;
        }

        unordered_set<long long> seen;
        seen.insert(hash);

        for (int i = len; i < n; ++i) {
            hash = (hash - (s[i - len] - 'a') * power % MOD + MOD) % MOD;
            hash = (hash * BASE + (s[i] - 'a')) % MOD;
            if (seen.count(hash)) return i - len + 1;
            seen.insert(hash);
        }
        return -1;
    };

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int startIdx = check(mid);
        if (startIdx != -1) {
            best = s.substr(startIdx, mid);
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return best;
}`
      },
      {
        title: "Q7. Form Array by Concatenating Subarrays (KMP Multi-Pattern Scan)",
        diff: "Medium",
        time: "O(Sum(GroupLen) + N)",
        space: "O(MaxGroupLen)",
        intuition: "Greedily find non-overlapping occurrences of each subarray group in `nums` sequentially using KMP pattern matching.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

bool canChoose(vector<vector<int>>& groups, vector<int>& nums) {
    int n = nums.size(), groupIdx = 0, textIdx = 0;

    while (groupIdx < (int)groups.size() && textIdx < n) {
        const auto& target = groups[groupIdx];
        int m = target.size();

        // Build LPS for current group
        vector<int> lps(m, 0);
        for (int i = 1, len = 0; i < m;) {
            if (target[i] == target[len]) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }

        // KMP Search
        int j = 0;
        bool found = false;
        while (textIdx < n) {
            if (nums[textIdx] == target[j]) {
                textIdx++; j++;
                if (j == m) {
                    found = true;
                    break;
                }
            } else if (j > 0) {
                j = lps[j - 1];
            } else {
                textIdx++;
            }
        }
        if (!found) return false;
        groupIdx++;
    }
    return groupIdx == (int)groups.size();
}`
      }
    ],
    problems: [
      { id: "SM01", title: "Find the Index of First Occurrence (strStr)", diff: "Easy", tags: ["KMP"], time: "O(N+M)", space: "O(M)" },
      { id: "SM02", title: "Shortest Palindrome", diff: "Hard", tags: ["KMP LPS"], time: "O(N)", space: "O(N)" },
      { id: "SM03", title: "Repeated Substring Pattern", diff: "Easy", tags: ["KMP Divisibility"], time: "O(N)", space: "O(N)" },
      { id: "SM04", title: "Longest Happy Prefix", diff: "Hard", tags: ["LPS Array"], time: "O(N)", space: "O(N)" },
      { id: "SM05", title: "String Matching Using Z-Algorithm", diff: "Medium", tags: ["Z-Algorithm"], time: "O(N+M)", space: "O(N+M)" },
      { id: "SM06", title: "Longest Duplicate Substring", diff: "Hard", tags: ["Rabin-Karp + BS"], time: "O(N log N)", space: "O(N)" },
      { id: "SM07", title: "Form Array by Concatenating Subarrays", diff: "Medium", tags: ["KMP Multi-Search"], time: "O(N + M)", space: "O(M)" },
      { id: "SM08", title: "Rotate String", diff: "Easy", tags: ["KMP / Find"], time: "O(N)", space: "O(N)" },
      { id: "SM09", title: "Sum of Scores of Built Strings", diff: "Hard", tags: ["Z-Algorithm"], time: "O(N)", space: "O(N)" },
      { id: "SM10", title: "Maximum Repeating Substring", diff: "Easy", tags: ["KMP / DP"], time: "O(N)", space: "O(1)" },
      { id: "SM11", title: "Check If String Is Transformable With Substring Sorts", diff: "Hard", tags: ["Queue + Greedy"], time: "O(N)", space: "O(N)" },
      { id: "SM12", title: "Distinct Echo Substrings", diff: "Hard", tags: ["Rolling Hash / Z"], time: "O(N^2)", space: "O(N)" },
      { id: "SM13", title: "Count Beautiful Substrings II", diff: "Hard", tags: ["Hash + Math"], time: "O(N sqrt(K))", space: "O(N)" },
      { id: "SM14", title: "Minimum Moves to Make String Parindrome", diff: "Hard", tags: ["Two Pointers Greedy"], time: "O(N^2)", space: "O(1)" },
      { id: "SM15", title: "Pattern Matching (LCP Array)", diff: "Hard", tags: ["Suffix Automaton / LCP"], time: "O(N log N)", space: "O(N)" },
      { id: "SM16", title: "Longest Chunked Palindrome Decomposition", diff: "Hard", tags: ["Rolling Hash Greedy"], time: "O(N)", space: "O(1)" },
      { id: "SM17", title: "Find Beautiful Indices in the Given Array II", diff: "Hard", tags: ["KMP + Binary Search"], time: "O(N + M)", space: "O(N)" },
      { id: "SM18", title: "Count Substrings That Satisfy K-Constraint II", diff: "Hard", tags: ["Sliding Window + Binary Search"], time: "O(Q log N)", space: "O(N)" },
      { id: "SM19", title: "Check If Word Can Be Placed in Crossword", diff: "Medium", tags: ["Matrix Scan KMP"], time: "O(RC)", space: "O(1)" },
      { id: "SM20", title: "Construct Smallest Number From DI String", diff: "Medium", tags: ["Stack / Greedy"], time: "O(N)", space: "O(N)" },
      { id: "SM21", title: "Find Substring With Given Hash Value", diff: "Hard", tags: ["Reverse Rolling Hash"], time: "O(N)", space: "O(1)" },
      { id: "SM22", title: "Maximum Number of Non-Overlapping Substrings", diff: "Hard", tags: ["Interval Greedy + Suffix"], time: "O(26 * N)", space: "O(26)" },
      { id: "SM23", title: "Count Prefixes of a Given String", diff: "Easy", tags: ["Prefix Match"], time: "O(N * L)", space: "O(1)" },
      { id: "SM24", title: "Minimum Time to Revert Word to Initial State II", diff: "Hard", tags: ["Z-Algorithm"], time: "O(N)", space: "O(N)" },
      { id: "SM25", title: "Longest Common Subpath", diff: "Hard", tags: ["Rolling Double Hash + BS"], time: "O(TotalLen log(MinLen))", space: "O(N)" },
      { id: "SM26", title: "Count Palindromic Subsequences", diff: "Hard", tags: ["Prefix Frequency DP"], time: "O(N)", space: "O(1)" },
      { id: "SM27", title: "Find Pattern in Infinite Stream", diff: "Hard", tags: ["Streaming KMP"], time: "O(StreamLen)", space: "O(PatternLen)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 23: Bit Manipulation & Math Hacks
  // --------------------------------------------------------------------------
  {
    id: "23_bit_manipulation",
    num: 23,
    name: "Bit Manipulation & Math Hacks",
    category: "Math & Bit Manipulation",
    difficulty: "Easy-Medium",
    badge: "Low-Level Arithmetic & Bits",
    shortDesc: "Exploit binary representation properties (Brian Kernighan's `x & (x-1)`, isolations `x & -x`, XOR cancellations, fast exponentiation) in O(1) time.",
    theory: {
      what: "Bitwise logic computes low-level integer operations with zero memory overhead. Key identities:\n1. `n & (n - 1)` drops lowest set bit.\n2. `n & -n` extracts lowest set bit (LSB).\n3. `x ^ x = 0` and `x ^ 0 = x` eliminates duplicate pairs.",
      when: "Counting set bits, single number finding, power of two validation, subset generation (submask enumeration `sub = (sub - 1) & mask`), fast modular exponentiation O(log N).",
      coreIdea: "Brian Kernighan popcount: loop `while (n) { n &= (n - 1); count++; }` runs in O(set bits) time. Fast Exponentiation: square base on 0 bits, multiply base on 1 bits.",
      edgeCases: "Signed integer 32-bit overflow (use `unsigned int` or `int64_t`), bit shifts >= 32 causing undefined behavior, negative numbers with two's complement sign bit."
    },
    diagram: `flowchart TD
    Num["Binary Number x"] --> Op1["Clear lowest set bit: x & (x - 1)"]
    Num --> Op2["Extract lowest set bit: x & -x"]
    Num --> Op3["Toggle i-th bit: x ^ (1 << i)"]
    Num --> Op4["Check i-th bit: (x >> i) & 1"]`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <iostream>
#include <vector>

using namespace std;

// Fast Modular Exponentiation: O(log Exp)
long long powerMod(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return res;
}`,
      brute: `// Brian Kernighan's Popcount Algorithm
int countSetBits(int n) {
    int count = 0;
    while (n) {
        n &= (n - 1); // Clears the lowest set bit
        count++;
    }
    return count;
}`,
      template: `// Submask Enumeration for a given Bitmask
void iterateSubmasks(int mask) {
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
        // Process submask 'sub'
    }
}`
    },
    solutions: [
      {
        title: "Q1. Single Number (XOR Cancellation)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1)",
        intuition: "Every number appearing twice cancels itself out under XOR (`x ^ x = 0`). The unique element remains.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x;
    return res;
}`
      },
      {
        title: "Q2. Single Number II (Elements Appearing 3 Times)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "Count bits modulo 3 across all 32 bit positions, or use two bitmasks `ones` and `twos` to implement a finite state machine.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int singleNumber(vector<int>& nums) {
    int ones = 0, twos = 0;
    for (int x : nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
    }
    return ones;
}`
      },
      {
        title: "Q3. Single Number III (Two Unique Elements)",
        diff: "Medium",
        time: "O(N)",
        space: "O(1)",
        intuition: "XOR all numbers to get `A ^ B`. Extract lowest set bit `diff = xorSum & -xorSum` which differentiates A and B. Partition array into two groups based on this bit.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

vector<int> singleNumber(vector<int>& nums) {
    long long xorSum = 0;
    for (int x : nums) xorSum ^= x;

    long long diff = xorSum & -xorSum; // Lowest set bit
    int a = 0, b = 0;

    for (int x : nums) {
        if (x & diff) a ^= x;
        else b ^= x;
    }
    return {a, b};
}`
      },
      {
        title: "Q4. Counting Bits (DP with Lowest Set Bit)",
        diff: "Easy",
        time: "O(N)",
        space: "O(1) excluding output",
        intuition: "Number of set bits in `i` is `ans[i & (i - 1)] + 1`.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

vector<int> countBits(int n) {
    vector<int> ans(n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        ans[i] = ans[i & (i - 1)] + 1;
    }
    return ans;
}`
      },
      {
        title: "Q5. Reverse Bits (32-bit Reversal)",
        diff: "Easy",
        time: "O(1)",
        space: "O(1)",
        intuition: "Iterate 32 times: shift result left by 1 and append lowest bit of `n`, then shift `n` right by 1.",
        cpp: `#include <iostream>
#include <cstdint>

using namespace std;

uint32_t reverseBits(uint32_t n) {
    uint32_t res = 0;
    for (int i = 0; i < 32; ++i) {
        res = (res << 1) | (n & 1);
        n >>= 1;
    }
    return res;
}`
      },
      {
        title: "Q6. Bitwise AND of Numbers Range [m, n]",
        diff: "Medium",
        time: "O(32)",
        space: "O(1)",
        intuition: "Find the common binary prefix of `m` and `n`. Shift both numbers right until they match, then shift back left.",
        cpp: `#include <iostream>

using namespace std;

int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left < right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}`
      },
      {
        title: "Q7. Pow(x, n) (Binary Exponentiation)",
        diff: "Medium",
        time: "O(log N)",
        space: "O(1)",
        intuition: "Multiply base into accumulator when lowest bit of exponent is 1, then square base and halve exponent.",
        cpp: `#include <iostream>

using namespace std;

double myPow(double x, int n) {
    long long exp = n;
    if (exp < 0) {
        x = 1.0 / x;
        exp = -exp;
    }

    double res = 1.0;
    while (exp > 0) {
        if (exp & 1) res *= x;
        x *= x;
        exp >>= 1;
    }
    return res;
}`
      }
    ],
    problems: [
      { id: "BM01", title: "Single Number", diff: "Easy", tags: ["XOR"], time: "O(N)", space: "O(1)" },
      { id: "BM02", title: "Single Number II", diff: "Medium", tags: ["Bit FSM"], time: "O(N)", space: "O(1)" },
      { id: "BM03", title: "Single Number III", diff: "Medium", tags: ["LSB Partition"], time: "O(N)", space: "O(1)" },
      { id: "BM04", title: "Counting Bits", diff: "Easy", tags: ["Bit DP"], time: "O(N)", space: "O(1)" },
      { id: "BM05", title: "Reverse Bits", diff: "Easy", tags: ["Bit Shift"], time: "O(1)", space: "O(1)" },
      { id: "BM06", title: "Bitwise AND of Numbers Range", diff: "Medium", tags: ["Bit Prefix"], time: "O(1)", space: "O(1)" },
      { id: "BM07", title: "Pow(x, n)", diff: "Medium", tags: ["Fast Exp"], time: "O(log N)", space: "O(1)" },
      { id: "BM08", title: "Number of 1 Bits", diff: "Easy", tags: ["Kernighan"], time: "O(Bits)", space: "O(1)" },
      { id: "BM09", title: "Power of Two", diff: "Easy", tags: ["Bit Trick"], time: "O(1)", space: "O(1)" },
      { id: "BM10", title: "Power of Four", diff: "Easy", tags: ["Bitmask"], time: "O(1)", space: "O(1)" },
      { id: "BM11", title: "Missing Number", diff: "Easy", tags: ["XOR"], time: "O(N)", space: "O(1)" },
      { id: "BM12", title: "Sum of Two Integers (No + or -)", diff: "Medium", tags: ["Bit Adder"], time: "O(1)", space: "O(1)" },
      { id: "BM13", title: "Divide Two Integers (Bit Shifts)", diff: "Medium", tags: ["Binary Long Division"], time: "O(log N)", space: "O(1)" },
      { id: "BM14", title: "Total Hamming Distance", diff: "Medium", tags: ["Column Bit Sum"], time: "O(32N)", space: "O(1)" },
      { id: "BM15", title: "Subsets (Bitmask Iteration)", diff: "Medium", tags: ["Bitmask"], time: "O(N * 2^N)", space: "O(1)" },
      { id: "BM16", title: "Subsets II (Bitmask Duplicate Prune)", diff: "Medium", tags: ["Bitmask"], time: "O(N * 2^N)", space: "O(1)" },
      { id: "BM17", title: "Generalized Abbreviation", diff: "Medium", tags: ["Bitmask Combinations"], time: "O(N * 2^N)", space: "O(1)" },
      { id: "BM18", title: "Triples with Bitwise AND Equal To Zero", diff: "Hard", tags: ["Frequency Bucket"], time: "O(N^2 + N * 2^16)", space: "O(2^16)" },
      { id: "BM19", title: "Find XOR Sum of All Pairs Bitwise AND", diff: "Hard", tags: ["Distributive XOR"], time: "O(N + M)", space: "O(1)" },
      { id: "BM20", title: "Minimum One Bit Operations to Make Integers Zero", diff: "Hard", tags: ["Gray Code"], time: "O(32)", space: "O(1)" },
      { id: "BM21", title: "Gray Code Sequence", diff: "Medium", tags: ["Gray Formula"], time: "O(2^N)", space: "O(1)" },
      { id: "BM22", title: "Minimum Flips to Make a OR b Equal to c", diff: "Medium", tags: ["Bit Logic"], time: "O(1)", space: "O(1)" },
      { id: "BM23", title: "Count Triplets That Can Form Two Arrays of Equal XOR", diff: "Medium", tags: ["Prefix XOR"], time: "O(N)", space: "O(N)" },
      { id: "BM24", title: "Find The Original Array of Prefix XOR", diff: "Medium", tags: ["Inverse XOR"], time: "O(N)", space: "O(1)" },
      { id: "BM25", title: "Number of Steps to Reduce a Number in Binary Representation to One", diff: "Medium", tags: ["String Bit Carry"], time: "O(N)", space: "O(1)" },
      { id: "BM26", title: "Check If String Contains All Binary Codes of Size K", diff: "Medium", tags: ["Rolling Bitmask"], time: "O(N)", space: "O(2^K)" },
      { id: "BM27", title: "Bitwise ORs of Subarrays", diff: "Medium", tags: ["Monotonic Bit Set"], time: "O(32N)", space: "O(32)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 24: Segment Tree with Lazy Propagation
  // --------------------------------------------------------------------------
  {
    id: "24_segment_tree",
    num: 24,
    name: "Segment Tree with Lazy Propagation",
    category: "Advanced Range Queries",
    difficulty: "Hard",
    badge: "O(log N) Range Updates & Queries",
    shortDesc: "Complete binary tree over ranges supporting arbitrary associative queries (Sum, Min, Max, GCD) and range modifications in O(log N) with Lazy Propagation.",
    theory: {
      what: "A Segment Tree allocates 4*N nodes where each node aggregates a half-interval `[l, r]`. Lazy propagation defers range updates down the tree until requested by child visits, keeping range update complexity at O(log N).",
      when: "Range minimum / sum queries with range additions / assignments, rectangle area intersection, falling squares, count of smaller numbers after self, dynamic interval management.",
      coreIdea: "1. `pushDown(node, l, r)`: apply pending `lazy[node]` to child nodes.\n2. `update(node, l, r, ql, qr, val)`: if `[l, r]` inside query, apply update and mark lazy; else recurse children.\n3. `query(node, l, r, ql, qr)`: merge child query responses.",
      edgeCases: "0-based vs 1-based indexing, segment size not power of two (4*N bounds required), combining multiple lazy update types (assignment vs addition order)."
    },
    diagram: `flowchart TD
    Root["Node 1: Range [0, 7]"] --> L["Node 2: Range [0, 3]"]
    Root --> R["Node 3: Range [4, 7]"]
    L --> LL["Node 4: [0, 1]"]
    L --> LR["Node 5: [2, 3]"]
    R --> RL["Node 6: [4, 5]"]
    R --> RR["Node 7: [6, 7]"]
    
    Update["Range Update [2, 6]"] --> PushDown["Push Lazy Flags to Children<br/>Update O(log N) nodes"]`,
    visualizerType: "binary_search",
    code: {
      optimal: `#include <iostream>
#include <vector>

using namespace std;

// Segment Tree with Range Additions and Range Sum Query
class SegmentTree {
    int n;
    vector<long long> tree, lazy;

    void pushDown(int node, int l, int r) {
        if (lazy[node] != 0) {
            int mid = l + (r - l) / 2;
            lazy[2 * node] += lazy[node];
            tree[2 * node] += lazy[node] * (mid - l + 1);

            lazy[2 * node + 1] += lazy[node];
            tree[2 * node + 1] += lazy[node] * (r - mid);

            lazy[node] = 0;
        }
    }

public:
    SegmentTree(int size) : n(size), tree(4 * size, 0), lazy(4 * size, 0) {}

    void updateRange(int node, int l, int r, int ql, int qr, long long val) {
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        pushDown(node, l, r);
        int mid = l + (r - l) / 2;
        if (ql <= mid) updateRange(2 * node, l, mid, ql, qr, val);
        if (qr > mid) updateRange(2 * node + 1, mid + 1, r, ql, qr, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long queryRange(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        pushDown(node, l, r);
        int mid = l + (r - l) / 2;
        long long sum = 0;
        if (ql <= mid) sum += queryRange(2 * node, l, mid, ql, qr);
        if (qr > mid) sum += queryRange(2 * node + 1, mid + 1, r, ql, qr);
        return sum;
    }
};`,
      brute: `// Simple Point Update Segment Tree (No Lazy Propagation)
class PointSegmentTree {
    int n;
    vector<int> tree;

public:
    PointSegmentTree(int size) : n(size), tree(4 * size, 0) {}

    void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = l + (r - l) / 2;
        if (idx <= mid) update(2 * node, l, mid, idx, val);
        else update(2 * node + 1, mid + 1, r, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        int mid = l + (r - l) / 2, sum = 0;
        if (ql <= mid) sum += query(2 * node, l, mid, ql, qr);
        if (qr > mid) sum += query(2 * node + 1, mid + 1, r, ql, qr);
        return sum;
    }
};`,
      template: `// Dynamic Node Segment Tree (Coordinate Space up to 1e9)
struct DynamicNode {
    long long val = 0, lazy = 0;
    DynamicNode *left = nullptr, *right = nullptr;
};`
    },
    solutions: [
      {
        title: "Q1. Range Sum Query - Mutable (Point Update Segment Tree)",
        diff: "Medium",
        time: "O(log N) update/query",
        space: "O(4N)",
        intuition: "Build binary segment tree over array values. Single point modifications update log N tree nodes to root.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class NumArray {
    int n;
    vector<int> tree;

    void build(const vector<int>& nums, int node, int l, int r) {
        if (l == r) {
            tree[node] = nums[l];
            return;
        }
        int mid = l + (r - l) / 2;
        build(nums, 2 * node, l, mid);
        build(nums, 2 * node + 1, mid + 1, r);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void updateTree(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = l + (r - l) / 2;
        if (idx <= mid) updateTree(2 * node, l, mid, idx, val);
        else updateTree(2 * node + 1, mid + 1, r, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int queryTree(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        int mid = l + (r - l) / 2, sum = 0;
        if (ql <= mid) sum += queryTree(2 * node, l, mid, ql, qr);
        if (qr > mid) sum += queryTree(2 * node + 1, mid + 1, r, ql, qr);
        return sum;
    }

public:
    NumArray(vector<int>& nums) : n(nums.size()), tree(4 * nums.size(), 0) {
        build(nums, 1, 0, n - 1);
    }

    void update(int index, int val) {
        updateTree(1, 0, n - 1, index, val);
    }

    int sumRange(int left, int right) {
        return queryTree(1, 0, n - 1, left, right);
    }
};`
      },
      {
        title: "Q2. Range Minimum Query with Lazy Updates",
        diff: "Hard",
        time: "O(log N) per op",
        space: "O(4N)",
        intuition: "Maintain range minimums. Push down lazy additions to children on partial node visits.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class LazyMinSegmentTree {
    int n;
    vector<int> tree, lazy;

    void pushDown(int node) {
        if (lazy[node] != 0) {
            lazy[2 * node] += lazy[node];
            tree[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
            tree[2 * node + 1] += lazy[node];
            lazy[node] = 0;
        }
    }

public:
    LazyMinSegmentTree(int size) : n(size), tree(4 * size, 0), lazy(4 * size, 0) {}

    void updateRange(int node, int l, int r, int ql, int qr, int val) {
        if (ql <= l && r <= qr) {
            tree[node] += val;
            lazy[node] += val;
            return;
        }
        pushDown(node);
        int mid = l + (r - l) / 2;
        if (ql <= mid) updateRange(2 * node, l, mid, ql, qr, val);
        if (qr > mid) updateRange(2 * node + 1, mid + 1, r, ql, qr, val);
        tree[node] = min(tree[2 * node], tree[2 * node + 1]);
    }

    int queryMin(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        pushDown(node);
        int mid = l + (r - l) / 2, res = 1e9;
        if (ql <= mid) res = min(res, queryMin(2 * node, l, mid, ql, qr));
        if (qr > mid) res = min(res, queryMin(2 * node + 1, mid + 1, r, ql, qr));
        return res;
    }
};`
      },
      {
        title: "Q3. Falling Squares (Coordinate Compression Segment Tree)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Square fall height is `maxHeight([left, right - 1]) + sideLength`. Coordinate-compress positions and use Segment Tree with lazy range max updates.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <set>

using namespace std;

class SegmentTreeMax {
    int n;
    vector<int> tree, lazy;

    void pushDown(int node) {
        if (lazy[node] > 0) {
            tree[2 * node] = max(tree[2 * node], lazy[node]);
            lazy[2 * node] = max(lazy[2 * node], lazy[node]);
            tree[2 * node + 1] = max(tree[2 * node + 1], lazy[node]);
            lazy[2 * node + 1] = max(lazy[2 * node + 1], lazy[node]);
            lazy[node] = 0;
        }
    }

public:
    SegmentTreeMax(int size) : n(size), tree(4 * size, 0), lazy(4 * size, 0) {}

    void update(int node, int l, int r, int ql, int qr, int h) {
        if (ql <= l && r <= qr) {
            tree[node] = max(tree[node], h);
            lazy[node] = max(lazy[node], h);
            return;
        }
        pushDown(node);
        int mid = l + (r - l) / 2;
        if (ql <= mid) update(2 * node, l, mid, ql, qr, h);
        if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr, h);
        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        pushDown(node);
        int mid = l + (r - l) / 2, res = 0;
        if (ql <= mid) res = max(res, query(2 * node, l, mid, ql, qr));
        if (qr > mid) res = max(res, query(2 * node + 1, mid + 1, r, ql, qr));
        return res;
    }
};

vector<int> fallingSquares(vector<vector<int>>& positions) {
    set<int> coords;
    for (const auto& p : positions) {
        coords.insert(p[0]);
        coords.insert(p[0] + p[1] - 1);
    }

    vector<int> sortedCoords(coords.begin(), coords.end());
    auto getIdx = [&](int val) {
        return lower_bound(sortedCoords.begin(), sortedCoords.end(), val) - sortedCoords.begin();
    };

    int m = sortedCoords.size();
    SegmentTreeMax st(m);
    vector<int> ans;
    int maxH = 0;

    for (const auto& p : positions) {
        int l = getIdx(p[0]), r = getIdx(p[0] + p[1] - 1);
        int curH = st.query(1, 0, m - 1, l, r) + p[1];
        st.update(1, 0, m - 1, l, r, curH);
        maxH = max(maxH, curH);
        ans.push_back(maxH);
    }
    return ans;
}`
      },
      {
        title: "Q4. Count of Smaller Numbers After Self (Order Statistic Tree)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Offset values to non-negative range. Process elements from right to left, querying prefix sum `[0, val - 1]` and incrementing frequency of `val`.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class Fenwick {
    vector<int> tree;
public:
    Fenwick(int n) : tree(n + 1, 0) {}
    void add(int i, int delta) {
        for (++i; i < (int)tree.size(); i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (++i; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

vector<int> countSmaller(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n);
    Fenwick bit(20005);
    const int OFFSET = 10000;

    for (int i = n - 1; i >= 0; --i) {
        int val = nums[i] + OFFSET;
        res[i] = bit.query(val - 1);
        bit.add(val, 1);
    }
    return res;
}`
      },
      {
        title: "Q5. My Calendar III (Dynamic Booking Overlap)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Dynamic segment tree with lazy updates on coordinate interval `[0, 1e9]` maintaining max concurrent booking overlap.",
        cpp: `#include <iostream>
#include <unordered_map>
#include <algorithm>

using namespace std;

class MyCalendarThree {
    unordered_map<int, int> tree, lazy;

    void update(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) {
            tree[node]++;
            lazy[node]++;
            return;
        }
        int mid = l + (r - l) / 2;
        if (ql <= mid) update(2 * node, l, mid, ql, qr);
        if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr);
        tree[node] = lazy[node] + max(tree[2 * node], tree[2 * node + 1]);
    }

public:
    MyCalendarThree() {}

    int book(int startTime, int endTime) {
        update(1, 0, 1e9, startTime, endTime - 1);
        return tree[1];
    }
};`
      },
      {
        title: "Q6. Longest Increasing Subsequence II (Segment Tree DP)",
        diff: "Hard",
        time: "O(N log MAX)",
        space: "O(4 * MAX)",
        intuition: "For each `x`, query max LIS length in range `[max(1, x - k), x - 1]` from segment tree, and update position `x` with `maxLIS + 1`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class MaxSegmentTree {
    int n;
    vector<int> tree;

public:
    MaxSegmentTree(int size) : n(size), tree(4 * size, 0) {}

    void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = max(tree[node], val);
            return;
        }
        int mid = l + (r - l) / 2;
        if (idx <= mid) update(2 * node, l, mid, idx, val);
        else update(2 * node + 1, mid + 1, r, idx, val);
        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int l, int r, int ql, int qr) {
        if (ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return tree[node];
        int mid = l + (r - l) / 2;
        return max(query(2 * node, l, mid, ql, qr), query(2 * node + 1, mid + 1, r, ql, qr));
    }
};

int lengthOfLIS(vector<int>& nums, int k) {
    int maxVal = *max_element(nums.begin(), nums.end());
    MaxSegmentTree st(maxVal + 1);
    int ans = 1;

    for (int x : nums) {
        int bestPrev = st.query(1, 1, maxVal, max(1, x - k), x - 1);
        int cur = bestPrev + 1;
        ans = max(ans, cur);
        st.update(1, 1, maxVal, x, cur);
    }
    return ans;
}`
      },
      {
        title: "Q7. Rectangle Area II (Segment Tree + Sweep Line)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Sweep line on X coordinates; maintain active vertical Y-segments using a Segment Tree tracking total covered Y-length.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <set>

using namespace std;

struct Event {
    int x, y1, y2, type;
    bool operator<(const Event& o) const { return x < o.x; }
};

int rectangleArea(vector<vector<int>>& rectangles) {
    const int MOD = 1e9 + 7;
    vector<Event> events;
    set<int> ySet;

    for (const auto& r : rectangles) {
        events.push_back({r[0], r[1], r[3], 1});
        events.push_back({r[2], r[1], r[3], -1});
        ySet.insert(r[1]);
        ySet.insert(r[3]);
    }

    sort(events.begin(), events.end());
    vector<int> yCoords(ySet.begin(), ySet.end());
    int m = yCoords.size();
    vector<int> count(m, 0);

    long long totalArea = 0, prevX = events[0].x;

    for (const auto& e : events) {
        long long coveredY = 0;
        for (int i = 0; i < m - 1; ++i) {
            if (count[i] > 0) {
                coveredY += yCoords[i + 1] - yCoords[i];
            }
        }
        totalArea = (totalArea + coveredY * (e.x - prevX)) % MOD;
        prevX = e.x;

        int l = lower_bound(yCoords.begin(), yCoords.end(), e.y1) - yCoords.begin();
        int r = lower_bound(yCoords.begin(), yCoords.end(), e.y2) - yCoords.begin();
        for (int i = l; i < r; ++i) count[i] += e.type;
    }
    return totalArea;
}`
      }
    ],
    problems: [
      { id: "ST01", title: "Range Sum Query - Mutable", diff: "Medium", tags: ["Point Segment Tree"], time: "O(log N)", space: "O(4N)" },
      { id: "ST02", title: "Range Minimum Query with Lazy Updates", diff: "Hard", tags: ["Lazy Segment Tree"], time: "O(log N)", space: "O(4N)" },
      { id: "ST03", title: "Falling Squares", diff: "Hard", tags: ["Coordinate Compression"], time: "O(N log N)", space: "O(N)" },
      { id: "ST04", title: "Count of Smaller Numbers After Self", diff: "Hard", tags: ["Order Statistic Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST05", title: "My Calendar III", diff: "Hard", tags: ["Dynamic Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST06", title: "Longest Increasing Subsequence II", diff: "Hard", tags: ["Segment Tree DP"], time: "O(N log MAX)", space: "O(MAX)" },
      { id: "ST07", title: "Rectangle Area II", diff: "Hard", tags: ["Sweep Line + Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST08", title: "Reverse Pairs", diff: "Hard", tags: ["Merge Sort / Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST09", title: "Count of Range Sum", diff: "Hard", tags: ["Prefix Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST10", title: "The Skyline Problem (Segment Tree Version)", diff: "Hard", tags: ["Lazy Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST11", title: "Online Majority Element In Subarray", diff: "Hard", tags: ["Segment Tree + BS"], time: "O(log N)", space: "O(N)" },
      { id: "ST12", title: "Range Module", diff: "Hard", tags: ["Interval Segment Tree"], time: "O(log N)", space: "O(N)" },
      { id: "ST13", title: "Number of Longest Increasing Subsequence (Segment Tree)", diff: "Hard", tags: ["Pair Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "ST14", title: "Peak Index in a Mountain Array (Query Segment Tree)", diff: "Medium", tags: ["Segment Tree"], time: "O(log N)", space: "O(N)" },
      { id: "ST15", title: "Shifting Letters II", diff: "Medium", tags: ["Difference Array / Segment Tree"], time: "O(N + Q)", space: "O(N)" },
      { id: "ST16", title: "Describe the Painting", diff: "Medium", tags: ["Segment Tree Events"], time: "O(N log N)", space: "O(N)" },
      { id: "ST17", title: "Car Pooling (Segment Tree Range)", diff: "Medium", tags: ["Range Update"], time: "O(N log MAX)", space: "O(MAX)" },
      { id: "ST18", title: "Corporate Flight Bookings", diff: "Medium", tags: ["Range Add"], time: "O(N + Q)", space: "O(N)" },
      { id: "ST19", title: "Find the Substring With Maximum Cost", diff: "Medium", tags: ["Kadane / Segment Tree"], time: "O(N)", space: "O(1)" },
      { id: "ST20", title: "Maximum Number of Non-overlapping Palindrome Substrings", diff: "Hard", tags: ["Greedy + DP"], time: "O(N * K)", space: "O(N)" },
      { id: "ST21", title: "Create Sorted Array through Instructions", diff: "Hard", tags: ["Segment Tree / BIT"], time: "O(N log MAX)", space: "O(MAX)" },
      { id: "ST22", title: "Queries on Number of Points Inside a Circle", diff: "Medium", tags: ["2D Tree / Grid"], time: "O(Q * N)", space: "O(1)" },
      { id: "ST23", title: "Range Sum Query 2D - Mutable", diff: "Hard", tags: ["2D Segment Tree / BIT"], time: "O(log R log C)", space: "O(RC)" },
      { id: "ST24", title: "Booking Concert Tickets in Groups", diff: "Hard", tags: ["Segment Tree Sum & Max"], time: "O(Q log N)", space: "O(N)" },
      { id: "ST25", title: "Maximum Balanced Subsequence Sum", diff: "Hard", tags: ["Coordinate Compression ST"], time: "O(N log N)", space: "O(N)" },
      { id: "ST26", title: "Count Subarrays With Fixed Bounds", diff: "Hard", tags: ["Monotonic Pointer / ST"], time: "O(N)", space: "O(1)" },
      { id: "ST27", title: "Find Building Where Alice and Bob Can Meet", diff: "Hard", tags: ["Offline Segment Tree"], time: "O((N+Q) log N)", space: "O(N)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 25: Fenwick Tree (Binary Indexed Tree / BIT)
  // --------------------------------------------------------------------------
  {
    id: "25_fenwick_tree",
    num: 25,
    name: "Fenwick Tree (Binary Indexed Tree / BIT)",
    category: "Advanced Range Queries",
    difficulty: "Medium-Hard",
    badge: "Compact O(N) Prefix Tree",
    shortDesc: "Lightweight, space-efficient prefix query tree using bit logic `i += i & -i` and `i -= i & -i` with minimal constant factor overhead.",
    theory: {
      what: "A Binary Indexed Tree (Fenwick Tree) stores prefix sums across power-of-two interval lengths. Node `i` manages the range `(i - (i & -i), i]`. It requires exactly O(N) memory (1 array) and achieves lower cache misses than a 4N Segment Tree.",
      when: "Dynamic prefix sums, point updates with range queries, inversion counting, 2D range sum queries, frequency order statistics.",
      coreIdea: "1. `add(i, val)`: ascend parent chain via `i += i & -i`.\n2. `query(i)`: descend prefix intervals via `i -= i & -i`.\n3. `queryRange(l, r) = query(r) - query(l - 1)`.",
      edgeCases: "Fenwick Tree MUST use 1-based indexing (since `0 & -0 = 0` causes infinite loop), range operations requiring inversion of prefixes."
    },
    diagram: `flowchart TD
    Index["Index i in 1-based BIT"] --> Update["add(i, delta):<br/>while (i <= n) { tree[i] += delta; i += (i & -i); }"]
    Index --> Query["query(i):<br/>while (i > 0) { sum += tree[i]; i -= (i & -i); }"]`,
    visualizerType: "binary_search",
    code: {
      optimal: `#include <iostream>
#include <vector>

using namespace std;

// 1-Based Standard Fenwick Tree (Binary Indexed Tree)
class FenwickTree {
    int n;
    vector<long long> tree;

public:
    FenwickTree(int size) : n(size), tree(size + 1, 0) {}

    // Add val at index i (1-based)
    void add(int i, long long val) {
        for (; i <= n; i += i & -i) {
            tree[i] += val;
        }
    }

    // Prefix sum from index 1 to i
    long long query(int i) {
        long long sum = 0;
        for (; i > 0; i -= i & -i) {
            sum += tree[i];
        }
        return sum;
    }

    // Range sum query [l, r]
    long long queryRange(int l, int r) {
        return query(r) - query(l - 1);
    }
};`,
      brute: `// 2D Fenwick Tree for Matrix Range Queries
class FenwickTree2D {
    int rows, cols;
    vector<vector<int>> tree;

public:
    FenwickTree2D(int r, int c) : rows(r), cols(c), tree(r + 1, vector<int>(c + 1, 0)) {}

    void add(int r, int c, int val) {
        for (int i = r; i <= rows; i += i & -i) {
            for (int j = c; j <= cols; j += j & -j) {
                tree[i][j] += val;
            }
        }
    }

    int query(int r, int c) {
        int sum = 0;
        for (int i = r; i > 0; i -= i & -i) {
            for (int j = c; j > 0; j -= j & -j) {
                sum += tree[i][j];
            }
        }
        return sum;
    }
};`,
      template: `// Inversion Counting Template
long long countInversions(vector<int>& nums) {
    int n = nums.size();
    FenwickTree bit(n);
    long long invCount = 0;
    // Compress coords then query(n) - query(val)
    return invCount;
}`
    },
    solutions: [
      {
        title: "Q1. Range Sum Query - Mutable (Fenwick Tree)",
        diff: "Medium",
        time: "O(log N) update/query",
        space: "O(N)",
        intuition: "Maintain 1-based BIT. Point updates modify `tree[i]` and propagate up via `i += i & -i`.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class NumArray {
    int n;
    vector<int> nums, tree;

    void add(int i, int delta) {
        for (; i <= n; i += i & -i) tree[i] += delta;
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }

public:
    NumArray(vector<int>& arr) : n(arr.size()), nums(arr), tree(arr.size() + 1, 0) {
        for (int i = 0; i < n; ++i) {
            add(i + 1, nums[i]);
        }
    }

    void update(int index, int val) {
        int delta = val - nums[index];
        nums[index] = val;
        add(index + 1, delta);
    }

    int sumRange(int left, int right) {
        return query(right + 1) - query(left);
    }
};`
      },
      {
        title: "Q2. Global and Local Inversions (BIT Inversion Counter)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Count global inversions where `i < j` and `nums[i] > nums[j]` using Fenwick tree, and compare with adjacent local inversions.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

bool isIdealPermutation(vector<int>& nums) {
    int n = nums.size(), maxPrev = 0;
    // Ideal permutation condition: absolute index difference <= 1
    for (int i = 0; i < n; ++i) {
        if (abs(nums[i] - i) > 1) return false;
    }
    return true;
}`
      },
      {
        title: "Q3. Create Sorted Array through Instructions (Cost Minimization)",
        diff: "Hard",
        time: "O(N log MAX)",
        space: "O(MAX)",
        intuition: "Cost to insert `x` is `min(countStrictlyLess, countStrictlyGreater)`. Query prefix sum `x - 1` and total count minus prefix `x` from Fenwick tree.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Fenwick {
    int n;
    vector<int> tree;
public:
    Fenwick(int size) : n(size), tree(size + 1, 0) {}
    void add(int i, int delta) {
        for (; i <= n; i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

int createSortedArray(vector<int>& instructions) {
    int maxVal = *max_element(instructions.begin(), instructions.end());
    Fenwick bit(maxVal);
    long long totalCost = 0;
    const int MOD = 1e9 + 7;

    for (size_t i = 0; i < instructions.size(); ++i) {
        int x = instructions[i];
        int lessCount = bit.query(x - 1);
        int greaterCount = i - bit.query(x);
        totalCost = (totalCost + min(lessCount, greaterCount)) % MOD;
        bit.add(x, 1);
    }
    return totalCost;
}`
      },
      {
        title: "Q4. Range Sum Query 2D - Mutable (2D Fenwick Tree)",
        diff: "Hard",
        time: "O(log R * log C)",
        space: "O(R * C)",
        intuition: "2D BIT maintains subgrid prefix sums. Standard 2D inclusion-exclusion gives sum of arbitrary bounding box.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class NumMatrix {
    int m, n;
    vector<vector<int>> matrix, tree;

    void add(int r, int c, int delta) {
        for (int i = r; i <= m; i += i & -i) {
            for (int j = c; j <= n; j += j & -j) {
                tree[i][j] += delta;
            }
        }
    }

    int query(int r, int c) {
        int sum = 0;
        for (int i = r; i > 0; i -= i & -i) {
            for (int j = c; j > 0; j -= j & -j) {
                sum += tree[i][j];
            }
        }
        return sum;
    }

public:
    NumMatrix(vector<vector<int>>& mat) : m(mat.size()), n(mat[0].size()), matrix(mat), tree(mat.size() + 1, vector<int>(mat[0].size() + 1, 0)) {
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                add(i + 1, j + 1, matrix[i][j]);
            }
        }
    }

    void update(int row, int col, int val) {
        int delta = val - matrix[row][col];
        matrix[row][col] = val;
        add(row + 1, col + 1, delta);
    }

    int sumRegion(int row1, int col1, int row2, int col2) {
        return query(row2 + 1, col2 + 1) - query(row1, col2 + 1) - query(row2 + 1, col1) + query(row1, col1);
    }
};`
      },
      {
        title: "Q5. Queries on a Permutation With Key (Fenwick Index Shift)",
        diff: "Medium",
        time: "O(Q log(M + Q))",
        space: "O(M + Q)",
        intuition: "Prepend elements to front by moving positions to earlier slots `(sz - step)`. Fenwick tree tracks current prefix count of active positions.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class Fenwick {
    vector<int> tree;
public:
    Fenwick(int n) : tree(n + 1, 0) {}
    void add(int i, int delta) {
        for (; i < (int)tree.size(); i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

vector<int> processQueries(vector<int>& queries, int m) {
    int q = queries.size();
    Fenwick bit(m + q);
    vector<int> pos(m + 1);

    for (int i = 1; i <= m; ++i) {
        pos[i] = q + i;
        bit.add(pos[i], 1);
    }

    vector<int> ans;
    int head = q;

    for (int x : queries) {
        int curPos = pos[x];
        ans.push_back(bit.query(curPos - 1));
        bit.add(curPos, -1);
        pos[x] = head--;
        bit.add(pos[x], 1);
    }
    return ans;
}`
      },
      {
        title: "Q6. Reverse Pairs (Fenwick Tree with Coordinate Compression)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Coordinate compress all numbers and their doubled values `2 * nums[i]`. Traverse backward, querying prefix count of elements strictly smaller than `nums[i] / 2.0`.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <set>

using namespace std;

class Fenwick {
    vector<int> tree;
public:
    Fenwick(int n) : tree(n + 1, 0) {}
    void add(int i, int delta) {
        for (; i < (int)tree.size(); i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

int reversePairs(vector<int>& nums) {
    set<long long> allVals;
    for (int x : nums) {
        allVals.insert(x);
        allVals.insert(2LL * x);
    }

    vector<long long> sorted(allVals.begin(), allVals.end());
    auto getRank = [&](long long val) {
        return lower_bound(sorted.begin(), sorted.end(), val) - sorted.begin() + 1;
    };

    Fenwick bit(sorted.size());
    int count = 0;

    for (int i = (int)nums.size() - 1; i >= 0; --i) {
        count += bit.query(getRank(nums[i]) - 1);
        bit.add(getRank(2LL * nums[i]), 1);
    }
    return count;
}`
      },
      {
        title: "Q7. Count Good Triplets in an Array (Dual Fenwick Trees)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Map nums2 values to indices in nums1. For middle element `y`, count elements appearing before `y` with smaller index (`leftSmaller`) and elements appearing after `y` with larger index (`rightGreater`). Total triplets = `leftSmaller * rightGreater`.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

class Fenwick {
    vector<int> tree;
public:
    Fenwick(int n) : tree(n + 1, 0) {}
    void add(int i, int delta) {
        for (; i < (int)tree.size(); i += i & -i) tree[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

long long goodTriplets(vector<int>& nums1, vector<int>& nums2) {
    int n = nums1.size();
    vector<int> posIn1(n);
    for (int i = 0; i < n; ++i) posIn1[nums1[i]] = i;

    vector<int> mapped(n);
    for (int i = 0; i < n; ++i) mapped[i] = posIn1[nums2[i]] + 1; // 1-based

    Fenwick bit(n);
    long long total = 0;

    for (int i = 0; i < n; ++i) {
        int val = mapped[i];
        long long leftSmaller = bit.query(val - 1);
        long long leftLarger = i - leftSmaller;
        long long rightLarger = (n - val) - leftLarger;
        total += leftSmaller * rightLarger;
        bit.add(val, 1);
    }
    return total;
}`
      }
    ],
    problems: [
      { id: "FW01", title: "Range Sum Query - Mutable (BIT)", diff: "Medium", tags: ["Fenwick Tree"], time: "O(log N)", space: "O(N)" },
      { id: "FW02", title: "Global and Local Inversions", diff: "Medium", tags: ["Inversions"], time: "O(N)", space: "O(1)" },
      { id: "FW03", title: "Create Sorted Array through Instructions", diff: "Hard", tags: ["BIT Frequency"], time: "O(N log MAX)", space: "O(MAX)" },
      { id: "FW04", title: "Range Sum Query 2D - Mutable", diff: "Hard", tags: ["2D BIT"], time: "O(log R log C)", space: "O(RC)" },
      { id: "FW05", title: "Queries on a Permutation With Key", diff: "Medium", tags: ["BIT Index Shift"], time: "O(Q log N)", space: "O(N)" },
      { id: "FW06", title: "Reverse Pairs", diff: "Hard", tags: ["Coordinate Compression BIT"], time: "O(N log N)", space: "O(N)" },
      { id: "FW07", title: "Count Good Triplets in an Array", diff: "Hard", tags: ["Dual BIT Counting"], time: "O(N log N)", space: "O(N)" },
      { id: "FW08", title: "Count of Smaller Numbers After Self", diff: "Hard", tags: ["BIT Frequency"], time: "O(N log N)", space: "O(N)" },
      { id: "FW09", title: "Count of Range Sum (BIT Version)", diff: "Hard", tags: ["Prefix BIT"], time: "O(N log N)", space: "O(N)" },
      { id: "FW10", title: "Queue Reconstruction by Height (BIT Lookup)", diff: "Medium", tags: ["Binary Lifting BIT"], time: "O(N log N)", space: "O(N)" },
      { id: "FW11", title: "Distribute Candies Among Children II", diff: "Medium", tags: ["Combinatorics BIT"], time: "O(1)", space: "O(1)" },
      { id: "FW12", title: "K-th Smallest Subarray Sum", diff: "Hard", tags: ["Binary Search + BIT"], time: "O(N log Sum)", space: "O(1)" },
      { id: "FW13", title: "Number of Subarrays With GCD Equal to K", diff: "Medium", tags: ["Math BIT"], time: "O(N log MAX)", space: "O(1)" },
      { id: "FW14", title: "Fruits Into Baskets III", diff: "Hard", tags: ["BIT Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "FW15", title: "Find the Number of Ways to Place People I", diff: "Medium", tags: ["2D Scan"], time: "O(N^2)", space: "O(1)" },
      { id: "FW16", title: "Find the Number of Ways to Place People II", diff: "Hard", tags: ["Monotonic BIT"], time: "O(N^2)", space: "O(N)" },
      { id: "FW17", title: "Maximum Number of Points From Grid Queries", diff: "Hard", tags: ["DSU / BIT Heap"], time: "O(RC log RC)", space: "O(RC)" },
      { id: "FW18", title: "Find Subarray With Target Sum Mutable", diff: "Medium", tags: ["BIT Hash"], time: "O(log N)", space: "O(N)" },
      { id: "FW19", title: "Rank Transform of a Matrix", diff: "Hard", tags: ["DSU + BIT Topological"], time: "O(RC log(RC))", space: "O(RC)" },
      { id: "FW20", title: "Minimum Possible Sum of a Beautiful Array", diff: "Medium", tags: ["Math Greedy"], time: "O(1)", space: "O(1)" },
      { id: "FW21", title: "Count Subarrays With Fixed Bounds", diff: "Hard", tags: ["Sliding Window"], time: "O(N)", space: "O(1)" },
      { id: "FW22", title: "Count Complete Subarrays in an Array", diff: "Medium", tags: ["Sliding Window BIT"], time: "O(N)", space: "O(N)" },
      { id: "FW23", title: "Count Pairs in Two Arrays", diff: "Medium", tags: ["Difference BIT"], time: "O(N log N)", space: "O(N)" },
      { id: "FW24", title: "Minimum Operations to Make All Array Elements Equal", diff: "Medium", tags: ["Prefix Sum + Binary Search"], time: "O(N log N)", space: "O(N)" },
      { id: "FW25", title: "Count Number of Rectangles Containing Each Point", diff: "Medium", tags: ["Bucket Sort + Binary Search"], time: "O(100 * N log N)", space: "O(N)" },
      { id: "FW26", title: "Maximum Profit in Job Scheduling (BIT DP)", diff: "Hard", tags: ["BIT + DP"], time: "O(N log N)", space: "O(N)" },
      { id: "FW27", title: "Sum of Imbalance Numbers of All Subarrays", diff: "Hard", tags: ["Contribution BIT"], time: "O(N^2)", space: "O(N)" }
    ]
  },

  // --------------------------------------------------------------------------
  // PATTERN 26: Sweep Line & Event Scheduling
  // --------------------------------------------------------------------------
  {
    id: "26_sweep_line",
    num: 26,
    name: "Sweep Line & Event Scheduling",
    category: "Geometric & Interval Algorithms",
    difficulty: "Medium-Hard",
    badge: "1D / 2D Event Simulation",
    shortDesc: "Process continuous geometric intervals or multi-dimensional queries by sorting boundary events and sweeping across time or spatial coordinates.",
    theory: {
      what: "Decompose geometric ranges (intervals, 2D rectangles, line segments) into distinct point events (START event `+1`, END event `-1`). Process all events in sorted coordinate order while maintaining active state data structure.",
      when: "The Skyline Problem, Meeting Rooms II (concurrent room peaks), Rectangle Area II, Employee Free Time, Maximum Population Year, Minimum Interval to Include Each Query.",
      coreIdea: "1. Convert interval `[start, end]` into `{start, +1}` and `{end, -1}`.\n2. Sort events by coordinate (tie breaker: END events before START if boundaries don't overlap, or START before END if inclusive).\n3. Maintain running accumulator across the sweep.",
      edgeCases: "Coincident start and end times (boundary inclusion policy), empty intervals, single-point intervals `[x, x]`."
    },
    diagram: `flowchart TD
    Intervals["Intervals [start, end]"] --> Events["Generate Events:<br/>{start, +1} (Open)<br/>{end, -1} (Close)"]
    Events --> Sort["Sort Events by Time"]
    Sort --> Sweep["Sweep Left to Right:<br/>activeCount += event.type<br/>maxRooms = max(maxRooms, activeCount)"]`,
    visualizerType: "monotonic_stack",
    code: {
      optimal: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Meeting Rooms II (Sweep Line concurrent peak): O(N log N)
int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<pair<int, int>> events;
    for (const auto& iv : intervals) {
        events.push_back({iv[0], 1});   // Meeting starts (+1 room)
        events.push_back({iv[1], -1});  // Meeting ends (-1 room)
    }

    // Sort by time; on tie process end (-1) before start (+1)
    sort(events.begin(), events.end());

    int currentRooms = 0, maxRooms = 0;
    for (const auto& [time, type] : events) {
        currentRooms += type;
        maxRooms = max(maxRooms, currentRooms);
    }
    return maxRooms;
}`,
      brute: `// Difference Array Range Addition Sweep Line
vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {
    vector<int> diff(length + 1, 0);
    for (const auto& u : updates) {
        diff[u[0]] += u[2];
        diff[u[1] + 1] -= u[2];
    }

    vector<int> res(length);
    int running = 0;
    for (int i = 0; i < length; ++i) {
        running += diff[i];
        res[i] = running;
    }
    return res;
}`,
      template: `// Skyline Problem Sweep Line Template
vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
    // Collect {x, -h} for start and {x, h} for end
    vector<pair<int, int>> events;
    for (const auto& b : buildings) {
        events.push_back({b[0], -b[2]});
        events.push_back({b[1], b[2]});
    }
    sort(events.begin(), events.end());
    return {};
}`
    },
    solutions: [
      {
        title: "Q1. Meeting Rooms II (Minimum Conference Rooms)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Sort start (+1) and end (-1) events. Sweep across time to find maximum concurrent active meetings.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<pair<int, int>> events;
    for (const auto& iv : intervals) {
        events.push_back({iv[0], 1});
        events.push_back({iv[1], -1});
    }

    sort(events.begin(), events.end());

    int rooms = 0, maxRooms = 0;
    for (const auto& [time, delta] : events) {
        rooms += delta;
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
}`
      },
      {
        title: "Q2. The Skyline Problem (Multiset Height Sweep)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Building start emits `{x, -height}`, end emits `{x, height}`. Sweep across x coordinates maintaining active heights in a multiset; key points occur when max height changes.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <set>

using namespace std;

vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
    vector<pair<int, int>> events;
    for (const auto& b : buildings) {
        events.push_back({b[0], -b[2]}); // Start
        events.push_back({b[1], b[2]});  // End
    }

    sort(events.begin(), events.end());

    multiset<int> heights = {0};
    int prevMax = 0;
    vector<vector<int>> skyline;

    for (const auto& [x, h] : events) {
        if (h < 0) {
            heights.insert(-h);
        } else {
            heights.erase(heights.find(h));
        }

        int curMax = *heights.rbegin();
        if (curMax != prevMax) {
            skyline.push_back({x, curMax});
            prevMax = curMax;
        }
    }
    return skyline;
}`
      },
      {
        title: "Q3. Car Pooling (Capacity Threshold Sweep)",
        diff: "Medium",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Pickups add passengers, dropoffs remove passengers. Sweep locations and verify capacity is never breached.",
        cpp: `#include <iostream>
#include <vector>
#include <map>

using namespace std;

bool carPooling(vector<vector<int>>& trips, int capacity) {
    map<int, int> delta;
    for (const auto& t : trips) {
        delta[t[1]] += t[0];
        delta[t[2]] -= t[0];
    }

    int current = 0;
    for (const auto& [pos, count] : delta) {
        current += count;
        if (current > capacity) return false;
    }
    return true;
}`
      },
      {
        title: "Q4. Maximum Population Year",
        diff: "Easy",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Birth year adds +1, death year subtracts -1. Sweep from 1950 to 2050 to find earliest year with maximum population.",
        cpp: `#include <iostream>
#include <vector>

using namespace std;

int maximumPopulation(vector<vector<int>>& logs) {
    vector<int> diff(2051, 0);
    for (const auto& log : logs) {
        diff[log[0]]++;
        diff[log[1]]--;
    }

    int maxPop = 0, bestYear = 1950, cur = 0;
    for (int y = 1950; y <= 2050; ++y) {
        cur += diff[y];
        if (cur > maxPop) {
            maxPop = cur;
            bestYear = y;
        }
    }
    return bestYear;
}`
      },
      {
        title: "Q5. Minimum Interval to Include Each Query (Offline Min-Heap Sweep)",
        diff: "Hard",
        time: "O((N + Q) log N)",
        space: "O(N + Q)",
        intuition: "Sort intervals and queries. Sweep across queries, inserting overlapping intervals into a min-heap keyed by length. Prune intervals ending before current query position.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>

using namespace std;

vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
    int q = queries.size();
    vector<pair<int, int>> sortedQ(q);
    for (int i = 0; i < q; ++i) sortedQ[i] = {queries[i], i};

    sort(intervals.begin(), intervals.end());
    sort(sortedQ.begin(), sortedQ.end());

    // min-heap storing {length, end_point}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> ans(q, -1);
    int idx = 0, n = intervals.size();

    for (const auto& [queryVal, qIdx] : sortedQ) {
        while (idx < n && intervals[idx][0] <= queryVal) {
            pq.push({intervals[idx][1] - intervals[idx][0] + 1, intervals[idx][1]});
            idx++;
        }
        while (!pq.empty() && pq.top().second < queryVal) {
            pq.pop();
        }
        if (!pq.empty()) {
            ans[qIdx] = pq.top().first;
        }
    }
    return ans;
}`
      },
      {
        title: "Q6. Employee Free Time (Interval Union Gap Finding)",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Merge all employee work intervals into disjoint intervals. Gaps between consecutive merged intervals represent universal free time.",
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Interval {
    int start, end;
};

vector<Interval> employeeFreeTime(vector<vector<Interval>>& schedule) {
    vector<Interval> all;
    for (const auto& emp : schedule) {
        for (const auto& iv : emp) all.push_back(iv);
    }

    sort(all.begin(), all.end(), [](const Interval& a, const Interval& b) {
        return a.start < b.start;
    });

    vector<Interval> freeTime;
    int curEnd = all[0].end;

    for (size_t i = 1; i < all.size(); ++i) {
        if (all[i].start > curEnd) {
            freeTime.push_back({curEnd, all[i].start});
        }
        curEnd = max(curEnd, all[i].end);
    }
    return freeTime;
}`
      },
      {
        title: "Q7. Amount of New Area Painted Each Day",
        diff: "Hard",
        time: "O(N log N)",
        space: "O(N)",
        intuition: "Interval jump pointer / sweep line: maintain a DSU or jump array where `jump[x]` points to next unpainted position, skipping already painted intervals in near O(1).",
        cpp: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

using namespace std;

vector<int> amountPainted(vector<vector<int>>& paint) {
    int n = paint.size();
    vector<int> res(n, 0);
    vector<int> nextUnpainted(50005, 0);

    for (int i = 0; i < n; ++i) {
        int start = paint[i][0], end = paint[i][1];
        int paintedCount = 0;

        while (start < end) {
            if (nextUnpainted[start] == 0) {
                paintedCount++;
                nextUnpainted[start] = end;
                start++;
            } else {
                int nextStart = nextUnpainted[start];
                nextUnpainted[start] = max(nextUnpainted[start], end);
                start = nextStart;
            }
        }
        res[i] = paintedCount;
    }
    return res;
}`
      }
    ],
    problems: [
      { id: "SL01", title: "Meeting Rooms II", diff: "Medium", tags: ["Event Sweep"], time: "O(N log N)", space: "O(N)" },
      { id: "SL02", title: "The Skyline Problem", diff: "Hard", tags: ["Multiset Sweep"], time: "O(N log N)", space: "O(N)" },
      { id: "SL03", title: "Car Pooling", diff: "Medium", tags: ["Difference Sweep"], time: "O(N log N)", space: "O(N)" },
      { id: "SL04", title: "Maximum Population Year", diff: "Easy", tags: ["Coordinate Sweep"], time: "O(N)", space: "O(1)" },
      { id: "SL05", title: "Minimum Interval to Include Each Query", diff: "Hard", tags: ["Offline Heap Sweep"], time: "O((N+Q) log N)", space: "O(N+Q)" },
      { id: "SL06", title: "Employee Free Time", diff: "Hard", tags: ["Interval Union"], time: "O(N log N)", space: "O(N)" },
      { id: "SL07", title: "Amount of New Area Painted Each Day", diff: "Hard", tags: ["Jump Pointer DSU"], time: "O(N log N)", space: "O(MAX)" },
      { id: "SL08", title: "My Calendar I", diff: "Medium", tags: ["Sorted Interval Set"], time: "O(log N)", space: "O(N)" },
      { id: "SL09", title: "My Calendar II", diff: "Medium", tags: ["Double Booking Sweep"], time: "O(N)", space: "O(N)" },
      { id: "SL10", title: "My Calendar III", diff: "Hard", tags: ["Sweep Line / Segment Tree"], time: "O(N log N)", space: "O(N)" },
      { id: "SL11", title: "Range Addition", diff: "Medium", tags: ["Difference Array"], time: "O(N + Q)", space: "O(N)" },
      { id: "SL12", title: "Corporate Flight Bookings (Sweep Line)", diff: "Medium", tags: ["Difference Array"], time: "O(N + Q)", space: "O(N)" },
      { id: "SL13", title: "Shifting Letters II (Sweep Line)", diff: "Medium", tags: ["Difference Array"], time: "O(N + Q)", space: "O(N)" },
      { id: "SL14", title: "Describe the Painting", diff: "Medium", tags: ["Sweep Line Prefix Colors"], time: "O(N log N)", space: "O(N)" },
      { id: "SL15", title: "Rectangle Area II (Sweep Line)", diff: "Hard", tags: ["2D Sweep Line"], time: "O(N log N)", space: "O(N)" },
      { id: "SL16", title: "Rectangle Overlap", diff: "Easy", tags: ["Geometric Logic"], time: "O(1)", space: "O(1)" },
      { id: "SL17", title: "Perfect Rectangle", diff: "Hard", tags: ["Corner Hash Sweep"], time: "O(N)", space: "O(N)" },
      { id: "SL18", title: "Interval List Intersections", diff: "Medium", tags: ["Two Pointers Sweep"], time: "O(N + M)", space: "O(1)" },
      { id: "SL19", title: "Insert Interval", diff: "Medium", tags: ["Linear Sweep"], time: "O(N)", space: "O(1)" },
      { id: "SL20", title: "Merge Intervals", diff: "Medium", tags: ["Sort Sweep"], time: "O(N log N)", space: "O(N)" },
      { id: "SL21", title: "Non-overlapping Intervals", diff: "Medium", tags: ["Greedy Sweep"], time: "O(N log N)", space: "O(1)" },
      { id: "SL22", title: "Minimum Number of Arrows to Burst Balloons", diff: "Medium", tags: ["Greedy Sweep"], time: "O(N log N)", space: "O(1)" },
      { id: "SL23", title: "Data Stream as Disjoint Intervals", diff: "Hard", tags: ["Interval Set Merge"], time: "O(log N) insert", space: "O(N)" },
      { id: "SL24", title: "Maximum Beauty of an Array After Applying Operation", diff: "Medium", tags: ["Difference Sweep"], time: "O(N + MAX)", space: "O(MAX)" },
      { id: "SL25", title: "Count Positions on Street With Required Brightness", diff: "Medium", tags: ["Difference Array"], time: "O(N + Lights)", space: "O(N)" },
      { id: "SL26", title: "Maximum Number of Events That Can Be Attended", diff: "Medium", tags: ["Min Heap Sweep"], time: "O(N log N)", space: "O(N)" },
      { id: "SL27", title: "Maximum Number of Events That Can Be Attended II", diff: "Hard", tags: ["Sweep + DP + BS"], time: "O(N log N + N*K)", space: "O(NK)" }
    ]
  }
];
