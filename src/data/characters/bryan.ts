import type { Character } from "@/types";

/**
 * Bryan Fury — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki's live Cargo database
 * (wavu.wiki/t/Bryan, _movelist, _punishers, _combos) and TekkenDocs,
 * August 2026. Facts baked in — each was checked, several corrected:
 *  - b+1 is +4 ON BLOCK and CH-launches for +78a. His single best button.
 *  - f+3 is +0~+2 on block, CH +50a — a plus-on-block mid that CH launches.
 *  - f,n,b+2 (Jet Upper) is an i14 launcher but it is a HIGH. Duckable.
 *  - qcb+1 (Wavu: SWA.1) is +1 on block, CH +72a Tornado. Nerfed in 3.02.01.
 *  - 1,2,1 is One Two Body Blow (mid, -6). "Snake Bite" is 1+2,1 — different move.
 *  - Taunt (1+3+4) is a 0-damage UNBLOCKABLE mid: i28~31, +16 on hit, grants
 *    Snake Eyes, cancellable frames 1~31, and -34 if you let it ride and whiff.
 *  - Stances: SLS (Slither Step) = qcf · SWA (Sway) = qcb · SNE (Snake Eyes) = 1+3+4
 *  - Pressure transitions: b+2,1~f enters SLS at +7 · b+3~f at +1 · 4,1~B enters SWA at +8
 *  - Punish ladder is honestly middling: -10 1,4 | -12 4,3 | -13 df+2,1 |
 *    -14 f,n,b+2 (LAUNCH) | -15 f+2,1,4 | -16 b+4 | -18 f+4,1
 *  - Crouching: -11 ws4 | -12 ws3 | -13 FC.df+2,1 | -15 ws1 (LAUNCH) | -18 ws2
 *  - Heat grants access to Snake Eyes moves; Season 3 takes SNE away when Heat ends.
 */

