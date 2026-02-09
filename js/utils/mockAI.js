// Mock AI response generators
const MockAI = {
  // Simulate AI delay
  async delay(min = 800, max = 2000) {
    const ms = Helpers.randomInt(min, max);
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Grade a response (MARKER feature)
  async gradeResponse(question, response, maxMarks) {
    await this.delay(1500, 3000);

    const responseLength = response.length;
    const quality = Math.min(1, responseLength / (maxMarks * 40));
    const baseGrade = Math.round(maxMarks * (0.4 + quality * 0.5));
    const grade = Helpers.clamp(baseGrade + Helpers.randomInt(-1, 1), 1, maxMarks);
    const percentage = (grade / maxMarks) * 100;

    const wellDone = [];
    const improvements = [];

    // Generate contextual feedback
    if (responseLength > 50) wellDone.push('You provided a detailed response with good coverage of the topic.');
    if (responseLength > 150) wellDone.push('Strong use of relevant examples and supporting evidence.');
    if (response.includes('because') || response.includes('therefore')) wellDone.push('Good use of causal reasoning and logical connections.');
    if (response.includes('however') || response.includes('although')) wellDone.push('Effective use of counter-arguments showing critical thinking.');
    if (response.includes('example') || response.includes('instance')) wellDone.push('Appropriate use of specific examples to support your arguments.');

    if (wellDone.length === 0) wellDone.push('You attempted to address the question.');

    if (percentage < 90) improvements.push('Consider expanding your response with more specific evidence and examples.');
    if (percentage < 70) improvements.push('Try to structure your response with a clear introduction, body, and conclusion.');
    if (percentage < 80) improvements.push('Include more subject-specific terminology to demonstrate deeper understanding.');
    if (!response.includes('therefore') && !response.includes('thus') && !response.includes('consequently')) {
      improvements.push('Use more linking phrases to improve the flow of your argument.');
    }
    if (responseLength < maxMarks * 30) {
      improvements.push('Your response could benefit from more depth and elaboration on key points.');
    }

    const exampleResponses = [
      `A strong response to this question would begin by clearly defining the key terms and establishing context. The body should present 2-3 well-developed arguments, each supported by specific evidence such as statistics, quotes, or case studies. Each paragraph should link back to the question using topic sentences. The conclusion should synthesize the main points and provide a nuanced final position.`,
      `An ideal response would demonstrate critical analysis by examining multiple perspectives. Start with a clear thesis statement, then develop your argument through well-structured paragraphs. Each point should be supported with evidence and explicitly linked to the question. Consider potential counter-arguments to show depth of understanding. Conclude by evaluating the overall significance of your argument.`,
      `To achieve full marks, your response should show sophisticated understanding of the topic. Begin with context and a clear position. Develop 3-4 key points with specific evidence (dates, names, statistics, quotes where relevant). Analyze rather than just describe - explain WHY and HOW, not just WHAT. Use subject-specific vocabulary consistently. End with a synthesis that addresses the complexity of the question.`
    ];

    return {
      grade,
      maxMarks,
      percentage,
      wellDone,
      improvements,
      exampleResponse: Helpers.randomFrom(exampleResponses),
      timestamp: new Date().toISOString()
    };
  },

  // Break down a question (GUIDE feature)
  async breakdownQuestion(question) {
    await this.delay(1200, 2500);

    // Detect command words
    const commandWords = [];
    const questionLower = question.toLowerCase();
    const commandMap = {
      'analyse': 'Break down the topic into its component parts and examine how they relate to each other.',
      'analyze': 'Break down the topic into its component parts and examine how they relate to each other.',
      'evaluate': 'Make a judgment based on criteria; weigh up strengths and limitations.',
      'discuss': 'Present arguments for and against; consider multiple perspectives.',
      'explain': 'Provide detailed account of causes, reasons, or mechanisms.',
      'describe': 'Give a detailed account of features, characteristics, or events.',
      'compare': 'Identify similarities and differences between two or more things.',
      'contrast': 'Focus on the differences between two or more things.',
      'assess': 'Make a judgment about the value, importance, or quality of something.',
      'justify': 'Provide reasons or evidence to support an argument or decision.',
      'outline': 'Provide a brief description of the main features or points.',
      'examine': 'Look at something in detail; investigate thoroughly.',
      'to what extent': 'Consider how far something is true; requires a nuanced position.',
      'define': 'State the precise meaning of a word, term, or concept.',
      'identify': 'Recognise and state the key features or elements.',
    };

    for (const [word, meaning] of Object.entries(commandMap)) {
      if (questionLower.includes(word)) {
        commandWords.push({ word: word.charAt(0).toUpperCase() + word.slice(1), meaning });
      }
    }

    if (commandWords.length === 0) {
      commandWords.push({ word: 'Respond', meaning: 'Address the question directly with a clear, well-structured answer.' });
    }

    // Determine question type and structure
    const isExtended = questionLower.includes('discuss') || questionLower.includes('evaluate') ||
                       questionLower.includes('analyse') || questionLower.includes('to what extent') ||
                       questionLower.includes('assess');
    const isShort = questionLower.includes('define') || questionLower.includes('identify') ||
                    questionLower.includes('outline') || questionLower.includes('list');

    const wordCount = isExtended ? '600-800 words' : isShort ? '100-200 words' : '300-500 words';

    const contentPoints = [
      'Define key terms and concepts mentioned in the question',
      'Provide relevant context and background information',
      'Present your main argument or thesis clearly',
      'Support each point with specific evidence or examples',
      'Consider alternative perspectives or counter-arguments',
      'Link your analysis back to the specific question asked'
    ];

    const structure = isExtended ? [
      { section: 'Introduction', detail: 'Define key terms, provide context, and state your thesis/position (2-3 sentences)' },
      { section: 'Body Paragraph 1', detail: 'First main argument with supporting evidence and analysis' },
      { section: 'Body Paragraph 2', detail: 'Second main argument with supporting evidence and analysis' },
      { section: 'Body Paragraph 3', detail: 'Third argument OR counter-argument with rebuttal' },
      { section: 'Conclusion', detail: 'Synthesize arguments, restate position with nuance, and address broader significance' }
    ] : isShort ? [
      { section: 'Opening', detail: 'Directly address the question with a clear statement' },
      { section: 'Key Points', detail: 'List or briefly explain the main elements' },
      { section: 'Summary', detail: 'Brief concluding statement if needed' }
    ] : [
      { section: 'Introduction', detail: 'Brief context and clear position statement' },
      { section: 'Main Body', detail: 'Develop 2-3 key points with evidence' },
      { section: 'Conclusion', detail: 'Summarize and link back to the question' }
    ];

    const pitfalls = [
      'Not directly addressing the question asked',
      'Writing too descriptively without analysis',
      'Failing to provide specific evidence or examples',
      'Not using subject-specific terminology',
      'Ignoring counter-arguments or alternative viewpoints',
      'Running out of time by spending too long on one section',
      'Not linking paragraphs back to the question'
    ];

    const keyConcepts = [
      'Consider the historical/social context of the topic',
      'Think about cause and effect relationships',
      'Identify the key stakeholders or perspectives involved',
      'Consider short-term vs long-term implications',
      'Look for connections between different aspects of the topic'
    ];

    return {
      commandWords,
      contentPoints: contentPoints.slice(0, isShort ? 3 : 6),
      recommendedLength: wordCount,
      structure,
      pitfalls: Helpers.shuffle(pitfalls).slice(0, 4),
      keyConcepts: keyConcepts.slice(0, isShort ? 2 : 4),
      timestamp: new Date().toISOString()
    };
  },

  // Generate practice questions
  async generateQuestions(subject, topic, difficulty, type, count = 3) {
    await this.delay(1000, 2000);

    const questions = MockData.generatePracticeQuestions(subject, topic, difficulty, type, count);
    return questions;
  },

  // Generate flashcards from notes
  async generateFlashcards(notes, count = 5) {
    await this.delay(1500, 3000);

    const sentences = notes.split(/[.!?\n]/).filter(s => s.trim().length > 15);
    const cards = [];

    for (let i = 0; i < Math.min(count, Math.max(sentences.length, 3)); i++) {
      const sentence = sentences[i] || notes.substring(i * 50, (i + 1) * 50 + 30);
      const words = sentence.trim().split(' ');
      const keyTerm = words.slice(0, Math.min(3, words.length)).join(' ');

      cards.push({
        id: Helpers.uid(),
        front: `What is the significance of ${keyTerm.toLowerCase()}?`,
        back: sentence.trim() || `${keyTerm} is a key concept that relates to the broader topic.`,
        confidence: 0,
        lastReviewed: null,
        nextReview: new Date().toISOString(),
        timesReviewed: 0
      });
    }

    // Add some generic cards based on content
    if (cards.length < count) {
      cards.push({
        id: Helpers.uid(),
        front: 'What are the main themes discussed in these notes?',
        back: `The main themes include: ${sentences.slice(0, 3).map(s => s.trim().split(' ').slice(0, 4).join(' ')).join(', ')}.`,
        confidence: 0,
        lastReviewed: null,
        nextReview: new Date().toISOString(),
        timesReviewed: 0
      });
    }

    return cards.slice(0, count);
  },

  // Get AI suggested focus areas
  getSuggestedFocusAreas(subjectId) {
    const history = Store.get('practiceHistory') || [];
    const subjectHistory = history.filter(h => h.subjectId === subjectId);

    if (subjectHistory.length === 0) {
      return ['Start with foundational topics', 'Practice short answer questions first', 'Review key terminology'];
    }

    const avgScore = subjectHistory.reduce((sum, h) => sum + (h.score || 50), 0) / subjectHistory.length;

    if (avgScore < 60) {
      return ['Focus on understanding core concepts', 'Review key definitions and terms', 'Practice with guided questions'];
    } else if (avgScore < 80) {
      return ['Work on extended response structure', 'Practice applying concepts to new scenarios', 'Focus on analytical writing skills'];
    }
    return ['Challenge yourself with advanced questions', 'Practice under timed conditions', 'Focus on nuanced evaluation skills'];
  }
};
