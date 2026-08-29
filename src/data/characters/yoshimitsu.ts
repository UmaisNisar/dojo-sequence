import type { Character } from "@/types";

/**
 * Yoshimitsu — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Every frame number quoted here comes from `yoshimitsu.frames.json`, which is
 * diffed against Wavu Wiki by `npm run verify:frames`. Where a startup is a
 * range (i15~16), punishment items quote the slower end — a punish that only
 * works on the lucky frame is not a punish.
 *
 * Wavu is unusually direct about this character, and the curriculum takes it
 * at its word rather than selling him:
 *
 *  - His generic tools are BELOW average, his lows are weak, his movement is
 *    bad, and most of his pressure "isn't real". Those are Wavu's words, and
 *    pretending otherwise teaches someone to play him badly.
 *  - What he has instead is Soul Stealer (1+4) at i6~9 — the fastest mid in
 *    the game — six stances, and an unusual number of usable unblockables.
 *  - Wavu rates Flash Punishment importance 5 of 5 at dexterity 1: the single
 *    most valuable thing on the character is also one of the easiest to
 *    execute. That is why it is in Stage 1 rather than saved as a reward.
 *
 * So the order is: learn the button that breaks the rules, learn the honest
 * buttons around it, then earn the stances. A player who opens with Flea
 * loses to a jab.
 */
