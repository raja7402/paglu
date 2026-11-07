/**
 * ============================================================================
 * PROJECT PAGLU – THE UNIVERSE
 * CENTRAL PERSONALISATION CONFIGURATION (src/config/pagluConfig.js)
 * ============================================================================
 *
 * Edit this single file to personalise the entire universe:
 *  - Recipient name, playful gate code, and hints
 *  - Photographs (drop images into public/images/memories/ and update URLs below)
 *  - Friendship timeline milestones & memory cards
 *  - Mystery Planet riddles, hidden word, and vault code
 *  - 15 "How Well Do You Know Me?" friendship quiz questions
 *  - Lucky Wheel outcomes
 *  - 7 "Open When..." personal letters
 *  - Dream Planet wishes ("Things I Hope Life Gives You.")
 *  - The Final Destination personal letter & music tracks
 *
 * SECURITY NOTE:
 * The Secret Gate password below is a playful front-end surprise reveal stored
 * in sessionStorage for convenience—it is NOT cryptographic security. Never place
 * sensitive personal data, private keys, or real passwords in frontend code.
 * ============================================================================
 */

export const pagluConfig = {
  // --------------------------------------------------------------------------
  // 1. CORE IDENTITY
  // --------------------------------------------------------------------------
  universeTitle: 'PROJECT PAGLU',
  universeSubtitle: 'THE UNIVERSE',
  tagline: 'One universe. A million little memories. One special person.',
  recipientName: 'Paglu',
  senderSignature: 'Your favourite human.',
  originYear: 2023,

  // --------------------------------------------------------------------------
  // 2. INTRODUCTION – THE UNKNOWN
  // --------------------------------------------------------------------------
  intro: {
    sequenceMessages: [
      'Somewhere beyond the ordinary...',
      'Some worlds are never found by accident.',
      'Somewhere, a universe is waiting.'
    ],
    callToActionPrompt: 'An unexpected journey awaits you.',
    enterButtonLabel: 'ENTER THE UNKNOWN'
  },

  // --------------------------------------------------------------------------
  // 3. SECRET GATE – PLAYFUL SURPRISE PASSWORD
  //    (Playful surprise gate only — not genuine security)
  // --------------------------------------------------------------------------
  passwordGate: {
    password: '2023',
    hint: "The year when this madness probably started. Don't act innocent. 😂",
    headline: 'Not everyone is allowed into this universe.',
    subheadline: "Let's see if you really belong here.",
    placeholder: 'Enter secret cosmic key...',
    unlockButtonLabel: 'UNLOCK THE GATE',
    wrongPasswordResponses: [
      'Nice try, cosmic impostor! That key belongs to a parallel timeline. 🤨',
      'Access denied! Are you really pretending you forgot the year? 😂',
      'The stars just side-eyed that guess. Check the hint if your brain is buffering! ✨',
      'Wrong frequency! Even a wandering asteroid knows better than that. ☄️',
      'Nope! Take a deep breath, stop overthinking, and try a very memorable 4-digit year.'
    ],
    unlockSuccessPrimary: "Well, well... look who's finally here.",
    unlockSuccessSecondary:
      "Welcome to the universe that shouldn't exist... but somehow exists just for you."
  },

  // --------------------------------------------------------------------------
  // 4. AUDIO & MUSIC SYSTEM
  //    Replace files in public/audio/ with your own .mp3 / .wav files anytime.
  // --------------------------------------------------------------------------
  music: {
    defaultVolume: 0.55,
    enableSoundEffects: true,
    tracks: {
      galaxy: {
        title: 'Nebula Drift (Main Cosmic Theme)',
        src: './audio/cosmic-ambient.wav'
      },
      final: {
        title: 'Horizon of Starlight (Final Destination Theme)',
        src: './audio/final-horizon.wav'
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. THE SIX PLANETS OF THE GALAXY
  // --------------------------------------------------------------------------
  planets: [
    {
      id: 'memory',
      order: 1,
      name: 'MEMORY PLANET',
      subtitle: 'Our Little History',
      shortDescription:
        'An orbital museum of photographs, cosmic milestones since 2023, and framed snapshots in time.',
      orbitRadius: 8.2,
      orbitAngle: 0.35,
      orbitSpeed: 0.055,
      size: 1.18,
      verticalOffset: 0.65,
      palette: {
        primary: '#38bdf8',
        secondary: '#f472b6',
        deep: '#0c1c47',
        glow: '#60a5fa',
        ring: '#93c5fd'
      },
      hasRings: true,
      ringTilt: [0.6, 0.2, -0.3],
      moons: 2,
      textureType: 'crystalline'
    },
    {
      id: 'mystery',
      order: 2,
      name: 'MYSTERY PLANET',
      subtitle: 'The Secret Adventure',
      shortDescription:
        'Three ancient celestial trials guarding a hidden chamber—and the seal to the Final Destination.',
      orbitRadius: 11.4,
      orbitAngle: 1.42,
      orbitSpeed: 0.044,
      size: 1.26,
      verticalOffset: -0.75,
      palette: {
        primary: '#a855f7',
        secondary: '#38bdf8',
        deep: '#190933',
        glow: '#c084fc',
        ring: '#a855f7'
      },
      hasRings: true,
      ringTilt: [-0.5, 0.4, 0.35],
      moons: 1,
      textureType: 'arcane'
    },
    {
      id: 'fun',
      order: 3,
      name: 'FUN PLANET',
      subtitle: 'The Playground',
      shortDescription:
        'Three playable cosmic arcade experiences: the 15-question Quiz, Catch the Stars, and the Lucky Wheel.',
      orbitRadius: 14.5,
      orbitAngle: 2.52,
      orbitSpeed: 0.038,
      size: 1.32,
      verticalOffset: 0.9,
      palette: {
        primary: '#22d3ee',
        secondary: '#ec4899',
        deep: '#0e1738',
        glow: '#38bdf8',
        ring: '#f472b6'
      },
      hasRings: true,
      ringTilt: [0.45, -0.3, 0.25],
      moons: 2,
      textureType: 'carnival'
    },
    {
      id: 'letters',
      order: 4,
      name: 'LETTERS PLANET',
      subtitle: 'Messages From Another World',
      shortDescription:
        'Seven starlight-sealed envelopes waiting patiently for every mood, quiet night, and storm.',
      orbitRadius: 17.6,
      orbitAngle: 3.64,
      orbitSpeed: 0.032,
      size: 1.16,
      verticalOffset: -0.6,
      palette: {
        primary: '#f472b6',
        secondary: '#a855f7',
        deep: '#2a0d38',
        glow: '#f9a8d4',
        ring: '#e879f9'
      },
      hasRings: false,
      ringTilt: [0, 0, 0],
      moons: 1,
      textureType: 'roseNebula'
    },
    {
      id: 'dream',
      order: 5,
      name: 'DREAM PLANET',
      subtitle: 'A World of Wishes',
      shortDescription:
        'A serene moonlit sanctuary of drifting nebula clouds, shooting stars, and wishes for your future.',
      orbitRadius: 20.8,
      orbitAngle: 4.72,
      orbitSpeed: 0.027,
      size: 1.24,
      verticalOffset: 0.85,
      palette: {
        primary: '#818cf8',
        secondary: '#38bdf8',
        deep: '#101942',
        glow: '#a5b4fc',
        ring: '#c7d2fe'
      },
      hasRings: true,
      ringTilt: [0.35, 0.15, -0.4],
      moons: 1,
      textureType: 'opalescent'
    },
    {
      id: 'final',
      order: 6,
      name: 'FINAL DESTINATION',
      subtitle: 'The Grand Surprise',
      shortDescription:
        'Beyond the final horizon lies a sacred portal—awakened only after conquering Mystery Planet.',
      orbitRadius: 24.4,
      orbitAngle: 5.75,
      orbitSpeed: 0.021,
      size: 1.52,
      verticalOffset: 0.2,
      palette: {
        primary: '#fbbf24',
        secondary: '#c084fc',
        deep: '#1f103d',
        glow: '#fde68a',
        ring: '#f472b6'
      },
      hasRings: true,
      ringTilt: [0.7, 0.3, -0.2],
      moons: 3,
      textureType: 'singularity',
      requiresMysteryCompletion: true
    }
  ],

  // --------------------------------------------------------------------------
  // 6. MEMORY PLANET – OUR LITTLE HISTORY
  //    All items use clearly marked editable placeholders—replace freely!
  // --------------------------------------------------------------------------
  memoryPlanet: {
    heroTitle: 'Memory Planet',
    heroSubtitle: 'An Archive of Orbits, Chaos & Quiet Moments Since 2023',
    ownerNote:
      'Editable Archive: Replace placeholder images in public/images/memories/ and update titles, dates, and stories in src/config/pagluConfig.js.',

    photoGallery: [
      {
        id: 'photo-1',
        src: './images/memories/memory-1.svg',
        title: '[Editable Placeholder] Where the Orbit Began',
        date: '2023 • Chapter One',
        frameStyle: 'Sapphire Nebula Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Drop in the earliest photograph from 2023 and write the story behind this day.'
      },
      {
        id: 'photo-2',
        src: './images/memories/memory-2.svg',
        title: '[Editable Placeholder] Unfiltered Madness',
        date: '2023 • Candid Archive',
        frameStyle: 'Violet Starlight Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Add a candid photo where nobody was ready for the camera, yet it became an instant classic.'
      },
      {
        id: 'photo-3',
        src: './images/memories/memory-3.svg',
        title: '[Editable Placeholder] Hours That Felt Like Minutes',
        date: '2024 • Golden Orbit',
        frameStyle: 'Rose Horizon Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Perfect spot for a hangout, coffee run, or endless conversation snapshot.'
      },
      {
        id: 'photo-4',
        src: './images/memories/memory-4.svg',
        title: '[Editable Placeholder] Certified Inside Joke',
        date: '2024 • Comedy Vault',
        frameStyle: 'Electric Cyan Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Add a photo that makes zero sense to anyone else in the world except the two of you.'
      },
      {
        id: 'photo-5',
        src: './images/memories/memory-5.svg',
        title: '[Editable Placeholder] A Day Worth Replaying',
        date: '2025 • Starlit Milestone',
        frameStyle: 'Solaris Gold Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Replace with a celebration, trip, or milestone photograph that deserves a permanent frame.'
      },
      {
        id: 'photo-6',
        src: './images/memories/memory-6.svg',
        title: '[Editable Placeholder] Still My Favourite Constellation',
        date: 'Present • Ongoing',
        frameStyle: 'Aurora Prism Frame',
        caption:
          '[Placeholder Caption — Replace in pagluConfig.js] Add your most recent favourite photograph together.'
      }
    ],

    timeline: [
      {
        id: 'tl-1',
        year: '2023',
        category: 'First Meeting',
        title: '[Editable Milestone] The First Crossing of Orbits',
        summary:
          '[Placeholder — Edit in pagluConfig.js] Describe the exact setting, first impression, and how completely ordinary the day looked before everything changed.',
        detail:
          'Personalisation prompt: Where did you first meet Paglu? What did you initially think before realising how chaotic and unforgettable this friendship would become?',
        accent: '#38bdf8'
      },
      {
        id: 'tl-2',
        year: '2023',
        category: 'First Conversations',
        title: '[Editable Milestone] When Small Talk Turned Into Hours',
        summary:
          '[Placeholder — Edit in pagluConfig.js] Capture those early messages or conversations when formalities vanished and genuine wavelength took over.',
        detail:
          'Personalisation prompt: Mention that first long chat, random topic, or unexpected shared interest that sealed the friendship in 2023.',
        accent: '#8b5cf6'
      },
      {
        id: 'tl-3',
        year: '2023 – 2024',
        category: 'Funny Incidents',
        title: '[Editable Milestone] Peak Paglu Madness Unleashed',
        summary:
          '[Placeholder — Edit in pagluConfig.js] Document the funniest disaster, dramatic overreaction, or legendary inside joke you still bring up.',
        detail:
          'Personalisation prompt: Add the story that still makes both of you laugh every single time someone mentions a single keyword from it.',
        accent: '#f472b6'
      },
      {
        id: 'tl-4',
        year: '2024 – 2025',
        category: 'Memorable Moments',
        title: '[Editable Milestone] Through Storms & Quiet Days',
        summary:
          '[Placeholder — Edit in pagluConfig.js] Highlight a meaningful moment when showing up mattered more than words.',
        detail:
          'Personalisation prompt: Write about a proud milestone, a tough week made lighter, or an unexpectedly wholesome day you shared.',
        accent: '#22d3ee'
      },
      {
        id: 'tl-5',
        year: '2025 – Beyond',
        category: 'Special Memories',
        title: '[Editable Milestone] An Entire Universe & Counting',
        summary:
          '[Placeholder — Edit in pagluConfig.js] Celebrate everything built from 2023 to today—and all the chapters yet to be written.',
        detail:
          'Personalisation prompt: Add a note about the present chapter of your friendship and why you built this digital universe for Paglu.',
        accent: '#fbbf24'
      }
    ],

    memoryCards: [
      {
        id: 'mc-1',
        title: '[Editable Card] The Origin Snapshot',
        date: 'Spring 2023',
        tag: 'First Chapter',
        image: './images/memories/memory-1.svg',
        description:
          '[Placeholder Description] Replace with a short 2–3 sentence memory about an early 2023 moment that started it all.'
      },
      {
        id: 'mc-2',
        title: '[Editable Card] Unplanned Comedy Hour',
        date: 'Late 2023',
        tag: 'Funny Incident',
        image: './images/memories/memory-2.svg',
        description:
          '[Placeholder Description] Replace with a short story about a moment when plans went sideways and turned hilarious.'
      },
      {
        id: 'mc-3',
        title: '[Editable Card] Midnight Debriefs',
        date: '2024',
        tag: 'Conversations',
        image: './images/memories/memory-3.svg',
        description:
          '[Placeholder Description] Replace with a favourite memory of talking through life updates, random theories, and big dreams.'
      },
      {
        id: 'mc-4',
        title: '[Editable Card] Legendary Quote Vault',
        date: '2024',
        tag: 'Inside Joke',
        image: './images/memories/memory-4.svg',
        description:
          '[Placeholder Description] Replace with Paglu’s funniest quote or signature dramatic reaction.'
      },
      {
        id: 'mc-5',
        title: '[Editable Card] Core Memory Unlocked',
        date: '2025',
        tag: 'Special Day',
        image: './images/memories/memory-5.svg',
        description:
          '[Placeholder Description] Replace with a favourite outing, celebration, or peaceful hangout.'
      },
      {
        id: 'mc-6',
        title: '[Editable Card] Future Constellation',
        date: 'Always',
        tag: 'Forever Note',
        image: './images/memories/memory-6.svg',
        description:
          '[Placeholder Description] Replace with a warm note about an adventure still on your bucket list together.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. MYSTERY PLANET – THE SECRET ADVENTURE (3 LEVELS + SECRET ROOM)
  // --------------------------------------------------------------------------
  mysteryPlanet: {
    heroTitle: 'Mystery Planet',
    heroSubtitle: 'Conquer Three Celestial Trials to Awaken the Final Portal',

    level1Riddle: {
      title: 'LEVEL 1: THE RIDDLE OF ETERNITY',
      lore: 'An ancient monolith hums in violet light. Answer its riddle to shatter the First Seal.',
      riddle:
        '“I weigh nothing at all, yet I can hold two people together across years and distance. You cannot buy me, rewind me, or touch me with your hands—yet the darker the night gets, the brighter I glow when you look back. What am I?”',
      options: [
        'A shooting meteor',
        'A cherished memory',
        'A pocket watch',
        'A black hole'
      ],
      correctIndex: 1,
      hint: 'Think of what Planet 1 (Our Little History) is dedicated to preserving forever.',
      wrongFeedback:
        'The monolith flickers crimson—look beyond physical objects and think of what stays in the heart.',
      correctFeedback:
        'The First Seal shatters in electric light! Memories outlive time itself.'
    },

    level2HiddenMessage: {
      title: 'LEVEL 2: THE HIDDEN CONSTELLATION MESSAGE',
      lore: 'Move your Astral Scanner across the starfield to illuminate hidden runes, then tap the true letters in order to spell the name at the centre of this universe.',
      targetWord: 'PAGLU',
      clue: '5 letters • The exact VIP recipient this entire universe belongs to.',
      hint: 'Scan slowly across the glowing star clusters to reveal all runes, then select P → A → G → L → U in exact order!',
      decoyLetters: ['Z', 'X', 'Q', 'M', 'K', 'R', 'V'],
      wrongFeedback:
        'Wrong rune sequence! Resetting the constellation alignment—follow the 5 letters of the VIP name.',
      correctFeedback:
        'Constellation aligned! P-A-G-L-U blazes across the nebula. Second Seal unlocked!'
    },

    level3FinalCode: {
      title: 'LEVEL 3: THE FINAL CELESTIAL CODE',
      lore: 'Align the 4-digit Harmonic Vault using clues woven directly into the architecture of this universe.',
      code: '6371',
      clues: [
        '1st Digit: Total floating planets orbiting this 3D galaxy.',
        '2nd Digit: Number of playable mini-games waiting on Fun Planet.',
        '3rd Digit: Number of sealed envelopes waiting on Letters Planet.',
        '4th Digit: Number of special people this universe was built for.'
      ],
      hint: 'Count them: 6 planets, 3 mini-games, 7 envelopes, 1 special person → 6371.',
      wrongFeedback:
        'Vault harmonics rejected! Read each of the four cosmic clues carefully (or tap Hint).',
      correctFeedback:
        'VAULT UNLOCKED! All three Mystery Seals have dissolved into starlight!'
    },

    secretRoom: {
      title: 'THE ASTRAL SANCTUARY — SECRET ROOM UNLOCKED',
      artifactName: 'The Starlight Crest of Paglu',
      secretMessage:
        '[Editable Secret Note — Customize in pagluConfig.js] Look at you solving cosmic riddles like a seasoned space explorer! Completing these three trials has officially awakened the portal to Planet 6: FINAL DESTINATION. Whenever you are ready, step through the Grand Surprise waiting at the edge of the galaxy.',
      unlockBadgeText: 'FINAL DESTINATION PORTAL AWAKENED'
    }
  },

  // --------------------------------------------------------------------------
  // 8. FUN PLANET – THE PLAYGROUND (3 MINI-GAMES)
  // --------------------------------------------------------------------------
  funPlanet: {
    heroTitle: 'Fun Planet',
    heroSubtitle: 'The Cosmic Arcade — Test Your Memory, Reflexes & Starlight Luck',

    // GAME 1: 15 Editable Personalised Friendship Questions
    quizQuestions: [
      {
        id: 1,
        question: '[Editable Q1] What year did this legendary friendship madness officially begin?',
        options: ['2021', '2022', '2023', '1847 (in a past galaxy)'],
        correctIndex: 2,
        funnyRight: 'Correct! 2023 really didn’t know what storm it was unleashing. 😂',
        funnyWrong: 'Excuse me?! That was literally the password to enter this universe!'
      },
      {
        id: 2,
        question: '[Editable Q2 — Customise in pagluConfig.js] What is my go-to comfort order when hungry and indecisive?',
        options: [
          'Good coffee / chai & crispy snacks [Default Correct]',
          'Plain boiled air with ice',
          'A 7-course medieval banquet',
          'Whatever is on someone else’s plate'
        ],
        correctIndex: 0,
        funnyRight: 'Spot on! Culinary telepathy confirmed. ✨',
        funnyWrong: 'Wrong! Swap these options in pagluConfig.js with your real favourite food!'
      },
      {
        id: 3,
        question: '[Editable Q3] When I say "I have quick 2-minute tea/news to tell you", how long does the conversation actually last?',
        options: [
          'Exactly 120.0 seconds',
          'At least 45 minutes with 6 side-quests',
          'Half a text message',
          'We never speak again'
        ],
        correctIndex: 1,
        funnyRight: 'Facts! One story always branches into twelve sub-plots. 😂',
        funnyWrong: 'Please, when has any story ever stayed inside two minutes?!'
      },
      {
        id: 4,
        question: '[Editable Q4 — Customise in pagluConfig.js] Which time of day is my brain actually operating at 100% power?',
        options: [
          '5:00 AM sunrise marathon',
          'Late night when normal humans are asleep [Default Correct]',
          'Monday 8:05 AM sharp',
          'Never, it runs on cosmic screen-saver mode'
        ],
        correctIndex: 1,
        funnyRight: 'Nocturnal genius hours! You know the schedule.',
        funnyWrong: 'Bold of you to assume early-morning alertness exists here!'
      },
      {
        id: 5,
        question: '[Editable Q5] What happens first when something ridiculous happens during the day?',
        options: [
          'Write a formal press release',
          'Immediately send a dramatic update / voice note',
          'Keep it secret for 40 years',
          'Send a carrier pigeon'
        ],
        correctIndex: 1,
        funnyRight: 'Instant live-broadcast energy! Correct!',
        funnyWrong: 'As if dramatic breaking news could wait!'
      },
      {
        id: 6,
        question: '[Editable Q6 — Customise in pagluConfig.js] What is my most predictable habit when stressed?',
        options: [
          'Saying "It’s totally fine" while overthinking 14 scenarios [Default Correct]',
          'Becoming a silent monk in the Himalayas',
          'Skydiving immediately',
          'Deleting the internet'
        ],
        correctIndex: 0,
        funnyRight: 'Caught red-handed in 4K resolution. 😭',
        funnyWrong: 'Too generous! "It’s fine" is always the giveaway.'
      },
      {
        id: 7,
        question: '[Editable Q7] Which planet in this universe holds the 7 mood envelopes?',
        options: [
          'Letters Planet',
          'Tax Return Planet',
          'Broccoli Planet',
          'Homework Planet'
        ],
        correctIndex: 0,
        funnyRight: 'Cosmic navigator status verified! 💌',
        funnyWrong: 'Thankfully Broccoli Planet was banned from this galaxy.'
      },
      {
        id: 8,
        question: '[Editable Q8 — Customise in pagluConfig.js] Which vibe best describes our default communication style?',
        options: [
          'Strictly corporate emails ("Per my last message")',
          '50% roasting, 50% wholesome support [Default Correct]',
          'Morse code via flashlight',
          'Pure awkward silence'
        ],
        correctIndex: 1,
        funnyRight: 'Perfectly balanced, as all chaotic friendships should be!',
        funnyWrong: '"Per my last email" would get both of us kicked out of this galaxy.'
      },
      {
        id: 9,
        question: '[Editable Q9 — Customise in pagluConfig.js] If we were characters in a sci-fi space adventure, what happens in the first 5 minutes?',
        options: [
          'Press the glowing red button labeled DO NOT TOUCH [Default Correct]',
          'Read the 900-page spacecraft manual calmly',
          'Retire peacefully on Mars',
          'File space taxes'
        ],
        correctIndex: 0,
        funnyRight: '100% accurate—curiosity wins every single time! 🚀',
        funnyWrong: 'Nobody is reading a 900-page manual when there is a shiny button right there!'
      },
      {
        id: 10,
        question: '[Editable Q10 — Customise in pagluConfig.js] What weather matches my ideal chill day?',
        options: [
          'Cool breeze, rainy/cloudy skies & good music [Default Correct]',
          '48°C scorching desert noon',
          'Category 4 hailstorm',
          'Humid traffic jam weather'
        ],
        correctIndex: 0,
        funnyRight: 'Elite atmosphere taste! 🌧️✨',
        funnyWrong: '48°C?! Are we trying to melt?!'
      },
      {
        id: 11,
        question: '[Editable Q11] When plans are made weeks in advance, what is the realistic energy level?',
        options: [
          'Military precision down to the millisecond',
          'Spontaneous last-minute chaos somehow turns out better [Default Correct]',
          'Cancelled via carrier owl',
          'Held in a courtroom'
        ],
        correctIndex: 1,
        funnyRight: 'Unplanned chaos undefeated since 2023!',
        funnyWrong: 'Military precision? In THIS friendship?! 😂'
      },
      {
        id: 12,
        question: '[Editable Q12 — Customise in pagluConfig.js] What kind of music / playlist mood hits hardest on a long drive?',
        options: [
          'Nostalgic throwbacks + late-night atmospheric tracks [Default Correct]',
          'Dial-up modem screeching',
          'Alarm clock remix (10-hour loop)',
          'Silence and awkward coughing'
        ],
        correctIndex: 0,
        funnyRight: 'Aux-cord privileges officially granted! 🎧',
        funnyWrong: 'Not the alarm clock remix! Immediate eject button!'
      },
      {
        id: 13,
        question: '[Editable Q13] What is my honest reaction when you actually give good advice?',
        options: [
          'Pretend I didn’t hear it, then quietly agree 10 minutes later [Default Correct]',
          'Write a formal certificate of excellence',
          'Faint dramatically',
          'Argue in Latin'
        ],
        correctIndex: 0,
        funnyRight: 'Okay, okay, don’t let it go to your head! 😂',
        funnyWrong: 'You know full well there’s a mandatory 10-minute stubborn buffer!'
      },
      {
        id: 14,
        question: '[Editable Q14 — Customise in pagluConfig.js] Which superpower would I secretly pick first?',
        options: [
          'Teleportation—zero traffic, instant travel anywhere [Default Correct]',
          'Turning soup slightly lukewarm',
          'Speaking fluently to bricks',
          'Growing fingernails 2% faster'
        ],
        correctIndex: 0,
        funnyRight: 'Zero commute + instant travel = unbeatable!',
        funnyWrong: 'Speaking to bricks?! Check yourself! 😂'
      },
      {
        id: 15,
        question: '[Editable Q15] Who was this entire digital 3D universe painstakingly created for?',
        options: [
          'Random internet strangers',
          'Paglu — the one and only VIP of this galaxy',
          'A wandering alien diplomat',
          'My neighbour’s goldfish'
        ],
        correctIndex: 1,
        funnyRight: 'Obviously YOU, Paglu! Every star in here has your name on it. 💜✨',
        funnyWrong: 'The neighbour’s goldfish wishes it had its own 6-planet solar system!'
      }
    ],

    // GAME 2: Catch The Stars Settings
    catchTheStars: {
      gameDurationSeconds: 45,
      winThreshold: 180,
      instructions:
        'Slide with your finger or mouse (or use Left/Right arrows) to catch falling Golden & Electric Stars! Catch Pink Nebula Hearts for +25 bonus points, and dodge dark Void Meteors that reset your combo streak!'
    },

    // GAME 3: The Lucky Wheel (Covers all 5 required result categories)
    luckyWheelSegments: [
      {
        id: 'w1',
        category: 'A compliment',
        shortLabel: 'Compliment',
        color: '#38bdf8',
        resultText:
          '[Editable Compliment] You have that rare gravity where people genuinely feel lighter, safer, and happier just being around your energy.'
      },
      {
        id: 'w2',
        category: 'A funny challenge',
        shortLabel: 'Challenge',
        color: '#a855f7',
        resultText:
          '[Editable Funny Challenge] Send a completely out-of-context voice note or emoji combo right now and refuse to explain it for 5 minutes! 😂'
      },
      {
        id: 'w3',
        category: 'A secret message',
        shortLabel: 'Secret Msg',
        color: '#ec4899',
        resultText:
          '[Editable Secret Message] Even on days when you think nobody notices how hard you are trying—someone notices, and is quietly cheering for you.'
      },
      {
        id: 'w4',
        category: 'A beautiful memory',
        shortLabel: 'Memory Prompt',
        color: '#6366f1',
        resultText:
          '[Editable Memory Prompt — Customise in pagluConfig.js] Pause for 10 seconds and think back to our funniest unplanned laugh from 2023. Instant mood boost!'
      },
      {
        id: 'w5',
        category: 'A random surprise',
        shortLabel: 'Surprise!',
        color: '#fbbf24',
        resultText:
          '[Editable Random Surprise] GOLDEN COUPON UNLOCKED: Redeemable for one guilt-free favourite snack / coffee treat—no questions asked! ✨'
      },
      {
        id: 'w6',
        category: 'A compliment',
        shortLabel: 'Starlight Praise',
        color: '#22d3ee',
        resultText:
          '[Editable Compliment] Your chaos is elite, your kindness is underrated, and your laugh could brighten a whole blackout.'
      },
      {
        id: 'w7',
        category: 'A funny challenge',
        shortLabel: 'Dare Orbit',
        color: '#8b5cf6',
        resultText:
          '[Editable Funny Challenge] Rate this digital universe out of 10 right now—warning: scores under 11/10 will be appealed to the Galactic Court! ⚖️'
      },
      {
        id: 'w8',
        category: 'A random surprise',
        shortLabel: 'Cosmic Gift',
        color: '#f472b6',
        resultText:
          '[Editable Random Surprise] VIP VETO PASS: You win one automatic victory in our next playful disagreement. Screenshot as proof! 🎟️'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. LETTERS PLANET – 7 MAGICAL ENVELOPES
  //    Uses honest, clearly labelled editable placeholders—no fake memories!
  // --------------------------------------------------------------------------
  lettersPlanet: {
    heroTitle: 'Letters Planet',
    heroSubtitle: 'Seven Sealed Transmissions Waiting Across Time & Moods',
    envelopes: [
      {
        id: 'env-sad',
        order: 1,
        title: "Open when you're sad.",
        sealColor: '#38bdf8',
        moodTag: 'Gentle Shelter',
        salutation: 'Hey Paglu,',
        paragraphs: [
          'Take a slow breath first. You do not have to fix everything in this exact hour, and you do not owe the world a fake smile when your heart feels heavy.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Add your own comforting words, something you truly admire about Paglu’s resilience, or a reminder that they never have to carry tough days alone.]',
          'Even stars have phases where light dims behind nebula clouds—and they are still stars. Be gentle with yourself tonight. Brighter skies always return.'
        ],
        signOff: 'Always in your corner,\nYour favourite human.'
      },
      {
        id: 'env-miss',
        order: 2,
        title: 'Open when you miss someone.',
        sealColor: '#a855f7',
        moodTag: 'Across Any Distance',
        salutation: 'Dear Paglu,',
        paragraphs: [
          'Distance and busy calendars have a funny way of stretching days apart, yet real connections never lose their frequency just because miles or schedules get loud.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Write a warm personal note here reminding Paglu that you are always one message or call away whenever life feels distant.]',
          'Missing someone simply proves that certain people leave real warmth behind. Send a ping anytime—no excuse required.'
        ],
        signOff: 'Just one signal away,\nYour favourite human.'
      },
      {
        id: 'env-angry',
        order: 3,
        title: "Open when you're angry.",
        sealColor: '#f43f5e',
        moodTag: 'Cool the Supernova',
        salutation: 'Whoa there, Supernova Paglu,',
        paragraphs: [
          'First of all: your frustration is valid—go ahead and vent for sixty full seconds before anyone tells you to "calm down" (because nobody in history has ever calmed down from hearing those two words 😂).',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Add a playful inside joke or grounding reminder tailored to Paglu when someone or something tests their patience.]',
          'Drink some water, unclench your jaw, and don’t let temporary chaos steal your peace. Protect your energy—it’s way too valuable.'
        ],
        signOff: 'Team Paglu (mostly),\nYour favourite human.'
      },
      {
        id: 'env-motivation',
        order: 4,
        title: 'Open when you need motivation.',
        sealColor: '#fbbf24',
        moodTag: 'Ignite the Engines',
        salutation: 'Future Legend Paglu,',
        paragraphs: [
          'Pause and look at how much you have already navigated, learned, and survived to stand right where you are today. Doubt is loud, capability is quieter—and you have far more strength than you give yourself credit for.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Mention Paglu’s real goals, talents, or dreams here and remind them why you believe they will pull it off.]',
          'Start with one small step in front of you. You don’t need the entire galaxy mapped out tonight—just keep moving forward.'
        ],
        signOff: 'Cheering from the front row,\nYour favourite human.'
      },
      {
        id: 'env-sleep',
        order: 5,
        title: 'Open when you cannot sleep.',
        sealColor: '#818cf8',
        moodTag: '2:00 AM Starlight',
        salutation: 'Still awake, Paglu?',
        paragraphs: [
          'Late-night thoughts love pretending that every unanswered question in life has to be solved at 2:17 AM. Spoiler: none of those thoughts are trustworthy after midnight.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Add a soothing late-night note, song recommendation, or calm message for restless nights.]',
          'Put tomorrow down for a few hours. Let your shoulders drop, listen to the quiet cosmic hum, and let your mind drift off. Morning can handle the rest.'
        ],
        signOff: 'Goodnight from across the stars,\nYour favourite human.'
      },
      {
        id: 'env-smile',
        order: 6,
        title: 'Open when you need a smile.',
        sealColor: '#f472b6',
        moodTag: 'Instant Spark',
        salutation: 'Hey Paglu — quick reminder:',
        paragraphs: [
          'Someone literally engineered a six-planet interactive 3D solar system with puzzles, arcade games, cosmic fireworks, and secret locks just to see you smile. That is objectively hilarious and elite VIP treatment.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Drop your funniest one-liner, nickname joke, or wholesome compliment guaranteed to crack a smile.]',
          'There it is—don’t pretend you didn’t just smile at the screen right now. Mission accomplished. ✨'
        ],
        signOff: 'Mission Control,\nYour favourite human.'
      },
      {
        id: 'env-whenever',
        order: 7,
        title: 'Open whenever you want.',
        sealColor: '#22d3ee',
        moodTag: 'Timeless Transmission',
        salutation: 'Dear Paglu,',
        paragraphs: [
          'No special occasion needed for this envelope—just an ordinary moment on a random day to remind you that your presence in this world genuinely matters.',
          '[EDITABLE PERSONAL PLACEHOLDER — Customise in src/config/pagluConfig.js: Write an evergreen note of gratitude for your friendship that feels right whether opened tomorrow or five years from now.]',
          'Come back to this universe whenever life feels noisy. Your corner of the cosmos isn’t going anywhere.'
        ],
        signOff: 'Today & always,\nYour favourite human.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 10. DREAM PLANET – A WORLD OF WISHES
  // --------------------------------------------------------------------------
  dreamPlanet: {
    heroTitle: 'Dream Planet',
    heroSubtitle: 'Where Quiet Starlight Carries Every Wish Forward',
    inspirationalBanner:
      'May your skies stay wide enough for your biggest dreams—and gentle enough for your quietest days.',
    wishesSectionTitle: 'Things I Hope Life Gives You.',
    wishes: [
      {
        id: 'wish-1',
        title: 'Unshakable Inner Peace',
        tag: 'Serenity',
        accent: '#38bdf8',
        text: '[Editable Wish — Customise in pagluConfig.js] Mornings where you wake up feeling light, unhurried, and genuinely excited about your own life.'
      },
      {
        id: 'wish-2',
        title: 'Laughter That Hurts Your Ribs',
        tag: 'Joy',
        accent: '#f472b6',
        text: '[Editable Wish — Customise in pagluConfig.js] Countless ridiculous, unscripted moments where you laugh so hard you forget every worry on your list.'
      },
      {
        id: 'wish-3',
        title: 'Doors That Open at the Right Time',
        tag: 'Growth',
        accent: '#fbbf24',
        text: '[Editable Wish — Customise in pagluConfig.js] Opportunities equal to your quiet hard work—and the confidence to walk straight through them.'
      },
      {
        id: 'wish-4',
        title: 'People Who Match Your Sincerity',
        tag: 'Kindred Spirits',
        accent: '#a855f7',
        text: '[Editable Wish — Customise in pagluConfig.js] Spaces where you never have to shrink yourself, explain your heart, or second-guess where you stand.'
      },
      {
        id: 'wish-5',
        title: 'Courage Beyond Self-Doubt',
        tag: 'Bravery',
        accent: '#22d3ee',
        text: '[Editable Wish — Customise in pagluConfig.js] That every time fear whispers "what if it fails?", an even steadier voice answers "what if it flies?"'
      },
      {
        id: 'wish-6',
        title: 'Soft Landings After Long Weeks',
        tag: 'Comfort',
        accent: '#818cf8',
        text: '[Editable Wish — Customise in pagluConfig.js] Good music, warm tea, peaceful skies, and the rare luxury of resting without guilt.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 11. FINAL DESTINATION – THE GRAND SURPRISE
  // --------------------------------------------------------------------------
  finalDestination: {
    portalTitle: 'THE FINAL HORIZON',
    portalSubtitle:
      'All three Mystery Seals are broken. Step through the astral singularity when you are ready.',
    portalButtonLabel: 'OPEN THE FINAL PORTAL',

    openingLineOne: 'Out of all the places in this endless universe...',
    openingLineTwo: 'Somehow, this little corner was created just for you.',

    letterHeadline: 'To Paglu — At the Edge of Our Digital Universe',
    letterParagraphs: [
      'If you have made it all the way here—past the secret gate of 2023, across spinning worlds, through cosmic riddles and hidden constellations—then welcome to the heart of Project Paglu.',
      '[EDITABLE PERSONAL LETTER — Paragraph 1: Open src/config/pagluConfig.js and write from the heart about what inspired you to create this universe for Paglu, and what their friendship has meant since 2023.]',
      '[EDITABLE PERSONAL LETTER — Paragraph 2: Share the qualities you appreciate most about Paglu—their humour, warmth, resilience, chaotic energy, or the way they make ordinary days memorable.]',
      '[EDITABLE PERSONAL LETTER — Paragraph 3: Add your personal wishes for the chapters ahead, reminding Paglu that no matter where life’s orbits lead next, this corner of the universe will always belong to them.]',
      'Thank you for every laugh, every unfiltered conversation, and every bit of madness along the way.'
    ],

    closingLines: [
      'Some people make the world a little brighter just by existing.',
      'Never forget how special you are.',
      'With lots of madness and memories...',
      'Your favourite human.'
    ]
  }
};

export default pagluConfig;
