import { useState, useEffect } from 'react';
import './UserGuide.css';

const TOC = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'assessment', label: 'Wellness Assessment' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mood', label: 'Daily Mood Check-in' },
  { id: 'breathing', label: 'Breathing Studio' },
  { id: 'journal', label: 'Wellness Journal' },
  { id: 'goals', label: 'Goals' },
  { id: 'heatmap', label: 'Activity Heatmap' },
  { id: 'profile', label: 'Profile and Reports' },
  { id: 'faq', label: 'FAQ' },
];

const FAQS = [
  {
    q: 'How often should I take the wellness assessment?',
    a: 'We recommend retaking the assessment every one to two weeks. This gives you enough time to implement changes and see meaningful shifts in your scores. However, you are free to take it at any time.',
  },
  {
    q: 'Can I update my daily mood check-in after submitting it?',
    a: 'Yes. The platform allows one check-in per day, but you can revisit the Mood page and update your responses as many times as needed before the day ends.',
  },
  {
    q: 'What does the wellness score represent?',
    a: 'Your wellness score is a weighted average of your Physical, Mental, and Emotional assessment scores, each rated on a 0 to 100 scale. It provides a holistic snapshot of your overall well-being.',
  },
  {
    q: 'Is my data private?',
    a: 'Absolutely. All data is tied to your personal account and secured with encrypted authentication tokens. No information is shared with third parties.',
  },
  {
    q: 'How does the recommendation engine work?',
    a: 'Recommendations are generated server-side based on your latest assessment scores. The engine identifies your lowest-performing wellness areas and surfaces targeted, actionable suggestions to help you improve.',
  },
  {
    q: 'Can I export my wellness data?',
    a: 'Yes. Navigate to the Profile page and click "Download Report" to generate a comprehensive HTML report containing your scores, assessment history, mood trends, and goals.',
  },
];

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="guide-page">
      <div className="container">
        {/* Hero */}
        <div className="guide-hero">
          <h1>User Guide</h1>
          <p>
            A complete walkthrough of the Serenity platform — from creating your
            account to tracking your long-term wellness progress.
          </p>
        </div>

        <div className="guide-layout">
          {/* Sidebar */}
          <aside className="guide-sidebar">
            <nav className="guide-toc">
              <h3>Contents</h3>
              <ul className="toc-list">
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeSection === item.id ? 'active' : ''}
                    >
                      <span className="toc-number">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="guide-content">
            {/* 1. Getting Started */}
            <section className="guide-section" id="getting-started">
              <div className="guide-section-header">
                <div className="guide-section-number">1</div>
                <h2>Getting Started</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  Serenity is a holistic wellness platform that helps you
                  understand and improve your physical, mental, and emotional
                  well-being through guided assessments, daily check-ins, and
                  personalized insights.
                </p>
                <ol className="guide-steps">
                  <li className="guide-step">
                    <div className="step-marker">1</div>
                    <div className="guide-step-content">
                      <h4>Create an Account</h4>
                      <p>
                        Navigate to the Sign Up page and provide your full name,
                        email address, and a password (minimum 6 characters).
                        Upon successful registration, you will be automatically
                        logged in.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker blue">2</div>
                    <div className="guide-step-content">
                      <h4>Complete Your First Assessment</h4>
                      <p>
                        After registration, you are directed to the Wellness
                        Assessment. Complete all three categories — Physical,
                        Mental, and Emotional — to generate your baseline
                        wellness profile.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker lavender">3</div>
                    <div className="guide-step-content">
                      <h4>Explore Your Dashboard</h4>
                      <p>
                        Once your assessment is complete, your personalized
                        Dashboard becomes available with wellness scores, trend
                        charts, and tailored recommendations.
                      </p>
                    </div>
                  </li>
                </ol>
                <div className="guide-info-box">
                  <p>
                    <span className="guide-info-label">Note:</span>
                    All features except the landing page require authentication.
                    Your session persists until you explicitly log out.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Assessment */}
            <section className="guide-section" id="assessment">
              <div className="guide-section-header">
                <div className="guide-section-number">2</div>
                <h2>Wellness Assessment</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The assessment is the foundation of your wellness profile. It
                  evaluates three core dimensions of your health through
                  carefully crafted questionnaires.
                </p>
                <div className="guide-two-col">
                  <div className="guide-mini-card">
                    <h4>Physical Wellness</h4>
                    <p>
                      Covers body health, sleep quality, activity levels, and
                      nutrition habits.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Mental Wellness</h4>
                    <p>
                      Evaluates stress management, focus, cognitive load, and
                      mindfulness practices.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Emotional Wellness</h4>
                    <p>
                      Assesses emotional patterns, relationship health, and
                      inner resilience.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Overall Score</h4>
                    <p>
                      A composite score out of 100, calculated from all three
                      category scores.
                    </p>
                  </div>
                </div>
                <p style={{ marginTop: 20 }}>
                  Each category contains 8 questions rated on a 5-point scale:
                </p>
                <div className="scale-row">
                  {['Rarely', 'Sometimes', 'Often', 'Very Often', 'Always'].map(
                    (label, i) => (
                      <div className="scale-item" key={i}>
                        <span className="scale-val">{i + 1}</span>
                        {label}
                      </div>
                    )
                  )}
                </div>
                <div className="guide-info-box blue" style={{ marginTop: 20 }}>
                  <p>
                    <span className="guide-info-label">Tip:</span>
                    You can complete categories in any order. Progress is tracked
                    visually at the top of the page. You may retake the
                    assessment at any time to update your profile.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Dashboard */}
            <section className="guide-section" id="dashboard">
              <div className="guide-section-header">
                <div className="guide-section-number">3</div>
                <h2>Dashboard</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Dashboard is your central command center. It provides a
                  real-time overview of your wellness journey with the following
                  components:
                </p>
                <ol className="guide-steps">
                  <li className="guide-step">
                    <div className="step-marker">A</div>
                    <div className="guide-step-content">
                      <h4>Statistics Bar</h4>
                      <p>
                        Displays your overall score, total assessments
                        completed, current day streak, and number of active
                        suggestions at a glance.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker blue">B</div>
                    <div className="guide-step-content">
                      <h4>Wellness Score Ring</h4>
                      <p>
                        A visual circular indicator showing your overall score
                        out of 100, accompanied by progress bars for each
                        category — Physical, Mental, and Emotional.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker lavender">C</div>
                    <div className="guide-step-content">
                      <h4>Trend Chart</h4>
                      <p>
                        A line chart tracking your scores over time across all
                        three categories. Visible after completing two or more
                        assessments.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker peach">D</div>
                    <div className="guide-step-content">
                      <h4>Personalized Recommendations</h4>
                      <p>
                        Actionable suggestions generated by the platform based
                        on your latest assessment results. Recommendations are
                        categorized and updated each time you retake an
                        assessment.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* 4. Mood */}
            <section className="guide-section" id="mood">
              <div className="guide-section-header">
                <div className="guide-section-number">4</div>
                <h2>Daily Mood Check-in</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Mood Check-in is designed for quick, daily
                  self-reflection. It takes approximately 30 seconds to complete
                  and tracks four key metrics:
                </p>
                <div className="guide-table-wrap">
                  <table className="guide-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Scale</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mood</td>
                        <td>1 to 5</td>
                        <td>
                          Your general emotional state, from Awful to Great
                        </td>
                      </tr>
                      <tr>
                        <td>Energy</td>
                        <td>1 to 5</td>
                        <td>
                          Physical and mental energy levels, from Drained to
                          Superb
                        </td>
                      </tr>
                      <tr>
                        <td>Stress</td>
                        <td>1 to 5</td>
                        <td>
                          Calmness level, from Very Stressed to Peaceful
                        </td>
                      </tr>
                      <tr>
                        <td>Sleep</td>
                        <td>1 to 5</td>
                        <td>
                          Sleep quality from the previous night, from Terrible
                          to Amazing
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 16 }}>
                  You can also add an optional text note and tag activities you
                  engaged in during the day (such as Exercise, Meditation,
                  Social, Reading, etc.). The platform stores running averages
                  and a scrollable history of all past check-ins.
                </p>
                <div className="guide-info-box lavender">
                  <p>
                    <span className="guide-info-label">Note:</span>
                    Only one check-in is allowed per day, but you may update it
                    as many times as you like.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Breathing */}
            <section className="guide-section" id="breathing">
              <div className="guide-section-header">
                <div className="guide-section-number">5</div>
                <h2>Breathing Studio</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Breathing Studio provides guided breathing exercises with
                  real-time visual cues. Select a technique, set your desired
                  number of cycles, and follow the animated breathing circle.
                </p>
                <div className="guide-table-wrap">
                  <table className="guide-table">
                    <thead>
                      <tr>
                        <th>Technique</th>
                        <th>Pattern</th>
                        <th>Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>4-7-8 Relaxing</td>
                        <td>Inhale 4s, Hold 7s, Exhale 8s</td>
                        <td>Deep calm and sleep preparation</td>
                      </tr>
                      <tr>
                        <td>Box Breathing</td>
                        <td>Inhale 4s, Hold 4s, Exhale 4s, Hold 4s</td>
                        <td>Focus and mental balance</td>
                      </tr>
                      <tr>
                        <td>Calm Breath</td>
                        <td>Inhale 4s, Hold 2s, Exhale 6s</td>
                        <td>Gentle daily relaxation</td>
                      </tr>
                      <tr>
                        <td>Energize</td>
                        <td>Inhale 3s, Exhale 3s</td>
                        <td>Quick energy and alertness</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 16 }}>
                  Each completed session is automatically saved to your account.
                  The Studio also displays your total sessions, total minutes
                  practiced, and your most-used technique.
                </p>
              </div>
            </section>

            {/* 6. Journal */}
            <section className="guide-section" id="journal">
              <div className="guide-section-header">
                <div className="guide-section-number">6</div>
                <h2>Wellness Journal</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Journal is your private space for free-form reflection.
                  Each entry consists of:
                </p>
                <ol className="guide-steps">
                  <li className="guide-step">
                    <div className="step-marker">1</div>
                    <div className="guide-step-content">
                      <h4>Title</h4>
                      <p>
                        A brief heading to identify the entry (up to 200
                        characters).
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker blue">2</div>
                    <div className="guide-step-content">
                      <h4>Content</h4>
                      <p>
                        The main body of your reflection, supporting up to 5,000
                        characters.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker lavender">3</div>
                    <div className="guide-step-content">
                      <h4>Mood and Tags</h4>
                      <p>
                        Select a mood indicator and categorize the entry with
                        tags such as Gratitude, Reflection, Growth, Challenges,
                        or Wins.
                      </p>
                    </div>
                  </li>
                </ol>
                <p style={{ marginTop: 16 }}>
                  Entries are displayed in reverse chronological order with
                  pagination. You can delete any entry at any time.
                </p>
              </div>
            </section>

            {/* 7. Goals */}
            <section className="guide-section" id="goals">
              <div className="guide-section-header">
                <div className="guide-section-number">7</div>
                <h2>Wellness Goals</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  Set measurable wellness goals and track your progress over
                  time. Each goal includes:
                </p>
                <div className="guide-two-col">
                  <div className="guide-mini-card">
                    <h4>Category</h4>
                    <p>
                      Assign the goal to Physical, Mental, Emotional, or General
                      wellness.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Target Score</h4>
                    <p>
                      Define a numeric target between 10 and 100 that represents
                      your desired outcome.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Deadline</h4>
                    <p>
                      Optionally set a target date to create accountability for
                      your goal.
                    </p>
                  </div>
                  <div className="guide-mini-card">
                    <h4>Status Tracking</h4>
                    <p>
                      Goals can be marked as Active or Completed, and can be
                      reopened at any time.
                    </p>
                  </div>
                </div>
                <p style={{ marginTop: 16 }}>
                  Progress is visualized with a percentage bar. Use the filter
                  tabs to view Active, Completed, or All goals. Goals can be
                  deleted permanently when no longer needed.
                </p>
              </div>
            </section>

            {/* 8. Heatmap */}
            <section className="guide-section" id="heatmap">
              <div className="guide-section-header">
                <div className="guide-section-number">8</div>
                <h2>Activity Heatmap</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Activity Heatmap provides a visual overview of your
                  engagement over the past 52 weeks, similar to a contribution
                  graph. Each cell represents a single day and is color-coded
                  based on activity volume:
                </p>
                <div className="guide-table-wrap">
                  <table className="guide-table">
                    <thead>
                      <tr>
                        <th>Activity Level</th>
                        <th>Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Level 0 (lightest)</td>
                        <td>No activity recorded</td>
                      </tr>
                      <tr>
                        <td>Level 1</td>
                        <td>1 activity</td>
                      </tr>
                      <tr>
                        <td>Level 2</td>
                        <td>2 activities</td>
                      </tr>
                      <tr>
                        <td>Level 3</td>
                        <td>3 to 4 activities</td>
                      </tr>
                      <tr>
                        <td>Level 4 (darkest)</td>
                        <td>5 or more activities</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 16 }}>
                  Hover over any cell to see a tooltip with the date and
                  activity summary. Click a cell to expand a detailed breakdown
                  showing each individual activity (assessments, mood check-ins,
                  journal entries, and breathing sessions). The stats bar at the
                  top tracks total active days, current streak, longest streak,
                  and total activities.
                </p>
              </div>
            </section>

            {/* 9. Profile */}
            <section className="guide-section" id="profile">
              <div className="guide-section-header">
                <div className="guide-section-number">9</div>
                <h2>Profile and Reports</h2>
              </div>
              <div className="guide-section-body">
                <p>
                  The Profile page serves as your account management center and
                  provides a summary of your entire wellness journey.
                </p>
                <ol className="guide-steps">
                  <li className="guide-step">
                    <div className="step-marker">A</div>
                    <div className="guide-step-content">
                      <h4>Account Overview</h4>
                      <p>
                        View your name, email, membership duration, and
                        aggregate statistics including total assessments,
                        check-ins, and journal entries.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker blue">B</div>
                    <div className="guide-step-content">
                      <h4>Wellness Breakdown</h4>
                      <p>
                        See your latest Physical, Mental, and Emotional scores
                        in a visual bar chart format.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker lavender">C</div>
                    <div className="guide-step-content">
                      <h4>Export Report</h4>
                      <p>
                        Download a comprehensive HTML report containing your
                        wellness scores, recent assessments, mood history, goals,
                        and personalized recommendations. The file is generated
                        instantly in your browser.
                      </p>
                    </div>
                  </li>
                  <li className="guide-step">
                    <div className="step-marker peach">D</div>
                    <div className="guide-step-content">
                      <h4>Account Settings</h4>
                      <p>
                        Update your display name or change your account password
                        directly from this page.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* 10. FAQ */}
            <section className="guide-section" id="faq">
              <div className="guide-section-header">
                <div className="guide-section-number">10</div>
                <h2>Frequently Asked Questions</h2>
              </div>
              <div className="guide-section-body">
                <div className="faq-list">
                  {FAQS.map((faq, i) => (
                    <div
                      className={`faq-item ${openFaq === i ? 'open' : ''}`}
                      key={i}
                    >
                      <button
                        className="faq-question"
                        onClick={() =>
                          setOpenFaq(openFaq === i ? null : i)
                        }
                      >
                        {faq.q}
                        <span className="faq-chevron">&#9660;</span>
                      </button>
                      <div className="faq-answer">
                        <div className="faq-answer-inner">{faq.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="guide-back-top">
              <a href="#getting-started">Back to top</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
