// Function to split paragraph into sentences
export const splitIntoSentences = (paragraph: string): string[] => {
  // Split on period, exclamation mark, or question mark followed by a space or end of string
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
};

// Function to create CSV content
export const createCSV = (data: any[]): string => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = value.toString().replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Function to download CSV
export const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to save sentences to local storage
export const saveSentencesToLocalStorage = (sentences: string[]) => {
  const existingSentences = JSON.parse(localStorage.getItem('unlabeledSentences') || '[]');
  const updatedSentences = [...existingSentences, ...sentences];
  localStorage.setItem('unlabeledSentences', JSON.stringify(updatedSentences));
};

// Function to get next unlabeled sentence
export const getNextSentence = (): string | null => {
  const sentences = JSON.parse(localStorage.getItem('unlabeledSentences') || '[]');
  return sentences.length > 0 ? sentences[0] : null;
};

// Function to remove labeled sentence from queue
export const removeSentenceFromQueue = (sentence: string) => {
  const sentences = JSON.parse(localStorage.getItem('unlabeledSentences') || '[]');
  const updatedSentences = sentences.filter((s: string) => s !== sentence);
  localStorage.setItem('unlabeledSentences', JSON.stringify(updatedSentences));
};

// Function to save labeled sentence
export const saveLabeledSentence = (sentence: string, label: string) => {
  const labeledSentences = JSON.parse(localStorage.getItem('labeledSentences') || '[]');
  const newLabeledSentence = {
    sentence,
    label,
    timestamp: new Date().toISOString()
  };
  labeledSentences.push(newLabeledSentence);
  localStorage.setItem('labeledSentences', JSON.stringify(labeledSentences));
  
  // Create and download CSV
  const csvContent = createCSV(labeledSentences);
  downloadCSV(csvContent, 'labeled_sentences.csv');
}; 