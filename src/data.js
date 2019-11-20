/**
 * The "database"
 *
 * This is the source of data for the site. It's static to keep things simple.
 */
export const tracks = {};
export const albums = {};

/**
 * People
 */
const Beau = {
  name: "Beau Sorenson",
  link: "https://beaunoise.com",
};

const TinyTelephone = {
  name: "Tiny Telephone",
  link: "/",
};

const Me = {
  name: "Nick Ball",
};

const Zach = {
  name: "Zach Hanson",
  link: "https://zach-hanson.netlify.com",
};

const Sean = {
  name: "Sean Carey",
  link: "https://scarey.org/",
};

const Katie = {
  name: "Katie Ball",
};

const Ben = {
  name: "Ben Lester",
};

const Jer = {
  name: "Jeremy Boettcher",
};

const Warren = {
  name: "Warren Lain",
  link: "https://www.youtube.com/user/warrenmusic",
};

const Dad = {
  name: "Mike Ball",
};

const Heather = {
  name: "Heather Pierce",
  link: "http://www.heathervox.com/",
};

/**
 * Albums
 */
const TheAirOnEarth = registerAlbum({
  title: "The Air on Earth",
  id: "the-air-on-earth",
  artwork: "artwork/the-air-on-earth-front",
  date: "February 23, 2015",
  description:
    "<em>The Air on Earth</em> is a musical project chronicling the passage of time and many stages of life, both significant and not.  Written and recorded over several years, the songs themselves reflect these stages in feeling and maturity.  Sentimental and perhaps distorted, each song is a source of nostalgia and reflects a moment in time.",
  credits: [
    {
      credit: "Written and recorded by",
      source: Me,
    },
    {
      credit: "Mixed and mastered by",
      source: Zach,
    },
  ],
  links: [
    bc("http://theaironearth.bandcamp.com/album/the-air-on-earth"),
    sc("https://soundcloud.com/theaironearth/sets/the-air-on-earth"),
    spotify("album/1e7vdaAh4jNtYJoapS40uC"),
    ap("https://music.apple.com/us/album/the-air-on-earth/1085692009"),
  ],
  imgs: [
    {
      src: "the-air-on-earth-1",
      size: "full",
      alt: "Image of in a tunnel doing some field recordings",
      ratio: "20%",
    },
  ],
});

// eslint-disable-next-line
const GoodSport = registerAlbum({
  id: "good-sport",
  title: "Good Sport",
  artwork: "artwork/good-sport-front",
  description:
    "<em>Good Sport</em> is the second album. Started with a nudge from a friend and recorded over a period of a year at Tiny Telephone studios in San Francisco, <em>Good Sport</em> is about life, family, and priorities.",
  date: "January 1, 2020",
  credits: [
    {
      credit: "Engineered by",
      source: Beau,
    },
    {
      credit: "Recorded at",
      source: TinyTelephone,
    },
    {
      credit: "Production by",
      source: [Me, Beau],
    },
    {
      credit: "Thanks to",
      source: [Beau, Warren, Heather, Sean, Zach, Ben, Jer, Dad, Katie],
    },
  ],
  links: [sc("the-air-on-earth"), spotify("the-air-on-earth")],
  imgs: [
    {
      src: "good-sport-1",
      size: "full",
      alt: "Image of me and Beau (the engineer) listening to mixes",
      credit: Warren,
    },
    {
      src: "good-sport-2",
      size: "three-quarter-right",
      alt: "Image of me lauging in the studio",
      credit: Warren,
    },
    {
      src: "good-sport-3",
      size: "three-quarter-left",
      alt: "Image of Beau (the engineer) intensely listening to mixes",
      credit: Warren,
    },
    {
      src: "good-sport-4",
      credit: Warren,
      alt: "Image of the Pro Tools session and a coffee mug",
    },
  ],
});

/**
 * Tracks
 */
registerTrack({
  id: "exit",
  title: "Exit",
  albumId: "the-air-on-earth",
  links: [
    sc("exit"),
    spotify("track/0Xq896dXUOMr5PsTvZdP17"),
    bc("exit"),
    ap("https://music.apple.com/us/album/exit/1085692009?i=1085692170"),
  ],
  credits: [
    {
      credit: "Programming",
      source: Me,
    },
  ],
  length: "2:18",
  theme: {
    main: {
      h: 36,
      s: 50,
      l: 85,
    },
    highContrast: {
      h: 36,
      s: 50,
      l: 39,
    },
  },
});

