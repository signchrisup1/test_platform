// Mock data for the ATAR Study Platform
const MockData = {
  // Available subjects
  subjects: [
    { id: 'english', name: 'English', emoji: '📖', color: '#7c3aed' },
    { id: 'maths', name: 'Mathematics', emoji: '📐', color: '#3b82f6' },
    { id: 'biology', name: 'Biology', emoji: '🧬', color: '#10b981' },
    { id: 'chemistry', name: 'Chemistry', emoji: '⚗️', color: '#f59e0b' },
    { id: 'physics', name: 'Physics', emoji: '⚛️', color: '#ef4444' },
    { id: 'history', name: 'History', emoji: '🏛️', color: '#ec4899' },
    { id: 'geography', name: 'Geography', emoji: '🌏', color: '#06b6d4' },
    { id: 'economics', name: 'Economics', emoji: '📊', color: '#8b5cf6' },
    { id: 'legal', name: 'Legal Studies', emoji: '⚖️', color: '#f97316' },
    { id: 'psychology', name: 'Psychology', emoji: '🧠', color: '#14b8a6' },
    { id: 'pe', name: 'Physical Education', emoji: '🏃', color: '#84cc16' },
    { id: 'art', name: 'Visual Arts', emoji: '🎨', color: '#e879f9' },
    { id: 'music', name: 'Music', emoji: '🎵', color: '#fb923c' },
    { id: 'ict', name: 'Digital Technologies', emoji: '💻', color: '#64748b' },
  ],

  // Syllabus topics per subject
  syllabusTopics: {
    english: [
      { id: 'e1', name: 'Textual Analysis', status: 'practiced' },
      { id: 'e2', name: 'Persuasive Writing', status: 'in-progress' },
      { id: 'e3', name: 'Creative Writing', status: 'in-progress' },
      { id: 'e4', name: 'Comparative Essay', status: 'not-started' },
      { id: 'e5', name: 'Media Analysis', status: 'not-started' },
      { id: 'e6', name: 'Poetry Analysis', status: 'practiced' },
      { id: 'e7', name: 'Narrative Techniques', status: 'in-progress' },
      { id: 'e8', name: 'Argument Construction', status: 'not-started' },
    ],
    maths: [
      { id: 'm1', name: 'Functions & Relations', status: 'practiced' },
      { id: 'm2', name: 'Calculus - Differentiation', status: 'in-progress' },
      { id: 'm3', name: 'Calculus - Integration', status: 'not-started' },
      { id: 'm4', name: 'Probability & Statistics', status: 'practiced' },
      { id: 'm5', name: 'Trigonometry', status: 'in-progress' },
      { id: 'm6', name: 'Sequences & Series', status: 'not-started' },
      { id: 'm7', name: 'Vectors', status: 'not-started' },
      { id: 'm8', name: 'Financial Mathematics', status: 'practiced' },
    ],
    biology: [
      { id: 'b1', name: 'DNA & Genetics', status: 'practiced' },
      { id: 'b2', name: 'Cell Biology', status: 'in-progress' },
      { id: 'b3', name: 'Evolution', status: 'not-started' },
      { id: 'b4', name: 'Ecology', status: 'in-progress' },
      { id: 'b5', name: 'Human Physiology', status: 'not-started' },
      { id: 'b6', name: 'Biochemistry', status: 'practiced' },
    ],
    chemistry: [
      { id: 'c1', name: 'Atomic Structure', status: 'practiced' },
      { id: 'c2', name: 'Chemical Bonding', status: 'in-progress' },
      { id: 'c3', name: 'Organic Chemistry', status: 'not-started' },
      { id: 'c4', name: 'Redox Reactions', status: 'in-progress' },
      { id: 'c5', name: 'Equilibrium', status: 'not-started' },
      { id: 'c6', name: 'Acids & Bases', status: 'practiced' },
    ],
    physics: [
      { id: 'p1', name: 'Mechanics', status: 'in-progress' },
      { id: 'p2', name: 'Waves & Optics', status: 'not-started' },
      { id: 'p3', name: 'Electricity', status: 'practiced' },
      { id: 'p4', name: 'Thermodynamics', status: 'not-started' },
      { id: 'p5', name: 'Nuclear Physics', status: 'not-started' },
      { id: 'p6', name: 'Motion & Forces', status: 'in-progress' },
    ],
    history: [
      { id: 'h1', name: 'World War I', status: 'practiced' },
      { id: 'h2', name: 'World War II', status: 'in-progress' },
      { id: 'h3', name: 'Cold War', status: 'not-started' },
      { id: 'h4', name: 'Australian History', status: 'in-progress' },
      { id: 'h5', name: 'Rights & Freedoms', status: 'not-started' },
      { id: 'h6', name: 'Source Analysis', status: 'practiced' },
    ],
    geography: [
      { id: 'g1', name: 'Biomes & Ecosystems', status: 'in-progress' },
      { id: 'g2', name: 'Urbanisation', status: 'not-started' },
      { id: 'g3', name: 'Environmental Change', status: 'practiced' },
      { id: 'g4', name: 'Population Studies', status: 'not-started' },
      { id: 'g5', name: 'Fieldwork Skills', status: 'in-progress' },
    ],
    economics: [
      { id: 'ec1', name: 'Market Economics', status: 'practiced' },
      { id: 'ec2', name: 'Macroeconomics', status: 'in-progress' },
      { id: 'ec3', name: 'Trade & Finance', status: 'not-started' },
      { id: 'ec4', name: 'Economic Policy', status: 'not-started' },
      { id: 'ec5', name: 'Labour Markets', status: 'in-progress' },
    ],
    legal: [
      { id: 'l1', name: 'Legal System', status: 'practiced' },
      { id: 'l2', name: 'Criminal Law', status: 'in-progress' },
      { id: 'l3', name: 'Civil Law', status: 'not-started' },
      { id: 'l4', name: 'Human Rights', status: 'in-progress' },
      { id: 'l5', name: 'Law Reform', status: 'not-started' },
    ],
    psychology: [
      { id: 'ps1', name: 'Research Methods', status: 'practiced' },
      { id: 'ps2', name: 'Brain & Nervous System', status: 'in-progress' },
      { id: 'ps3', name: 'Learning & Memory', status: 'not-started' },
      { id: 'ps4', name: 'Mental Health', status: 'in-progress' },
      { id: 'ps5', name: 'Social Psychology', status: 'not-started' },
    ],
    pe: [
      { id: 'pe1', name: 'Exercise Physiology', status: 'in-progress' },
      { id: 'pe2', name: 'Biomechanics', status: 'not-started' },
      { id: 'pe3', name: 'Sports Psychology', status: 'practiced' },
      { id: 'pe4', name: 'Training Principles', status: 'in-progress' },
    ],
    art: [
      { id: 'a1', name: 'Art Analysis', status: 'practiced' },
      { id: 'a2', name: 'Art Movements', status: 'in-progress' },
      { id: 'a3', name: 'Studio Practice', status: 'in-progress' },
    ],
    music: [
      { id: 'mu1', name: 'Music Theory', status: 'practiced' },
      { id: 'mu2', name: 'Composition', status: 'in-progress' },
      { id: 'mu3', name: 'Performance', status: 'in-progress' },
    ],
    ict: [
      { id: 'i1', name: 'Programming', status: 'practiced' },
      { id: 'i2', name: 'Data Structures', status: 'in-progress' },
      { id: 'i3', name: 'Cybersecurity', status: 'not-started' },
      { id: 'i4', name: 'Database Design', status: 'not-started' },
    ],
  },

  // Practice questions bank
  questionBank: {
    english: {
      'Textual Analysis': [
        { q: 'Analyse how the author uses language techniques to convey the theme of isolation in the given extract.', type: 'extended', marks: 10, difficulty: 'Standard' },
        { q: 'Identify and explain two literary devices used in the opening paragraph of the text.', type: 'short', marks: 4, difficulty: 'Foundation' },
        { q: 'Evaluate the effectiveness of the narrative voice in shaping the reader\'s understanding of the protagonist.', type: 'extended', marks: 15, difficulty: 'Advanced' },
        { q: 'What is the effect of the metaphor used in line 5?', type: 'short', marks: 3, difficulty: 'Foundation' },
      ],
      'Persuasive Writing': [
        { q: 'Write a persuasive essay arguing that social media has a net positive effect on youth mental health.', type: 'extended', marks: 20, difficulty: 'Standard' },
        { q: 'Identify three persuasive techniques used in the given editorial and explain their intended effect.', type: 'short', marks: 6, difficulty: 'Foundation' },
        { q: 'Critically evaluate the effectiveness of the argument presented in Source A, considering its use of evidence and rhetorical strategies.', type: 'extended', marks: 15, difficulty: 'Advanced' },
      ],
      'Creative Writing': [
        { q: 'Write a narrative that explores the concept of "belonging" from the perspective of an outsider. (800-1000 words)', type: 'extended', marks: 20, difficulty: 'Standard' },
        { q: 'Write the opening paragraph of a short story that establishes a tense atmosphere.', type: 'short', marks: 5, difficulty: 'Foundation' },
      ],
      'Poetry Analysis': [
        { q: 'Analyse how the poet uses imagery and sound devices to explore the theme of loss.', type: 'extended', marks: 10, difficulty: 'Standard' },
        { q: 'What is the effect of the enjambment used in stanza 2?', type: 'short', marks: 3, difficulty: 'Foundation' },
      ],
    },
    maths: {
      'Functions & Relations': [
        { q: 'Find the domain and range of f(x) = sqrt(4 - x^2) and sketch the graph.', type: 'short', marks: 5, difficulty: 'Standard' },
        { q: 'If f(x) = 2x + 3 and g(x) = x^2 - 1, find (f o g)(x) and state its domain.', type: 'short', marks: 4, difficulty: 'Foundation' },
        { q: 'Prove that the function f(x) = (x^2 - 4)/(x - 2) has a removable discontinuity at x = 2.', type: 'extended', marks: 8, difficulty: 'Advanced' },
      ],
      'Calculus - Differentiation': [
        { q: 'Differentiate y = 3x^4 - 2x^3 + 5x - 7 and find the gradient at x = 2.', type: 'short', marks: 4, difficulty: 'Foundation' },
        { q: 'Find and classify all stationary points of f(x) = x^3 - 6x^2 + 9x + 1.', type: 'short', marks: 6, difficulty: 'Standard' },
        { q: 'A rectangular box with a square base and no lid is to have a volume of 32 cubic metres. Find the dimensions that minimise the surface area.', type: 'extended', marks: 10, difficulty: 'Advanced' },
      ],
      'Probability & Statistics': [
        { q: 'A bag contains 5 red and 3 blue marbles. If 2 marbles are drawn without replacement, find P(both red).', type: 'short', marks: 3, difficulty: 'Foundation' },
        { q: 'The heights of students are normally distributed with mean 170cm and standard deviation 8cm. Find the probability a randomly selected student is taller than 180cm.', type: 'short', marks: 5, difficulty: 'Standard' },
      ],
    },
    biology: {
      'DNA & Genetics': [
        { q: 'Explain the process of DNA replication and identify three key enzymes involved.', type: 'extended', marks: 8, difficulty: 'Standard' },
        { q: 'Define the terms "genotype" and "phenotype" and explain how they relate to each other.', type: 'short', marks: 4, difficulty: 'Foundation' },
        { q: 'Evaluate the ethical implications of CRISPR gene editing technology in human embryos.', type: 'extended', marks: 15, difficulty: 'Advanced' },
      ],
      'Cell Biology': [
        { q: 'Compare and contrast prokaryotic and eukaryotic cells, identifying at least four differences.', type: 'short', marks: 6, difficulty: 'Standard' },
        { q: 'Label the main organelles of an animal cell and state one function for each.', type: 'short', marks: 5, difficulty: 'Foundation' },
      ],
      'Evolution': [
        { q: 'Discuss the evidence for evolution from at least three different fields of biology.', type: 'extended', marks: 12, difficulty: 'Standard' },
        { q: 'Define natural selection and explain how it leads to speciation.', type: 'short', marks: 6, difficulty: 'Foundation' },
      ],
    },
    chemistry: {
      'Atomic Structure': [
        { q: 'Explain the differences between Bohr\'s model and the quantum mechanical model of the atom.', type: 'extended', marks: 8, difficulty: 'Standard' },
        { q: 'Write the electron configuration for a sodium atom (Na, Z=11).', type: 'short', marks: 2, difficulty: 'Foundation' },
      ],
      'Chemical Bonding': [
        { q: 'Compare ionic, covalent, and metallic bonding, giving an example of each.', type: 'short', marks: 6, difficulty: 'Standard' },
        { q: 'Draw the Lewis structure for CO2 and describe its molecular shape.', type: 'short', marks: 4, difficulty: 'Foundation' },
      ],
      'Acids & Bases': [
        { q: 'Calculate the pH of a 0.01 M HCl solution and explain why HCl is classified as a strong acid.', type: 'short', marks: 4, difficulty: 'Standard' },
        { q: 'Describe a neutralisation reaction between hydrochloric acid and sodium hydroxide, including a balanced equation.', type: 'short', marks: 5, difficulty: 'Foundation' },
      ],
    },
    physics: {
      'Mechanics': [
        { q: 'A 5 kg object is pushed along a horizontal surface with a force of 20 N against a friction force of 8 N. Calculate the acceleration.', type: 'short', marks: 4, difficulty: 'Foundation' },
        { q: 'Derive the equation v^2 = u^2 + 2as from first principles using the other kinematic equations.', type: 'extended', marks: 8, difficulty: 'Advanced' },
      ],
      'Electricity': [
        { q: 'Calculate the total resistance in a circuit with three resistors (4Ω, 6Ω, 12Ω) connected in parallel.', type: 'short', marks: 4, difficulty: 'Standard' },
        { q: 'State Ohm\'s Law and explain what happens to current when voltage is doubled.', type: 'short', marks: 3, difficulty: 'Foundation' },
      ],
    },
    history: {
      'World War I': [
        { q: 'Assess the significance of the Treaty of Versailles in shaping post-war Europe.', type: 'extended', marks: 15, difficulty: 'Standard' },
        { q: 'Identify three causes of World War I and briefly explain each.', type: 'short', marks: 6, difficulty: 'Foundation' },
      ],
      'Source Analysis': [
        { q: 'Evaluate the reliability and usefulness of Source A for a historian studying the Gallipoli campaign.', type: 'extended', marks: 10, difficulty: 'Standard' },
        { q: 'Identify the perspective of the author in Source B and explain how this affects the source\'s reliability.', type: 'short', marks: 5, difficulty: 'Foundation' },
      ],
    },
  },

  // Mock friends
  friends: [
    { id: 'f1', name: 'Sarah Chen', avatar: 'SC', studyMinutes: 2340, questionsAnswered: 156, avgScore: 82, streak: 14, online: true },
    { id: 'f2', name: 'James Wilson', avatar: 'JW', studyMinutes: 1980, questionsAnswered: 132, avgScore: 75, streak: 8, online: true },
    { id: 'f3', name: 'Priya Patel', avatar: 'PP', studyMinutes: 2890, questionsAnswered: 201, avgScore: 88, streak: 21, online: false },
    { id: 'f4', name: 'Tom Nguyen', avatar: 'TN', studyMinutes: 1650, questionsAnswered: 98, avgScore: 71, streak: 5, online: true },
    { id: 'f5', name: 'Emily Zhang', avatar: 'EZ', studyMinutes: 2560, questionsAnswered: 178, avgScore: 85, streak: 17, online: false },
    { id: 'f6', name: 'Liam O\'Brien', avatar: 'LO', studyMinutes: 1870, questionsAnswered: 121, avgScore: 79, streak: 11, online: false },
    { id: 'f7', name: 'Mia Johnson', avatar: 'MJ', studyMinutes: 2100, questionsAnswered: 145, avgScore: 81, streak: 9, online: true },
    { id: 'f8', name: 'Noah Kim', avatar: 'NK', studyMinutes: 3100, questionsAnswered: 220, avgScore: 91, streak: 30, online: false },
  ],

  // Mock study playlists
  playlists: [
    { id: 'pl1', name: 'Lo-Fi Study Beats', tracks: 24, emoji: '🎵' },
    { id: 'pl2', name: 'Classical Focus', tracks: 18, emoji: '🎻' },
    { id: 'pl3', name: 'Ambient Concentration', tracks: 32, emoji: '🌊' },
    { id: 'pl4', name: 'Chill Instrumental', tracks: 20, emoji: '🎹' },
    { id: 'pl5', name: 'Nature Sounds', tracks: 15, emoji: '🌿' },
  ],

  // Mock tracks
  tracks: [
    { title: 'Midnight Study', artist: 'LoFi Dreamer', duration: '3:42' },
    { title: 'Coffee & Pages', artist: 'Study Beats Co', duration: '4:15' },
    { title: 'Rainy Window', artist: 'Ambient Keys', duration: '5:01' },
    { title: 'Focus Flow', artist: 'Brain Waves', duration: '3:58' },
    { title: 'Quiet Library', artist: 'Study Zone', duration: '4:33' },
  ],

  // Motivational quotes
  quotes: [
    { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
    { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
    { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
    { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
    { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  ],

  // Achievements
  achievements: [
    { id: 'a1', name: 'First Steps', desc: 'Complete your first practice question', icon: '🎯', condition: (s) => (s.practiceHistory || []).length >= 1 },
    { id: 'a2', name: 'Getting Started', desc: 'Study for 1 hour total', icon: '⏰', condition: (s) => (s.totalStudyMinutes || 0) >= 60 },
    { id: 'a3', name: 'Streak Starter', desc: 'Maintain a 3-day study streak', icon: '🔥', condition: (s) => (s.studyStreak || 0) >= 3 },
    { id: 'a4', name: 'Quiz Whiz', desc: 'Complete 10 practice questions', icon: '📝', condition: (s) => (s.practiceHistory || []).length >= 10 },
    { id: 'a5', name: 'Dedicated Scholar', desc: 'Study for 10 hours total', icon: '📚', condition: (s) => (s.totalStudyMinutes || 0) >= 600 },
    { id: 'a6', name: 'Week Warrior', desc: 'Maintain a 7-day study streak', icon: '⚡', condition: (s) => (s.studyStreak || 0) >= 7 },
    { id: 'a7', name: 'Flashcard Master', desc: 'Create 50 flashcards', icon: '🃏', condition: (s) => {
      const decks = s.flashcardDecks || [];
      return decks.reduce((sum, d) => sum + (d.cards || []).length, 0) >= 50;
    }},
    { id: 'a8', name: 'High Achiever', desc: 'Score 90%+ on a practice question', icon: '🌟', condition: (s) => (s.practiceHistory || []).some(h => h.score >= 90) },
    { id: 'a9', name: 'Social Studier', desc: 'Join a study session', icon: '👥', condition: (s) => (s.studySessions || []).length >= 1 },
    { id: 'a10', name: 'Marathon Runner', desc: 'Study for 50 hours total', icon: '🏆', condition: (s) => (s.totalStudyMinutes || 0) >= 3000 },
  ],

  // Pre-populated flashcard decks
  sampleFlashcardDecks: [
    {
      id: 'fd1',
      name: 'English Literary Techniques',
      subject: 'english',
      cards: [
        { id: 'fc1', front: 'What is a metaphor?', back: 'A figure of speech that describes something by saying it IS something else. e.g., "Time is money."', confidence: 2, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc2', front: 'What is a simile?', back: 'A figure of speech comparing two things using "like" or "as". e.g., "Her eyes were like stars."', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc3', front: 'What is personification?', back: 'Giving human characteristics to non-human things. e.g., "The wind whispered through the trees."', confidence: 1, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc4', front: 'What is alliteration?', back: 'Repetition of the same consonant sound at the beginning of nearby words. e.g., "Peter Piper picked..."', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc5', front: 'What is foreshadowing?', back: 'A literary device where the author gives hints about what will happen later in the story.', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
      ]
    },
    {
      id: 'fd2',
      name: 'Biology - Cell Structure',
      subject: 'biology',
      cards: [
        { id: 'fc6', front: 'What is the function of mitochondria?', back: 'The powerhouse of the cell - produces ATP through cellular respiration (aerobic).', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc7', front: 'What is the role of the cell membrane?', back: 'Semi-permeable barrier that controls what enters and exits the cell. Made of a phospholipid bilayer.', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc8', front: 'What is the endoplasmic reticulum?', back: 'Network of membranes for transport. Rough ER has ribosomes (protein synthesis). Smooth ER synthesizes lipids.', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
        { id: 'fc9', front: 'What is the function of the nucleus?', back: 'Contains DNA/genetic material. Controls cell activities. Surrounded by the nuclear envelope with nuclear pores.', confidence: 0, lastReviewed: null, nextReview: new Date().toISOString(), timesReviewed: 0 },
      ]
    }
  ],

  // Sample marked responses
  sampleMarkerHistory: [
    {
      id: 'mh1',
      question: 'Discuss the impact of World War I on Australian national identity.',
      response: 'World War I had a profound impact on Australian national identity, particularly through the Gallipoli campaign...',
      grade: 12,
      maxMarks: 15,
      percentage: 80,
      wellDone: ['Strong historical evidence cited', 'Good essay structure with clear thesis'],
      improvements: ['Could include more diverse perspectives', 'Consider the home front impact more'],
      exampleResponse: 'A comprehensive response would analyse the ANZAC legend, the home front experience, and post-war social changes...',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      subject: 'history'
    },
    {
      id: 'mh2',
      question: 'Analyse how the composer uses techniques to explore the theme of belonging.',
      response: 'The composer employs various literary techniques including metaphor and imagery to explore belonging...',
      grade: 8,
      maxMarks: 10,
      percentage: 80,
      wellDone: ['Good identification of techniques', 'Clear connection to theme'],
      improvements: ['Provide more specific textual evidence', 'Analyse effect on the reader'],
      exampleResponse: 'A strong analysis would identify specific techniques with direct quotes...',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      subject: 'english'
    }
  ],

  // Generate practice questions dynamically
  generatePracticeQuestions(subject, topic, difficulty, type, count = 3) {
    const bank = this.questionBank[subject];
    if (!bank) {
      return this._generateGenericQuestions(subject, topic, difficulty, type, count);
    }

    let questions = [];
    if (topic && bank[topic]) {
      questions = bank[topic].filter(q => {
        const diffMatch = !difficulty || difficulty === 'All' || q.difficulty === difficulty;
        const typeMatch = !type || type === 'All' || q.type === type;
        return diffMatch && typeMatch;
      });
    } else {
      // Pool from all topics
      for (const t of Object.values(bank)) {
        questions.push(...t.filter(q => {
          const diffMatch = !difficulty || difficulty === 'All' || q.difficulty === difficulty;
          const typeMatch = !type || type === 'All' || q.type === type;
          return diffMatch && typeMatch;
        }));
      }
    }

    if (questions.length === 0) {
      return this._generateGenericQuestions(subject, topic, difficulty, type, count);
    }

    return Helpers.shuffle(questions).slice(0, count).map(q => ({
      ...q,
      id: Helpers.uid(),
      subject,
      topic: topic || 'General',
    }));
  },

  _generateGenericQuestions(subject, topic, difficulty, type, count) {
    const subjectData = this.subjects.find(s => s.id === subject);
    const subjectName = subjectData ? subjectData.name : subject;
    const topicName = topic || 'general concepts';
    const questions = [];

    const templates = {
      short: [
        `Define the key terms related to ${topicName} in ${subjectName}.`,
        `Identify three important features of ${topicName}.`,
        `Outline the main concepts covered in ${topicName}.`,
        `Explain the relationship between the key elements of ${topicName}.`,
      ],
      extended: [
        `Discuss the significance of ${topicName} in the context of ${subjectName}. Support your response with relevant examples.`,
        `Evaluate the importance of understanding ${topicName} for students of ${subjectName}.`,
        `Analyse the key principles of ${topicName} and explain how they apply in practice.`,
        `To what extent has ${topicName} shaped modern understanding of ${subjectName}?`,
      ]
    };

    const pool = type === 'extended' ? templates.extended : type === 'short' ? templates.short : [...templates.short, ...templates.extended];
    const marks = type === 'extended' ? Helpers.randomInt(10, 20) : Helpers.randomInt(3, 8);

    for (let i = 0; i < count; i++) {
      questions.push({
        id: Helpers.uid(),
        q: pool[i % pool.length],
        type: type || (i % 2 === 0 ? 'short' : 'extended'),
        marks: marks,
        difficulty: difficulty || 'Standard',
        subject,
        topic: topicName,
      });
    }
    return questions;
  },

  // Get a daily quote
  getDailyQuote() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return this.quotes[dayOfYear % this.quotes.length];
  },

  // Sample study planner events
  samplePlannerEvents: [
    { id: 'ev1', title: 'English Essay Prep', subject: 'english', day: 1, hour: 9, duration: 2 },
    { id: 'ev2', title: 'Maths Practice', subject: 'maths', day: 1, hour: 14, duration: 1.5 },
    { id: 'ev3', title: 'Biology Review', subject: 'biology', day: 2, hour: 10, duration: 1 },
    { id: 'ev4', title: 'Chemistry Lab Notes', subject: 'chemistry', day: 3, hour: 11, duration: 1.5 },
    { id: 'ev5', title: 'History Source Analysis', subject: 'history', day: 4, hour: 15, duration: 2 },
    { id: 'ev6', title: 'English Creative Writing', subject: 'english', day: 5, hour: 9, duration: 1.5 },
    { id: 'ev7', title: 'Maths Exam Practice', subject: 'maths', day: 5, hour: 13, duration: 2 },
  ],

  // Sample resources
  sampleResources: [
    { id: 'r1', name: 'English Essay Guide.pdf', type: 'pdf', subject: 'english', size: '2.4 MB', addedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'r2', name: 'Maths Formula Sheet.pdf', type: 'pdf', subject: 'maths', size: '1.1 MB', addedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'r3', name: 'Biology Diagrams Pack', type: 'image', subject: 'biology', size: '8.5 MB', addedDate: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 'r4', name: 'Chemistry Notes - Bonding', type: 'doc', subject: 'chemistry', size: '560 KB', addedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'r5', name: 'History Timeline Summary', type: 'doc', subject: 'history', size: '340 KB', addedDate: new Date(Date.now() - 86400000 * 1).toISOString() },
  ],
};
