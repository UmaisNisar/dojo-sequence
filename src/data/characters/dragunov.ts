import type { Character } from "@/types";

/**
 * Sergei Dragunov — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki's live Cargo database
 * (wavu.wiki/t/Dragunov, _movelist, _punishers, _combos) and TekkenDocs,
 * August 2026. Facts baked in — each checked against the live table:
 *  - wr2 (f,f,F+2) is +4 ON BLOCK with a CH launch worth +44a. It is the
 *    character. f,n,f+2 within 8 total frames gives the powered-up version.
 *  - Other plus-on-block pressure: b+1+2 (+6), SNK.4 (+7), f,F+3 (+5),
 *    d+1 (+1c), 4,4 (+5), Feint & Catch (+5).
 *  - Stance is SNK (Sneak) = qcf. Strings enter it with DF: 2,1 at +10 on
 *    hit, f+3 at +0 on block, 3,1 at -3, b+4,2 at -6, ws1 at -5.
 *  - Wavu's combo page writes SNK moves as qcf+N. qcf+1+2 / SNK.1+2 is an
 *    ALT INPUT for ws1+2 (Frost Tackle) — not a separate move.
 *  - Only ONE standing launcher: df+2 at i15.
 *  - Punish ladder: -10 2,1 | -12 4,1 (df+4 for a mid) | -13 df+1 |
 *    -14 b+4,3 / f+4,3 / uf+1 | -15 df+2 | -17 f+1+2 | -20 f+3,1+2 |
 *    -23 uf,n,4. Crouching: -11 ws4 | -12 ws1,3 / ws1,2 / ws1+2 | -15 ws2.
 *  - Heat makes Feint & Catch and the Ambush Tackles UNBREAKABLE, and adds
 *    chip damage so blocking still costs the opponent life.
 *  - uf+3+4 (Scorpion Scissors) is unbreakable — the only escape is ducking.
 *  - Honest weaknesses per Wavu: interruptible (slow pressure tools), a
 *    side-switcher (b+1+2 and uf+1 give up wall position), LINEAR (little
 *    tracking, loses to lateral movement), and below-average CH utility.
 */

