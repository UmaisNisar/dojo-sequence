import type { Character } from "@/types";

/**
 * Devil Jin — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Every frame number quoted here comes from `devil-jin.frames.json`, which is
 * diffed against Wavu Wiki by `npm run verify:frames`. Where a startup is a
 * range (i15~16), punishment items quote the slower end — a punish that only
 * works on the lucky frame is not a punish.
 *
 * He is the second Mishima in the app, so the curriculum is deliberately not
 * Kazuya's with different numbers. Wavu's own summary of him is a 50/50: an
 * "explosive, high-risk high-reward" character whose Hellsweep is the fastest
 * low launcher in the game, paired with an i14 mid launcher out of the same
 * wavedash. That pairing IS the character — Wavu notes it cannot be option
 * selected with movement — so it gets a stage of its own rather than being
 * spread across the low and launcher stages.
 *
 * The execution burden is stated rather than hidden. Wavu rates the wavedash
 * importance 5 dexterity 4, and EWGF in neutral importance 4 DEXTERITY 5 —
 * the highest execution rating on any technique in the app. Stage 1 says so.
 */
export const devilJin: Character = {
  id: "devil-jin",
  name: "Devil Jin",
  style: "Advanced Mishima Style",
  tagline:
    "The fastest low launcher in the game and an i14 mid, out of the same wavedash. Guess wrong and it is your round.",
  available: true,
  electric: true,
  accent: { base: "#d946ef", bright: "#f0abfc", deep: "#a21caf" },
  stages: [
    /* ---------------------------------------------------------------- */
    /* STAGE 01 — WAVEDASH & THE ELECTRIC                               */
    /* ---------------------------------------------------------------- */
    {
      id: "wavedash",
      number: 1,
      name: "Wavedash & the Electric",
      focus: "The input that unlocks the character",
      description:
        "Wavu rates the wavedash importance 5 of 5 at dexterity 4, and EWGF in neutral importance 4 at DEXTERITY 5 — the hardest thing to execute of anything in this app. That is not a warning to skip the stage, it is the reason the stage exists. Devil Jin's entire mixup, his best punisher and his best whiff punisher all come out of the crouch dash. Everything after this assumes your hands can do it.",
      items: [
        {
          id: "wavedash",
          stageId: "wavedash",
          name: "The Wavedash",
          notation: "f,n,d,df — repeated",
          purpose:
            "Crouch dash cancelled into crouch dash. It closes ground, it stays crouching, and — critically — it threatens the Hellsweep and Alaya at the same time. Wavu rates it importance 5.",
          whenToUse:
            "As your primary approach. A Devil Jin who cannot wavedash has no mixup and is left with a stubby jab and mediocre pokes.",
          leverlessTip:
            "f, neutral, d, df — four discrete taps, then f again to cancel. Leverless is genuinely better at this than a stick because the neutral is a release rather than a return through a gate. Wavu scores it rhythm 2: it is a pattern, not a timing trick.",
          drill: {
            type: "timed",
            durationSeconds: 30,
            rep: "Wavedash across the stage and back without dropping the cancel.",
          },
          difficulty: "hard",
          tags: ["movement", "execution", "signature"],
        },
        {
          id: "backdash-cancel",
          stageId: "wavedash",
          name: "Backdash Cancel",
          notation: "b,b~db",
          purpose:
            "The retreat. Devil Jin's whiff punishment is among the best in the game, and it only pays if you can make things whiff first.",
          whenToUse:
            "To bait a button, then punish it with EWGF or uf+1. Wavu lists his whiff punishers as a genuine strength.",
          leverlessTip:
            "b,b then db to cancel, then b again. Same finger discipline as the wavedash in the other direction — practise both in one session.",
          drill: {
            type: "timed",
            durationSeconds: 30,
            rep: "Cross the stage backwards with continuous backdash cancels.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
        },
        {
          id: "sidestep",
          stageId: "wavedash",
          name: "Sidestep",
          notation: "u_d",
          purpose:
            "Stepping creates whiffs and gives you SS.2, which launches for +72a. It is also the movement his wavedash mixup deliberately beats — Wavu notes Alaya tracks to the right specifically so the mixup cannot be stepped out of.",
          whenToUse:
            "Against linear strings, and after a blocked move that leaves them minus.",
          leverlessTip:
            "A tap, not a hold. Note the direction — SS.2 is a real launcher and is worth taking when the step lands.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Step a linear string and punish the whiff.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
          moveKeys: ["ss2"],
        },
        {
          id: "wgf",
          stageId: "wavedash",
          name: "Wind God Fist",
          notation: "f,n,d,df+2",
          purpose:
            "The non-just-frame version: i11~12 for +39a (+29) on hit, but -10 on block. Full launch, real punishment if it is blocked.",
          whenToUse:
            "While you are learning. It launches exactly as hard as the electric — the difference is entirely what happens when they block it.",
          leverlessTip:
            "Get this clean before chasing the electric. The motion is identical; the electric only adds a timing requirement on top of an input you already have to own.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Land f,n,d,df+2 from a standing start and convert.",
          },
          difficulty: "hard",
          tags: ["i11", "launcher", "mishima"],
          moveKeys: ["wgf"],
        },
        {
          id: "ewgf",
          stageId: "wavedash",
          name: "Electric Wind God Fist",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "The same launch — +39a (+29) — but +5 ON BLOCK instead of -10. Fifteen frames of difference for one frame of timing. Wavu rates it dexterity 5 and value 5: the hardest technique in the app, and the most worth having.",
          whenToUse:
            "Everywhere the plain Wind God Fist would work, once it is reliable. In Heat he can perform it without the perfect input, which is a real mid-round change.",
          leverlessTip:
            "The 2 must land on the same frame as df. Wavu scores it rhythm 1 — it is not a rhythm, it is a single precise moment. Drill it in bursts with the input display on rather than grinding it tired.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Land five clean electrics in a row from neutral.",
          },
          difficulty: "expert",
          tags: ["i11", "launcher", "plus on block", "signature"],
          moveKeys: ["ewgf", "wgf"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 02 — CORE POKES                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "pokes",
      number: 2,
      name: "Core Pokes",
      focus: "Subpar tools, held together by knowing them",
      description:
        "Wavu is direct about this: generally limited generic tools, mediocre poking, and a stubby jab. His mids often end his turn on block with little reward on hit. None of that is fixable, so the job here is knowing exactly what each button leaves you at and not pressing the ones that lose.",
      items: [
        {
          id: "jab",
          stageId: "pokes",
          name: "The Stubby Jab",
          notation: "1",
          purpose:
            "i10, +1 on block, +8 on hit. The frames are standard; the range is not, and Wavu calls it out as incredibly stubby.",
          whenToUse:
            "Up close only. At the range a jab normally works, his simply does not reach.",
          leverlessTip:
            "One tap. The habit to build is checking distance first — a whiffed jab from a Mishima is a launch against you.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Jab at the edge of its range and note where it stops reaching.",
          },
          difficulty: "easy",
          tags: ["i10", "poke"],
          moveKeys: ["jab", "jab-1"],
        },
        {
          id: "df1",
          stageId: "pokes",
          name: "The Mid Check",
          notation: "df+1",
          purpose:
            "i13 mid, -6 on block, +5 on hit, +9 on counter-hit. Wavu lists it as a mid check and also as one of his lacklustre small buttons — both are true.",
          whenToUse:
            "Checking someone about to press. It ends your turn on block, so it buys information rather than pressure.",
          leverlessTip:
            "Roll into df from d rather than stabbing at the diagonal. df+1,2 extends it into a wall splat and is only -9.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Check with df+1 and return to guard.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke"],
          moveKeys: ["df1", "df1-2"],
        },
        {
          id: "df4",
          stageId: "pokes",
          name: "Side Kick",
          notation: "df+4",
          purpose:
            "i13~14 mid at -9 on block and +2 on hit. The other listed mid check, with more range than df+1 and worse frames.",
          whenToUse:
            "At the range df+1 does not cover. The df+4,4 extension is your -13 punish, so the button is worth owning anyway.",
          leverlessTip:
            "Same diagonal, kick hand. Do not throw the second hit on block — the string is -15.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Alternate df+1 and df+4 by range.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke"],
          moveKeys: ["df4", "df4-4"],
        },
        {
          id: "b1",
          stageId: "pokes",
          name: "b+1 and the Wall Splat",
          notation: "b+1,2",
          purpose:
            "b+1 is an i12 high at -6. The b+1,2 extension is Wavu's listed i12 wall splat and hits for +23a (+13), at -14 on block.",
          whenToUse:
            "b+1 alone as a fast check; the full string near a wall, where the splat is the whole point and -14 is a price worth paying.",
          leverlessTip:
            "Hit-confirm where you can. Away from a wall the string is a -14 gift; at the wall it is a round.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Wall splat with b+1,2 and convert.",
          },
          difficulty: "medium",
          tags: ["i12", "wall splat"],
          moveKeys: ["b1", "b1-2"],
        },
        {
          id: "ws4",
          stageId: "pokes",
          name: "Toe Smash",
          notation: "ws4",
          purpose:
            "i11~12 while-standing mid, -3 on block and +8 on hit. Wavu's listed crouching mid check, and unusually safe for one.",
          whenToUse:
            "Every time you come out of crouch — which, with a wavedash gameplan, is constantly.",
          leverlessTip:
            "Release down and press 4 as he rises. It comes out of the wavedash naturally; you are already crouching.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Exit a wavedash into ws4.",
          },
          difficulty: "easy",
          tags: ["i11", "mid", "while standing"],
          moveKeys: ["ws4"],
        },
        {
          id: "d4",
          stageId: "pokes",
          name: "The Chip Low",
          notation: "d+4",
          purpose:
            "i12 low at -15 on block for 6 damage. It is not good. It exists so that standing and blocking mids forever is not completely free.",
          whenToUse:
            "Rarely. Wavu's assessment is blunt — Hellsweep is the only genuinely threatening low he has, and everything else is a placeholder.",
          leverlessTip:
            "One tap from crouch. The discipline is throwing it seldom enough that it still makes them think.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Mix d+4 into a poke sequence without becoming readable.",
          },
          difficulty: "easy",
          tags: ["low", "poke"],
          moveKeys: ["d4", "db2"],
        },
        {
          id: "f2",
          stageId: "pokes",
          name: "893P",
          notation: "f+2",
          purpose:
            "i17~18 mid at -8 on block, +3 on hit. A ranged mid that keeps you safe without giving you a turn.",
          whenToUse:
            "At range, to contest space without committing. This is the shape of most of his mids — safe, and worth little on hit.",
          leverlessTip:
            "The f+2,4 extension is -11; leave it alone unless you have a read.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Poke with f+2 at maximum range.",
          },
          difficulty: "easy",
          tags: ["mid", "poke", "safe"],
          moveKeys: ["f2", "f2-4"],
        },
        {
          id: "b4",
          stageId: "pokes",
          name: "Demon Steel Pedal",
          notation: "b+4",
          purpose:
            "i17~18 mid, -8 on block, +6 on hit and +30a (+24) on counter-hit. Wavu singles it out as granting incredible okizeme — it is the move that starts his knockdown game.",
          whenToUse:
            "As a counter-hit fish, and as a combo ender when you want the wake-up situation more than the last few points of damage.",
          leverlessTip:
            "b then 4. Wavu's combo list ends several routes with b+4 explicitly for better oki.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "End a combo with b+4 and set up a wake-up read.",
          },
          difficulty: "medium",
          tags: ["mid", "counter-hit", "oki"],
          moveKeys: ["b4"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 03 — LAUNCHERS & COUNTERHITS                               */
    /* ---------------------------------------------------------------- */
    {
      id: "launchers",
      number: 3,
      name: "Launchers & Counterhits",
      focus: "All of them hurt you when blocked",
      description:
        "Wavu's launcher list is i11 EWGF, i15 d+3+4 standing, and i14 ws2 crouching. Outside the electric, none of them is safe: d+3+4 is -15, Samsara is -25, SS.2 is -22. That is the trade the character is built on — Living On The Edge is one of Wavu's stated weaknesses, not a compliment.",
      items: [
        {
          id: "d3plus4",
          stageId: "launchers",
          name: "Double Lift Kicks",
          notation: "d+3+4",
          purpose:
            "i15~16 standing launcher for +30a (+20). At -15 on block it is launch-punishable itself, so it is a read every time.",
          whenToUse:
            "As your -15 punish, and as a committed read in neutral. Wavu's punish list gives it a 69-damage staple.",
          leverlessTip:
            "d plus both kicks. It is the launcher you use when the electric is not reliable yet — same job, worse frames on block.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with d+3+4 and complete the bread and butter.",
          },
          difficulty: "medium",
          tags: ["i15", "launcher"],
          moveKeys: ["d3plus4"],
        },
        {
          id: "alaya",
          stageId: "launchers",
          name: "Alaya",
          notation: "ws2",
          purpose:
            "i14~15 while-standing launcher for +72a (+56) — one of very few i14 while-standing launchers in the game, and the mid half of his wavedash mixup. Wavu notes it tracks to the right.",
          whenToUse:
            "As your -14 crouching punish, and out of the wavedash as the mid. Stage 6 is entirely about the second use.",
          leverlessTip:
            "Release down, then 2. Doing it instantly out of a wavedash is its own technique and has its own item in Stage 6.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a blocked low with ws2 and convert.",
          },
          difficulty: "hard",
          tags: ["i14", "launcher", "while standing", "signature"],
          moveKeys: ["ws2"],
        },
        {
          id: "samsara",
          stageId: "launchers",
          name: "Samsara",
          notation: "u+4",
          purpose:
            "A low-crush launcher at i20~21 for +15a (+5). Wavu says it goes under even some mids. It is also -25 on block, which is a full launch against you.",
          whenToUse:
            "As a hard read on a low, or on someone who has stopped respecting your turn. Wavu's punish list uses it at -20 for a 77-damage staple.",
          leverlessTip:
            "u+4 leaves the ground, so it loses to anything that catches airborne. This is a panic button that is death on block — Wavu's words.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Crush a low with u+4 and convert the launch.",
          },
          difficulty: "hard",
          tags: ["launcher", "low crush", "panic"],
          moveKeys: ["u4"],
        },
        {
          id: "uf2",
          stageId: "launchers",
          name: "Decapitating Sword",
          notation: "uf+2",
          purpose:
            "i20~23 high that launches for +25a and is only -4 on block. The rare Devil Jin launcher that does not cost you the round when blocked.",
          whenToUse:
            "As a whiff punisher and against someone standing still. It is a high, so it loses to crouching entirely.",
          leverlessTip:
            "uf then 2. Being -4 makes it the one launcher you can throw out on suspicion rather than on certainty.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Whiff-punish with uf+2 and convert.",
          },
          difficulty: "medium",
          tags: ["launcher", "safe", "high"],
          moveKeys: ["uf2", "uf1"],
        },
        {
          id: "ss2",
          stageId: "launchers",
          name: "Devil Twister",
          notation: "SS.2",
          purpose:
            "i17~18 sidestep launcher for +72a — his single biggest raw launch. At -22 on block it is the most punishable thing in the kit.",
          whenToUse:
            "Only after a step has already made something whiff. Wavu's punish list places it at -26, which tells you how rarely it is safe to reach for.",
          leverlessTip:
            "Step, then 2 without passing through neutral. If you are unsure the step landed, do not press it.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Step a linear move and launch with SS.2.",
          },
          difficulty: "hard",
          tags: ["launcher", "sidestep"],
          moveKeys: ["ss2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 04 — PUNISHMENT                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "punishment",
      number: 4,
      name: "Punishment",
      focus: "Excellent punishment, once the hands are there",
      description:
        "Wavu lists Excellent Punishment as a strength: EWGF and uf+1 as whiff punishers, a very good i10 in 1,1,2, one of the best i11 while-standing punishers in ws4,4, and a rare i14 while-standing launcher in ws2. The ladder below is the ordinary half. The EWGF punish at -15 is rated separately by Wavu at rhythm 4 — it is a different skill from landing an electric in neutral.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "Standing -10",
          notation: "1,1,2",
          purpose:
            "The Mishima Flash Punch, i10 into +18a (+13) — it launches. Wavu calls it a very good i10 punish, and it is: most characters get a jab string.",
          whenToUse: "Anything blocked at -10 or -11.",
          leverlessTip:
            "Three taps during blockstun. It is -17 on block, so it is a punish and never a poke.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 1,1,2 and convert.",
          },
          difficulty: "easy",
          tags: ["punish", "i10", "launcher"],
          moveKeys: ["flash-claw", "jab-2-2", "right-2"],
        },
        {
          id: "punish-12",
          stageId: "punishment",
          name: "Standing -12",
          notation: "b+1,2",
          purpose:
            "i12 for +23a (+13) and Wavu's listed i12 wall splat. At -12 this is more than the jab string gives you.",
          whenToUse: "Anything blocked at -12, and preferentially near a wall.",
          leverlessTip:
            "b+1 then 2. Away from a wall you are choosing damage over the jab string; at the wall you are choosing the round.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -12 move with b+1,2.",
          },
          difficulty: "easy",
          tags: ["punish", "i12", "wall splat"],
          moveKeys: ["b1-2"],
        },
        {
          id: "punish-13",
          stageId: "punishment",
          name: "Standing -13",
          notation: "df+4,4",
          purpose:
            "The Tsunami Kick string off your mid check. At -13 it is the biggest thing that still reaches before the launchers open.",
          whenToUse: "Anything blocked at -13.",
          leverlessTip:
            "df+4 then 4. The first hit is a button you already throw, so the punish costs one extra press.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -13 move with df+4,4.",
          },
          difficulty: "easy",
          tags: ["punish", "i13"],
          moveKeys: ["df4-4"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "Standing -14",
          notation: "b+2,3",
          purpose:
            "A Heat Engager at -14 for +8a (-1). At the same disadvantage the electric launches for a 67-damage staple, so this is the choice you make when Heat is worth more or the electric is not reliable.",
          whenToUse:
            "At -14 when you want Heat. Wavu lists b+2,3 among his five Heat Engagers.",
          leverlessTip:
            "The string is -14 on block itself. Take it as a punish, not as pressure.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -14 move with b+2,3 and note the Heat gain.",
          },
          difficulty: "medium",
          tags: ["punish", "i14", "heat engager"],
          moveKeys: ["b2-3", "ewgf"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "Standing -15",
          notation: "d+3+4",
          purpose:
            "+30a (+20) and a full combo. Wavu's punish list gives it a 69-damage staple.",
          whenToUse:
            "Anything blocked at -15 or worse where you are not taking the electric.",
          leverlessTip:
            "d plus both kicks during blockstun. The launch is only worth what you convert, so drill the route alongside it.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with d+3+4 and complete the combo.",
          },
          difficulty: "medium",
          tags: ["punish", "i15", "launcher"],
          moveKeys: ["d3plus4"],
        },
        {
          id: "punish-16",
          stageId: "punishment",
          name: "Standing -16",
          notation: "uf+3+4",
          purpose:
            "Hisou, a two-hit mid at -16 on block for +7cg. At -16 it is the punish that reaches when nothing faster is worth it.",
          whenToUse:
            "Anything blocked at -16 or worse. The Annihilation Beam extension is available in Heat.",
          leverlessTip:
            "uf plus both kicks. Do not use it outside punishment — -16 on block is a launch against you.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish a -16 move with uf+3+4.",
          },
          difficulty: "medium",
          tags: ["punish", "i16"],
          moveKeys: ["uf3plus4", "uf3plus4-beam"],
        },
        {
          id: "punish-ewgf",
          stageId: "punishment",
          name: "EWGF Punishment",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "Wavu rates -15 EWGF punishment as its own technique: importance 2, dexterity 4, RHYTHM 4. Landing an electric from a standing start and landing one out of blockstun are different skills, and the second is the harder rhythm.",
          whenToUse:
            "At -14 and worse once it is reliable. Until then, d+3+4 gets most of the damage with none of the risk.",
          leverlessTip:
            "The difficulty is that blockstun sets the timing for you rather than you choosing it. Drill it against a recorded blocked move, not from neutral.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 9,
            rep: "Punish a blocked -14 move with a clean electric.",
          },
          difficulty: "expert",
          tags: ["punish", "execution", "launcher"],
          moveKeys: ["ewgf"],
        },
        {
          id: "punish-crouch",
          stageId: "punishment",
          name: "Punishing from Crouch",
          notation: "ws4,4 · ws1,4 · ws2",
          purpose:
            "ws4,4 at -11 — Wavu calls it one of the best i11 while-standing punishers in the game — ws1,4 at -13 for +17a (+8), and Alaya at -14 for +72a (+56).",
          whenToUse:
            "Every blocked low. With a wavedash gameplan you spend a lot of the round crouching, so this ladder comes up more for him than for most.",
          leverlessTip:
            "All three are a release of down into a button. Know which one you owe before you block the low, not after.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["punish", "while standing"],
          moveKeys: ["ws4-4", "ws1-4", "ws2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 05 — CORE COMBOS                                           */
    /* ---------------------------------------------------------------- */
    {
      id: "combos",
      number: 5,
      name: "Core Combos",
      focus: "Excellent damage, high carry, and the wall at the end",
      description:
        "Wavu lists brutal combos and okizeme as a strength: excellent damage, high wall carry, and wall combos that set up his wake-up game. The routes are built from a small number of pieces — 3,1 to pick up, b,f+2,1 as filler, and a Tornado ender you choose based on whether you want damage or the wall. The full list is on the Combos screen; these are the ones to drill.",
      items: [
        {
          id: "bnb-regular",
          stageId: "combos",
          name: "Regular Launch Route",
          notation: "3,1 b,f+2,1,d+2 T! df+3,2,4",
          purpose:
            "The bread and butter off d+3+4 or any normal launch. Wavu's staple list rates the same shape good for damage and wall carry.",
          whenToUse: "Every d+3+4, uf+2 or SS.2 launch.",
          leverlessTip:
            "3,1 is the pickup — get to it fast. The d+2 at the end of b,f+2,1 is what sets the Tornado height.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with d+3+4 and complete the route without dropping.",
          },
          difficulty: "hard",
          tags: ["combo", "bread and butter"],
          moveKeys: ["d3plus4", "three-1", "bf2-1", "df3-2-4"],
        },
        {
          id: "bnb-instant-tornado",
          stageId: "combos",
          name: "Instant Tornado Route",
          notation: "3,1 b,f+2,1,2",
          purpose:
            "The shorter route for a launch that already spent the Tornado — Alaya being the one you will hit most.",
          whenToUse: "After ws2 and other instant-Tornado launchers.",
          leverlessTip:
            "Same opening, different ender. Learn which of your launchers spends the Tornado before you need to know mid-combo.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with ws2 and complete the instant-Tornado route.",
          },
          difficulty: "hard",
          tags: ["combo", "tornado"],
          moveKeys: ["ws2", "three-1", "bf2-1-2"],
        },
        {
          id: "combo-ewgf",
          stageId: "combos",
          name: "Electric Route",
          notation: "EWGF 3,1,2 T! MCR.4,2,1,UF",
          purpose:
            "The staple off an electric. Wavu's list has this shape in the low fifties with a Mourning Crow ender, and notes that skipping the UF input can leave a wall combo instead.",
          whenToUse: "Every electric launch, once Stage 7 has taught you Mourning Crow.",
          leverlessTip:
            "3,1,2 is Hell Cyclone and carries. The MCR ender is worth learning even before the stance stage, because this is where you will use it most.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Launch with EWGF and complete the electric route.",
          },
          difficulty: "expert",
          tags: ["combo", "launcher"],
          moveKeys: ["ewgf", "three-1-2", "mcr-4-2-1"],
        },
        {
          id: "combo-wall",
          stageId: "combos",
          name: "Wall Carry and the Wall",
          notation: "3,1 b,f+2,1,d+2 T! …",
          purpose:
            "His carry is high enough that most mid-screen launches reach a wall. Wavu lists damaging wall combos setting up incredible okizeme as a distinct strength.",
          whenToUse:
            "Any launch with a wall in the direction you are facing. Choose the carry ender over the damage ender when the wall is reachable.",
          leverlessTip:
            "Decide before the Tornado, not after. The two enders diverge at that point and you cannot change your mind.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Carry a mid-screen launch to the wall and finish.",
          },
          difficulty: "hard",
          tags: ["combo", "wall"],
          moveKeys: ["bf2-1", "df3-2-4"],
        },
        {
          id: "combo-oki",
          stageId: "combos",
          name: "Ending for Okizeme",
          notation: "… b+4",
          purpose:
            "Wavu's combo list ends several routes with b+4 and marks it 'better oki' explicitly. Trading a few points of damage for the wake-up situation is usually correct on this character.",
          whenToUse:
            "When the round is not going to end on this combo. The knockdown is worth more than the damage you gave up.",
          leverlessTip:
            "OTG.d+1+2 covers a grounded opponent afterwards. Okizeme is a listed strength — treat the end of the combo as the start of the next mixup.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "End a combo with b+4 and follow with a wake-up read.",
          },
          difficulty: "medium",
          tags: ["combo", "oki"],
          moveKeys: ["b4", "otg-beam"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 06 — THE WAVEDASH MIXUP                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "mixup",
      number: 6,
      name: "The Wavedash Mixup",
      focus: "The fastest low launcher in the game, or an i14 mid",
      description:
        "This is the character. Out of one wavedash you threaten Hellsweep — which Wavu calls the fastest low launcher in the game — and Alaya, an i14 mid launcher that tracks to the right. Wavu notes the pairing cannot be option selected with movement: the opponent has to guess, and both guesses lose. The cost is on your side too. Hellsweep is -23c on block, and Wavu's summary is that his gameplan is an extremely risky one.",
      items: [
        {
          id: "hellsweep",
          stageId: "mixup",
          name: "Hellsweep",
          notation: "f,n,d,DF+4",
          purpose:
            "The i16 low itself: -23c on block, -5c on hit. On its own it is a poke that loses badly when blocked. Its value is entirely in the extensions and in what it forces the opponent to think about.",
          whenToUse:
            "Out of a wavedash, as the low half of the mixup. Wavu's weakness list is titled 'I Have No Lows & I Must Hellsweep' — this is the only threatening low he has, so it has to be thrown despite the risk.",
          leverlessTip:
            "The DF must be held, not tapped — that is what separates it from the ordinary crouch dash kick. Get the hold consistent before adding extensions.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Land the Hellsweep cleanly out of a wavedash.",
          },
          difficulty: "hard",
          tags: ["low", "signature", "launch punishable"],
          moveKeys: ["hellsweep"],
        },
        {
          id: "hellsweep-launch",
          stageId: "mixup",
          name: "Spinning Demon Hellfire Beam",
          notation: "f,n,d,DF+4,1+2",
          purpose:
            "The extension that makes it the fastest low launcher in the game: +58a (+42) on hit, from an i16 low.",
          whenToUse:
            "Whenever the Hellsweep hits. This is the reward half of the guess — a low that launches for a full combo.",
          leverlessTip:
            "Both punches after the sweep. Hit-confirming is hard at i16; most players commit and accept the block punish.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Land the Hellsweep and convert with 1+2.",
          },
          difficulty: "hard",
          tags: ["low", "launcher", "signature"],
          moveKeys: ["hellsweep-beam", "hellsweep-4"],
        },
        {
          id: "iws2",
          stageId: "mixup",
          name: "Instant While-Standing Alaya",
          notation: "wavedash → ws2",
          purpose:
            "The mid half. Wavu rates iWS from wavedash importance 3, dexterity 2, RHYTHM 4 — it is not a hard input, it is a hard moment. Landing it means the wavedash threatens a launcher at both heights.",
          whenToUse:
            "Every time you would throw a Hellsweep and think they are ducking. The two together are the mixup; either alone is a habit.",
          leverlessTip:
            "The crouch dash already has you crouching — the trick is releasing down and pressing 2 at the earliest actionable frame, not waiting to stand. Rhythm 4 means drill it with the input display, not by feel.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Wavedash and land ws2 at the earliest possible frame.",
          },
          difficulty: "expert",
          tags: ["launcher", "execution", "signature"],
          moveKeys: ["ws2"],
        },
        {
          id: "hellsweep-heat",
          stageId: "mixup",
          name: "Spinning Demon Leviathan",
          notation: "f,n,d,DF+4,H.3",
          purpose:
            "The Heat extension: +72a (+56a). Wavu lists a better Hellsweep extension as one of the specific things Heat gives him.",
          whenToUse:
            "In Heat, in place of the ordinary 1+2 ender. The mixup does not change; the reward does.",
          leverlessTip:
            "Same sweep, different follow-up. Know which ender you are on before you commit — the input windows do not wait for you to decide.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "In Heat, land the Hellsweep and convert with the H.3 extension.",
          },
          difficulty: "hard",
          tags: ["low", "heat", "launcher"],
          moveKeys: ["hellsweep-heat"],
        },
        {
          id: "mixup-concept",
          stageId: "mixup",
          name: "Running the Mixup",
          notation: "—",
          purpose:
            "The habit that ties the stage together. Two options, both launching, neither steppable — but both extremely unsafe, so the mixup is a resource you spend rather than a loop you run.",
          whenToUse:
            "When you have a life lead to protect, or when you need one. Not as your default approach.",
          leverlessTip:
            "The execution is Stage 1's. Everything here is a decision problem, and the decision is how often you are willing to lose the round for it.",
          drill: {
            type: "manual",
            checklist: [
              "Hellsweep is i16 and -23c on block — blocked once is a full launch.",
              "Alaya is i14 and launches for +72a (+56); it tracks to the right.",
              "Wavu: the mixup cannot be option selected with movement.",
              "Both options are unsafe. This is a guess you force, not pressure you keep.",
              "In Heat the low ender becomes +72a (+56a) instead of +58a (+42).",
              "If they start ducking, the answer is Alaya, not a bigger low.",
            ],
          },
          difficulty: "expert",
          tags: ["concept", "mixup", "signature"],
          moveKeys: ["hellsweep-beam", "ws2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 07 — MOURNING CROW & FLIGHT                                */
    /* ---------------------------------------------------------------- */
    {
      id: "stances",
      number: 7,
      name: "Mourning Crow & Flight",
      focus: "Power mids, and the float that punishes them",
      description:
        "Mourning Crow (f+3) is his second gameplan: a stance full of power mids that lets him blitz the neutral. Wavu is equally clear that it can be floated — an opponent who catches you entering it airborne gets a combo. The way in matters more than the stance itself, which is why this stage starts with the two moves that enter it at plus rather than with f+3.",
      items: [
        {
          id: "mcr-entry",
          stageId: "stances",
          name: "Entering at Plus",
          notation: "uf+1 · ws1,1",
          purpose:
            "uf+1 is +11~+13 into Mourning Crow ON BLOCK; ws1,1 is +11 into it on block and +16 on hit. Entering the stance from a raw f+3 hands the opponent a free float — entering at plus does not.",
          whenToUse:
            "Whenever you want the stance. uf+1 is also one of Wavu's listed whiff punishers, so it earns its place twice.",
          leverlessTip:
            "Both leave you already in the stance with frames in hand. Build the habit of reaching Mourning Crow through these rather than through f+3.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Enter Mourning Crow with uf+1 on block and press a stance mid.",
          },
          difficulty: "medium",
          tags: ["stance", "plus on block"],
          moveKeys: ["uf1", "ws1-1"],
        },
        {
          id: "mcr-1",
          stageId: "stances",
          name: "Tiger Thrush",
          notation: "MCR.1",
          purpose:
            "i22 mid that is +8 ON BLOCK and +20d on hit. Blocking it correctly still leaves them losing the exchange.",
          whenToUse:
            "From the stance against someone holding still. At i22 it is slow enough to be interrupted, so it needs the plus frames from your entry.",
          leverlessTip:
            "One punch from the stance. The +8 is the reason the stance is a threat rather than a pose.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land MCR.1 on block and enforce the plus.",
          },
          difficulty: "medium",
          tags: ["stance", "plus on block"],
          moveKeys: ["mcr-1"],
        },
        {
          id: "mcr-3",
          stageId: "stances",
          name: "Venomous Torment",
          notation: "MCR.3",
          purpose:
            "i23 special mid that launches for +70a (+54) and is only -7 on block. A launcher that safe is the best thing in the stance by a distance.",
          whenToUse:
            "From the stance when you expect them to press. Being -7 means a blocked one costs you the turn and nothing else.",
          leverlessTip:
            "One kick from the stance. Wavu's mini-combo list opens several routes with ~f MCR.3, which is the cancel straight into it.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch from Mourning Crow with MCR.3 and convert.",
          },
          difficulty: "hard",
          tags: ["stance", "launcher", "safe"],
          moveKeys: ["mcr-3"],
        },
        {
          id: "mcr-2-2",
          stageId: "stances",
          name: "Dark Arachnid Twister",
          notation: "MCR.2,2",
          purpose:
            "The stance's Heat Engager, -14c on block and +2a on hit. Wavu lists it among his five engagers.",
          whenToUse:
            "From the stance when Heat is close. At -14c on block it is a commitment, so engage on a read rather than on reflex.",
          leverlessTip:
            "MCR.2 alone is -9 and a reasonable check; the second hit is the commitment. Stopping at one is a real option.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Engage Heat from Mourning Crow with MCR.2,2.",
          },
          difficulty: "medium",
          tags: ["stance", "heat engager"],
          moveKeys: ["mcr-2", "mcr-2-2"],
        },
        {
          id: "mcr-unblockable",
          stageId: "stances",
          name: "Inner Turmoil & Inner Purgatory",
          notation: "MCR.1+2 · H.MCR.1+2",
          purpose:
            "An unblockable high from the stance, and its Heat version. Wavu says the Heat one is what gives Mourning Crow an actual mixup — a stance of mids plus an unblockable is a genuine guess.",
          whenToUse:
            "In Heat, from the stance, against someone who has learned to block the mids. Out of Heat it is a slow read.",
          leverlessTip:
            "It is a HIGH — crouching beats it outright. The mixup is against someone standing to block your mids, which is exactly who the stance creates.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "In Heat, threaten the stance mids and land H.MCR.1+2.",
          },
          difficulty: "hard",
          tags: ["stance", "unblockable", "heat"],
          moveKeys: ["mcr-1plus2", "mcr-heat-1plus2"],
        },
        {
          id: "mcr-4-string",
          stageId: "stances",
          name: "Forsaken Soul",
          notation: "MCR.4,1",
          purpose:
            "+1 on block and +71a (+51) on hit. The MCR.4 opener is a dreadful -29 on its own, so the string is the only way it should ever come out.",
          whenToUse:
            "As a combo ender, which is where Wavu's staple routes use it. MCR.4,2,1 is the other ending and can leave a wall combo.",
          leverlessTip:
            "Never stop on MCR.4. -29 is among the worst block values in the game.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Finish a combo with the MCR.4 string.",
          },
          difficulty: "hard",
          tags: ["stance", "combo ender"],
          moveKeys: ["mcr-4", "mcr-4-1", "mcr-4-2-1"],
        },
        {
          id: "flight",
          stageId: "stances",
          name: "Flight",
          notation: "3+4",
          purpose:
            "Devil Jin's wings. FLY.1 launches for +67a (+47) at -3 on block; FLY.3 is a mid at -15~-8; FLY.4,1 is +1 on block for +71a (+51).",
          whenToUse:
            "As a movement and approach option rather than a pressure stance. It is the least essential thing in his kit and the most situational.",
          leverlessTip:
            "3+4 leaves the ground, with everything that implies. Learn what beats it before you rely on it — being airborne against a Mishima is how rounds end.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Flight and land FLY.1 on a whiffed approach.",
          },
          difficulty: "expert",
          tags: ["stance", "situational"],
          moveKeys: ["fly-1", "fly-3", "fly-4-1"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 08 — DEFENSE, HEAT & GAMEPLAN                              */
    /* ---------------------------------------------------------------- */
    {
      id: "gameplan",
      number: 8,
      name: "Defense, Heat & Gameplan",
      focus: "Panic buttons that are death on block",
      description:
        "Wavu lists Panic Buttons as a strength and Living On The Edge as a weakness, and both refer to the same three moves. Samsara, Wicked Jambu Spear and the b+1+3 reversal all punish an opponent for taking their turn — and all of them lose the round when read. This stage is about knowing the price before you press.",
      items: [
        {
          id: "reversal",
          stageId: "gameplan",
          name: "Imperial Wrath",
          notation: "b+1+3",
          purpose:
            "i15 mid that launches for +16a (+6) and is only -8 on block. Wavu lists it as a reversal — a defensive option that turns their turn into your combo.",
          whenToUse:
            "Against a predictable string continuation. At -8 it is the least punishing of his defensive gambles.",
          leverlessTip:
            "b plus 1 and 3. Of the panic options this is the one you can afford to be wrong with.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Interrupt a pressure sequence with b+1+3 and convert.",
          },
          difficulty: "medium",
          tags: ["defense", "reversal", "launcher"],
          moveKeys: ["b1plus3"],
        },
        {
          id: "evasion",
          stageId: "gameplan",
          name: "Wicked Jambu Spear",
          notation: "b+3",
          purpose:
            "Flies backwards to evade retaliation, and is a Heat Engager. At -18~-15 on block it is a read, not an escape you can lean on.",
          whenToUse:
            "To leave a situation you are losing, and to engage Heat while doing it. Wavu lists it among his five Heat Engagers.",
          leverlessTip:
            "The evasion is the point; the damage is incidental. If they are not committing to anything, there is nothing to evade.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Evade a pressure string with b+3 and engage Heat.",
          },
          difficulty: "medium",
          tags: ["defense", "heat engager", "evasion"],
          moveKeys: ["b3"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat",
          notation: "2+3 · H.2+3",
          purpose:
            "Five engagers — b+2,3 · b+3 · uf+4 · f,F+2 · MCR.2,2. In Heat he gets the better Hellsweep extension, the Mourning Crow unblockable, and EWGF without the perfect input. The Heat Smash is +11 into Mourning Crow on block.",
          whenToUse:
            "Engage with whichever of the five the situation already gives you. Wavu notes his Heat Smash has the longest range in the game and enters the stance at advantage on block.",
          leverlessTip:
            "Getting the electric for free in Heat is the biggest single change. If your EWGF is not reliable yet, Heat is where it becomes usable.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Engage Heat with each of the five engagers once.",
          },
          difficulty: "medium",
          tags: ["heat", "heat engager"],
          moveKeys: ["heat-burst", "heat-smash", "ff2", "uf4", "b2-3"],
        },
        {
          id: "rage-art",
          stageId: "gameplan",
          name: "Rage Art",
          notation: "R.df+1+2",
          purpose:
            "i20 armoured comeback tool, -18 on block. The same rules as every character.",
          whenToUse: "In Rage, when a wrong guess loses the round anyway.",
          leverlessTip:
            "An unused Rage Art is zero damage. Do not save it for a moment that never arrives.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Use Rage Art to interrupt a pressure sequence.",
          },
          difficulty: "easy",
          tags: ["rage", "comeback"],
          moveKeys: ["rage-art"],
        },
        {
          id: "okizeme",
          stageId: "gameplan",
          name: "Okizeme",
          notation: "b+4 · OTG.d+1+2",
          purpose:
            "Wavu calls his okizeme excellent and says a well-timed read on a downed opponent leads to extreme damage. b+4 sets it up; the OTG beam covers them staying down.",
          whenToUse:
            "After every knockdown. This is where his damage output actually comes from — combo, wall, knockdown, repeat.",
          leverlessTip:
            "Learn one wake-up read per situation rather than five. The opponent has four options; you only need to beat the one they keep choosing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Knock down and take a wake-up read.",
          },
          difficulty: "hard",
          tags: ["oki", "concept"],
          moveKeys: ["b4", "otg-beam"],
        },
        {
          id: "gameplan-core",
          stageId: "gameplan",
          name: "The Gameplan",
          notation: "—",
          purpose:
            "Pulling it together. Wavu's summary is that unlocking him requires a lot of homework in both execution and fundamentals, which makes him a difficult character to play. The gameplan is short; the execution behind it is not.",
          whenToUse: "Every round.",
          leverlessTip:
            "None of the decisions here are hard. Wavedash, electric, iWS2 and the combo routes are, and they are what separate a Devil Jin who wins from one who does not.",
          drill: {
            type: "manual",
            checklist: [
              "Approach with the wavedash; it is the only thing that threatens both heights.",
              "Hellsweep or Alaya — force the guess, and accept that you also lose on a wrong one.",
              "Convert every launch. His damage is in the routes, not the openings.",
              "Carry to the wall, then take the knockdown over the last few points.",
              "Reach Mourning Crow through uf+1 or ws1,1, never a raw f+3.",
              "Panic buttons are death on block. Know the price before you press.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "gameplan"],
          moveKeys: ["ewgf", "hellsweep-beam", "ws2"],
        },
      ],
    },
  ],

  punishQuiz: [
    {
      id: "dvj-q-10",
      prompt: "-10",
      situation: "You blocked a move that leaves them at -10.",
      options: ["1,1,2", "b+1,2", "d+3+4", "ws2"],
      correctIndex: 0,
      explain:
        "1,1,2 is the i10 Flash Claw and it launches for +18a (+13). Wavu calls it a very good i10 punish — most characters get a jab string here.",
    },
    {
      id: "dvj-q-12",
      prompt: "-12",
      situation: "You blocked a move that leaves them at -12.",
      options: ["b+1,2", "1,1,2", "df+4,4", "uf+3+4"],
      correctIndex: 0,
      explain:
        "b+1,2 is i12 for +23a (+13) and is his listed i12 wall splat. 1,1,2 also reaches but gives up the damage and the wall.",
    },
    {
      id: "dvj-q-13",
      prompt: "-13",
      situation: "You blocked a move that leaves them at -13.",
      options: ["df+4,4", "b+1,2", "d+3+4", "b+2,3"],
      correctIndex: 0,
      explain:
        "df+4,4 is the i13 punish. d+3+4 needs -15 and would not come out in time.",
    },
    {
      id: "dvj-q-14",
      prompt: "-14",
      situation: "You blocked a move at -14 and Heat is close.",
      options: ["b+2,3", "d+3+4", "df+4,4", "ws4,4"],
      correctIndex: 0,
      explain:
        "b+2,3 is i14 and a Heat Engager. The electric also reaches at -14 for a 67-damage staple, so this is the choice when Heat is worth more than damage.",
    },
    {
      id: "dvj-q-15",
      prompt: "-15",
      situation: "You blocked a move that leaves them at -15.",
      options: ["d+3+4", "b+2,3", "b+1,2", "u+4"],
      correctIndex: 0,
      explain:
        "d+3+4 launches for +30a (+20) and Wavu's punish list gives it a 69-damage staple. This is where punishment becomes a full combo.",
    },
    {
      id: "dvj-q-16",
      prompt: "-16",
      situation: "You blocked a move that leaves them at -16.",
      options: ["uf+3+4", "df+4,4", "1,1,2", "ws1,4"],
      correctIndex: 0,
      explain:
        "uf+3+4 is the -16 entry on Wavu's list. It is -16 on block itself, so it belongs in punishment and nowhere else.",
    },
    {
      id: "dvj-q-crouch-11",
      prompt: "-11 (crouching)",
      situation: "You blocked a low that leaves them at -11.",
      options: ["ws4,4", "ws2", "1,1,2", "d+3+4"],
      correctIndex: 0,
      explain:
        "ws4,4 is i11 out of crouch — Wavu calls it one of the best i11 while-standing punishers in the game. Standing punishes are not available from a crouch block.",
    },
    {
      id: "dvj-q-crouch-13",
      prompt: "-13 (crouching)",
      situation: "You blocked a low that leaves them at -13.",
      options: ["ws1,4", "ws4,4", "ws2", "u+4"],
      correctIndex: 0,
      explain:
        "ws1,4 is i13 for +17a (+8). ws4,4 reaches too but gives up the damage; ws2 is i14 and one frame short.",
    },
    {
      id: "dvj-q-crouch-14",
      prompt: "-14 (crouching)",
      situation: "You blocked a low that leaves them at -14.",
      options: ["ws2", "ws1,4", "ws4,4", "b+2,3"],
      correctIndex: 0,
      explain:
        "Alaya is i14~15 and launches for +72a (+56) — a rare i14 while-standing launcher, and by far the biggest thing available here.",
    },
    {
      id: "dvj-q-crouch-20",
      prompt: "-20 (crouching)",
      situation: "You blocked a low that leaves them at -20.",
      options: ["u+4", "ws2", "ws4,4", "df+4,4"],
      correctIndex: 0,
      explain:
        "Samsara is Wavu's -20 entry, worth a 77-damage staple. ws2 still works and is safer to execute, but leaves damage behind.",
    },
  ],
};
