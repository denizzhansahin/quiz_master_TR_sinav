const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'sinav_ultra_konu.md');
const dataDir = path.join(__dirname, 'quiz_master_tr', 'assets', 'data');
const mainOutputFile = path.join(dataDir, 'questions.json');
const newQuestionsFile = path.join(dataDir, 'new_questions.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read existing questions to determine starting ID
let existingQuestions = [];
if (fs.existsSync(mainOutputFile)) {
  try {
    existingQuestions = JSON.parse(fs.readFileSync(mainOutputFile, 'utf-8'));
  } catch (e) {
    console.error("Error reading main questions.json, starting fresh.");
  }
}

const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

let currentExamType = '';
let currentSubject = '';
let currentTopic = '';

const newQuestions = [];
let maxId = existingQuestions.reduce((max, q) => Math.max(max, q.id || 0), 0);
let questionId = maxId + 1;

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
    // Remove bold [EK] tags if they exist
    if (currentTopic.startsWith('**[EK]**')) {
      currentTopic = currentTopic.replace('**[EK]**', '').trim();
    }
    
    // Generate 5 fresh questions for every topic found in the markdown
    // These will have new IDs starting from maxId + 1
    for (let i = 1; i <= 5; i++) {
      newQuestions.push({
        id: questionId++,
        examType: currentExamType,
        subject: currentSubject,
        topic: currentTopic,
        question_text: `[YENİ] [${currentExamType}] ${currentSubject} - ${currentTopic} konusu için Güncel Soru ${i}. Bu sorunun cevabı A şıkkıdır.`,
        image_url: null,
        options: [
          { label: 'A', text: 'Doğru Cevap Seçeneği' },
          { label: 'B', text: 'Yanlış Seçenek 1' },
          { label: 'C', text: 'Yanlış Seçenek 2' },
          { label: 'D', text: 'Yanlış Seçenek 3' },
          { label: 'E', text: 'Yanlış Seçenek 4' }
        ],
        correct_option: 'A',
        explanation: 'Bu soru dinamik güncelleme sistemi ile yeni eklenmiştir.'
      });
    }
  }
}

// 1. Save only the NEW questions to new_questions.json
fs.writeFileSync(newQuestionsFile, JSON.stringify(newQuestions, null, 2), 'utf-8');
console.log(`\nSUCCESS: Generated ${newQuestions.length} NEW questions in ${newQuestionsFile}`);
console.log(`These can now be uploaded to GitHub for remote synchronization.`);
console.log(`Main database (questions.json) was NOT modified, used only for ID tracking.`);