registerTrack({
  id: "ghost",
  title: "Ghost",
  albumId: "the-air-on-earth",
  links: [
    sc("ghost"),
    spotify("track/1VTrmuXttYbOVAbf1hrixy"),
    bc("ghost"),
    ap("https://music.apple.com/us/album/ghost/1085692009?i=1085692177"),
  ],
  lyrics: [
    [
      "All my orchids now",
      "Pull me away",
      "Carry the weight",
      "Follow wild flowers, float into light",
      "Fill in the sky",
    ],
    [
      "In the quickness I am defined, grasping for life",
      "Boring deeply into my mind",
    ],
    [
      "Now I see the ghosts",
      "They have outgrown me",
      "They are deserted",
      "Ribbon swing, wrapped, bundled leaves",
      "Beg me to rest",
      "Beg me to stay",
    ],
    [
      "In the courage I left behind you are alive",
      "In the forage I couldn’t find you are designed",
      "To blur the white to black and back",
      "To reach up and touch",
      "To know the truth and never look back",
    ],
    [
      "Running towards you with a hole in my head",
      "I can see much clearer now",
      "I’m the one leaving",
      "It was my fate just to carry you in",
      "I can see much clearer now",
      "But I’ll never understand",
    ],
  ],
  credits: [
    {
      credit:
        "Voice&thinsp;/&thinsp;Guitar&thinsp;/&thinsp;Percussion&thinsp;/&thinsp;Trombone",
      source: Me,
    },
    {
      credit: "Drums",
      source: Sean,
    },
    {
      credit: "Bass",
      source: Zach,
    },
    {
      credit: "Voice",
      source: Katie,
    },
  ],
  length: "5:38",
  theme: {
    main: {
      h: 19,
      s: 50,
      l: 72,
    },
    highContrast: {
      h: 19,
      s: 50,
      l: 46,
    },
  },
});

registerTrack({
  length: "4:43",
  id: "second-skin",
  title: "Second Skin",
  lyrics: [
    [
      "Climb. And we all were swans",
      "In the autumn wild",
      "We become entwined",
    ],
    ["Candlelight always in her eyes", "Candlelight always in her skies"],
    [
      "Glide. And we’re all aligned",
      "And I fall behind",
      "To behold your flight",
    ],
    ["Candlelight always in her eyes", "Candlelight always in her skies"],
  ],
  albumId: "the-air-on-earth",
  links: [
    sc("second-skin"),
    bc("second-skin"),
    spotify("track/5SDqn4yC8SidyFKnOli6SC"),
    ap("https://music.apple.com/us/album/second-skin/1085692009?i=1085692422"),
  ],
  credits: [
    {
      credit: "Voice / Guitar / Programming / Field recording",
      source: Me,
    },
    {
      credit: "Drums",
      source: Sean,
    },
    {
      credit: "Bass",
      source: Zach,
    },
    {
      credit: "Programming",
      source: Ben,
    },
  ],
  theme: {
    main: {
      h: 193,
      s: 50,
      l: 38,
    },
  },
});

registerTrack({
  length: "4:20",
  id: "reflection",
  title: "Reflection",
  albumId: "the-air-on-earth",
  links: [
    sc("reflection"),
    bc("reflection"),
    spotify("track/4QPIYXxr7s1T2XmSMUcgXP"),
    ap("https://music.apple.com/us/album/reflection/1085692009?i=1085692426"),
  ],
  credits: [
    {
      credit: "Voice / Piano / Guitar",
      source: Me,
    },
  ],
  lyrics: [
    [
      "My peace is watching on",
      "And I come often to dream of falling",
      "My hate is falling off",
      "And I breathe it in and breathe it out",
    ],
    [
      "My home is all I’ve got",
      "And I fall often to keep on falling",
      "My only harbored light is the beauty that lives",
      "On and on",
    ],
  ],
  theme: {
    main: {
      h: 220,
      s: 50,
      l: 28,
    },
  },
});

registerTrack({
  length: "4:03",
  id: "farewell",
  title: "Farewell",
  albumId: "the-air-on-earth",
  links: [
    sc("farewell"),
    bc("farewell"),
    spotify("track/0XA88MXQdWz0ZmOsNzo4Kh"),
    ap("https://music.apple.com/us/album/farewell/1085692009?i=1085692428"),
  ],
  credits: [
    {
      credit: "Voice / Piano / Guitars / Programming",
      source: Me,
    },
    {
      credit: "Bass",
      source: Zach,
    },
    {
      credit: "Programming",
      source: Ben,
    },
  ],
  lyrics: [
    [
      "All enhoused in my hand",
      "All the air on the earth",
      "I covered the spread of the land",
      "Best I could",
    ],
    ["On my way before I fall", "Breaking my heart on every inch of it"],
    ["Breaking my heart", "This is how we fall in"],
  ],
  theme: {
    main: {
      h: 231,
      s: 50,
      l: 14,
    },
  },
});

