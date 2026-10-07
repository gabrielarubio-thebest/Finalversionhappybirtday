/* =====================================================================
   🪅 BOSS BIRTHDAY SURVIVAL — EDITABLE CONTENT
   ---------------------------------------------------------------------
   Everything the player READS lives in this file.
   Change names, jokes, punchlines and team messages here.
   You don't need to touch game.js to personalise the game.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. WHO IS THIS FOR?
   --------------------------------------------------------------------- */
const PERSON = {
  name: "Laura",              // her name (used everywhere as {name})
  role: "Project Manager",    // her job title
  nickname: "Big Boss",       // used in the final message
  teamName: "The Team",       // signature at the end
  chatAppName: "WorkChat",    // fake chat app name (deliberately NOT Teams)
};

/* ---------------------------------------------------------------------
   2. TEAM MESSAGES (shown at the very end, after the Edinburgh missions)
   Use backticks so line breaks are kept. Add or remove entries freely.
   --------------------------------------------------------------------- */
const TEAM_MESSAGES = [
  { from: "Santi", text: `Lauuuu, happy birthday! I hope all your dreams and goals continue to come true, that you’re having a really lovely day, and that this new year brings you plenty of success and blessings. Sending you a big, rib-crushing hug.` },
  { from: "Valen Zabala", text: `Heey Lau!
Hope you’re having an amazing day! Keep shining and spreading your wings toward the brightest future.
Wishing you the happiest birthday! Hope this new year brings you endless reasons to smile, grow, and celebrate` },
  { from: "Valen Monar", text: `Heyy Lauu!
Happy birthday!! I hope you’re having a really good day and enjoying it loads! I wish you a year full of fun, new adventures, and lots of happy moments.
I hope everything you’ve been wishing for and working towards comes your way, and that this new chapter brings you lots of good things. You deserve all the happiness in the world and so much more!` },
  { from: "Catalina", text: `Laurisss, happy birthday! 🥹 Thank you for being such an unconditional friend, for always being there for me, and for always listening. I miss you so much, and I really hope we can see each other again soon.
I hope this new trip around the sun brings you so many beautiful things, lots of happiness, love, and wonderful moments. You deserve it all! ✨` },
  { from: "Henry", text: `Happy happy birthday lau!! Have the best day and I hope Steven doesn’t give you too many tasks to celebrate 🥳 I know you’ll enjoy Edinburgh so my challenge is that you see at least one sunset and one sunrise from Calton Hill ! Best views in the city 🌆` },
  { from: "Sofi", text: `Mi Lau! Happy birthday✨🤍🌞 Hope you have a day as amazing as you are. Wishing you all the love, happiness and abundance.
Keep spreading the joy you carry within you. Edinburgh is lucky to have you. Miss you everyday.` },
  { from: "Carlos", text: `Hi Lauuu! Happy birthday to you!!! 🤩🥳

On this very special day, I’d like to wish you every blessing and every success. I know you’re far away, but I want to celebrate your special day in such a way that we can all make you feel close to us. On a personal note, you’ve been a really good friend and colleague. I never would have thought that when I joined the Change bootcamp with Banco Agrario, we’d end up working together. I remember very well that you were the host of the first workshop I attended xD. I’m so glad that you’re in Edinburgh today, fulfilling one of your dreams; I sincerely hope that this is just the start of many more to come. We miss you (especially Eleine, or however you spell it)! Happy birthday :)` },
  { from: "Pedro", text: `Vaneeessa! (You might not know this, but she once told me she prefers Vanessa over Laura, haha fun fact).
You’re like a Hogwarts student’s trunk... meaning you’re full of surprises! 😅✨ You have a great personality and such a kind nature. We all know you’re going to be super happy in Edinburgh, so enjoy it to the fullest—explore and discover that world (full of castles, just like in Harry Potter).
Ah... and Happy birthday!! 🎉🎉🎉🥳🥳🥳` },
];

/* ---------------------------------------------------------------------
   3. OPENING SCENE
   --------------------------------------------------------------------- */
