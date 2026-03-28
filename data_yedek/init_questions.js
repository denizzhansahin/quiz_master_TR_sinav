const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'sinav_ultra_konu.md');
const dataDir = path.join(__dirname, 'quiz_master_tr', 'assets', 'data');
const outputFile = path.join(dataDir, 'questions.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

let currentExamType = '';
let currentSubject = '';
let currentTopic = '';

const questions = [];
let questionId = 1;

for (let line of lines) {
  line = line.trim();
  
  if (line.startsWith('## 1. YKS')) {
    currentExamType = 'YKS';
  } else if (line.startsWith('## 2. ALES')) {
    currentExamType = 'ALES';
  } else if (line.startsWith('## 3. KPSS')) {
    currentExamType = 'KPSS';
  } else if (line.startsWith('* **')) {
    currentSubject = line.replace('* **', '').replace('**', '').trim();
  } else if (line.startsWith('* ')) {
    currentTopic = line.replace('* ', '').trim();
    if (currentTopic.startsWith('**[EK]**')) {
      currentTopic = currentTopic.replace('**[EK]**', '').trim();
    }
    
    // Generate 5 base questions for this topic
    for (let i = 1; i <= 5; i++) {
      questions.push({
        id: questionId++,
        examType: currentExamType,
        subject: currentSubject,
        topic: currentTopic,
        question_text: `[${currentExamType}] ${currentSubject} - ${currentTopic} konusu için Temel Soru ${i}.`,
        image_url: null,
        options: [
          { label: 'A', text: 'Doğru Cevap Seçeneği' },
          { label: 'B', text: 'Yanlış Seçenek 1' },
          { label: 'C', text: 'Yanlış Seçenek 2' },
          { label: 'D', text: 'Yanlış Seçenek 3' },
          { label: 'E', text: 'Yanlış Seçenek 4' }
        ],
        correct_option: 'A',
        explanation: 'Temel veritabanı sorusu.'
      });
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), 'utf-8');
console.log(`\nSUCCESS: Base database created with ${questions.length} questions in ${outputFile}`);
console.log(`You can now use 'node generate_seed.js' to create NEW update files.`);