registerTrack({
  length: "4:33",
  id: "stillness",
  title: "Stillness",
  albumId: "the-air-on-earth",
  links: [
    sc("stillness"),
    bc("stillness"),
    spotify("track/1MwkBTaWxszmeHmA1bM1TO"),
    ap("https://music.apple.com/us/album/stillness/1085692009?i=1085692433"),
  ],
  credits: [
    {
      credit: "Voice / Guitars / Percussion",
      source: Me,
    },
    {
      credit: "Bass",
      source: Zach,
    },
    {
      credit: "Pedal steel",
      source: Ben,
    },
  ],
  lyrics: [
    [
      "My beliefs, slowly out of sync inside of my hand",
      "At my age I wring my body out just to forget",
    ],
    [
      "If I ever was, I’ve lived enough",
      "Scattered myself",
      "Waited on more",
      "And I forgive all my other fights",
      "I was a better man once",
      "But I moved on",
    ],
    [
      "You and I",
      "We are this instant",
      "Tear the rest down",
      "Down to the ground",
      "We can wait ",
      "We can watch it happen",
      "Or feel it all now",
    ],
    [
      "If I ever was, I’ve lived enough",
      "Scattered myself",
      "Waited on more",
      "And I forgive all my other fights",
      "I was a better man once",
      "But I moved on",
    ],
    ["But I moved on"],
  ],
  theme: {
    main: {
      h: 250,
      s: 50,
      l: 79,
    },
    highContrast: {
      h: 250,
      s: 50,
      l: 59,
    },
  },
});

registerTrack({
  length: "4:46",
  id: "young-guns",
  title: "Young Guns",
  albumId: "the-air-on-earth",
  links: [
    sc("young-guns"),
    bc("young-guns"),
    spotify("track/2WVgHo8YzcxAyv3WYleS8l"),
    ap("https://music.apple.com/us/album/young-guns/1085692009?i=1085692436"),
  ],
  credits: [
    {
      credit: "Voice / Guitars / Trombone",
      source: Me,
    },
    {
      credit: "Voice / Percussion",
      source: Sean,
    },
    {
      credit: "Upright bass",
      source: Jer,
    },
    {
      credit: "Pedal steel",
      source: Ben,
    },
  ],
  lyrics: [
    [
      "The only sun swimming in to me",
      "I am in love with you here",
      "I am an endless swell",
    ],
    [
      "The coldest touch carries us outward",
      "We are in awe of this drift",
      "We are a glowing blend",
    ],
    [
      "Drip on a palm",
      "Catching it all when the fall ends it",
      "You were in shimmering light",
      "You were my only guide",
    ],
    [
      "Your love, hold it in your chest",
      "Fold it in your arms",
      "Never end",
      "Your love, hold it in your chest",
      "Fold it in your arms",
      "And lead me in to you",
    ],
  ],
  theme: {
    main: {
      h: 27,
      s: 50,
      l: 76,
    },
    highContrast: {
      h: 27,
      s: 50,
      l: 42,
    },
  },
});

registerTrack({
  length: "2:35",
  id: "innocent",
  title: "Innocent",
  albumId: "the-air-on-earth",
  links: [
    sc("innocent"),
    bc("innocent"),
    spotify("track/74Y6LOAB1hkcoIIzfKyTUf"),
    ap("https://music.apple.com/us/album/innocent/1085692009?i=1085692437"),
  ],
  credits: [
    {
      credit: "Voice / Guitars",
      source: Me,
    },
    {
      credit: "Voice",
      source: Sean,
    },
    {
      credit: "Upright bass",
      source: Jer,
    },
  ],
  lyrics: [
    ["We look down on ourselves", "Holding on to anyone we can"],
    [
      "Pushing through the fallen rock",
      "Leaving home",
      "Peeling off the second skin",
      "The innocence",
      "We are never honest",
    ],
    [
      "All that I’m discovering",
      "Right beside me",
      "We were only seventeen",
      "We knew",
    ],
    [
      "Breaking down the barriers",
      "Leaving home",
      "Peeling off the second skin",
      "The innocence",
      "We are never honest",
    ],
    ["We are never honest"],
    ["We are never honest"],
  ],
  theme: {
    main: {
      h: 32,
      s: 50,
      l: 79,
    },
    highContrast: {
      h: 32,
      s: 50,
      l: 40,
    },
  },
});

