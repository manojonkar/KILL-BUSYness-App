const fs = require('fs');

const path = './public/data/all_modules.json';
const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

// 1. Define the 4 new praise modules
const newPraises = [
  {
    id: "praise-1",
    chapter: "Praise & Recommendations",
    title: "Manjula Pooja Shroff",
    core_lesson: "I have known Manoj Onkar for nearly 3 decades now, and in this time, we’ve worked together in various capacities. It gives me a sense of personal pride to write a testimony for his maiden book, aiming at corporate productivity, which has been his core forte for decades.\n\nKill BUSYness. Build a High-Performance Organization is a sharp, thought-provoking, and highly relevant concept that challenges one of the most common problems in modern organizations: that of mistaking activity for progress.\n\nThe book is compelling in both its message and structure, clearly positioning BUSYness not as a time-management issue but as a leadership and culture issue that begins and hence needs to be controlled at the top. Its central framework, ROAR (Reflect, Own, Assert, Run), provides a practical and striking roadmap for leaders who want to move from motion to meaning.\n\nSince I have witnessed Manoj lead and transform many teams, I can say with conviction that what stands out most is the clarity of his thinking. The book does an excellent job of combining insight, urgency, and actionable direction, while the 90-day blueprint gives the concept real operational depth. The emphasis on trust, accountability, and this deeper mission is a call to lead differently.\n\n**Manjula Pooja Shroff**\nFounder, Chairperson, MD & CEO, Kalorex Group",
    reflection_question: "How does mistaking activity for progress impact your own team's leadership culture?",
    phase: ""
  },
  {
    id: "praise-2",
    chapter: "Praise & Recommendations",
    title: "Nand Kishore Chaudhary",
    core_lesson: "\"Regenerative leadership is mission-critical for any organization that wants to build a legacy of High Performance.\n\nAt Jaipur Rugs, we’ve lived this truth.\n\nI sincerely believe that the leaders who will shape the next decade aren’t the busiest ones; they’re the most purposeful ones. Manoj Onkar has written the definitive guide for that transition.\"\n\n**Nand Kishore Chaudhary**\nFounder, Jaipur Rugs",
    reflection_question: "Are you leading to be busy, or leading to be purposeful?",
    phase: ""
  },
  {
    id: "praise-3",
    chapter: "Praise & Recommendations",
    title: "Chetan Khosla",
    core_lesson: "\"I learned, practised and propagated tools & concepts of Industrial Engineering, Scientific Management, Six Sigma, Lean, Theory of Constraints, Operations Management, Time Management, Strategy, Business Intelligence and AI over 30 years.\n\nYet, I find this book to be more fundamental. It raises primal questions… and then answers them in a way which wakes and shakes a conscious leader.\n\nLeaders deserve language this precise, and a way back this rigorous.\"\n\n![](/book_assets/media_1790181617777.pdf-0021-05.png)\n\n**Chetan Khosla**\nChairman, Suryojasvi Group of Companies",
    reflection_question: "What primal questions about your business are you avoiding by staying busy?",
    phase: ""
  },
  {
    id: "praise-4",
    chapter: "Praise & Recommendations",
    title: "Utpal Vaishnav",
    core_lesson: "\"Manoj’s diagnosis stopped me cold: an organization that runs on follow-up runs on surveillance, not trust.\n\nI had lived inside that organization and built around it for years, without ever naming it.\n\nI have decided to partner with Manoj in spreading this movement.\"\n\n![](/book_assets/media_1790181617777.pdf-0022-07.png)\n\n**Utpal Vaishnav**\nFounder, EightQor Group",
    reflection_question: "Does your organization run on trust, or on constant follow-up?",
    phase: ""
  }
];

// 2. Separate modules before praises, and modules after praises
const foreword = data[0]; // linear_id 1
const afterPraises = data.slice(7); // starts from linear_id 8 (Introduction)

// 3. Construct new array
let newModules = [foreword, ...newPraises, ...afterPraises];

// 4. Re-assign linear_ids correctly
newModules = newModules.map((m, idx) => ({
  ...m,
  linear_id: idx + 1
}));

// 5. Write back to file
fs.writeFileSync(path, JSON.stringify(newModules, null, 2), 'utf-8');
console.log('Successfully restructured praises and updated ' + newModules.length + ' modules.');