const OPENING = {
  title: "BOSS BIRTHDAY SURVIVAL",
  subtitle: "Can you survive your own birthday?",
  bootButton: "Log in to work 💻",
  clock: "09:00 AM",
  normalDay: "Another completely normal day at work...",
  notifTitle: "💬 New notification",
  notifText: "You have a meeting.",
  reveal: [
    { text: "WAIT.", big: true, pause: 900 },
    { text: "This isn't a meeting.", pause: 1100 },
    { text: "...", pause: 900 },
    { text: "It's your birthday. 🎂", big: true, pause: 1300 },
    { text: "And unfortunately...", pause: 1000 },
    { text: "you have been assigned a mission.", pause: 600 },
  ],
  startButton: "START MISSION 🪅",
};

/* ---------------------------------------------------------------------
   4. STORY LEVELS (the inside jokes)
   --------------------------------------------------------------------- */
const STORY = {
  ignored: {
    title: "The Ignored Request",
    channel: "#team-general",
    teammates: [
      { name: "Teammate #1", statuses: ["🟢 Active", "🔴 In a meeting", "🔴 Presenting (to nobody)", "⚫ Appear offline"] },
      { name: "Teammate #2", statuses: ["🟢 Active", "🟡 Away", "🔴 Focusing (very hard)", "✈️ Out of office (emotionally)"] },
      { name: "Teammate #3", statuses: ["🟢 Active", "🔴 Do not disturb", "🔴 Lunch (since 11:02)", "🫥 Has left the building"] },
      { name: "Teammate #4", statuses: ["🟢 Active", "🟢 Active", "🟡 Pretending to read", "🔴 Suddenly very busy"] },
    ],
    messages: [
      "Hey! Can someone help me with this?",
      "Hello...? 👀",
      "Just checking if anyone saw this.",
    ],
    seenBy: "Seen by 4 ✓✓",
    povTitle: "POV:",
    povText: "You asked the team for something.",
    povText2: "Everyone has suddenly become extremely busy.",
    pinataText: "Fine. Break the piñata yourself.",
    win1: "YOU GOT A RESPONSE!",
    win2: "...",
    win3: "3 BUSINESS DAYS LATER.",
  },

  microwave: {
    title: "The Microwave Incident",
    clock: "09:47 AM",
    setup1: "Just heating something up.",
    setup2: "What could possibly go wrong?",
    startButton: "START ▶",
    report: {
      title: "INCIDENT REPORT #001",
      rows: [
        ["Cause of explosion", "unknown."],
        ["Suspect", "🥚 THE EGG"],
        ["Responsible party", "👀 {name}"],
      ],
      stamp: "CLASSIFIED",
    },
    evidence: "We need to destroy the evidence.",
    pinataText: "BREAK THE EVIDENCE",
    win1: "Evidence successfully destroyed.",
    win2: "We will never speak of this again.",
  },

  edinburgh: {
    title: "The Edinburgh Knife Incident",
    shopTitle: "EDINBURGH SHOPPING SIMULATOR",
    objective: "Objective: Buy a knife.",
    items: [
      { emoji: "🧣", name: "Tartan scarf", price: "£24", decoy: "Cosy. But not the objective." },
      { emoji: "🦄", name: "Unicorn plush", price: "£12", decoy: "Scotland's national animal. Still not a knife." },
      { emoji: "🔪", name: "Kitchen knife", price: "£18", target: true },
      { emoji: "🍬", name: "Tablet fudge", price: "£4", decoy: "Tempting. Focus." },
      { emoji: "🎻", name: "Tiny bagpipes", price: "£35", decoy: "Absolutely not. Your neighbours thank you." },
      { emoji: "🏰", name: "Castle magnet", price: "£3", decoy: "You have enough magnets." },
    ],
    alertTitle: "🚨 AGE VERIFICATION REQUIRED",
    alertText: "Please provide identification.",
    idButton: "Show ID 🪪",
    scanning: "Scanning face...",
    wait: "Wait...",
    verdict: "You look 17.",
    declined: "Transaction declined. Please come back with a grown-up.",
    pinataText: "Forget the knife. Hit the piñata instead.",
    win1: "Piñata defeated.",
    win2: "No ID required. 🪪❌",
  },

  cookie: {
    title: "The Last Cookie",
    clock: "11:30 AM",
    setup1: "Snack break.",
    setup2: "There is exactly one cookie left.",
    eatButton: "Eat the cookie 🍪",
    escape: "The cookie has other plans.",
    gameTitle: "Catch the cookie!",
    gameSub: "Click it to take a bite.",
    // What the cookie screams while being eaten:
    taunts: ["NOT TODAY!", "I have deadlines!", "Can we reschedule?", "I'm on mute!", "Call HR!", "Tell my crumbs I love them"],
    chompWords: ["CHOMP!", "NOM!", "CRUNCH!", "MUNCH!", "YUM!"],
    missWords: ["Missed!", "Too slow!", "Crumbs only.", "Nope 🍪"],
    win1: "You have mastered the cookie.",
    win2: "🍪 COOKIE MASTERED",
  },
};

