/***
 * Author : Ivan Donyk
 * Path : ./utils.js
 * Purpose : return available matches based on inputed number array. 
 * Input : number array
 * Output : Available matches
 * 
 * Hash-map approach to find all index triples (pA, pB, sum)
 * where A[pA] + A[pB] = A[sum] and all three indices are distinct. 
 * 
 * Time Complexity:  O(n²) average — O(n²) pairs, each with O(1) map lookup.
 *                   O(n³) worst-case when all elements share the same value
 *                   (e.g. [0, 0, 0, ...]), since every pair maps to O(n) candidates.
 * Space Complexity: O(n) for the value-to-indices map.
 */

export const detectSums = (array) => {
  if (!Array.isArray(array)) {
    throw new Error('Not an array');
  }

  // Map each value to the list of indices where it appears
  const valueMap = new Map();
  array.forEach((val, idx) => {
    if (!valueMap.has(val)) valueMap.set(val, []);
    valueMap.get(val).push(idx);
  });
  
  const results = [];
  const n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const target = array[i] + array[j];
      for (const s of (valueMap.get(target) || [])) {
        if (s !== i && s !== j) {
          results.push({ pA: i, pB: j, sum: s });
        }
      }
    }
  }
  return results;
};

export function calculateResult(input) {
  const parsedInput = input.split(',').map(i => parseInt(i.trim(), 10));
  let error = null;
  let result = '';
  try {
    result = detectSums(input);
  } catch (e) {
    error = e.message;
  }
  return { input: parsedInput, result, error }
}
