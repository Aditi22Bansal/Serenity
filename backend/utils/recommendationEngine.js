// AI-driven recommendation engine — generates personalized suggestions
// based on individual question answers, not just category-level scores.

function generateRecommendations(physicalScore, mentalScore, emotionalScore, answers) {
  const recommendations = [];

  // Parse individual question scores from answers
  const answerMap = {};
  if (answers && Array.isArray(answers)) {
    answers.forEach(a => { answerMap[a.questionId] = a.answer; });
  }

  // ─── Physical Recommendations (answer-specific) ───
  const sleep = answerMap['p2'] || 0;
  const sleepHours = answerMap['p3'] || 0;
  const activity = answerMap['p1'] || 0;
  const nutrition = answerMap['p4'] || 0;
  const hydration = answerMap['p5'] || 0;
  const pain = answerMap['p6'] || 0;
  const energy = answerMap['p7'] || 0;
  const breaks = answerMap['p8'] || 0;

  if (sleep <= 2) {
    recommendations.push({ category: 'physical', title: 'Improve Sleep Quality', description: 'Your sleep quality is low. Try establishing a consistent bedtime routine — avoid screens 30 minutes before bed, keep your room cool and dark, and consider a wind-down ritual like reading or gentle stretching.', priority: 1 });
  }
  if (sleepHours <= 2) {
    recommendations.push({ category: 'physical', title: 'Get More Sleep', description: 'You are sleeping less than 6 hours. Aim for 7-8 hours by going to bed 30 minutes earlier each week. Sleep debt accumulates and impacts focus, mood, and physical recovery.', priority: 1 });
  }
  if (activity <= 2) {
    recommendations.push({ category: 'physical', title: 'Start Moving More', description: 'Your physical activity is low. Start with just 15-minute walks daily — even light movement releases endorphins and improves cardiovascular health. Gradually build to 30 minutes.', priority: 1 });
  } else if (activity >= 4) {
    recommendations.push({ category: 'physical', title: 'Great Activity Level', description: 'You are consistently active. Consider varying your routine — try swimming, cycling, or yoga to work different muscle groups and prevent burnout.', priority: 3 });
  }
  if (nutrition <= 2) {
    recommendations.push({ category: 'physical', title: 'Nourish Your Body', description: 'Your diet needs attention. Try adding one extra serving of vegetables and one piece of fruit daily. Small dietary shifts compound into significant health improvements over weeks.', priority: 1 });
  }
  if (hydration <= 2) {
    recommendations.push({ category: 'physical', title: 'Hydration Reminder', description: 'You are not drinking enough water. Aim for 8 glasses daily. Keep a water bottle visible at your desk and set hourly reminders. Dehydration causes fatigue, headaches, and reduced focus.', priority: 1 });
  }
  if (pain <= 2) {
    recommendations.push({ category: 'physical', title: 'Address Physical Discomfort', description: 'You experience frequent physical pain. Consider gentle stretching, ergonomic adjustments to your workspace, and consult a healthcare provider if pain persists. Do not ignore recurring discomfort.', priority: 1 });
  }
  if (energy <= 2) {
    recommendations.push({ category: 'physical', title: 'Boost Your Energy', description: 'Your energy levels are very low. This often links to sleep, nutrition, and hydration. Prioritize these fundamentals. Short walks after meals and brief power naps (15-20 min) can also help.', priority: 1 });
  }
  if (breaks <= 2) {
    recommendations.push({ category: 'physical', title: 'Take Regular Breaks', description: 'You rarely take breaks from sitting. Use the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Stand and stretch every hour to prevent stiffness and eye strain.', priority: 2 });
  }

  // ─── Mental Recommendations (answer-specific) ───
  const focus = answerMap['m1'] || 0;
  const overwhelm = answerMap['m2'] || 0;
  const stress = answerMap['m3'] || 0;
  const mindfulness = answerMap['m4'] || 0;
  const workLife = answerMap['m5'] || 0;
  const adaptability = answerMap['m6'] || 0;
  const learning = answerMap['m7'] || 0;
  const clarity = answerMap['m8'] || 0;

  if (focus <= 2) {
    recommendations.push({ category: 'mental', title: 'Improve Your Focus', description: 'You struggle with focus. Try the Pomodoro technique — work for 25 minutes, break for 5. Remove phone notifications during focused work. Single-tasking is far more effective than multitasking.', priority: 1 });
  }
  if (overwhelm <= 2) {
    recommendations.push({ category: 'mental', title: 'Manage Mental Overload', description: 'You feel frequently overwhelmed. Try a daily brain dump — spend 5 minutes writing everything on your mind. Then prioritize just 3 tasks for the day. You cannot do everything, and that is okay.', priority: 1 });
  }
  if (stress <= 2) {
    recommendations.push({ category: 'mental', title: 'Stress Management', description: 'Your stress management needs work. Try the 4-7-8 breathing technique in our Breathing Studio — it activates your parasympathetic nervous system and calms your body within minutes.', priority: 1 });
  }
  if (mindfulness <= 2) {
    recommendations.push({ category: 'mental', title: 'Start a Mindfulness Practice', description: 'You rarely practice mindfulness. Start with just 3 minutes of guided breathing daily using our Breathing Studio. Mindfulness reduces anxiety, improves focus, and builds emotional resilience over time.', priority: 2 });
  }
  if (workLife <= 2) {
    recommendations.push({ category: 'mental', title: 'Work-Life Boundaries', description: 'You are dissatisfied with your work-life balance. Set clear boundaries — define a hard stop time for work, protect your evenings, and schedule activities you enjoy. Balance is a daily practice, not a destination.', priority: 1 });
  }
  if (adaptability <= 2) {
    recommendations.push({ category: 'mental', title: 'Build Adaptability', description: 'Unexpected changes are difficult for you. Practice reframing — when plans change, ask "What can I learn from this?" Flexibility is a skill that strengthens with practice.', priority: 2 });
  }
  if (learning <= 2) {
    recommendations.push({ category: 'mental', title: 'Engage Your Mind', description: 'You rarely engage in learning or creative activities. Try dedicating 20 minutes daily to something that sparks curiosity — reading, puzzles, drawing, or learning a new skill. Mental stimulation prevents stagnation.', priority: 2 });
  }
  if (clarity <= 2) {
    recommendations.push({ category: 'mental', title: 'Mental Clarity Practice', description: 'Your thoughts feel unclear. Journaling before bed helps process the day. Morning pages — writing 3 pages of stream-of-consciousness — can dramatically improve mental clarity over time.', priority: 2 });
  }

  // ─── Emotional Recommendations (answer-specific) ───
  const happiness = answerMap['e1'] || 0;
  const expression = answerMap['e2'] || 0;
  const coping = answerMap['e3'] || 0;
  const support = answerMap['e4'] || 0;
  const gratitude = answerMap['e5'] || 0;
  const resilience = answerMap['e6'] || 0;
  const connection = answerMap['e7'] || 0;
  const understanding = answerMap['e8'] || 0;

  if (happiness <= 2) {
    recommendations.push({ category: 'emotional', title: 'Cultivate Joy', description: 'You rarely feel happy or content. Start a gratitude practice — write 3 specific things you are grateful for each morning. Research shows this rewires your brain toward positivity within 21 days.', priority: 1 });
  }
  if (expression <= 2) {
    recommendations.push({ category: 'emotional', title: 'Express Your Feelings', description: 'You find it hard to express emotions. Use our Wellness Journal to write about your feelings privately. Over time, try sharing one small feeling with someone you trust each week.', priority: 1 });
  }
  if (coping <= 2) {
    recommendations.push({ category: 'emotional', title: 'Healthy Coping Strategies', description: 'You struggle with negative emotions. Instead of suppressing feelings, try naming them — "I feel anxious because..." Labeling emotions reduces their intensity. Deep breathing and gentle movement also help.', priority: 1 });
  }
  if (support <= 2) {
    recommendations.push({ category: 'emotional', title: 'Build Your Support Network', description: 'You feel unsupported in your relationships. Reach out to one person this week — a friend, family member, or counselor. Connection does not require perfection; simply showing up matters.', priority: 1 });
  }
  if (gratitude <= 2) {
    recommendations.push({ category: 'emotional', title: 'Daily Gratitude', description: 'You rarely practice gratitude. Try the "3 good things" exercise before bed — write down three positive moments from your day. This simple practice transforms how you experience daily life.', priority: 2 });
  }
  if (resilience <= 2) {
    recommendations.push({ category: 'emotional', title: 'Strengthen Resilience', description: 'Setbacks hit you hard. Remember: resilience is not about avoiding difficulty, it is about recovering from it. After a tough day, ask yourself "What did I handle well?" and build on that.', priority: 1 });
  }
  if (connection <= 2) {
    recommendations.push({ category: 'emotional', title: 'Deepen Connections', description: 'You feel disconnected from people around you. Schedule one meaningful conversation this week — not about tasks, but about how someone is truly doing. Quality connection beats quantity.', priority: 2 });
  }
  if (understanding <= 2) {
    recommendations.push({ category: 'emotional', title: 'Emotional Awareness', description: 'You have difficulty understanding your emotions. Try an emotion check-in 3 times daily — pause and ask "What am I feeling right now, and why?" Our Mood Check-in feature helps build this habit.', priority: 2 });
  }

  // ─── Category-level fallbacks (when no individual answers available) ───
  if (Object.keys(answerMap).length === 0) {
    if (physicalScore < 40) {
      recommendations.push(
        { category: 'physical', title: 'Start with Short Walks', description: 'Begin with 15-minute walks daily. Small steps build lasting habits that transform your physical wellbeing over time.', priority: 1 },
        { category: 'physical', title: 'Sleep Routine', description: 'Set a consistent bedtime. Your body thrives on routine — even small improvements in sleep quality ripple across all wellness dimensions.', priority: 1 },
      );
    } else if (physicalScore < 70) {
      recommendations.push(
        { category: 'physical', title: 'Morning Stretch', description: 'A 10-minute morning stretch can boost energy, flexibility, and set a positive tone for the entire day.', priority: 2 },
      );
    } else {
      recommendations.push(
        { category: 'physical', title: 'Keep It Up', description: 'Your physical wellness is strong. Try a new activity to keep things fresh and maintain motivation.', priority: 3 },
      );
    }

    if (mentalScore < 40) {
      recommendations.push(
        { category: 'mental', title: 'Breathing Exercise', description: 'Try the 4-7-8 technique in our Breathing Studio: inhale 4s, hold 7s, exhale 8s. It calms your nervous system within minutes.', priority: 1 },
        { category: 'mental', title: 'Digital Detox', description: 'Take a 30-minute break from all screens. Let your mind rest and reset. You will return sharper and calmer.', priority: 1 },
      );
    } else if (mentalScore < 70) {
      recommendations.push(
        { category: 'mental', title: 'Mindful Moment', description: 'Take 5 minutes to sit quietly and focus on your breath. Consistency matters more than duration.', priority: 2 },
      );
    } else {
      recommendations.push(
        { category: 'mental', title: 'Mental Strength', description: 'Your mental wellness is strong. Consider journaling regularly to maintain and deepen your mental clarity.', priority: 3 },
      );
    }

    if (emotionalScore < 40) {
      recommendations.push(
        { category: 'emotional', title: 'Gratitude Practice', description: 'Write 3 things you are grateful for each day. This simple habit shifts your emotional baseline toward positivity.', priority: 1 },
        { category: 'emotional', title: 'Reach Out', description: 'Call or message someone you care about today. Human connection is one of the strongest predictors of emotional wellbeing.', priority: 1 },
      );
    } else if (emotionalScore < 70) {
      recommendations.push(
        { category: 'emotional', title: 'Feelings Journal', description: 'Spend 5 minutes writing about how you feel today. No judgment, no editing — just honest reflection.', priority: 2 },
      );
    } else {
      recommendations.push(
        { category: 'emotional', title: 'Emotional Balance', description: 'You are doing wonderfully. Keep nurturing your relationships and practicing self-compassion.', priority: 3 },
      );
    }
  }

  // ─── Positive reinforcement for high scores ───
  if (physicalScore >= 80 && mentalScore >= 80 && emotionalScore >= 80) {
    recommendations.unshift({
      category: 'general',
      title: 'Outstanding Wellness',
      description: 'All your wellness dimensions are thriving. You are a role model for balanced living. Keep doing what you are doing, and consider mentoring others on their wellness journey.',
      priority: 3,
    });
  }

  // Sort by priority, limit to 8 most relevant
  return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 8);
}

module.exports = { generateRecommendations };
