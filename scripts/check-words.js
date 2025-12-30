import { readFileSync } from 'fs';

// Read data.yaml and parse words
const yamlContent = readFileSync('data.yaml', 'utf-8');
const readmeContent = readFileSync('README.md', 'utf-8');

// Extract all words from data.yaml using regex
const wordRegex = /^\s*- word: (.+)$/gm;
const matches = [...yamlContent.matchAll(wordRegex)];
// Remove quotes from captured words
const words = matches.map(m => m[1].trim().replace(/^['"]|['"]$/g, ''));

console.log('Total words in data.yaml:', words.length);

// Check each word in README.md
const missingWords = [];
const foundWords = [];

for (const word of words) {
  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Look for the word in the table format: | word |
  const pattern = new RegExp('^\\|\\s*' + escapedWord + '\\s*\\|', 'm');

  if (pattern.test(readmeContent)) {
    foundWords.push(word);
  } else {
    missingWords.push(word);
  }
}

console.log('\nFound in README.md:', foundWords.length);
console.log('Missing from README.md:', missingWords.length);

if (missingWords.length > 0) {
  console.log('\n=== Missing Words ===');
  missingWords.forEach(w => console.log('  -', w));
} else {
  console.log('\n✓ All words found in README.md!');
}
