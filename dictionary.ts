// A small dictionary for the swipe-to-type proof of concept.
const words: string[] = [
    'hello', 'world', 'keyboard', 'typing', 'swipe', 'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from',
    'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
    'no', 'just', 'him', 'know', 'take', 'person', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
    'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
    'any', 'these', 'give', 'day', 'most', 'us', 'home', 'today', 'feeling', 'unwell', 'request',
    // Added words for better accuracy
    'planning', 'weekend', 'sometime', 'from', 'are', 'help', 'please', 'thanks', 'again', 'message'
  ];
  
// An improved algorithm to find the best word based on a swipe path.
export const findBestWord = (swipeKeys: string): string | null => {
    if (swipeKeys.length < 2) {
      return null;
    }
  
    const startChar = swipeKeys[0];
    const endChar = swipeKeys[swipeKeys.length - 1];
    const pathChars = new Set(swipeKeys.split(''));
  
    let bestMatch: string | null = null;
    let highestScore = -Infinity;
  
    // Filter dictionary for words that start with the correct letter. This is a strong heuristic.
    const candidateWords = words.filter(word => word.startsWith(startChar));
  
    for (const word of candidateWords) {
      let score = 0;
      const wordChars = new Set(word.split(''));
  
      // 1. Reward for matching characters: How many of the word's unique chars are in the swipe path?
      let matchingChars = 0;
      for (const char of wordChars) {
        if (pathChars.has(char)) {
          matchingChars++;
        }
      }
      // Normalize by word length. A perfect match (all word letters are in path) gets a score of 1 here.
      score += (matchingChars / wordChars.size);
  
      // 2. Strong reward if the word ends with the swipe's end character.
      if (word.endsWith(endChar)) {
        score += 1.5;
      }
  
      // 3. Penalize for characters in the word that are NOT in the swipe path ("extra" letters).
      let extraChars = 0;
      for (const char of wordChars) {
        if (!pathChars.has(char)) {
          extraChars++;
        }
      }
      // Penalize more heavily for words with many letters not touched by the swipe.
      score -= (extraChars / word.length) * 0.8;
  
      // 4. Penalize for a large difference between swipe path length and word length.
      // This helps differentiate between short and long words that might have similar letters.
      const lengthDifference = Math.abs(word.length - pathChars.size);
      score -= lengthDifference * 0.1;
  
      if (score > highestScore) {
        highestScore = score;
        bestMatch = word;
      }
    }
  
    return bestMatch;
};