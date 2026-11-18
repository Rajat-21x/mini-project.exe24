import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    problemCode: 'CBA-101',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    maxScore: 100,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order (indices 0-indexed).`,
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number[] (array of two indices)',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6, return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 6, return [0, 1].'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        expected: '[0, 1]',
        params: [[2, 7, 11, 15], 9]
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        expected: '[1, 2]',
        params: [[3, 2, 4], 6]
      },
      {
        id: 3,
        input: 'nums = [3, 3], target = 6',
        expected: '[0, 1]',
        params: [[3, 3], 6]
      },
      {
        id: 4,
        input: 'nums = [1, 5, 8, 3, 14, 20], target = 17',
        expected: '[3, 4]',
        params: [[1, 5, 8, 3, 14, 20], 17],
        isHidden: true
      }
    ],
    hints: [
      'A brute force approach checks every pair, taking O(n^2) time. Can you use a hash map to look up complements in O(1)?',
      'For each element x, look up if (target - x) exists in your map.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'reverse-string',
    problemCode: 'CBA-102',
    title: 'Reverse a String',
    difficulty: 'Easy',
    category: 'Strings & Two Pointers',
    maxScore: 100,
    description: `Write a function that reverses an input string \`s\` and returns the reversed string.\n\nTry implementing the character swap using an O(n) two-pointer pass for optimal memory efficiency.`,
    inputFormat: 's: string',
    outputFormat: 'string',
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of printable ASCII characters.'
    ],
    examples: [
      {
        input: 's = "arena"',
        output: '"anera"',
        explanation: 'Reversing the characters of "arena" yields "anera".'
      },
      {
        input: 's = "Hannah"',
        output: '"hannaH"',
        explanation: 'Case sensitivity is preserved when reversing.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
function reverseString(s) {
  const arr = s.split('');
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr.join('');
}`,
      python: `def reverseString(s: str) -> str:
    return s[::-1]`,
      cpp: `#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string reverseString(string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            swap(s[left++], s[right--]);
        }
        return s;
    }
};`,
      java: `class Solution {
    public String reverseString(String s) {
        char[] arr = s.toCharArray();
        int left = 0, right = arr.length - 1;
        while (left < right) {
            char tmp = arr[left];
            arr[left++] = arr[right];
            arr[right--] = tmp;
        }
        return new String(arr);
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 's = "arena"',
        expected: 'anera',
        params: ['arena']
      },
      {
        id: 2,
        input: 's = "Hannah"',
        expected: 'hannaH',
        params: ['Hannah']
      },
      {
        id: 3,
        input: 's = "coding"',
        expected: 'gnidoc',
        params: ['coding']
      },
      {
        id: 4,
        input: 's = "a"',
        expected: 'a',
        params: ['a'],
        isHidden: true
      }
    ],
    hints: [
      'Convert the string to a character array or use two pointers from both ends moving inward.',
      'Swap s[left] and s[right] until left >= right.'
    ],
    timeLimitMs: 500
  },
  {
    id: 'palindrome-number',
    problemCode: 'CBA-103',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    category: 'Math',
    maxScore: 100,
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward. Negative numbers such as \`-121\` are not palindromes because of the leading minus sign.`,
    inputFormat: 'x: number',
    outputFormat: 'boolean',
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindromeNumber(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversedHalf = 0;
  while (x > reversedHalf) {
    reversedHalf = reversedHalf * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversedHalf || x === Math.floor(reversedHalf / 10);
}`,
      python: `def isPalindromeNumber(x: int) -> bool:
    if x < 0 or (x % 10 == 0 and x != 0):
        return False
    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + (x % 10)
        x //= 10
    return x == reversed_half or x == reversed_half // 10`,
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        return x == reversedHalf || x == reversedHalf / 10;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        return x == reversedHalf || x == reversedHalf / 10;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'x = 121',
        expected: 'true',
        params: [121]
      },
      {
        id: 2,
        input: 'x = -121',
        expected: 'false',
        params: [-121]
      },
      {
        id: 3,
        input: 'x = 10',
        expected: 'false',
        params: [10]
      },
      {
        id: 4,
        input: 'x = 12321',
        expected: 'true',
        params: [12321],
        isHidden: true
      }
    ],
    hints: [
      'Negative numbers and multiples of 10 (except 0) cannot be palindromes.',
      'Reverse only half of the integer digits using modulo and division by 10 to avoid overflow.'
    ],
    timeLimitMs: 500
  },
  {
    id: 'fibonacci-number',
    problemCode: 'CBA-104',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    maxScore: 100,
    description: `The Fibonacci numbers, commonly denoted \`F(n)\`, form a sequence such that each number is the sum of the two preceding ones, starting from \`0\` and \`1\`.\n\nThat is:\n\`F(0) = 0\`, \`F(1) = 1\`\n\`F(n) = F(n - 1) + F(n - 2)\`, for \`n > 1\`.\n\nGiven \`n\`, calculate \`F(n)\`.`,
    inputFormat: 'n: number',
    outputFormat: 'number',
    constraints: [
      '0 <= n <= 30'
    ],
    examples: [
      {
        input: 'n = 2',
        output: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'
      },
      {
        input: 'n = 3',
        output: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.'
      },
      {
        input: 'n = 4',
        output: '3',
        explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function fib(n) {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
      python: `def fib(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
      cpp: `class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        int prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }
};`,
      java: `class Solution {
    public int fib(int n) {
        if (n <= 1) return n;
        int prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'n = 2',
        expected: '1',
        params: [2]
      },
      {
        id: 2,
        input: 'n = 3',
        expected: '2',
        params: [3]
      },
      {
        id: 3,
        input: 'n = 4',
        expected: '3',
        params: [4]
      },
      {
        id: 4,
        input: 'n = 10',
        expected: '55',
        params: [10],
        isHidden: true
      }
    ],
    hints: [
      'Naive recursion takes O(2^n) time due to repeated subproblems.',
      'Use iterative bottom-up variables to compute F(n) in O(n) time and O(1) space.'
    ],
    timeLimitMs: 500
  },
  {
    id: 'valid-palindrome',
    problemCode: 'CBA-105',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    maxScore: 120,
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nAlphanumeric characters include letters and numbers.\n\nGiven a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: 's: string',
    outputFormat: 'boolean',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters, which reads same forward and backward.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      python: `def isPalindrome(s: str) -> bool:
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder cleaned = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                cleaned.append(Character.toLowerCase(c));
            }
        }
        String str = cleaned.toString();
        int left = 0, right = str.length() - 1;
        while (left < right) {
            if (str.charAt(left++) != str.charAt(right--)) return false;
        }
        return true;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 's = "A man, a plan, a canal: Panama"',
        expected: 'true',
        params: ['A man, a plan, a canal: Panama']
      },
      {
        id: 2,
        input: 's = "race a car"',
        expected: 'false',
        params: ['race a car']
      },
      {
        id: 3,
        input: 's = " "',
        expected: 'true',
        params: [' ']
      },
      {
        id: 4,
        input: 's = "0P"',
        expected: 'false',
        params: ['0P'],
        isHidden: true
      }
    ],
    hints: [
      'Filter out non-alphanumeric characters and lowercase everything.',
      'Use two pointers from left and right meeting in the middle.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'valid-parentheses',
    problemCode: 'CBA-106',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    maxScore: 120,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 's: string',
    outputFormat: 'boolean',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> matching = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != matching[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 's = "()"',
        expected: 'true',
        params: ['()']
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        expected: 'true',
        params: ['()[]{}']
      },
      {
        id: 3,
        input: 's = "(]"',
        expected: 'false',
        params: ['(]']
      },
      {
        id: 4,
        input: 's = "([)]"',
        expected: 'false',
        params: ['([)]'],
        isHidden: true
      },
      {
        id: 5,
        input: 's = "{[]}"',
        expected: 'true',
        params: ['{[]}'],
        isHidden: true
      }
    ],
    hints: [
      'Use a stack to remember the most recently opened bracket.',
      'When you see a closing bracket, check if the top of the stack matches its corresponding opening pair.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'binary-search',
    problemCode: 'CBA-107',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Searching',
    maxScore: 120,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.\n\nIf \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique and sorted in ascending order.'
    ],
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        expected: '4',
        params: [[-1, 0, 3, 5, 9, 12], 9]
      },
      {
        id: 2,
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        expected: '-1',
        params: [[-1, 0, 3, 5, 9, 12], 2]
      },
      {
        id: 3,
        input: 'nums = [5], target = 5',
        expected: '0',
        params: [[5], 5]
      },
      {
        id: 4,
        input: 'nums = [2, 5], target = 0',
        expected: '-1',
        params: [[2, 5], 0],
        isHidden: true
      }
    ],
    hints: [
      'Check the element in the middle. If it is smaller than target, look in right half.',
      'Be careful with integer overflow when calculating mid.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'maximum-subarray',
    problemCode: 'CBA-108',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    maxScore: 200,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: 'nums: number[]',
    outputFormat: 'number',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      },
      {
        input: 'nums = [5, 4, -1, 7, 8]',
        output: '23',
        explanation: 'The subarray [5, 4, -1, 7, 8] has the largest sum 23.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        return maxSum;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expected: '6',
        params: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]]
      },
      {
        id: 2,
        input: 'nums = [1]',
        expected: '1',
        params: [[1]]
      },
      {
        id: 3,
        input: 'nums = [5, 4, -1, 7, 8]',
        expected: '23',
        params: [[5, 4, -1, 7, 8]]
      },
      {
        id: 4,
        input: 'nums = [-1, -2, -3, -4]',
        expected: '-1',
        params: [[-1, -2, -3, -4]],
        isHidden: true
      }
    ],
    hints: [
      'Think about Kadane\'s algorithm. At each index, decide whether to add the current element to the running sum or start fresh from current element.',
      'Keep track of global maximum seen so far.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'longest-substring-without-repeating',
    problemCode: 'CBA-109',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    maxScore: 220,
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.`,
    inputFormat: 's: string',
    outputFormat: 'number',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.size(); right++) {
            if (seen.count(s[right]) && seen[s[right]] >= left) {
                left = seen[s[right]] + 1;
            }
            seen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        expected: '3',
        params: ['abcabcbb']
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        expected: '1',
        params: ['bbbbb']
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        expected: '3',
        params: ['pwwkew']
      },
      {
        id: 4,
        input: 's = ""',
        expected: '0',
        params: [''],
        isHidden: true
      },
      {
        id: 5,
        input: 's = "aab"',
        expected: '2',
        params: ['aab'],
        isHidden: true
      }
    ],
    hints: [
      'Maintain a sliding window [left, right] of characters without duplicates.',
      'Record the last seen index of each character to quickly jump the left pointer forward.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'coin-change',
    problemCode: 'CBA-110',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    maxScore: 250,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'coins: number[], amount: number',
    outputFormat: 'number',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'coins = [1, 2, 5], amount = 11',
        expected: '3',
        params: [[1, 2, 5], 11]
      },
      {
        id: 2,
        input: 'coins = [2], amount = 3',
        expected: '-1',
        params: [[2], 3]
      },
      {
        id: 3,
        input: 'coins = [1], amount = 0',
        expected: '0',
        params: [[1], 0]
      },
      {
        id: 4,
        input: 'coins = [186, 419, 83, 408], amount = 6249',
        expected: '20',
        params: [[186, 419, 83, 408], 6249],
        isHidden: true
      }
    ],
    hints: [
      'Define dp[i] as the minimum coins needed to make amount i.',
      'For each amount from 1 to total, try every coin that is <= amount.'
    ],
    timeLimitMs: 600
  },
  {
    id: 'trapping-rain-water',
    problemCode: 'CBA-111',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    maxScore: 350,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    inputFormat: 'height: number[]',
    outputFormat: 'number',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water between bars.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = max(leftMax, height[left]);
                water += leftMax - height[left++];
            } else {
                rightMax = max(rightMax, height[right]);
                water += rightMax - height[right--];
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left++];
            } else {
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right--];
            }
        }
        return water;
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        expected: '6',
        params: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]]
      },
      {
        id: 2,
        input: 'height = [4,2,0,3,2,5]',
        expected: '9',
        params: [[4, 2, 0, 3, 2, 5]]
      },
      {
        id: 3,
        input: 'height = [3,0,2,0,4]',
        expected: '7',
        params: [[3, 0, 2, 0, 4]],
        isHidden: true
      }
    ],
    hints: [
      'Water trapped at index i depends on min(max_left[i], max_right[i]) - height[i].',
      'Use two pointers converging from both ends to compute this in O(n) time and O(1) extra space.'
    ],
    timeLimitMs: 800
  },
  {
    id: 'edit-distance',
    problemCode: 'CBA-112',
    title: 'Edit Distance',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    maxScore: 400,
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character`,
    inputFormat: 'word1: string, word2: string',
    outputFormat: 'number',
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse -> rose -> ros'
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: '5'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
      python: `def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
        return dp[m][n];
    }
};`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[m][n];
    }
}`
    },
    testCases: [
      {
        id: 1,
        input: 'word1 = "horse", word2 = "ros"',
        expected: '3',
        params: ['horse', 'ros']
      },
      {
        id: 2,
        input: 'word1 = "intention", word2 = "execution"',
        expected: '5',
        params: ['intention', 'execution']
      },
      {
        id: 3,
        input: 'word1 = "abc", word2 = "abc"',
        expected: '0',
        params: ['abc', 'abc'],
        isHidden: true
      }
    ],
    hints: [
      'Use a 2D DP table where dp[i][j] represents the edit distance between word1[0..i-1] and word2[0..j-1].',
      'Consider insert, delete, and replace transitions when characters differ.'
    ],
    timeLimitMs: 800
  }
];