registerTrack({
  length: "7:25",
  id: "wake",
  title: "Wake",
  albumId: "the-air-on-earth",
  links: [
    sc("wake"),
    bc("wake"),
    spotify("track/0CWtAr3BxX0zOeFbF7Rhuy"),
    ap("https://music.apple.com/us/album/wake/1085692009?i=1085692445"),
  ],
  credits: [
    {
      credit: "Voice / Guitars / Piano",
      source: Me,
    },
    {
      credit: "Drums",
      source: Sean,
    },
  ],
  lyrics: [
    [
      "When I was younger I lost my faith",
      "You told me,",
      "“Brother, you’ll know when you’re my age”",
      "And even though that day has come",
      "And I still do not",
      "You are still my hope",
      "My pushing off",
    ],
    [
      "You are here",
      "Arms across",
      "I cannot bear to see my father",
      "This is not fair",
      "I’m not at peace",
      "But I clearly see what needs to be done",
    ],
    ["When we’re breathless", "When the love hits", "We’re all the same"],
  ],
  theme: {
    main: {
      h: 180,
      s: 50,
      l: 76,
    },
    highContrast: {
      h: 180,
      s: 50,
      l: 33,
    },
  },
});

registerTrack({
  id: "good-sport",
  title: "Good Sport",
  albumId: "good-sport",
  artwork: "artwork/good-sport-track",
  length: "1:30",
  credits: [
    {
      credit: "Production",
      source: Beau,
    },
    {
      credit: "Pedal steel",
      source: Ben,
    },
    {
      credit: "Guitars / Synths / Programming",
      source: Me,
    },
  ],
  lyrics: [
    [
      "If only we could leave our marks",
      "In the hope they greet us in the night",
      "On the hollow tree trunks, we climb",
      "To the top of the fences",
      "In time, we were brothers",
    ],
  ],
  theme: {
    main: {
      h: 15.5,
      s: 100,
      l: 50,
    },
  },
});

registerTrack({
  id: "sprint",
  title: "Sprint",
  artwork: "artwork/sprint",
  albumId: "good-sport",
  length: "6:47",
  credits: [
    {
      credit: "Pedal steel",
      source: Ben,
    },
    {
      credit:
        "Vocals / Programming / Guitars / Piano / Percussion / Trombones / Synths",
      source: Me,
    },
  ],
  lyrics: [
    [
      "You were on the ground",
      "Waiting on",
      "Waiting for the round",
      "Always off the path",
      "Drowning out",
      "The weight of the warm sound",
    ],
    [
      "We were on an airwave",
      "Way up",
      "Falling on the lions",
      "In a daze, we looked out like kings",
      "We no longer know",
    ],
    [
      "Please, tell me how",
      "To feel it all, all around",
      "Lead me on",
      "Almost home",
      "(One) I no longer know",
    ],
    [
      "On our best day, we were brothers",
      "All our leaders can't deny",
      "Who we are",
    ],
    [
      "I was on fire",
      "And it took a father's leap",
      "So afraid to lose my cityscape",
      "And I pry, pry, pry and look out to the West",
    ],
  ],
  theme: {
    main: {
      h: 47.1,
      s: 100,
      l: 64.5,
    },
    highContrast: {
      h: 47.1,
      s: 100,
      l: 28,
    },
  },
});

registerTrack({
  id: "rest",
  title: "Rest",
  length: "5:13",
  albumId: "good-sport",
  artwork: "artwork/rest",
  credits: [
    {
      credit: "Bass",
      source: Jer,
    },
    {
      credit: "Synths / Programming / Vocals / Piano",
      source: Me,
    },
  ],
  lyrics: [
    [
      "Was it silenced by California?",
      "The ways you found us",
      "The way we hold in",
      "Was it over yet?",
      "Gotta calm down",
      "Walls are thicker",
      "And they stand tall",
    ],
    [
      "Well the protest, we can’t afford you",
      "Still you find us",
      "Still you ease in",
      "But you sold us all (all on your own)",
      "On all your good lies",
      "All you've earned in time",
    ],
    [
      "You deserve a caliber war",
      "Nothing ever followed",
      "The calling order",
      "And the lazy lob, you longed",
    ],
  ],
  theme: {
    main: {
      h: 194.6,
      s: 100,
      l: 67.8,
    },
    highContrast: {
      h: 194.6,
      s: 100,
      l: 33,
    },
  },
});

