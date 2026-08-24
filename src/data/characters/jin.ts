import type { Character } from "@/types";

/**
 * Jin Kazama — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki's live Cargo database
 * (wavu.wiki/t/Jin, _movelist, _punishers, _combos) and TekkenDocs,
 * August 2026. Facts baked in — each checked against the live table:
 *  - EWHF (f,n,d,df+2 just frame) is i11~12 and +5~+6 ON BLOCK. Missing the
 *    just frame gives Wind Hook Fist at -10 — that gap IS the character.
 *  - In Heat, CD.df+2 "turns into EWHF" with no just-frame input required.
 *  - Punishment is his best asset: -10 2,4 | -12 b+1,2 | -13 df+1,4 |
 *    -14 f+1+2 or f+3,1 | -15 d+3+4 (LAUNCH). Crouching: -11 ws4,4 |
 *    -13 ws1,2 | -14 ws2 (LAUNCH). Back-turned: 1,2,1.
 *  - Whiff punishers: f+4 (-8), b+2,1 (-9), 2,4 (duckable), EWHF (+5).
 *  - Stances: ZEN (Zenshin) = f+3+4 or b+3+4 · CD (Crouch Dash) = f,n,d,df
 *  - ZEN entries with F: 3,1 at +4 · b,f+2,3 at +2 · f,f,F+3 at +6 · b+3 at -2
 *  - Heat Engagers: 1+2 · df+4 · f,F+2 · f+3,1 · ZEN.2
 *  - DVS ("Awakened") is HEAT-ONLY, entered from H.db+1+2 or H.f,F+1+2.
 *  - Honest weaknesses per Wavu: sluggish backdash cancel, and the wavedash
 *    mixup plus d+2 are "somewhat reactable" — he is not a true Mishima.
 *  - Wavu rates the wavedash itself at value 0: it is a delivery mechanism
 *    for EWHF and the power low, not a reward on its own.
 */