export const yoshimitsu: Character = {
  id: "yoshimitsu",
  name: "Yoshimitsu",
  style: "Manji Ninjutsu",
  tagline:
    "The fastest mid in the game, six stances, and a sword he will happily stab himself with.",
  available: true,
  accent: { base: "#10b981", bright: "#6ee7b7", deep: "#047857" },
  stages: [
    /* ---------------------------------------------------------------- */
    /* STAGE 01 — MOVEMENT & THE FLASH                                  */
    /* ---------------------------------------------------------------- */
    {
      id: "movement",
      number: 1,
      name: "Movement & the Flash",
      focus: "Bad feet, one absurd button",
      description:
        "Wavu lists Bad Movement among his weaknesses outright — a below-average backdash and a mediocre sidestep. You will not out-move anybody, and this curriculum does not pretend you will. What you get instead is Soul Stealer: 1+4, i6~9, and a MID. It is the fastest mid attack in the game and the reason the character exists. Wavu rates Flash Punishment importance 5 out of 5 at dexterity 1 — the most valuable technique on the character is also one of the easiest to press, so it belongs here rather than in a reward stage.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closing distance. Yoshimitsu has no movement trick that covers ground for him, so the plain dash does work that most characters get for free.",
          whenToUse:
            "Whenever you need to be closer. His reliable buttons are mid-range pokes and his stances mostly want you already there.",
          leverlessTip:
            "Two clean forward taps with a full release between them. The release is the part people miss on a leverless — a held forward is a walk, not a dash.",
          drill: {
            type: "timed",
            durationSeconds: 30,
            rep: "Dash in and out of df+1 range without pressing a button.",
          },
          difficulty: "easy",
          tags: ["movement"],
        },
        {
          id: "backdash-cancel",
          stageId: "movement",
          name: "Backdash Cancel",
          notation: "b,b~db",
          purpose:
            "The universal retreat. His backdash is below average, which makes the cancel matter MORE for him than for a character who can simply walk away.",
          whenToUse:
            "Any time you want out. Accept that you cover less ground than the cast, and start backing up earlier than feels necessary.",
          leverlessTip:
            "b,b then immediately db to cancel the recovery, then b again. Leverless is genuinely better at this than a stick — the db is a second finger, not a wrist roll.",
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
          stageId: "movement",
          name: "Sidestep",
          notation: "u_d",
          purpose:
            "Stepping creates the whiffs his slow launchers need. It is also one of his weaker tools, so it has to be used deliberately rather than as a habit.",
          whenToUse:
            "After a blocked move that leaves them minus, and against linear strings. Not as a general-purpose panic — his step does not bail him out the way a better stepper's does.",
          leverlessTip:
            "A tap, not a hold; holding walks you into the wrong plane. Note which way you stepped — SS.2 is a real launcher and you want it on the correct side.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Step a linear string and punish the whiff.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
          moveKeys: ["ss1", "ss2"],
        },
        {
          id: "soul-stealer",
          stageId: "movement",
          name: "Soul Stealer — the Flash",
          notation: "1+4",
          purpose:
            "i6~9, and it is a mid. Nothing else in the game is that fast at that height. It is +14c on hit and a catastrophic -20 on block, so it is a scalpel rather than a jab.",
          whenToUse:
            "Interrupting gaps nobody else can interrupt, and punishing moves the rest of the cast has to let go. Wavu's punish table for this character starts at -6; everyone else's starts at -10.",
          leverlessTip:
            "1+4 is left punch and right kick — opposite hands on a leverless, which is why Wavu rates it dexterity 1. If your layout makes it awkward, rebind it. There is no reason to fumble the best button on the character.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -6 move with 1+4 the moment you recognise the block.",
          },
          difficulty: "easy",
          tags: ["i6", "mid", "signature"],
          moveKeys: ["soul-stealer"],
        },
        {
          id: "flash-punishment",
          stageId: "movement",
          name: "Flash Punishment",
          notation: "—",
          purpose:
            "The habit, not the button. Yoshimitsu punishes a whole class of moves that are safe against everybody else, and that only pays if you are actively looking for them.",
          whenToUse:
            "Constantly, once you know a matchup. Anything the opponent throws out because it is 'only' -6 to -9 is not safe against you.",
          leverlessTip:
            "The execution is trivial; the recognition is not. Train with the frame display on until a blocked -7 reads as free damage without you having to think about it.",
          drill: {
            type: "manual",
            checklist: [
              "1+4 is i6~9 and mid — it reaches gaps a jab cannot.",
              "It is -20 on block. A guess that misses is a full launch against you.",
              "Wavu's punish list starts at -6 for Yoshimitsu and -10 for the cast.",
              "NSS.1+4 is the same idea at i8~11 but leaves +64a — a combo, not +14.",
              "Pick two moves per matchup that you now punish and nobody else does.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "punish"],
          moveKeys: ["soul-stealer", "nss-soul-stealer"],
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
      focus: "Below-average buttons, used precisely",
      description:
        "Wavu's stated weakness is blunt: most of his pokes either end his turn or give too little on hit. That is the honest starting point. These are the buttons that hold a round together anyway — a fast mid check, a jab string that ends plus, and a high that counter-hits for real damage. Learn what each one actually leaves you at, because guessing wrong here is how a Yoshimitsu player ends up minus and pressing.",
      items: [
        {
          id: "df1",
          stageId: "pokes",
          name: "Tsuka Atemi — the Mid Check",
          notation: "df+1",
          purpose:
            "i13 mid at -4 on block and +5 on hit. This is his standing mid check and the button you press when you need something safe and fast.",
          whenToUse:
            "Checking an opponent who is about to press, and confirming your turn at close range.",
          leverlessTip:
            "df is a two-finger diagonal. Roll from d, do not stab at it — an early release gives you a standing 1 and a very different move.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Check with df+1 and return to neutral guard.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke"],
          moveKeys: ["df1"],
        },
        {
          id: "df4",
          stageId: "pokes",
          name: "Side Kick",
          notation: "df+4",
          purpose:
            "i12 mid, -7 on block, +4 on hit. A frame faster than df+1 and slightly worse on block — the two together cover the same job at different speeds.",
          whenToUse:
            "When i13 is a frame too slow, and at ranges where the kick reaches and the punch does not.",
          leverlessTip:
            "Same diagonal as df+1 with the kick hand. Practise them back to back so the diagonal is muscle memory before the button choice is.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Alternate df+1 and df+4 as pokes.",
          },
          difficulty: "easy",
          tags: ["i12", "mid", "poke"],
          moveKeys: ["df4", "df1"],
        },
        {
          id: "jab-string",
          stageId: "pokes",
          name: "Naguri Kabuto Wari",
          notation: "1,1",
          purpose:
            "The i10 jab into a mid that leaves +4c on hit. It is -9 on block, so it is not a pressure tool — it is the fastest thing that gets you a turn back on hit.",
          whenToUse:
            "Standard i10 punishment and interrupting. Do not throw the second hit out on block as a habit; -9 invites everything.",
          leverlessTip:
            "Two taps of the same finger. Delay is allowed, so let yourself confirm the first hit rather than mashing both.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Hit-confirm 1,1 and stop the string on block.",
          },
          difficulty: "easy",
          tags: ["i10", "poke"],
          moveKeys: ["jab", "jab-1"],
        },
        {
          id: "right-string",
          stageId: "pokes",
          name: "Mushibami",
          notation: "2,2",
          purpose:
            "i11 into a high that is only -1 on block and +15g on hit. That -1 is unusual for him: a string he can genuinely end a turn with rather than hand the turn back.",
          whenToUse:
            "As a i11 punisher and as the string you use when you want to stay close without going minus.",
          leverlessTip:
            "Both hits are the right punch. The string is high-high, so an opponent who ducks the second hit gets a free launch — mix it with the 2,1 mid ender against duckers.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -11 move with 2,2.",
          },
          difficulty: "easy",
          tags: ["i11", "poke", "punish"],
          moveKeys: ["right", "right-2", "right-1"],
        },
        {
          id: "magic-4",
          stageId: "pokes",
          name: "Magic 4",
          notation: "4",
          purpose:
            "i12~13 high at -11 on block, +0 on hit, and +20a (+10) on counter-hit. The counter-hit is the entire reason to press it.",
          whenToUse:
            "Against an opponent who presses after their turn ends. Not as a poke — -11 on block means a blocked Magic 4 gives up a real punish.",
          leverlessTip:
            "One tap of right kick. The temptation is to throw it constantly; the -11 is what stops you.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Counter-hit a pressing opponent with 4 and convert.",
          },
          difficulty: "medium",
          tags: ["i12", "high", "counter-hit"],
          moveKeys: ["four"],
        },
        {
          id: "b1",
          stageId: "pokes",
          name: "b+1 — Plus on Block",
          notation: "b+1",
          purpose:
            "i17 high that is +1 on block and +7 on hit. Slow, but one of the very few things he does that genuinely keeps his turn.",
          whenToUse:
            "At range, where the high will not be ducked on reaction, and as a way to end a sequence still plus instead of minus.",
          leverlessTip:
            "It chains into 1,1,1,1,1 — do not. The sixth hit is -73 on block. Press b+1 and stop.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Land b+1 and immediately press a i13 mid to enforce the plus.",
          },
          difficulty: "medium",
          tags: ["plus on block", "high"],
          moveKeys: ["b1", "b1-1", "b1-x6"],
        },
        {
          id: "ws4",
          stageId: "pokes",
          name: "Toe Smash",
          notation: "ws4",
          purpose:
            "i11~12 while-standing mid at -6 on block and +5 on hit. His crouch-exit check, and the answer at -11 from crouch.",
          whenToUse:
            "Every time you come out of a crouch and need something fast that does not lose to a mid.",
          leverlessTip:
            "Release down and press 4 as the character stands. On a leverless the release is instant, so ws moves come out earlier than you expect — do not pre-buffer.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Block a low, then punish with ws4 from crouch.",
          },
          difficulty: "easy",
          tags: ["i11", "mid", "while standing"],
          moveKeys: ["ws4"],
        },
        {
          id: "d2-string",
          stageId: "pokes",
          name: "Heshikirimutou",
          notation: "d+2,2",
          purpose:
            "The workhorse. -12 on block, +7g on hit, +28a (+22) on counter-hit — and d+2,2 is the backbone of nearly every combo route on the character.",
          whenToUse:
            "As a counter-hit fish in neutral, and as combo filler once Stage 5 starts. Learning it here means the combos later are just the routes.",
          leverlessTip:
            "d then 2,2. The B cancel after the second hit is what combos use — get comfortable with d+2,2 first, then add the cancel.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Land d+2,2 and note the counter-hit launch when it lands.",
          },
          difficulty: "medium",
          tags: ["counter-hit", "combo filler"],
          moveKeys: ["d2", "d2-2", "d2-2-2"],
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
      focus: "One safe launcher, and the ones worth the risk",
      description:
        "Wavu lists three launchers on the infobox: NSS.1+4 at i8 (situational), df+2 at i15 and uf+3 at i15. df+2 is the important one — at -7 on block it is a launcher he can throw out without losing the round for it, which is rare. Everything else here either needs a counter-hit or costs you badly when blocked.",
      items: [
        {
          id: "df2",
          stageId: "launchers",
          name: "Basic Uppercut — the Safe Launcher",
          notation: "df+2",
          purpose:
            "i15~16 mid, +34a (+24) on hit, and only -7 on block. A launcher that is safe on block is the single most valuable thing in his neutral.",
          whenToUse:
            "Your default punish at -15, your whiff punisher, and the button you press when you have read a mid coming.",
          leverlessTip:
            "The same diagonal as df+1 with the right punch. Because it is safe, it is the one launcher you are allowed to guess with.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Launch with df+2 and convert into the bread and butter.",
          },
          difficulty: "easy",
          tags: ["i15", "launcher", "safe"],
          moveKeys: ["df2"],
        },
        {
          id: "uf3",
          stageId: "launchers",
          name: "Rising Knee — the Hopkick",
          notation: "uf+3",
          purpose:
            "i15 mid, +32a (+22) on hit, -13 on block. The generic hopkick: it goes over lows, which df+2 does not.",
          whenToUse:
            "When you have read a low. At -13 on block it is a real commitment, so it is a read, not a poke.",
          leverlessTip:
            "uf then 3. Do not hold up — a held up jumps and loses the low-crush timing you wanted.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Low-crush with uf+3 and convert.",
          },
          difficulty: "medium",
          tags: ["i15", "launcher", "low crush"],
          moveKeys: ["uf3"],
        },
        {
          id: "flashing-steel",
          stageId: "launchers",
          name: "Flashing Steel",
          notation: "f,n,d,df+2",
          purpose:
            "i14~15 mid, -13 on block, +6g on hit — and +58a (+38) on counter-hit. Wavu lists it as both his i14 counter-hit launcher and his wall splat, standing or crouching.",
          whenToUse:
            "As a counter-hit tool against someone pressing, and near a wall where the splat is worth more than the raw damage.",
          leverlessTip:
            "A crouch-dash input: f, neutral, d, df. On a leverless this is four discrete taps and genuinely easier than on a stick — practise it slowly until the neutral is real and not skipped.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Land f,n,d,df+2 cleanly from a standing start.",
          },
          difficulty: "hard",
          tags: ["i14", "counter-hit", "wall splat"],
          moveKeys: ["cd2"],
        },
        {
          id: "b2-string",
          stageId: "launchers",
          name: "Oma Gehosen",
          notation: "b+2,1",
          purpose:
            "b+2 is an i14~15 mid; the b+2,1 ender is +28a (+18) on hit. Wavu lists b+2,1 among his i14 counter-hit launchers. The string is -17 on block, so it is not a button to throw out.",
          whenToUse:
            "When you have read a counter-hit. On block it is a full launch against you — this is a committed read every time.",
          leverlessTip:
            "b+2 then 1. Learn the b+2,2 ender alongside it: at -9 it is far safer, and it is the Heat Engager.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Counter-hit with b+2 and finish with the 1 ender.",
          },
          difficulty: "medium",
          tags: ["i14", "counter-hit", "launcher"],
          moveKeys: ["b2", "b2-1", "b2-2"],
        },
        {
          id: "kin-4",
          stageId: "launchers",
          name: "Whirlwind",
          notation: "KIN.4",
          purpose:
            "i16~17 high out of Kincho at +0 on block, +20a (+11) on hit and +49a on counter-hit. Being neutral on block from a stance is unusual and makes Kincho a real threat rather than a gimmick.",
          whenToUse:
            "Out of Kincho against someone respecting the stance. Wavu's combo list opens a 49-damage route with a counter-hit KIN.4.",
          leverlessTip:
            "1+2 to enter Kincho, then 4. It is a high — an opponent who ducks the stance entirely beats this, which is what KIN.3 and the Kincho mids are for.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Kincho and counter-hit with KIN.4.",
          },
          difficulty: "hard",
          tags: ["stance", "counter-hit", "launcher"],
          moveKeys: ["kin-4"],
        },
        {
          id: "ss2",
          stageId: "launchers",
          name: "Shrine",
          notation: "SS.2",
          purpose:
            "i16~17 sidestep mid, +28a (+18) on hit, -13 on block. His reward for stepping something correctly.",
          whenToUse:
            "Immediately after a successful sidestep, when the opponent's move has whiffed past you.",
          leverlessTip:
            "Step, then 2 without returning to neutral first — going back through neutral loses the sidestep state and gives you a standing 2 instead.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Step a linear move and launch with SS.2.",
          },
          difficulty: "medium",
          tags: ["sidestep", "launcher"],
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
      focus: "The only punish table in the game that starts at -6",
      description:
        "This is where Yoshimitsu stops being a novelty. Every other character's punish list begins at -10, because i10 is the fastest thing anyone has. His begins at -6, because Soul Stealer is i6~9 and mid. Learn this ladder and a large part of what the cast throws out for free stops being free. The two entries at the top are the ones nobody expects; the rest is ordinary punishment you still have to know.",
      items: [
        {
          id: "punish-6",
          stageId: "punishment",
          name: "The -6 Punish",
          notation: "1+4",
          purpose:
            "i6~9 mid, +14c on hit. Nothing else in Tekken punishes -6. This single entry rewrites which of the opponent's moves are actually safe.",
          whenToUse:
            "Anything blocked at -6 through -9 that you would otherwise have to let go.",
          leverlessTip:
            "Buffer it during blockstun like any punish. It is -20 if you are wrong about the block, so be sure you blocked rather than got hit.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -6 move with 1+4.",
          },
          difficulty: "easy",
          tags: ["punish", "i6", "signature"],
          moveKeys: ["soul-stealer"],
        },
        {
          id: "punish-8",
          stageId: "punishment",
          name: "The -8 Punish",
          notation: "NSS.1+4",
          purpose:
            "The No Sword version is i8~11 and the frame table lists it as +14 +64a — it launches. A -8 move becomes a full combo instead of a poke.",
          whenToUse:
            "At -8 or worse while you are already in No Sword Stance. Wavu's combo list builds a 47-damage route from exactly this.",
          leverlessTip:
            "You have to already be in NSS — b+1+2 takes time you do not have mid-punish. This is a punish you set up by choosing the stance earlier, not one you improvise.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "From NSS, punish a -8 move with 1+4 and convert.",
          },
          difficulty: "hard",
          tags: ["punish", "i8", "launcher", "stance"],
          moveKeys: ["nss-soul-stealer"],
        },
        {
          id: "punish-10",
          stageId: "punishment",
          name: "Standing -10",
          notation: "1,1",
          purpose:
            "The i10 jab string, +4c on hit. Small, guaranteed, and the fallback whenever you are not certain something bigger reaches.",
          whenToUse: "Anything blocked at -10 that you cannot reach with more.",
          leverlessTip:
            "Two taps of the same finger during blockstun. Punishment is the one place to be conservative.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 1,1.",
          },
          difficulty: "easy",
          tags: ["punish", "i10"],
          moveKeys: ["jab", "jab-1"],
        },
        {
          id: "punish-11",
          stageId: "punishment",
          name: "Standing -11",
          notation: "2,2",
          purpose:
            "i11 into a high that leaves +15g on hit, and only -1 on block if the punish somehow gets blocked. More damage than the jab string for one extra frame.",
          whenToUse: "Anything blocked at -11 or -12.",
          leverlessTip:
            "Both hits are right punch. Because the second hit is high, an opponent already crouching will duck it — that is a punish situation, so it should not come up.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -11 move with 2,2.",
          },
          difficulty: "easy",
          tags: ["punish", "i11"],
          moveKeys: ["right-2"],
        },
        {
          id: "punish-13",
          stageId: "punishment",
          name: "Standing -13",
          notation: "df+1,4",
          purpose:
            "The df+1 mid check extended into Autumn Leaves. At -13 this is the biggest thing that still reaches before the launchers open up.",
          whenToUse: "Anything blocked at -13 or -14 when you want damage over a Heat Engager.",
          leverlessTip:
            "df+1 then 4. The first hit is your standard poke, so the punish is one extra button on something your hands already know.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -13 move with df+1,4.",
          },
          difficulty: "easy",
          tags: ["punish", "i13"],
          moveKeys: ["df1-4"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "Standing -14 — the Heat Engager",
          notation: "b+2,2",
          purpose:
            "-9 on block and +2a on hit, and it is one of his five Heat Engagers. At -14 this buys you Heat rather than a few more points of damage.",
          whenToUse:
            "At -14 when Heat is close. If you would rather have the wall splat, f,n,d,df+2 also reaches here.",
          leverlessTip:
            "b+2 then 2 — note the 2 ender, not the 1. b+2,1 is -17 and does not belong in a punish.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -14 move with b+2,2 and note the Heat gain.",
          },
          difficulty: "medium",
          tags: ["punish", "i14", "heat engager"],
          moveKeys: ["b2-2", "cd2"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "Standing -15 — the Launch",
          notation: "df+2",
          purpose:
            "+34a (+24) and a full combo. This is where punishment stops being chip damage and starts being rounds.",
          whenToUse:
            "Anything blocked at -15 or worse. uf+3 reaches at -15 too and goes over lows, but df+2 is the default because it is safer if you misjudge.",
          leverlessTip:
            "The same df diagonal as your poke. Buffer during blockstun, then convert — the launch is worthless if you drop the combo.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with df+2 and finish the bread and butter.",
          },
          difficulty: "medium",
          tags: ["punish", "i15", "launcher"],
          moveKeys: ["df2", "uf3"],
        },
        {
          id: "punish-17",
          stageId: "punishment",
          name: "Standing -17",
          notation: "f,n,d,df+1",
          purpose:
            "Gehosen — i17~18 for +35a (+25a). The biggest launch on the ladder, and Wavu's staple routes build their highest-damage combos from it.",
          whenToUse:
            "Anything blocked at -17 or worse. It is -17 itself on block, so it is a punish and never a neutral button.",
          leverlessTip:
            "Crouch dash into 1 rather than 2. If the input is not reliable, df+2 at -15 still reaches everything this does — take the launch you can land.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Punish a -17 move with f,n,d,df+1 and convert.",
          },
          difficulty: "hard",
          tags: ["punish", "i17", "launcher"],
          moveKeys: ["cd1"],
        },
        {
          id: "punish-crouch",
          stageId: "punishment",
          name: "Punishing from Crouch",
          notation: "ws4 · ws1,2 · ws2,1",
          purpose:
            "The crouching ladder: ws4 at -11, ws1,2 at -13 for +14g, and ws2,1 at -15 for +36a (+26). Blocking a low has to mean something.",
          whenToUse:
            "Every blocked low. Wavu also lists f,n,d,df+2 as a wall splat from crouching, which is worth more than damage near a wall.",
          leverlessTip:
            "Release down and press as you rise. ws2,1 is the launcher — learn which of the three you owe the opponent before you need it.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["punish", "while standing"],
          moveKeys: ["ws4", "ws1-2", "ws2-1"],
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
      focus: "One filler, learned once, used everywhere",
      description:
        "His combo routes look intimidating written down and are mostly the same three pieces rearranged: 1+4 to pick up, d+2,2 with a back cancel as filler, and a Tornado ender. Learn the filler properly and the routes stop being memorisation. The full list — sixty-four routes with damage — is on the Combos screen; these are the ones worth drilling until they are automatic.",
      items: [
        {
          id: "bnb-regular",
          stageId: "combos",
          name: "Regular Launch Route",
          notation: "1+4 d+2,2,B df+1,2,1 T! 1+4 d+2,2",
          purpose:
            "The bread and butter off df+2 or any normal launch. Wavu's staple list has this at 57 damage with a NSS ender.",
          whenToUse: "Every df+2, uf+3 or ws2,1 launch.",
          leverlessTip:
            "The B after d+2,2 is a cancel, not a movement — tap back to recover early rather than holding it. That cancel is the piece everyone drops.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with df+2 and complete the route without dropping.",
          },
          difficulty: "hard",
          tags: ["combo", "bread and butter"],
          moveKeys: ["df2", "soul-stealer", "d2-2", "df1-2-1"],
        },
        {
          id: "bnb-pickup",
          stageId: "combos",
          name: "Pickup Route",
          notation: "d+2,2,B df+1 d+2,2,2 T! 1+4 d+2,2",
          purpose:
            "The route for a launch that leaves them lower — NSS.1+4 being the obvious one. Same pieces, different order.",
          whenToUse: "After NSS.1+4 and other pickup launches.",
          leverlessTip:
            "Two d+2 strings in one combo. Keep the rhythm even; rushing the second one is what causes the drop.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Launch with NSS.1+4 and complete the pickup route.",
          },
          difficulty: "hard",
          tags: ["combo", "stance"],
          moveKeys: ["nss-soul-stealer", "d2-2", "d2-2-2"],
        },
        {
          id: "tornado-filler",
          stageId: "combos",
          name: "The d+2,2 Cancel",
          notation: "d+2,2,B",
          purpose:
            "The one piece of execution that unlocks the whole combo list. Almost every route in Wavu's staples runs through it.",
          whenToUse:
            "As filler in every launch route. Drilling it in isolation is worth more than drilling any single combo.",
          leverlessTip:
            "d+2, 2, then a back tap the instant the second hit connects. Practise it as its own motion before putting it in a combo.",
          drill: {
            type: "consecutive-reps",
            target: 10,
            rep: "Land d+2,2 and cancel with B cleanly, ten times in a row.",
          },
          difficulty: "medium",
          tags: ["combo filler", "execution"],
          moveKeys: ["d2-2"],
        },
        {
          id: "combo-wall",
          stageId: "combos",
          name: "Wall Carry",
          notation: "d+2,2,2 T! …",
          purpose:
            "Wavu's wall list opens with d+2,2,2 into Tornado. The wall is where his damage stops being mediocre.",
          whenToUse:
            "Any launch with a wall behind them. f,n,d,df+2 is his listed wall splat and sets this up from neutral.",
          leverlessTip:
            "The third hit of d+2,2,2 is what carries. Do not cancel it here — the cancel is for the mid-screen route.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Carry a launch to the wall and finish.",
          },
          difficulty: "hard",
          tags: ["combo", "wall"],
          moveKeys: ["d2-2-2", "cd2"],
        },
        {
          id: "combo-bt",
          stageId: "combos",
          name: "Back-turned Route",
          notation: "3,1 DGF.2,4 T! f,F+1+2 BT.d+1",
          purpose:
            "Yoshimitsu spends real time back-turned, and Wavu keeps a separate combo section for it. 3,1 is also a Heat Engager, so this route buys Heat as well as damage.",
          whenToUse: "When a launch leaves them back-turned, and after Dragonfly mixups.",
          leverlessTip:
            "3,1 into Dragonfly then 2,4. Being back-turned is a state to use, not an accident to escape — BT.d+1 is a real low from there.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Convert a back-turned launch into the route.",
          },
          difficulty: "expert",
          tags: ["combo", "back turned", "heat engager"],
          moveKeys: ["three-1", "dgf-2", "bt-d1"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 06 — THE SIX STANCES                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "stances",
      number: 6,
      name: "The Six Stances",
      focus: "Earn them one at a time",
      description:
        "No Sword, Kincho, Dragonfly, Meditation, Flea and Indian. Wavu is clear that his stances are strong AND very unsafe — prone to being ducked, launched or floated — so this stage is deliberately last-but-two rather than first. Take them in order of what they actually buy you: No Sword upgrades the best button on the character, Kincho gives him a parry and plus frames, Dragonfly and Meditation are pressure and keepout, and Flea and Indian are for when you already know the matchup.",
      items: [
        {
          id: "nss-entry",
          stageId: "stances",
          name: "No Sword Stance",
          notation: "b+1+2",
          purpose:
            "Mutou no Kiwami. It changes what several buttons do, and the one that matters is Soul Stealer: NSS.1+4 launches for +64a where the sword version leaves +14c.",
          whenToUse:
            "When you expect a gap you can flash. Entering costs time, so it is a decision you make between exchanges rather than during one.",
          leverlessTip:
            "b+1+2 is three inputs at once on a leverless. If it is unreliable, that is a binding problem, not a skill problem — fix the layout.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Enter NSS and immediately press a mid.",
          },
          difficulty: "medium",
          tags: ["stance"],
          moveKeys: ["nss-soul-stealer", "nss-db1"],
        },
        {
          id: "nss-flash",
          stageId: "stances",
          name: "No Sword Flash",
          notation: "NSS.1+4",
          purpose:
            "i8~11 mid that the table lists as +14 +64a. It is the same panic button with a full combo attached, and it is why NSS is worth the entry cost.",
          whenToUse:
            "Every gap you would have flashed anyway, once you are already in stance. It is still -20 on block.",
          leverlessTip:
            "Identical input to the sword version. The only difference is that you paid for it in advance.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Interrupt a gap from NSS and convert the launch.",
          },
          difficulty: "hard",
          tags: ["stance", "i8", "launcher"],
          moveKeys: ["nss-soul-stealer"],
        },
        {
          id: "nss-power-low",
          stageId: "stances",
          name: "Spinning Cleave",
          notation: "NSS.FC.df+3",
          purpose:
            "A low that launches for +67a (+51). Wavu lists it as one of his two power lows. It is -26 on block, which is the price.",
          whenToUse:
            "As a hard read when the opponent has stopped ducking. -26 means a blocked one loses the round, so it is once a match, not once a round.",
          leverlessTip:
            "Full crouch inside NSS, then df+3. The crouch has to be real — a standing input gives you something else entirely.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land NSS.FC.df+3 and convert the launch.",
          },
          difficulty: "expert",
          tags: ["stance", "power low", "launcher"],
          moveKeys: ["nss-fc-df3"],
        },
        {
          id: "kincho-entry",
          stageId: "stances",
          name: "Kincho",
          notation: "1+2",
          purpose:
            "The stance that is also a parry. Wavu lists 1+2 as parrying all highs and mids — everything except throws, unblockables and charge moves.",
          whenToUse:
            "Against an opponent committed to a mid. It is the closest thing he has to a defensive reset, and Wavu rates KIN Parry dexterity 0 — it costs nothing to execute.",
          leverlessTip:
            "Both punches together. The difficulty is entirely in the read; there is no execution barrier at all.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Parry a mid with 1+2 and take your turn.",
          },
          difficulty: "medium",
          tags: ["stance", "parry", "defense"],
          moveKeys: ["kin-1plus2", "kin-2"],
        },
        {
          id: "kin-heat-engager",
          stageId: "stances",
          name: "Ganto",
          notation: "KIN.f+2",
          purpose:
            "i12~13 out of Kincho at -1 on block, and one of his five Heat Engagers. Fast, nearly safe, and it buys Heat.",
          whenToUse: "Out of Kincho when you want Heat rather than damage.",
          leverlessTip:
            "It is a high — an opponent who ducks the stance beats it. Pair it with KIN.b+2 as the mid.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Kincho and land KIN.f+2 for the Heat Engage.",
          },
          difficulty: "medium",
          tags: ["stance", "heat engager"],
          moveKeys: ["kin-f2"],
        },
        {
          id: "kin-plus",
          stageId: "stances",
          name: "Oyashiro Kuzushi",
          notation: "KIN.f+1+2",
          purpose:
            "+14c on block. Not a typo — blocking it hands you the turn completely, and it is +49a on counter-hit.",
          whenToUse:
            "When they are respecting Kincho and blocking. At i24~25 it is slow enough to be interrupted, so it needs them frozen first.",
          leverlessTip:
            "f plus both punches from inside the stance. The payoff for landing it on block is larger than most launchers give you on hit.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land KIN.f+1+2 on block and immediately press your fastest mid.",
          },
          difficulty: "hard",
          tags: ["stance", "plus on block"],
          moveKeys: ["kin-f1plus2", "kin-b2-1"],
        },
        {
          id: "dragonfly",
          stageId: "stances",
          name: "Manji Dragonfly",
          notation: "u+1+2",
          purpose:
            "The pressure stance. DGF.f+2 is +7 on block and +64a (+44) on counter-hit; DGF.4 is a Heat Engager at -4; DGF.3 is the low.",
          whenToUse:
            "When you have conditioned them to hold still. Everything in Dragonfly is a guess for them and a commitment for you.",
          leverlessTip:
            "u+1+2 leaves you airborne-looking and vulnerable to lows. Enter it after something plus, never from neutral.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Dragonfly from a plus situation and mix DGF.f+2 with DGF.3.",
          },
          difficulty: "hard",
          tags: ["stance", "pressure"],
          moveKeys: ["dgf-f2", "dgf-4", "dgf-3"],
        },
        {
          id: "meditation",
          stageId: "stances",
          name: "Meditation & the Cancel",
          notation: "3+4",
          purpose:
            "Keepout and recovery. MED.1+4 is the same i6~9 flash from a back-turned stance, and MED.3 is +2~+13 on block. Wavu rates MED Cancel importance 3 at dexterity 2 and rhythm 3 — the hardest-timed technique on the character.",
          whenToUse:
            "To make an approach uncomfortable, and to cancel out of the stance before they punish it.",
          leverlessTip:
            "The cancel is a rhythm, which is why Wavu scores it 3 for rhythm and only 2 for dexterity. Drill the timing with a metronome rather than by feel.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Enter Meditation and cancel before the recovery is punishable.",
          },
          difficulty: "expert",
          tags: ["stance", "keepout"],
          moveKeys: ["med-soul-stealer", "med-3", "med-heal"],
        },
        {
          id: "flea-indian",
          stageId: "stances",
          name: "Flea & Indian Stance",
          notation: "1SS.d+1+2 · d+3+4",
          purpose:
            "The two you use last. Flea ducks under highs and has a low that launches for +30a; Indian heals and has an unblockable. Both are extremely unsafe and mostly matchup knowledge.",
          whenToUse:
            "Once you know what the opponent does about them — which means after you have already lost to them a few times.",
          leverlessTip:
            "Flea is a crouching state, so highs whiff over it entirely. That is the whole reason to be there; the attacks are secondary.",
          drill: {
            type: "manual",
            checklist: [
              "Flea (1SS.d+1+2) ducks highs — that is its purpose, not FLE.2.",
              "FLE.2 is a low that launches for +30a and is -12~-8 on block.",
              "Indian (d+3+4) recovers health while you stand still.",
              "IND.1 is an unblockable at i53~55 — a wake-up tool, not a neutral one.",
              "Both are punished hard if the opponent simply presses a fast mid.",
            ],
          },
          difficulty: "expert",
          tags: ["stance", "matchup"],
          moveKeys: ["fle-2", "fle-1plus2", "ind-1", "ind-4"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 07 — LOWS & THE MIXUP PROBLEM                              */
    /* ---------------------------------------------------------------- */
    {
      id: "lows",
      number: 7,
      name: "Lows & the Mixup Problem",
      focus: "His honest weakness, and the three workarounds",
      description:
        "Wavu says it plainly: weak lows, none of which generate real pressure, with his best ones locked behind stance. That is the truth of the character and it does not get fixed — it gets worked around. The workarounds are a power low that launches, an unblockable low that launches, and a low from No Sword that is actually PLUS on block. Everything else is a poke you use sparingly.",
      items: [
        {
          id: "honest-lows",
          stageId: "lows",
          name: "The Honest Lows",
          notation: "d+4 · db+4",
          purpose:
            "d+4 is i12 at -15 on block; db+4 is i17 at -12. Neither is good. They exist so the opponent cannot stand and block mids forever.",
          whenToUse:
            "Sparingly, and mostly to make them think about ducking. Do not build a gameplan on these.",
          leverlessTip:
            "Both are single taps from a crouch direction. The discipline is throwing them rarely enough that they still work.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix d+4 into a poke sequence without becoming predictable.",
          },
          difficulty: "easy",
          tags: ["low", "poke"],
          moveKeys: ["d4", "db4"],
        },
        {
          id: "power-low",
          stageId: "lows",
          name: "Nebular Burst",
          notation: "db+1,2",
          purpose:
            "Wavu lists db+1,2 as one of his two power lows. The string is -13 on block and +0 on hit — the value is the damage and the knockdown, not the frames.",
          whenToUse:
            "As a read against someone standing still. The follow-up mid is what makes the low worth respecting.",
          leverlessTip:
            "db+1 then 2. The first hit alone is -11~-9; the string commits you, so decide before you press.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land db+1,2 as a read on a blocking opponent.",
          },
          difficulty: "medium",
          tags: ["low", "power low"],
          moveKeys: ["db1", "db1-2"],
        },
        {
          id: "samurai-cutter",
          stageId: "lows",
          name: "Samurai Cutter",
          notation: "FC.DF+1",
          purpose:
            "An UNBLOCKABLE low that launches for +70a (+54). Wavu calls this out as one of the reasons he has usable unblockables at all — the opponent cannot block it, they have to move.",
          whenToUse:
            "Wake-up situations and any moment they are frozen. At i26 it is slow enough to react to, so it needs them genuinely stuck.",
          leverlessTip:
            "Full crouch, then DF+1 held. It is a wake-up and okizeme tool — Wavu lists Strong Okizeme as one of his real strengths and this is the centrepiece.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land Samurai Cutter on a frozen opponent and convert.",
          },
          difficulty: "hard",
          tags: ["low", "unblockable", "launcher", "oki"],
          moveKeys: ["samurai-cutter"],
        },
        {
          id: "plus-low",
          stageId: "lows",
          name: "Ishiusu Tsubushi",
          notation: "NSS.u+1+2",
          purpose:
            "A low that is +5 ON BLOCK and +21g on hit. Blocking it correctly still leaves them losing the exchange, which nothing else in his kit does.",
          whenToUse:
            "From No Sword when you want a low that does not hand the turn back. At i27~29 it is slow, so it needs setting up.",
          leverlessTip:
            "u plus both punches inside NSS. The plus frames are the point — press a mid immediately after and make the block hurt.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land NSS.u+1+2 on block and enforce the plus with a mid.",
          },
          difficulty: "hard",
          tags: ["low", "plus on block", "stance"],
          moveKeys: ["nss-u1plus2"],
        },
        {
          id: "stance-lows",
          stageId: "lows",
          name: "Stance Lows",
          notation: "KIN.3 · DGF.3",
          purpose:
            "KIN.3 is +13a on hit and +25a on counter-hit; DGF.3 is +6c on hit and +28a on counter-hit. These are the lows that make his stances a real guess instead of a mid-only threat.",
          whenToUse:
            "Inside Kincho or Dragonfly, against someone who has learned to stand and block the mid.",
          leverlessTip:
            "Both are a single kick from inside the stance. The mixup only exists if you actually use both halves of it.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "From a stance, mix the low with the mid until they have to guess.",
          },
          difficulty: "hard",
          tags: ["low", "stance", "mixup"],
          moveKeys: ["kin-3", "dgf-3"],
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
      focus: "Being a defensive character in an offensive game",
      description:
        "Wavu describes him as an extremely unorthodox stance-based DEFENSIVE character, and lists Requires Knowledge as a weakness in its own right: a defensive character in a very offensive game, with a thirty-year-old movelist. This stage is the part that ties the rest together — the parries, Heat, and an honest account of what the gameplan actually is.",
      items: [
        {
          id: "spirit-shield",
          stageId: "gameplan",
          name: "Spirit Shield",
          notation: "1+2+3",
          purpose:
            "A mid at i22~40 that ranges from -8 to +10g on block depending on how long it is held, and +16~+34 on counter-hit.",
          whenToUse:
            "As a keepout tool and against a predictable approach. The wide frame range is the point — held differently it is a different move.",
          leverlessTip:
            "Three buttons at once. Practise the held and unheld versions separately; they behave differently enough to be two moves.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Use Spirit Shield to stop an approach.",
          },
          difficulty: "medium",
          tags: ["defense", "keepout"],
          moveKeys: ["spirit-shield"],
        },
        {
          id: "defensive-suite",
          stageId: "gameplan",
          name: "The Defensive Suite",
          notation: "1+2 · 1+4",
          purpose:
            "Wavu lists two parries: 1+2 handles all highs and mids except throws, unblockables and charge moves, and 1+4 beats strings with gaps. Between them, pressing buttons at Yoshimitsu is a risk.",
          whenToUse:
            "1+2 against a committed mid; 1+4 against a string you know has a gap in it. Both are reads, and both lose badly when wrong.",
          leverlessTip:
            "Neither is hard to input. The whole skill is knowing which strings have gaps, which is matchup homework rather than execution.",
          drill: {
            type: "manual",
            checklist: [
              "1+2 parries highs and mids — not throws, unblockables or charges.",
              "1+4 is i6~9 and interrupts gaps a jab is too slow for.",
              "Both are strong and both are very unsafe when the read is wrong.",
              "Wavu rates KIN Parry dexterity 0: the cost is knowledge, not execution.",
              "List three strings per matchup you can flash, and use nothing else.",
            ],
          },
          difficulty: "hard",
          tags: ["defense", "parry", "concept"],
          moveKeys: ["kin-1plus2", "soul-stealer"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat",
          notation: "2+3 · H.2+3",
          purpose:
            "Five Heat Engagers — 3,1 · f+1+2 · b+2,2 · KIN.f+2 · DGF.4. The Heat Smash is +4 on block and does 51 damage, and it also punishes -18.",
          whenToUse:
            "Engage with whichever of the five fits the situation you are already in; b+2,2 doubles as your -14 punish.",
          leverlessTip:
            "In Heat he can perform powered-up No Sword moves while still holding the sword, which is the mechanical reason Heat matters for him specifically.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Engage Heat with each of the five engagers once.",
          },
          difficulty: "medium",
          tags: ["heat", "heat engager"],
          moveKeys: ["heat-burst", "heat-smash", "three-1", "f1plus2", "dgf-4"],
        },
        {
          id: "rage-art",
          stageId: "gameplan",
          name: "Rage Art",
          notation: "R.df+1+2",
          purpose:
            "i20 armoured comeback tool. The same button every character has, and the same rules apply.",
          whenToUse:
            "In Rage, when a wrong guess loses you the round anyway. It is -18 on block.",
          leverlessTip:
            "Do not save it for a perfect moment that never comes. An unused Rage Art is zero damage.",
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
          id: "self-damage",
          stageId: "gameplan",
          name: "The Moves That Hurt You",
          notation: "d+1+4",
          purpose:
            "Harakiri does 60 damage to YOU. Wavu lists 'Can commit seppuku' as both a strength and a weakness, which is the correct assessment of it.",
          whenToUse:
            "Almost never on purpose. It is here so that you know it exists, know what it costs, and do not discover it by accident in a match.",
          leverlessTip:
            "The genuine risk on a leverless is a misinput — d+1+4 is one finger away from d+4 and from 1+4. Check your bindings.",
          drill: {
            type: "manual",
            checklist: [
              "Harakiri (d+1+4) deals 60 damage to Yoshimitsu.",
              "One staple combo route ends in f,F+1+4 and costs 60 self damage.",
              "Wavu lists self-damage as a strength AND a weakness — take that literally.",
              "Check that d+1+4 cannot happen by accident from your 1+4 binding.",
            ],
          },
          difficulty: "easy",
          tags: ["concept", "self damage"],
          moveKeys: ["harakiri", "thunder-blade"],
        },
        {
          id: "gameplan-core",
          stageId: "gameplan",
          name: "The Gameplan",
          notation: "—",
          purpose:
            "Pulling it together. He is a defensive character whose pressure mostly is not real, so the round is won by making the opponent afraid to press and then punishing what they press anyway.",
          whenToUse: "Every round.",
          leverlessTip:
            "None of this is an execution problem. Wavu's own summary is that he requires in-depth matchup knowledge, experience and situational awareness — the work is homework.",
          drill: {
            type: "manual",
            checklist: [
              "Your punish table starts at -6. Know which of their moves that catches.",
              "Most of your pressure is not real — it is conditioning plus a guess.",
              "Your lows are weak; use them to threaten, not to win.",
              "Stances are strong and unsafe: enter them from plus, never from neutral.",
              "Okizeme is a genuine strength — Samurai Cutter on a downed opponent.",
              "When in doubt, block and flash. That is the character.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "gameplan"],
          moveKeys: ["soul-stealer", "spirit-shield", "samurai-cutter"],
        },
      ],
    },
  ],

  punishQuiz: [
    {
      id: "yoshi-q-6",
      prompt: "-6",
      situation: "You blocked a move that leaves them at -6.",
      options: ["1+4", "1,1", "2,2", "df+2"],
      correctIndex: 0,
      explain:
        "Soul Stealer is i6~9 and mid — the only punish in the game that reaches at -6. Everything else here is i10 or slower and simply does not come out in time.",
    },
    {
      id: "yoshi-q-8",
      prompt: "-8 (No Sword)",
      situation: "You are in No Sword Stance and blocked a -8 move.",
      options: ["NSS.1+4", "1,1", "df+1,4", "ws4"],
      correctIndex: 0,
      explain:
        "NSS.1+4 is i8~11 and the table lists it as +14 +64a — it launches. At -8 nothing else reaches at all.",
    },
    {
      id: "yoshi-q-10",
      prompt: "-10",
      situation: "You blocked a move that leaves them at -10.",
      options: ["1,1", "2,2", "df+1,4", "df+2"],
      correctIndex: 0,
      explain:
        "1,1 is the i10 string. 2,2 is i11 and misses by a frame; the rest are slower still.",
    },
    {
      id: "yoshi-q-11",
      prompt: "-11",
      situation: "You blocked a move that leaves them at -11.",
      options: ["2,2", "1,1", "b+2,2", "f,n,d,df+1"],
      correctIndex: 0,
      explain:
        "2,2 is i11 for more damage than the jab string, and it is only -1 on block. 1,1 also reaches but gives up damage for nothing.",
    },
    {
      id: "yoshi-q-13",
      prompt: "-13",
      situation: "You blocked a move that leaves them at -13.",
      options: ["df+1,4", "df+2", "2,2", "1+4"],
      correctIndex: 0,
      explain:
        "df+1,4 is the i13 punish. df+2 is i15~16 and does not reach yet — take the guaranteed damage rather than the launch you cannot have.",
    },
    {
      id: "yoshi-q-14",
      prompt: "-14",
      situation: "You blocked a move at -14 and Heat is close.",
      options: ["b+2,2", "df+2", "1,1", "ws4"],
      correctIndex: 0,
      explain:
        "b+2,2 is a Heat Engager and is only -9 on block. df+2 needs -15, so at exactly -14 this is both the correct punish and the better one.",
    },
    {
      id: "yoshi-q-15",
      prompt: "-15",
      situation: "You blocked a move that leaves them at -15.",
      options: ["df+2", "b+2,2", "df+1,4", "2,2"],
      correctIndex: 0,
      explain:
        "df+2 launches for +34a (+24) and is only -7 on block if you misread. This is where punishment turns into a full combo.",
    },
    {
      id: "yoshi-q-17",
      prompt: "-17",
      situation: "You blocked a move that leaves them at -17.",
      options: ["f,n,d,df+1", "df+2", "b+2,2", "1+4"],
      correctIndex: 0,
      explain:
        "Gehosen is i17~18 for +35a (+25a) — the biggest launch on the ladder. df+2 still works, but you are leaving damage on the table.",
    },
    {
      id: "yoshi-q-crouch-11",
      prompt: "-11 (crouching)",
      situation: "You blocked a low that leaves them at -11.",
      options: ["ws4", "ws1,2", "1,1", "df+2"],
      correctIndex: 0,
      explain:
        "ws4 is i11~12 out of crouch. ws1,2 is i13 and does not reach; standing punishes are not available from a crouch block.",
    },
    {
      id: "yoshi-q-crouch-13",
      prompt: "-13 (crouching)",
      situation: "You blocked a low that leaves them at -13.",
      options: ["ws1,2", "ws4", "df+1,4", "2,2"],
      correctIndex: 0,
      explain:
        "ws1,2 is i13 for +14g. ws4 reaches too but gives up the damage — at -13 you have time for the bigger one.",
    },
  ],
};

