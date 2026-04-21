// Rule-based recommendation engine
function generateRecommendations(physicalScore, mentalScore, emotionalScore) {
  const recommendations = [];

  // Physical recommendations
  if (physicalScore < 40) {
    recommendations.push(
      { category: 'physical', title: 'Start with Short Walks', description: 'Begin with 15-minute walks daily. Small steps build lasting habits.', icon: '🚶', priority: 1 },
      { category: 'physical', title: 'Sleep Routine', description: 'Set a consistent bedtime. Your body thrives on routine.', icon: '🌙', priority: 1 },
      { category: 'physical', title: 'Hydration Goal', description: 'Try drinking 8 glasses of water today. Your body will thank you.', icon: '💧', priority: 2 },
    );
  } else if (physicalScore < 70) {
    recommendations.push(
      { category: 'physical', title: 'Morning Stretch', description: 'A 10-minute morning stretch can boost energy and flexibility.', icon: '🌿', priority: 2 },
      { category: 'physical', title: 'Balanced Meals', description: 'Add one extra serving of vegetables to your meals today.', icon: '🥗', priority: 2 },
    );
  } else {
    recommendations.push(
      { category: 'physical', title: 'Keep It Up!', description: 'Your physical wellness is great. Try a new activity to stay motivated.', icon: '🏃', priority: 3 },
    );
  }

  // Mental recommendations
  if (mentalScore < 40) {
    recommendations.push(
      { category: 'mental', title: 'Breathing Exercise', description: 'Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Repeat 4 times.', icon: '🧘', priority: 1 },
      { category: 'mental', title: 'Digital Detox', description: 'Take a 30-minute break from all screens. Let your mind rest.', icon: '📵', priority: 1 },
      { category: 'mental', title: 'Brain Dump', description: 'Write down everything on your mind. Getting it out helps clear the clutter.', icon: '📝', priority: 2 },
    );
  } else if (mentalScore < 70) {
    recommendations.push(
      { category: 'mental', title: 'Mindful Moment', description: 'Take 5 minutes to sit quietly and focus on your breath.', icon: '🧠', priority: 2 },
      { category: 'mental', title: 'Nature Break', description: 'Spend 15 minutes outdoors. Nature helps reset mental clarity.', icon: '🌳', priority: 2 },
    );
  } else {
    recommendations.push(
      { category: 'mental', title: 'Mental Strength', description: 'Your mental wellness is strong. Consider journaling to maintain clarity.', icon: '✨', priority: 3 },
    );
  }

  // Emotional recommendations
  if (emotionalScore < 40) {
    recommendations.push(
      { category: 'emotional', title: 'Gratitude Practice', description: 'Write 3 things you\'re grateful for. It shifts your emotional baseline.', icon: '🙏', priority: 1 },
      { category: 'emotional', title: 'Reach Out', description: 'Call or message someone you care about. Connection heals.', icon: '💛', priority: 1 },
      { category: 'emotional', title: 'Self-Compassion', description: 'Speak to yourself like you would to a dear friend. Be gentle.', icon: '🤗', priority: 2 },
    );
  } else if (emotionalScore < 70) {
    recommendations.push(
      { category: 'emotional', title: 'Feelings Journal', description: 'Spend 5 minutes writing about how you feel. No judgment.', icon: '📖', priority: 2 },
      { category: 'emotional', title: 'Kind Gesture', description: 'Do something small and kind for someone today. Giving uplifts.', icon: '💐', priority: 2 },
    );
  } else {
    recommendations.push(
      { category: 'emotional', title: 'Emotional Balance', description: 'You\'re doing wonderfully. Keep nurturing your relationships.', icon: '💚', priority: 3 },
    );
  }

  // Sort by priority (1 = most important)
  return recommendations.sort((a, b) => a.priority - b.priority);
}

module.exports = { generateRecommendations };
