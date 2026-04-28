// Assessment questions for each wellness category
const questions = {
  physical: [
    { id: 'p1', text: 'How often do you engage in physical activity (30+ minutes)?', category: 'physical',
      options: [
        { value: 1, label: 'Almost Never' },
        { value: 2, label: '1-2 days/week' },
        { value: 3, label: '3-4 days/week' },
        { value: 4, label: '5-6 days/week' },
        { value: 5, label: 'Daily' },
      ]
    },
    { id: 'p2', text: 'How would you rate your sleep quality?', category: 'physical',
      options: [
        { value: 1, label: 'Very Poor' },
        { value: 2, label: 'Poor' },
        { value: 3, label: 'Fair' },
        { value: 4, label: 'Good' },
        { value: 5, label: 'Excellent' },
      ]
    },
    { id: 'p3', text: 'How many hours of sleep do you typically get?', category: 'physical',
      options: [
        { value: 1, label: 'Less than 5 hours' },
        { value: 2, label: '5-6 hours' },
        { value: 3, label: '6-7 hours' },
        { value: 4, label: '7-8 hours' },
        { value: 5, label: '8+ hours' },
      ]
    },
    { id: 'p4', text: 'How balanced and nutritious is your daily diet?', category: 'physical',
      options: [
        { value: 1, label: 'Very Unbalanced' },
        { value: 2, label: 'Mostly Junk' },
        { value: 3, label: 'Mixed' },
        { value: 4, label: 'Mostly Healthy' },
        { value: 5, label: 'Very Balanced' },
      ]
    },
    { id: 'p5', text: 'How well do you stay hydrated throughout the day?', category: 'physical',
      options: [
        { value: 1, label: 'Barely Any Water' },
        { value: 2, label: '2-3 Glasses' },
        { value: 3, label: '4-5 Glasses' },
        { value: 4, label: '6-7 Glasses' },
        { value: 5, label: '8+ Glasses' },
      ]
    },
    { id: 'p6', text: 'How often do you experience physical pain or discomfort?', category: 'physical',
      options: [
        { value: 1, label: 'Very Often' },
        { value: 2, label: 'Often' },
        { value: 3, label: 'Sometimes' },
        { value: 4, label: 'Rarely' },
        { value: 5, label: 'Almost Never' },
      ]
    },
    { id: 'p7', text: 'How energetic do you feel during the day?', category: 'physical',
      options: [
        { value: 1, label: 'Very Low' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Moderate' },
        { value: 4, label: 'High' },
        { value: 5, label: 'Very High' },
      ]
    },
    { id: 'p8', text: 'How often do you take breaks from prolonged sitting or screen time?', category: 'physical',
      options: [
        { value: 1, label: 'Almost Never' },
        { value: 2, label: 'Once or Twice' },
        { value: 3, label: 'Every Few Hours' },
        { value: 4, label: 'Every Hour' },
        { value: 5, label: 'Regularly' },
      ]
    },
  ],
  mental: [
    { id: 'm1', text: 'How well can you focus on tasks without distractions?', category: 'mental',
      options: [
        { value: 1, label: 'Very Poorly' },
        { value: 2, label: 'Poorly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Well' },
        { value: 5, label: 'Extremely Well' },
      ]
    },
    { id: 'm2', text: 'How often do you feel mentally overwhelmed?', category: 'mental',
      options: [
        { value: 1, label: 'Almost Always' },
        { value: 2, label: 'Often' },
        { value: 3, label: 'Sometimes' },
        { value: 4, label: 'Rarely' },
        { value: 5, label: 'Almost Never' },
      ]
    },
    { id: 'm3', text: 'How effectively do you manage your daily stress?', category: 'mental',
      options: [
        { value: 1, label: 'Very Poorly' },
        { value: 2, label: 'Poorly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Well' },
        { value: 5, label: 'Extremely Well' },
      ]
    },
    { id: 'm4', text: 'How often do you practice mindfulness or meditation?', category: 'mental',
      options: [
        { value: 1, label: 'Never' },
        { value: 2, label: 'Occasionally' },
        { value: 3, label: 'Weekly' },
        { value: 4, label: 'Several Times/Week' },
        { value: 5, label: 'Daily' },
      ]
    },
    { id: 'm5', text: 'How satisfied are you with your work-life balance?', category: 'mental',
      options: [
        { value: 1, label: 'Very Dissatisfied' },
        { value: 2, label: 'Dissatisfied' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Satisfied' },
        { value: 5, label: 'Very Satisfied' },
      ]
    },
    { id: 'm6', text: 'How well do you handle unexpected changes or challenges?', category: 'mental',
      options: [
        { value: 1, label: 'Very Poorly' },
        { value: 2, label: 'Poorly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Well' },
        { value: 5, label: 'Extremely Well' },
      ]
    },
    { id: 'm7', text: 'How often do you engage in learning or creative activities?', category: 'mental',
      options: [
        { value: 1, label: 'Never' },
        { value: 2, label: 'Rarely' },
        { value: 3, label: 'Sometimes' },
        { value: 4, label: 'Often' },
        { value: 5, label: 'Very Often' },
      ]
    },
    { id: 'm8', text: 'How clear and organized do your thoughts feel?', category: 'mental',
      options: [
        { value: 1, label: 'Very Unclear' },
        { value: 2, label: 'Unclear' },
        { value: 3, label: 'Somewhat Clear' },
        { value: 4, label: 'Clear' },
        { value: 5, label: 'Very Clear' },
      ]
    },
  ],
  emotional: [
    { id: 'e1', text: 'How often do you feel genuinely happy and content?', category: 'emotional',
      options: [
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Occasionally' },
        { value: 3, label: 'Sometimes' },
        { value: 4, label: 'Often' },
        { value: 5, label: 'Almost Always' },
      ]
    },
    { id: 'e2', text: 'How comfortable are you expressing your feelings to others?', category: 'emotional',
      options: [
        { value: 1, label: 'Very Uncomfortable' },
        { value: 2, label: 'Uncomfortable' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Comfortable' },
        { value: 5, label: 'Very Comfortable' },
      ]
    },
    { id: 'e3', text: 'How well do you cope with negative emotions?', category: 'emotional',
      options: [
        { value: 1, label: 'Very Poorly' },
        { value: 2, label: 'Poorly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Well' },
        { value: 5, label: 'Very Well' },
      ]
    },
    { id: 'e4', text: 'How supported do you feel by your relationships?', category: 'emotional',
      options: [
        { value: 1, label: 'Not At All' },
        { value: 2, label: 'Slightly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Very Supported' },
        { value: 5, label: 'Extremely Supported' },
      ]
    },
    { id: 'e5', text: 'How often do you practice gratitude or positive reflection?', category: 'emotional',
      options: [
        { value: 1, label: 'Never' },
        { value: 2, label: 'Rarely' },
        { value: 3, label: 'Sometimes' },
        { value: 4, label: 'Often' },
        { value: 5, label: 'Daily' },
      ]
    },
    { id: 'e6', text: 'How resilient do you feel when facing setbacks?', category: 'emotional',
      options: [
        { value: 1, label: 'Not Resilient' },
        { value: 2, label: 'Slightly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Very Resilient' },
        { value: 5, label: 'Extremely Resilient' },
      ]
    },
    { id: 'e7', text: 'How connected do you feel to the people around you?', category: 'emotional',
      options: [
        { value: 1, label: 'Very Disconnected' },
        { value: 2, label: 'Somewhat' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Connected' },
        { value: 5, label: 'Very Connected' },
      ]
    },
    { id: 'e8', text: 'How well do you understand and process your emotions?', category: 'emotional',
      options: [
        { value: 1, label: 'Very Poorly' },
        { value: 2, label: 'Poorly' },
        { value: 3, label: 'Moderately' },
        { value: 4, label: 'Well' },
        { value: 5, label: 'Very Well' },
      ]
    },
  ],
};

// Default answer scale labels (fallback)
const scaleLabels = [
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
  { value: 5, label: 'Always' },
];

module.exports = { questions, scaleLabels };