export const jin: Character = {
  id: "jin",
  name: "Jin Kazama",
  style: "Traditional Karate",
  tagline:
    "The all-rounder. An answer for every situation, the best punishment in the game, and one just frame that decides how far you go.",
  available: true,
  accent: { base: "#4f7cff", bright: "#93b4ff", deep: "#1d4ed8" },
  electric: true,
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT & THE CROUCH DASH                        */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement & the Crouch Dash",
      focus: "Build the motion everything else runs on",
      description:
        "Jin is a Kazama-style fighter with a Mishima moveset bolted on, and the bolt is the crouch dash. Almost everything that makes him frightening — the electric, the power low, the wavedash mixup — is delivered by f,n,d,df. Learn the motion now, cleanly and slowly, because every later stage assumes it.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance and lets you block immediately after. Jin's approach is genuinely strong, so getting into range safely is most of the work.",
          whenToUse:
            "Any time you are out of range and they are not swinging. Dash, block, observe — then start pressure from where df+1 and f+4 actually reach.",
          leverlessTip:
            "Tap f twice with a full release between taps. On leverless the release IS the neutral — if the first f never lifts, the second tap does nothing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash in from round-start range and return to block without getting hit.",
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
            "Creates space and makes attacks whiff. Jin has three excellent whiff punishers waiting — f+4, b+2,1, and the electric — so a whiff in front of you is real damage.",
          whenToUse:
            "After blocking a string that ends close, or when you expect a swing. Backdash, watch it miss, punish.",
          leverlessTip:
            "Full release between the two b presses, same rule as the forward dash.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash so the CPU's jab whiffs cleanly in front of you.",
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
            "Chained backdash cancels. Be warned: Wavu lists Jin as one of the few characters with a genuinely bad backdash cancel, so you will not outrun anyone with this. You use it to hold a range band, not to escape.",
          whenToUse:
            "Between exchanges, to sit where f+4 and standing 4 reach and their pokes do not.",
          leverlessTip:
            "Anchor b and drum d. Because his backdash is sluggish, spacing discipline matters more than raw speed — do not expect the movement to bail you out of a bad guess.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Four clean backdash cancels in a row.",
          },
          difficulty: "hard",
          tags: ["fundamental", "execution"],
        },
        {
          id: "crouch-dash",
          stageId: "movement",
          name: "Crouch Dash",
          notation: "f,n,d,df",
          purpose:
            "The Mishima motion, and the single most important input on the character. It ducks highs as it travels and it is the gateway to the electric, the Thrusting Uppercut and the power low.",
          whenToUse:
            "As an approach that threatens three different things at once. Wavu also calls it Breaking Step — you can cancel it to sidestep with u or to block with b, so it is not a full commitment.",
          leverlessTip:
            "Four discrete states: press f, release it (that release is the n), press d, then add f so d and f are held together (that is df). Say it out loud — forward, nothing, down, down-forward — and press it at half speed until it is exact. Speed is worthless here; precision is everything.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Clean crouch dash from neutral, confirmed on the input display with no extra directions.",
          },
          difficulty: "medium",
          tags: ["mishima", "execution", "core"],
          moveKeys: ["whf", "tu", "cd-df4-2"],
        },
        {
          id: "wavedash",
          stageId: "movement",
          name: "Wavedash",
          notation: "f,n,d,df ×n",
          purpose:
            "Chained crouch dashes — how you cover ground while permanently threatening the electric. Note that Wavu scores the wavedash's own value at zero: it is not a reward, it is the delivery mechanism for the things that are.",
          whenToUse:
            "Closing distance in neutral while the opponent has to respect a launcher, a power low and a duck all at once.",
          leverlessTip:
            "The loop is df, then f, then neutral, then d, then df again. On a leverless each of those is a separate press rather than a rotation, so a wavedash is a four-beat drum pattern. Get the beat even before you make it fast.",
          drill: {
            type: "timed",
            durationSeconds: 30,
            rep: "Wavedash across the stage keeping the motion clean the whole way.",
          },
          difficulty: "hard",
          tags: ["mishima", "execution"],
        },
        {
          id: "zenshin",
          stageId: "movement",
          name: "Zenshin",
          notation: "f+3+4 (forward) · b+3+4 (backward)",
          purpose:
            "His stance. f+3+4 steps forward and is actionable after 10 frames; b+3+4 steps backward and is actionable after 5. Both give the full ZEN moveset, and both can slide into a Crouch Dash with df.",
          whenToUse:
            "As a pressure platform, as a combo tool, and as an evasive step. Nearly every Jin combo passes through this stance.",
          leverlessTip:
            "Both entries are three-button chords, which is comfortable on leverless. Learn b+3+4 first — it is actionable twice as fast and it steps away from danger rather than into it.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Zenshin both ways and cancel out with f before committing to an attack.",
          },
          difficulty: "medium",
          tags: ["stance"],
          moveKeys: ["zen1", "zen2", "zen4"],
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
      focus: "The generic toolkit that carries him",
      description:
        "Wavu calls Jin the All Rounder Supreme: outstanding generic tools plus a supplementary Mishima moveset. This stage is the first half of that. These buttons are why he can be played well by a beginner — none of them need a just frame, and all of them are safe enough to throw.",
      items: [
        {
          id: "df1",
          stageId: "pokes",
          name: "Mid Left Punch",
          notation: "df+1 → df+1,4 / df+1,4~4",
          purpose:
            "i13, mid, and only -3 on block. This is the button you press when you do not know what else to press. The 4 extension is his -13 punisher, and ~4 converts that high into a mid instead.",
          whenToUse:
            "Constantly. Poke with df+1, and take df+1,4 when you have the frames. Mix the ~4 mid ender against opponents who duck the high.",
          leverlessTip:
            "df is a d+f chord, not a roll. The ~4 means pressing 4 again quickly — treat it as one double-tap rhythm rather than two decisions.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "df+1 as a turn-check, then block; mix in df+1,4 and df+1,4~4.",
          },
          difficulty: "easy",
          tags: ["i13", "mid", "poke", "punisher"],
          moveKeys: ["df1", "df1-4", "df1-4-4"],
        },
        {
          id: "ws4",
          stageId: "pokes",
          name: "Rising Toe Kick",
          notation: "ws4 → ws4,4",
          purpose:
            "i11 out of crouch at only -3. Your answer to the moment after you block a low, and the fastest thing you own from a crouching state.",
          whenToUse:
            "Immediately after blocking a low, or out of your own crouch. ws4,4 is his -11 crouching punisher.",
          leverlessTip:
            "While-standing moves fire as you release d. Release and press 4 as one motion — do not stand fully first.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Block a low and answer with ws4 or ws4,4.",
          },
          difficulty: "easy",
          tags: ["i11", "crouch", "punisher"],
          moveKeys: ["ws4", "ws4-4"],
        },
        {
          id: "b3",
          stageId: "pokes",
          name: "Left Knee",
          notation: "b+3 (~F for Zenshin)",
          purpose:
            "An i16 mid check at -6, and the most important stance entry in the game for him: press F during recovery and you are in Zenshin. Every bread-and-butter combo starts with this exact input.",
          whenToUse:
            "As a mid check in neutral, and as the first link of every combo. Getting b+3~F automatic now saves you an entire stage of pain later.",
          leverlessTip:
            "The ~F is a held forward during recovery, not a fresh tap. Practise b+3~F until entering Zenshin feels like part of the move rather than a second input.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "b+3 into Zenshin with F, then a ZEN follow-up.",
          },
          difficulty: "medium",
          tags: ["mid", "stance", "core"],
          moveKeys: ["b3", "b3-2", "zen1"],
        },
        {
          id: "standing-4",
          stageId: "pokes",
          name: "High Right Roundhouse",
          notation: "4 (→ 4~3)",
          purpose:
            "A fast homing high with counter-hit properties — it tracks sidesteps, which most of his kit does not. On counter-hit it gives a guaranteed follow-up worth real damage.",
          whenToUse:
            "Against opponents who sidestep your linear pressure. On counter-hit, take df+1,4 or 1+2 immediately.",
          leverlessTip:
            "It is a high, so it loses to crouching — that is the price of the tracking. 4~3 converts into a mid if you read a duck.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Catch a sidestepping CPU with 4 and convert the counter-hit.",
          },
          difficulty: "easy",
          tags: ["homing", "anti-step", "CH"],
          moveKeys: ["kick4", "kick4-3"],
        },
        {
          id: "b2-1",
          stageId: "pokes",
          name: "Shun Masatsu",
          notation: "b+2,1",
          purpose:
            "A mid check that doubles as one of his three listed whiff punishers at -9 risk. Reliable, unspectacular, and always available.",
          whenToUse:
            "As a mid check at close range, and as a whiff punish when the electric is not worth the risk.",
          leverlessTip:
            "This is the whiff punisher to use while your electric is still unreliable. There is no shame in it — a landed b+2,1 beats a dropped EWHF every time.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Whiff punish a CPU attack with b+2,1.",
          },
          difficulty: "easy",
          tags: ["mid", "whiff punish"],
          moveKeys: ["b2", "b2-1"],
        },
        {
          id: "poke-strings",
          stageId: "pokes",
          name: "The Delayable Strings",
          notation: "2,1,4 / 2,1,4~4 · 1,2 enders",
          purpose:
            "Jin's pressure is built on strings you can delay and branch. 2,1,4 ends high with a counter-hit reward; 2,1,4~4 ends low from the same start. The opponent has to guess after they have already committed.",
          whenToUse:
            "Close range, as your main pressure. The delay is the weapon — throw 2,1, watch what they do, then decide the ender.",
          leverlessTip:
            "Delay is free on a leverless because your fingers already rest on the buttons. Practise deliberately holding the string for a beat before finishing it.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Throw 2,1 and pick the ender based on whether the CPU blocks low.",
          },
          difficulty: "medium",
          tags: ["pressure", "mixup"],
          moveKeys: ["right-1", "right-1-4", "right-1-4-4", "jab-2", "jab-2-3"],
        },
        {
          id: "df3-3",
          stageId: "pokes",
          name: "Brazilian Kick",
          notation: "df+3~3",
          purpose:
            "Plus on block, and it slides into Breaking Step with df. It is also a guaranteed mini-combo starter — df+3~3 into df+1,4 is 39 damage for two easy inputs.",
          whenToUse:
            "As a pressure mid that keeps your turn, and as free damage whenever it lands clean.",
          leverlessTip:
            "The ~3 is a quick second tap. From the plus frames you can enter Breaking Step with df and immediately threaten the electric — that is the pressure loop in miniature.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land df+3~3 and follow with df+1,4 for the mini-combo.",
          },
          difficulty: "medium",
          tags: ["plus on block", "mini-combo"],
          moveKeys: ["df3", "df3-3", "df1-4"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — THE LOW GAME                                      */
    /* ------------------------------------------------------------ */
    {
      id: "lows",
      number: 3,
      name: "The Low Game",
      focus: "One of the best low arsenals in the game",
      description:
        "Wavu lists Outstanding Lows among Jin's core strengths, and it is not flattery — he has a fast crouch jab, a stature kick, a counter-hit sweep and a power low off the wavedash. This is the half of his offense that makes the mid game work.",
      items: [
        {
          id: "d2",
          stageId: "lows",
          name: "Scourge",
          notation: "d+2",
          purpose:
            "His power low. It knocks down on counter-hit and does serious damage. Be honest about the catch: Wavu explicitly lists d+2 as somewhat reactable, so it is a read, not a habit.",
          whenToUse:
            "Against opponents who have started blocking your mids and stopped watching for the low. It is -14 on block, so a wrong guess costs you a launch.",
          leverlessTip:
            "Because it is reactable at high level, its job is to threaten rather than to land. One d+2 a round changes how they block for the next two.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Land d+2 against a conditioned opponent and take the counter-hit knockdown.",
          },
          difficulty: "medium",
          tags: ["power low", "read"],
          moveKeys: ["d2"],
        },
        {
          id: "db4",
          stageId: "lows",
          name: "Right Low Roundhouse",
          notation: "db+4",
          purpose:
            "His stature kick — a quick, low-committal low that chips away and forces the opponent to think about crouching. Counter-hit gives you a guaranteed follow-up.",
          whenToUse:
            "Constantly and in small doses. This is the low that does not need to land to be worth throwing.",
          leverlessTip:
            "db is a d+b chord. Because it is far safer than d+2, this is the low you use to build the fear that makes d+2 land.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix db+4 into your pressure without being launched for it.",
          },
          difficulty: "easy",
          tags: ["low", "poke"],
          moveKeys: ["db4"],
        },
        {
          id: "db1",
          stageId: "lows",
          name: "Crouch Jab",
          notation: "db+1",
          purpose:
            "i10 from a crouching state at only -5. Jin's generic d+1 was remapped to db+1, which trips up players coming from other characters — this is the fast interrupt you reach for from crouch.",
          whenToUse:
            "To interrupt pressure while crouching, and to check opponents who crowd you after a blocked low.",
          leverlessTip:
            "Worth committing to memory precisely because it is remapped: on Jin the fast crouch poke is db+1, not d+1. d+1 is his Power Crush and a completely different tool.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Interrupt CPU pressure from crouch with db+1.",
          },
          difficulty: "easy",
          tags: ["i10", "low", "interrupt"],
          moveKeys: ["db1"],
        },
        {
          id: "fc-df4",
          stageId: "lows",
          name: "The Sweep",
          notation: "FC.df+4",
          purpose:
            "A full-crouch sweep that counter-hits for a full combo. It is -26 on block, which is as committal as it sounds — but on hit it enters Zenshin with F and keeps your pressure alive.",
          whenToUse:
            "As a hard read from a crouching state, usually after you have already been ducking. Never as a repeated option.",
          leverlessTip:
            "You must already be in full crouch. Hold d, then press df and 4 — the move does not exist from a standing input, which is what keeps it hidden.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 5,
            rep: "Land FC.df+4 from a crouching state and convert the counter-hit.",
          },
          difficulty: "hard",
          tags: ["low", "CH launcher", "high risk"],
          moveKeys: ["fc-df4"],
        },
        {
          id: "wavedash-low",
          stageId: "lows",
          name: "Depraved Savagery",
          notation: "f,n,d,DF+4,2",
          purpose:
            "The wavedash power low. Coming out of the same crouch dash that threatens the electric, this is the other half of the mixup — they cannot duck the low and stand for the launcher at the same time.",
          whenToUse:
            "Out of a wavedash, as the low half of your Mishima mixup. Wavu is candid that this mixup is somewhat reactable, so vary the timing and do not lean on it.",
          leverlessTip:
            "DF must be held, not tapped — that is what separates it from a plain df+4. Always finish with the 2: the first hit alone is -31 on block.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Wavedash into the full power low and confirm both hits connect.",
          },
          difficulty: "hard",
          tags: ["mishima", "power low", "mixup"],
          moveKeys: ["cd-df4", "cd-df4-2"],
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
      focus: "Arguably the best punishment suite in the game",
      description:
        "This is the stage where Jin separates from the field. Wavu's assessment is that he has arguably the best punishment suite in the entire game — he launches at -15 from standing and -14 from crouch, with clean, damaging answers at every number below that. Nothing here needs a just frame. Learn this stage properly and you will win games with defense alone.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "The i10 Punish",
          notation: "2,4",
          purpose:
            "Your fastest punish, and it wall splats. That last part matters more than the damage — a -10 punish that puts them on the wall is worth far more than a jab string.",
          whenToUse:
            "Anything blocked at -10 or -11, especially near a wall.",
          leverlessTip:
            "The 4 ender is a high and is duckable, which is why Wavu flags it. Against opponents who duck it on reaction, take a mid string instead.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 2,4 with no drops.",
          },
          difficulty: "easy",
          tags: ["i10", "punisher", "wall splat"],
          moveKeys: ["switchblade"],
        },
        {
          id: "punish-12",
          stageId: "punishment",
          name: "-12",
          notation: "b+1,2",
          purpose:
            "Shun Maten. i12 and it carries for +32a on hit — a big step up from the i10 punish for two frames of extra advantage.",
          whenToUse:
            "Blocked pokes and string enders in the -12 band.",
          leverlessTip:
            "Buffer during blockstun. Because Jin's punish ladder is so dense, the hard part is never execution — it is knowing which rung you are on.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish a -12 move with b+1,2.",
          },
          difficulty: "easy",
          tags: ["i12", "punisher"],
          moveKeys: ["b1", "b1-2"],
        },
        {
          id: "punish-13",
          stageId: "punishment",
          name: "-13",
          notation: "df+1,4",
          purpose:
            "The reliable -13 punish, straight off the poke you already throw constantly. There is a far better option at this number — a launching one — but it needs a just frame, and it is the whole of Stage 5.",
          whenToUse:
            "Any blocked -13. Use this version until the electric is genuinely reliable under pressure.",
          leverlessTip:
            "Keep this as your default even after you learn the electric. A guaranteed df+1,4 beats a 50% EWHF in every match that matters.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -13 move with df+1,4.",
          },
          difficulty: "easy",
          tags: ["i13", "punisher"],
          moveKeys: ["df1-4"],
        },
        {
          id: "punish-14",
          stageId: "punishment",
          name: "-14",
          notation: "f+1+2 · f+3,1",
          purpose:
            "Two options. f+1+2 is the straightforward damage; f+3,1 is a Heat Engager, so it converts a blocked move into Heat pressure.",
          whenToUse:
            "Blocked -14 moves. Take f+3,1 when you want Heat, f+1+2 when you just want the damage.",
          leverlessTip:
            "f+3 on its own is -16 — never stop the string early. The 1 is not optional.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Alternate f+1+2 and f+3,1 as -14 punishes.",
          },
          difficulty: "medium",
          tags: ["i14", "punisher", "heat engager"],
          moveKeys: ["f1-2", "f3", "f3-1"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "-15 — the Launch",
          notation: "d+3+4",
          purpose:
            "Double Lift Kick. At -15 Jin gets a full combo without touching a just frame, which is exactly why he is described as beginner-friendly and master-viable at the same time.",
          whenToUse:
            "Any blocked -15 or worse. It is -19 on block, so it is a punish only — never a neutral option.",
          leverlessTip:
            "A d+3+4 chord: press 3 and 4 on the same frame with d held. A one-frame split gives you d+3 or d+4, both lows, both wrong here.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with d+3+4 and convert into a combo.",
          },
          difficulty: "medium",
          tags: ["launcher", "punisher"],
          moveKeys: ["d34"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouching Punishment",
          notation: "ws4,4 · ws1,2 · ws2",
          purpose:
            "After blocking a low: ws4,4 at -11, ws1,2 at -13, and ws2 LAUNCHES at -14. A crouching launch one frame faster than his standing one is a big part of why his punishment is rated so highly.",
          whenToUse:
            "Every blocked low. Most players block the low and do nothing — that is free damage you are declining.",
          leverlessTip:
            "You are already holding d to block. The while-standing punish is a release plus a button, not a new input — which is why these are the easiest big punishes in his kit.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish for the frame count.",
          },
          difficulty: "medium",
          tags: ["crouch", "punisher", "launcher"],
          moveKeys: ["ws4-4", "ws1", "ws1-2", "ws2"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — ELECTRIC WIND HOOK FIST                           */
    /* ------------------------------------------------------------ */
    {
      id: "electric",
      number: 5,
      name: "Electric Wind Hook Fist",
      focus: "The one frame that defines the character",
      description:
        "Everything up to here works without a just frame. This stage is the ceiling. EWHF is an i11 launcher that is PLUS ON BLOCK — a move with essentially no downside if you hit the input. Miss the just frame and you get Wind Hook Fist at -10 instead, and that gap between +5 and -10 is the entire skill curve of playing Jin.",
      items: [
        {
          id: "whf",
          stageId: "electric",
          name: "Wind Hook Fist",
          notation: "f,n,d,df+2",
          purpose:
            "The non-electric version, and where you must start. Same i11 speed, same launch on hit — but -10 on block instead of plus. Learn what the move does before you chase the just frame.",
          whenToUse:
            "As a launcher whenever you have a confirmed opening. Do not throw it into a blocking opponent: -10 is a real punish.",
          leverlessTip:
            "Finish the crouch dash properly before pressing 2. Most failed electrics are actually failed crouch dashes — if the motion is sloppy, no amount of timing practice will save it.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Clean crouch dash into Wind Hook Fist with no dropped inputs.",
          },
          difficulty: "medium",
          tags: ["i11", "launcher", "mishima"],
          moveKeys: ["whf"],
        },
        {
          id: "ewhf-input",
          stageId: "electric",
          name: "The Just Frame",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "Press 2 on the exact frame df registers and the move becomes electric: i11, launches, and +5~+6 on block. It is one of very few launchers in Tekken that is plus when blocked.",
          whenToUse:
            "Everywhere, once it is reliable. Because it is plus on block, a landed electric is close to a free action — the risk is entirely in the execution, not the move.",
          leverlessTip:
            "This is the leverless advantage, and it is a large one. Rather than timing 2 against a stick rolling into df, press f and 2 together while d is already held. The df and the 2 then land on the same frame by construction instead of by feel. Learn it this way from the start.",
          drill: {
            type: "accuracy",
            attempts: 20,
            required: 6,
            rep: "Attempt EWHF and count only the ones that flash electric.",
          },
          difficulty: "expert",
          tags: ["just frame", "signature", "execution"],
          moveKeys: ["ewhf", "whf"],
        },
        {
          id: "ewhf-consistency",
          stageId: "electric",
          name: "Electric Consistency",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "The difference between knowing the input and owning it. A 30% electric is a liability, because 70% of the time you are handing them a -10 punish. This drill is about the hit rate, not the trick.",
          whenToUse:
            "Before you take it into a real match. Set a target percentage and hold yourself to it.",
          leverlessTip:
            "Practise from a standstill first, then out of a wavedash, then under pressure — the three are genuinely different skills, and the third is the one that decides matches.",
          drill: {
            type: "accuracy",
            attempts: 20,
            required: 12,
            rep: "EWHF from a standstill — count only clean electrics.",
          },
          difficulty: "expert",
          tags: ["just frame", "consistency"],
          moveKeys: ["ewhf"],
        },
        {
          id: "ewhf-punish",
          stageId: "electric",
          name: "The -13 Electric Punish",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "Wavu lists this as one of Jin's three key techniques, at maximum rhythm difficulty and maximum value. At -13 you can convert a blocked move into a full launch instead of df+1,4 — the single biggest damage upgrade available to him.",
          whenToUse:
            "Blocked -13 moves you have seen before and are confident about. Until then, df+1,4 remains correct.",
          leverlessTip:
            "The timing is different from a neutral electric because you are buffering out of blockstun rather than starting cold. Practise it as its own skill — Wavu rates its rhythm difficulty higher than the neutral version for exactly this reason.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 7,
            rep: "Punish a -13 move with a clean EWHF and convert the launch.",
          },
          difficulty: "expert",
          tags: ["just frame", "punisher", "launcher"],
          moveKeys: ["ewhf", "df1-4"],
        },
        {
          id: "ewhf-neutral",
          stageId: "electric",
          name: "Electric in Neutral",
          notation: "f,n,d,df+2 (just frame)",
          purpose:
            "Wavu's other maximum-value key technique. Using the electric as a keep-out and whiff-punish tool rather than a combo starter is what turns Jin from solid into oppressive — it is listed among his whiff punishers at a risk of PLUS 5.",
          whenToUse:
            "At range, into a whiff, or as a check when they step forward. A blocked electric leaves you plus, so the punish for guessing wrong is nothing.",
          leverlessTip:
            "Read that risk figure again: +5. There is no other launcher in his kit you can throw with so little consequence. The only thing standing between you and free damage is whether the just frame comes out.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 8,
            rep: "Whiff punish a CPU attack from range with EWHF.",
          },
          difficulty: "expert",
          tags: ["just frame", "whiff punish", "keep-out"],
          moveKeys: ["ewhf"],
        },
        {
          id: "thrusting-uppercut",
          stageId: "electric",
          name: "Thrusting Uppercut",
          notation: "f,n,d,df+1",
          purpose:
            "The other crouch dash launcher. It carries the Tornado property and it evades jabs on the way up, which makes it a genuinely different tool from the electric rather than a worse one.",
          whenToUse:
            "As a launcher when you expect a jab, and as a combo part where you need the Tornado. It also has its own just-frame version.",
          leverlessTip:
            "Same crouch dash, different button. Once the motion is clean, adding a second option off it costs you nothing — which is the real reason to drill the crouch dash so hard in Stage 1.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Crouch dash into Thrusting Uppercut and convert the launch.",
          },
          difficulty: "hard",
          tags: ["launcher", "tornado", "mishima"],
          moveKeys: ["tu", "etu"],
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
      focus: "One route, reused everywhere",
      description:
        "Jin's combo game is unusually kind: essentially every launcher funnels into the same Zenshin loop. Learn one filler and one ender and you can convert from almost anything. Start with the mini-combos — they are free damage you can use in your very next match.",
      items: [
        {
          id: "mini-combos",
          stageId: "combos",
          name: "Guaranteed Mini-Combos",
          notation: "df+3~3 → df+1,4 · CH 4 → df+1,4",
          purpose:
            "Two-input damage you can use immediately. df+3~3 into df+1,4 is 39; a counter-hit standing 4 into df+1,4 is 37, or into 1+2 for a Heat Engager instead.",
          whenToUse:
            "Every time df+3~3 lands, and every counter-hit standing 4. These require no execution and most new Jin players simply forget them.",
          leverlessTip:
            "Both follow-ups are the same df+1,4 you already drilled in Stage 2. You are not learning a combo — you are learning to notice an opening.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land the guaranteed follow-up after df+3~3 and after a counter-hit 4.",
          },
          difficulty: "easy",
          tags: ["mini-combo", "damage"],
          moveKeys: ["df3-3", "df1-4", "kick4", "one-two-heat"],
        },
        {
          id: "zen-filler",
          stageId: "combos",
          name: "The Zenshin Link",
          notation: "b+3~F → ZEN.1",
          purpose:
            "The single building block of his entire combo game. Every route below is this link repeated. Drill it alone until it is automatic and the combos stop being combos.",
          whenToUse:
            "As combo filler after any launcher. If you can do this link twice in a row you can already complete his bread-and-butter.",
          leverlessTip:
            "Hold F through b+3's recovery so Zenshin comes out without a separate decision, then press 1. Treat b+3~F ZEN.1 as one four-beat phrase rather than three inputs.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "b+3~F into ZEN.1 in a combo with no drops.",
          },
          difficulty: "medium",
          tags: ["combo", "core", "stance"],
          moveKeys: ["b3", "zen1"],
        },
        {
          id: "bnb-regular",
          stageId: "combos",
          name: "The Bread and Butter",
          notation: "b+3~F ZEN.1 → b,f+2,3~F ZEN.u+1 → T! → b+3~F ZEN.1,3",
          purpose:
            "The route off any standard launcher — d+3+4, uf+4, ws2, f,F+3, or a counter-hit f+4. Two Zenshin links, a Tornado, and an attack-throw ender.",
          whenToUse:
            "Off every non-electric launch. The b,f+2,3~F entry leaves you at +2 in Zenshin, which is what makes the Tornado link work.",
          leverlessTip:
            "Notice both halves are the same shape: something into ~F, then a ZEN move. You already drilled the first one. The second is b,f+2,3 instead of b+3 — the stance entry is identical.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full bread-and-butter from a d+3+4 launch with no drops.",
          },
          difficulty: "hard",
          tags: ["BNB", "combo"],
          moveKeys: ["d34", "b3", "zen1", "bf2-3", "zen-u1", "zen1-3"],
        },
        {
          id: "bnb-electric",
          stageId: "combos",
          name: "Off the Electric",
          notation: "T! EWHF → b+3~F ZEN.1 → b+3~F ZEN.1,3",
          purpose:
            "The electric applies Tornado instantly, so the route is shorter and simpler than the standard one — just the Zenshin link twice. The same route also works off a low parry.",
          whenToUse:
            "Every EWHF launch, and every low parry. Fewer parts than the bread-and-butter, which is a pleasant surprise after Stage 5.",
          leverlessTip:
            "This is the payoff for drilling the link in isolation: once b+3~F ZEN.1 is automatic, the hardest combo in your kit becomes the same thing twice.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Convert an EWHF launch into the full route.",
          },
          difficulty: "hard",
          tags: ["BNB", "combo", "electric"],
          moveKeys: ["ewhf", "b3", "zen1", "zen1-3"],
        },
        {
          id: "wall-game",
          stageId: "combos",
          name: "The Wall",
          notation: "b,f+2,1,df+2 · db+2,2,3",
          purpose:
            "At the wall, use Geyser or Savage Sword as your ender. Jin's wall damage is substantial and 2,4 and ws2 both splat, so getting them there is rarely the hard part.",
          whenToUse:
            "Any time their back is near a wall. Prioritise carrying them there over squeezing out midscreen damage.",
          leverlessTip:
            "Pick one of the two enders and use it every time. Consistency at the wall is worth more than choosing optimally under pressure.",
          drill: {
            type: "manual",
            checklist: [
              "Identify which of Jin's moves wall splat (2,4 and ws2).",
              "Carry an opponent to the wall in a single combo.",
              "Land b,f+2,1,df+2 as a wall ender three times.",
              "Land db+2,2,3 as a wall ender three times.",
            ],
          },
          difficulty: "hard",
          tags: ["wall", "damage"],
          moveKeys: ["bf2-1-df2", "db2-2-3", "switchblade", "ws2"],
          verifyInGame:
            "Wall routes depend heavily on stage geometry and the angle you carry from. Build yours in Practice mode on the stages you actually play rather than copying a notation list.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — ZENSHIN PRESSURE                                  */
    /* ------------------------------------------------------------ */
    {
      id: "zenshin",
      number: 7,
      name: "Zenshin Pressure",
      focus: "Turn the combo stance into offense",
      description:
        "You have been using Zenshin as a combo tool. This stage turns it into a pressure engine. Several of Jin's strings slide into the stance at plus frames, and the stance itself contains a plus-on-block mid, a hugely plus high, and a Heat Engager. Once you can enter at advantage, Zenshin stops being a combo detour and becomes his offense.",
      items: [
        {
          id: "zen-entries",
          stageId: "zenshin",
          name: "Entering at Plus",
          notation: "3,1~F (+4) · b,f+2,3~F (+2) · f,f,F+3~F (+6)",
          purpose:
            "The whole point of the stance. 3,1 into Zenshin leaves you at +4 on block, b,f+2,3 at +2, and a running f,f,F+3 at +6. You arrive already holding the turn.",
          whenToUse:
            "As the tail of blocked pressure. Instead of ending your turn on a blocked string, end it in a stance at advantage.",
          leverlessTip:
            "All three are the same idea: hold F through the recovery. One habit unlocks every entry — and it is the same habit you built with b+3~F in Stage 2.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Enter Zenshin at plus frames from all three strings.",
          },
          difficulty: "medium",
          tags: ["stance", "pressure", "plus on block"],
          moveKeys: ["kick3-1", "bf2-3", "fff3", "f4"],
        },
        {
          id: "zen1-strings",
          stageId: "zenshin",
          name: "The Zenshin Strings",
          notation: "ZEN.1 → ZEN.1,2 / ZEN.1,3",
          purpose:
            "Your core stance option. ZEN.1 is -3, and it forks: ZEN.1,2 is a Heat Engager that launches, ZEN.1,3 is the attack-throw ender you already use in combos.",
          whenToUse:
            "From a plus-frame entry. ZEN.1 alone is safe enough to throw, and the enders punish anyone who tries to press through it.",
          leverlessTip:
            "The fork happens after ZEN.1 has already connected, so you can react rather than pre-commit. This is one of the friendlier mixups in the game to run on a leverless.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Enter Zenshin at plus and run ZEN.1 into both enders.",
          },
          difficulty: "medium",
          tags: ["stance", "mixup", "heat engager"],
          moveKeys: ["zen1", "zen1-2", "zen1-3"],
        },
        {
          id: "zen2",
          stageId: "zenshin",
          name: "Fiendish Claw",
          notation: "ZEN.2",
          purpose:
            "A Heat Engager out of the stance at only -5. This is how you convert Zenshin pressure into Heat without taking a risk to do it.",
          whenToUse:
            "When you want Heat and you are already in the stance. Being a high, it loses to crouching — pair it with ZEN.4 or the low attack throw.",
          leverlessTip:
            "Getting into Heat is worth more than almost any single hit for Jin, because Heat removes the just-frame requirement on his electric. Treat this button as a Heat button, not a damage button.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Engage Heat from Zenshin with ZEN.2.",
          },
          difficulty: "easy",
          tags: ["heat engager", "stance"],
          moveKeys: ["zen2"],
        },
        {
          id: "zen34",
          stageId: "zenshin",
          name: "Black Wing Bolt",
          notation: "ZEN.3+4",
          purpose:
            "Enormously plus on block — you keep the turn by a wide margin even when they block correctly. The catch is that it is a high, so a crouching opponent beats it outright.",
          whenToUse:
            "Against opponents standing and blocking your stance pressure. It is slow, so it is a read on someone who has decided to hold still.",
          leverlessTip:
            "3+4 is a two-button chord. Because the reward on block is so large, this is the move that makes opponents start crouching — which is precisely when your mids and the low attack throw start landing.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Land ZEN.3+4 on block and continue pressure from the advantage.",
          },
          difficulty: "medium",
          tags: ["plus on block", "stance", "read"],
          moveKeys: ["zen34"],
        },
        {
          id: "zen4",
          stageId: "zenshin",
          name: "Corpse Crusher",
          notation: "ZEN.4",
          purpose:
            "A mid that is plus on block. Where ZEN.3+4 loses to crouching, this does not — which makes the two of them a genuine pair rather than two separate options.",
          whenToUse:
            "Against opponents who started crouching to beat ZEN.3+4. Between the two you cover both stances at advantage.",
          leverlessTip:
            "Learn these two as one decision, not two moves: high if they stand, mid if they crouch, and you are plus either way.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Alternate ZEN.3+4 and ZEN.4 based on whether the CPU crouches.",
          },
          difficulty: "medium",
          tags: ["plus on block", "stance", "mid"],
          moveKeys: ["zen4", "zen3", "zen1plus2"],
        },
        {
          id: "ff2",
          stageId: "zenshin",
          name: "Demon's Paw",
          notation: "f,F+2",
          purpose:
            "Wavu calls it one of the strongest approach tools in Tekken 8: a safe, long-ranged mid Heat Engager. It is how you get from neutral into the pressure this stage is about.",
          whenToUse:
            "As your primary approach. Safe at -8, long enough to catch people who think they are out of range, and it gives you Heat when it lands.",
          leverlessTip:
            "It cannot be buffered, so you must complete the f,F input cleanly before pressing 2 — a rushed input gives you nothing at all.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Approach from range with f,F+2 and engage Heat on hit.",
          },
          difficulty: "easy",
          tags: ["approach", "heat engager", "signature"],
          moveKeys: ["ff2", "ff3", "ff4"],
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
      focus: "Why he is so hard to pressure",
      description:
        "Jin's defense is as strong as his punishment. A strong parry, a sabaki, a Power Crush and one of the best Heat Smashes in the game make him genuinely difficult to open up. This stage assembles the defensive half and then ties the whole character together.",
      items: [
        {
          id: "parry",
          stageId: "gameplan",
          name: "Kazama Style Parry",
          notation: "b+1+3",
          purpose:
            "Parries high and mid attacks. Wavu describes it as a strong parry with an i3 window, and lists it as a core reason Jin is so hard to pressure.",
          whenToUse:
            "Against predictable strings and mid-heavy pressure. It covers both highs and mids, which is far more than most parries manage.",
          leverlessTip:
            "b+1+3 is a three-button chord with a direction. Because the parry covers two attack heights, it is a read on when they press rather than on what they press.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Parry a mid or high string and take the follow-up.",
          },
          difficulty: "hard",
          tags: ["defense", "parry", "read"],
        },
        {
          id: "sabaki-crush",
          stageId: "gameplan",
          name: "Sabaki & Power Crush",
          notation: "b+1+2 · d+1",
          purpose:
            "Two more ways to take a turn back. b+1+2 is his sabaki; d+1 is his Power Crush, absorbing a hit and converting to an attack throw on a standing hit.",
          whenToUse:
            "Against pressure you have read. Power Crush does not absorb lows or throws, so it is an answer to a specific string, not a general escape.",
          leverlessTip:
            "Remember the remap from Stage 3: on Jin, d+1 is the Power Crush and db+1 is the fast crouch jab. Mixing these two up under pressure is a common and expensive mistake.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Absorb a pressure string with d+1 and take your turn back.",
          },
          difficulty: "medium",
          tags: ["defense", "power crush", "sabaki"],
          moveKeys: ["sabaki", "power-crush", "db1"],
        },
        {
          id: "power-stance",
          stageId: "gameplan",
          name: "Power Stance",
          notation: "db+1+2",
          purpose:
            "A chargeable stance move that is unparryable and leaves the opponent recovering crouched. Charged fully it becomes plus on block, and in Heat it powers up further.",
          whenToUse:
            "As a conditioning tool and a wall threat. The forced crouching recovery on hit sets up your while-standing game.",
          leverlessTip:
            "The longer you hold it the better the frames get, from -11 uncharged up to plus. Holding it is a commitment, so charge it when you already have the opponent respecting you.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Land Power Stance at different charge levels and note the frame difference.",
          },
          difficulty: "medium",
          tags: ["stance", "unparryable"],
          moveKeys: ["power-stance", "h-power-stance"],
        },
        {
          id: "heat",
          stageId: "gameplan",
          name: "Heat: The Free Electric",
          notation: "1+2 · df+4 · f,F+2 · f+3,1 · ZEN.2",
          purpose:
            "The most important mechanic on the character. In Heat, Jin's Wind Hook Fist becomes the ELECTRIC with no just frame required — the entire execution barrier of Stage 5 disappears for the duration.",
          whenToUse:
            "Engage with whichever of the five Heat Engagers fits, then spend the window running electric pressure you could not otherwise run. His Heat Smash is plus on block and auto-transitions into Crouch Dash.",
          leverlessTip:
            "This changes how you should practise. Even while your just frame is unreliable, you get a window every round where it is free — so learn what you would DO with a reliable electric, not just how to input one.",
          drill: {
            type: "manual",
            checklist: [
              "Name all five Heat Engagers without looking.",
              "Engage Heat and land three electrics without the just frame.",
              "Land the Heat Smash and confirm you are plus on block.",
              "Use the automatic Crouch Dash transition after a blocked Heat Smash.",
            ],
          },
          difficulty: "medium",
          tags: ["heat", "electric", "signature"],
          moveKeys: ["one-two-heat", "df4", "ff2", "f3-1", "zen2", "heat-smash", "heat-smash-4"],
        },
        {
          id: "dvs",
          stageId: "gameplan",
          name: "The Awakened Stance",
          notation: "H.db+1+2 → DVS",
          purpose:
            "Heat-only. His Power Stance and Awakened Black Wing transition into DVS, which contains a full set of Mishima moves — including an Awakened Wind God Fist that is i11 and plus on block.",
          whenToUse:
            "Inside Heat, when you want the strongest version of his pressure. These moves do not exist outside Heat, so there is no reason to save them.",
          leverlessTip:
            "Do not try to learn DVS until Heat itself is second nature. It is the deepest layer of the character and it is only available for a few seconds a round.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Enter DVS from Power Stance in Heat and land a follow-up.",
          },
          difficulty: "expert",
          tags: ["heat", "stance", "advanced"],
          moveKeys: ["h-power-stance", "dvs1", "dvs2", "dvs3"],
        },
        {
          id: "the-plan",
          stageId: "gameplan",
          name: "The Jin Gameplan",
          notation: "",
          purpose:
            "Assemble it. Hold space with f+4 and standing 4. Punish everything — his punishment is the best in the game and it wins matches on its own. Approach with f,F+2. Pressure into Zenshin at plus. Spend Heat on free electrics. Add the just frame on top when it is ready.",
          whenToUse:
            "Every round. Jin is described as playable by beginners and masters alike precisely because this plan works at every level — the electric raises the ceiling, it does not set the floor.",
          leverlessTip:
            "Be honest about the two weaknesses Wavu names: his backdash cancel is sluggish, and his wavedash mixup and d+2 are somewhat reactable. Neither is fatal, but both mean you should win with punishment and pressure rather than by out-moving people.",
          drill: {
            type: "manual",
            checklist: [
              "Win a round using only punishment and keep-out.",
              "Play three rounds where you always approach with f,F+2.",
              "End three blocked strings in Zenshin at plus frames.",
              "Spend one full Heat window on electric pressure.",
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
      situation: "You blocked a string ender. You are standing, near a wall.",
      options: ["2,4", "b+1,2", "d+3+4", "df+1,4"],
      correctIndex: 0,
      explain:
        "2,4 is his i10 punish and it wall splats, which is worth more than the raw damage. Be aware the 4 ender is a duckable high.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke. Standing.",
      options: ["b+1,2", "2,4", "f+1+2", "d+3+4"],
      correctIndex: 0,
      explain:
        "b+1,2 (Shun Maten) is the -12 punish for +32a. f+1+2 needs -14 and d+3+4 needs -15.",
    },
    {
      id: "q-13",
      prompt: "-13",
      situation: "You blocked an unsafe mid. Standing.",
      options: ["df+1,4", "b+1,2", "2,4", "ws2"],
      correctIndex: 0,
      explain:
        "df+1,4 is the reliable -13 punish. EWHF also reaches here and LAUNCHES — Wavu lists it as a key technique at maximum difficulty. Take it only when the just frame is dependable.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked a committed move and you want Heat.",
      options: ["f+3,1", "df+1,4", "2,4", "b+1,2"],
      correctIndex: 0,
      explain:
        "f+3,1 is a -14 punish AND a Heat Engager, so it converts a block into Heat pressure. f+1+2 also covers -14 for straight damage. Never stop at f+3 alone — it is -16.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["d+3+4 → combo", "f+1+2", "df+1,4", "2,4"],
      correctIndex: 0,
      explain:
        "d+3+4 LAUNCHES at -15 with no just frame required. This is why Jin's punishment is rated the best in the game — big damage with no execution tax.",
    },
    {
      id: "q-ws11",
      prompt: "-11 ws",
      situation: "You blocked a low. You are crouching.",
      options: ["ws4,4", "ws2", "ws1,2", "df+1,4"],
      correctIndex: 0,
      explain:
        "ws4,4 is the -11 crouching punish. ws1,2 needs -13 and ws2 needs -14 — reaching for them here gets you blocked.",
    },
    {
      id: "q-ws13",
      prompt: "-13 ws",
      situation: "Blocked a worse low. Crouching.",
      options: ["ws1,2", "ws4,4", "ws2", "d+3+4"],
      correctIndex: 0,
      explain:
        "ws1,2 (Twin Lancer) is the -13 crouching punish. ws2 launches but needs one more frame.",
    },
    {
      id: "q-ws14",
      prompt: "-14 ws",
      situation: "You blocked a badly unsafe low. Crouching.",
      options: ["ws2 → combo", "ws4,4", "ws1,2", "db+1"],
      correctIndex: 0,
      explain:
        "ws2 LAUNCHES at -14 — one frame faster than his standing launch punish. Blocking lows is where Jin collects the most.",
    },
    {
      id: "q-whiff",
      prompt: "WHIFF",
      situation: "They whiffed a long poke and you backdashed it cleanly.",
      options: ["f+4 or EWHF", "db+4", "d+2", "ws4"],
      correctIndex: 0,
      explain:
        "f+4 is safe at -8 and CH launches; EWHF is listed as a whiff punisher at a risk of PLUS 5. b+2,1 is the safe third option. d+2 and db+4 are lows, not punishes.",
    },
    {
      id: "q-bt",
      prompt: "BACK TURNED",
      situation: "They are back-turned in front of you.",
      options: ["1,2,1", "2,4", "d+3+4", "df+1,4"],
      correctIndex: 0,
      explain:
        "1,2,1 is his listed back-turned punisher and it launches. Against a back-turned opponent you want the launch, not the fast poke.",
    },
  ],
};
