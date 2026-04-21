// Assessment questions for each wellness category
const questions = {
  physical: [
    { id: 'p1', text: 'How often do you engage in physical activity (30+ minutes)?', category: 'physical' },
    { id: 'p2', text: 'How would you rate your sleep quality?', category: 'physical' },
    { id: 'p3', text: 'How many hours of sleep do you typically get?', category: 'physical' },
    { id: 'p4', text: 'How balanced and nutritious is your daily diet?', category: 'physical' },
    { id: 'p5', text: 'How well do you stay hydrated throughout the day?', category: 'physical' },
    { id: 'p6', text: 'How often do you experience physical pain or discomfort?', category: 'physical' },
    { id: 'p7', text: 'How energetic do you feel during the day?', category: 'physical' },
    { id: 'p8', text: 'How often do you take breaks from prolonged sitting or screen time?', category: 'physical' },
  ],
  mental: [
    { id: 'm1', text: 'How well can you focus on tasks without distractions?', category: 'mental' },
    { id: 'm2', text: 'How often do you feel mentally overwhelmed?', category: 'mental' },
    { id: 'm3', text: 'How effectively do you manage your daily stress?', category: 'mental' },
    { id: 'm4', text: 'How often do you practice mindfulness or meditation?', category: 'mental' },
    { id: 'm5', text: 'How satisfied are you with your work-life balance?', category: 'mental' },
    { id: 'm6', text: 'How well do you handle unexpected changes or challenges?', category: 'mental' },
    { id: 'm7', text: 'How often do you engage in learning or creative activities?', category: 'mental' },
    { id: 'm8', text: 'How clear and organized do your thoughts feel?', category: 'mental' },
  ],
  emotional: [
    { id: 'e1', text: 'How often do you feel genuinely happy and content?', category: 'emotional' },
    { id: 'e2', text: 'How comfortable are you expressing your feelings to others?', category: 'emotional' },
    { id: 'e3', text: 'How well do you cope with negative emotions?', category: 'emotional' },
    { id: 'e4', text: 'How supported do you feel by your relationships?', category: 'emotional' },
    { id: 'e5', text: 'How often do you practice gratitude or positive reflection?', category: 'emotional' },
    { id: 'e6', text: 'How resilient do you feel when facing setbacks?', category: 'emotional' },
    { id: 'e7', text: 'How connected do you feel to the people around you?', category: 'emotional' },
    { id: 'e8', text: 'How well do you understand and process your emotions?', category: 'emotional' },
  ],
};

// Answer scale labels
const scaleLabels = [
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
  { value: 5, label: 'Always' },
];

module.exports = { questions, scaleLabels };