export const dragunov: Character = {
  id: "dragunov",
  name: "Sergei Dragunov",
  style: "Commando Sambo",
  tagline:
    "Freeze them cold with plus-on-block mids, then open them up. The purest expression of Tekken 8's aggression.",
  available: true,
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT & PRESSURE ENTRY                         */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement & Pressure Entry",
      focus: "Get to the range where your buttons are plus",
      description:
        "Dragunov has above-average movement and genuinely good whiff punishment, which is unusual for a rushdown character. But his pressure tools are slow to start, so you cannot simply walk in and press — you have to arrive at a range where being plus on block actually means something. This stage builds the approach and the stance everything runs through.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance and lets you block immediately after. Dragunov's whole gameplan is being in range of wr2, so the dash is the first half of his offense.",
          whenToUse:
            "Any time you are out of range and they are not swinging. Dash, block, then start pressure from where your plus buttons reach.",
          leverlessTip:
            "Tap f twice with a full release between taps. Holding the second f turns the dash into a run, which is where his best move lives — so learn to feel the difference deliberately.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash into range and block without pressing anything.",
          },
          difficulty: "easy",
          tags: ["fundamental", "approach"],
        },
        {
          id: "backdash",
          stageId: "movement",
          name: "Backdash",
          notation: "b,b",
          purpose:
            "Creates space and baits whiffs. Wavu rates his whiff punishment as above average, and b+1,2 and b+4,3 are his two listed whiff punishers — the second of which is a Heat Engager.",
          whenToUse:
            "After blocking a string that ends close, or against opponents who swing at your approach.",
          leverlessTip:
            "Full release between the two b presses. Backing off is genuinely part of his game: his pressure is slow enough that forcing it every time gets you interrupted.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash a CPU attack and punish the whiff with b+4,3.",
          },
          difficulty: "easy",
          tags: ["fundamental", "whiff punish"],
        },
        {
          id: "kbd",
          stageId: "movement",
          name: "Korean Backdash",
          notation: "b,b~db, b,b~db, ...",
          purpose:
            "Chained backdash cancels. Dragunov actually has good movement, and Wavu explicitly notes he relies on movement rather than counter-hits to handle aggressive opponents — so this is a real defensive pillar for him, not a formality.",
          whenToUse:
            "Against opponents who press buttons. His counter-hit tools are below average, so out-moving them is frequently the better answer.",
          leverlessTip:
            "Anchor b, drum d. For most characters KBD is a luxury; for Dragunov it is the substitute for the counter-hit game he does not have.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Four clean backdash cancels in a row.",
          },
          difficulty: "hard",
          tags: ["fundamental", "execution", "defense"],
        },
        {
          id: "sneak-stance",
          stageId: "movement",
          name: "Sneak",
          notation: "qcf (SNK)",
          purpose:
            "His only stance, and the hub of his offense. It holds a launcher (SNK.1), the combo Tornado (SNK.2), a low that becomes a throw (SNK.3), a Power Crush (SNK.3+4) and SNK.4, which is +7 on block AND a Heat Engager.",
          whenToUse:
            "As a pressure platform and as combo glue. Many of his strings slide into it with DF, so you rarely need the raw qcf motion in a match.",
          leverlessTip:
            "qcf on a leverless is three discrete states: press d, add f so both are held (that is df), then release d. It also cancels to a sidestep with u, so entering is not a full commitment.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Sneak from neutral and cancel to sidestep with u.",
          },
          difficulty: "medium",
          tags: ["stance", "core"],
          moveKeys: ["snk1", "snk2", "snk3", "snk4", "snk3plus4"],
        },
        {
          id: "instant-while-running",
          stageId: "movement",
          name: "Instant While Running",
          notation: "f,n,f+2 (within 8 frames)",
          purpose:
            "One of Wavu's two listed key techniques for him. wr2 normally needs a run to build up; inputting f,n,f+2 within eight total frames gives you the powered-up version immediately, from standing.",
          whenToUse:
            "Any time you want wr2 without telegraphing a run. Turning his best move into something you can throw from neutral is the whole point.",
          leverlessTip:
            "f, release, f, plus 2 — inside eight frames total. On a leverless the release is a clean lift rather than a stick returning to centre, which makes the window much easier to hit consistently.",
          drill: {
            type: "accuracy",
            attempts: 20,
            required: 10,
            rep: "Attempt the instant version from standing and count only the powered-up ones.",
          },
          difficulty: "hard",
          tags: ["execution", "signature", "pressure"],
          moveKeys: ["wr2"],
        },
        {
          id: "pigeon-roll",
          stageId: "movement",
          name: "Pigeon Roll",
          notation: "3+4 (PGR)",
          purpose:
            "A rolling stance that Wavu credits with giving him amazing wall okizeme. PGR.2 is a mid, PGR.3 is a low, and PGR.1+2 is an Ambush Tackle that becomes unbreakable in Heat.",
          whenToUse:
            "At the wall after a knockdown. The mid/low/throw split from one roll is genuinely hard to guess when they are stuck against a wall.",
          leverlessTip:
            "3+4 is a two-button chord, and 2,1 also rolls into it with 3+4. Learn the wall setup rather than trying to use the roll in open neutral.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Knock down at the wall and run the Pigeon Roll mixup.",
          },
          difficulty: "medium",
          tags: ["stance", "okizeme", "wall"],
          moveKeys: ["pgr2", "pgr3", "pgr-tackle"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 02 — CORE POKES                                        */
    /* ------------------------------------------------------------ */
    {
      id: "pokes",
      number: 2,
      name: "Core Pokes",
      focus: "The small Tekken that holds it together",
      description:
        "Wavu notes that Dragunov's strong poking makes his small Tekken difficult to deal with — and that his pokes are the ONLY thing compensating for how slow his real pressure tools are. These buttons are what you press when it is not yet your turn.",
      items: [
        {
          id: "df1",
          stageId: "pokes",
          name: "Mid Punch",
          notation: "df+1 → df+1,4",
          purpose:
            "His main mid check: i13 and only -2 on block. The 4 extension counter-hits for +58a, which is one of the few genuinely rewarding counter-hits he owns.",
          whenToUse:
            "Constantly. At -2 you keep the exchange alive, and it is also his -13 punish.",
          leverlessTip:
            "df is a d+f chord. Because his counter-hit game is weak overall, df+1,4 landing as a counter-hit is worth noticing and converting.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "df+1 as a turn check, then block; take df+1,4 on counter-hit.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke", "punisher"],
          moveKeys: ["df1", "df1-4"],
        },
        {
          id: "mid-checks",
          stageId: "pokes",
          name: "The Other Mid Checks",
          notation: "b+2 · b+4 · df+4",
          purpose:
            "Wavu lists four standing mid checks for him. b+2 is i15 at only -3, b+4 is i14 and starts his best strings, and df+4 is i12 for when you need speed over reward.",
          whenToUse:
            "Rotate them. b+4 in particular is the gateway to b+4,3 (his -14 punish and Heat Engager) and to the Ambush Tackle.",
          leverlessTip:
            "b+4 is the one to internalise, because its follow-ups branch into a Heat Engager, a Sneak entry and a throw. One button, three very different threats.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Check turns with b+2 and b+4 without being launched.",
          },
          difficulty: "easy",
          tags: ["mid", "poke"],
          moveKeys: ["b2", "b4", "df4", "b4-2"],
        },
        {
          id: "jab-strings",
          stageId: "pokes",
          name: "The Jab Strings",
          notation: "1,2,1 · 2,1 · 2,1~DF",
          purpose:
            "1,2,1 is an i10 Heat Engager that WALL SPLATS on counter-hit — Wavu lists it as one of his standout tools. 2,1 is his i10 punish, and pressing DF afterwards leaves you in Sneak at +10 on hit.",
          whenToUse:
            "Close range as fast checks. 2,1~DF is the one to build a habit around: a jab punish that ends with you in a plus-frame stance.",
          leverlessTip:
            "The DF transition is a held direction during recovery, not a fresh input. Getting 2,1~DF automatic converts your smallest punish into real pressure.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish with 2,1 and transition into Sneak with DF.",
          },
          difficulty: "medium",
          tags: ["i10", "heat engager", "stance", "punisher"],
          moveKeys: ["jab-2-1", "right-1", "snk4"],
        },
        {
          id: "crouch-checks",
          stageId: "pokes",
          name: "Crouch Checks",
          notation: "ws4 · ws1 · ws1~DF",
          purpose:
            "ws4 is i11 at only -5 — his answer to blocking a low. ws1 is i12 at -3 and enters Sneak with DF, so even your crouch check can turn into stance pressure.",
          whenToUse:
            "Every time you block a low, and out of your own crouch. Blocking a low and doing nothing is the most common way to waste Dragunov's turn.",
          leverlessTip:
            "You are already holding d. The while-standing move fires as you release it — one motion, not two.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Block a low and answer with ws4, then again with ws1~DF.",
          },
          difficulty: "easy",
          tags: ["i11", "crouch", "poke"],
          moveKeys: ["ws4", "ws1", "ws1-2"],
        },
        {
          id: "f4-strings",
          stageId: "pokes",
          name: "The f+4 Strings",
          notation: "f+4,3 · f+4,4 · f+4,d+4",
          purpose:
            "One high starter, three endings: f+4,3 carries the Tornado and is a -14 punish, f+4,4 counter-hits for +22a, and f+4,d+4 ends low. A real branching string rather than a fixed one.",
          whenToUse:
            "Mid range as pressure. Because the branches split mid and low, opponents cannot pre-commit to a block height.",
          leverlessTip:
            "f+4 is a high, so it loses to crouching. Use the low branch to punish anyone who has learned to duck it.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Throw f+4 and choose the ender based on the CPU's block height.",
          },
          difficulty: "medium",
          tags: ["mixup", "tornado", "punisher"],
          moveKeys: ["f4", "f4-3", "f4-4", "f4-d4"],
        },
        {
          id: "kick4-strings",
          stageId: "pokes",
          name: "The Karnov Strings",
          notation: "4,1 · 4,3 · 4,4",
          purpose:
            "4,1 is his -12 punisher and a core combo ender. 4,4 is +5 ON BLOCK and is the first link of nearly every combo he has. 4,3 is his counter-hit starter.",
          whenToUse:
            "4,1 for punishment, 4,4 for pressure and combos. Learning 4,4 now pays for the entire combo stage later.",
          leverlessTip:
            "4,4 is interruptible with i15 from the first block, so it is not free pressure — but landing it leaves you plus, which for a slow character is a genuine reward.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land 4,4 on block and continue pressure from the advantage.",
          },
          difficulty: "easy",
          tags: ["plus on block", "punisher", "combo filler"],
          moveKeys: ["kick4-1", "kick4-3", "kick4-4"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — THE PRESSURE GAME                                 */
    /* ------------------------------------------------------------ */
    {
      id: "pressure",
      number: 3,
      name: "The Pressure Game",
      focus: "Plus on block, over and over",
      description:
        "This is the character. Wavu describes Dragunov as freezing opponents cold with powerful, plus-on-block mids — and he has an unusual number of them. The gameplan is not a mixup; it is making the opponent block, staying plus, and making them block again until they crack.",
      items: [
        {
          id: "wr2",
          stageId: "pressure",
          name: "Russian Assault",
          notation: "f,f,F+2 (wr2)",
          purpose:
            "His defining move. A mid that is +4 ON BLOCK and counter-hit launches for +44a. Wavu names it first among his rushdown tools — it punishes the opponent for getting hit AND for blocking.",
          whenToUse:
            "As the centre of your offense. Land it on block, stay plus, and immediately threaten it again.",
          leverlessTip:
            "Doing f,n,f+2 inside eight frames gives the powered-up version, which adds chip damage on block. That is why the instant-while-running drill in Stage 1 matters so much — this is the move it delivers.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Land wr2 on block and continue pressure from +4.",
          },
          difficulty: "medium",
          tags: ["plus on block", "CH launcher", "signature", "core"],
          moveKeys: ["wr2"],
        },
        {
          id: "b1plus2",
          stageId: "pressure",
          name: "Blizzard Hammer",
          notation: "b+1+2",
          purpose:
            "+6 on block — even more advantage than wr2. Wavu names it alongside wr2 as an excellent pressure mid, with one caveat you should know up front.",
          whenToUse:
            "As your second plus-on-block mid, to vary the timing so wr2 does not become predictable.",
          leverlessTip:
            "The caveat: Wavu lists Dragunov as a side-switcher, and b+1+2 is one of the moves that forces you to give up wall position for optimal damage. Near a wall, think before you take the bigger combo.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land b+1+2 on block and continue pressure from +6.",
          },
          difficulty: "easy",
          tags: ["plus on block", "pressure"],
          moveKeys: ["b1plus2"],
        },
        {
          id: "snk4",
          stageId: "pressure",
          name: "Ignition Switch",
          notation: "SNK.4 (qcf+4)",
          purpose:
            "+7 on block AND a Heat Engager. The single most advantageous button in his kit on block, and it builds Heat while doing it.",
          whenToUse:
            "Out of Sneak, especially after a string that transitioned in with DF. This is the payoff for all the stance entries you drilled.",
          leverlessTip:
            "Because so many strings enter Sneak automatically, you often get here without ever inputting qcf. 2,1~DF then SNK.4 is a punish that ends at +7 with Heat engaged.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Sneak from a string and engage Heat with SNK.4.",
          },
          difficulty: "medium",
          tags: ["plus on block", "heat engager", "stance"],
          moveKeys: ["snk4", "right-1"],
        },
        {
          id: "ff3",
          stageId: "pressure",
          name: "Stinger Kick",
          notation: "f,F+3",
          purpose:
            "+5 on block and HOMING — which matters enormously, because Wavu lists Linear as one of his real weaknesses. This is one of the few things he has that tracks.",
          whenToUse:
            "Against opponents who have started sidestepping your pressure. Being a high, it loses to crouching, so it is a specific answer rather than a general one.",
          leverlessTip:
            "Most of his key moves have little to no tracking. Knowing exactly which of your tools are homing is not trivia — it is the difference between pressure that works and pressure that whiffs.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Catch a sidestepping CPU with f,F+3.",
          },
          difficulty: "easy",
          tags: ["homing", "plus on block", "anti-step"],
          moveKeys: ["ff3", "ff2", "ff4"],
        },
        {
          id: "d1",
          stageId: "pressure",
          name: "Bunker-buster Elbow",
          notation: "d+1",
          purpose:
            "A mid from a crouching input that is PLUS on block. It keeps your turn from a stance most characters can only defend from, and counter-hits into a knockdown.",
          whenToUse:
            "From crouch, or immediately after a low that leaves you crouching. It is a plus-frame mid that does not look like one.",
          leverlessTip:
            "Note the remap: Dragunov's generic crouch jab lives on db+1, and d+1 is this elbow instead. Same for d+4 versus db+4 — worth knowing before you reach for the wrong one under pressure.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land d+1 from crouch and continue pressure from the advantage.",
          },
          difficulty: "easy",
          tags: ["plus on block", "mid", "crouch"],
          moveKeys: ["d1"],
        },
        {
          id: "interruptible",
          stageId: "pressure",
          name: "Knowing When You Are Interruptible",
          notation: "",
          purpose:
            "The honest counterweight to this stage. Wavu's first listed weakness is that his primary pressure tools are fairly slow, leaving him open to interruption — and he has very few ways to compensate outside his pokes.",
          whenToUse:
            "Every time you want to force another plus-on-block mid. If the opponent has started interrupting, the answer is a poke or a step, not a bigger button.",
          leverlessTip:
            "Check the interrupt frames on the moves you lean on. 4,4 can be interrupted with i15 from the first block; b+4,3 is duckable. Knowing this stops you from blaming the game when a jab beats your turn.",
          drill: {
            type: "manual",
            checklist: [
              "Name three of Dragunov's pressure tools and their startup.",
              "Set the CPU to jab and find which of your pressure strings lose.",
              "Play a round where you answer every interrupt with a poke instead of a bigger move.",
              "Explain why his weak counter-hit game makes interruption harder to punish.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 04 — PUNISHMENT                                        */
    /* ------------------------------------------------------------ */
    {
      id: "punishment",
      number: 4,
      name: "Punishment",
      focus: "Deep ladder, one launcher",
      description:
        "Dragunov has an unusually long punish ladder — Wavu lists twelve standing entries — but only ONE standing launcher, df+2 at i15. That shapes everything: below -15 you are collecting small guaranteed damage, and at -15 and beyond you are collecting combos and Heat.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "The i10 Punish",
          notation: "2,1 (→ DF for Sneak)",
          purpose:
            "Your fastest punish, and the best-designed one in the game for a pressure character: adding DF leaves you in Sneak at +10 on hit. The punish IS the start of your offense.",
          whenToUse: "Anything blocked at -10 or -11. Always take the DF transition.",
          leverlessTip:
            "Buffer 2,1 during blockstun and hold DF through the recovery. Two inputs, and you come out of a jab punish holding the turn.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 2,1~DF and follow with a Sneak move.",
          },
          difficulty: "easy",
          tags: ["i10", "punisher", "stance"],
          moveKeys: ["right-1", "snk4"],
        },
        {
          id: "punish-12-13",
          stageId: "punishment",
          name: "-12 and -13",
          notation: "4,1 · df+4 · df+1",
          purpose:
            "4,1 is the -12 punish by damage; df+4 is the -12 punish when you specifically need a mid. df+1 covers -13.",
          whenToUse:
            "Blocked pokes. Wavu's note is worth repeating: only use df+4 over 4,1 if you actually need the mid.",
          leverlessTip:
            "Three punishes two frames apart is exactly where players lose damage. Drill the numbers, not the moves.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Alternate -12 and -13 punishes correctly.",
          },
          difficulty: "medium",
          tags: ["punisher"],
          moveKeys: ["kick4-1", "df4", "df1"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "-14 — Three Choices",
          notation: "b+4,3 · f+4,3 · uf+1",
          purpose:
            "b+4,3 is a Heat Engager that wall splats and leads to his biggest punish combo. f+4,3 carries the Tornado. uf+1 also reaches — but its combo switches sides.",
          whenToUse:
            "Blocked -14 moves. Default to b+4,3 for the Heat and the wall splat; b+4,3 is duckable, so vary it if they catch on.",
          leverlessTip:
            "The side-switch on uf+1 is the detail that matters near a wall. Taking more damage and losing wall position is often the worse deal.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish -14 with b+4,3 and convert into the staple combo.",
          },
          difficulty: "medium",
          tags: ["punisher", "heat engager", "wall splat"],
          moveKeys: ["b4-3", "f4-3", "uf1"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "-15 — the Only Launcher",
          notation: "df+2",
          purpose:
            "Scimitar is his single standing launcher. There is no faster one and no alternative, so the -15 read has to be right — but when it is, it is a full combo.",
          whenToUse:
            "Blocked -15 moves. Since it is his only launch option, knowing which moves in a matchup are -15 is unusually valuable for him.",
          leverlessTip:
            "It is -12 on block, so a wrong guess is punished. With only one launcher there is no safe fallback here — this is a knowledge check as much as an execution one.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with df+2 and convert the combo.",
          },
          difficulty: "medium",
          tags: ["launcher", "punisher", "core"],
          moveKeys: ["df2"],
        },
        {
          id: "punish-heavy",
          stageId: "punishment",
          name: "-17 and Beyond",
          notation: "f+1+2 · f+3,1+2 · uf,n,4",
          purpose:
            "The heavy end. f+1+2 is a long-range punisher Wavu compares to a Deathfist; f+3,1+2 covers -20 as a Heat Engager with his biggest punish combo; uf,n,4 covers -23.",
          whenToUse:
            "Big blocked commitments and whiffed launchers. f+1+2 is the one to remember — it reaches from distances where nothing else of his does.",
          leverlessTip:
            "uf,n,4 needs a neutral between the uf and the 4. On a leverless that is a clean release rather than a stick passing back through centre.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Pick the correct punish for -17, -20 and -23 situations.",
          },
          difficulty: "medium",
          tags: ["punisher", "heat engager"],
          moveKeys: ["f1plus2", "f3-1plus2", "ufn4"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouching Punishment",
          notation: "ws4 · ws1,3 · ws1+2 · ws2",
          purpose:
            "ws4 at -11, then three different -12 options, then ws2 LAUNCHES at -15. The standout is ws1+2 — Wavu specifically calls it out as an i12 punish from crouch that is also a Heat Engager.",
          whenToUse:
            "Every blocked low. ws1,3 wall splats; ws1+2 gives Heat; ws2 gives the combo. Pick by what the round needs.",
          leverlessTip:
            "Three -12 options is unusual. Learn ws1+2 as the default, because getting Heat off a blocked low is worth more than the small damage difference.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["crouch", "punisher", "heat engager", "launcher"],
          moveKeys: ["ws4", "ws1-3", "ws1plus2", "ws2"],
        },
        {
          id: "whiff-punish",
          stageId: "punishment",
          name: "Whiff Punishment",
          notation: "b+1,2 · b+4,3",
          purpose:
            "Only two listed whiff punishers, but both are excellent: b+1,2 carries the Tornado and b+4,3 is a Heat Engager that wall splats. Wavu rates his whiff punishment above average.",
          whenToUse:
            "Every whiffed move in front of you. Because his counter-hit game is weak, whiff punishment is where a large share of his damage actually comes from.",
          leverlessTip:
            "Buffer during your own backdash recovery. For a character whose offense is slow to start, punishing a mistake is often faster than forcing your way in.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Backdash a CPU attack and whiff punish with b+1,2 or b+4,3.",
          },
          difficulty: "medium",
          tags: ["whiff punish", "core"],
          moveKeys: ["b1-2", "b4-3"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — THE THROW GAME                                    */
    /* ------------------------------------------------------------ */
    {
      id: "throws",
      number: 5,
      name: "The Throw Game",
      focus: "Sambo — and the ones you cannot break",
      description:
        "Wavu calls this a complete throw game, and the phrase is doing real work: Dragunov has command throws, feints that become throws, tackles off strings, throws that remove recoverable health, and several that cannot be broken at all. In Heat, more of them become unbreakable. This is the layer that makes his blocking pressure into a genuine threat.",
      items: [
        {
          id: "throw-breaks",
          stageId: "throws",
          name: "Breaks and What Ignores Them",
          notation: "1 · 2 · 1+2",
          purpose:
            "The system first. Throws break on 1, 2, or 1+2 depending on the input. What matters for Dragunov is the exceptions: several of his throws cannot be broken at all, and Heat converts more of them into that category.",
          whenToUse:
            "Every round in both directions. Knowing which of his throws are breakable and which are not is the difference between a guess and a free 45 damage.",
          leverlessTip:
            "Breaks are pure button presses with no direction, so a leverless has no disadvantage. Practise 1+2 as a chord that lands on one frame — a split input fails the break entirely.",
          drill: {
            type: "manual",
            checklist: [
              "Name which button breaks the Ambush Tackle and Feint & Catch.",
              "Name two Dragunov throws that cannot be broken at all.",
              "Explain what Heat changes about his throws.",
              "Break ten throws in Practice mode.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "throws"],
        },
        {
          id: "cold-fate",
          stageId: "throws",
          name: "Cold Fate",
          notation: "d+1+3 / d+2+4",
          purpose:
            "A throw that doubles as a combo ender. It shows up as the guaranteed follow-up after f,F+4, uf+1, b+1+2 and 4,3 — which makes it the most useful single throw in his kit.",
          whenToUse:
            "As a combo ender first, as a neutral throw second. f,F+4 into Cold Fate is 45 damage for two inputs.",
          leverlessTip:
            "Both inputs give the same throw, so use whichever chord your hand prefers. Learning it as a combo ender means you get the reps without needing to land a neutral grab.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land f,F+4 and follow with Cold Fate for the guaranteed damage.",
          },
          difficulty: "easy",
          tags: ["throw", "combo ender", "damage"],
          moveKeys: ["cold-fate", "ff4", "uf1", "b1plus2"],
        },
        {
          id: "feint-catch",
          stageId: "throws",
          name: "Feint & Catch",
          notation: "1,3,2~1+2",
          purpose:
            "A string that feints into a throw and is +5 ON BLOCK. It breaks with 1+2 normally — and Heat makes it completely UNBREAKABLE while consuming part of the Heat timer.",
          whenToUse:
            "Against opponents conditioned to block the 1,3,2 string. In Heat it becomes a genuine unblockable-by-any-means grab out of a blocked string.",
          leverlessTip:
            "The 1+2 goes in at frame 21 of the string, so this is a deliberate input rather than a mash. There is a low version too — db+3~1+2 — feinting the sweep instead.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Land Feint & Catch out of the string, then again in Heat.",
          },
          difficulty: "medium",
          tags: ["throw", "heat", "plus on block"],
          moveKeys: ["feint-catch", "feint-low-catch"],
        },
        {
          id: "ambush-tackle",
          stageId: "throws",
          name: "Ambush Tackle",
          notation: "b+4,2,1+2 · PGR.1+2",
          purpose:
            "A tackle that comes out of his strings. It breaks with 1+2 — and like Feint & Catch, it becomes UNBREAKABLE during Heat. In Heat he can also perform it after additional moves.",
          whenToUse:
            "Off b+4,2 when they are blocking, and out of Pigeon Roll at the wall. The tackle leads into its own follow-up throws.",
          leverlessTip:
            "This is why Heat matters so much for him: outside Heat this is a 1+2 guess, inside Heat it is simply damage. Save your Heat for a moment where you can force this.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Land the Ambush Tackle from a string, then again in Heat.",
          },
          difficulty: "medium",
          tags: ["throw", "heat", "unbreakable"],
          moveKeys: ["ambush-tackle", "pgr-tackle", "b4-2"],
        },
        {
          id: "unbreakable",
          stageId: "throws",
          name: "The Unbreakable Ones",
          notation: "uf+3+4 · f,f,F+4 · b+3+4:1+2",
          purpose:
            "Three throws that no button escapes. Scorpion Scissors (uf+3+4) can only be avoided by DUCKING it. wr4's attack throw is unbreakable. And Inertia Kick's throw removes recoverable health outright.",
          whenToUse:
            "As hard reads on opponents who have learned to break everything else. If they are standing and expecting to break, these simply land.",
          leverlessTip:
            "b+3+4:1+2 needs a just-frame input normally — but Wavu notes the just frame is NOT required during Heat. Another reason Heat is when you push hardest.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Land each unbreakable throw once and note how the opponent could have avoided it.",
          },
          difficulty: "hard",
          tags: ["throw", "unbreakable", "read"],
          moveKeys: ["uf3plus4", "wr4", "b3plus4-throw"],
        },
        {
          id: "command-throws",
          stageId: "throws",
          name: "The Command Throws",
          notation: "f+2+3 · f+1+4",
          purpose:
            "Two i11 command throws — Victor Clutch and its reverse. Fast enough to genuinely contest a turn, and they round out the grab options his blocking pressure sets up.",
          whenToUse:
            "At close range when they are standing still and respecting your mids. At i11 they are faster than most of what they might press.",
          leverlessTip:
            "Both are chords with f. Mixing an i11 throw into pressure that is already plus on block is what turns 'they have to block' into 'they cannot just block'.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land each command throw from close-range pressure.",
          },
          difficulty: "easy",
          tags: ["throw", "i11"],
          moveKeys: ["f2plus3", "f1plus4"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 06 — COMBOS                                            */
    /* ------------------------------------------------------------ */
    {
      id: "combos",
      number: 6,
      name: "Combos",
      focus: "One route, one cancel",
      description:
        "Dragunov's damage is high and his routes are consistent — almost everything funnels through 4,4 into FC.df+1,4 and out through Sneak. Start with the mini-combos, which need no execution at all, then learn the staple and the crouch cancel that makes his optimal routes work.",
      items: [
        {
          id: "mini-combos",
          stageId: "combos",
          name: "Guaranteed Mini-Combos",
          notation: "f,F+4 → d+1+3 · uf+1 → d+1+3 · CH f,F+2 → ws1+2",
          purpose:
            "Free damage that needs no execution. f,F+4 into Cold Fate is 45. A counter-hit f,F+2 into Frost Tackle is 46 and engages Heat. b+1+2 and 4,3 also lead into Cold Fate.",
          whenToUse:
            "Every time one of those moves lands. Most new Dragunov players simply never take these.",
          leverlessTip:
            "Notice the pattern: the follow-up is almost always Cold Fate or Frost Tackle. Two enders cover nearly every mini-combo he has.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land f,F+4 and take the guaranteed Cold Fate.",
          },
          difficulty: "easy",
          tags: ["mini-combo", "damage"],
          moveKeys: ["ff4", "cold-fate", "uf1", "ws1plus2", "ff2"],
        },
        {
          id: "bnb",
          stageId: "combos",
          name: "The Bread and Butter",
          notation: "4,4 → FC.df+1,4~2 (SNK.2 T!) → df+3+4 → 2,1~DF → SNK.1+2",
          purpose:
            "The route off df+2 and his other launchers. Every part of it is something you already drilled: 4,4 from Stage 2, the Sneak transition from Stage 2, and Frost Tackle from Stage 4.",
          whenToUse:
            "Off df+2, ws2, and his Heat Dash conversions.",
          leverlessTip:
            "The ender is worth understanding: 2,1~DF enters Sneak, and SNK.1+2 is simply another way of inputting ws1+2 — the same Frost Tackle you use as a crouch punish. Wavu's combo notation writes it as qcf+1+2.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full bread and butter from a df+2 launch with no drops.",
          },
          difficulty: "hard",
          tags: ["BNB", "combo"],
          moveKeys: ["df2", "kick4-4", "fc-df1-4", "snk2", "df3plus4", "right-1", "ws1plus2"],
        },
        {
          id: "crouch-cancel",
          stageId: "combos",
          name: "Sneak Crouch Cancel",
          notation: "u~n during the dash",
          purpose:
            "Wavu's second listed key technique for him, and the thing that unlocks his optimal damage. Cancelling the Sneak transition lets you link moves that otherwise will not connect.",
          whenToUse:
            "In optimal combo routes after 2,1~DF, FC.df+1,4 or 3,1~DF. It can be done at any point of the dash, so the timing is forgiving once you find it.",
          leverlessTip:
            "u~n means tapping up and returning to neutral — on a leverless that is a clean press-and-release of one button, which is markedly easier than the same motion on a stick.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Crouch cancel out of a Sneak transition and continue the combo.",
          },
          difficulty: "expert",
          tags: ["execution", "combo", "signature"],
          moveKeys: ["snk2", "kick3-1"],
        },
        {
          id: "staple",
          stageId: "combos",
          name: "The Optimal Staple",
          notation: "4,4 → FC.df+1,4 → cc → 3,1~DF → SNK.2 (T!) → df+3+4 → 4,1",
          purpose:
            "The crouch-cancel route, worth around 50 damage. This is the version you graduate to once the cancel is reliable — same shape as the bread and butter, one extra link.",
          whenToUse:
            "Once the crouch cancel is consistent. Until then the bread and butter loses you very little.",
          leverlessTip:
            "FC.df+1,4 has a just-frame input worth one extra point of damage. Ignore that until everything else is automatic — one damage is not worth a dropped combo.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Full optimal staple with the crouch cancel, no drops.",
          },
          difficulty: "expert",
          tags: ["combo", "damage", "execution"],
          moveKeys: ["kick4-4", "fc-df1-4", "kick3-1", "snk2", "df3plus4", "kick4-1"],
        },
        {
          id: "wall-game",
          stageId: "combos",
          name: "The Wall",
          notation: "b+4,3 · ws1,3 · Pigeon Roll oki",
          purpose:
            "b+4,3 and ws1,3 are his wall splat moves. But the real wall value is what happens after: Wavu credits Pigeon Roll 2 and 3 with giving him amazing okizeme at the wall.",
          whenToUse:
            "Any wall carry. Remember the side-switch warning — b+1+2 and uf+1 routes give up wall position for damage, which near a wall is usually the wrong trade.",
          leverlessTip:
            "Learn the Pigeon Roll wall setup rather than chasing maximum wall damage. A mid/low/unbreakable-tackle guess against a cornered opponent is worth more than a few extra points.",
          drill: {
            type: "manual",
            checklist: [
              "Identify Dragunov's two wall splat moves.",
              "Carry an opponent to the wall in one combo.",
              "Land a wall combo and follow it with a Pigeon Roll setup.",
              "Name which of his combo routes give up wall position.",
            ],
          },
          difficulty: "hard",
          tags: ["wall", "okizeme"],
          moveKeys: ["b4-3", "ws1-3", "pgr2", "pgr3", "pgr-tackle"],
          verifyInGame:
            "Wall routes depend on stage geometry and carry angle. Build yours in Practice mode on the stages you actually play.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — LOWS & MIXUP                                      */
    /* ------------------------------------------------------------ */
    {
      id: "lows",
      number: 7,
      name: "Lows & Mixup",
      focus: "What makes the blocking stop",
      description:
        "All that plus-on-block pressure only works if standing and blocking is genuinely dangerous. These are the lows that make it dangerous — including two that are heavily punishable and one that turns into a throw on hit.",
      items: [
        {
          id: "snake-edge",
          stageId: "lows",
          name: "Clipping Sweep",
          notation: "db+3",
          purpose:
            "His snake edge. It counter-hits for +67a — a full combo — but it is -26 on block. This is the biggest single low reward he has and the biggest single risk.",
          whenToUse:
            "Only against opponents who have genuinely stopped moving. It is slow enough to be blocked on reaction by anyone watching for it.",
          leverlessTip:
            "Never throw it twice in a round against the same person. It also has a feint version — db+3~1+2 — that converts the same animation into a throw instead.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 5,
            rep: "Land Clipping Sweep against a conditioned opponent and convert.",
          },
          difficulty: "medium",
          tags: ["low", "launcher", "high risk"],
          moveKeys: ["snake-edge", "feint-low-catch"],
        },
        {
          id: "power-low",
          stageId: "lows",
          name: "Deadly Scorpion",
          notation: "db+3+4",
          purpose:
            "His power low. Big damage and a counter-hit combo, at the cost of being -31 on block — the most punishable move in his kit.",
          whenToUse:
            "As a hard read, usually once a round at most. The reward is real; the risk is a guaranteed launch against you.",
          leverlessTip:
            "-31 means almost anyone launches you for free. Treat this as a round-deciding gamble rather than part of your rotation.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 5,
            rep: "Land the power low as a read and take the counter-hit reward.",
          },
          difficulty: "medium",
          tags: ["power low", "high risk", "read"],
          moveKeys: ["power-low"],
        },
        {
          id: "working-lows",
          stageId: "lows",
          name: "The Working Lows",
          notation: "d+2 · d+4 · b+2,1,3",
          purpose:
            "The lows you actually use every round. d+2 is his quick low check with a counter-hit knockdown; d+4 and the b+2,1,3 ender keep opponents from simply standing.",
          whenToUse:
            "Constantly and in small doses. These do not need to land to be worth throwing — they need to make crouching a thought.",
          leverlessTip:
            "Remember the remap: his generic low kick is on db+4, not d+4. Two different buttons, two different moves, and reaching for the wrong one mid-pressure is a common mistake.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix d+2 and d+4 into your pressure without being launched.",
          },
          difficulty: "easy",
          tags: ["low", "poke"],
          moveKeys: ["d2", "d4", "b2-1-3", "d3"],
        },
        {
          id: "snk3",
          stageId: "lows",
          name: "Slay Ride",
          notation: "SNK.3 (qcf+3)",
          purpose:
            "A low out of Sneak that becomes a THROW on hit. Coming out of the same stance that holds SNK.4 at +7 on block, it is the low half of a genuine stance mixup.",
          whenToUse:
            "Out of Sneak against opponents standing to block SNK.4. It is -16 on block, so it is a read rather than a rotation.",
          leverlessTip:
            "Sneak is where his mixup actually lives: SNK.4 is a plus mid, SNK.3 is a low that grabs, SNK.1 is a launcher and SNK.2 is the tornado. One stance, four completely different threats.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Run the Sneak mid/low mixup against a blocking CPU.",
          },
          difficulty: "medium",
          tags: ["low", "stance", "mixup"],
          moveKeys: ["snk3", "snk4", "snk1"],
        },
        {
          id: "the-mixup",
          stageId: "lows",
          name: "Building the Guess",
          notation: "",
          purpose:
            "Assemble the offense. Plus-on-block mids force them to block. Lows punish blocking. Throws punish standing still. The mixup is not one move — it is the order you present them in.",
          whenToUse:
            "Every round. Track what they are doing about your pressure and pick the answer that punishes it.",
          leverlessTip:
            "Because his key moves are linear, the option they will find first is sidestepping. Have f,F+3 and your homing tools ready before that happens.",
          drill: {
            type: "manual",
            checklist: [
              "Play a round using only plus-on-block mids and note when they start pressing.",
              "Land one low immediately after they start blocking.",
              "Land one throw immediately after they start ducking.",
              "Catch a sidestep with a homing move.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "mixup", "gameplan"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 08 — DEFENSE, HEAT & GAMEPLAN                          */
    /* ------------------------------------------------------------ */
    {
      id: "gameplan",
      number: 8,
      name: "Defense, Heat & Gameplan",
      focus: "Chip damage and honest limits",
      description:
        "Dragunov's defense is deliberately modest — Wavu describes his parries as fairly low-reward and says he leans on movement instead. Heat is where he stops being modest: the chip damage means blocking itself costs the opponent life, and his throws stop being escapable.",
      items: [
        {
          id: "parries",
          stageId: "gameplan",
          name: "The Parries",
          notation: "b+1+3 / b+2+4 · d+1+2",
          purpose:
            "Two of them: b+1+3 parries high and mid attacks, and d+1+2 is a dedicated low parry. Wavu is candid that these are fairly low-reward — they buy you a turn, not a combo.",
          whenToUse:
            "Against pressure you have read, when movement is not available. Do not expect them to carry your defense.",
          leverlessTip:
            "b+1+3 and b+2+4 both give the same parry, so use whichever chord sits better under your hand. The low parry is a separate input and worth drilling on its own.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Parry a mid string, then low parry a low.",
          },
          difficulty: "hard",
          tags: ["defense", "parry", "read"],
          moveKeys: ["parry", "low-parry"],
        },
        {
          id: "sabaki-crush",
          stageId: "gameplan",
          name: "Sabaki & Power Crush",
          notation: "b+3+4 · 1+2 · SNK.3+4",
          purpose:
            "b+3+4 is his sabaki, and it leads into an unbreakable throw with a just frame. 1+2 is a Power Crush. SNK.3+4 also absorbs, converting into an attack throw when it eats a hit.",
          whenToUse:
            "Against predictable pressure. SNK.3+4 is the interesting one — absorbing a hit inside your own stance turns their turn into your throw.",
          leverlessTip:
            "Power Crush does not absorb lows or throws. Given how modest his defensive options are, these are reads on specific strings rather than a general escape plan.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Absorb a string with 1+2 or SNK.3+4 and take your turn back.",
          },
          difficulty: "medium",
          tags: ["defense", "power crush", "sabaki"],
          moveKeys: ["bloodhound", "snk3plus4", "b3plus4", "b3plus4-throw"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat: Blocking Costs Them",
          notation: "1,2,1 · f+3,1+2 · b+4,3 · SNK.4 · ws1+2",
          purpose:
            "Wavu's description is that his pressure becomes even more chilling in Heat due to constant chip damage, which coupled with his pokes punishes the opponent even for blocking. On top of that, Feint & Catch and the Ambush Tackles become unbreakable.",
          whenToUse:
            "Engage with any of the five Engagers, then run the exact same plus-on-block pressure — except now blocking drains their health and your throws cannot be escaped.",
          leverlessTip:
            "All five Engagers are things you already use: an i10 string, a -20 punish, a -14 punish, your +7 stance move and your crouch punish. You do not need to change your game to get Heat, which is why he is described as straightforward.",
          drill: {
            type: "manual",
            checklist: [
              "Name all five Heat Engagers without looking.",
              "Engage Heat and win an exchange purely through chip damage.",
              "Land an unbreakable Ambush Tackle in Heat.",
              "Land the Heat Smash and note the 50-damage throw on the first hit.",
            ],
          },
          difficulty: "medium",
          tags: ["heat", "chip damage", "signature"],
          moveKeys: ["jab-2-1", "f3-1plus2", "b4-3", "snk4", "ws1plus2", "heat-smash"],
        },
        {
          id: "linear",
          stageId: "gameplan",
          name: "The Linear Problem",
          notation: "",
          purpose:
            "The weakness that will actually lose you games. Wavu states it plainly: most — if not all — of his key moves have little to no tracking, making him very vulnerable to lateral movement.",
          whenToUse:
            "Every time your pressure suddenly stops working. Nine times out of ten they have started stepping, not blocking better.",
          leverlessTip:
            "Know your homing tools cold: f,F+3 and 1,3,2~1+2 track. Almost nothing else does. Against a stepping opponent those two moves are your entire offense until they stop.",
          drill: {
            type: "manual",
            checklist: [
              "List which of Dragunov's moves are homing.",
              "Set the CPU to sidestep and find which of your pressure whiffs.",
              "Win an exchange against a stepping CPU using only homing moves.",
              "Explain why his side-switching combos are a problem at the wall.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty"],
          moveKeys: ["ff3", "feint-catch"],
        },
        {
          id: "the-plan",
          stageId: "gameplan",
          name: "The Dragunov Gameplan",
          notation: "",
          purpose:
            "Assemble it. Approach, land a plus-on-block mid, and keep landing them. Punish everything with the deep ladder. Use lows and throws only when blocking has become their habit. Take Heat and make blocking itself lethal.",
          whenToUse:
            "Every round. Wavu describes him as fairly simple and straightforward, with success directly proportional to skill — there is no trick here, only execution of a clear plan.",
          leverlessTip:
            "Be honest about the four weaknesses: he is interruptible, he side-switches, he is linear, and his counter-hit game is below average. None of them are fatal, but all four point the same direction — win with pressure and punishment, not by trading buttons.",
          drill: {
            type: "manual",
            checklist: [
              "Win a round where every knockdown comes from pressure rather than a mixup.",
              "Punish four different frame situations correctly in one match.",
              "Spend a full Heat window forcing chip damage.",
              "Review one loss and name which of the four weaknesses cost you.",
            ],
          },
          difficulty: "hard",
          tags: ["gameplan", "concept"],
        },
      ],
    },
  ],

  punishQuiz: [
    {
      id: "q-10",
      prompt: "-10",
      situation: "You blocked a string ender. You are standing.",
      options: ["2,1 (then DF for Sneak)", "4,1", "df+2", "b+4,3"],
      correctIndex: 0,
      explain:
        "2,1 is his i10 punish — and adding DF leaves you in Sneak at +10 on hit, so the punish becomes the start of your pressure.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke and you do not need a mid.",
      options: ["4,1", "df+4", "df+1", "df+2"],
      correctIndex: 0,
      explain:
        "4,1 is the -12 punish by damage. Wavu's note: only use df+4 over 4,1 if you specifically need the mid.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked an unsafe mid and their back is near a wall.",
      options: ["b+4,3", "uf+1", "df+1", "2,1"],
      correctIndex: 0,
      explain:
        "b+4,3 is a Heat Engager that wall splats. uf+1 also covers -14 but its combo SWITCHES SIDES — near a wall that gives up the position you just earned.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["df+2 → combo", "b+4,3", "4,1", "f+1+2"],
      correctIndex: 0,
      explain:
        "df+2 is his ONLY standing launcher. There is no faster one and no alternative, so knowing which moves are -15 in a matchup matters more for him than for most.",
    },
    {
      id: "q-17",
      prompt: "-17",
      situation: "They whiffed something huge, but you are far away.",
      options: ["f+1+2", "df+2", "2,1", "ws4"],
      correctIndex: 0,
      explain:
        "f+1+2 is his long-range punisher — Wavu compares it to a Deathfist. At that distance nothing else of his reaches.",
    },
    {
      id: "q-20",
      prompt: "-20",
      situation: "A blocked Rage Art. Standing, in range.",
      options: ["f+3,1+2", "df+2", "b+4,3", "uf,n,4"],
      correctIndex: 0,
      explain:
        "f+3,1+2 is the -20 punish, a Heat Engager, and his biggest punish combo. uf,n,4 covers -23 if the window is even larger.",
    },
    {
      id: "q-ws11",
      prompt: "-11 ws",
      situation: "You blocked a low. You are crouching.",
      options: ["ws4", "ws2", "ws1+2", "ws1,3"],
      correctIndex: 0,
      explain:
        "ws4 is the -11 crouching punish at only -5 on block. The -12 options need one more frame.",
    },
    {
      id: "q-ws12",
      prompt: "-12 ws",
      situation: "Blocked a worse low, and you want Heat.",
      options: ["ws1+2", "ws4", "ws2", "df+1"],
      correctIndex: 0,
      explain:
        "ws1+2 (Frost Tackle) is an i12 punish from crouch AND a Heat Engager — Wavu calls it out by name as one of his standout tools. ws1,3 also covers -12 and wall splats.",
    },
    {
      id: "q-ws15",
      prompt: "-15 ws",
      situation: "You blocked a badly unsafe low. Crouching.",
      options: ["ws2 → combo", "ws4", "ws1,3", "d+2"],
      correctIndex: 0,
      explain:
        "ws2 (Ballistic Upper) launches at -15. Between ws2 and df+2 he has exactly two launch punishes — one standing, one crouching, both at -15.",
    },
    {
      id: "q-whiff",
      prompt: "WHIFF",
      situation: "They whiffed a long poke and you backdashed it cleanly.",
      options: ["b+4,3 or b+1,2", "d+2", "db+3", "SNK.3"],
      correctIndex: 0,
      explain:
        "Those are his two listed whiff punishers — b+4,3 gives Heat and a wall splat, b+1,2 gives the Tornado. Because his counter-hit game is below average, whiff punishment carries a large share of his damage.",
    },
  ],
};
