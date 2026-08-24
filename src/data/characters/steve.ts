import type { Character } from "@/types";

/**
 * Steve Fox — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki's live Cargo database
 * (wavu.wiki/t/Steve, _movelist, _punishers, _combos) and TekkenDocs,
 * August 2026. Facts baked in — each checked against the live table:
 *  - He is a BOXER: no kicks at all. 3 and 4 are evasive weaves, b+3/b+4
 *    is Sway, f+3/f+4 is Duck. The kick buttons are movement.
 *  - He CANNOT LAUNCH AT -15 from standing or crouching — i17 standing
 *    (u+2), i16 crouching (FC.df+2). Wavu names this as a core weakness.
 *  - b+1 (Quick Hook) is i13 and CH-launches for +61a. Wavu calls it the
 *    best counter-hit tool in Tekken 8. It is -14 on block.
 *  - His punishes END IN STANCES at large advantage: 2,1 into Flicker at
 *    +14 or Peekaboo at +13, b+1,2 into Lionheart at +8, ws2,2 into
 *    Lionheart at +11, 1,1,2 into Duck at +8.
 *  - Eight stances: FLK (b+3+4) · PAB (f+3+4) · DCK (f+3/f+4) ·
 *    EXD (DCK.f+3/f+4) · LWV/RWV (3 / 4) · SWY (b+3/b+4) · LNH (ub+3) ·
 *    ALB (from 3+4).
 *  - Plus-on-block set: LNH.1+2 (+12, a GUARD BREAK), f,f,F+2 (+6),
 *    DCK.f+2 / PAB.2 / ub+2 / EXD.f+2 (+5), b+1,2 (+3), SWY.1 (up to +15c).
 *  - Heat: instant EXD via df+3+4 (with an auto low parry), an unbreakable
 *    grab after EXD, LNH auto-parries mids, and chip damage throughout.
 *  - Honest weaknesses per Wavu: beginner-unfriendly with a deep learning
 *    curve, no i15 launcher, WEAK LOWS, and — because every single one of
 *    his attacks is a punch — he is badly exposed to punch parries and
 *    punch sabakis.
 */