/* ---------------------------------------------------------------------
   5. LEVEL CONFIGURATION
   Order of levels + difficulty. Each arena level can unlock an
   Edinburgh challenge (index into EDINBURGH_CHALLENGES in challenges.js).
   hp       = hits needed per piñata
   speed    = pixels per frame (0 = still)
   count    = how many real piñatas
   fakes    = how many fake piñatas (Trickster)
   --------------------------------------------------------------------- */
const LEVELS = [
  { id: "ignored",   type: "story", story: "ignored",   hp: 3 },
  { id: "microwave", type: "story", story: "microwave", hp: 4 },
  { id: "knife",     type: "story", story: "edinburgh", hp: 5 },
  { id: "cookie",    type: "story", story: "cookie",    bites: 6 },

  { id: "wanderer", type: "arena", title: "The Wanderer", hp: 6, speed: 1.6, count: 1, challenge: 0,
    flavor: "This piñata is going for a walk. Like a “quick 5-minute call”." },
  { id: "speed", type: "arena", title: "Speed Demon", hp: 6, speed: 5.5, count: 1, challenge: 1,
    flavor: "Moves faster than a deadline when you're not ready." },
  { id: "twins", type: "arena", title: "The Twins", hp: 4, speed: 2.4, count: 2, challenge: 2,
    flavor: "Two piñatas. Double-booked. Classic." },
  { id: "trickster", type: "arena", title: "The Trickster", hp: 5, speed: 1.2, count: 1, fakes: 3, challenge: 3,
    flavor: "Some of these piñatas are fake. Like “I'm on mute” excuses." },
  { id: "hidden", type: "hidden", title: "Hidden Piñata", hp: 1, challenge: 4,
    flavor: "A tiny piñata is hiding somewhere in your home office. Find it." },
  { id: "chaos", type: "arena", title: "Chaos Mode", hp: 3, speed: 3.4, count: 4, challenge: 5,
    flavor: "Monday morning energy. Everything at once." },
  { id: "boss", type: "arena", title: "Final Boss", hp: 10, speed: 8, count: 1, teleport: true, challenge: 6,
    flavor: "Extremely fast. Extremely rude. Teleports when hit." },

  { id: "golden", type: "golden" },
];

/* ---------------------------------------------------------------------
   6. SMALL BITS OF HUMOUR
   --------------------------------------------------------------------- */
// Words that pop out when you hit a piñata
const HIT_WORDS = [
  "POW!", "WHACK!", "BONK!", "PER MY LAST EMAIL!", "CIRCLING BACK!",
  "LET'S TAKE THIS OFFLINE!", "ACTION ITEM!", "SYNERGY!", "ASAP!",
  "QUICK SYNC!", "BLOCKER!", "EOD!", "+1", "NOTED!",
];

// Shown when hitting a fake piñata (Trickster)
const FAKE_WORDS = ["FAKE 🙃", "Nope.", "That's a decoy.", "Wrong one, boss.", "lol"];

