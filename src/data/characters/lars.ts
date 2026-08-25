import type { Character } from "@/types";

/**
 * Lars Alexandersson — Tekken 8 (Season 3) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki (wavu.wiki/t/Lars_movelist,
 * _punishers, _combos) and TekkenDocs as of August 2026. Facts baked in:
 *  - df+1 is i13 / -3 / +5 — a genuinely fast, safe, rewarding mid
 *  - uf+4 is i25: a low-crush read and whiff punisher, NOT a fast punisher
 *  - his fastest launchers live in stance: SEN.1 and DEN.1+2 are both i12
 *  - stance chain is DEN (Dynamic Entry) -> SEN (Silent Entry) -> LEN
 *  - DEN.1 is +1 on block, DEN.3 is +5, SEN.4 is +4, f,f,F+3 is +6
 *  - heat engagers: 1,1,1 / 3+4 / DEN.1,2 / DEN.3 / SEN.1
 *  - power crush is only 1+2, SEN.1+2, Heat Burst and Rage Art
 *  - punish ladder: -10 2,1 | -12 f+2,1 | -13 f+1,2 | -14 f,n,b+2,1 | -15 f+1+2
 */

export const lars: Character = {
  id: "lars",
  name: "Lars",
  style: "Freestyle Karate & Special Forces CQC",
  tagline:
    "Fast, safe, and relentlessly aggressive — the rare character whose strongest buttons are also his simplest.",
  available: true,
  accent: { base: "#22d3ee", bright: "#a5f3fc", deep: "#0e7490" },
  electric: true,
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT                                          */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement",
      focus: "Get into your range",
      description:
        "Lars wins by being in your face with safe buttons. That only works if you can close distance without paying for the trip — and if you can get back out when it stops being your turn.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance and lets you block immediately after. Dash-blocking is how you get into Lars range without eating a launcher on the way in.",
          whenToUse:
            "Any time you are out of range and the opponent is not actively swinging. Dash in, block, observe — then start your offense from a position where df+1 and df+2 actually reach.",
          leverlessTip:
            "Tap f twice with a clean full release between taps. If the first f is still held, the second tap will not read as a dash — on leverless the release IS the neutral.",
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
            "Creates space and makes attacks whiff in front of you. A whiffed move is the cleanest launch you will ever get, and Lars has three different ways to collect it.",
          whenToUse:
            "After blocking a string that leaves them close, or in neutral when you expect a swing. Backdash out of range, then punish the whiff with 2,1 or f+1+4.",
          leverlessTip:
            "Same rule as the forward dash: full release between the two b presses. Practice the rhythm b, release, b until the dash is automatic.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash out of the CPU jab range so the jab whiffs cleanly in front of you.",
          },
          difficulty: "easy",
          tags: ["fundamental"],
        },
        {
          id: "kbd",
          stageId: "movement",
          name: "Korean Backdash",
          notation: "b,b~db, b,b~db, ...",
          purpose:
            "Chained backdash cancels — the fastest way to move backward in Tekken. Lars does not need it to run his offense, but it is what lets you re-enter on your own terms when the offense stalls.",
          whenToUse:
            "Escaping pressure, resetting range, or baiting a whiff at max distance. This is the skill that stops you from being a one-way character.",
          leverlessTip:
            "The loop is b, b then tap d while still holding b (that gives db and cancels the dash), release, repeat. Anchor the b finger and drum the d taps. Rhythm first, speed later.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "One full-screen retreat (round start to the wall) using only chained backdash cancels, no gaps.",
          },
          difficulty: "hard",
          tags: ["execution", "defense"],
        },
        {
          id: "sidestep-movement",
          stageId: "movement",
          name: "Sidestep & Sidewalk",
          notation: "u~n / d~n",
          purpose:
            "Tekken is 3D. Stepping a linear move beats blocking it, because the whiff you create is damage you collect. Lars also owns strong homing tools, so he sees both sides of this trade.",
          whenToUse:
            "After your minus frames, to make their turn whiff. Learn which way to step per matchup — most characters are weaker to one side.",
          leverlessTip:
            "A step is a single crisp tap of u or d back to neutral, then immediately hold b to block. Drill tap-then-block until the block is part of the step.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Sidestep a linear CPU attack into block, then punish the whiff with 2,1.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
        },
        {
          id: "dynamic-entry-movement",
          stageId: "movement",
          name: "Dynamic Entry as Movement",
          notation: "f+3",
          purpose:
            "f+3 puts Lars into Dynamic Entry (DEN) — a forward-moving stance. Before it is a mixup, it is an approach: it covers ground and makes the opponent respect what comes next.",
          whenToUse:
            "As a way to close distance that is not just walking forward. You do not have to attack out of it — entering DEN and simply blocking is a legitimate option, and it teaches the opponent to freeze.",
          leverlessTip:
            "Hold f briefly and press 3 — a tap can drop the f and give you a naked 3, which is -17. Also practice EXITING the stance straight to guard; being able to cancel is what makes entering safe.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter DEN with f+3 from mid range and immediately block — no attack — without getting hit.",
          },
          difficulty: "easy",
          tags: ["stance", "approach"],
          moveKeys: ["den1"],
        },
        {
          id: "den-cancel",
          stageId: "movement",
          name: "Dynamic Entry Cancel",
          notation: "f+3~d (sidestep cancel), repeat",
          purpose:
            "Lars answer to the wavedash. Entering DEN and cancelling it into a sidestep — over and over — closes distance faster than running, while staying sideways-mobile. This is his highest-skill movement.",
          whenToUse:
            "Advanced approach, and a real answer to his linearity problem. Treat it as a long-term project: the payoff is large, but a misinput here is genuinely expensive, which is why it comes after the basics.",
          leverlessTip:
            "Learn the DOWN cancel first, not the up cancel. A missed down-cancel gives you df+3 at -7 or d+3 at -3 — survivable. A missed UP cancel gives you uf+3, which is -26 and a free launch for the opponent, and up is a thumb button with no gate resistance on leverless. Also note only the manual f+3 can be cancelled — moves that auto-transition into DEN cannot.",
          drill: {
            type: "consecutive-reps",
            target: 3,
            rep: "Three connected DEN-to-sidestep cancels closing distance, with zero uf+3 misinputs (one rep = one 3-cancel chain).",
          },
          difficulty: "expert",
          tags: ["execution", "advanced", "approach"],
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
      focus: "The buttons that carry him",
      description:
        "This is why Lars gets recommended to new players. His fundamental buttons are fast, safe, and rewarding at the same time — you do not have to earn them with execution. Learn what each one is actually for.",
      items: [
        {
          id: "jab",
          stageId: "pokes",
          name: "Jab & 1,2",
          notation: "1 / 1,2",
          purpose:
            "Your fastest button at i10, and it is plus on block. 1,2 jails, so once the first jab is blocked the second is guaranteed — they cannot duck out between the hits.",
          whenToUse:
            "Interrupt strings with gaps, stop dash-ins, and reassert your turn up close. When you are not sure what to press at close range, jab is almost never wrong.",
          leverlessTip:
            "Nothing exotic — but practice confirming the first jab before adding the second rather than mashing. The string has a 4-frame delay window precisely so you can watch the first hit.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Interrupt a CPU set to attack after block with a jab, then finish 1,2 only when the jab connects.",
          },
          difficulty: "easy",
          tags: ["high", "fast", "plus on block"],
          moveKeys: ["jab", "jab-12"],
        },
        {
          id: "df1",
          stageId: "pokes",
          name: "df+1",
          notation: "df+1",
          purpose:
            "The button that defines Lars: a 13-frame mid that is only -3 on block and +5 on hit. Fast, safe, and it leaves you in control. Most of the cast pays somewhere for a button this good — Lars does not.",
          whenToUse:
            "Constantly. It checks opponents who duck, it beats slow buttons, and at -3 they cannot punish it. This is your default poke and your default answer to I do not know what to press here.",
          leverlessTip:
            "df on leverless is d and f pressed together. Press both with 1 in one motion. If you get d+1 instead, your f is landing late — lead with the direction fingers.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land df+1 on a crouching CPU, then continue pressing with another df+1 to feel what +5 buys you.",
          },
          difficulty: "easy",
          tags: ["mid", "safe", "your money button"],
          moveKeys: ["df1"],
        },
        {
          id: "df2",
          stageId: "pokes",
          name: "df+2",
          notation: "df+2",
          purpose:
            "A 14-frame mid that is -3 on block and +9 on hit, and it flows straight into Silent Entry. This is your damage poke and your gateway into the stance game.",
          whenToUse:
            "When you want more reward than df+1 gives. At +9 on hit you are firmly in control; on counter-hit it converts. Later the SEN transition turns a poke into a mixup — that is Stage 6.",
          leverlessTip:
            "Same df chord as df+1. Learn now that a quick F tap right after the move sends you into SEN. You do not have to use it yet, but grooving that separate f tap early pays off later.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land df+2 and follow the +9 advantage with another mid before the CPU can act.",
          },
          difficulty: "easy",
          tags: ["mid", "safe", "into SEN"],
          moveKeys: ["df2"],
        },
        {
          id: "b1",
          stageId: "pokes",
          name: "b+1",
          notation: "b+1",
          purpose:
            "A homing mid that catches sidesteps and balcony-breaks on counter-hit. Only -9 on block, so throwing it is a cheap bet with real upside.",
          whenToUse:
            "The moment an opponent starts stepping your pokes. Lars is a linear character and is weakest to his right side — b+1 homes, and uf+1 (added in Season 3) specifically tracks that weak side. One or two of these and they stop moving sideways.",
          leverlessTip:
            "Press b and 1 together cleanly. Coming out of a backdash, wait for the dash to finish or you will get a second backdash instead of the attack.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Catch a sidestepping CPU with b+1, and counter-hit a pressing CPU with it at least twice.",
          },
          difficulty: "easy",
          tags: ["mid", "homing", "CH tool"],
          moveKeys: ["b1", "uf1"],
        },
        {
          id: "f4",
          stageId: "pokes",
          name: "f+4",
          notation: "f+4",
          purpose:
            "A longer-range mid knee that is +7 on hit. It reaches where df+1 does not, letting you poke from just outside their comfortable range.",
          whenToUse:
            "At the edge of poking range when you want to touch them without committing to an approach. It is -9 on block, so treat it as a spacing tool rather than a close-range mash button.",
          leverlessTip:
            "Hold f briefly rather than tapping it with 4 — a tap can drop the f and give you a naked 4.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land f+4 at max range, where a df+1 would have whiffed.",
          },
          difficulty: "easy",
          tags: ["mid", "range"],
          moveKeys: ["f4"],
        },
        {
          id: "lows",
          stageId: "pokes",
          name: "Low Pokes",
          notation: "d+3 / db+1",
          purpose:
            "Small, fast lows that force the opponent to stop blocking high. They do almost no damage — their entire job is to make your mids land.",
          whenToUse:
            "As chip and conditioning against opponents standing still. Both are minus even on hit, so poke and reset; do not press again expecting to keep your turn.",
          leverlessTip:
            "Simple inputs — the discipline is returning to guard immediately. On leverless it is tempting to stay on d; release to neutral or hold b so you are blocking during recovery.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land a low poke, then immediately block the CPU counterattack — the poke AND the reset.",
          },
          difficulty: "easy",
          tags: ["low", "conditioning"],
          moveKeys: ["d3", "db1"],
        },
        {
          id: "d2",
          stageId: "pokes",
          name: "d+2",
          notation: "d+2",
          purpose:
            "A crouching mid that is completely neutral on block, +8 on hit, and converts on counter-hit. Neutral on block means your turn simply does not end.",
          whenToUse:
            "When you want to keep your turn without risk, and as a counter-hit fishing tool against opponents who press after your pokes. It also flows into full crouch, which arms your while-standing game.",
          leverlessTip:
            "Hold d and press 2. Practice the d+2 into full crouch route (hold D after) so you can threaten ws+1 and ws+4 straight out of the recovery.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land d+2 on block and keep your turn with a follow-up mid; counter-hit a pressing CPU with it twice.",
          },
          difficulty: "medium",
          tags: ["mid", "neutral on block", "CH tool"],
          moveKeys: ["d2"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — LAUNCHERS & COUNTERHITS                            */
    /* ------------------------------------------------------------ */
    {
      id: "launchers",
      number: 3,
      name: "Launchers & Counterhits",
      focus: "Turning a read into 50 damage",
      description:
        "Lars launches without just-frame execution — but his launchers are situational rather than fast. Knowing which one belongs in which situation matters more here than raw execution.",
      items: [
        {
          id: "uf4",
          stageId: "launchers",
          name: "Storm Axle",
          notation: "uf+4",
          purpose:
            "Your uf+4 launcher, and it goes airborne early — it jumps clean over lows. Read the honest part too: at i25 it is slow, so it is a read and a whiff punisher, NOT a punish for blocked moves.",
          whenToUse:
            "Against opponents leaning on lows, since the jump frames crush them and you get a full combo. Also as a whiff punisher when they miss something slow. It is only -8 on block, which is unusually cheap for a launcher.",
          leverlessTip:
            "uf on leverless is u and f together — press both with 4 as one chord. Practice it from a crouching state as well; the evasion is even better from crouch or LEN.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Crush a CPU set to use lows with uf+4 and convert into a juggle.",
          },
          difficulty: "easy",
          tags: ["launcher", "low crush", "read"],
          moveKeys: ["uf4"],
        },
        {
          id: "ff2",
          stageId: "launchers",
          name: "Surge Blast",
          notation: "f,F+2",
          purpose:
            "A long-range launcher with a built-in Tornado that flows into Silent Entry on hit. This is how Lars punishes people for standing still at mid range.",
          whenToUse:
            "From range when the opponent dashes in carelessly or whiffs something slow. It is -13 on block, so it is a committed read — but it threatens from a distance most characters cannot cover.",
          leverlessTip:
            "Hold the second f while pressing 2 — the running-style input wants f held, not tapped. Out of a forward dash, just add 2 while f is still down.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Launch an approaching or whiffing CPU with f,F+2 from range and convert.",
          },
          difficulty: "medium",
          tags: ["launcher", "tornado", "range"],
          moveKeys: ["ff2"],
        },
        {
          id: "ws1",
          stageId: "launchers",
          name: "Streamer",
          notation: "ws+1",
          purpose:
            "Your while-standing launcher with a Tornado built in. This is the reward for blocking a low — and the reason opponents cannot throw lows at you for free.",
          whenToUse:
            "After blocking a low that is -15 or worse, and out of any crouching state. On hit you can flow into Silent Entry and keep the pressure going.",
          leverlessTip:
            "The while-standing state comes from releasing d — so the input is hold d (block the low), release, then 1 during the rise. Practice from down-back, because that is where your hands actually are.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Block a low (CPU set to sweep) and launch with ws+1, then convert.",
          },
          difficulty: "medium",
          tags: ["launcher", "tornado", "while standing"],
          moveKeys: ["ws1"],
        },
        {
          id: "blue-bolt",
          stageId: "launchers",
          name: "Blue Bolt",
          notation: "f,n,b+2,1",
          purpose:
            "A 14-frame launcher — fast enough to punish things most characters can only poke. The motion is the price: forward, neutral, back, then 2 and 1.",
          whenToUse:
            "As your -14 launch punish (Stage 4 drills it properly) and as a whiff punisher when you have time for the motion. At -18 blocked it is a punish tool, never a neutral gamble.",
          leverlessTip:
            "The motion is f, full release to neutral, then b+2 — the release matters, because holding f into b just resolves to one direction on leverless. Buffer the f, n during blockstun so only b+2,1 remains.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Land the full f,n,b+2,1 from a standstill, cleanly, with no dropped inputs.",
          },
          difficulty: "hard",
          tags: ["launcher", "punish", "execution"],
          moveKeys: ["fnb21"],
        },
        {
          id: "ch-tools",
          stageId: "launchers",
          name: "Counter-hit Tools",
          notation: "b+2,1 / f,F+1+2",
          purpose:
            "Be honest about this part of the kit: Lars is a poor counter-hit fisher — his CH launchers are no faster than his normal ones. These three are the exceptions worth knowing, not a fishing game.",
          whenToUse:
            "Against opponents who press after your pokes. The delay on b+2,1 is the actual tool: block-confirm the first hit, and if they try to interrupt, the second counter-hits and launches. FC.df+2 is the crouching version and the biggest payoff of the three.",
          leverlessTip:
            "b+2,1 can be delayed up to 10 frames — practice deliberately WAITING before the 1 rather than dialing the string. The waiting is the whole point.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Counter-hit a pressing CPU with a delayed b+2,1 and convert the launch.",
          },
          difficulty: "medium",
          tags: ["counter-hit", "delayable"],
          moveKeys: ["b2-1", "ffplus1plus2", "fcdf2"],
        },
        {
          id: "running-moves",
          stageId: "launchers",
          name: "Flash Blade & Red Sprite",
          notation: "f,f,F+1 / f,f,F+3",
          purpose:
            "Two running moves that are PLUS on block — +4 and +6 — with Flash Blade also launching on hit. Being plus after closing the whole screen is a genuinely unfair-feeling reward.",
          whenToUse:
            "To cover long distance and immediately start pressure instead of paying for the approach. Flash Blade is a high so it can be ducked; Red Sprite is a mid, making it the safer thing to run in with.",
          leverlessTip:
            "Running inputs need f held on the third press: f, f, then hold F and press the button. On leverless, keep the f finger down through the run rather than re-tapping it.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Run in from full screen with f,f,F+3 and keep pressing with a mid after it is blocked — you are +6.",
          },
          difficulty: "medium",
          tags: ["plus on block", "approach"],
          moveKeys: ["fff1", "fff3"],
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
      focus: "Free damage, on schedule",
      description:
        "Punishment is the most reliable damage in Tekken — the opponent hands it to you. Lars has a clean ladder with a full launch at only -14. Learn one response per frame range until it is reflex.",
      items: [
        {
          id: "punish-10f",
          stageId: "punishment",
          name: "10f Punish",
          notation: "2,1",
          purpose:
            "Your answer to anything -10 or -11. It is also one of your best whiff punishers, so this single string does double duty and is worth making automatic first.",
          whenToUse:
            "Blocked string enders and common pokes, plus any whiff at close range. When unsure how minus something is, 2,1 always comes out in time — and it recovers into Limited Entry, so your punish ends with a mixup already loaded.",
          leverlessTip:
            "Buffer the string during blockstun — drum 2,1 the instant you feel the block. Punishing late is the same as not punishing.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "Punish a blocked -10 move with the full 2,1 (use practice-mode punishment training).",
          },
          difficulty: "easy",
          tags: ["punish", "whiff punish"],
          moveKeys: ["ring-current"],
        },
        {
          id: "punish-12f",
          stageId: "punishment",
          name: "12f Punish",
          notation: "f+2,1 / f+2,4",
          purpose:
            "At -12 you upgrade from 2,1. f+2,1 is the safe standard and even flows into Silent Entry; f+2,4 trades a little safety for noticeably more damage.",
          whenToUse:
            "Blocked moves in the -12 to -13 range. Taking the better string instead of the lazy one looks like a small gain — across a set it decides rounds.",
          leverlessTip:
            "Buffer f during blockstun so only the buttons remain to time. Hold f rather than tapping so you never get a naked 2.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "Punish a blocked -12 move with f+2,1 or f+2,4 instead of defaulting to 2,1.",
          },
          difficulty: "medium",
          tags: ["punish", "into SEN"],
          moveKeys: ["f2-1", "f2-4"],
        },
        {
          id: "punish-13f",
          stageId: "punishment",
          name: "13f Punish",
          notation: "f+1,2 / f+1+4",
          purpose:
            "f+1,2 is the safe 13-frame punish and flows into SEN. f+1+4 is the greedy one — it LAUNCHES at 13 frames, but it is -18 if you were wrong about the situation.",
          whenToUse:
            "f+1,2 when you are punishing something you are not fully sure about. f+1+4 when you know the move is at least -13, or as a whiff punisher where the risk does not exist at all.",
          leverlessTip:
            "f+1+4 is a three-input chord — press f with 1 and 4 together. Practice it as one deliberate press so it never comes out as a lone f+1.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Punish a blocked -13 move with f+1,2, then launch a whiff with f+1+4 and convert.",
          },
          difficulty: "medium",
          tags: ["punish", "launcher"],
          moveKeys: ["f1-2", "f1plus4"],
        },
        {
          id: "punish-launch",
          stageId: "punishment",
          name: "Launch Punishment",
          notation: "f,n,b+2,1 (-14) / f+1+2 (-15)",
          purpose:
            "At -14 Blue Bolt gives you a full combo. At -15 Ark Blast does the same with a far easier input. This is where blocking correctly turns into half a health bar.",
          whenToUse:
            "Blocked launchers, blocked big lows, blocked heavy strings. Take f+1+2 when execution matters more than a few points of damage — a landed easy punish beats a dropped hard one.",
          leverlessTip:
            "Buffer f, n during blockstun for Blue Bolt so only b+2,1 remains as blockstun ends. If your hands are shaky mid-match, f+1+2 is one chord and still a full combo.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Launch punish a blocked -14 move with f,n,b+2,1 (or -15 with f+1+2) and convert to a full combo.",
          },
          difficulty: "hard",
          tags: ["punish", "launcher"],
          moveKeys: ["fnb21", "f1plus2"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouch Punishment",
          notation: "ws+4 / ws+2,1 / ws+1",
          purpose:
            "The lows that hit you are minus too. ws+4 punishes small minuses at 11 frames, ws+2,1 covers -13, and ws+1 launches at -15.",
          whenToUse:
            "After blocking a low, every time. Answering a blocked sweep with a jab is the most commonly donated damage in Tekken — pick the right tier and take what you are owed.",
          leverlessTip:
            "You are already holding d to block the low. Release d and press the button during the rise. Practice from down-back, since that is your real blocking position.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Block a low and punish by tier: ws+4 for small minus, ws+2,1 for -13, ws+1 launch for -15 or worse.",
          },
          difficulty: "medium",
          tags: ["while standing", "punish"],
          moveKeys: ["ws4", "ws2-1", "ws1"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — CORE COMBOS                                       */
    /* ------------------------------------------------------------ */
    {
      id: "combos",
      number: 5,
      name: "Core Combos",
      focus: "One route, every launcher",
      description:
        "Lars gets a gift here: the same juggle works from almost all of his launchers. Learn it once and every launch converts the same way — practicality first, optimization later.",
      items: [
        {
          id: "combo-mini",
          stageId: "combos",
          name: "First Conversions",
          notation: "CH df+2 → SEN.1",
          purpose:
            "The smallest real conversions in the kit. Before learning a long juggle, learn to never waste a counter-hit: CH df+2 into SEN.1 is two inputs for meaningful damage.",
          whenToUse:
            "Every counter-hit df+2. Learn 1+2 into db+4 and CH d+2 into d+1+2 alongside it — short, forgiving routes that stop small hits from being wasted.",
          leverlessTip:
            "CH df+2 into SEN.1 means: df+2, tap F to enter Silent Entry, then 1. Groove the F tap as part of the same motion rather than as a separate decision.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Counter-hit df+2 and convert into SEN.1 without dropping the stance transition.",
          },
          difficulty: "easy",
          tags: ["EASY", "conversion"],
          moveKeys: ["df2", "sen1"],
        },
        {
          id: "combo-bnb",
          stageId: "combos",
          name: "Universal BnB",
          notation: "df+3~d DEN.2 2 f,F+4,2 DEN.1 b+3~f SEN.1+2 T! f+2,1 SEN.1",
          purpose:
            "Around 58 damage, and it works from f+1+2, uf+4, and f,n,b+2,1 — his main launchers. One route for every launch means zero decision time when the launch actually happens.",
          whenToUse:
            "Every standard launch. Build it in chunks: land the df+3~d DEN.2 opener first, then the middle, then the Tornado ender. Do not try to learn all of it in one sitting.",
          leverlessTip:
            "The ~d and ~f are quick direction taps immediately after the attack button, not held directions. The hardest link is b+3~f into SEN.1+2 — press b+3, tap f, then the 1+2 chord as one flowing motion.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full BnB off a uf+4 launch without dropping, including the Tornado ender.",
          },
          difficulty: "hard",
          tags: ["CORE", "~58 dmg"],
          moveKeys: ["uf4", "den2", "sen1plus2", "sen1"],
        },
        {
          id: "combo-tornado-starters",
          stageId: "combos",
          name: "Tornado Launchers",
          notation: "uf+3 ws2~f SEN.1+2 T! f,f+4,2 DEN.1 b+3~f SEN.1",
          purpose:
            "f,F+2 and ws+1 carry their own Tornado, so they need a different route — around 51 damage. Knowing which starters are already Tornado is what stops you from wasting it mid-combo.",
          whenToUse:
            "After a f,F+2 or ws+1 launch. The rule to internalize: Tornado is spent once per combo, so a Tornado starter changes what your ender can be.",
          leverlessTip:
            "ws2~f means ws+2 then a tap of f for the Silent Entry transition. Coming out of a launch your hands are already moving forward — let the f tap ride that momentum.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Convert a f,F+2 or ws+1 launch with the Tornado-starter route, no drops.",
          },
          difficulty: "hard",
          tags: ["OPTIMIZED", "tornado", "~51 dmg"],
          moveKeys: ["ff2", "ws1", "uf3"],
        },
        {
          id: "combo-wall",
          stageId: "combos",
          name: "Wall Combo",
          notation: "df+1 db+2,1 f+1+4",
          purpose:
            "When a juggle splats them on the wall, this is free bonus damage. df+1 into db+2,1 into f+1+4 is the practical standard; f,f,F+2+4 into f+1+4 is the simpler fallback.",
          whenToUse:
            "After any wall splat. If you are unsure of the splat height, take the simpler ender rather than whiffing out of greed — a landed 22 beats a dropped 26.",
          leverlessTip:
            "Wall combos are timing, not motion: wait for the splat animation to settle before df+1. Early inputs whiff under them. Watch the character, not your hands.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Carry a combo to the wall and land a clean wall ender.",
          },
          difficulty: "medium",
          tags: ["WALL"],
          moveKeys: ["df1", "db2-3", "f1plus4"],
        },
        {
          id: "combo-heat",
          stageId: "combos",
          name: "Heat & Heat Dash",
          notation: "SEN.1 / DEN.3 → Heat Dash",
          purpose:
            "Lars has five heat engagers — 1,1,1, 3+4, DEN.1,2, DEN.3 and SEN.1 — so entering heat is never awkward. Each heat-dashes to +5, but only 3+4 still carries into a full air combo; the rest leave the opponent grounded for oki.",
          whenToUse:
            "Spend heat fast. Season 3 removed heat-timer recovery from all three stances, so you cannot stance-dance to prolong it — heat is a finite burst window. His heat smash is +12 on block into DEN, which is the single strongest stance entry in the kit.",
          leverlessTip:
            "Heat dash is the engager followed by F. Rehearse engage, dash, continue pressure as one memorized sequence so the kill round is muscle memory rather than improvisation.",
          drill: {
            type: "consecutive-reps",
            target: 3,
            rep: "Land a heat engager, heat dash it, and continue pressure into a mid — the full sequence, no drops.",
          },
          difficulty: "medium",
          tags: ["HEAT", "kill route"],
          moveKeys: ["sen1", "den3", "heat-smash", "heat-burst"],
          verifyInGame:
            "Heat routes shift between patches more than any other part of the kit. Season 3 removed aerial combos from DEN.1,2 and SEN.1 heat dashes — confirm what your current patch allows before committing to a route.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 06 — THE STANCE GAME                                   */
    /* ------------------------------------------------------------ */
    {
      id: "stances",
      number: 6,
      name: "The Stance Game",
      focus: "DEN → SEN → LEN",
      description:
        "This is what separates a good Lars from a button-pressing one. Three linked stances, each with its own threats, all reachable from moves you already throw. Learn them as a chain, not as a list.",
      items: [
        {
          id: "den-basics",
          stageId: "stances",
          name: "Dynamic Entry",
          notation: "f+3 → DEN",
          purpose:
            "DEN is the hub of Lars offense. You enter it with f+3, and its follow-ups can be delayed by up to 19 frames — so the opponent cannot simply react to the entry.",
          whenToUse:
            "After a plus-frame situation, or as an approach. The delay window is the real weapon: entering DEN and waiting is itself a threat, because they have to guess when the attack lands.",
          leverlessTip:
            "Hold f and press 3. Then practice doing NOTHING — hold the stance and block. Being able to enter and cancel to guard is what makes the stance safe to use at all.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Enter DEN and vary your timing: 5 immediate follow-ups and 5 maximally delayed ones.",
          },
          difficulty: "medium",
          tags: ["stance", "hub"],
          moveKeys: ["den1", "den2"],
        },
        {
          id: "den-mids",
          stageId: "stances",
          name: "DEN Mids",
          notation: "DEN.1 / DEN.3",
          purpose:
            "DEN.1 is an 11-frame high that is PLUS on block. DEN.3 is a homing, heat-engaging mid that is +5 on block. Both leave you attacking again — this is how Lars keeps his turn forever.",
          whenToUse:
            "DEN.1 to check anyone trying to interrupt the stance. DEN.3 when they start stepping, since it homes, and whenever you want heat. Blocked DEN.3 at +5 means your next mid beats what they try.",
          leverlessTip:
            "Stance moves are plain button presses once you are in DEN — no directions needed. That is the appeal: the hard part was entering, the payoff is simple inputs.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "From DEN, land DEN.3 on block and immediately follow with a mid before the CPU can act.",
          },
          difficulty: "medium",
          tags: ["plus on block", "heat engager", "homing"],
          moveKeys: ["den1", "den3", "den1-2"],
        },
        {
          id: "den-lows",
          stageId: "stances",
          name: "DEN Lows",
          notation: "DEN.4 / DEN.3+4",
          purpose:
            "The low half of the DEN mixup. Neither is scary alone — their value is that they exist, which is what forces the opponent to duck and lets your mids print.",
          whenToUse:
            "Only after the mids have earned respect. If you have not landed DEN.1 and DEN.3 a few times, the low is not mixing anyone — it is a coin you are flipping against yourself.",
          leverlessTip:
            "Plain buttons from stance again. The skill here is not execution, it is restraint — resisting the urge to always take the low because it feels good.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "In a set of 10 DEN entries, use the low exactly 3 times and mids 7 times — deliberately, not randomly.",
          },
          difficulty: "medium",
          tags: ["low", "mixup"],
          moveKeys: ["den4", "den34"],
        },
        {
          id: "sen-entry",
          stageId: "stances",
          name: "Reaching Silent Entry",
          notation: "df+2 / f+1,2 / f+2,1 / DEN.1~F",
          purpose:
            "SEN is the dangerous stance, and the point is that you reach it from moves you already throw. df+2 flows into it. So do f+1,2 and f+2,1 — your own punishes. DEN.1, ws+1 and f,F+2 all lead there too.",
          whenToUse:
            "Any time a poke or a punish connects and you want to escalate. The lesson: your pokes are not just pokes, they are stance entries — which is why Lars pressure snowballs.",
          leverlessTip:
            "Where a transition needs it, the ~F is a quick tap of forward right after the attack button — not a held direction, and not a dash. Drill df+2 then F until it happens without thinking.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "One clean df+2 into Silent Entry (visibly enter the stance, no dropped transition).",
          },
          difficulty: "medium",
          tags: ["stance", "transition"],
          moveKeys: ["df2", "f1-2", "f2-1", "den1"],
        },
        {
          id: "sen-threats",
          stageId: "stances",
          name: "SEN Threats",
          notation: "SEN.1 / SEN.4 / SEN.3",
          purpose:
            "SEN.1 is a 12-frame mid that LAUNCHES and engages heat — his fastest launcher by a distance. SEN.4 is a homing high that is +4 on block and also launches. SEN.3 launches and jumps over lows.",
          whenToUse:
            "SEN.1 as the default — fast, launches, builds heat. SEN.4 when they step. SEN.3 when you read a low. If you want a true power crush from stance, that is SEN.1+2, which absorbs a hit and Tornados.",
          leverlessTip:
            "Plain buttons again. Since SEN.1 is your best button and only i12, treat SEN as a state where you can simply react and press 1 — the stance already did the hard work.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "From SEN, land SEN.1 as a launcher and convert; use SEN.1+2 to power-crush through a pressing CPU at least twice.",
          },
          difficulty: "medium",
          tags: ["launcher", "heat engager", "power crush"],
          moveKeys: ["sen1", "sen4", "sen3", "sen1plus2", "sen2"],
        },
        {
          id: "len",
          stageId: "stances",
          name: "Limited Entry",
          notation: "SEN.D → LEN",
          purpose:
            "The cleanest 50/50 in the game: LEN.1 is a low and LEN.2 is a mid, and BOTH are i16~17 from the same stance. Identical speed, opposite blocks, zero execution required — the opponent is simply guessing.",
          whenToUse:
            "Whenever you reach LEN — and you reach it more often than you think, since 2,1 recovers there and ws+3, DEN.4 and uf+1 all transition into it with D. It is also a crouching state, so ws+1 and ws+4 stay live.",
          leverlessTip:
            "SEN then a tap of d. Because it is a crouching state, remember ws+1 and ws+4 are available coming out of it — LEN is another route back into your launcher.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Chain f+3 into DEN, into SEN, into LEN, and finish with a LEN attack — the full stance chain.",
          },
          difficulty: "hard",
          tags: ["stance", "advanced"],
          moveKeys: ["len1", "len2"],
        },
        {
          id: "stance-mixup",
          stageId: "stances",
          name: "The Stance 50/50",
          notation: "DEN/SEN → mid or low",
          purpose:
            "All of it assembled: from a stance the opponent must guess between a plus-on-block mid, a launching mid, and a low — and you can delay every one of them. This is Lars actual offense.",
          whenToUse:
            "Once the opponent respects the stance enough to stop pressing. Vary timing as much as option — a delayed DEN.3 and an immediate DEN.3 are effectively different moves. Know the honest limit too: a prepared opponent can step left and duck out of SEN pressure, which is why LEN and conditioning matter.",
          leverlessTip:
            "Nothing new to execute — this is a decision drill. If your hands default to one option under pressure, you are flipping a rigged coin; re-drill the switch between options cold.",
          drill: {
            type: "manual",
            checklist: [
              "I entered stance and simply blocked at least twice, without attacking",
              "I mixed mid and low from the same stance in one set",
              "I varied the delay on my stance follow-ups, not just the option",
              "I noticed the opponent freeze up and punished it with the low",
            ],
          },
          difficulty: "expert",
          tags: ["mixup", "concept"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — DEFENSE                                           */
    /* ------------------------------------------------------------ */
    {
      id: "defense",
      number: 7,
      name: "Defense",
      focus: "Decision-making under fire",
      description:
        "Lars offense is strong enough that many players never build defense — and then lose to anyone who takes their turn away. Every item here is a decision, drilled.",
      items: [
        {
          id: "duck-discipline",
          stageId: "defense",
          name: "When to Duck",
          notation: "d (on a read) → ws+1",
          purpose:
            "Ducking is a read with a payoff attached: crouch under a committed high and ws+1 turns their pressure into your combo. Ducking randomly gets you hit by every mid in their list.",
          whenToUse:
            "Duck when you KNOW — a string that always ends high, a throw habit, a jab-happy rhythm. One labbed high-ender per matchup is worth more than ten hopeful crouches.",
          leverlessTip:
            "A read-duck is a committed hold of d, not a tap — then release into ws+1. Practice hold, release, launch as one planned action so the reward is automatic when the read is right.",
          drill: {
            type: "manual",
            checklist: [
              "I know at least 3 common strings that end in duckable highs",
              "I ducked on a specific read this session, not as a panic reflex",
              "I converted a ducked high into ws+1 at least once",
              "I recognized a moment where ducking would have eaten a mid, and did not duck",
            ],
          },
          difficulty: "medium",
          tags: ["defense", "decision"],
          moveKeys: ["ws1"],
        },
        {
          id: "sidestep-defense",
          stageId: "defense",
          name: "Sidestep Discipline",
          notation: "step → block → punish",
          purpose:
            "Stepping a linear move creates a whiff, and a whiff is a launch. Step-BLOCK, though, not step-and-pray: the block covers the homing moves your step loses to.",
          whenToUse:
            "Against linear offense after your minus frames. Remember you own homing tools yourself — b+1, DEN.3, SEN.4 — so respect that the opponent has them too.",
          leverlessTip:
            "A step is a single tap back to neutral, then hold b to block. The discipline is the b afterward. Drill tap, hold-b until the block is part of the step.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Sidestep a linear CPU attack into block, then punish the whiff with at least 2,1.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
        },
        {
          id: "punish-recognition",
          stageId: "defense",
          name: "Punish Recognition",
          notation: "—",
          purpose:
            "Stage 4 gave you the punishes; this gives you the trigger. Recognizing WHICH minus you just blocked, in real time, is what separates knowing punishment from doing it.",
          whenToUse:
            "Every blocked move. The habits: big slow move blocked, launch it; low blocked, ws punish; string ender blocked, at least 2,1. When genuinely unsure, the 10f punish never whiffs into a counter-launch.",
          leverlessTip:
            "Buffer punishes during blockstun as one rehearsed motion per frame range — your hands should hold the answer while your eyes make the call.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "In punishment training with MIXED moves (-10 to -15), choose the correct-tier punish — the right response, not just any response.",
          },
          difficulty: "hard",
          tags: ["defense", "punish"],
        },
        {
          id: "whiff-punish",
          stageId: "defense",
          name: "Whiff Punishment",
          notation: "2,1 / f+1+4 / b+3,4",
          purpose:
            "The best defense is being somewhere the attack is not. A backdash that makes a move whiff creates the window — and f+1+4 turns that window into a launch, with none of its blocked risk.",
          whenToUse:
            "When minus but not cornered: backdash instead of pressing. Their follow-up whiffs and you collect. 2,1 is the safe pickup, f+1+4 is the greedy one, b+3,4 covers longer range.",
          leverlessTip:
            "The b of your backdash and the f of f+1+4 fight for the same hand — the transition needs a clean release between them. Drill backdash, release, f+1+4 as its own compound skill.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Backdash a CPU attack into a clean whiff, then punish it with f+1+4 and convert.",
          },
          difficulty: "hard",
          tags: ["whiff punish", "movement"],
          moveKeys: ["ring-current", "f1plus4", "b3-4"],
        },
        {
          id: "panic-control",
          stageId: "defense",
          name: "Panic Control & Heat Awareness",
          notation: "—",
          purpose:
            "Most health bars are lost to panic: mashing at plus frames, ducking at random, pressing into heat pressure. Defense concludes with the discipline to do NOTHING when nothing is correct.",
          whenToUse:
            "When the opponent activates heat, block more and let the timer burn. When you are minus, holding back is a complete answer. The urge to press is the round leaving your body.",
          leverlessTip:
            "Panic mash on leverless is usually chords sprayed during blockstun — they buffer and lose you your turn. Train resting fingers OFF the buttons while blocking; touch them only once you have chosen an action.",
          drill: {
            type: "manual",
            checklist: [
              "I blocked through an entire heat activation without pressing into it",
              "I identified my own panic habit by name",
              "I survived plus-frame pressure by holding guard until it was actually my turn",
              "I used movement, not a button, to escape at least one pressure sequence",
            ],
          },
          difficulty: "medium",
          tags: ["defense", "discipline"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 08 — GAMEPLAN                                          */
    /* ------------------------------------------------------------ */
    {
      id: "gameplan",
      number: 8,
      name: "Gameplan",
      focus: "The complete Lars round",
      description:
        "You have movement, pokes, launchers, punishment, combos, stances and defense. This stage assembles them into a round structure — what Lars is actually trying to DO from the first dash to the kill.",
      items: [
        {
          id: "gameplan-neutral",
          stageId: "gameplan",
          name: "Phase 1 — Take the Space",
          notation: "dash-block → df+1 / f+4",
          purpose:
            "Lars neutral is simple and aggressive: get into the range where df+1 and df+2 reach, and start touching them. He does not need a gimmick to open a round — his buttons are the plan.",
          whenToUse:
            "Round start and every reset to distance. Win condition: you are the one applying pokes at your preferred range. If you are the one being poked, your spacing is wrong, not your character.",
          leverlessTip:
            "This is your movement stack under match conditions: dash-block forward, KBD out. If execution wobbles here, drop back to Stage 1 for a session — neutral exposes movement debt instantly.",
          drill: {
            type: "manual",
            checklist: [
              "I approached with dash-block rather than raw attacks at least three times",
              "I established df+1 as my default poke in a real set",
              "I used f+4 to touch them from outside df+1 range",
              "I backed out with movement when the exchange went against me",
            ],
          },
          difficulty: "medium",
          tags: ["gameplan", "neutral"],
        },
        {
          id: "gameplan-mids",
          stageId: "gameplan",
          name: "Phase 2 — Make Them Block",
          notation: "df+1 / df+2 / b+1",
          purpose:
            "Before any mixup works, the opponent has to be blocking. Safe mids on repeat is how you get there — and because they are safe, the opponent cannot make you stop.",
          whenToUse:
            "Early and constantly. Watch what they do about it: pressing means b+1 and d+2 counter-hits are live; stepping means homing tools; freezing means it is time for Phase 3.",
          leverlessTip:
            "No new execution — the discipline is repetition without boredom. Throwing df+1 for the tenth time because it is still working is correct play, not a lack of imagination.",
          drill: {
            type: "manual",
            checklist: [
              "I threw the same safe mid repeatedly until the opponent reacted to it",
              "I identified whether they press, step, or freeze after blocking",
              "I punished pressing with a counter-hit tool",
              "I punished stepping with a homing move",
            ],
          },
          difficulty: "medium",
          tags: ["gameplan", "conditioning"],
        },
        {
          id: "gameplan-stance",
          stageId: "gameplan",
          name: "Phase 3 — Escalate to Stance",
          notation: "df+2 → SEN / f+3 → DEN",
          purpose:
            "Once they are blocking, you stop poking and start guessing games. Your pokes flow into stances, and stances force a real 50/50 that patient blocking cannot solve.",
          whenToUse:
            "When the opponent has gone passive. This is the moment Lars converts a small advantage into a big one — every landed poke becomes a stance entry, and every stance entry becomes a guess.",
          leverlessTip:
            "Stage 6 execution under stakes: clean transitions and clean stance exits. If your transitions drop under pressure the whole phase collapses back to poking — re-drill them.",
          drill: {
            type: "manual",
            checklist: [
              "I flowed from a landed poke into a stance in a real set",
              "I mixed mid and low from stance against a blocking opponent",
              "I cancelled a stance to block when I read a challenge",
              "I landed a stance launcher and converted the full combo",
            ],
          },
          difficulty: "hard",
          tags: ["gameplan", "stance"],
        },
        {
          id: "gameplan-convert",
          stageId: "gameplan",
          name: "Phase 4 — Convert Advantage",
          notation: "heat / wall / oki",
          purpose:
            "Lars kills from advantage states: heat gives chip and a +12 heat smash, wall splats add free damage, and knockdowns hand you another guess. Advantage should snowball, not evaporate.",
          whenToUse:
            "Heat when it kills or powers a wall push — hoarded heat is wasted heat. Steer carry combos toward the wall; your wall game turns 50 damage into 80. After a knockdown, keep the boot on.",
          leverlessTip:
            "Advantage states add inputs on top of practiced material. Rehearse the heat round specifically: engage, dash, pressure, smash-or-mix, so the kill sequence is memory rather than improvisation.",
          drill: {
            type: "manual",
            checklist: [
              "I activated heat with a purpose, not just because it was available",
              "I carried a combo to the wall and finished with a wall ender",
              "I ran offense after a knockdown instead of backing off for free",
              "I closed a round during heat",
            ],
          },
          difficulty: "hard",
          tags: ["gameplan", "heat", "wall"],
        },
        {
          id: "gameplan-complete",
          stageId: "gameplan",
          name: "The Complete Round",
          notation: "space → block → stance → convert → defend",
          purpose:
            "The full loop, plus the part that saves rounds: when it goes wrong, defense resets you to neutral instead of to the rematch screen. If you can name your phase mid-round, you understand Lars.",
          whenToUse:
            "Every round, as running self-commentary: taking space, they are blocking, escalate, heat, wall, kill. When you lose the thread, that is a phase problem — find which one you abandoned and re-enter there.",
          leverlessTip:
            "Final execution audit: df+2 into SEN, the b+3~f combo link, f,n,b+2,1 under pressure, the wall ender, the heat sequence. Anything below roughly 80% under pressure gets its stage re-drilled.",
          drill: {
            type: "manual",
            checklist: [
              "I played a full set consciously naming my phase between rounds",
              "I recovered from a lost exchange by re-entering neutral instead of panicking",
              "I won a round where I could narrate why each transition happened",
              "I identified my weakest phase and know which stage re-trains it",
            ],
          },
          difficulty: "expert",
          tags: ["gameplan", "capstone"],
        },
      ],
    },
  ],

  /* -------------------------------------------------------------- */
  /* Punish reaction quiz — answers match the verified punish table  */
  /* -------------------------------------------------------------- */
  punishQuiz: [
    {
      id: "q-10",
      prompt: "-10",
      situation: "You blocked a string ender. You are standing.",
      options: ["2,1", "f+2,1", "f,n,b+2,1", "ws+4"],
      correctIndex: 0,
      explain:
        "2,1 is your 10-frame punish and doubles as your best short-range whiff punisher. f+2,1 needs -12; ws+4 needs a crouching state.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke. Standing.",
      options: ["f+2,1", "2,1", "f+1+2", "uf+4"],
      correctIndex: 0,
      explain:
        "At -12 you upgrade from 2,1 to f+2,1 (or f+2,4 for more damage). f+1+2 needs -15, and uf+4 is i25 — nowhere near fast enough to punish.",
    },
    {
      id: "q-13",
      prompt: "-13",
      situation: "You blocked a mid you know is unsafe. Standing.",
      options: ["f+1,2", "2,1", "ws+1", "b+1"],
      correctIndex: 0,
      explain:
        "f+1,2 is the reliable 13-frame punish and flows into SEN. f+1+4 also reaches and LAUNCHES — take it when you are certain, since it is -18 if you are wrong.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["f,n,b+2,1", "f+1,2", "2,1", "df+1"],
      correctIndex: 0,
      explain:
        "-14 is where Lars gets a full combo: Blue Bolt launches. The motion is the price — buffer f, n during blockstun so only b+2,1 remains.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "Blocked a big move, and your Blue Bolt motion is shaky today.",
      options: ["f+1+2", "f+1,2", "uf+4", "2,1"],
      correctIndex: 0,
      explain:
        "Ark Blast launches at -15 with a single chord instead of a motion. A landed easy punish beats a dropped hard one every time.",
    },
    {
      id: "q-ws11",
      prompt: "-11",
      situation: "You blocked a low poke. You are crouching.",
      options: ["ws+4", "ws+1", "d+3", "2,1"],
      correctIndex: 0,
      explain:
        "ws+4 is your 11-frame while-standing punish. ws+1 needs -15. Answering a blocked low with your own low is donated damage.",
    },
    {
      id: "q-ws13",
      prompt: "-13",
      situation: "You blocked a low. Crouching.",
      options: ["ws+2,1", "ws+4", "ws+1", "db+1"],
      correctIndex: 0,
      explain:
        "ws+2,1 is the 13-frame crouch punish. ws+2,3 into D is the alternative — it ends at +6 in LEN, trading damage for position.",
    },
    {
      id: "q-ws15",
      prompt: "-15",
      situation: "You blocked a big sweep. Crouching.",
      options: ["ws+1", "ws+4", "ws+2,1", "Block again"],
      correctIndex: 0,
      explain:
        "-15 from crouch is a full launch with ws+1, and it carries its own Tornado. Poking after blocking a big low is the most commonly wasted punish in Tekken.",
    },
    {
      id: "q-whiff",
      prompt: "WHIFF",
      situation: "Their big mid just whiffed in front of you.",
      options: ["f+1+4", "d+3", "df+1", "Backdash again"],
      correctIndex: 0,
      explain:
        "A whiff has no blockstun, so f+1+4's -18 costs you nothing — take the launch. 2,1 is the safe pickup and b+3,4 covers longer range.",
    },
    {
      id: "q-rage-art",
      prompt: "-18",
      situation: "You blocked a Rage Art.",
      options: ["f,n,b+2,1", "2,1", "f+2,1", "Throw"],
      correctIndex: 0,
      explain:
        "A blocked Rage Art is the biggest punish window in the game — take maximum damage with a launcher. Anything less leaves a round on the table.",
    },
  ],
};
