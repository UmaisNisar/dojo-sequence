import type { Character } from "@/types";

/**
 * Victor Chevalier — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Every frame number quoted here comes from `victor.frames.json`, which is
 * diffed against Wavu Wiki by `npm run verify:frames`. Where a startup is a
 * range (i15~16), punishment items quote the slower end — a punish that only
 * works on the lucky frame is not a punish.
 *
 * He is the first character in this app that Wavu calls ACCESSIBLE: "very low
 * execution requirements as well as an overall very simple gameplan". After
 * Devil Jin, whose wavedash Wavu rates dexterity 4 and whose electric it rates
 * 5, that is a genuine difference and the curriculum leans into it — there is
 * no execution stage here, because he does not need one.
 *
 * What he has instead is a counter-hit arsenal Wavu describes as among the
 * fastest, safest and most effective in the game, and two stances he enters at
 * ADVANTAGE off his own punishers. So the shape is: learn the safe buttons,
 * learn what counter-hits, then learn that every punish is also a stance entry.
 *
 * His weaknesses are equally plain and are stated where they matter: poor
 * tracking, lacklustre lows, and "Old Man Recovery" — high recovery that makes
 * him easy to whiff punish back.
 */
export const victor: Character = {
  id: "victor",
  name: "Victor Chevalier",
  style: "Polyvalent CQC",
  tagline:
    "A katana, two stances entered at plus, and the least execution tax on the roster.",
  available: true,
  accent: { base: "#818cf8", bright: "#c7d2fe", deep: "#4338ca" },
  stages: [
    /* ---------------------------------------------------------------- */
    /* STAGE 01 — MOVEMENT & THE APPROACH                               */
    /* ---------------------------------------------------------------- */
    {
      id: "movement",
      number: 1,
      name: "Movement & the Approach",
      focus: "Strong neutral, and one button that starts everything",
      description:
        "Wavu lists Strong Neutral as a strength: excellent approach tools, safe mids, good keepout. It also lists Poor Tracking as a weakness — most of his key moves are steppable, so the movement you learn here is as much about avoiding a sidestep as covering ground. The stage ends on f,f,F+2, which Wavu singles out as the move that simply forces an Iai mixup on the opponent.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closing distance. His approach tools are genuinely good, so getting to the range where they work is most of the job.",
          whenToUse:
            "Constantly. His best buttons live at mid range, not in your opponent's face.",
          leverlessTip:
            "Two forward taps with a clean release. Nothing here is execution-heavy — Wavu rates his whole kit low on that axis.",
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
            "The retreat, and the one that matters most for him. Wavu calls his recovery high overall — 'Old Man Recovery' — which makes him easy to whiff punish, so getting out cleanly is worth more than usual.",
          whenToUse:
            "After anything committal. Assume the opponent is looking for your recovery, because Wavu says they should be.",
          leverlessTip:
            "b,b then db, then b again. Leverless handles the db cancel with a second finger rather than a wrist roll.",
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
          name: "Sidestep — and Being Stepped",
          notation: "u_d",
          purpose:
            "Two jobs. Stepping wins you whiffs, and knowing that YOUR moves get stepped is the other half — Wavu lists poor tracking as his headline weakness.",
          whenToUse:
            "Step to create whiff punishes. Then check which of your own buttons keep missing a stepping opponent, because most of the good ones do.",
          leverlessTip:
            "A tap, not a hold. SS.1+2 is your reward for stepping, at i18~19 for +15 (+5).",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Step a linear string and punish the whiff.",
          },
          difficulty: "medium",
          tags: ["movement", "defense"],
          moveKeys: ["ss1plus2"],
        },
        {
          id: "advancing-mid",
          stageId: "movement",
          name: "Asterism of Virtue",
          notation: "f,f,F+2",
          purpose:
            "An advancing mid that is +2 ON BLOCK, +8cg on hit and +61a (+45a) on counter-hit — and it enters Iai stance with advantage either way. Wavu says this is how Victor simply forces an Iai mixup on his opponent.",
          whenToUse:
            "As your primary approach. It closes distance, it is plus, and it puts you in the stance you actually want to be in.",
          leverlessTip:
            "A run input into 2 — three forward taps, the last held. There is nothing frame-tight about it, which is the point.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Approach with f,f,F+2 and continue from Iai.",
          },
          difficulty: "medium",
          tags: ["approach", "plus on block", "stance", "signature"],
          moveKeys: ["fff2"],
        },
        {
          id: "advancing-low",
          stageId: "movement",
          name: "Tear Drop Cut",
          notation: "f,f,F+1+2",
          purpose:
            "The low at the same speed as the advancing mid, entering Iai at +4 on hit. Two moves that look identical on approach and hit at different heights is the closest thing he has to a genuine 50/50.",
          whenToUse:
            "Against someone standing to block f,f,F+2. It is -14 on block, so it is the guess you take when they have stopped guessing.",
          leverlessTip:
            "Same run, both punches. Wavu calls it a weapon low of similar speed to the mid — that similarity is the whole mixup.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Mix f,f,F+2 and f,f,F+1+2 from the same approach.",
          },
          difficulty: "medium",
          tags: ["approach", "low", "stance"],
          moveKeys: ["fff1plus2"],
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
      focus: "Safe mids that actually stay safe",
      description:
        "Wavu's summary is 'a good selection of solid pokes' with the caveat that they are not the most rewarding. That is a fair trade and an unusually comfortable place to start: df+1 at -2 is safer than most characters' equivalent, and b+2 is an i10 high. The reward comes later, from counter-hits and stances, not from the pokes themselves.",
      items: [
        {
          id: "df1",
          stageId: "pokes",
          name: "The Mid Check",
          notation: "df+1",
          purpose:
            "i13~14 mid at -2 on block and +4 on hit. Two frames negative is close to free — most characters' mid check is -6 or worse.",
          whenToUse:
            "Constantly. This is the button you press when you want to do something and not lose your turn for it.",
          leverlessTip:
            "Roll into df from d. The df+1,1 extension is -4 and +7 on hit, so the string is safe too.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Check with df+1 and hold your ground.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke", "safe"],
          moveKeys: ["df1", "df1-1"],
        },
        {
          id: "jab",
          stageId: "pokes",
          name: "Jab",
          notation: "1",
          purpose:
            "i10, +1 on block, +8 on hit. Standard, and the entry to the 1,1,2 string that is both his i10 punish and a stance entry.",
          whenToUse: "Interrupting, checking, and starting punishment.",
          leverlessTip:
            "One tap. Learn 1,1,2 alongside it — Stage 4 uses the same string as a punish.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Jab, then continue into 1,1,2 on hit.",
          },
          difficulty: "easy",
          tags: ["i10", "poke"],
          moveKeys: ["jab", "jab-1-2"],
        },
        {
          id: "b2",
          stageId: "pokes",
          name: "Strobing Memories",
          notation: "b+2",
          purpose:
            "An i10 HIGH at -6 on block, +5 on hit and +14 on counter-hit. i10 highs are rare and this one is a genuine interrupt.",
          whenToUse:
            "To interrupt when a jab is not fast enough to matter. It is a high, so a crouching opponent beats it outright.",
          leverlessTip:
            "b then 2. It is also available from Perfumer as PRF.b+2 with identical frames.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Interrupt a gap with b+2 and note the counter-hit.",
          },
          difficulty: "easy",
          tags: ["i10", "high", "counter-hit"],
          moveKeys: ["b2", "prf-b2"],
        },
        {
          id: "df4",
          stageId: "pokes",
          name: "Selfish Miranda",
          notation: "df+4,2",
          purpose:
            "df+4 is an i13~14 mid; the df+4,2 string is only -3 on block and +4 on hit. It is also his -13 punish and the opening of nearly every combo route.",
          whenToUse:
            "As a poke that stays safe, as a punish, and as combo filler. Few buttons in this app do all three.",
          leverlessTip:
            "Learning this string early pays three times over — Stage 4 and Stage 5 both assume it.",
          drill: {
            type: "total-reps",
            target: 25,
            rep: "Poke with df+4,2 and stay safe on block.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "safe", "combo filler"],
          moveKeys: ["df4", "df4-2"],
        },
        {
          id: "b4",
          stageId: "pokes",
          name: "Cordial Circuit",
          notation: "b+4",
          purpose:
            "i18~19 high at -2 on block and +14 on hit. Slow for a poke, but +14 on hit is a large reward and -2 is almost free.",
          whenToUse:
            "At range where the high will not be ducked on reaction, and to end a sequence without going minus.",
          leverlessTip:
            "Also available as PRF.4 with the same frames — the stance does not cost you this button.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land b+4 and press a fast mid to enforce the +14.",
          },
          difficulty: "easy",
          tags: ["high", "safe", "poke"],
          moveKeys: ["b4", "prf-4"],
        },
        {
          id: "ws4",
          stageId: "pokes",
          name: "Praise Smash",
          notation: "ws4",
          purpose:
            "i11~12 while-standing mid at -6 on block and +5 on hit. Wavu's listed crouching mid check and his -11 crouch punish.",
          whenToUse: "Every time you come out of a crouch.",
          leverlessTip:
            "Release down and press 4. Nothing subtle — the release is instant on a leverless.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Block a low, then punish with ws4.",
          },
          difficulty: "easy",
          tags: ["i11", "mid", "while standing"],
          moveKeys: ["ws4"],
        },
        {
          id: "keepout",
          stageId: "pokes",
          name: "Keepout",
          notation: "f+1+2 · d+2",
          purpose:
            "f+1+2 is +3 on block; d+2 is +0. Both are Heat Engagers, and Wavu lists good keepout tools among his neutral strengths.",
          whenToUse:
            "To stop an approach without committing. Being non-negative on block means a blocked keepout still leaves you in the exchange.",
          leverlessTip:
            "d+2 replaces the generic d+2 slot for him — Wavu notes his d+2 is remapped to db+2. Check which one your muscle memory is producing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Stop an approach with f+1+2 or d+2 and keep your turn.",
          },
          difficulty: "medium",
          tags: ["keepout", "heat engager", "plus on block"],
          moveKeys: ["f1plus2", "d2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 03 — THE COUNTER-HIT ARSENAL                               */
    /* ---------------------------------------------------------------- */
    {
      id: "counterhits",
      number: 3,
      name: "The Counter-Hit Arsenal",
      focus: "His best category, by Wavu's own ranking",
      description:
        "Wavu's first listed strength is a counter-hit arsenal it calls among the fastest, safest and most effective in the entire game. This is where his damage actually comes from — the pokes are safe but unrewarding, so the round is won by catching a button. Learn what each of these turns into when it counter-hits, because on normal hit most of them are unremarkable.",
      items: [
        {
          id: "eden",
          stageId: "counterhits",
          name: "Eden",
          notation: "1+2",
          purpose:
            "i15 mid, -9 on block, an unremarkable +4 on hit — and +46a on COUNTER-HIT. Wavu lists it as his i15 standing counter-hit launcher.",
          whenToUse:
            "Against someone who presses after your turn ends. On normal hit you have gained almost nothing, which is the trade.",
          leverlessTip:
            "Both punches. It is -9 on block, so a wrong read costs you the turn but not the round.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Counter-hit with 1+2 and convert the launch.",
          },
          difficulty: "medium",
          tags: ["i15", "counter-hit", "launcher"],
          moveKeys: ["one-plus-two"],
        },
        {
          id: "ws2",
          stageId: "counterhits",
          name: "Baguette Cut",
          notation: "ws2",
          purpose:
            "i14~15 while-standing mid, only -8 on block, +6 on hit and +35a (+25) on counter-hit. Wavu's i14 crouching counter-hit launcher.",
          whenToUse:
            "Rising from a crouch against someone pressing. Being -8 makes it far safer to guess with than most counter-hit launchers.",
          leverlessTip:
            "Release down into 2. It comes up constantly because Victor spends real time crouching between pokes.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Counter-hit out of crouch with ws2 and convert.",
          },
          difficulty: "medium",
          tags: ["i14", "counter-hit", "launcher", "while standing"],
          moveKeys: ["ws2"],
        },
        {
          id: "b1-confirm",
          stageId: "counterhits",
          name: "The b+1,2 Confirm",
          notation: "b+1,2",
          purpose:
            "Wavu rates this as its own technique — importance 3, dexterity 2, RHYTHM 0. It is a read-and-react skill, not an execution one: confirm whether b+1 counter-hit and finish accordingly.",
          whenToUse:
            "As a check that becomes a throw on the right confirm. The string also enters Perfumer, which is why Wavu mentions it as a stance entry too.",
          leverlessTip:
            "Rhythm 0 means there is no timing to learn — the whole skill is watching the hit and deciding. Practise with the opponent set to random block.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Confirm b+1 and take the correct follow-up.",
          },
          difficulty: "medium",
          tags: ["counter-hit", "confirm", "stance"],
          moveKeys: ["b1", "b1-2"],
        },
        {
          id: "db3",
          stageId: "counterhits",
          name: "Polite Greetings",
          notation: "db+3",
          purpose:
            "An i19~20 HIGH that launches for +67a (+51a) — his single biggest hit outside a counter-hit read, at only -11 on block.",
          whenToUse:
            "Against someone standing and blocking. Crouching beats it outright, which is what the lows in Stage 7 are for.",
          leverlessTip:
            "db then 3. Wavu's combo list builds a 45-damage instant-Tornado route from a counter-hit one.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with db+3 and complete the route.",
          },
          difficulty: "medium",
          tags: ["launcher", "high"],
          moveKeys: ["db3"],
        },
        {
          id: "db4",
          stageId: "counterhits",
          name: "Welcome Sweep",
          notation: "db+4",
          purpose:
            "The shadow cutter: an i20~21 low at +4c on hit and +49a on counter-hit. It is -26 on block, which is a full launch against you.",
          whenToUse:
            "As a hard read only. This is the shape of most of his lows — real reward, real risk, per Wavu's own weakness list.",
          leverlessTip:
            "The counter-hit launch is what justifies the -26. On normal hit you have spent a lot for +4c.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Counter-hit a pressing opponent with db+4.",
          },
          difficulty: "hard",
          tags: ["low", "counter-hit", "launch punishable"],
          moveKeys: ["db4"],
        },
        {
          id: "charged-ub2",
          stageId: "counterhits",
          name: "Fancy Cut, charged",
          notation: "ub+2*",
          purpose:
            "Held, it becomes +3 on block, +32a on hit and +66a (+50) on counter-hit. A launcher that is PLUS when blocked is unusual enough to build a gameplan around.",
          whenToUse:
            "When you have the time to charge it — after a knockdown, or at range. Uncharged ub+2 is i17~18 and -5, which is the version you throw when you do not.",
          leverlessTip:
            "Hold the button. The charge is the only thing to learn and there is no window to miss.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Charge ub+2 and land it on block, then press again.",
          },
          difficulty: "medium",
          tags: ["launcher", "plus on block", "counter-hit"],
          moveKeys: ["ub2", "ub2-charged"],
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
      focus: "Every punish is also a stance entry",
      description:
        "Wavu lists Punishing as a strength — remarkable block and whiff punishment, consistent damaging combos, and some of the best wall carry in the roster. The thing that makes his ladder different is what it leaves behind: Wavu notes his stances are often entered with frame advantage via his punishers, specifically 1,1,2 at i10 and uf+1,1 at i13. A blocked move does not just cost the opponent damage, it puts you in stance on top of them.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "Standing -10",
          notation: "1,1,2",
          purpose:
            "The i10 punish, and one of the two stance entries Wavu calls out by name. Small damage, but it ends with you in position.",
          whenToUse: "Anything blocked at -10 or -11.",
          leverlessTip:
            "Three taps during blockstun. The value is the stance, not the 22 damage.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 1,1,2 and continue from stance.",
          },
          difficulty: "easy",
          tags: ["punish", "i10", "stance"],
          moveKeys: ["jab-1-2"],
        },
        {
          id: "punish-12",
          stageId: "punishment",
          name: "Standing -12",
          notation: "2,2,2",
          purpose:
            "i12 for 32 damage at only -3 on block. 2,1 and 3,1+2 also reach at -12; this is the one that hits hardest.",
          whenToUse:
            "Anything blocked at -12. Take 2,1 instead if you want to stay closest to neutral.",
          leverlessTip:
            "Three taps of the right punch. At -3 a mistimed one barely costs you anything.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -12 move with 2,2,2.",
          },
          difficulty: "easy",
          tags: ["punish", "i12"],
          moveKeys: ["right-2-2", "right-1", "three-1plus2"],
        },
        {
          id: "punish-13",
          stageId: "punishment",
          name: "Standing -13 — the Wall Splat",
          notation: "uf+1,1",
          purpose:
            "Wavu's listed i13 wall splat, +15gc on hit and the second of his two named stance entries. It is -14 on block, so it belongs in punishment.",
          whenToUse:
            "At -13 near a wall, where the splat is worth more than anything else on the ladder.",
          leverlessTip:
            "uf+1 then 1. Away from a wall, df+4,2 is the safer -13 — this one is the wall answer.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Wall splat a -13 move with uf+1,1 and convert.",
          },
          difficulty: "medium",
          tags: ["punish", "i13", "wall splat", "stance"],
          moveKeys: ["uf1", "uf1-1"],
        },
        {
          id: "punish-13-safe",
          stageId: "punishment",
          name: "Standing -13 — the Safe One",
          notation: "df+4,2",
          purpose:
            "31 damage at -3 on block. Away from a wall this is the -13 you take, because a mistimed uf+1,1 is -14 and this is not.",
          whenToUse:
            "At -13 mid-screen, and any time you are not certain the punish will connect.",
          leverlessTip:
            "The same string you already poke with. Punishment for this character is largely buttons you throw anyway.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -13 move with df+4,2 mid-screen.",
          },
          difficulty: "easy",
          tags: ["punish", "i13", "safe"],
          moveKeys: ["df4-2"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "Standing -14",
          notation: "f+4,1",
          purpose:
            "i14 for +18a (+9) at -4 on block, and a Heat Engager. Wavu lists f+4,1 among his five engagers, so this punish buys Heat as well as damage.",
          whenToUse: "Anything blocked at -14.",
          leverlessTip:
            "f+4 then 1. At -4 it is one of the safest punishes on the ladder if you mistime it.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -14 move with f+4,1 and note the Heat gain.",
          },
          difficulty: "easy",
          tags: ["punish", "i14", "heat engager"],
          moveKeys: ["f4", "f4-1"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "Standing -15 — the Launch",
          notation: "df+2",
          purpose:
            "Arcadia, i15~16 for +31a (+21). Wavu's listed i15 standing launcher and the start of his best combo routes.",
          whenToUse:
            "Anything blocked at -15 or worse. At -14 on block it is a real commitment outside punishment.",
          leverlessTip:
            "The same df diagonal as your mid check. Convert it — the launch is worth 55+ with the routes in Stage 5.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with df+2 and complete the bread and butter.",
          },
          difficulty: "medium",
          tags: ["punish", "i15", "launcher"],
          moveKeys: ["df2"],
        },
        {
          id: "punish-17",
          stageId: "punishment",
          name: "Standing -17",
          notation: "b+3,1",
          purpose:
            "Caval, 40 damage for +21a (+16). The biggest thing on the standing ladder.",
          whenToUse: "Anything blocked at -17 or worse.",
          leverlessTip:
            "b+3 then 1. The string is -13 on block, so it is a punish rather than a poke.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish a -17 move with b+3,1 and convert.",
          },
          difficulty: "medium",
          tags: ["punish", "i17"],
          moveKeys: ["b3", "b3-1"],
        },
        {
          id: "punish-crouch",
          stageId: "punishment",
          name: "Punishing from Crouch",
          notation: "ws4 · ws1+2 · ws1",
          purpose:
            "ws4 at -11, ws1+2 at -13 for +8, and Oval Cut at -15 — i15~16 for +53a. The crouching ladder ends in a full launch.",
          whenToUse:
            "Every blocked low. ws1 is -16 on block, so it is strictly a punish and never a guess.",
          leverlessTip:
            "All three are a release of down into a button. uf+1,1 also reaches at -13 from crouch if the wall is behind them.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["punish", "while standing", "launcher"],
          moveKeys: ["ws4", "ws1plus2", "ws1"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 05 — CORE COMBOS & THE WALL                                */
    /* ---------------------------------------------------------------- */
    {
      id: "combos",
      number: 5,
      name: "Core Combos & the Wall",
      focus: "One route, and some of the best carry in the game",
      description:
        "Wavu credits him with consistent damaging combos and some of the best wall carry in the roster, and the routes bear that out: one shape, repeated, that travels. It runs df+4,2 into Iai, Iai into Perfumer, Perfumer back into Iai — the stances are the combo, which is why they are worth the stage that follows.",
      items: [
        {
          id: "bnb",
          stageId: "combos",
          name: "The Bread and Butter",
          notation: "df+4,2 IAI.4,2 db+1,1~F PRF.2,2 IAI.2 T! b+3,1",
          purpose:
            "The route off df+2, f,F+2, ws1 or a counter-hit 1+2. Wavu's staples list it in the mid fifties.",
          whenToUse: "Every standard launch.",
          leverlessTip:
            "The ~F after db+1,1 is a cancel into Perfumer, not a dash. Learn that one transition and the rest is buttons you already know.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch with df+2 and complete the route without dropping.",
          },
          difficulty: "hard",
          tags: ["combo", "bread and butter"],
          moveKeys: ["df2", "df4-2", "iai-4-2", "db1-1", "prf-2-2", "iai-2"],
        },
        {
          id: "instant-tornado",
          stageId: "combos",
          name: "Instant Tornado Route",
          notation: "T! df+4,2 IAI.4,2 db+1,1~F PRF.2,2 IAI.2",
          purpose:
            "The same route, reordered, for a launch that spends the Tornado up front — a low parry or a counter-hit db+3.",
          whenToUse: "After low parries and instant-Tornado launchers.",
          leverlessTip:
            "Identical pieces in a different order. Learning the shape once covers both.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Low parry and complete the instant-Tornado route.",
          },
          difficulty: "hard",
          tags: ["combo", "tornado"],
          moveKeys: ["db3", "df4-2", "iai-4-2", "prf-2-2"],
        },
        {
          id: "carry",
          stageId: "combos",
          name: "Wall Carry",
          notation: "… IAI.2 T! …",
          purpose:
            "Wavu rates his carry among the best in the roster. Most mid-screen launches reach a wall, which changes what a launch is worth.",
          whenToUse:
            "Whenever there is a wall in the direction you are facing — which, with this much carry, is most of the time.",
          leverlessTip:
            "Wavu notes an early Tornado makes it easier to adjust for carry. If the wall is close, spend it sooner.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Carry a mid-screen launch to the wall.",
          },
          difficulty: "hard",
          tags: ["combo", "wall"],
          moveKeys: ["iai-2", "ff2"],
        },
        {
          id: "wall-ender",
          stageId: "combos",
          name: "At the Wall",
          notation: "W! f,F+2 T! 4,3,2",
          purpose:
            "The wall combo. Wavu's wall list opens with f,F+2 into Tornado, and the Iai wall routes are what set up the okizeme in the next item.",
          whenToUse: "Every wall splat.",
          leverlessTip:
            "Wall combos are where his damage stops being ordinary. Drill one route rather than collecting five.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Splat and complete the wall combo.",
          },
          difficulty: "hard",
          tags: ["combo", "wall"],
          moveKeys: ["ff2", "four-3-2"],
        },
        {
          id: "wall-oki",
          stageId: "combos",
          name: "Iai Wall Okizeme",
          notation: "… H.IAI.d+2",
          purpose:
            "Wavu calls this out specifically: at the wall, Iai grants him some of the strongest okizeme and wall pressure in the game, especially during Heat. H.IAI.d+2 is +5 on block and +20 (+2) on hit.",
          whenToUse:
            "After a wall combo in Heat. This is the situation the whole gameplan is trying to reach.",
          leverlessTip:
            "The Heat version of IAI.d+2 gains hits and frames. Out of Heat the same move is +4 on block and still worth having.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Finish a wall combo and set up Iai pressure.",
          },
          difficulty: "expert",
          tags: ["wall", "oki", "heat", "stance"],
          moveKeys: ["iai-d2", "heat-iai-d2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 06 — IAI & PERFUMER                                        */
    /* ---------------------------------------------------------------- */
    {
      id: "stances",
      number: 6,
      name: "Iai & Perfumer",
      focus: "Two stances you are already standing in",
      description:
        "By now you have entered both stances dozens of times without studying them: 1,1,2 and uf+1,1 lead into them from punishment, b+1,2 and f,f,F+2 from pressure, and the bread and butter passes through both. This stage is about what to press once you are there. Wavu also notes that manually entering Perfumer with f+3 carries punch parry frames — the stance is a defensive option as well as an offensive one.",
      items: [
        {
          id: "iai-entry",
          stageId: "stances",
          name: "Iai Stance",
          notation: "3+4",
          purpose:
            "The katana stance. Wavu lists it as the source of his strongest okizeme and wall pressure, and its moves are where his sword range and chip damage live.",
          whenToUse:
            "Mostly by arriving there — from f,f,F+2 at +2, from 1,1,2, from uf+1,1. A raw 3+4 is the slowest way in.",
          leverlessTip:
            "Both kicks. Entering at advantage matters more than entering fast, which is why the approach and punishment stages came first.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Reach Iai from three different entries.",
          },
          difficulty: "easy",
          tags: ["stance"],
          moveKeys: ["iai-1", "iai-2"],
        },
        {
          id: "iai-mids",
          stageId: "stances",
          name: "Almace & Murgleys",
          notation: "IAI.2 · IAI.4,2",
          purpose:
            "IAI.2 is i16~17 at -9 for +15 (+5), +26a on counter-hit. IAI.4,2 is a low into a high, -5 on block, +26 (+0) on hit and +55a (+35a) on counter-hit.",
          whenToUse:
            "IAI.2 as the mid, IAI.4,2 as the low. Both are also core combo filler, so they get drilled either way.",
          leverlessTip:
            "IAI.4 alone is -12; the string is -5. Finish it unless you are hit-confirming deliberately.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix IAI.2 and IAI.4,2 from stance.",
          },
          difficulty: "medium",
          tags: ["stance", "mixup"],
          moveKeys: ["iai-2", "iai-4", "iai-4-2"],
        },
        {
          id: "iai-heat-engager",
          stageId: "stances",
          name: "Passelande",
          notation: "IAI.d+1",
          purpose:
            "i18 from stance at ZERO on block and +24a (+9) on hit — it launches. A launcher that is neutral on block is the best button in the stance.",
          whenToUse:
            "From Iai against anyone. Being ±0 means there is no reason not to, and it is a Heat Engager.",
          leverlessTip:
            "d then 1 from the stance. Wavu lists it among his five Heat Engagers.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Launch from Iai with IAI.d+1 and convert.",
          },
          difficulty: "medium",
          tags: ["stance", "launcher", "heat engager"],
          moveKeys: ["iai-d1"],
        },
        {
          id: "iai-power-low",
          stageId: "stances",
          name: "Espee Aventureuse",
          notation: "IAI.d+1+2",
          purpose:
            "Wavu's listed power low. It is -29 on block, which is among the worst block values in the game, and only -3 on hit.",
          whenToUse:
            "Almost never on reaction — as a hard read, once, against someone who has stopped ducking. The risk is enormous and Wavu's low-attack weakness note covers exactly this.",
          leverlessTip:
            "Know the -29 before you press it. There is no version of this move that is safe.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land IAI.d+1+2 as a read, and note what a blocked one costs.",
          },
          difficulty: "hard",
          tags: ["stance", "low", "launch punishable"],
          moveKeys: ["iai-d1plus2"],
        },
        {
          id: "iai-parry",
          stageId: "stances",
          name: "The Iai Low Parry",
          notation: "IAI.f → Gwen",
          purpose:
            "Wavu lists IAI.f as a stance low parry. A successful one leads to Gwen at +60a (+44) — the biggest single payoff in his kit.",
          whenToUse:
            "In stance against a predictable low. It is a read, and the reward for getting it right is a full combo.",
          leverlessTip:
            "Forward from Iai. Being in stance already is the requirement, which is another reason to enter it from punishes.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Low parry from Iai and convert Gwen.",
          },
          difficulty: "hard",
          tags: ["stance", "parry", "defense"],
          moveKeys: ["iai-parry"],
        },
        {
          id: "prf-entry",
          stageId: "stances",
          name: "Perfumer",
          notation: "f+3",
          purpose:
            "The second stance, and a defensive option: Wavu notes that entering it manually with f+3 carries punch parry frames.",
          whenToUse:
            "From b+1,2 during pressure, from the combo route, and manually when you expect a punch.",
          leverlessTip:
            "f+3. The parry frames only apply to the manual entry — arriving from a string does not give them to you.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Perfumer manually and parry a punch.",
          },
          difficulty: "medium",
          tags: ["stance", "parry", "defense"],
          moveKeys: ["prf-2", "prf-b2"],
        },
        {
          id: "prf-mixup",
          stageId: "stances",
          name: "Perfumer Pressure",
          notation: "PRF.2,2 · PRF.1 · PRF.3",
          purpose:
            "PRF.2,2 is -4 into Iai on block and +5 into Iai on hit — it hands you the other stance either way. PRF.1 is the low; PRF.3 is a Heat Engager at -8.",
          whenToUse:
            "From Perfumer, as a loop into Iai. The two stances feed each other, which is what the combo route is doing.",
          leverlessTip:
            "PRF.2,2 leaving you in Iai on BLOCK is the piece that makes the loop work — you are not punished for being blocked, you are relocated.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Loop Perfumer into Iai with PRF.2,2 and continue.",
          },
          difficulty: "medium",
          tags: ["stance", "pressure", "heat engager"],
          moveKeys: ["prf-2-2", "prf-1", "prf-3"],
        },
        {
          id: "prf-plus",
          stageId: "stances",
          name: "Hengroen",
          notation: "PRF.1+2",
          purpose:
            "+6 on block and +14a on hit. Slow at i25~27, but blocking it correctly still leaves the opponent losing the exchange.",
          whenToUse:
            "From Perfumer against someone frozen. At i25~27 it needs them to have stopped pressing first.",
          leverlessTip:
            "Both punches from the stance. Pair it with PRF.1 so standing still is not the right answer.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land PRF.1+2 on block and press again.",
          },
          difficulty: "medium",
          tags: ["stance", "plus on block"],
          moveKeys: ["prf-1plus2"],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* STAGE 07 — LOWS & THE TRACKING PROBLEM                           */
    /* ---------------------------------------------------------------- */
    {
      id: "lows",
      number: 7,
      name: "Lows & the Tracking Problem",
      focus: "Two weaknesses that shape every round",
      description:
        "Wavu names both plainly. His lows are mostly not rewarding enough to match the risk, and the ones that are — db+4, IAI.d+1+2 — are launch punishable on block. Separately, most of his key moves have poor tracking, so an aware opponent simply steps them. Neither gets fixed. This stage is about knowing which low you are spending and noticing when you are being stepped.",
      items: [
        {
          id: "chip-lows",
          stageId: "lows",
          name: "The Chip Lows",
          notation: "d+3 · d+4 · 1,3",
          purpose:
            "d+3 and d+4 are i16~19 lows at -13 for a couple of points. The 1,3 string is -12. None of them is a threat; they exist so that standing and blocking is not free.",
          whenToUse:
            "Sparingly, to make ducking a thought. Wavu's assessment is that the reward does not match the risk, and it does not.",
          leverlessTip:
            "Note that d+1, d+3 and d+4 are all listed as missing generics for him — his versions are their own moves, not the standard ones.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Mix a chip low into a poke sequence without becoming readable.",
          },
          difficulty: "easy",
          tags: ["low", "poke"],
          moveKeys: ["d3", "d4", "jab-3"],
        },
        {
          id: "real-lows",
          stageId: "lows",
          name: "The Lows That Hurt",
          notation: "db+4 · IAI.d+1+2",
          purpose:
            "db+4 is +49a on counter-hit and -26 on block. IAI.d+1+2 is his power low and -29. Both are worth real damage and both lose the round when blocked.",
          whenToUse:
            "As a spent resource, once or twice a match, against someone who has demonstrably stopped ducking.",
          leverlessTip:
            "Decide the budget before the round starts. Wavu's weakness list is explicit that the rewarding lows are launch punishable.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land a real low as a read and note the block punishment you avoided.",
          },
          difficulty: "hard",
          tags: ["low", "launch punishable"],
          moveKeys: ["db4", "iai-d1plus2"],
        },
        {
          id: "low-throws",
          stageId: "lows",
          name: "The Counter-Hit Low Throws",
          notation: "CH.d+4 · CH.db+4",
          purpose:
            "Guilty Mariko and Musk-Scented Natasha — low throws that only exist on counter-hit. They turn a low that connected as a counter-hit into something much larger.",
          whenToUse:
            "They are not a separate decision; they are what your lows become when they catch a button.",
          leverlessTip:
            "Nothing extra to press. Knowing they exist changes how much a counter-hit low is worth to you.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Counter-hit with a low and observe the throw follow-up.",
          },
          difficulty: "medium",
          tags: ["low", "counter-hit", "throw"],
          moveKeys: ["ch-d4", "ch-db4"],
        },
        {
          id: "tracking",
          stageId: "lows",
          name: "Being Stepped",
          notation: "—",
          purpose:
            "Wavu's first listed weakness: most of his key moves have pretty bad tracking, requiring good timing and movement against aware opponents.",
          whenToUse:
            "Every time an opponent starts stepping. The answer is not a different button, it is timing and positioning.",
          leverlessTip:
            "Learn which of your buttons whiff against a step by recording one in training mode. It will be more of them than you expect.",
          drill: {
            type: "manual",
            checklist: [
              "Record a sidestep and check which of your pokes whiff.",
              "f,f,F+2 advances, which helps — but it is still steppable.",
              "A stepped move plus his high recovery is a free launch for them.",
              "Reposition with movement rather than reaching for a homing move.",
              "Against a stepping opponent, punish the step rather than the button.",
            ],
          },
          difficulty: "hard",
          tags: ["concept", "weakness"],
          moveKeys: ["fff2", "df1"],
        },
        {
          id: "recovery",
          stageId: "lows",
          name: "Old Man Recovery",
          notation: "—",
          purpose:
            "Wavu's own heading. His recovery is high overall, which makes whiff punishment much easier for the opponent. A whiffed Victor move is worth more to them than a whiffed anything else.",
          whenToUse:
            "As a constraint on everything else. This is the reason to poke with df+1 rather than reach with f,F+2.",
          leverlessTip:
            "The fix is range discipline, not execution. Throw the big buttons when you know they will connect.",
          drill: {
            type: "manual",
            checklist: [
              "f,F+2 is -16 on block and long — a whiffed one is a launch against you.",
              "u+1+2 is -20c. ws1 is -16. Both are punishes, not neutral buttons.",
              "df+1 at -2 and df+4,2 at -3 are the buttons for uncertainty.",
              "Back up before you commit, not after.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "weakness"],
          moveKeys: ["ff2", "u1plus2", "ws1"],
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
      focus: "Good options, committal ones",
      description:
        "Wavu's phrasing is exact: his defensive options are overall good, very committal, and heavily punished if the opponent is ready to call them out. The parries are real and so is the cost. Heat is where the katana becomes properly dangerous — sword moves recover Heat on hit, and several become safe or advantageous on block.",
      items: [
        {
          id: "parries",
          stageId: "gameplan",
          name: "The Two Parries",
          notation: "f+3 · IAI.f",
          purpose:
            "f+3 is a punch parry on frames 5–10 of the manual Perfumer entry; IAI.f is a low parry from Iai leading to Gwen at +60a (+44).",
          whenToUse:
            "Against a read you are confident in. Wavu calls his defensive options very committal — a parry that guesses wrong is not a neutral outcome.",
          leverlessTip:
            "Neither is hard to input. The whole skill is the read, which is the same lesson as everything else on this character.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Parry a punch with f+3 and a low from Iai.",
          },
          difficulty: "hard",
          tags: ["defense", "parry"],
          moveKeys: ["iai-parry"],
        },
        {
          id: "unparryable",
          stageId: "gameplan",
          name: "Hard to Parry",
          notation: "—",
          purpose:
            "Wavu lists Super Spy CQB as a strength: as a weapons specialist, many of Victor's moves are unparryable, and his sword attacks carry incredible range and chip damage on block.",
          whenToUse:
            "Against characters with reversals and parries. Knowing which of your moves cannot be reversed is matchup knowledge that costs you nothing to have.",
          leverlessTip:
            "Chip damage on block means a blocked sword move is still progress. That changes the maths on throwing them.",
          drill: {
            type: "manual",
            checklist: [
              "Many of his moves are unparryable — a weapon specialist trait.",
              "Sword attacks have long range and chip damage on block.",
              "In Heat, sword moves other than u+1+2, IAI.d+2 and b,b+2+3 recover Heat on hit.",
              "Against a reversal character, lean on the sword.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "matchup"],
          moveKeys: ["ff2", "iai-2", "montjoie"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat",
          notation: "2+3 · H.2+3",
          purpose:
            "Five engagers — f+4,1 · f+1+2 · d+2 · PRF.3 · IAI.d+1. In Heat u+1+2 and IAI.d+2 gain frames and hits, he gains Monsieur Samurai (H.db+1+2) at +6 on block, and sword moves recover Heat on hit. His Heat Smash is a LOW.",
          whenToUse:
            "Engage with whichever of the five the situation gives you — most of them are buttons you already press.",
          leverlessTip:
            "The Heat Smash being low is unusual and worth remembering: it beats a standing block, unlike most.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Engage Heat with each of the five engagers once.",
          },
          difficulty: "medium",
          tags: ["heat", "heat engager"],
          moveKeys: ["heat-burst", "heat-smash", "heat-monsieur", "f4-1", "iai-d1"],
        },
        {
          id: "unblockable",
          stageId: "gameplan",
          name: "Montjoie Takemikazuchi",
          notation: "b,B+2+3",
          purpose:
            "An i65~66 unblockable for 50 damage. Slow enough to react to, so it is a punish for someone frozen rather than a neutral option.",
          whenToUse:
            "On a downed opponent who is not getting up, and in the rare moments where the opponent cannot move.",
          leverlessTip:
            "Note it is one of the three sword moves that do NOT recover Heat on hit, alongside u+1+2 and IAI.d+2.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Land the unblockable on a frozen opponent.",
          },
          difficulty: "easy",
          tags: ["unblockable", "oki"],
          moveKeys: ["montjoie"],
        },
        {
          id: "rage-art",
          stageId: "gameplan",
          name: "Rage Art",
          notation: "R.df+1+2",
          purpose: "i20 armoured comeback tool, -18 on block. The usual rules.",
          whenToUse: "In Rage, when a wrong guess loses the round anyway.",
          leverlessTip: "An unused Rage Art is zero damage.",
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
          id: "gameplan-core",
          stageId: "gameplan",
          name: "The Gameplan",
          notation: "—",
          purpose:
            "Wavu calls him a Jacques of All Trades who does not stand out in any particular area, with key moves that are steppable, committal, or both. The gameplan is to be correct rather than to be fast.",
          whenToUse: "Every round.",
          leverlessTip:
            "Wavu rates his execution requirements very low and his gameplan very simple. If something feels hard, it is probably a decision rather than an input.",
          drill: {
            type: "manual",
            checklist: [
              "Approach with f,f,F+2; it is plus and puts you in Iai.",
              "Poke with df+1 and df+4,2 — safe, unrewarding, and that is fine.",
              "Your damage comes from counter-hits, not from pokes.",
              "Every punish is also a stance entry. Use the stance you arrive in.",
              "Carry to the wall; the Iai wall pressure is the strongest thing he has.",
              "Spend your real lows deliberately — both are launch punishable.",
              "Assume you are being stepped and being whiff punished, because you are.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "gameplan"],
          moveKeys: ["fff2", "df4-2", "one-plus-two"],
        },
      ],
    },
  ],

  punishQuiz: [
    {
      id: "vic-q-10",
      prompt: "-10",
      situation: "You blocked a move that leaves them at -10.",
      options: ["1,1,2", "2,2,2", "df+2", "ws4"],
      correctIndex: 0,
      explain:
        "1,1,2 is the i10 punish and one of the two stance entries Wavu names. The damage is small; the position it leaves you in is the point.",
    },
    {
      id: "vic-q-12",
      prompt: "-12",
      situation: "You blocked a move that leaves them at -12.",
      options: ["2,2,2", "1,1,2", "uf+1,1", "f+4,1"],
      correctIndex: 0,
      explain:
        "2,2,2 is i12 for 32 damage at only -3 on block. 1,1,2 reaches too but gives up a third of the damage.",
    },
    {
      id: "vic-q-13-wall",
      prompt: "-13 (at the wall)",
      situation: "You blocked a -13 move with a wall behind them.",
      options: ["uf+1,1", "df+4,2", "2,2,2", "b+3,1"],
      correctIndex: 0,
      explain:
        "uf+1,1 is Wavu's listed i13 wall splat. At the wall the splat is worth far more than the safer string.",
    },
    {
      id: "vic-q-13-safe",
      prompt: "-13 (mid-screen)",
      situation: "You blocked a -13 move with no wall in reach.",
      options: ["df+4,2", "uf+1,1", "ws1", "1,1,2"],
      correctIndex: 0,
      explain:
        "df+4,2 does 31 damage at -3 on block. uf+1,1 is -14 if you mistime it and buys you nothing without a wall.",
    },
    {
      id: "vic-q-14",
      prompt: "-14",
      situation: "You blocked a move that leaves them at -14.",
      options: ["f+4,1", "df+2", "df+4,2", "b+3,1"],
      correctIndex: 0,
      explain:
        "f+4,1 is i14 for +18a (+9) and a Heat Engager. df+2 needs -15 and would not come out in time.",
    },
    {
      id: "vic-q-15",
      prompt: "-15",
      situation: "You blocked a move that leaves them at -15.",
      options: ["df+2", "f+4,1", "2,2,2", "ws1+2"],
      correctIndex: 0,
      explain:
        "Arcadia launches for +31a (+21) and starts his best routes. This is where punishment turns into a full combo.",
    },
    {
      id: "vic-q-17",
      prompt: "-17",
      situation: "You blocked a move that leaves them at -17.",
      options: ["b+3,1", "df+2", "f+4,1", "uf+1,1"],
      correctIndex: 0,
      explain:
        "b+3,1 is 40 damage for +21a (+16) — the biggest thing on the standing ladder. df+2 still works but leaves damage behind.",
    },
    {
      id: "vic-q-crouch-11",
      prompt: "-11 (crouching)",
      situation: "You blocked a low that leaves them at -11.",
      options: ["ws4", "ws1+2", "ws1", "1,1,2"],
      correctIndex: 0,
      explain:
        "ws4 is i11~12 out of crouch. ws1+2 is i13 and does not reach; standing punishes are not available from a crouch block.",
    },
    {
      id: "vic-q-crouch-13",
      prompt: "-13 (crouching)",
      situation: "You blocked a low that leaves them at -13.",
      options: ["ws1+2", "ws4", "ws1", "df+4,2"],
      correctIndex: 0,
      explain:
        "ws1+2 is i13~14 for +8. ws1 is i15~16 and two frames short of reaching here.",
    },
    {
      id: "vic-q-crouch-15",
      prompt: "-15 (crouching)",
      situation: "You blocked a low that leaves them at -15.",
      options: ["ws1", "ws1+2", "ws4", "df+2"],
      correctIndex: 0,
      explain:
        "Oval Cut launches for +53a. It is -16 on block, so it belongs in punishment and nowhere else.",
    },
  ],
};