// Shown when clicking the wrong object in the Hidden Piñata level
const HIDDEN_MISS = {
  "☕": "That's your coffee. You need it.",
  "🪴": "That's a plant. It's trying its best.",
  "📚": "Books you will definitely read someday.",
  "🎧": "Noise-cancelling. For the meetings.",
  "📎": "A paperclip. Very loyal.",
  "🗓️": "Your calendar. Don't look at it.",
  "🐈": "The cat. Head of morale.",
  "📦": "Mystery package. Not a piñata.",
  "🧦": "Why is there a sock here?",
  "💡": "Good idea. Wrong object.",
  "🖊️": "A pen that doesn't work.",
  "🍪": "Emergency cookie.",
  default: "Not a piñata. Keep looking 👀",
};

// "Level clear" screen texts for arena levels (random)
const CLEAR_LINES = [
  "Destroyed. HR has been notified (they're coming to the party).",
  "Piñata defeated. Productivity: questionable.",
  "Another one bites the confetti.",
  "That's going straight into your performance review. ⭐",
  "The team is impressed. (They will reply in 3 business days.)",
];

/* ---------------------------------------------------------------------
   7. GOLDEN PIÑATA + FINALE
   --------------------------------------------------------------------- */
const FINALE = {
  goldenIntro: "🪅 THE GOLDEN PIÑATA",
  survived: "You've survived:",
  list: [
    "ignored requests.",
    "microwave explosions.",
    "questionable age verification.",
    "a cookie that absolutely refused to be eaten.",
    "and several completely unnecessary piñata attacks.",
  ],
  oneHit: "One final hit.",
  complete: "🎉 MISSION COMPLETE",
  birthday: "Happy Birthday, {name}. ❤️",
  edinburgh: "Edinburgh is waiting.",
  missionsTitle: "🏴 EDINBURGH MISSIONS",
  missionsSub: "Unlocked by surviving your own birthday. Complete every mission, tick them off one by one, and make this trip legendary.",
  messagesTitle: "💌 Messages from the team",
  messagesSub: "A few words from the people who spent way too much time on this game.",
  replay: "Play again 🔁",
  lyricsButton: "🎤 Sing-along lyrics",
};

/* ---------------------------------------------------------------------
   8. THE SONG 🎵  — "Nobody Answered (Happy Birthday, Boss)"
   An original anthem. The built-in synth plays an original melody
   (see audio.js). To use a real recorded version, drop an mp3 in
   /assets/audio/ and set AUDIO_FILES.song in audio.js.
   --------------------------------------------------------------------- */
const SONG = {
  title: "Nobody Answered (Happy Birthday, Boss)",
  credit: "Original anthem by {team} • Lyrics editable in js/messages.js",
  sections: [
    { label: "Verse 1", lines: [
      "Nine a.m., the laptop's glowing,",
      "“Can someone help?” — the cursor's slowing,",
      "Typed “hello?” with the eyeball emoji,",
      "Whole team vanished, ghost-mode, oh-no-y.",
    ]},
    { label: "Pre-chorus", lines: [
      "But she's the boss, she don't need a reply,",
      "She grabs the stick and lets the candy fly!",
    ]},
    { label: "Chorus", lines: [
      "Hit it, {name}, hit it hard!",
      "Break the piñata, raise the bar!",
      "Survived the meeting, survived the call —",
      "Happy birthday, boss of us all!",
    ]},
    { label: "Verse 2", lines: [
      "Microwave humming, the egg had a plan,",
      "BOOM on the ceiling — nobody ran,",
      "Edinburgh checkout: “ID, please?”",
      "Seventeen?! Ma'am, she's the boss of these!",
    ]},
    { label: "Bridge (the cookie's part)", lines: [
      "One last cookie sitting on the plate,",
      "Ran for its life — but it was too late,",
      "Click, crunch, chomp, she caught it on the run,",
      "Cookie master — number one!",
    ]},
    { label: "Final chorus", lines: [
      "Hit it, {name}, one golden swing!",
      "Edinburgh's waiting — go do your thing!",
      "Read receipts on, we're all online —",
      "Happy birthday… we'll reply… in time! 🎉",
    ]},
  ],
};

/* Helper: fills {name}, {nickname}, {team} placeholders */
function fill(str) {
  return String(str)
    .replaceAll("{name}", PERSON.name)
    .replaceAll("{nickname}", PERSON.nickname)
    .replaceAll("{team}", PERSON.teamName)
    .replaceAll("{role}", PERSON.role);
}