registerTrack({
  id: "recur",
  title: "Recur",
  length: "2:26",
  albumId: "good-sport",
  artwork: "artwork/recur",
  credits: [
    {
      credit: "Nashville guitars",
      source: Warren,
    },
    {
      credit: "Voice",
      source: Sean,
    },
    {
      credit: "Piano / Nashville guitars / Programming / Vocals",
      source: Me,
    },
  ],
  lyrics: [
    [
      "I was in your heart when I asked for you once",
      "Sky was burning red",
      "Other lives we had led",
    ],
    ["This is us", "Firmly on the ends", "Waiting on"],
    [
      "I was in your arc",
      "You recurred back to me",
      "Run the other ones down",
      "It's a lie I won't tell",
    ],
    [
      "And this is us",
      "Caught in a loop",
      "We have been dissolved",
      "Part of it now",
      "Waiting on",
      "Waiting on",
      "The earliest dawn",
    ],
  ],
  theme: {
    main: {
      h: 27.3,
      s: 100,
      l: 69,
    },
    highContrast: {
      h: 27.3,
      s: 100,
      l: 37,
    },
  },
});

registerTrack({
  id: "run-long",
  title: "Run Long",
  length: "7:06",
  albumId: "good-sport",
  artwork: "artwork/run-long",
  links: [sc("run-long")],
  lyrics: [
    [
      "I will know what you have done",
      "By the time you let go",
      "You will try to hold it down",
      "Or incite a war",
      "You wanna fight but you like to lose",
    ],
    ["Run long. Run long."],
    [
      "You will see your oldest one",
      "Come along and grow up",
      "She takes steps in that sun dress",
      "And while you wait, she will hum",
    ],
    ["Run long. Run long. Run long."],
    [
      "Try to live my life with no paradigms",
      "Try to see, my love, you'll be alive",
    ],
    [
      "On empty",
      "By the book",
      "Why'd I need to be at fault?",
      "Wanna feel like home",
    ],
    [
      "It was a long time coming",
      "I leave wrapped in your arms and you said,",
      "“This is how you end and how I begin”",
    ],
    ["What you've gone and done", "Is light up my life full stop"],
    ["Run long. Run long."],
  ],
  credits: [
    {
      credit: "Piano / Programming / Synths / Guitars / Vocals",
      source: Me,
    },
  ],
  theme: {
    main: {
      h: 210,
      s: 100,
      l: 85,
    },
    highContrast: {
      h: 210,
      s: 100,
      l: 47,
    },
  },
});

registerTrack({
  id: "bliss",
  title: "Bliss",
  albumId: "good-sport",
  artwork: "artwork/bliss",
  length: "5:04",
  links: [],
  lyrics: [
    [
      "And the hate floats",
      "All the way up",
      "I will be out of body",
      "And it comes slow",
      "To lead me",
      "I will blur out all the colors",
    ],
    [
      "See: fallen arrow",
      "On the iris dome",
      "Flee",
      "In the orchard",
      "And I call it",
      "Home",
    ],
    [
      "Now down parachute",
      "I will lift off",
      "Sleep easy",
      "And the heat",
      "Quick comes back",
      "I can almost feel the colors",
    ],
    [
      "See: fallen narrow",
      "On the iris dome",
      "Flee",
      "In the orchard",
      "And I call it",
      "Home",
      "Bleed",
      "Fallout tomorrow",
      "Today is won",
    ],
  ],
  credits: [
    {
      credit: "Voice",
      source: Sean,
    },
    {
      credit: "Bass",
      source: Jer,
    },
    {
      credit: "Programming / Guitars / Percussion / Piano / Vocals",
      source: Me,
    },
  ],
  theme: {
    main: {
      h: 23.5,
      s: 100,
      l: 64,
    },
    highContrast: {
      h: 23.5,
      s: 100,
      l: 44,
    },
  },
});

