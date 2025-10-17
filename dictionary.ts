// A small sample dictionary of common English words.
// In a real application, this would be a much larger list.
const dictionary: string[] = [
  "a", "about", "all", "also", "an", "and", "any", "are", "as", "at", "hello", "greetings", "good",
  "back", "be", "because", "but", "by",
  "can", "come", "could", "day", "do", "even", "first", "for", "from",
  "get", "go", "have", "he", "her", "him", "his", "how", "i", "if", "in",
  "into", "is", "it", "its", "just", "know", "like", "look", "make", "me",
  "most", "my", "new", "no", "not", "now", "of", "on", "one", "only", "or",
  "other", "our", "out", "people", "say", "see", "she", "so", "some", "take",
  "tell", "than", "that", "the", "their", "them", "then", "there", "these",
  "they", "thing", "think", "this", "time", "to", "up", "us", "use", "very",
  "want", "was", "way", "we", "well", "what", "when", "which", "who", "will",
  "with", "work", "would", "year", "you", "your",
  // Words from the geminiService examples
  "wanna", "wfh", "well", "request", "home", "today", "feeling", "unwell", "please",
  "sry", "went", "dubai", "reply", "hey", "sorry", "late", "trip", "got", "sooner",
  "apologies", "silence", "traveling",
  "already", "regularisation", "approve", "following", "previous", "moment", "reminder",
  "regarding", "need", "further", "information", "approval", "checking", "status",
  "appreciated",
];

export const findBestWord = (swipeKeyString: string): string | null => {
    if (!swipeKeyString || swipeKeyString.length < 2) return null;

    const uniqueSwipedKeys = [...new Set(swipeKeyString)];
    let bestWord: string | null = null;
    let bestScore = -Infinity;

    // Filter dictionary to words that start with the same character as the swipe
    const potentialWords = dictionary.filter(
        word => word.length > 1 && word.startsWith(swipeKeyString[0])
    );

    for (const word of potentialWords) {
        let score = 0;
        const wordChars = new Set(word);

        // 1. Strong start and end key match bonus (very important)
        if (word.endsWith(swipeKeyString[swipeKeyString.length - 1])) {
            score += 50;
        } else {
            score -= 30; // Penalize if the end key doesn't match
        }

        // 2. Length similarity penalty
        const lengthDiff = Math.abs(word.length - uniqueSwipedKeys.length);
        score -= lengthDiff * 20;

        // 3. Character inclusion score
        let matchedChars = 0;
        for (const char of uniqueSwipedKeys) {
            if (wordChars.has(char)) {
                matchedChars++;
            }
        }
        score += (matchedChars / uniqueSwipedKeys.length) * 40;

        // 4. Penalty for letters in the word that were NOT swiped over
        let unmatchedChars = 0;
        for (const char of wordChars) {
            if (!swipeKeyString.includes(char)) {
                unmatchedChars++;
            }
        }
        score -= unmatchedChars * 25;

        if (score > bestScore) {
            bestScore = score;
            bestWord = word;
        }
    }

    return bestWord;
};
