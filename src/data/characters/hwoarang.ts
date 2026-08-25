import type { Character } from "@/types";

/**
 * Hwoarang — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Every frame number quoted here comes from `hwoarang.frames.json`, which is
 * diffed against Wavu Wiki by `npm run verify:frames`. Where a startup is a
 * range (i15~16), punishment items quote the slower end — a punish that only
 * works on the lucky frame is not a punish.
 *
 * The character is organised around one idea: he has four stances, and the
 * same button does different things in each. Everything else — the enormous
 * plus-frame arsenal, the flamingo launchers, the terrible lows — follows from
 * that. The curriculum front-loads stance orientation because a player who
 * does not know which foot is forward cannot use any of the rest.
 */
export const hwoarang: Character = {
  id: "hwoarang",
  name: "Hwoarang",
  style: "Taekwondo",
  tagline: "Four stances, endless turn — if you know which foot is forward",
  available: true,
  accent: { base: "#f97316", bright: "#fdba74", deep: "#c2410c" },
  stages: [
    /* ---------------------------------------------------------------- */
    {
      id: "stances",
      number: 1,
      name: "Movement & the Four Stances",
      focus: "Know which foot is forward, or nothing else works",
      description:
        "Hwoarang stands in Left Foot Forward by default and can switch to Right Foot Forward, Left Flamingo, or Right Flamingo. The same button is a different move in each one. Most losing Hwoarang players are not losing to the opponent — they are losing track of their own stance and pressing buttons they did not mean to. This stage is about orientation before offense.",
      items: [
        {
          id: "approach",
          stageId: "stances",
          name: "Forward Dash & Approach",
          notation: "f,f",
          purpose:
            "Hwoarang wins at close range where his plus frames apply. Everything in this curriculum assumes you can close the gap on your own terms rather than walking into a launcher.",
          whenToUse:
            "From round start, and after any knockdown where they have to get up. Dash to the edge of your poke range, then start a turn with a mid.",
          leverlessTip:
            "Full release between the two f presses. On a leverless the temptation is to roll the finger and get f,F held — that gives you a run, not a dash, and runs into whatever they pressed.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash from round-start distance into your poke range and immediately block.",
          },
          difficulty: "easy",
          tags: ["fundamental", "movement"],
        },
        {
          id: "backdash-kbd",
          stageId: "stances",
          name: "Backdash & Korean Backdash",
          notation: "b,b~db, b,b~db, ...",
          purpose:
            "Creates the whiff you launch. Hwoarang has no great long-range answer, so his defense is largely making their button miss and taking your turn back.",
          whenToUse:
            "After your minus frames, and at the range where they want to check you with a mid. Backdash out, let it whiff, then take the launch.",
          leverlessTip:
            "The loop is b, b then tap d while b is still held, release, repeat. Anchor the b finger and drum d. Rhythm before speed — a fast sloppy KBD moves you less than a slow clean one.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "One full-screen retreat using only chained backdash cancels, no gaps.",
          },
          difficulty: "hard",
          tags: ["execution", "defense"],
        },
        {
          id: "sidestep",
          stageId: "stances",
          name: "Sidestep & Sidewalk",
          notation: "u~n / d~n",
          purpose:
            "Steps a linear attack into a free whiff punish. It also feeds his sidestep-only tools, which are some of the fastest things he owns.",
          whenToUse:
            "After a blocked string that leaves you slightly minus, when you expect them to keep pressing a linear button.",
          leverlessTip:
            "One crisp tap back to neutral, then hold b. Drill the step-into-block as a single motion so a failed read costs you a block, not a launch.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Sidestep a linear CPU attack into block, then punish the whiff.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
        },
        {
          id: "motion-switch",
          stageId: "stances",
          name: "Motion Switch",
          notation: "3+4",
          purpose:
            "Swaps Left Foot Forward and Right Foot Forward. This is the single input that unlocks half his movelist — RFF has its own pokes, its own launcher, and the best plus-frame move he owns.",
          whenToUse:
            "In neutral to access RFF tools, and as a stance reset after a flamingo sequence ends. It has no frames of its own — it is a stance change, not an attack, so never do it inside their pressure.",
          leverlessTip:
            "3+4 is a simultaneous two-button press. On a leverless this is trivially consistent, which is the one place Hwoarang is easier on a hitbox than a stick — no roll, no timing, just both buttons.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "From neutral, switch to RFF and immediately throw RFF.f+3. Then switch back and throw f+4.",
          },
          difficulty: "easy",
          tags: ["stance", "fundamental"],
        },
        {
          id: "flamingo-entry",
          stageId: "stances",
          name: "Entering the Flamingos",
          notation: "f+3 / f,n,4",
          purpose:
            "The flamingo stances are where his launchers live. f+3 feints into Left Flamingo, f,n,4 into Right Flamingo — both are stance entries with no attack attached, so they are how you get to the good buttons without committing to one.",
          whenToUse:
            "After a plus-on-block move, when they are frozen and you want a threat that both launches and stays plus. Never as your first action in neutral.",
          leverlessTip:
            "For f,n,4 the n matters — release f fully to neutral before 4, or you get plain f+4 instead. Practise it as three separate taps rather than a roll.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Enter Left Flamingo with f+3, then Right Flamingo with f,n,4, ten of each, naming the stance out loud as you land in it.",
          },
          difficulty: "medium",
          tags: ["stance", "execution"],
        },
        {
          id: "stance-awareness",
          stageId: "stances",
          name: "Knowing Where You Are",
          notation: "—",
          purpose:
            "The hardest thing about Hwoarang is not execution, it is bookkeeping. Four stances, and a wrong guess about which one you are in turns a launcher into a whiffed high. This item is the habit that prevents it.",
          whenToUse:
            "Constantly. Every move that transitions has to be learned as its own answer to the question 'and where does that leave me?'",
          leverlessTip:
            "Nothing controller-specific here. Read your own animation, not the input display — his stances are visually distinct once you look for the lead foot.",
          drill: {
            type: "manual",
            checklist: [
              "Left Foot Forward is the default — the stance you start the round in.",
              "3+4 switches Left Foot Forward and Right Foot Forward, and has no frames of its own.",
              "f+3 enters Left Flamingo; f,n,4 enters Right Flamingo.",
              "Inside a flamingo, 3+4 switches to the other flamingo rather than returning to normal.",
              "Many of his strings transition on their own — read the frame panel notes for 'Transition to' before you drill a move.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "stance"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "pokes",
      number: 2,
      name: "Core Pokes",
      focus: "The buttons that hold the turn together",
      description:
        "Before the stance game is worth anything, you need the small Tekken that gets you into it. These are the Left Foot Forward buttons you will press most, and the ones whose frames you should know without thinking.",
      items: [
        {
          id: "jab-string",
          stageId: "pokes",
          name: "Jab & Left Right Combo",
          notation: "1 / 1,2",
          purpose:
            "i10 and plus one on block. The jab is your fastest interrupt, your fastest punish, and — because 1,2 transitions to either flamingo — your cheapest way into stance.",
          whenToUse:
            "To interrupt, to check, and to punish anything at -10. Follow with 3 for Left Flamingo or 4 for Right Flamingo when the second hit is blocked.",
          leverlessTip:
            "1 then 2 as separate taps. The transitions off 1,2 are held directions, not timing-critical inputs, so get the string out first and add the stance later.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "1,2 on block, then transition into Left Flamingo with 3.",
          },
          difficulty: "easy",
          tags: ["i10", "poke"],
          moveKeys: ["jab", "1-2", "right"],
        },
        {
          id: "df1",
          stageId: "pokes",
          name: "Standing Mid Check",
          notation: "df+1",
          purpose:
            "i13~14 mid at only -1 on block. This is the button that beats a crouching opponent without giving your turn away, which matters because most of his best moves are highs.",
          whenToUse:
            "When they start ducking your highs — and they will, because so much of his pressure is high. Also as a safe way to end a sequence without going minus.",
          leverlessTip:
            "df is a two-finger diagonal on a leverless. Keep the d and f fingers resting so the diagonal registers as one press, not d-then-f.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "df+1 on block, then hold your ground — at -1 you still contest anything slower than i12.",
          },
          difficulty: "easy",
          tags: ["mid", "safe", "poke"],
          moveKeys: ["df1"],
        },
        {
          id: "kick4",
          stageId: "pokes",
          name: "Right Kick",
          notation: "4",
          purpose:
            "i11~12 high that reaches further than the jab. Your second-fastest button and the one that checks people stepping just outside jab range.",
          whenToUse:
            "As a fast poke at slightly longer range, and as your punish at -12. It is a high, so it loses to a crouching opponent entirely.",
          leverlessTip:
            "Nothing exotic — but keep it out of your habit loop against duckers. A whiffed high at close range is the single most common way Hwoarang players get launched.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "4 as a standalone poke at max range, then block.",
          },
          difficulty: "easy",
          tags: ["i12", "high", "poke"],
          moveKeys: ["kick4"],
        },
        {
          id: "b2",
          stageId: "pokes",
          name: "Right Back Elbow",
          notation: "b+2",
          purpose:
            "i14 at -4 on block, and +14c on counter-hit. A safe poke with a genuine counter-hit reward attached, which is a rare combination for him.",
          whenToUse:
            "When you expect them to press into your turn. The counter-hit gives you a guaranteed follow-up, so this is how you make interrupting expensive.",
          leverlessTip:
            "Hold b and press 2 — no timing element. Worth binding into your muscle memory as the 'they keep pressing' answer.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "b+2 into a CPU set to attack after block, to feel the counter-hit reward.",
          },
          difficulty: "easy",
          tags: ["counter-hit", "safe"],
          moveKeys: ["b2"],
        },
        {
          id: "d1-crouch",
          stageId: "pokes",
          name: "Crouch Jab",
          notation: "d+1",
          purpose:
            "i10 from crouch, hits special-low. It is how you contest from a duck without standing up into whatever they aimed at your head.",
          whenToUse:
            "After blocking a low, or when you are ducking a predictable high. It is -5 on block, so it buys you a reset rather than a turn.",
          leverlessTip:
            "Hold d and tap 1. On a leverless holding d is free, so crouch pokes cost you nothing positionally — use them more than a stick player would.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Duck a high, d+1 to check, then return to standing block.",
          },
          difficulty: "easy",
          tags: ["i10", "crouch"],
          moveKeys: ["d1"],
        },
        {
          id: "peacekeeper",
          stageId: "pokes",
          name: "Peacekeeper",
          notation: "f,F+4",
          purpose:
            "i17~18 mid that launches for a full combo on hit and is only -7 on block. This is his safest way to threaten a launch from range.",
          whenToUse:
            "At the range where they think they are safe from a launcher. Because it is only -7, being blocked costs you a poke rather than the round.",
          leverlessTip:
            "f then hold F and press 4. The held F is what distinguishes it — a tapped f,f+4 is a different move. Hold through the button press.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "f,F+4 from dash range, hitting the launcher cleanly rather than sliding into f,f,F+4.",
          },
          difficulty: "medium",
          tags: ["launcher", "mid", "safe"],
          moveKeys: ["f-f4"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "plus",
      number: 3,
      name: "Staying Plus",
      focus: "Forty-nine moves that keep your turn",
      description:
        "This is the character. Hwoarang has an unusual number of moves that leave him at advantage even when blocked, which means his turn does not end when theirs would. The skill is not memorising all of them — it is knowing three or four cold, and understanding what being plus actually buys you.",
      items: [
        {
          id: "what-plus-buys",
          stageId: "plus",
          name: "What Plus Frames Buy",
          notation: "—",
          purpose:
            "Being plus is not the same as being safe. Plus means your next button beats theirs if the gap is smaller than their fastest move. Knowing the number tells you exactly which of your moves is now uninterruptible.",
          whenToUse:
            "Every time a plus move is blocked. The mistake is treating +8 as 'I win' rather than 'anything of mine faster than i18 now beats their jab'.",
          leverlessTip:
            "No execution here. The habit to build is reading the frame panel before drilling, not after losing to it.",
          drill: {
            type: "manual",
            checklist: [
              "At +4, anything of yours faster than i14 beats their i10 jab.",
              "At +8, you are effectively taking a free move — but a throw or a step still beats a slow one.",
              "Plus on block is not plus on hit — check both numbers, they are often very different.",
              "Being plus with a high means nothing against someone who is already crouching.",
            ],
          },
          difficulty: "medium",
          tags: ["concept"],
        },
        {
          id: "f4-hook",
          stageId: "plus",
          name: "Right Hook Kick",
          notation: "f+4",
          purpose:
            "Between +7 and +13 on block depending on range. That is an enormous amount of advantage for a single button, and it is the backbone of his neutral pressure.",
          whenToUse:
            "As a turn-starter at mid range. On block you are massively plus and can go straight into a flamingo entry or another plus move.",
          leverlessTip:
            "Hold f, press 4. The range dependency is positional, not execution — at max range you get the larger number, so learn to throw it slightly further out than feels natural.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "f+4 on block, then immediately f+3 into Left Flamingo while they are still frozen.",
          },
          difficulty: "easy",
          tags: ["plus", "high", "pressure"],
          moveKeys: ["f4"],
        },
        {
          id: "cheap-shot",
          stageId: "plus",
          name: "Cheap Shot",
          notation: "RFF.f+3",
          purpose:
            "Between +12 and +15 on block. There is almost nothing else like it in the game — a blocked move that hands you most of a free launcher's worth of advantage.",
          whenToUse:
            "In Right Foot Forward, as the move that makes them stop pressing entirely. It is a high, so a crouching opponent takes it away completely — which is what the mids in this stage are for.",
          leverlessTip:
            "You must already be in RFF. The failure mode is throwing it from Left Foot Forward and getting f+3, a stance feint with no attack, straight into their turn.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "3+4 into RFF, then RFF.f+3, confirming you are in the right stance before you press.",
          },
          difficulty: "medium",
          tags: ["plus", "high", "pressure"],
          moveKeys: ["rff-f3", "rff-2"],
        },
        {
          id: "left-kicks",
          stageId: "plus",
          name: "Left Kicks",
          notation: "3,3,4",
          purpose:
            "Ends at +8 on block. A three-hit string that finishes with you still holding the turn, which lets you keep pressing without ever handing it over.",
          whenToUse:
            "As a pressure string when they are respecting you. The 3,3,f+4 ending launches instead, so the same opening threatens both.",
          leverlessTip:
            "Three separate taps. Do not rush the third — the string has delay windows, and delaying the ender is what beats people trying to duck the high.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "3,3,4 on block, then immediately press a fast button to feel that the turn is still yours.",
          },
          difficulty: "medium",
          tags: ["plus", "string", "pressure"],
          moveKeys: ["3-3-4", "3-3-f4"],
        },
        {
          id: "smash-low-right",
          stageId: "plus",
          name: "Smash Low Right",
          notation: "d+3,4",
          purpose:
            "A low that ends between +8g and +10g on block. Almost every low in Tekken gives your turn away — this one keeps it, which makes it the rare low you can throw without gambling.",
          whenToUse:
            "To open up someone standing and blocking high. Because the ender is plus on block, being blocked is not a punish, it is a reset in your favour.",
          leverlessTip:
            "d+3 then 4. The follow-up is not automatic — you have to press it. Drill the two-press rhythm so the string never comes out as a lone d+3 at -13.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "d+3,4 as a complete string, never leaving the d+3 hanging on its own.",
          },
          difficulty: "medium",
          tags: ["plus", "low", "mixup"],
          moveKeys: ["d3-4", "d3"],
        },
        {
          id: "axe-kick",
          stageId: "plus",
          name: "Spinning Axe Kick",
          notation: "f,F+3",
          purpose:
            "+6 on block, and a mid. The high-plus moves in this stage all lose to crouching — this is the one that punishes them for it while keeping you at advantage.",
          whenToUse:
            "The moment they start ducking f+4 or Cheap Shot. It is the answer that makes the high pressure work again.",
          leverlessTip:
            "f then hold F with 3. Same held-forward motion as Peacekeeper, so drill them as a pair — the only difference is which button ends it.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "f,F+3 against a crouching CPU, then continue pressure from +6.",
          },
          difficulty: "medium",
          tags: ["plus", "mid", "pressure"],
          moveKeys: ["f-f3", "f-f-f3"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "punishment",
      number: 4,
      name: "Punishment",
      focus: "Free damage, on schedule",
      description:
        "Hwoarang's punishment is honest rather than exceptional: a solid i10, a reliable i14, and a launcher at i15~16. Where he does stand out is from crouch. Every number below quotes the slower end of its startup range, because a punish that only lands on the fast frame is not a punish.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "Standing -10",
          notation: "1,2",
          purpose:
            "i10 into a string that transitions to either flamingo. Small damage, but it converts a blocked move into stance pressure, which is worth more than the damage.",
          whenToUse:
            "Anything blocked at -10 or worse that you cannot reach with something bigger.",
          leverlessTip:
            "Two clean taps. Punishment is the one place to be conservative — take the guaranteed jab string over a launcher you are not sure reaches.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "Block a -10 move and punish with 1,2 every time.",
          },
          difficulty: "easy",
          tags: ["punish", "i10"],
          moveKeys: ["1-2", "jab"],
        },
        {
          id: "punish-12",
          stageId: "punishment",
          name: "Standing -12",
          notation: "4",
          purpose:
            "i11~12 with more range than the jab string, so it reaches punishes that 1,2 falls short of.",
          whenToUse:
            "At -12, especially when the blocked move pushed you back far enough that a jab would whiff.",
          leverlessTip:
            "Nothing tricky. The judgement is range: if you are unsure whether 1,2 reaches, 4 usually does.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "Punish a -12 move with 4 at a range where 1,2 would whiff.",
          },
          difficulty: "easy",
          tags: ["punish", "i12"],
          moveKeys: ["kick4"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "Standing -14",
          notation: "b+2",
          purpose:
            "i14 and only -4 if you mistime it. The safest big-ish punish he owns, which makes it the right default when you are not certain the launcher reaches.",
          whenToUse:
            "At -14 when df+2 is out of range or you are not confident in the read.",
          leverlessTip:
            "Hold b, press 2. Drill it back to back with df+2 so you can pick between them without thinking about the input.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "Punish a -14 move with b+2.",
          },
          difficulty: "easy",
          tags: ["punish", "i14"],
          moveKeys: ["b2"],
        },
        {
          id: "punish-launch",
          stageId: "punishment",
          name: "Launch Punish",
          notation: "df+2",
          purpose:
            "i15~16 mid that launches for a full combo. This is where a blocked move stops costing them a poke and starts costing them half the health bar.",
          whenToUse:
            "At -16 and worse. Take the certain launch over a bigger one you might drop — the combo is where the damage is, not the launcher.",
          leverlessTip:
            "df+2 as a single diagonal press. If you find yourself getting plain 2, your d finger is lifting early — press both and release both together.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Block a -16 move and launch with df+2 into your combo route.",
          },
          difficulty: "medium",
          tags: ["punish", "launcher", "i16"],
          moveKeys: ["df2"],
        },
        {
          id: "punish-crouch",
          stageId: "punishment",
          name: "Crouch Punishment",
          notation: "ws4 / ws1",
          purpose:
            "i11~12 and i12~13 out of crouch, both at -3 on block. Blocking a low should always cost them something, and these are the buttons that make sure it does.",
          whenToUse:
            "Immediately after blocking any low. Both are mids, so they beat someone trying to keep pressing after their low was blocked.",
          leverlessTip:
            "While-standing means releasing d and pressing during the rise. On a leverless, release d and hit the button as one motion — do not wait to see the stand animation.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "Block a low and punish with ws4 every time.",
          },
          difficulty: "medium",
          tags: ["punish", "crouch"],
          moveKeys: ["ws4", "ws1"],
        },
        {
          id: "punish-crouch-big",
          stageId: "punishment",
          name: "Big Crouch Punishment",
          notation: "ws3 / ws2,3",
          purpose:
            "Iron Heel is i14~16 with +14c on hit; ws2,3 is slower but carries an enormous +72a launch. Against the launch-punishable lows most of the cast throws, this is real damage.",
          whenToUse:
            "After blocking a committal low — the kind that leaves them at -16 or worse. Use ws3 for the reliable version and ws2,3 when you have the frames for it.",
          leverlessTip:
            "Same while-standing motion, longer strings. Confirm the low is actually blocked before committing; both are heavily punishable if you throw them at nothing.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Block a committal low and punish with ws3.",
          },
          difficulty: "hard",
          tags: ["punish", "crouch", "launcher"],
          moveKeys: ["ws3", "ws2-3", "ws1-4"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "flamingos",
      number: 5,
      name: "The Flamingos",
      focus: "Plus on block and launching on hit, from the same button",
      description:
        "Left and Right Flamingo are where the character stops being fair. The step kicks are i14~16, plus four on block, and launch on normal hit — a combination almost nothing else in the game offers. This stage is the payoff for the stance bookkeeping in Stage 1.",
      items: [
        {
          id: "step-kick",
          stageId: "flamingos",
          name: "Step Kick",
          notation: "LFS.4 / RFS.3",
          purpose:
            "i14~16, +4 on block, +27a on hit. Plus when blocked and a full launch when it lands — there is no version of this exchange where you come out behind.",
          whenToUse:
            "As your main flamingo threat. It is a high, so a crouching opponent takes it away — pair it with the flamingo mids below.",
          leverlessTip:
            "The button depends on the stance: 4 in Left Flamingo, 3 in Right Flamingo. Drilling only one side is the classic Hwoarang mistake — practise both until the stance picks the button for you.",
          drill: {
            type: "accuracy",
            attempts: 16,
            required: 13,
            rep: "Enter each flamingo and land its step kick — eight from Left Flamingo with 4, eight from Right Flamingo with 3.",
          },
          difficulty: "medium",
          tags: ["launcher", "plus", "stance"],
          moveKeys: ["lfs-4", "rfs-3"],
        },
        {
          id: "flamingo-jab",
          stageId: "flamingos",
          name: "Flamingo Back Hand",
          notation: "LFS.1 / RFS.2",
          purpose:
            "i13 at +5 on block. Your fast button inside stance — the one that contests anything they try while you are standing on one leg.",
          whenToUse:
            "When they try to interrupt your flamingo. At i13 it beats most attempts, and at +5 you keep the stance pressure going.",
          leverlessTip:
            "Again stance-dependent: 1 in Left Flamingo, 2 in Right Flamingo. Same drilling rule — both sides or neither.",
          drill: {
            type: "total-reps",
            target: 16,
            rep: "Enter a flamingo and check with its back hand, eight per side.",
          },
          difficulty: "medium",
          tags: ["plus", "stance", "i13"],
          moveKeys: ["lfs-1", "rfs-2"],
        },
        {
          id: "flamingo-rocket",
          stageId: "flamingos",
          name: "Flamingo Rocket",
          notation: "LFS.f+3",
          purpose:
            "A mid that is +4 on block and launches for +26a on hit. This is the answer to everyone who learns to duck the step kick.",
          whenToUse:
            "Once they start crouching in anticipation of LFS.4. Same reward, but it cannot be ducked.",
          leverlessTip:
            "Hold f and press 3 while in Left Flamingo. Because you are already holding a direction to be in stance, be deliberate about returning to neutral first.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "From Left Flamingo, land f+3 against a crouching CPU.",
          },
          difficulty: "medium",
          tags: ["launcher", "mid", "plus", "stance"],
          moveKeys: ["lfs-f3"],
        },
        {
          id: "flamingo-low",
          stageId: "flamingos",
          name: "Flamingo Low Right",
          notation: "LFS.d+3,4",
          purpose:
            "The flamingo version of Smash Low Right — a low ending between +8g and +10g on block. It completes the stance mixup: high, mid, and now low, all from the same stance and all keeping your turn.",
          whenToUse:
            "As the third option once they are respecting both the step kick and the rocket. Being blocked still leaves you plus.",
          leverlessTip:
            "d+3 then 4, and the follow-up is manual. A lone LFS.d+3 sits at -17 and gets launched, so never let the string hang.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 10,
            rep: "From Left Flamingo, complete d+3,4 every time — never a lone d+3.",
          },
          difficulty: "medium",
          tags: ["low", "plus", "stance", "mixup"],
          moveKeys: ["lfs-d3-4", "lfs-d4"],
        },
        {
          id: "screw-kick",
          stageId: "flamingos",
          name: "Flamingo Screw Kick",
          notation: "LFS.b+4,3",
          purpose:
            "i16~19 launcher that is exactly neutral on block. A launch attempt that costs you nothing when it is blocked is a very good deal.",
          whenToUse:
            "When you want a launch from stance but cannot afford to be minus if you are wrong.",
          leverlessTip:
            "Hold b with 4, then 3. Because you must hold back inside a stance that already uses directions, this is the flamingo input most likely to come out wrong — drill it slowly.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "From Left Flamingo, land b+4,3 as a complete string.",
          },
          difficulty: "hard",
          tags: ["launcher", "stance"],
          moveKeys: ["lfs-b4-3", "lfs-uf4"],
        },
        {
          id: "viper-combo",
          stageId: "flamingos",
          name: "Right Viper Combo",
          notation: "RFS.f+4,4",
          purpose:
            "+75a on hit — the largest single launch reward in his movelist. It is i23 and -6 on block, so it is a read rather than a poke.",
          whenToUse:
            "When you are confident they are frozen. The payoff justifies the commitment, but only when you have earned the respect first.",
          leverlessTip:
            "From Right Flamingo, hold f with 4, then 4 again. Confirm the stance before committing — this is a lot of frames to throw at nothing.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "From Right Flamingo, land f+4,4 in full.",
          },
          difficulty: "hard",
          tags: ["launcher", "stance", "commit"],
          moveKeys: ["rfs-f4-4", "rfs-uf4"],
        },
        {
          id: "flamingo-switch",
          stageId: "flamingos",
          name: "Flamingo Switch",
          notation: "LFS.3+4 / RFS.3+4",
          purpose:
            "Swaps between the two flamingos without leaving stance. It changes which buttons are available mid-pressure, which is how you keep a defender from pattern-matching your stance.",
          whenToUse:
            "When they have worked out which flamingo you are in and started pre-emptively ducking or blocking one side.",
          leverlessTip:
            "3+4 again, but note that inside a flamingo it switches flamingos rather than returning you to a normal stance. That distinction catches everyone once.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Left Flamingo, switch to Right Flamingo, and finish with its step kick (3).",
          },
          difficulty: "medium",
          tags: ["stance", "mixup"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "combos",
      number: 6,
      name: "Combos",
      focus: "One route per launcher, executed every time",
      description:
        "Hwoarang's launchers all funnel into similar air routes, so the goal is one reliable route you can land under pressure rather than a maximum-damage one you drop half the time. Damage values vary by launcher height and wall proximity — build the route in practice mode and keep it.",
      items: [
        {
          id: "combo-df2",
          stageId: "combos",
          name: "The df+2 Route",
          notation: "df+2 → route",
          purpose:
            "df+2 is your punish launcher, so its route is the one you will use most. Learn this before any other combo.",
          whenToUse:
            "Every launch punish at -16 and worse.",
          leverlessTip:
            "Build the route in practice mode with the frame panel open and write it down. Consistency beats damage — a route you land every time is worth more than one you drop under pressure.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Launch with df+2 and complete your chosen route without dropping.",
          },
          difficulty: "medium",
          tags: ["combo", "punish"],
          moveKeys: ["df2"],
          verifyInGame:
            "Combo routes and damage are not in the frame table — build the route yourself in practice mode and confirm it holds at your usual wall distance.",
        },
        {
          id: "combo-sky-rocket",
          stageId: "combos",
          name: "Sky Rocket",
          notation: "CD.4",
          purpose:
            "i16 crouch-dash launcher worth +53a. It is -18 on block, which is a full launch punish against you — this is a hard read, not a poke.",
          whenToUse:
            "When you are confident they will press or stand still. Never as a habit; the punishment for being wrong is the whole round.",
          leverlessTip:
            "The crouch dash is f,n,d,df. On a leverless that is four discrete presses — f, release, d, then df. Rushing it gives you a plain df+4.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Crouch dash into 4, landing the launcher rather than a stray df+4.",
          },
          difficulty: "hard",
          tags: ["launcher", "commit", "execution"],
          moveKeys: ["sky-rocket"],
        },
        {
          id: "lethal-sky-rocket",
          stageId: "combos",
          name: "Lethal Sky Rocket",
          notation: "f,n,df+4 (just frame)",
          purpose:
            "The just-frame version. Same i16 startup, but +59a instead of +53a and — the part that matters — only -8 on block instead of -18. Hitting the just frame turns a round-losing whiff into a safe one.",
          whenToUse:
            "Everywhere you would have used Sky Rocket. The frame data alone justifies the practice time: this is the difference between a read you can afford to be wrong about and one you cannot.",
          leverlessTip:
            "The just frame is the 4 landing on the exact frame df registers. Drill it as a rhythm rather than a speed — f, release, d, then df and 4 as one beat. Turn on input display and watch for the just-frame flash.",
          drill: {
            type: "accuracy",
            attempts: 20,
            required: 8,
            rep: "Land the just-frame version, confirmed by the on-screen flash rather than by feel.",
          },
          difficulty: "expert",
          tags: ["just-frame", "launcher", "execution"],
          moveKeys: ["lethal-sky-rocket", "sky-rocket"],
        },
        {
          id: "combo-plasma",
          stageId: "combos",
          name: "Left Plasma Blade",
          notation: "b+3",
          purpose:
            "i16~17 for +35a, and a mid. The catch is -19 on block, which is worse than most launchers — being blocked here is a full combo against you.",
          whenToUse:
            "As a whiff punish, where the risk is already paid for. Using it as a pressure tool is how the round ends early.",
          leverlessTip:
            "Hold b, press 3. Trivial input, hard discipline — the difficulty is not pressing it when you have not earned it.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Backdash to make a CPU attack whiff, then punish the whiff with b+3.",
          },
          difficulty: "medium",
          tags: ["launcher", "whiff-punish", "unsafe"],
          moveKeys: ["b3-plasma"],
        },
        {
          id: "combo-firecracker",
          stageId: "combos",
          name: "Firecracker",
          notation: "d+4,4",
          purpose:
            "+69a on hit from a low starter — one of his biggest rewards, off a hit most people do not expect to be launched by.",
          whenToUse:
            "As a surprise, not a staple. It is -13 on block, so it is punishable, and it is a string you have to complete.",
          leverlessTip:
            "d+4 then 4. Like his other low strings, the follow-up is manual and a lone d+4 sits at -17.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land d+4,4 as a complete string and convert the launch.",
          },
          difficulty: "medium",
          tags: ["combo", "low", "launcher"],
          moveKeys: ["d4-4", "d4"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "lows",
      number: 7,
      name: "Lows & the Mixup Problem",
      focus: "His honest weakness, and the two workarounds",
      description:
        "For a character with this much pressure, Hwoarang's lows are poor. Almost every one is launch-punishable on block, and the ones that are not are slow or short. The workaround is not a better low — it is using the two lows that stay plus, and making the high-mid pressure so strong that you rarely need a low at all.",
      items: [
        {
          id: "the-low-problem",
          stageId: "lows",
          name: "The Low Problem",
          notation: "—",
          purpose:
            "Understanding why his lows are bad stops you from throwing them at the wrong time. Most sit between -11 and -17 on block, which against a competent opponent is a launch.",
          whenToUse:
            "As a filter on every low you are about to press. If the answer to 'what happens if this is blocked' is 'I get launched', it needs to be a read, not a habit.",
          leverlessTip:
            "No execution. This is the item that saves you the most health of anything in the curriculum.",
          drill: {
            type: "manual",
            checklist: [
              "db+4 is -12 on block, db+3 is -13, d+3+4 is -14 — all punishable.",
              "d+3,4 and LFS.d+3,4 are the exceptions: they end plus on block.",
              "A low that is blocked twice in a round has told them they can duck-block and wait.",
              "His mid pressure is strong enough that lows are a garnish, not the meal.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "low"],
        },
        {
          id: "db4",
          stageId: "lows",
          name: "Low Kick",
          notation: "db+4",
          purpose:
            "i16 low at -12 on block. Not good, but it is the fastest normal low he has and it exists to make people stop standing straight up.",
          whenToUse:
            "Sparingly, against opponents who are blocking high and not punishing lows. Stop the moment they start.",
          leverlessTip:
            "db is a two-finger diagonal held while pressing 4. Keep the fingers seated so it does not come out as plain d+4 at -17.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "db+4 as a single check, then immediately block — you are minus and it is their turn.",
          },
          difficulty: "easy",
          tags: ["low", "unsafe"],
          moveKeys: ["db4", "db4-4"],
        },
        {
          id: "sweep",
          stageId: "lows",
          name: "Sweep Kick",
          notation: "db+3",
          purpose:
            "i19 low that gives +17g on counter-hit. Slow and -13 on block, but the counter-hit reward makes it a real threat against someone pressing buttons.",
          whenToUse:
            "Against opponents who attack rather than block during your gaps. The counter-hit is where the value is, not the normal hit.",
          leverlessTip:
            "Same db diagonal, different button. Drill it back to back with db+4 so the two lows share one motion.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "db+3 against a CPU set to attack after block, to see the counter-hit reward.",
          },
          difficulty: "easy",
          tags: ["low", "counter-hit"],
          moveKeys: ["db3"],
        },
        {
          id: "dark-halberd",
          stageId: "lows",
          name: "Dark Halberd",
          notation: "d+3+4",
          purpose:
            "A low that transitions to Left Flamingo on hit at +6. It is -14 on block, so it is a commitment — but landing it puts you in stance with the turn.",
          whenToUse:
            "When you want a low that leads somewhere rather than just dealing chip. On hit you are in flamingo and can go straight into the step kick.",
          leverlessTip:
            "d with 3+4 together. Because 3+4 is also Motion Switch, be certain d is held — without it you get a stance change instead of an attack.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land d+3+4 and continue immediately with LFS.4 from the flamingo it leaves you in.",
          },
          difficulty: "medium",
          tags: ["low", "stance", "unsafe"],
          moveKeys: ["d3plus4"],
        },
        {
          id: "heel-screw",
          stageId: "lows",
          name: "Heel Screw",
          notation: "RFF.d+3+4",
          purpose:
            "i19 low from Right Foot Forward, -11 on block and +5 on hit, with +15g on counter-hit. The least punishable low he owns, and it lives in the stance where his best plus move also lives.",
          whenToUse:
            "In RFF, as the low that pairs with Cheap Shot. High plus and low threat from the same stance is a genuine mixup.",
          leverlessTip:
            "Requires RFF. Drill the pair together — 3+4 into stance, then alternate RFF.f+3 and RFF.d+3+4 so the mixup becomes one decision.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "From RFF, alternate Cheap Shot and Heel Screw as a genuine high-low mixup.",
          },
          difficulty: "medium",
          tags: ["low", "stance", "mixup"],
          moveKeys: ["rff-d3plus4", "rff-f3"],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "gameplan",
      number: 8,
      name: "Defense, Heat & Gameplan",
      focus: "Holding your turn, and what to do when you lose it",
      description:
        "Hwoarang spends most of a round on offense, which means his defensive habits get the least practice and cost the most. This stage covers what to do when the pressure stops, what Heat actually buys him, and how the pieces fit into a round.",
      items: [
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat & Trinity Claymore",
          notation: "2+3 / H.2+3",
          purpose:
            "Heat Burst is +1 on block and gets you into Heat safely. The Heat Smash, Trinity Claymore, is +11 on block — one of the most advantageous blocked moves in his kit, and it is a mid.",
          whenToUse:
            "Burst to escape pressure or to enter Heat during your own turn. Save the Smash for when you need a mid that keeps the turn regardless of the outcome.",
          leverlessTip:
            "2+3 simultaneous. Easy on a leverless — the discipline is not burning Heat the moment you get it just because the meter is full.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Heat with 2+3, then use Trinity Claymore and continue pressure from +11.",
          },
          difficulty: "medium",
          tags: ["heat", "plus", "mid"],
          moveKeys: ["2plus3", "h-2plus3"],
        },
        {
          id: "sidestep-tools",
          stageId: "gameplan",
          name: "Sidestep Tools",
          notation: "SS.3,3 / SS.4",
          purpose:
            "Eruption is i9~10 out of a sidestep and ends +3 on block. SS.4 is a low with +31a on counter-hit. Stepping is not only defense for him — it opens its own small movelist.",
          whenToUse:
            "After stepping a linear attack. Instead of only blocking the whiff, take the fast plus string.",
          leverlessTip:
            "Tap the step, then press during the step animation rather than after it. On a leverless the step is a clean single tap, which makes these more accessible than on a stick.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Sidestep a linear attack and follow with SS.3,3.",
          },
          difficulty: "medium",
          tags: ["movement", "plus"],
          moveKeys: ["ss-3-3", "ss-4"],
        },
        {
          id: "getting-ducked",
          stageId: "gameplan",
          name: "When They Duck",
          notation: "—",
          purpose:
            "A large share of his best pressure is high — f+4, Cheap Shot, the step kicks. Against someone who ducks on reaction, all of it evaporates at once. Knowing your mid answers is what keeps the pressure honest.",
          whenToUse:
            "The moment a high whiffs over a crouching opponent. That is information, not bad luck — they have made a read and you have to change the answer.",
          leverlessTip:
            "Holding d is effortless on a leverless, which means your opponents on one will duck more. Expect it.",
          drill: {
            type: "manual",
            checklist: [
              "df+1 is your fastest mid check at -1 on block.",
              "f,F+3 keeps you plus and cannot be ducked.",
              "LFS.f+3 is the flamingo mid, still plus and still launching.",
              "Trinity Claymore in Heat is a mid at +11.",
              "If a high whiffs over a crouch twice, stop throwing it and take the free mid instead.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "defense"],
        },
        {
          id: "stance-discipline",
          stageId: "gameplan",
          name: "Stance Discipline Under Pressure",
          notation: "—",
          purpose:
            "Stance changes have no frames of their own. Doing one while you are minus is the same as doing nothing while they attack, and it is the most common way a Hwoarang player loses a round they were winning.",
          whenToUse:
            "As a rule rather than a decision: no stance transitions inside their turn. Block first, take your turn back, then switch.",
          leverlessTip:
            "The ease of 3+4 on a leverless makes this worse, not better — it is so cheap to press that it becomes a nervous habit. Watch for it in replays.",
          drill: {
            type: "manual",
            checklist: [
              "3+4, f+3 and f,n,4 are stance changes with no attack — they lose to everything while you are minus.",
              "Enter stance from plus frames, never from minus.",
              "If you are unsure whether you are plus, you are not — block instead.",
              "Ending a flamingo sequence on a blocked high hands them the turn; end on a plus move instead.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "stance", "defense"],
        },
        {
          id: "the-round",
          stageId: "gameplan",
          name: "The Complete Hwoarang Round",
          notation: "—",
          purpose:
            "Assembles the curriculum into a plan you can actually run, rather than a pile of moves you know individually.",
          whenToUse:
            "Every round. Read it before a session and check yourself against it afterwards.",
          leverlessTip:
            "Nothing here is execution. If a step keeps failing, the drill for it is in an earlier stage — go back rather than pushing through.",
          drill: {
            type: "manual",
            checklist: [
              "Approach to poke range and open with a mid, not a stance change.",
              "Get a plus move blocked — f+4, or Cheap Shot from RFF — and take the free turn it buys.",
              "Enter a flamingo from those plus frames, never from neutral.",
              "In stance, threaten the step kick, the mid rocket, and the plus low so all three are live.",
              "Punish every blocked low with ws4, and every -16 with df+2 into your route.",
              "When a high whiffs over a crouch, switch to mids immediately rather than repeating it.",
              "Never transition stance while minus.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "gameplan"],
        },
      ],
    },
  ],
  punishQuiz: [
    {
      id: "hwo-q-10",
      prompt: "-10",
      situation: "You blocked a move that leaves them at -10.",
      options: ["1,2", "df+2", "b+2", "ws4"],
      correctIndex: 0,
      explain:
        "1,2 is i10 — the only one of these that reaches at -10. It also transitions to either flamingo, so a small punish becomes stance pressure.",
    },
    {
      id: "hwo-q-12",
      prompt: "-12, pushed back",
      situation: "A -12 move, blocked at a range where the jab would whiff.",
      options: ["4", "1,2", "db+4", "f+4"],
      correctIndex: 0,
      explain:
        "4 is i11~12 with more range than 1,2. At -12 with pushback it is the punish that actually reaches.",
    },
    {
      id: "hwo-q-14",
      prompt: "-14",
      situation: "You blocked a move that leaves them at -14.",
      options: ["b+2", "df+2", "1,2", "b+3"],
      correctIndex: 0,
      explain:
        "b+2 is i14. df+2 is i15~16 and does not reach here — taking the guaranteed elbow beats missing the launcher.",
    },
    {
      id: "hwo-q-16",
      prompt: "-16",
      situation: "A heavily punishable move, blocked.",
      options: ["df+2", "b+2", "4", "f+4"],
      correctIndex: 0,
      explain:
        "df+2 is i15~16 and launches for +34a. At -16 it reaches even on the slow frame, so this is where a block turns into a combo.",
    },
    {
      id: "hwo-q-low",
      prompt: "LOW BLOCKED",
      situation: "You blocked a low and are still crouching.",
      options: ["ws4", "1,2", "db+4", "d+1"],
      correctIndex: 0,
      explain:
        "ws4 is i11~12 out of crouch and only -3 on block. Blocking a low should always cost them something.",
    },
    {
      id: "hwo-q-low-big",
      prompt: "LOW BLOCKED, -16",
      situation: "You blocked a committal low that leaves them badly minus.",
      options: ["ws3", "ws4", "d+1", "4"],
      correctIndex: 0,
      explain:
        "Iron Heel is i14~16 with +14c on hit. Against a launch-punishable low, take the bigger crouch punish rather than the safe one.",
    },
    {
      id: "hwo-q-whiff",
      prompt: "WHIFF",
      situation: "You backdashed and their move whiffed in front of you.",
      options: ["b+3", "df+1", "db+4", "1,2"],
      correctIndex: 0,
      explain:
        "b+3 launches for +35a. It is -19 on block, which is why a whiff — where there is nothing to block — is the right place to use it.",
    },
    {
      id: "hwo-q-13-crouch",
      prompt: "-13, CROUCHING",
      situation: "You blocked a low that leaves them at -13.",
      options: ["ws1", "ws3", "1,2", "b+2"],
      correctIndex: 0,
      explain:
        "ws1 is i12~13, so it reaches at -13 where ws3 (i14~16) does not. Take the punish that lands over the one that looks bigger.",
    },
    {
      id: "hwo-q-ducked",
      prompt: "DUCKED",
      situation: "Your f+4 whiffed straight over a crouching opponent.",
      options: ["f,F+3", "Cheap Shot", "LFS.4", "4"],
      correctIndex: 0,
      explain:
        "f,F+3 is a mid at +6 on block. The others are all highs — repeating a high into a crouch is how the pressure stops working.",
    },
    {
      id: "hwo-q-whiff-low",
      prompt: "WHIFFED LOW",
      situation: "They whiffed a low and are recovering in front of you.",
      options: ["b+3", "ws4", "4", "df+2"],
      correctIndex: 0,
      explain:
        "A whiff gives you far more time than any blocked move. b+3 launches for +35a — its -19 on block never applies, because there is nothing to block.",
    },
  ],
};