registerTrack({
  id: "drone",
  title: "Drone",
  length: "4:20",
  albumId: "good-sport",
  artwork: "artwork/drone",
  links: [],
  lyrics: [
    [
      "My only sweep",
      "My only vice",
      "Run and wake him up",
      "For all the tides",
    ],
    [
      "But you, my love, you could love him",
      "When you are feeling like a drone",
      "Can you hold on to this?",
      "Hold on to the time?",
    ],
    [
      "A power seize",
      "The only one",
      "The kind of man you seek is all you know",
      "On the waterfall of my life",
      "Not a wond, my breed",
      "All for one",
    ],
    [
      "You might run, but you can love him",
      "If you are feeling up to it still",
      "In another world, could you let her down?",
      "When you are feeling like a drone",
    ],
    [
      "Can you hold on to this?",
      "Hold on to this always?",
      "Hold on to the time?",
    ],
  ],
  credits: [
    {
      credit: "Norns / Production / Programming",
      source: Beau,
    },
    {
      credit: "Voice / Piano / Production / Programming",
      source: Me,
    },
    {
      credit: "Acoustic Guitars",
      source: Sean,
    },
  ],
  theme: {
    main: {
      h: 157,
      s: 100,
      l: 61,
    },
    highContrast: {
      h: 157,
      s: 100,
      l: 29,
    },
  },
});

registerTrack({
  id: "hollow",
  title: "Hollow",
  length: "5:54",
  albumId: "good-sport",
  artwork: "artwork/hollow",
  links: [],
  lyrics: [
    [
      "In the reeds that we love",
      "We are pulled apart",
      "When the bottle's up and down",
      "You can meet us at the white oak",
      "Oh I can look past",
    ],
    [
      "You know you are your father’s son",
      "When you see right to the other side",
    ],
    [
      "Never came to a stop",
      "Always needed a counterweight",
      "We lived on the corner of it",
      "All of your reasons to be this one",
      "All of your atoms fought",
      "Oh I can look past",
    ],
    [
      "You know you are your father’s son",
      "When you're counting down to always one",
      "I'll always come to take you home",
    ],
    [
      "My weaknesses carried on by other ones now",
      "A camera lens",
      "Leave it for another man",
      "Oh I can look past",
    ],
    [
      "You know you are your father’s son",
      "When your eyes see what you always are",
      "I'll always come to take you home",
    ],
    ["Keep it here in the hollow"],
  ],
  credits: [
    {
      credit: "Guitars",
      source: Dad,
    },
    {
      credit: "Piano / Voice / Programming / Guitars / Synths",
      source: Me,
    },
  ],
  theme: {
    main: {
      h: 309,
      s: 100,
      l: 81,
    },
    highContrast: {
      h: 309,
      s: 100,
      l: 49,
    },
  },
});

/**
 * Site
 */
export const site = {
  links: {
    soundcloud: sc(""),
    bandcamp: bc("https://theaironearth.bandcamp.com"),
    spotify: spotify("artist/4beU4ZRfDapoH3orvpJthM"),
  },
};

/**
 * Helpers
 */
function sc(id) {
  return {
    type: "soundcloud",
    url: id.startsWith("http")
      ? id
      : `https://soundcloud.com/theaironearth/${id}`,
  };
}

function spotify(id) {
  return {
    type: "spotify",
    url: `https://open.spotify.com/${id}`,
  };
}

function bc(id) {
  return {
    type: "bandcamp",
    url: id.startsWith("http")
      ? id
      : `https://theaironearth.bandcamp.com/track/${id}`,
  };
}

function ap(url) {
  return {
    type: "apple-music",
    url,
  };
}

function registerTrack(props) {
  const { id, title, ...rest } = props;

  const Track = {
    type: "track",
    id,
    title,
    lyrics: [],
    links: [],
    credits: [],
    albumId: null,
    ...rest,
  };

  if (!tracks[id]) {
    tracks[id] = Track;
  }

  // Cheat a little and pre-push the tracks to the album
  if (Track.albumId && albums[Track.albumId]) {
    const Album = albums[Track.albumId];
    Album.tracks.push(Track);
  }

  return Track;
}

function registerAlbum(props) {
  const { id, title, ...rest } = props;
  const Album = {
    type: "album",
    id,
    title,
    tracks: [],
    artwork: null,
    description: "",
    date: null,
    credits: [],
    links: [],
    ...rest,
  };

  if (!albums[id]) {
    albums[id] = Album;
  }

  return Album;
}

export const playlistOrder = [/*GoodSport*/ TheAirOnEarth].reduce(
  (list, album) => {
    list.push(...album.tracks.map(track => track.id));
    return list;
  },
  []
);

export function preloadAlbums(tracks) {
  return Object.values(tracks).map(track => ({
    ...track,
    album: albums[track.albumId],
  }));
}