export const bryan: Character = {
  id: "bryan",
  name: "Bryan Fury",
  style: "Kickboxing",
  tagline:
    "The counter-hit monster. Slow, punishing, and terrifying to press a button against — if you can pay the execution tax.",
  available: true,
  accent: { base: "#84cc16", bright: "#bef264", deep: "#4d7c0f" },
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT & THE SWAY PROBLEM                       */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement & the Sway Problem",
      focus: "Earn your space before you use it",
      description:
        "Bryan is a keep-out character, which means his whole game is decided by distance. He is also the character with the most awkward movement in the game: his own Sway stance lives on the same directional path as a backdash cancel, so sloppy inputs turn an escape into a committed stance. Fix the inputs first — everything after this stage assumes you can hold a range.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance and lets you block immediately after. Bryan's buttons are long but slow, so you rarely dash in to attack — you dash in to be in range for the moment they attack.",
          whenToUse:
            "When the opponent is outside 3+4 range and standing still. Dash, block, and let them walk into your keep-out.",
          leverlessTip:
            "Tap f twice with a full release between taps. On leverless the release is the neutral — if the first f never lifts, the second tap does nothing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash in from round-start range and return to block without getting hit (set the CPU to jab periodically).",
          },
          difficulty: "easy",
          tags: ["fundamental"],
        },
        {
          id: "backdash",
          stageId: "movement",
          name: "Backdash",
          notation: "b,b",
          purpose:
            "Makes attacks whiff in front of you. This is Bryan's win condition in miniature: he does not need to open you up if he can make you miss and then charge you 40+ damage for it.",
          whenToUse:
            "After blocking a string that ends close, or any time you expect a swing. Backdash, watch it whiff, then take f+4,1.",
          leverlessTip:
            "Full release between the two b presses. Do not add a d — read the next item to find out what happens if you do.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash so the CPU's jab whiffs cleanly in front of you.",
          },
          difficulty: "easy",
          tags: ["fundamental"],
        },
        {
          id: "sway-problem",
          stageId: "movement",
          name: "The Sway Problem",
          notation: "qcb = d,db,b",
          purpose:
            "Understand why Bryan's movement is rated the worst in the cast. Sway is entered with qcb — d, db, b. That is the same family of directions your fingers pass through when you cancel a backdash. Feed the game a stray d before your db and you get a committed stance instead of movement, and Sway does not block.",
          whenToUse:
            "Every time you back off. This is a diagnosis item, not an attack: you are learning to see the failure so you can stop it.",
          leverlessTip:
            "This is one of the few places a leverless is straightforwardly better than a stick. You never roll through directions — you press exactly db by pressing d and b together. Keep your b finger anchored and tap d; you will never accidentally produce a clean d,db,b.",
          drill: {
            type: "manual",
            checklist: [
              "Turn on the input display in Practice mode.",
              "Backdash ten times and confirm the display never shows a Sway transition.",
              "Deliberately input d,db,b once so you can see what the mistake looks like on screen.",
              "State the rule out loud: my backdash cancel never starts from a pure d.",
            ],
          },
          difficulty: "medium",
          tags: ["fundamental", "execution"],
          verifyInGame:
            "Wavu lists Bryan's weaknesses as a bad backdash cancel plus 'needing proper inputs due to backsway'. Confirm on your own board with the input display — the exact directions that leak into Sway depend on how you press db.",
        },
        {
          id: "kbd",
          stageId: "movement",
          name: "Korean Backdash",
          notation: "b,b~db, b,b~db, ...",
          purpose:
            "Chained backdash cancels — the fastest retreat in the game. Bryan's is genuinely poor, so you will never outrun anyone. You use it to hold a range band, not to escape.",
          whenToUse:
            "Between exchanges, to sit exactly where 3+4 and qcb+1 reach and their pokes do not.",
          leverlessTip:
            "Anchor b, drum d. The loop is b, b, then tap d while b is still held, release both, repeat. Rhythm before speed — a rushed KBD is exactly how Sway sneaks out.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Four clean backdash cancels in a row with no Sway transition on the input display.",
          },
          difficulty: "hard",
          tags: ["fundamental", "execution"],
        },
        {
          id: "slither-step",
          stageId: "movement",
          name: "Slither Step",
          notation: "qcf (SLS)",
          purpose:
            "Bryan's forward-moving stance. It closes distance while staying actionable on frame 1, and it is the destination of his best pressure strings — b+2,1 slides into it at +7.",
          whenToUse:
            "As an approach when they are respecting your keep-out, and as the tail of a blocked string to keep your turn alive.",
          leverlessTip:
            "qcf on leverless is three states, not a roll: press d, add f so both are held (that is df), then release d leaving f. Say it as down, down-forward, forward. You can cancel it back to block with b on frames 1~9, so it is not a full commitment.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Slither Step from neutral and cancel it to block with b before it reaches you.",
          },
          difficulty: "medium",
          tags: ["stance"],
          moveKeys: ["sls2", "sls4"],
        },
        {
          id: "sway-stance",
          stageId: "movement",
          name: "Sway",
          notation: "qcb (SWA)",
          purpose:
            "The stance that makes his movement awkward is also one of his best weapons. Sway leans back — it can make highs whiff — and it holds qcb+1, a +1-on-block high that counter-hit launches for 72.",
          whenToUse:
            "Deliberately, at range, when you want to bait a high or open with your best counter-hit tool. Never by accident.",
          leverlessTip:
            "d, then db (d and b together), then b alone. The same three-state discipline as Slither Step, mirrored. Enter it on purpose and the stance stops being a hazard.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Sway from neutral on purpose, then follow with qcb+1 or block.",
          },
          difficulty: "medium",
          tags: ["stance"],
          moveKeys: ["swa1", "swa2", "swa3", "swa4"],
        },
        {
          id: "snake-slash",
          stageId: "movement",
          name: "Snake Slash",
          notation: "f,f,F+3",
          purpose:
            "A running mid that is plus on block. It is the one approach in his kit that does not hand the turn back, which matters enormously for a character this slow.",
          whenToUse:
            "From a run, to close a gap and keep your turn. It also Balcony Breaks, so it is a stage-carry tool.",
          leverlessTip:
            "f, f, then hold f and press 3. The final f must be held, not tapped — that is what separates the run attack from a plain f+3.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land Snake Slash from a run and confirm you are plus on block.",
          },
          difficulty: "medium",
          tags: ["approach", "plus on block"],
          moveKeys: ["snake-slash"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 02 — SMALL TEKKEN                                      */
    /* ------------------------------------------------------------ */
    {
      id: "pokes",
      number: 2,
      name: "Small Tekken",
      focus: "His weakest area — learn the few that work",
      description:
        "Be honest about this one. Wavu's own summary says Bryan's small Tekken is weak and that he struggles against faster characters with better pokes. You are not going to win jab wars. What you need is a small, reliable set of buttons that check a turn and let you get back to the range where he is actually scary.",
      items: [
        {
          id: "df2",
          stageId: "pokes",
          name: "Elbow",
          notation: "df+2",
          purpose:
            "His i13 mid check at -6 on block. This is the button that stops opponents from crouching under everything you do.",
          whenToUse:
            "Any time you need a fast mid. Follow with df+2,1 when you have the frames — it is his -13 punisher and it slides into Sway with b.",
          leverlessTip:
            "df is d and f pressed together, not a roll. Press them as a chord with 2.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Land df+2 as a turn-check, then block immediately.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke"],
          moveKeys: ["df2", "df2-1"],
        },
        {
          id: "d2",
          stageId: "pokes",
          name: "Body Blow",
          notation: "d+2",
          purpose:
            "Only -2 on block and +8 on crouching hit, with a transition to full crouch if you hold D. For a character with bad small Tekken this is a genuinely excellent poke.",
          whenToUse:
            "As your safest mid at close range, and as a way to get into full crouch so ws3 and ws1 become available.",
          leverlessTip:
            "Hold d through the recovery to stay in full crouch — you are one ws3 away from an i12 counter-hit launcher.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "d+2 held into full crouch, then ws4 or ws3 out of it.",
          },
          difficulty: "easy",
          tags: ["mid", "-2 on block", "poke"],
          moveKeys: ["d2", "ws3", "ws4"],
        },
        {
          id: "jab-string",
          stageId: "pokes",
          name: "The Jab String & Its Fork",
          notation: "1,2 → 1,2,1 / 1,2,3 / 1,2,4",
          purpose:
            "1,2 jails on block and gives you a three-way ender: 1,2,1 is a mid, 1,2,3 is a low, and 1,2,4 is a Heat Engager. One string, a real mixup.",
          whenToUse:
            "Close range when you need something fast. Mix the enders — the low and the mid are the same string until the third input.",
          leverlessTip:
            "1,2,1 can be delayed by 10 frames. Use that: throw 1,2, watch whether they duck, then decide. Delay is free information on a leverless because your fingers are already resting on the buttons.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Throw 1,2 and pick an ender based on whether the CPU is blocking low.",
          },
          difficulty: "easy",
          tags: ["i10", "mixup", "heat engager"],
          moveKeys: ["jab-2", "jab-2-1", "jab-2-3", "jab-2-4"],
        },
        {
          id: "db2",
          stageId: "pokes",
          name: "Stomach Blow",
          notation: "db+2",
          purpose:
            "-6 on block, +8 on hit, and a core combo filler. A dependable crouching-hit poke that also shows up in every bread-and-butter route you will learn in Stage 6.",
          whenToUse:
            "Close range as a mid check, and as the first hit of your standard combo.",
          leverlessTip:
            "db is a two-button chord. Learning it cleanly here pays off in Sway, since db is the middle state of qcb.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land db+2 as a poke, then again as a combo starter.",
          },
          difficulty: "easy",
          tags: ["mid", "poke", "combo filler"],
          moveKeys: ["db2"],
        },
        {
          id: "df1-vulcan",
          stageId: "pokes",
          name: "Vulcan Cannon",
          notation: "df+1 (hold DF), 1,1,1",
          purpose:
            "A chip-pressure string. The base df+1 is -5, and holding DF unlocks the machine-gun extensions. It is not safe at the end, but it forces a decision and builds Heat.",
          whenToUse:
            "When you want to apply pressure without committing to a launcher. Stop early against opponents who press buttons.",
          leverlessTip:
            "DF must be HELD for the extensions to come out. On leverless that means two fingers pinned on d and f while a third taps 1 repeatedly — awkward the first time, then trivial. Set your hand before you start the string.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full df+1,1,1,1 with the DF held throughout — no dropped extensions.",
          },
          difficulty: "medium",
          tags: ["pressure", "execution"],
          moveKeys: ["df1", "df1-1"],
        },
        {
          id: "ws4",
          stageId: "pokes",
          name: "Toe Smash",
          notation: "ws4",
          purpose:
            "i11~12 out of crouch at only -6. Your check for the moment after you block a low or hold d+2 into full crouch.",
          whenToUse:
            "Immediately after blocking a low, or out of your own crouch. It is also his -11 crouching punisher.",
          leverlessTip:
            "While-standing moves fire as you release d. Release and press 4 as one motion — do not stand fully first.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Block a low and answer with ws4.",
          },
          difficulty: "easy",
          tags: ["i11", "crouch", "punisher"],
          moveKeys: ["ws4"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — KEEP-OUT                                          */
    /* ------------------------------------------------------------ */
    {
      id: "keepout",
      number: 3,
      name: "Keep-Out",
      focus: "The range where Bryan actually wins",
      description:
        "This is the stage that makes you a Bryan player. He does not open people up with speed — he stakes out a distance, fills it with long, punishing buttons, and makes approaching feel expensive. Every move here is chosen to make the opponent stop moving forward.",
      items: [
        {
          id: "side-kick",
          stageId: "keepout",
          name: "Middle Side Kick",
          notation: "3+4",
          purpose:
            "The iconic Bryan button. A long-reaching i18 mid that counter-hits for +59a — a full combo — and Balcony Breaks airborne opponents.",
          whenToUse:
            "At the edge of their approach range, into anyone stepping forward. It is -13 on block, so it is a read, not a habit.",
          leverlessTip:
            "3+4 is a two-button chord. Bind your fingers so 3 and 4 land on the same frame — a one-frame split gives you 3 or 4 alone, and 3 alone is a completely different move.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit an advancing CPU with 3+4 at max range.",
          },
          difficulty: "medium",
          tags: ["keep-out", "CH launcher", "signature"],
          moveKeys: ["side-kick"],
        },
        {
          id: "b1",
          stageId: "keepout",
          name: "Chopping Elbow",
          notation: "b+1",
          purpose:
            "His single best move. A mid that is +4 ON BLOCK and counter-hit launches for +78a — the highest counter-hit reward in his kit. Plus on block and a launcher on the same button.",
          whenToUse:
            "Constantly. Use it to end your turn without ending your turn: if they block it you are still plus, and if they press you launch them.",
          leverlessTip:
            "It is i20~21, so it loses every race. Do not use it as a panic button — throw it when you have the frames or the range, not when you are under pressure.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Land b+1, and take the full combo whenever it counter-hits.",
          },
          difficulty: "medium",
          tags: ["+4 on block", "CH launcher", "signature"],
          moveKeys: ["b1"],
        },
        {
          id: "f3",
          stageId: "keepout",
          name: "Knee Strike",
          notation: "f+3",
          purpose:
            "A mid that is plus on block (+0~+2 depending on range) and counter-hit launches for +50a. Alongside b+1, this is the reason opponents cannot simply hold block against Bryan.",
          whenToUse:
            "As your pressure mid. Because it is plus, you keep the turn on block — so follow it with another mid or a low and make them guess.",
          leverlessTip:
            "f+3 is a simple chord, which makes it the safest place to practise the plus-frames habit: land it, then immediately press again and feel that you are still in control.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land f+3 on block, then continue pressure with a follow-up mid.",
          },
          difficulty: "easy",
          tags: ["i16", "plus on block", "CH launcher"],
          moveKeys: ["f3"],
        },
        {
          id: "f1-2",
          stageId: "keepout",
          name: "Sidestep Elbow",
          notation: "f+1+2",
          purpose:
            "Steps to the side as it starts and is +1 on block. It evades linear attacks while staying plus — a rare combination, and a key combo filler later.",
          whenToUse:
            "Against opponents who mash a linear button when you back off. The step does the work; the plus frames keep your turn.",
          leverlessTip:
            "A three-button feel: f held with 1 and 2 pressed together. Practise the chord in isolation until 1 and 2 never split.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Evade a linear CPU attack with f+1+2 and continue pressure.",
          },
          difficulty: "medium",
          tags: ["evasive", "+1 on block", "combo filler"],
          moveKeys: ["f1-2"],
        },
        {
          id: "mach-kick",
          stageId: "keepout",
          name: "Mach Kick",
          notation: "f,F+4",
          purpose:
            "A homing high that tracks sidesteps, and its own opening sidestep evades some attacks. This is your answer to opponents who step around 3+4.",
          whenToUse:
            "When your keep-out is being sidestepped rather than walked into. It is a high, so it loses to crouching — that is the trade.",
          leverlessTip:
            "f, then hold F and press 4. Same held-forward rule as Snake Slash.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Catch a sidestepping CPU with f,F+4.",
          },
          difficulty: "medium",
          tags: ["homing", "anti-step"],
          moveKeys: ["mach-kick"],
        },
        {
          id: "orbital",
          stageId: "keepout",
          name: "Orbital Heel Kick",
          notation: "uf+4",
          purpose:
            "A jumping mid that is only -5 on block. It crushes lows and gives you an air-combo on hit — the tool that punishes opponents who answer your keep-out with a low.",
          whenToUse:
            "As a read on a low. It is i24~26, so it is a prediction, never a reaction.",
          leverlessTip:
            "uf is a two-button chord. Because it jumps, you are airborne and cannot block — commit only when you have read the low.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Crush a CPU low with uf+4 and take the combo.",
          },
          difficulty: "medium",
          tags: ["low crush", "read"],
          moveKeys: ["orbital"],
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
      focus: "Middling up close, devastating at -14",
      description:
        "Wavu describes Bryan's standing i10-i13 punishment as 'middling at best', and that is fair — his fast punishes are small. But the ladder has a cliff in it: at -14 he launches from standing with Jet Upper, and that single number is worth more than everything below it. Learn the small punishes so you stop giving away free turns, then learn the one that ends rounds.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "The i10 Punish",
          notation: "1,4 (or 2,3)",
          purpose:
            "Your fastest punish. 1,4 jails from the first hit and doubles as a whiff punisher. It is not much damage — take it anyway, because the alternative is letting unsafe moves be free.",
          whenToUse:
            "Anything you block at -10 or -11. Do not reach for something bigger and get nothing.",
          leverlessTip:
            "Buffer during blockstun: hold the inputs ready and release on the frame you recover. Leverless makes this precise because there is no travel time between directions.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 1,4 with no drops.",
          },
          difficulty: "easy",
          tags: ["i10", "punisher"],
          moveKeys: ["jab-4", "right-3"],
        },
        {
          id: "punish-12-13",
          stageId: "punishment",
          name: "-12 and -13",
          notation: "4,3 · df+2,1",
          purpose:
            "The middle of the ladder. 4,3 covers -12; df+2,1 covers -13 and slides into Sway with b, so the punish ends with you in a threatening stance.",
          whenToUse:
            "Blocked heavier pokes and string enders. Knowing which one to reach for is the whole skill.",
          leverlessTip:
            "Practise df+2,1~b as one motion. Ending a punish already in Sway means the next thing they see is qcb+1.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Alternate -12 and -13 punishes correctly against a scripted CPU.",
          },
          difficulty: "medium",
          tags: ["punisher"],
          moveKeys: ["kick-4-3", "df2-1"],
        },
        {
          id: "jet-upper-punish",
          stageId: "punishment",
          name: "Jet Uppercut — the -14 Launch",
          notation: "f,n,b+2",
          purpose:
            "The move that makes Bryan scary on defense. i14, and it launches for a full combo. Most of the cast needs -15 to launch; Bryan does it at -14, so a whole tier of 'safe-ish' moves becomes a round loss against him.",
          whenToUse:
            "Any -14 or worse block. Also his best whiff punisher at range. Be aware it is a HIGH — it whiffs entirely on a crouching opponent, which Wavu lists among his real weaknesses.",
          leverlessTip:
            "This is the leverless showpiece. With standard SOCD-neutral, hold f, then press b while f is still down — the board resolves both directions to neutral, which IS the 'n' — then release f so only b remains, and press 2. The motion executes itself. If your board is set to last-input-priority there is no neutral state between f and b, and you will get b+2 (Left Hook, a high that does not launch) instead. Check the setting before you blame your hands.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Punish a -14 move with f,n,b+2 and convert into a combo.",
          },
          difficulty: "hard",
          tags: ["i14", "launcher", "signature", "execution"],
          moveKeys: ["jet-upper"],
        },
        {
          id: "punish-15-plus",
          stageId: "punishment",
          name: "-15 and Beyond",
          notation: "f+2,1,4 · b+4 · f+4,1",
          purpose:
            "The heavy end. f+2,1,4 covers -15, b+4 covers -16 and wall splats, and f+4,1 is the -18 punish with the biggest payout.",
          whenToUse:
            "Big blocked commitments — whiffed launchers, blocked Rage Arts, heavy strings. Against a wall, b+4 is often better than more damage midscreen.",
          leverlessTip:
            "f+2,1,4 also gains Snake Eyes if you add 1+2 on hit. Get the punish first; add the stance gain once the punish itself is automatic.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Pick the correct punish for -15, -16 and -18 situations.",
          },
          difficulty: "medium",
          tags: ["punisher", "wall"],
          moveKeys: ["f2-1-4", "b4", "f4-1"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouching Punishment",
          notation: "ws4 · ws3 · FC.df+2,1 · ws1",
          purpose:
            "What you do after blocking a low. ws4 at -11, ws3 at -12, FC.df+2,1 at -13, and ws1 LAUNCHES at -15. Bryan's crouch punishment is better than his standing punishment.",
          whenToUse:
            "Every blocked low. Most players block the low and then do nothing — that is free damage you are declining.",
          leverlessTip:
            "You are already holding d to block the low. The while-standing move comes out as you release it, so the punish is a release plus a button, not a whole new input.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["crouch", "punisher", "launcher"],
          moveKeys: ["ws4", "ws3", "fc-df2-1", "ws1"],
        },
        {
          id: "whiff-punish",
          stageId: "punishment",
          name: "Whiff Punishment",
          notation: "f+4,1 · 1,4 · f,n,b+2",
          purpose:
            "Bryan's real damage source. He is slow, so he does not win exchanges — he wins by making you miss. f+4,1 is the dedicated whiff punisher; Jet Upper is the one that launches.",
          whenToUse:
            "Every time a move whiffs in front of you. Backdash, watch, punish. This is the loop the entire character is built around.",
          leverlessTip:
            "Buffer the whiff punish during your own backdash recovery. Because the Jet Upper motion resolves through SOCD, you can hold it ready and release the instant you see the whiff.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Backdash a CPU attack and whiff punish with f+4,1 or f,n,b+2.",
          },
          difficulty: "hard",
          tags: ["whiff punish", "core"],
          moveKeys: ["f4-1", "jab-4", "jet-upper"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — COUNTER-HIT WARFARE                               */
    /* ------------------------------------------------------------ */
    {
      id: "counterhit",
      number: 5,
      name: "Counter-Hit Warfare",
      focus: "Make pressing a button feel expensive",
      description:
        "Wavu calls Bryan 'the REAL counter-hitting paragon', and unlike most character-page hyperbole the numbers back it: b+1 counter-hits for 78, qcb+1 for 72, 3+4 for 59, f+3 for 50. Bryan does not need to open you up. He needs you to be impatient. This stage is about building that impatience and then collecting on it.",
      items: [
        {
          id: "ch-concept",
          stageId: "counterhit",
          name: "Stoking Tension",
          notation: "",
          purpose:
            "Understand the actual gameplan. Bryan wins by making both options bad: pressing buttons runs into counter-hit launchers, and not pressing runs into Snake Edge, Taunt and his lows. Every counter-hit you land makes the next low more effective, and vice versa.",
          whenToUse:
            "As the frame around everything else in this stage. Landing one counter-hit is a moment; making them afraid to press is a round.",
          leverlessTip:
            "No execution here. Instead, watch your replays for the frame after you land a counter-hit — did the opponent stop pressing? That change is the thing you are actually farming.",
          drill: {
            type: "manual",
            checklist: [
              "Name Bryan's four biggest counter-hit rewards and their frames.",
              "Play three rounds where you only try to counter-hit, never to open up.",
              "Notice the point in a round where the opponent stops pressing buttons.",
              "Land one Snake Edge or low immediately after that point.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "gameplan"],
        },
        {
          id: "swa1",
          stageId: "counterhit",
          name: "Cannonball Straight",
          notation: "qcb+1 (SWA.1)",
          purpose:
            "The Sway payoff. +1 on block, and a counter-hit gives +72a with Tornado already applied. It was toned down in patch 3.02.01 and it is still one of his best buttons.",
          whenToUse:
            "Out of Sway when you expect a button. It is a high, so it loses to crouching — pair it with a Sway low to cover that.",
          leverlessTip:
            "Enter Sway deliberately (d, db, b) rather than hoping for it out of movement. The clean entry is what turns Sway from a liability into this move.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Enter Sway on purpose and counter-hit with qcb+1.",
          },
          difficulty: "hard",
          tags: ["CH launcher", "tornado", "stance"],
          moveKeys: ["swa1"],
        },
        {
          id: "ws3",
          stageId: "counterhit",
          name: "High Knee Kick",
          notation: "ws3",
          purpose:
            "i12 out of crouch and counter-hit launches for +33a. The fastest counter-hit launcher he owns — the reward for spending time in full crouch.",
          whenToUse:
            "Out of a held d+2, or immediately after blocking a low when you expect them to press again.",
          leverlessTip:
            "Hold d from d+2, then release into 3. Because you are already crouching you are also ducking highs — this move punishes the exact button people throw to stop your crouch pressure.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit out of full crouch with ws3 and take the combo.",
          },
          difficulty: "medium",
          tags: ["i12", "CH launcher", "crouch"],
          moveKeys: ["ws3", "d2"],
        },
        {
          id: "b2",
          stageId: "counterhit",
          name: "Left Hook",
          notation: "b+2",
          purpose:
            "A high that counter-hits for +53a, and the gateway to his best combo filler. b+2,1 is 0 on block and slides into Slither Step at +7 — a blocked string that leaves you meaningfully plus.",
          whenToUse:
            "As a counter-hit fish at close range, and as your standard pressure string via b+2,1~f.",
          leverlessTip:
            "b+2 has input shortcuts: f+1 cancels into b+2,1 and f+4 into b+2,4. You do not need to re-press b, which makes the string much kinder on a leverless.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "b+2,1 into Slither Step with f, then continue pressure from +7.",
          },
          difficulty: "medium",
          tags: ["CH launcher", "pressure", "combo filler"],
          moveKeys: ["b2", "b2-1", "b2-4"],
        },
        {
          id: "d3-2",
          stageId: "counterhit",
          name: "Quick Low Screw Punch",
          notation: "d+3,2",
          purpose:
            "A low that combos into a launcher on counter-hit for +35a. It threatens from below while everything else in this stage threatens from above.",
          whenToUse:
            "When they are standing and blocking high, waiting for b+1 or f+3. Press 1+2 on hit to gain Snake Eyes.",
          leverlessTip:
            "The counter-hit link is automatic — you do not need to confirm. Throw the full string when you expect a button and take the reward.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit with d+3 and confirm the full d+3,2 combo.",
          },
          difficulty: "medium",
          tags: ["low", "CH combo"],
          moveKeys: ["d3", "d3-2"],
        },
        {
          id: "ch-confirm",
          stageId: "counterhit",
          name: "Confirming the Counter-Hit",
          notation: "",
          purpose:
            "A counter-hit launcher is only worth its number if you convert it. This is the drill that turns 'I hit them' into damage — recognising the counter-hit flash and starting the combo without hesitating.",
          whenToUse:
            "Every counter-hit. Bryan's counter-hit damage is his highest damage; dropping the conversion throws away the character's main advantage.",
          leverlessTip:
            "Pick one combo route and use it off every counter-hit launcher, regardless of which move landed. One route, executed automatically, beats four routes you have to choose between.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Randomise which CH launcher lands and convert every one into your BNB.",
          },
          difficulty: "hard",
          tags: ["conversion", "core"],
          moveKeys: ["b1", "side-kick", "f3", "swa1"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 06 — CORE COMBOS                                       */
    /* ------------------------------------------------------------ */
    {
      id: "combos",
      number: 6,
      name: "Core Combos",
      focus: "One route, executed every time",
      description:
        "Bryan's combos are stance-heavy: they thread through Slither Step and Sway, which is why Wavu rates him as technical. The good news is that one route covers almost everything. Learn the easy version first, get it to 100%, and only then optimise — a dropped 76-damage combo is worth less than a landed 60.",
      items: [
        {
          id: "bnb-easy",
          stageId: "combos",
          name: "The Starter Route",
          notation: "db+2 → 4,1 → 4,1~B → qcb+1 → T! → b+3~f → qcf+2,2",
          purpose:
            "The friendliest bread-and-butter. It uses one stance transition (4,1 into Sway with B, which leaves you at +8) and ends with a floor break. Learn this before anything else in the stage.",
          whenToUse:
            "Off any standard launcher — Jet Upper, ws1, or a counter-hit b+1.",
          leverlessTip:
            "4,1~B means holding B during the recovery of 4,1 — you are not inputting a fresh qcb. The stance transition is a single held direction, which is far easier than re-rolling the motion.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full combo from a Jet Upper launch with no drops.",
          },
          difficulty: "medium",
          tags: ["BNB", "combo"],
          moveKeys: ["db2", "kick-4-1", "swa1", "b3", "sls2-2"],
        },
        {
          id: "bnb-standing",
          stageId: "combos",
          name: "The Standard Route",
          notation: "db+2 → 2 → b+2,1~f → qcf+2,4 → T! → b+3~f → qcf+2,1",
          purpose:
            "The route you will use for the rest of your Bryan career. More damage than the starter, and it gains Snake Eyes on the way through qcf+2,4 — so you finish the combo already holding his powered-up stance.",
          whenToUse:
            "Off f,n,b+2 or ws1 — any regular launcher.",
          leverlessTip:
            "Both transitions are a tap of f during recovery (b+2,1~f enters Slither Step at +7). Two identical motions in one combo: build the muscle memory once and it serves the whole route.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full standard route from ws1 with no drops.",
          },
          difficulty: "hard",
          tags: ["BNB", "combo", "snake eyes"],
          moveKeys: ["db2", "b2-1", "sls2-4", "b3", "sls2-1"],
        },
        {
          id: "bnb-tornado",
          stageId: "combos",
          name: "Off a Tornado Launcher",
          notation: "4,1 → 1 → b+2,1~f → qcf+2,4",
          purpose:
            "When the launcher already spent the Tornado — Snake Edge, or a counter-hit qcb+1 — the route is shorter. Same ending, fewer parts.",
          whenToUse:
            "After df+3 (Snake Edge) or a counter-hit qcb+1. Using the long route here just drops it.",
          leverlessTip:
            "Same b+2,1~f transition as the standard route. Every combo you learn reuses it — that is the point.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Land Snake Edge and convert with the tornado route.",
          },
          difficulty: "medium",
          tags: ["combo", "tornado"],
          moveKeys: ["kick-4-1", "b2-1", "sls2-4", "snake-edge"],
        },
        {
          id: "ch-b2-route",
          stageId: "combos",
          name: "The Counter-Hit Payday",
          notation: "CH b+2,1 → b+2,4 → dash d+3+4,2 → T! → b+3~f → qcf+2,1",
          purpose:
            "85 damage off a counter-hit b+2,1. This is what Bryan's counter-hit game is actually for — the whole stage before this exists to make this route happen.",
          whenToUse:
            "Any counter-hit b+2,1. Also the shape you want off counter-hit b+1 and counter-hit 3+4.",
          leverlessTip:
            "The dash before d+3+4 is the drop point. Practise the dash in isolation until it is one motion rather than a decision.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Full counter-hit route with no drops.",
          },
          difficulty: "expert",
          tags: ["combo", "CH", "damage"],
          moveKeys: ["b2-1", "b2-4", "d34-2", "b3", "sls2-1"],
        },
        {
          id: "wall-game",
          stageId: "combos",
          name: "The Wall",
          notation: "b+4 · qcb+1 · f,F+2 · FC.df+2,1",
          purpose:
            "Bryan has, in Wavu's words, tremendous wall carry — and his wall splats are spread across all four of those moves. At the wall his damage roughly doubles and his Taunt okizeme becomes genuinely oppressive.",
          whenToUse:
            "Any time the opponent's back is near a wall. Prioritise carrying them there over squeezing out extra midscreen damage.",
          leverlessTip:
            "Learn one wall ender you can hit from any angle rather than an optimal one you hit half the time. Consistency at the wall is worth more than optimisation.",
          drill: {
            type: "manual",
            checklist: [
              "Identify Bryan's four wall splat moves and the range each needs.",
              "Carry an opponent from midscreen to the wall in a single combo.",
              "Land a wall combo three times from different distances.",
              "Follow one wall combo with a Taunt setup.",
            ],
          },
          difficulty: "hard",
          tags: ["wall", "damage"],
          moveKeys: ["b4", "swa1", "mach-breaker", "fc-df2-1"],
          verifyInGame:
            "Wall routes are extremely stage- and angle-dependent, and Wavu's Bryan combo page is still partly a work in progress. Build your wall ender in Practice mode on the stage you actually play, rather than copying a notation list.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — TAUNT & SNAKE EYES                                */
    /* ------------------------------------------------------------ */
    {
      id: "taunt",
      number: 7,
      name: "Taunt & Snake Eyes",
      focus: "The most famous tech in Tekken",
      description:
        "Taunt Jet Upper is the reason Bryan has a reputation. The mechanic is simpler than the legend: Taunt is a 0-damage UNBLOCKABLE mid that gives +16 on hit and grants Snake Eyes. From +16 you get a guaranteed follow-up — and if that follow-up is Jet Uppercut, you get a full combo out of a move they could not block. The execution tax is real, so this stage builds it in order.",
      items: [
        {
          id: "taunt-mechanics",
          stageId: "taunt",
          name: "How Taunt Actually Works",
          notation: "1+3+4",
          purpose:
            "Learn the mechanic before the flashy version. Taunt is i28~31, unblockable, deals no damage, gives +16 on hit, and grants Snake Eyes. It is cancellable with any input on frames 1~31 — and it is -34 if you let it run and it whiffs.",
          whenToUse:
            "In okizeme where they cannot move, at the wall, or cancelled purely as a fake to bait a panic button.",
          leverlessTip:
            "1+3+4 is a three-button chord — one of the genuinely easier things on a leverless, where all four attack buttons sit under your fingers. On pad it is a claw grip. Bind it so all three land on the same frame.",
          drill: {
            type: "manual",
            checklist: [
              "Land a Taunt and observe the +16 on the frame display.",
              "Cancel a Taunt on reaction within the 31-frame window.",
              "Let one Taunt whiff uncancelled and see the -34 punish you take.",
              "Confirm the Snake Eyes indicator appears after Taunt connects.",
            ],
          },
          difficulty: "medium",
          tags: ["unblockable", "signature", "snake eyes"],
          moveKeys: ["taunt"],
        },
        {
          id: "taunt-b4",
          stageId: "taunt",
          name: "Taunt into Knee Break",
          notation: "1+3+4 → b+4",
          purpose:
            "The practical Taunt follow-up, and the one to learn first. Wavu rates Taunt b+4 as more important than Taunt Jet Upper and considerably less demanding. From +16, b+4 connects and wall splats.",
          whenToUse:
            "Every Taunt you land while you are still building the harder version. This is not a downgrade — it is the option most Bryan players actually use.",
          leverlessTip:
            "b+4 from a chord is trivial compared to threading a Jet Upper motion. Get your Taunt setups working with this, then upgrade the ender later.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Land Taunt and convert with b+4.",
          },
          difficulty: "medium",
          tags: ["taunt", "setup"],
          moveKeys: ["taunt", "b4"],
        },
        {
          id: "taunt-jet-upper",
          stageId: "taunt",
          name: "Taunt Jet Upper",
          notation: "1+3+4 → f,n,b+2",
          purpose:
            "The signature. An unblockable that leads into a full launch combo. Wavu scores it maximum on both dexterity and rhythm — it is the hardest thing in his kit, and the single most famous piece of tech in the game.",
          whenToUse:
            "Wall okizeme, and situations where the opponent genuinely cannot act. It is a setup, not a neutral tool.",
          leverlessTip:
            "The rhythm, not the motion, is the hard part — the Jet Upper must be timed off the Taunt rather than mashed. Buffer f during the Taunt animation and let SOCD supply the neutral as you add b. Use the rhythm trainer to internalise the gap before you attempt it live.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Land Taunt and convert into a full Jet Upper combo.",
          },
          difficulty: "expert",
          tags: ["signature", "unblockable", "execution"],
          moveKeys: ["taunt", "jet-upper"],
        },
        {
          id: "sne-arsenal",
          stageId: "taunt",
          name: "The Snake Eyes Arsenal",
          notation: "3+4,SNE.2 · SNE.b+1+2 · SNE.FC.df+3",
          purpose:
            "What Snake Eyes actually buys you. SNE.b+1+2 is +4 on block, SNE.FC.df+3 is an unparryable low, and 3+4,SNE.2 is an unparryable mid. Each consumes the stance, so you get one.",
          whenToUse:
            "Spend Snake Eyes the moment you have a read. Holding it does nothing — and in Season 3 you lose it when Heat ends.",
          leverlessTip:
            "You gain Snake Eyes from Taunt, from uf+1 or uf+3+4 on hit, and from f,F+3 or d+3,2 by adding 1+2 on hit. Pick the one that fits your combo route and make it habitual.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Gain Snake Eyes and spend it on the correct option for the situation.",
          },
          difficulty: "hard",
          tags: ["snake eyes", "mixup"],
          moveKeys: ["sne2", "sne-b1-2", "sne-fc-df3", "uf1", "bullet-knee"],
        },
        {
          id: "sne-exceed",
          stageId: "taunt",
          name: "Neo Soul Eraser Exceed",
          notation: "3+4, SNE.2 (hold)",
          purpose:
            "The held version. i55~56, but it is PLUS ON BLOCK (+9g~+10g), wall splats on block, breaks reversals and Tornadoes. Blocking it correctly still loses you the turn.",
          whenToUse:
            "When you have Snake Eyes and they are conditioned to block. It is slow enough to be reactable — its value is that blocking it is not an escape.",
          leverlessTip:
            "Hold 2 rather than tapping it. Because it is so slow, the input is easy; the hard part is choosing the moment.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land the held Exceed version and confirm you keep the turn on block.",
          },
          difficulty: "hard",
          tags: ["snake eyes", "plus on block", "wall"],
          moveKeys: ["sne2-hold"],
        },
        {
          id: "heat-sne",
          stageId: "taunt",
          name: "Heat: Snake Eyes for Free",
          notation: "1,2,4 · db+1+2 · f,F+2 · SS.2,1 · qcf+1+2",
          purpose:
            "Heat gives Bryan access to Snake Eyes moves without spending a Taunt — Wavu notes they can be used 'with impunity' in Heat. Those five moves are his Heat Engagers; the Heat Smash is +9 on block.",
          whenToUse:
            "Engage Heat with whichever of the five fits the situation, then spend the Heat window on Snake Eyes pressure rather than saving it.",
          leverlessTip:
            "Season 3 changed this: Bryan loses his powered-up state when Heat ends, and 3.01.01 removed Heat-timer regeneration for nearly the whole cast. Treat the Heat bar as a countdown, not a resource to bank.",
          drill: {
            type: "manual",
            checklist: [
              "Name all five Heat Engagers without looking.",
              "Engage Heat from a blocked string and immediately use a Snake Eyes move.",
              "Land the Heat Smash and confirm it is +9 on block.",
              "Spend a full Heat window without letting it expire unused.",
            ],
          },
          difficulty: "medium",
          tags: ["heat", "snake eyes"],
          moveKeys: ["jab-2-4", "db1-2", "mach-breaker", "ss2-1", "sls1-2", "heat-smash"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 08 — DEFENSE & GAMEPLAN                                */
    /* ------------------------------------------------------------ */
    {
      id: "gameplan",
      number: 8,
      name: "Defense & Gameplan",
      focus: "Survive your own weaknesses",
      description:
        "Wavu is blunt: Bryan lacks defensive tools and puts the onus on the player to avoid being pressured. His panic moves are rigid and his movement is poor, so you cannot bail yourself out the way other characters can. This stage covers the few defensive options he has, the lows that make his offense work, and the plan that ties the character together.",
      items: [
        {
          id: "parry",
          stageId: "gameplan",
          name: "Punch Parry",
          notation: "b+1+3",
          purpose:
            "Parries high and mid punches with a parry state on frames 5~12, and gives +31 on success. It is his one genuinely strong defensive read.",
          whenToUse:
            "Against punch-heavy strings and characters whose pressure is built on jabs and elbows. The window is narrow — this is a read, not a defensive habit.",
          leverlessTip:
            "The parry state does not begin until frame 5, so you must input it early. Reacting to the punch is already too late; you are guessing on the string, not the individual hit.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Parry a punch string and take the +31 follow-up.",
          },
          difficulty: "hard",
          tags: ["defense", "parry", "read"],
          moveKeys: ["parry"],
        },
        {
          id: "snake-edge",
          stageId: "gameplan",
          name: "Snake Edge",
          notation: "df+3",
          purpose:
            "The most famous low in Tekken. It is a homing low that launches for +70a — and it is i29~30 and -26 on block. Landing one is a round; getting it blocked is a round for them.",
          whenToUse:
            "Only when the opponent has genuinely stopped moving. This is the payoff for all the counter-hit conditioning in Stage 5 — it is not a mixup tool, it is a punishment for standing still.",
          leverlessTip:
            "It is slow enough to be blocked on reaction by anyone watching for it. Never throw it twice in a round against the same opponent.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 5,
            rep: "Land Snake Edge against a conditioned opponent and convert the launch.",
          },
          difficulty: "medium",
          tags: ["low", "launcher", "signature", "high risk"],
          moveKeys: ["snake-edge"],
        },
        {
          id: "low-game",
          stageId: "gameplan",
          name: "The Working Lows",
          notation: "d+4 · qcb+3 · db+3 · d+3",
          purpose:
            "The lows you use every round, as opposed to the one you use once. d+4 is a i15 keep-out check, qcb+3 counter-hits for +25a out of Sway, and db+3 and d+3 are quick pokes that keep opponents honest.",
          whenToUse:
            "Constantly and in small doses. These lows do not need to land for value — they need to make crouching a thought the opponent is having.",
          leverlessTip:
            "qcb+3 comes out of the same Sway entry as qcb+1. One stance, a high counter-hit launcher and a low counter-hit — that is a real 50/50 from a single motion.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix d+4 and qcb+3 into your pressure without being launched for it.",
          },
          difficulty: "medium",
          tags: ["low", "mixup", "stance"],
          moveKeys: ["d4", "swa3", "db3", "d3"],
        },
        {
          id: "power-crush",
          stageId: "gameplan",
          name: "Berserker Volley",
          notation: "uf+1",
          purpose:
            "His Power Crush — it absorbs a hit and keeps going. It also gains Snake Eyes on hit, so a successful read gives you both the interrupt and the stance.",
          whenToUse:
            "Against predictable pressure strings. It is -9 after absorbing, so it is not free — but for a character with weak defense it is one of the only ways to take a turn back by force.",
          leverlessTip:
            "It is Bryan's rigid panic option, so use it as a read on a specific string rather than a general escape. Power Crush does not absorb lows or throws.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Absorb a pressure string with uf+1 and take your turn back.",
          },
          difficulty: "medium",
          tags: ["power crush", "defense", "snake eyes"],
          moveKeys: ["uf1"],
        },
        {
          id: "the-plan",
          stageId: "gameplan",
          name: "The Bryan Gameplan",
          notation: "",
          purpose:
            "Assemble it. Hold a range with 3+4 and qcb+1. Punish every whiff with f+4,1 or Jet Upper. Make them stop pressing with counter-hits, then take Snake Edge and Taunt when they freeze. Bryan is not a mixup character — he is a tension character.",
          whenToUse:
            "Every round. If you are losing, the question is almost always which half of the loop has broken: are they pressing freely, or standing still safely?",
          leverlessTip:
            "Be honest about the weaknesses Wavu lists — poor movement, weak small Tekken, middling fast punishment, and a launcher that is a high. Your gameplan has to route around all four, and the answer to all four is the same: stay at range and make them come to you.",
          drill: {
            type: "manual",
            checklist: [
              "Play three rounds where you never approach first.",
              "Win a round using only keep-out, whiff punishment and counter-hits.",
              "Identify the moment an opponent stops pressing, and take a low.",
              "Review one loss and name which half of the loop failed.",
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
      options: ["1,4", "f,n,b+2", "f+4,1", "ws1"],
      correctIndex: 0,
      explain:
        "1,4 is his i10 punish (2,3 also works). It is small — Wavu calls his fast punishment 'middling at best' — but reaching for something bigger gets you nothing at all.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke. Standing.",
      options: ["4,3", "df+2,1", "f+2,1,4", "b+4"],
      correctIndex: 0,
      explain:
        "4,3 is the -12 punish. df+2,1 needs -13, f+2,1,4 needs -15 and b+4 needs -16 — all three whiff or get blocked here.",
    },
    {
      id: "q-13",
      prompt: "-13",
      situation: "You blocked an unsafe mid. Standing.",
      options: ["df+2,1", "1,4", "f,n,b+2", "f+4,1"],
      correctIndex: 0,
      explain:
        "df+2,1 is the -13 punish, and pressing b afterwards leaves you in Sway. uf+2,2,2,3 also covers -13 for more damage if you trust the string.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["f,n,b+2", "df+2,1", "4,3", "b+4"],
      correctIndex: 0,
      explain:
        "This is the number that defines Bryan. Jet Uppercut is i14 and LAUNCHES, so moves that are safe against most of the cast lose a round against him. Everything else here takes a fraction of the damage.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "Blocked a big commitment. Standing, and your Jet Upper motion is shaky.",
      options: ["f+2,1,4", "1,4", "ws3", "d+3,2"],
      correctIndex: 0,
      explain:
        "f+2,1,4 is the clean -15 punish, and adding 1+2 on hit gains Snake Eyes. f,n,b+2 still launches here and is worth more — take it when the motion is reliable.",
    },
    {
      id: "q-18",
      prompt: "-18",
      situation: "They whiffed a launcher badly. Standing, in range.",
      options: ["f+4,1", "1,4", "df+2,1", "4,3"],
      correctIndex: 0,
      explain:
        "f+4,1 is his biggest standing punish at +40a and doubles as his dedicated whiff punisher. At -18 you have all the time you need — do not settle for a jab.",
    },
    {
      id: "q-ws11",
      prompt: "-11 ws",
      situation: "You blocked a low. You are crouching.",
      options: ["ws4", "ws1", "ws2", "1,4"],
      correctIndex: 0,
      explain:
        "ws4 is i11~12 and only -6 — the safe answer to a blocked low. ws1 needs -15 and ws2 needs -18.",
    },
    {
      id: "q-ws12",
      prompt: "-12 ws",
      situation: "Blocked a slightly worse low. Crouching.",
      options: ["ws3", "ws1", "ws4", "FC.df+2,1"],
      correctIndex: 0,
      explain:
        "ws3 is i12 and counter-hit launches for +33a. ws4 also reaches but takes less; FC.df+2,1 needs -13.",
    },
    {
      id: "q-ws15",
      prompt: "-15 ws",
      situation: "You blocked a badly unsafe low. Crouching.",
      options: ["ws1", "ws4", "ws3", "df+2,1"],
      correctIndex: 0,
      explain:
        "ws1 LAUNCHES at -15. Bryan's crouch punishment is genuinely better than his standing punishment — blocking lows is where he collects.",
    },
    {
      id: "q-whiff",
      prompt: "WHIFF",
      situation: "They whiffed a long poke and you backdashed it cleanly.",
      options: ["f+4,1 or f,n,b+2", "1,2,3", "df+3", "3+4"],
      correctIndex: 0,
      explain:
        "Whiff punishment is the engine of the entire character. f+4,1 is the dedicated tool and Jet Upper launches. df+3 is far too slow, and 3+4 is a keep-out button, not a punish.",
    },
  ],
};