export const steve: Character = {
  id: "steve",
  name: "Steve Fox",
  style: "Boxing",
  tagline:
    "No kicks, eight stances, and the best counter-hit button in the game. Goad them into swinging, then make them pay for it.",
  available: true,
  accent: { base: "#e11d48", bright: "#fb7185", deep: "#9f1239" },
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT & THE WEAVES                             */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement & the Weaves",
      focus: "Your kick buttons are not attacks",
      description:
        "Before anything else: Steve is a boxer and he does not kick. The 3 and 4 buttons are evasive weaves, and b+3, f+3 and ub+3 are stance entries. That single fact reshapes how you hold the controller — half your buttons are movement. This stage rewires that before you learn a single attack.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance and lets you block immediately after. Steve is described as compact and very difficult to whiff punish, so getting into his range is unusually low-risk.",
          whenToUse:
            "Any time you are out of range. His pokes are short but relentless — the whole game happens up close.",
          leverlessTip:
            "Tap f twice with a full release between taps. Because his kick buttons are weaves, dashing and weaving together give him a movement vocabulary most characters do not have.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash into poking range and block without pressing anything.",
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
            "Creates space and baits whiffs. Steve's own hurtbox is compact enough that opponents struggle to punish HIM — so trading whiff-punish attempts favours you.",
          whenToUse:
            "After blocking a string, or to bait the swing you intend to counter-hit.",
          leverlessTip:
            "Full release between the two b presses. Note b+3 and b+4 are Sway, not kicks — so a sloppy backdash with a kick button attached puts you in a stance.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash a CPU attack and punish the whiff.",
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
            "Chained backdash cancels. For Steve this matters more than usual: his entire gameplan is goading opponents into swinging, and movement is how you create the space that makes them reach.",
          whenToUse: "Between exchanges, to bait the button you want to counter-hit.",
          leverlessTip:
            "Anchor b, drum d. Keep your kick fingers off the board while drilling this — b+3 and b+4 will pull you into Sway if they slip.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Four clean backdash cancels in a row with no accidental Sway.",
          },
          difficulty: "hard",
          tags: ["fundamental", "execution"],
        },
        {
          id: "no-kicks",
          stageId: "movement",
          name: "The Weaves",
          notation: "3 (left) · 4 (right)",
          purpose:
            "Understand the rewiring. 3 and 4 are Ducking Left and Ducking Right — evasive weaves that dodge attacks and lead into their own attacks (LWV and RWV). They are not kicks and they never will be.",
          whenToUse:
            "Out of strings, to slip a follow-up and take your turn back. Many of his strings transition into a weave, which is how he stays safe while staying close.",
          leverlessTip:
            "Reserve your kick fingers for movement thinking, not attack thinking. Once 3 and 4 feel like directions rather than buttons, the rest of the character opens up.",
          drill: {
            type: "manual",
            checklist: [
              "Weave left and right from neutral and watch an attack pass over you.",
              "Weave out of 1,1 and out of df+1.",
              "Attack out of the weave with LWV.1 and RWV.1.",
              "State from memory which buttons are stances rather than attacks.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "core", "evasive"],
          moveKeys: ["lwv1", "rwv1", "lwv2", "rwv2"],
        },
        {
          id: "sway",
          stageId: "movement",
          name: "Sway",
          notation: "b+3 / b+4 (SWY)",
          purpose:
            "Leans back out of range and holds Billy Club (SWY.1) — a mid that is around neutral on block up close and can be as good as +15c at range, with 10 chip damage.",
          whenToUse:
            "To make a poke whiff and immediately answer it. Sway is one of the few places Steve gets plus frames without committing to a long string.",
          leverlessTip:
            "Sway is a direction plus a kick button, which reinforces the rewiring: b+3 moves you, it does not attack. SWY.2 is the launcher option if you read a bigger commitment.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Sway a CPU poke and answer with SWY.1.",
          },
          difficulty: "medium",
          tags: ["stance", "evasive"],
          moveKeys: ["swy1", "swy2", "swy-throw"],
        },
        {
          id: "duck",
          stageId: "movement",
          name: "Duck",
          notation: "f+3 / f+4 (DCK)",
          purpose:
            "The most important stance he has. It ducks highs while moving forward, and it contains Fox Hunt (DCK.1) which launches for +58a on a NORMAL hit, plus Punisher (DCK.f+2) at +5 on block.",
          whenToUse:
            "As a forward-moving evasion and as a combo tool. Many of his strings slide into Duck automatically.",
          leverlessTip:
            "Duck can be cancelled — that is the key technique in Stage 5. For now, just get comfortable entering it from f+3 and from strings like df+1 and df+2.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Duck, slip a high, and attack with DCK.1.",
          },
          difficulty: "medium",
          tags: ["stance", "core", "evasive"],
          moveKeys: ["dck1", "dck2", "dck-f2", "dck-gatling"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 02 — POKES & STRINGS                                   */
    /* ------------------------------------------------------------ */
    {
      id: "pokes",
      number: 2,
      name: "Pokes & Strings",
      focus: "Suffocate them with endless offense",
      description:
        "Wavu describes Steve as excelling at suffocating opponents with endless pokes and strings — chipping them down if they freeze and counter-hitting them if they swing back. This stage is the suffocation half. Note how many of these strings end somewhere other than standing.",
      items: [
        {
          id: "df1",
          stageId: "pokes",
          name: "Left Uppercut",
          notation: "df+1 → df+1,2",
          purpose:
            "His mid check: i13 and only -2 on block. It also transitions into any weave, into Sway or into Duck — so even your safest poke can end in a stance.",
          whenToUse:
            "Constantly. df+1,2 opens the door to the Swindler follow-ups you will learn in the next stage.",
          leverlessTip:
            "Practise df+1 into each exit: 3 for left weave, 4 for right weave, f+3 for Duck. One poke, four different places to end up.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "df+1 into a different stance exit each time.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke", "stance"],
          moveKeys: ["df1", "df1-2", "df2"],
        },
        {
          id: "jab-strings",
          stageId: "pokes",
          name: "The Jab Strings",
          notation: "1,1,2 · 1,2,1,2 · 1,2,1,d+2",
          purpose:
            "1,1,2 is his i10 punisher and exits into a weave, Sway or Duck at up to +8. The 1,2,1 tree forks into a mid ender and a low ender from the same three hits.",
          whenToUse:
            "Close range as your default pressure. The fork at the end is one of the few genuine mid/low guesses he owns.",
          leverlessTip:
            "1,1,2 into Duck at +8 is the habit to build. A jab string that ends in a plus-frame stance is Steve's entire design philosophy in one input.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Run the jab strings and exit into a stance every time.",
          },
          difficulty: "easy",
          tags: ["i10", "pressure", "stance"],
          moveKeys: ["jab-1-2", "jab-2-1-2", "jab-2-1-d2", "jab-1-d1"],
        },
        {
          id: "right-1",
          stageId: "pokes",
          name: "Right Jab into Hook",
          notation: "2,1 (~b for Flicker, ~f for Peekaboo)",
          purpose:
            "His -12 punisher, and the best stance entry in the game for him: hold b and you are in Flicker at +14, hold f and you are in Peekaboo at +13. Those are enormous numbers for a punish.",
          whenToUse:
            "Every -12 punish, and as pressure. You are not taking damage here — you are buying a stance with a massive frame advantage attached.",
          leverlessTip:
            "The transition is a held direction during recovery, not a new input. Drill 2,1~b until Flicker comes out without a decision.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "2,1 into Flicker with b, then attack from the advantage.",
          },
          difficulty: "medium",
          tags: ["i12", "punisher", "stance", "core"],
          moveKeys: ["right-1", "right-2", "right"],
        },
        {
          id: "f2-strings",
          stageId: "pokes",
          name: "The f+2 Strings",
          notation: "f+2,1 · f+2,2",
          purpose:
            "The core combo links and solid pressure. f+2,1 enters Peekaboo or Flicker; f+2,2 enters Lionheart and is +11g on hit. Both appear in nearly every combo he has.",
          whenToUse:
            "Mid range as pressure and inside combos. f+2,1 can be delayed 16 frames, which is a very long time to make up your mind.",
          leverlessTip:
            "f+2,2 into Lionheart is the link that makes his combos work. Drill it in isolation and the combo stage gets much shorter.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "f+2,2 into Lionheart, then LNH.2.",
          },
          difficulty: "medium",
          tags: ["pressure", "stance", "combo filler"],
          moveKeys: ["f2", "f2-1", "f2-2", "f2-2-1plus2"],
        },
        {
          id: "ws-strings",
          stageId: "pokes",
          name: "Crouch Strings",
          notation: "ws1 · ws1,1 · ws1,2 · ws2,2",
          purpose:
            "ws1 is an i11 crouch check at only -3. ws1,1 and ws1,2 are both -11 punishers, and ws2,2 is his -13 punisher that ends in Lionheart at +11.",
          whenToUse:
            "Every blocked low, and out of your own crouch. His crouch game is one of the few places he is genuinely fast.",
          leverlessTip:
            "You are already holding d. Release into the button — and remember ws2,2 leaves you in Lionheart, so have a plan for what comes next.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["i11", "crouch", "punisher", "stance"],
          moveKeys: ["ws1", "ws1-1", "ws1-2", "ws2", "ws2-2"],
        },
        {
          id: "b1-2",
          stageId: "pokes",
          name: "Quick Draw",
          notation: "b+1,2",
          purpose:
            "+3 ON BLOCK, homing, and it enters Lionheart at +8. It is also his -13 punisher. A plus-on-block homing string is exactly what a linear rushdown character needs.",
          whenToUse:
            "As safe pressure and against sidesteppers. Being homing makes it the answer when your other strings start whiffing.",
          leverlessTip:
            "This is the safe way to use b+1. The raw b+1 is -14 and terrifyingly good on counter-hit; b+1,2 is the version you throw when you are not fishing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "b+1,2 on block, then continue from Lionheart.",
          },
          difficulty: "easy",
          tags: ["plus on block", "homing", "punisher", "stance"],
          moveKeys: ["b1-2", "ub2"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — THE COUNTER-HIT GAME                              */
    /* ------------------------------------------------------------ */
    {
      id: "counterhit",
      number: 3,
      name: "The Counter-Hit Game",
      focus: "Goad, then punish the swing",
      description:
        "This is where his damage comes from. Wavu's summary is precise: Steve harasses and annoys the opponent, goads them into fighting back, then catches their careless retaliation with a brutal, well-timed counter hit. He does not open people up — he makes them open themselves up.",
      items: [
        {
          id: "b1",
          stageId: "counterhit",
          name: "Quick Hook",
          notation: "b+1",
          purpose:
            "Wavu calls it the best counter-hit tool in Tekken 8. i13, and a counter-hit launches for +61a — a full combo off a 13-frame button. The price is that it is -14 on block.",
          whenToUse:
            "When you have read a button. This is the single move the entire character is built around, and it is a read every time you throw it.",
          leverlessTip:
            "Hold B during recovery to slide into Flicker at +10 on hit. Even when it does not counter-hit, that transition keeps you in the fight.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 9,
            rep: "Counter-hit a pressing CPU with b+1 and convert the launch.",
          },
          difficulty: "medium",
          tags: ["i13", "CH launcher", "signature", "core"],
          moveKeys: ["b1", "b1-2"],
        },
        {
          id: "swindler",
          stageId: "counterhit",
          name: "The Swindler Follow-ups",
          notation: "df+1,2~1 · PAB.2~1 · ub+2~1 · b+1,2~1",
          purpose:
            "The same delayed hook, available off four different strings, and every version counter-hits for around +63a. It is the trap you set after they have learned to press through your strings.",
          whenToUse:
            "After conditioning them to interrupt. The delay is the weapon — they press into a gap that is not really there.",
          leverlessTip:
            "The ~1 is a delayed press, not a fast one. Practise holding the beat: your instinct will be to rush it, and rushing it is exactly what makes it whiff.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 8,
            rep: "Land a Swindler counter-hit and convert it.",
          },
          difficulty: "hard",
          tags: ["CH launcher", "mixup", "signature"],
          moveKeys: ["swindler-df", "swindler-pab", "swindler-ub", "swindler-b1"],
        },
        {
          id: "dck-f2",
          stageId: "counterhit",
          name: "Punisher",
          notation: "DCK.f+2",
          purpose:
            "+5 on block and a counter-hit worth +55a, out of a stance that already ducks highs. Its Extended Duck version is even better: +5 on block, +56a on hit, and 11 chip damage on block.",
          whenToUse:
            "Out of Duck when you expect them to press. Being plus on block means a wrong read still leaves you in control.",
          leverlessTip:
            "Hold B afterwards to return to standing at +1 on block or +10c on hit. Knowing your exits is as important as the move itself.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit from Duck with DCK.f+2 and convert.",
          },
          difficulty: "medium",
          tags: ["plus on block", "CH launcher", "stance"],
          moveKeys: ["dck-f2", "exd-f2"],
        },
        {
          id: "flk2",
          stageId: "counterhit",
          name: "Fly Swatter",
          notation: "FLK.2",
          purpose:
            "A Flicker mid that counter-hits for +42a with 6 chip damage on block. Out of the stance you enter at +14 from 2,1, this is a genuinely scary button to be standing in front of.",
          whenToUse:
            "Out of Flicker after a plus-frame entry. FLK.b+2 is the Power Crush option from the same stance if you would rather absorb a hit.",
          leverlessTip:
            "Flicker auto-blocks highs and mids as you enter it, so the stance itself buys you a moment. Use that moment to pick between the jab loop and this.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Enter Flicker at plus and counter-hit with FLK.2.",
          },
          difficulty: "medium",
          tags: ["CH launcher", "stance", "chip damage"],
          moveKeys: ["flk2", "flk-b2", "flk1-d1"],
        },
        {
          id: "df2-dck",
          stageId: "counterhit",
          name: "Crescent Hook into Duck",
          notation: "df+2~DCK",
          purpose:
            "A counter-hit mid that flows straight into Duck, where the Gatling Gun string gives you an easy confirm for extra damage. One of his most forgiving counter-hit conversions.",
          whenToUse:
            "As a counter-hit fish that stays safe. On counter-hit, the DCK.1+2 machine-gun string is the reliable follow-up.",
          leverlessTip:
            "The Gatling Gun (DCK.1+2 repeated) is the easy-confirm option — Wavu labels it exactly that. Take it while you are still learning the harder conversions.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Counter-hit df+2, enter Duck, and confirm the Gatling Gun.",
          },
          difficulty: "easy",
          tags: ["CH", "stance", "conversion"],
          moveKeys: ["df2", "dck-gatling", "dck1"],
        },
        {
          id: "ch-concept",
          stageId: "counterhit",
          name: "Goading",
          notation: "",
          purpose:
            "Understand the loop. Steve chips them down when they freeze and launches them when they swing. Neither half works alone — you need the annoying pressure to manufacture the impatience that b+1 collects on.",
          whenToUse:
            "As the frame around everything. If nobody is swinging at you, you are not applying enough pressure to be annoying.",
          leverlessTip:
            "No execution here. Watch your replays for the moment the opponent starts pressing between your strings — that moment is the product you are manufacturing.",
          drill: {
            type: "manual",
            checklist: [
              "Play three rounds where you only fish for counter-hits.",
              "Identify the exact point in a round where the opponent starts interrupting.",
              "Land one b+1 counter-hit immediately after that point.",
              "Notice whether they stop pressing afterwards.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "gameplan"],
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
      focus: "No launch until -17",
      description:
        "Steve's punishment is genuinely unusual, and not in a good way. Wavu states it plainly: unlike almost every other character, he cannot launch at -15 from standing OR crouching. What he gets instead is punishes that end in stances at very large frame advantage — which is a different kind of reward, and one you have to learn to value.",
      items: [
        {
          id: "no-i15",
          stageId: "punishment",
          name: "The Missing Launcher",
          notation: "u+2 (i17) · FC.df+2 (i16)",
          purpose:
            "Understand the limitation before the ladder. His fastest standing launcher is u+2 at i17 and his fastest crouching one is FC.df+2 at i16. A -15 move that every other character launches, Steve does not.",
          whenToUse:
            "Every time you are tempted to reach for a launcher. Wavu's note is that this lets other characters be more liberal with their unsafe moves against you — that is a real, permanent tax.",
          leverlessTip:
            "The practical consequence: memorise which moves in a matchup are -17 or worse, because that is where your damage actually starts. Below that, take the stance transition instead.",
          drill: {
            type: "manual",
            checklist: [
              "State his fastest standing and crouching launchers and their startup.",
              "Name three common moves that are -15 and confirm you cannot launch them.",
              "Take the correct non-launching punish for a -15 move instead.",
              "Explain why his punishes ending in stances compensates for this.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty", "punisher"],
          moveKeys: ["u2", "fc-df2"],
        },
        {
          id: "punish-10-12",
          stageId: "punishment",
          name: "-10 and -12",
          notation: "1,1,2 · 2,1 · 2,2",
          purpose:
            "1,1,2 covers -10 and exits into Duck at +8. 2,1 covers -12 and exits into Flicker at +14. 2,2 also covers -12 and carries the Tornado if you want damage instead.",
          whenToUse:
            "The most common punish situations in the game. Default to the stance exits — the frames are worth more than the damage difference.",
          leverlessTip:
            "This is the habit that defines a good Steve: your small punishes are not small, because they end with you holding an enormous advantage in a stance.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish -10 and -12 and exit into a stance every time.",
          },
          difficulty: "medium",
          tags: ["punisher", "stance", "core"],
          moveKeys: ["jab-1-2", "right-1", "right-2"],
        },
        {
          id: "punish-13-14",
          stageId: "punishment",
          name: "-13 and -14",
          notation: "b+1,2 · 1+2",
          purpose:
            "b+1,2 covers -13 and exits into Lionheart at +8. 1+2 (Sonic Fang) covers -14 and is a HEAT ENGAGER — turning a mid-sized punish into a Heat window.",
          whenToUse:
            "Take 1+2 at -14 almost always. Heat matters enormously for Steve, and a guaranteed route into it is worth more than raw damage.",
          leverlessTip:
            "1+2 also works as ws1+2 from crouch, covering -14 there too. One input, two situations.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish -13 with b+1,2 and -14 with 1+2 for the Heat Engager.",
          },
          difficulty: "medium",
          tags: ["punisher", "heat engager", "stance"],
          moveKeys: ["b1-2", "sonic-fang"],
        },
        {
          id: "punish-heavy",
          stageId: "punishment",
          name: "-16 and Beyond",
          notation: "b+1+2 · b+2 · u+2 · PAB.df+2",
          purpose:
            "Where his damage finally starts. b+1+2 covers -16 and wall splats. At -17 you get u+2 for a real combo, or PAB.df+2 — the instant-Peekaboo launcher with his biggest punish payout.",
          whenToUse:
            "Big blocked commitments. PAB.df+2 is the optimised option and Wavu marks it as hard; u+2 is the reliable one.",
          leverlessTip:
            "Instant Peekaboo means f+3+4 immediately followed by df+2. It is worth learning eventually, but take u+2 every time until it is genuinely automatic.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish -16 and -17 correctly and convert the launch.",
          },
          difficulty: "hard",
          tags: ["punisher", "launcher", "wall splat"],
          moveKeys: ["b1plus2", "b2", "u2", "pab-df2", "pab-uf2"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouching Punishment",
          notation: "ws1,1 · ws1,2 · ws2,2 · FC.df+2",
          purpose:
            "ws1,1 and ws1,2 both cover -11. ws2,2 covers -13 and exits into Lionheart at +11. FC.df+2 is the i16 launcher — his fastest launch of any kind.",
          whenToUse:
            "Every blocked low. Note that crouching is where his fastest launcher lives, which makes blocking lows unusually valuable for him.",
          leverlessTip:
            "FC.df+2 requires full crouch, not just while-standing. Hold d through the block and input df+2 without standing up.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct crouching punish.",
          },
          difficulty: "medium",
          tags: ["crouch", "punisher", "launcher"],
          moveKeys: ["ws1-1", "ws1-2", "ws2-2", "fc-df2", "uf2"],
        },
        {
          id: "whiff-punish",
          stageId: "punishment",
          name: "Whiff Punishment",
          notation: "df+1,2 · b+1 · u+2",
          purpose:
            "His whiff punishment is short-ranged but his counter-hit tools double as whiff punishers. b+1 whiff-punishing at i13 with a full combo attached is the dream scenario for him.",
          whenToUse:
            "Every whiff in front of you. At close range b+1 is the biggest reward available anywhere in his kit.",
          leverlessTip:
            "Being compact cuts both ways: he is hard to whiff punish, but his own reach is limited, so you must be genuinely close for these to connect.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Backdash a CPU attack and whiff punish with b+1 or df+1,2.",
          },
          difficulty: "medium",
          tags: ["whiff punish"],
          moveKeys: ["b1", "df1-2", "u2"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — THE STANCES                                       */
    /* ------------------------------------------------------------ */
    {
      id: "stances",
      number: 5,
      name: "The Stances",
      focus: "Eight of them, and how they connect",
      description:
        "Steve has one of the longest movelists in the game — three primary stances and five secondary ones. Wavu is clear that he can get by with a small set of core tools but rewards the specialist. This stage teaches the stances that carry the most weight, and the transition web that connects them.",
      items: [
        {
          id: "flicker",
          stageId: "stances",
          name: "Flicker",
          notation: "b+3+4 (FLK)",
          purpose:
            "His signature stance. It auto-blocks highs and mids as you enter it, holds a jab loop (FLK.1,1,1) that jails, and contains FLK.2 for counter-hits and FLK.b+2 as a Power Crush.",
          whenToUse:
            "After 2,1~b at +14, or entered raw to absorb a moment of pressure. The jab loop lets you keep the turn almost indefinitely against passive opponents.",
          leverlessTip:
            "You can cancel Flicker immediately into full crouch with db. That cancel is what turns the stance from a commitment into a genuine option.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Flicker from 2,1~b and run the jab loop.",
          },
          difficulty: "medium",
          tags: ["stance", "core", "signature"],
          moveKeys: ["flk1", "flk1-1", "flk1-1-1", "flk2", "flk-b2", "flk-throw"],
        },
        {
          id: "peekaboo",
          stageId: "stances",
          name: "Peekaboo",
          notation: "f+3+4 (PAB)",
          purpose:
            "The offensive stance. It auto-blocks highs and mids, holds PAB.2 — which is +5 on block AND punch-parries — plus his best punish launcher (PAB.df+2) and an i11 throw.",
          whenToUse:
            "After 2,1~f at +13, or instantly from standing for the launcher. Peekaboo is where his highest punishment lives.",
          leverlessTip:
            "PAB.2 doing double duty as a plus-on-block hook and a punch parry is exceptional value. Against punch-heavy characters it is one of your best buttons.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Peekaboo from 2,1~f and use PAB.2 and PAB.df+1,2.",
          },
          difficulty: "medium",
          tags: ["stance", "parry", "core"],
          moveKeys: ["pab1", "pab2", "pab-df1-2", "pab-df2", "pab-f1plus2", "pab-throw"],
        },
        {
          id: "lionheart",
          stageId: "stances",
          name: "Lionheart",
          notation: "ub+3 (LNH)",
          purpose:
            "The stance your strings keep dumping you into. LNH.1 is a homing Heat Engager, LNH.2 is the Tornado that ends every combo, and LNH.1+2 is a GUARD BREAK at +12 on block with guaranteed follow-ups.",
          whenToUse:
            "It is actionable for 120 frames, so you arrive here often and can wait. b+1,2, f+2,2, ws2,2 and ub+2 all lead into it.",
          leverlessTip:
            "LNH.1+2 being a guard break is the standout: blocking it correctly still loses them the turn, and you get 1,1,2, 2,1 or 2,2 guaranteed afterwards.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Enter Lionheart from a string and land LNH.1+2 into a guaranteed follow-up.",
          },
          difficulty: "medium",
          tags: ["stance", "guard break", "heat engager", "core"],
          moveKeys: ["lnh1", "lnh2", "lnh1plus2"],
        },
        {
          id: "extended-duck",
          stageId: "stances",
          name: "Extended Duck",
          notation: "DCK.f+3 / f+4 (EXD)",
          purpose:
            "Duck's deeper form, and where his chip damage lives. EXD.1 does 8 chip on block, EXD.2 launches for +61a, and EXD.f+2 is +5 on block with 11 chip damage.",
          whenToUse:
            "Out of Duck when you have the space to commit. In Heat you get here instantly with df+3+4 — which also carries an automatic low parry.",
          leverlessTip:
            "Chip damage is the reason to care: against an opponent who has decided to just block, Extended Duck is how you take the round anyway.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Extended Duck and land each of its three attacks.",
          },
          difficulty: "hard",
          tags: ["stance", "chip damage", "heat"],
          moveKeys: ["exd1", "exd2", "exd-f2"],
        },
        {
          id: "albion",
          stageId: "stances",
          name: "Albion",
          notation: "3+4 (ALB)",
          purpose:
            "The spin stance. ALB.2 is a Heat Engager at only -3 on block, and the stance also holds a low (ALB.d+2) — one of the few places his low game has any teeth.",
          whenToUse:
            "As a Heat route and a corner-carry combo ender. It is also reachable from Flicker with 3+4.",
          leverlessTip:
            "ALB.2 being -3 and a Heat Engager makes it a low-risk way into Heat. For a character who gains this much from Heat, that matters.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Albion and engage Heat with ALB.2.",
          },
          difficulty: "medium",
          tags: ["stance", "heat engager"],
          moveKeys: ["alb2", "alb-d1", "alb-d2"],
        },
        {
          id: "transition-web",
          stageId: "stances",
          name: "The Transition Web",
          notation: "2,1~b (+14 FLK) · b+1,2 (LNH) · df+1~f+3 (DCK)",
          purpose:
            "The thing that actually makes him work. Almost every string has an exit, and the exits carry frame advantage. Learning which string leads where is more valuable than learning any individual move.",
          whenToUse:
            "Constantly. Wavu describes his stances as easy to transition into from moves and from each other — that flexibility IS the character.",
          leverlessTip:
            "Do not try to memorise all of it. Pick three: 2,1~b into Flicker, f+2,2 into Lionheart, and df+1 into Duck. Those three carry most of his offense.",
          drill: {
            type: "manual",
            checklist: [
              "Enter Flicker from three different strings.",
              "Enter Lionheart from three different strings.",
              "Enter Duck from three different strings.",
              "Name the frame advantage on your two best transitions.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "stance", "core"],
          moveKeys: ["right-1", "f2-2", "df1", "b1-2"],
        },
        {
          id: "duck-cancel",
          stageId: "stances",
          name: "Duck Cancel",
          notation: "DCK ~ db",
          purpose:
            "Wavu's single listed key technique for Steve. Cancelling Duck into full crouch with db lets you convert stance pressure into while-standing moves and unlocks his optimal combo routes.",
          whenToUse:
            "In combos, and in pressure to fake a stance commitment. It is the technique that separates a competent Steve from a good one.",
          leverlessTip:
            "The cancel is a db press during the Duck. On a leverless that is a clean two-button chord rather than a stick roll, which is a real advantage on a technique rated for both dexterity and rhythm.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Duck cancel into crouch and follow with ws1.",
          },
          difficulty: "expert",
          tags: ["execution", "signature", "stance"],
          moveKeys: ["dck1", "ws1"],
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
      focus: "Three enders, one shape",
      description:
        "Steve's combos look intimidating because they thread through several stances, but they all share one shape and one of three enders. Learn the enders first — they are the part you will use in every single combo — then the routes that feed them.",
      items: [
        {
          id: "combo-enders",
          stageId: "combos",
          name: "The Three Enders",
          notation: "LWV.1,2 → LNH.2 · LWV.1,2 → DCK.1 · FLK.1,1 → ALB.2",
          purpose:
            "Wavu lists exactly three combo enders and what each is for: LWV.1,2 into LNH.2 for damage, LWV.1,2 into DCK.1 for corner carry, and FLK.1,1 into ALB.2 for more carry at the cost of okizeme.",
          whenToUse:
            "Every combo. Learn the damage ender first and use it everywhere until carry actually matters to you.",
          leverlessTip:
            "Drill the ender in isolation off a simple launcher. It is the same four inputs every time, so the reps transfer to every route you learn afterwards.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Land the damage ender after any launcher with no drops.",
          },
          difficulty: "medium",
          tags: ["combo", "core"],
          moveKeys: ["lwv1-2", "lnh2", "dck1", "flk1-1", "alb2"],
        },
        {
          id: "bnb-uf2",
          stageId: "combos",
          name: "The Bread and Butter",
          notation: "uf+2 → DCK.1 → df+1,2~1~FLK.1 → f+2,2 → LNH.2 → T! → dash LWV.1,2 → LNH.2",
          purpose:
            "The route off uf+2 and his other launchers, worth around 57. Every piece is something you already drilled: the Swindler, the Flicker transition, f+2,2 into Lionheart, and the damage ender.",
          whenToUse: "Off uf+2, u+2, DCK.2 and his other standard launchers.",
          leverlessTip:
            "Break it in half. Get uf+2 into DCK.1 into df+1,2~1 reliable first, then attach the ender you already know. Two halves, both familiar.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Full bread and butter from uf+2 with no drops.",
          },
          difficulty: "expert",
          tags: ["BNB", "combo"],
          moveKeys: ["uf2", "dck1", "swindler-df", "flk1", "f2-2", "lnh2", "lwv1-2"],
        },
        {
          id: "bnb-ch-b1",
          stageId: "combos",
          name: "Off the Counter-Hit",
          notation: "CH b+1 → EXD.1 → df+1,2~1 → f+2,2 → LNH.2 → T! → dash LWV.1,2 → LNH.2",
          purpose:
            "The route that matters most, because b+1 is where his damage comes from. Around 56 damage off a 13-frame counter-hit.",
          whenToUse:
            "Every b+1 counter-hit. Dropping this conversion throws away the character's entire reason for existing.",
          leverlessTip:
            "Same tail as the bread and butter — only the opening differs. That is deliberate: learn one middle and one ender, and every launcher plugs into the front.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Convert a b+1 counter-hit into the full route.",
          },
          difficulty: "expert",
          tags: ["combo", "CH", "signature"],
          moveKeys: ["b1", "exd1", "swindler-df", "f2-2", "lnh2", "lwv1-2"],
        },
        {
          id: "mini-combos",
          stageId: "combos",
          name: "Guaranteed Mini-Combos",
          notation: "ub+2 → LNH.1 · SWY.1 → 1+2 · DCK.1 → f,F+2",
          purpose:
            "Free damage that needs no execution, and several of them end in a Heat Engager. ub+2 into LNH.1 gives Heat; b+2 and db+1+2 both lead into 1+2 for 28 more.",
          whenToUse:
            "Every time one of those moves lands. These are the follow-ups new Steve players most often miss.",
          leverlessTip:
            "Note the pattern: the follow-up is usually 1+2 or LNH.1, and both are Heat Engagers. His mini-combos are really a Heat-building system.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land ub+2 and take the guaranteed Heat Engager follow-up.",
          },
          difficulty: "easy",
          tags: ["mini-combo", "heat engager", "damage"],
          moveKeys: ["ub2", "lnh1", "swy1", "sonic-fang", "dck1", "fff2", "b2", "db1plus2"],
        },
        {
          id: "wall-game",
          stageId: "combos",
          name: "The Wall",
          notation: "W! f+2,1~B FLK → DCK Gatling · W! f+2,2,1+2 · W! 1+2",
          purpose:
            "Three wall enders of increasing simplicity. His wall splat moves are b+1+2, qcf+1 and the instant-Peekaboo f+1+2, and the Gatling Gun makes a satisfying wall finisher.",
          whenToUse:
            "Any wall splat. W! 1+2 is the simple version and also engages Heat — often the better trade.",
          leverlessTip:
            "Take the 1+2 ender while learning. Ending a wall combo in Heat is worth more to Steve than a few extra points of damage.",
          drill: {
            type: "manual",
            checklist: [
              "Identify Steve's three wall splat moves.",
              "Carry an opponent to the wall in one combo.",
              "Land the simple W! 1+2 ender three times.",
              "Land the Gatling Gun wall ender once.",
            ],
          },
          difficulty: "hard",
          tags: ["wall", "damage"],
          moveKeys: ["b1plus2", "qcf1", "pab-f1plus2", "dck-gatling", "sonic-fang"],
          verifyInGame:
            "Wall routes depend on stage geometry and carry angle. Build yours in Practice mode on the stages you actually play.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — LOWS & CHIP                                       */
    /* ------------------------------------------------------------ */
    {
      id: "lows",
      number: 7,
      name: "Lows & Chip",
      focus: "His weakest area, and the workaround",
      description:
        "Wavu lists 'Doesn't Hit Below The Belt' among his weaknesses, and it is accurate — his lows are slow, unrewarding and mostly unsafe. The honest answer is that Steve does not open people up with lows. He opens them up with chip damage and by being impossible to sit still against.",
      items: [
        {
          id: "weak-lows",
          stageId: "lows",
          name: "The Lows You Actually Have",
          notation: "db+3 · d+1 · PAB.d+1 · PAB.d+2",
          purpose:
            "An honest inventory. db+3 and d+1 are i16 and unsafe. PAB.d+1 is i15 out of Peekaboo. PAB.d+2 counter-hits for +32a but is i28. None of them are good, and pretending otherwise loses rounds.",
          whenToUse:
            "Sparingly, purely to stop opponents standing still. Their job is to exist, not to land.",
          leverlessTip:
            "Because his low game is weak, the correct answer to a blocking opponent is chip damage and stance pressure — not forcing a low that will get you launched.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Mix a low into pressure once per exchange without being launched.",
          },
          difficulty: "medium",
          tags: ["low", "honesty"],
          moveKeys: ["db3", "d1", "pab-d1", "pab-d2", "qcf2"],
        },
        {
          id: "chip-pressure",
          stageId: "lows",
          name: "Chip Damage as the Mixup",
          notation: "EXD.f+2 (11) · SWY.1 (10) · f,f,F+2 (9) · LNH.1+2 (9)",
          purpose:
            "The real answer to a turtling opponent. Steve has chip damage on an unusual number of moves, and Heat amplifies it — so blocking correctly still drains their health.",
          whenToUse:
            "Against anyone who has decided to block their way out. You do not need to open them up if standing there costs them the round.",
          leverlessTip:
            "Learn which of your buttons chip and lean on those in Heat. This is the strategy that replaces the low game he does not have.",
          drill: {
            type: "manual",
            checklist: [
              "Name Steve's four biggest chip-damage moves.",
              "Win an exchange purely through chip damage in Heat.",
              "Land LNH.1+2 on block and take the guaranteed follow-up.",
              "Explain why chip damage substitutes for his weak lows.",
            ],
          },
          difficulty: "medium",
          tags: ["chip damage", "concept", "heat"],
          moveKeys: ["exd-f2", "swy1", "fff2", "lnh1plus2"],
        },
        {
          id: "throws",
          stageId: "lows",
          name: "The Throws",
          notation: "PAB.1+2 · FLK.1+2 · SWY.1+2 · uf+1+2",
          purpose:
            "Each stance has its own throw. PAB.1+2 (Ten Count) is i11 and 0 on block — fast enough to genuinely contest a turn from a stance you are already plus in.",
          whenToUse:
            "Against opponents who have started blocking everything. With weak lows, throws carry more of his opening-up burden than they do for most characters.",
          leverlessTip:
            "An i11 throw out of a stance you entered at +13 is a legitimate threat. Peekaboo pressure with PAB.2, PAB.df+1 and PAB.1+2 is a real three-way.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land a throw out of each stance you use.",
          },
          difficulty: "easy",
          tags: ["throw", "mixup"],
          moveKeys: ["pab-throw", "flk-throw", "swy-throw"],
        },
        {
          id: "sway-billy",
          stageId: "lows",
          name: "Billy Club",
          notation: "SWY.1",
          purpose:
            "Around neutral on block up close and up to +15c at range, with 10 chip damage. A mid that pays you for spacing it correctly, and it leads into 1+2 for a Heat Engager.",
          whenToUse:
            "At the edge of your range after a Sway. It is one of the few moves he has where distance actively improves the frame data.",
          leverlessTip:
            "The frame advantage varies by range — up close it is neutral, at the tip it is strongly plus. Learning that spacing is worth more than learning another string.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Land SWY.1 at tip range and continue from the advantage.",
          },
          difficulty: "medium",
          tags: ["spacing", "chip damage", "stance"],
          moveKeys: ["swy1", "swy2", "sonic-fang"],
        },
        {
          id: "the-mixup",
          stageId: "lows",
          name: "Opening Them Up Anyway",
          notation: "",
          purpose:
            "Assemble it honestly. Steve's offense is: annoying strings, plus-frame stances, chip damage, throws, and a counter-hit that ends the round. Lows are a footnote, and that is fine.",
          whenToUse:
            "Every round. If you find yourself forcing lows to open someone up, you are playing the character backwards.",
          leverlessTip:
            "The pressure is the mixup. Being at +14 in Flicker with a jab loop, a counter-hit mid, a Power Crush and a throw is a harder guess than any low he owns.",
          drill: {
            type: "manual",
            checklist: [
              "Win a round without landing a single low.",
              "Open someone up with a throw out of a stance.",
              "Chip an opponent below half health in Heat.",
              "Land one b+1 counter-hit on someone who cracked.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "gameplan"],
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
      focus: "Two parries, one glaring vulnerability",
      description:
        "Steve's defense is built on stances that auto-block and parries that punish punches. But being a pure boxer cuts both ways — every attack he owns is a punch, which makes him uniquely vulnerable to a specific category of defensive tool. This stage covers both directions honestly.",
      items: [
        {
          id: "parries",
          stageId: "gameplan",
          name: "The Punch Parries",
          notation: "b+1+3 · PAB.2",
          purpose:
            "b+1+3 parries high and mid punches, leaves you around +7, and gives a follow-up with 1. PAB.2 also punch-parries while being a +5-on-block homing hook — a genuinely absurd amount of value on one button.",
          whenToUse:
            "Against punch-heavy pressure. PAB.2 is the one to remember, because you get the parry as a bonus on a move you already want to press.",
          leverlessTip:
            "Both parries cover punches only. Against kick-heavy characters they do nothing, so know which matchups they are live in.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Parry a punch string with b+1+3 and take the follow-up.",
          },
          difficulty: "hard",
          tags: ["defense", "parry", "read"],
          moveKeys: ["pab2"],
        },
        {
          id: "power-crush",
          stageId: "gameplan",
          name: "Power Crush",
          notation: "db+1+2 · FLK.b+2",
          purpose:
            "Two of them. db+1+2 (Stun Gun) absorbs a hit for +29a on hit. FLK.b+2 does the same out of Flicker and carries the Tornado, so a successful read there converts into a full combo.",
          whenToUse:
            "Against predictable pressure. FLK.b+2 is the better one when you are already in the stance, which after 2,1~b you often are.",
          leverlessTip:
            "Power Crush does not absorb lows or throws. Given how weak his lows are and how strong his stance game is, these are reads on specific strings rather than a general escape.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Absorb a pressure string with db+1+2 or FLK.b+2 and convert.",
          },
          difficulty: "medium",
          tags: ["power crush", "defense"],
          moveKeys: ["db1plus2", "flk-b2"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat: Boxer Becomes Grappler",
          notation: "1+2 · qcf+1 · ALB.2 · f,f,F+2 · LNH.1",
          purpose:
            "The best Heat in this curriculum so far. You get instant Extended Duck with df+3+4 (carrying an automatic low parry), an UNBREAKABLE grab after it, Lionheart automatically parries mids, and chip damage runs through everything.",
          whenToUse:
            "Engage with any of the five Engagers and immediately apply the chip pressure. Wavu's phrasing is that Heat temporarily makes him a bonafide grappler.",
          leverlessTip:
            "The unbreakable grab is the piece to plan around. Outside Heat, Steve has no way to force damage through a blocking opponent — inside Heat, he does.",
          drill: {
            type: "manual",
            checklist: [
              "Name all five Heat Engagers without looking.",
              "Engage Heat and use instant Extended Duck with df+3+4.",
              "Land the unbreakable grab after Extended Duck.",
              "Land the Heat Smash and continue from the Lionheart transition.",
            ],
          },
          difficulty: "medium",
          tags: ["heat", "signature", "chip damage"],
          moveKeys: ["sonic-fang", "qcf1", "alb2", "fff2", "lnh1", "heat-smash", "heat-grab"],
        },
        {
          id: "punch-parry-problem",
          stageId: "gameplan",
          name: "The Punch Parry Problem",
          notation: "",
          purpose:
            "His most specific weakness, and one you will only meet in certain matchups. Because Steve is a boxer, EVERY attack he has is a punch — so any character with a punch parry or punch sabaki has a blanket answer to his entire offense.",
          whenToUse:
            "Against characters with punch-exclusive defensive tools. Wavu lists 'Parry Spam Hater' as a core weakness for exactly this reason.",
          leverlessTip:
            "Your outs are throws, lows and simply waiting. Against a parry-happy opponent, the correct answer is often to stop pressing and let them commit to a parry that catches nothing.",
          drill: {
            type: "manual",
            checklist: [
              "Name three characters with punch parries or punch sabakis.",
              "Explain why Steve is more exposed to them than anyone else.",
              "Beat a parry attempt with a throw.",
              "Beat a parry attempt by simply not pressing.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty", "matchup"],
        },
        {
          id: "learning-curve",
          stageId: "gameplan",
          name: "Auto-pilot Disabled",
          notation: "",
          purpose:
            "The other honest item. Wavu describes Steve as beginner-unfriendly with a deep learning curve, and notes he can get by with a small set of core tools but rewards the specialist. Both halves of that are useful to hear.",
          whenToUse:
            "When the movelist feels overwhelming. You do not need eight stances to win — you need 2,1~b, b+1, df+1, f+2,2 and one combo ender.",
          leverlessTip:
            "Pick your small set deliberately and ignore the rest until it is automatic. Adding a ninth option before the first five are reliable is the most common way people bounce off this character.",
          drill: {
            type: "manual",
            checklist: [
              "Write down five moves you will use and ignore everything else for a session.",
              "Play three rounds using only those five.",
              "Add one stance option and play three more rounds.",
              "Name the one thing you want to add next, and why.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty"],
        },
        {
          id: "the-plan",
          stageId: "gameplan",
          name: "The Steve Gameplan",
          notation: "",
          purpose:
            "Assemble it. Get close — you are compact and hard to punish. Harass with strings that end in stances at plus frames. Chip them if they freeze. And when they finally swing back out of frustration, catch it with b+1 and take the round.",
          whenToUse:
            "Every round. Wavu's description is that a great Steve employs a highly unpredictable offense to goad the opponent into fighting back, then punishes their careless retaliation.",
          leverlessTip:
            "Be honest about the four costs: a deep learning curve, no i15 launcher, weak lows, and total exposure to punch parries. None are fatal, but all four mean you win by being annoying and patient, not by forcing damage.",
          drill: {
            type: "manual",
            checklist: [
              "Win a round where the winning hit was a b+1 counter-hit.",
              "End five punishes in a stance in a single match.",
              "Spend one full Heat window on chip pressure.",
              "Review a loss and name which weakness cost you.",
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
      options: ["1,1,2 (into a stance)", "2,1", "u+2", "b+1+2"],
      correctIndex: 0,
      explain:
        "1,1,2 is his i10 punish and exits into a weave, Sway or Duck at up to +8. With Steve the stance exit is the real reward, not the damage.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke. Standing.",
      options: ["2,1 → Flicker at +14", "1,1,2", "b+1,2", "1+2"],
      correctIndex: 0,
      explain:
        "2,1 covers -12, and holding b puts you in Flicker at +14 (or f for Peekaboo at +13). 2,2 also covers -12 if you want the Tornado instead.",
    },
    {
      id: "q-13",
      prompt: "-13",
      situation: "You blocked an unsafe mid. Standing.",
      options: ["b+1,2 → Lionheart", "2,1", "1,1,2", "u+2"],
      correctIndex: 0,
      explain:
        "b+1,2 is the -13 punish, is +3 on block in its own right, and exits into Lionheart at +8.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked a committed move and you want Heat.",
      options: ["1+2 (Heat Engager)", "b+1,2", "2,1", "b+2"],
      correctIndex: 0,
      explain:
        "1+2 (Sonic Fang) covers -14 and is a Heat Engager. For Steve, Heat is worth more than damage — it gives him an unbreakable grab and chip pressure.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["f+1+2,2 — you CANNOT launch here", "u+2", "PAB.df+2", "uf+2"],
      correctIndex: 0,
      explain:
        "This is the defining Steve fact: unlike almost every other character he cannot launch at -15 from standing OR crouching. f+1+2,2 is the -15 punish. His fastest launchers are u+2 at i17 and FC.df+2 at i16.",
    },
    {
      id: "q-17",
      prompt: "-17",
      situation: "They whiffed something huge. Standing, in range.",
      options: ["u+2 → combo", "1,1,2", "b+1,2", "1+2"],
      correctIndex: 0,
      explain:
        "-17 is finally where he launches. u+2 is the reliable option; PAB.df+2 out of an instant Peekaboo does considerably more but Wavu marks it as hard.",
    },
    {
      id: "q-ws11",
      prompt: "-11 ws",
      situation: "You blocked a low. You are crouching.",
      options: ["ws1,1 or ws1,2", "ws2,2", "FC.df+2", "uf+2"],
      correctIndex: 0,
      explain:
        "Both cover -11. ws2,2 needs -13 and FC.df+2 needs -16 — reaching for them here gets you blocked.",
    },
    {
      id: "q-ws13",
      prompt: "-13 ws",
      situation: "Blocked a worse low. Crouching.",
      options: ["ws2,2 → Lionheart at +11", "ws1,1", "FC.df+2", "1+2"],
      correctIndex: 0,
      explain:
        "ws2,2 covers -13 and exits into Lionheart at +11 — one of the biggest stance transitions he has off a punish.",
    },
    {
      id: "q-ws16",
      prompt: "-16 ws",
      situation: "You blocked a badly unsafe low. Crouching.",
      options: ["FC.df+2 → combo", "ws2,2", "ws1,1", "b+1"],
      correctIndex: 0,
      explain:
        "FC.df+2 is his i16 crouching launcher — his fastest launch of any kind. Blocking lows is where Steve gets his best punishment.",
    },
    {
      id: "q-ch",
      prompt: "THEY PRESSED",
      situation: "You baited a button at close range and they swung.",
      options: ["b+1 → full combo", "db+3", "qcf+2", "1,1,2"],
      correctIndex: 0,
      explain:
        "b+1 is i13 and counter-hit launches for +61a — Wavu calls it the best counter-hit tool in Tekken 8. It is -14 on block, so it is always a read, and it is the read the whole character is built around.",
    },
  ],
};
