/**
 * Arabic Course — Main JavaScript
 * Handles navigation highlighting, smooth scrolling, header animations, and sidebar toggle
 */

(function() {
  'use strict';

  let lastScrollTop = 0;
  let scrollTimeout = null;

  /**
   * Automatically highlight the active navigation link based on current page
   */
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar a');
    
    navLinks.forEach(link => {
      // Remove active class from all links
      link.classList.remove('active');
      
      // Get the href and extract filename
      const href = link.getAttribute('href');
      const linkPage = href.split('/').pop();
      
      // Match current page to link
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Smooth scroll to anchor links within the same page
   */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip empty hash links
        if (href === '#' || href === '') {
          return;
        }
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Header is now always at fixed collapsed height - no scroll behavior needed
   * Title is always visible
   */
  function initHeaderScroll() {
    // Header is now always at fixed height, no dynamic behavior needed
    // This function kept for potential future use
  }


  /**
   * Initialize collapsible sidebar toggle
   */
  function initSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const page = document.querySelector('.page');
    
    if (!sidebarToggle || !sidebar) return;

    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      sidebar.classList.toggle('collapsed');
      if (page) {
        page.classList.toggle('sidebar-collapsed');
      }
      
      // Update button icon
      const isOpen = sidebar.classList.contains('open');
      sidebarToggle.textContent = isOpen ? '✕' : '☰';
      sidebarToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
          sidebar.classList.remove('open');
          sidebar.classList.add('collapsed');
          if (page) page.classList.add('sidebar-collapsed');
          sidebarToggle.textContent = '☰';
        }
      }
    });
  }

  /**
   * Self-paced learning support data for each module
   */
  const weekSupportData = {
    'index.html': {
      theme: 'Alphabet & Script Foundations',
      keyTasks: [
        'letter recognition sprints',
        'sound-to-script mapping',
        'handwriting confidence'
      ],
      deliverable: 'a complete alphabet + vowel chart annotated with articulation notes',
      stretch: 'daily micro-calligraphy copywork or a recording explaining articulation points',
      mastery: [
        'Write all 28 isolated letters from memory with consistent proportions.',
        'Track audio recitation while following along in script without transliteration.',
        'Explain the difference between short and long vowels using your own words.'
      ],
      project: {
        title: 'Script Confidence Portfolio',
        summary: 'Document how your handwriting improves across the week.',
        steps: [
          'Photograph or scan Day 1 vs Day 5 letter rows.',
          'Annotate each sample with notes on articulation points and pen lifts.',
          'Record a 60-second narration describing what changed.'
        ],
        share: 'Combine the visuals and audio into a single slide or PDF to revisit later.'
      },
      reflection: 'Which articulation points still feel uncertain, and how will you rehearse them tomorrow?'
    },
    'week2.html': {
      theme: 'Connected Script, Vowels & Pronouns',
      keyTasks: [
        'letter-connection drills',
        'hamza spotting habits',
        'pronoun-powered sentence frames'
      ],
      deliverable: 'a connected-script reference sheet plus a mini pronoun deck',
      stretch: 'write a short self-introduction entirely in connected script without vowels',
      mastery: [
        'Write any eight letters in initial, medial, and final forms without checking a chart.',
        'Label hamza placement in at least ten words you encounter this week.',
        'Say and write seven core pronouns with a matching example sentence.'
      ],
      project: {
        title: 'Pronoun & Hamza Tracker',
        summary: 'Map how pronouns change sentence endings while marking hamza forms.',
        steps: [
          'Create a two-column page: pronoun plus sample verb.',
          'Underline every hamza and note why it sits on that seat.',
          'Record yourself reading the table twice - once slowly and once at a natural pace.'
        ],
        share: 'Pin the tracker near your study area and update it daily.'
      },
      reflection: 'Which letter connection or hamza seat catches you most often, and what cue will remind you to pause there?'
    },
    'week3.html': {
      theme: 'Introductions & Small Talk',
      keyTasks: [
        'core vocabulary loops',
        'introduction writing',
        'listening shadowing'
      ],
      deliverable: 'a polished introduction paragraph plus recorded dialogue practice',
      stretch: 'host a mock conversation where you switch roles and improvise follow-up questions',
      mastery: [
        'Introduce yourself (name, origin, residence, occupation) without notes.',
        'Ask and answer ما اسمك؟ من أين أنت؟ كيف حالك؟ confidently.',
        'Maintain a personal phrase bank of 40 items with Arabic script and meaning.'
      ],
      project: {
        title: 'First Conversation Kit',
        summary: 'Design prompts, answers, and audio to rehearse greetings.',
        steps: [
          'Write both sides of a six-turn dialogue (speaker A and speaker B).',
          'Highlight pronunciation reminders above tricky words.',
          'Record both roles and note time stamps where you hesitate.'
        ],
        share: 'Send the audio to a peer or future you for comparison in Week 10.'
      },
      reflection: 'Which part of your Arabic introduction feels least automatic, and how can you recycle it daily?'
    },
    'week4.html': {
      theme: 'Present Tense & Daily Routines',
      keyTasks: [
        'prefix pattern mapping',
        'daily verb banks',
        'spoken paragraph rehearsal'
      ],
      deliverable: 'a conjugation dashboard covering ten verbs across I/you/he/she/we',
      stretch: 'narrate your entire morning routine without switching to English',
      mastery: [
        'Conjugate five high-frequency verbs without checking notes.',
        'Write and read a six-sentence routine paragraph smoothly.',
        'Hear present-tense verbs in short audio clips and jot them down correctly.'
      ],
      project: {
        title: 'Routine Systems Map',
        summary: 'Visualize your day using present-tense sentences and icons.',
        steps: [
          'Sketch a timeline with five anchor moments.',
          'Attach an Arabic sentence plus verb highlight to each moment.',
          'Record a voiceover walking through the timeline.'
        ],
        share: 'Post the map near your desk for quick audio shadowing.'
      },
      reflection: 'Where do you still mix up prefixes, and what trigger will help you slow down before writing?'
    },
    'week5.html': {
      theme: 'Reading Basics & Text Confidence',
      keyTasks: [
        'chunking practice',
        'annotation habits',
        'decoding aloud'
      ],
      deliverable: 'a marked-up reading spread with vocabulary margin notes',
      stretch: 'rewrite a short text in your own words while keeping key facts',
      mastery: [
        'Apply chunking marks to any six-line beginner passage.',
        'Identify every sun versus moon letter in a reading selection.',
        'Summarize a paragraph with three bullet points in English or Arabic.'
      ],
      project: {
        title: 'Reading Lab Notebook',
        summary: 'Document before-and-after comprehension for two passages.',
        steps: [
          'Capture a short text and annotate unknown words.',
          'Write a mini glossary plus prediction versus actual meaning.',
          'Record yourself reading the passage twice to track fluency.'
        ],
        share: 'Compile the pages into a PDF you can revisit during Week 14 review.'
      },
      reflection: 'Which annotation mark helps you stay calm when the text feels dense?'
    },
    'week6.html': {
      theme: 'Listening Skills & Dictation',
      keyTasks: [
        'micro-dictation reps',
        'shadowing bursts',
        'listening logs'
      ],
      deliverable: 'a listening log with timestamps, comprehension notes, and vocabulary extractions',
      stretch: 'transcribe a 60-second slow audio clip and compare it to the original',
      mastery: [
        'Catch familiar words the first time in Level 1 audio.',
        'Complete three dictation drills with two or fewer spelling errors each.',
        'Describe what helped you fix missed sounds after replaying.'
      ],
      project: {
        title: 'Listening Dashboard',
        summary: 'Centralize sources, timestamps, and actionable next steps.',
        steps: [
          'Set up a table with columns for source, minute mark, and percent understood.',
          'Add a "next focus sound" column after each session.',
          'Annotate improvement trends at the end of the week.'
        ],
        share: 'Convert the dashboard into a chart for Week 12 speaking practice.'
      },
      reflection: 'Which consonant clusters disappear when people speak fast, and how will you train your ear for them?'
    },
    'week7.html': {
      theme: 'Midterm Review & Integration',
      keyTasks: [
        'spiral review sessions',
        'mixed-skill checkpoints',
        'exam simulation'
      ],
      deliverable: 'a personal review map covering Weeks 1-6 with check marks for mastery',
      stretch: 'run a full 45-minute mock midterm with timing and grading',
      mastery: [
        'Cycle through the entire alphabet and vowel rules without hesitation.',
        'Switch between present tense, pronouns, and introductions seamlessly.',
        'Score at least 80 percent on your self-made mixed-skills quiz.'
      ],
      project: {
        title: 'Midterm Control Room',
        summary: 'Design a board or chart tracking every competency.',
        steps: [
          'List each week\'s outcomes as cards.',
          'Move cards to "secure," "needs reps," or "revisit later."',
          'Attach artifacts (audio, photos, quizzes) as evidence.'
        ],
        share: 'Use the board as proof of readiness before taking the real exam.'
      },
      reflection: 'Which competency drops fastest when you are under pressure, and how will you rehearse it deliberately?'
    },
    'week8.html': {
      theme: 'Past Tense & Narratives',
      keyTasks: [
        'suffix automation',
        'present-to-past conversion',
        'story sequencing'
      ],
      deliverable: 'a past tense conjugation sheet paired with a six-line narrative',
      stretch: 'craft a mini podcast episode retelling yesterday in Arabic',
      mastery: [
        'Conjugate seven verbs in past tense for I/you/he/she/we from memory.',
        'Transform a present-tense paragraph to past tense with two or fewer errors.',
        'Use time markers such as أمس or الساعة to order events clearly.'
      ],
      project: {
        title: 'Yesterday\'s Journal',
        summary: 'Capture audio and text reflections about one meaningful day.',
        steps: [
          'Outline four events with bullet verbs first.',
          'Write the narrative in Arabic, highlighting suffixes.',
          'Record yourself reading it, then annotate any hesitations.'
        ],
        share: 'Archive the journal for comparison with Week 11 future storytelling.'
      },
      reflection: 'Which past-tense ending slows you down, and what chant or drill will cement it?'
    },
    'week9.html': {
      theme: 'Travel Arabic & Situational Language',
      keyTasks: [
        'functional phrase banks',
        'role-play menus',
        'survival listening'
      ],
      deliverable: 'a travel scenario toolkit covering airport, transportation, and lodging',
      stretch: 'simulate a full travel day entirely in Arabic cues',
      mastery: [
        'Handle greetings and basic logistics questions without English prompts.',
        'Produce ten travel-related requests using correct politeness forms.',
        'Decode essential signage or announcements from curated clips.'
      ],
      project: {
        title: 'Travel Deck Builder',
        summary: 'Create flashcards or slides for four scenarios plus sample dialogues.',
        steps: [
          'Select contexts such as airport, taxi, cafe, and hotel.',
          'Write a short dialogue plus key vocabulary for each.',
          'Record scenario role-plays and log confidence levels.'
        ],
        share: 'Print or store the deck for your next trip or conversation partner.'
      },
      reflection: 'Where would you freeze first when traveling, and how can you rehearse that script daily?'
    },
    'week10.html': {
      theme: 'Descriptions & Adjectives',
      keyTasks: [
        'noun-adjective agreement drills',
        'sensory vocabulary expansion',
        'descriptive writing aloud'
      ],
      deliverable: 'a description bank covering people, places, and objects',
      stretch: 'record a mini audio tour describing your favorite space in Arabic',
      mastery: [
        'Match gender and number agreement in ten adjective phrases.',
        'Describe a person, place, and object with three sentences each.',
        'Use at least five new descriptors from Al-Kitaab Lesson 3.'
      ],
      project: {
        title: 'Description Gallery',
        summary: 'Curate photos and describe them in Arabic captions.',
        steps: [
          'Choose four images featuring people or places.',
          'Write two to three sentence captions in Arabic with highlighted adjectives.',
          'Record narrations describing each image.'
        ],
        share: 'Compile the captions into a slideshow to revisit in Week 12.'
      },
      reflection: 'Which agreement pattern still surprises you, and where can you post a reminder?'
    },
    'week11.html': {
      theme: 'Future Tense & Planning Language',
      keyTasks: [
        'prefix swaps for future markers',
        'timeline planning',
        'spoken commitments'
      ],
      deliverable: 'a future-week planner written entirely in Arabic',
      stretch: 'host a planning monologue outlining goals for next month',
      mastery: [
        'Use سـ or سوف plus present tense without dropping vowels.',
        'Write eight sentences about future plans covering school, travel, and routines.',
        'Convert past or present sentences into future versions accurately.'
      ],
      project: {
        title: 'Future Vision Board',
        summary: 'Blend visuals and Arabic sentences describing near-term goals.',
        steps: [
          'Map three categories such as study, wellbeing, and relationships.',
          'Attach future sentences to each category using connectors.',
          'Record a pep talk describing the board.'
        ],
        share: 'Keep the board visible so you rehearse the sentences daily.'
      },
      reflection: 'What cue will remind you to pronounce سوف fully instead of rushing it?'
    },
    'week12.html': {
      theme: 'Opinions & Arguments',
      keyTasks: [
        'because/so connectors',
        'opinion sentence frames',
        'supporting evidence hunts'
      ],
      deliverable: 'a mini essay expressing two opinions with reasons',
      stretch: 'debate yourself by recording pro and con takes on one topic',
      mastery: [
        'Use phrases such as أعتقد أن and برأيي correctly in context.',
        'Link opinions with reason clauses using لأنّ or لذلك.',
        'Summarize someone else\'s opinion before giving your own.'
      ],
      project: {
        title: 'Opinion Audio Journal',
        summary: 'Create daily 90-second voice notes arguing for or against small topics.',
        steps: [
          'Choose a theme such as music, study habits, or travel.',
          'Brainstorm three sentence frames: opinion, reason, and counterpoint.',
          'Record and transcribe each note, highlighting connectors.'
        ],
        share: 'Build a playlist of entries to revisit for Week 15 speaking prep.'
      },
      reflection: 'Which connector do you overuse, and what fresh synonym can you adopt?'
    },
    'week13.html': {
      theme: 'Media Arabic & Information Literacy',
      keyTasks: [
        'headline decoding',
        'keyword harvesting',
        'summarizing news bites'
      ],
      deliverable: 'a media log comparing two short articles or podcasts',
      stretch: 'translate and voice a 60-second news brief for classmates',
      mastery: [
        'Identify person, place, and time information in headlines without reading the full article.',
        'Collect 15 media vocabulary items with roots and meanings.',
        'Summarize a short news clip in four Arabic sentences.'
      ],
      project: {
        title: 'Media Monitoring Board',
        summary: 'Track topics, sources, and linguistic gains from media exposure.',
        steps: [
          'Select two beginner-friendly news sources (audio or text).',
          'Log date, topic, and new vocabulary per piece.',
          'Write a comparison note on tone or viewpoint.'
        ],
        share: 'Use the board to choose review materials for Week 14.'
      },
      reflection: 'What type of headline hooks you quickest, and how can you leverage that interest for vocabulary recycling?'
    },
    'week14.html': {
      theme: 'Comprehensive Review & Personal Proof',
      keyTasks: [
        'gap analysis',
        'spiral playlists',
        'assessment rehearsal'
      ],
      deliverable: 'a mastery ledger covering each course outcome with evidence links',
      stretch: 'teach a 10-minute mini-lesson summarizing one topic to someone else',
      mastery: [
        'Document proof for every Week 1-13 objective.',
        'Complete at least two mixed-skills practice sets under timed conditions.',
        'Articulate your top three strengths and next-focus areas in Arabic and English.'
      ],
      project: {
        title: 'Review Control Journal',
        summary: 'Build a binder that pairs checklists with audio and writing samples.',
        steps: [
          'Create tabs for Script, Grammar, Skills, and Culture.',
          'Insert best artifacts and note what grade you would give yourself.',
          'Write a plan for the final based on the gaps you see.'
        ],
        share: 'Bring the journal into Week 15 so you can review efficiently.'
      },
      reflection: 'Which weakness can you remove entirely this week, and what daily micro-task guarantees it?'
    },
    'week15.html': {
      theme: 'Final Exam & Showcase',
      keyTasks: [
        'exam rehearsal routines',
        'performance mindset prep',
        'portfolio curation'
      ],
      deliverable: 'a final showcase packet with writing sample, audio, and reflection',
      stretch: 'simulate exam speaking and writing sections twice before test day',
      mastery: [
        'Complete a full-length mock final with pacing notes.',
        'Assemble best work samples demonstrating each skill area.',
        'Write a final reflection on how your Arabic identity has evolved.'
      ],
      project: {
        title: 'Final Portfolio Capsule',
        summary: 'Curate polished artifacts and reflections to conclude the course.',
        steps: [
          'Select your strongest script, grammar, reading, listening, and speaking artifacts.',
          'Write curator notes explaining why each shows mastery.',
          'Record a farewell message summarizing learning highlights.'
        ],
        share: 'Submit or archive the capsule as proof of completion.'
      },
      reflection: 'What ritual will calm you before assessments so you can access everything you have built?'
    }
  };

  /**
   * Helper to create a DOM element with optional class and text
   * @param {string} tag
   * @param {string} className
   * @param {string} text
   */
  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (text) {
      el.textContent = text;
    }
    return el;
  }

  /**
   * Render the self-paced study tracks card
   */
  function renderTracksCard(data) {
    const card = createElement('div', 'module-card self-paced-card');
    card.appendChild(createElement('div', 'label', 'Self-Paced Study Tracks'));

    const subtitle = createElement(
      'p',
      'self-paced-subtitle',
      `Choose the rhythm that keeps ${data.theme.toLowerCase()} moving without burnout.`
    );
    card.appendChild(subtitle);

    const grid = createElement('div', 'self-paced-grid');
    const tracks = [
      {
        title: 'Momentum Track',
        duration: '3 x 40 min',
        focus: `Laser-focus on ${data.keyTasks[0]} and ${data.keyTasks[1]} until they feel automatic.`,
        outcome: `Proof: ${data.mastery[0]}`
      },
      {
        title: 'Guided Track',
        duration: '4 x 60 min',
        focus: `Cycle through ${data.keyTasks.join(', ')} each session.`,
        outcome: `Wrap with ${data.deliverable}.`
      },
      {
        title: 'Immersion Track',
        duration: '5 x 60+ min',
        focus: `Add extended practice plus ${data.stretch}.`,
        outcome: `Publish or share your ${data.project.title}.`
      }
    ];

    tracks.forEach(track => {
      const trackCard = createElement('article', 'self-paced-track');
      trackCard.appendChild(createElement('h4', '', track.title));
      trackCard.appendChild(createElement('p', 'track-duration', track.duration));
      trackCard.appendChild(createElement('p', '', track.focus));
      trackCard.appendChild(createElement('p', 'track-outcome', track.outcome));
      grid.appendChild(trackCard);
    });

    card.appendChild(grid);
    return card;
  }

  /**
   * Render the autonomy toolkit card
   */
  function renderAutonomyCard(data) {
    const card = createElement('div', 'module-card self-paced-card');
    card.appendChild(createElement('div', 'label', 'Self-Direction Toolkit'));

    const list = createElement('ol', 'autonomy-list');
    const steps = [
      {
        title: 'Plan Inputs',
        detail: `Block time specifically for ${data.keyTasks[0]} and ${data.keyTasks[1]}. Write the sessions in your planner before the week begins.`
      },
      {
        title: 'Monitor Evidence',
        detail: `Use a two-column log: wins and friction. Highlight whenever ${data.keyTasks[2]} feels shaky so you can address it next session.`
      },
      {
        title: 'Reflect & Adjust',
        detail: data.reflection
      }
    ];

    steps.forEach(step => {
      const item = createElement('li', 'autonomy-step');
      item.appendChild(createElement('span', 'autonomy-step__title', step.title));
      item.appendChild(createElement('p', '', step.detail));
      list.appendChild(item);
    });

    card.appendChild(list);
    card.appendChild(createElement('div', 'reflection-pill', `Self-coaching prompt: ${data.reflection}`));
    return card;
  }

  /**
   * Render mastery benchmarks card
   */
  function renderMasteryCard(data) {
    const card = createElement('div', 'module-card self-paced-card');
    card.appendChild(createElement('div', 'label', 'Mastery Benchmarks'));

    const list = createElement('ul', 'mastery-list');
    data.mastery.forEach(item => {
      list.appendChild(createElement('li', '', item));
    });

    card.appendChild(list);
    return card;
  }

  /**
   * Render independent project card
   */
  function renderProjectCard(data) {
    const card = createElement('div', 'module-card self-paced-card');
    card.appendChild(createElement('div', 'label', 'Independent Project Idea'));

    card.appendChild(createElement('h4', '', data.project.title));
    card.appendChild(createElement('p', '', data.project.summary));

    const stepsList = createElement('ul', 'project-steps');
    data.project.steps.forEach(step => {
      stepsList.appendChild(createElement('li', '', step));
    });
    card.appendChild(stepsList);

    card.appendChild(createElement('p', 'project-share', data.project.share));
    return card;
  }

  /**
   * Inject the self-paced sections into each weekly page
   */
  function injectSelfPacedSupport() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const data = weekSupportData[currentPage];
    const page = document.querySelector('.page');

    if (!data || !page) {
      return;
    }

    const insertionTarget = page.querySelector('.module-card--highlight');
    const fragment = document.createDocumentFragment();

    fragment.appendChild(renderTracksCard(data));
    fragment.appendChild(renderAutonomyCard(data));
    fragment.appendChild(renderMasteryCard(data));
    fragment.appendChild(renderProjectCard(data));

    if (insertionTarget && insertionTarget.parentNode) {
      insertionTarget.parentNode.insertBefore(fragment, insertionTarget.nextSibling);
    } else {
      page.appendChild(fragment);
    }
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    highlightActiveNav();
    initSmoothScroll();
    initHeaderScroll();
    initSidebarToggle();
    injectSelfPacedSupport();
    initScrollPersistence();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

