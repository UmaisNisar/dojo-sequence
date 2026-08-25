import type { Character } from "@/types";

/**
 * Kazuya Mishima — Tekken 8 (Season 3) curriculum.
 *
 * Frame data cross-verified against TekkenDocs (tekkendocs.com/t8/kazuya)
 * and Wavu Wiki (wavu.wiki/t/Kazuya_movelist, _punishers, _combos) as of
 * August 2026. Notable T8 facts baked into this curriculum:
 *  - df+1 is i15 (slow for a generic mid — that's the Kazuya trade-off)
 *  - df+2 is i14, homing, and launches ONLY on counter-hit
 *  - uf+4 is NOT a hopkick launcher in T8
 *  - the 15f launch punish is df+1,4
 *  - EWGF is +5 on block; its effective punish speed is 13f
 *  - Heat engagers: df+1,2 · b+4 · b+1+2 · db+1,2 · f,F+2
 */

export const kazuya: Character = {
  id: "kazuya",
  name: "Kazuya",
  style: "Mishima Style Fighting Karate",
  tagline:
    "Precise movement, lethal counter-hits, and the scariest 50/50 in the game — earned one skill at a time.",
  available: true,
  accent: { base: "#a855f7", bright: "#d8b4fe", deep: "#7e22ce" },
  electric: true,
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT                                          */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement",
      focus: "The Mishima engine",
      description:
        "Kazuya is a movement character before he is anything else. Every threat he has — electrics, hellsweeps, whiff punishment — is delivered out of dashes. Build the engine first.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "Closes distance fast and lets you block immediately after. Dash-blocking is how you approach without giving the opponent a free hit.",
          whenToUse:
            "Any time you're out of range and the opponent isn't actively swinging. Dash in, block, observe. Approaching safely is a skill most players skip.",
          leverlessTip:
            "Tap f twice with a clean neutral between the taps — if the first f is still registered the second tap won't read as a dash. On leverless the release IS the neutral, so lift the finger fully between presses.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash in from round-start range and return to block without getting hit by the CPU (set CPU to jab periodically).",
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
            "Creates space and makes attacks whiff in front of you. In Tekken, making a move whiff is the beginning of most big damage.",
          whenToUse:
            "After blocking a string that leaves the opponent close, or in neutral when you expect them to press. Backdash out of range, then punish the whiff.",
          leverlessTip:
            "Same rule as the forward dash: full release between the two b presses. Practice the rhythm b · (neutral) · b until the dash comes out every single time.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash out of the CPU's jab range so the jab whiffs cleanly in front of you.",
          },
          difficulty: "easy",
          tags: ["fundamental"],
        },
        {
          id: "kbd-cancel",
          stageId: "movement",
          name: "Backdash Cancel",
          notation: "b,b~db",
          purpose:
            "Cancels the backdash recovery with a crouch input so you can backdash again sooner. One cancel is the building block of the Korean backdash.",
          whenToUse:
            "This is a training-mode skill first. You're learning to cut a backdash short — chain them later and you retreat faster than anyone can walk forward.",
          leverlessTip:
            "Hold b, then tap d while still holding b — that gives you db and cancels the dash. Release d, tap b again for the next dash. The pattern is b, b(hold), tap d, release, b. Keep the d tap short; holding it too long leaves you crouching.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "One clean backdash cancelled into crouch (b,b~db) without ducking or standing still.",
          },
          difficulty: "medium",
          tags: ["execution"],
        },
        {
          id: "kbd-consistency",
          stageId: "movement",
          name: "Korean Backdash",
          notation: "b,b~db, b,b~db, ...",
          purpose:
            "Chained backdash cancels. This is the fastest way to move backward in Tekken and the core of high-level defense.",
          whenToUse:
            "Whenever you want out: escaping wall pressure, resetting to your preferred range, or baiting a whiff at max distance. A good KBD makes half the cast's offense stop working.",
          leverlessTip:
            "The loop is b, b~db, b, b~db... — on leverless keep your b finger anchored and drum the d taps with a second finger. Consistency comes from rhythm, not speed. Slow, even reps first; speed arrives on its own.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "One full-screen retreat (round start to the wall) using only chained backdash cancels, no gaps.",
          },
          difficulty: "hard",
          tags: ["execution", "defense"],
        },
        {
          id: "crouch-dash",
          stageId: "movement",
          name: "Crouch Dash",
          notation: "f,n,d,df",
          purpose:
            "The Mishima forward dash that ducks under highs while it travels. Every signature Kazuya move — electric, hellsweep, Thunder God Fist — comes out of this motion.",
          whenToUse:
            "As an approach that beats jab-happy opponents: the dash goes under highs, and the opponent must respect what comes out of it. Learn the motion in isolation before attaching moves to it.",
          leverlessTip:
            "The motion is f → neutral → d → df. On leverless: tap f, release everything, press d, then add f while holding d (d+f together = df). The rhythm is f · d · +f. The full release after the first f matters — SOCD cleaning won't save you if f is still held when d comes in.",
          drill: {
            type: "consecutive-reps",
            target: 10,
            rep: "One clean crouch dash — Kazuya visibly slides forward in the low stance, no accidental crouch or standing forward dash.",
          },
          difficulty: "medium",
          tags: ["execution", "mishima"],
        },
        {
          id: "wavedash",
          stageId: "movement",
          name: "Wavedash",
          notation: "f,n,d,df ×n",
          purpose:
            "Chained crouch dashes. Constant forward pressure where every step threatens a mid launcher or a low sweep. This is a different skill from a single crouch dash — the transition between dashes is the hard part.",
          whenToUse:
            "When the opponent is scared. A wavedashing Kazuya forces a decision every half-second: stand and eat the sweep, or duck and eat the electric. You don't attack out of every wave — the movement itself is the threat.",
          leverlessTip:
            "After each df, release back to neutral and immediately restart: f · d · +f, release, f · d · +f. Don't rush the neutral — a skipped release turns the next dash into a crouch. Some players buffer the next f during the dash animation; find a tempo you can hold for a full stage length.",
          drill: {
            type: "consecutive-reps",
            target: 3,
            rep: "Five connected crouch dashes in a row without breaking the chain (one rep = one 5-dash wave).",
          },
          difficulty: "hard",
          tags: ["execution", "mishima", "pressure"],
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
      focus: "What each button buys you",
      description:
        "Kazuya's pokes are honest — fewer, slower, and more deliberate than most of the cast. Each one exists to solve a specific problem. Know the problem before you press the button.",
      items: [
        {
          id: "jab",
          stageId: "pokes",
          name: "Jab & 1,2",
          notation: "1 / 1,2",
          purpose:
            "Your fastest button (i10) and it's +1 on block. The jab checks people who press into you and starts your turn up close. 1,2 jails on block for safe pressure.",
          whenToUse:
            "Interrupt strings with gaps, stop dash-ins, and reassert your turn after a blocked plus move. When in doubt at close range, jab beats almost everything the opponent can start.",
          leverlessTip:
            "Nothing exotic — but practice confirming 1 into 1,2 rather than mashing the full string. On leverless it's easy to double-tap faster than you can react; slow down and watch the first hit.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Interrupt the CPU (set to attack after blocking) with a jab, then finish 1,2 only when the jab connects.",
          },
          difficulty: "easy",
          tags: ["high", "your fastest button"],
          moveKeys: ["jab"],
        },
        {
          id: "one-one-two",
          stageId: "pokes",
          name: "Flash Punch Combo",
          notation: "1,1,2",
          purpose:
            "A 10-frame string ending in a mid that knocks down. This is your fastest meaningful damage and your bread-and-butter punish — but the last hit is -17, so it's not a pressure tool.",
          whenToUse:
            "Almost exclusively as punishment when a move is -10 or worse, or as a hit-confirm from the double jab. Throwing the full string at a blocking opponent hands them a launch.",
          leverlessTip:
            "Drum 1,1 with one finger or two-finger piano, then hit 2 as a distinct third press. Practice stopping at 1,1 on block — the discipline matters more than the input.",
          drill: {
            type: "consecutive-reps",
            target: 10,
            rep: "Full 1,1,2 on a CPU that just whiffed or got jabbed — and stop at 1,1 whenever the first jab is blocked.",
          },
          difficulty: "easy",
          tags: ["punish", "knockdown"],
          moveKeys: ["flash-punch"],
        },
        {
          id: "df1",
          stageId: "pokes",
          name: "df+1",
          notation: "df+1",
          purpose:
            "Your generic mid check — with a Kazuya-specific catch: it's i15, noticeably slower than the i13 df+1 most characters get. It stops people from ducking, but it will not win speed contests.",
          whenToUse:
            "To check an opponent who's started ducking your highs or crouching under pressure. Because it's i15, use it when you have advantage or space — not as a panic button. The follow-ups (df+1,2 heat engager and df+1,4 launcher) make people afraid to press after blocking it.",
          leverlessTip:
            "df on leverless is d+f pressed together. Press both with 1 in one motion — d, f and 1 nearly simultaneous. If you get d+1 instead, your f is landing late; lead with the direction fingers.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land df+1 on a crouching CPU — the situation it exists for.",
          },
          difficulty: "easy",
          tags: ["mid", "crouch check"],
          moveKeys: ["df1", "df1-2", "df1-4"],
        },
        {
          id: "f4",
          stageId: "pokes",
          name: "f+4",
          notation: "f+4",
          purpose:
            "A mid kick that is PLUS on block (+4) and forces crouch. One of the few Kazuya buttons that lets you keep your turn even when they block it.",
          whenToUse:
            "As your pressure starter at mid range. Blocked f+4 leaves the opponent crouching at -4 — your follow-up mids beat almost anything they try. It's i19, so it loses up close to fast buttons; use it at the edge of its range.",
          leverlessTip:
            "Hold f briefly rather than tapping it with 4 — a tap can drop the f and give you a naked 4. f held + 4 pressed is the reliable version.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Blocked f+4 followed immediately by df+1 — feel what +4 into a mid means for the opponent.",
          },
          difficulty: "easy",
          tags: ["mid", "plus on block"],
          moveKeys: ["f4"],
        },
        {
          id: "b4",
          stageId: "pokes",
          name: "b+4",
          notation: "b+4",
          purpose:
            "A homing high that is a heat engager. It catches sidesteps, is only -5 on block, and on hit converts directly into your heat game.",
          whenToUse:
            "The moment an opponent starts stepping your wavedash or your df+1. One or two b+4s and they stop moving — which is exactly what your 50/50 wants.",
          leverlessTip:
            "Press b and 4 together cleanly. If you're coming out of backdash, wait for the dash to finish or you'll get a second backdash — b+4 from movement needs a beat of neutral first.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Catch a sidestepping CPU (set CPU to sidestep) with b+4.",
          },
          difficulty: "easy",
          tags: ["high", "homing", "heat engager"],
          moveKeys: ["b4"],
        },
        {
          id: "d4",
          stageId: "pokes",
          name: "d+4",
          notation: "d+4",
          purpose:
            "A fast (i12) low poke that crushes highs early in its animation. Small damage, but it forces the opponent to start blocking low — which is how your mids start landing.",
          whenToUse:
            "As chip and conditioning at close range, especially against opponents standing still and blocking high. It's -4 even on hit, so poke and reset — don't press again afterward.",
          leverlessTip:
            "Simple d+4 — but practice returning to guard immediately. On leverless it's tempting to stay on d; release to neutral or hold b so you're blocking during recovery.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Land d+4, then immediately block the CPU's counterattack — the poke AND the reset.",
          },
          difficulty: "easy",
          tags: ["low", "high crush"],
          moveKeys: ["d4"],
        },
        {
          id: "d1",
          stageId: "pokes",
          name: "d+1",
          notation: "d+1",
          purpose:
            "An i10 crouching jab that crushes highs. Your fastest way to go under a predictable jab or high string while staying threatening.",
          whenToUse:
            "When you read a high — the opponent mashing jab after your plus frames, or a high-ending string you know. It leaves you crouching, so ws+4 or ws+1,2 is your natural follow-up threat.",
          leverlessTip:
            "After d+1 you're in crouch: practice rolling d into df+ or straight into ws buttons by releasing d. The d+1 → release → ws+4 pipeline should feel like one motion.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Duck a jabbing CPU with d+1, then follow with ws+4 as you rise.",
          },
          difficulty: "medium",
          tags: ["special low", "high crush"],
          moveKeys: ["d1"],
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
      focus: "The Electric, treated as a skill",
      description:
        "Kazuya has no hopkick and his df+2 only launches on counter-hit. His launch game is earned through execution — above all the Electric Wind God Fist, built here in three deliberate steps.",
      items: [
        {
          id: "ewgf-input",
          stageId: "launchers",
          name: "EWGF — The Input",
          notation: "f,n,d,df+2",
          purpose:
            "The Electric Wind God Fist: a launching high that is +5 ON BLOCK. The just-frame version of Wind God Fist — 2 must land on the exact frame df registers. This item is only about producing the spark.",
          whenToUse:
            "Nowhere yet. In training mode, the electric version flashes blue lightning and recovers fast; the plain WGF (still a launcher, but -10 on block) is your tell that the timing was off. Learn to see the difference instantly.",
          leverlessTip:
            "Sequence: tap f, full release, press d, then press f AND 2 on the same frame while d is still held. That simultaneous df+2 is the entire just-frame. Most leverless players hit f and 2 with two fingers of the same hand motion — one physical 'chord' after the d press. If you get WGF, your 2 is late; if you get nothing, your f release was dirty.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "One electric (blue lightning, not plain WGF), any speed, from standstill.",
          },
          difficulty: "hard",
          tags: ["just frame", "launcher", "plus on block"],
          moveKeys: ["ewgf", "wgf"],
        },
        {
          id: "ewgf-consistency",
          stageId: "launchers",
          name: "EWGF — Consistency",
          notation: "f,n,d,df+2",
          purpose:
            "One electric proves the timing exists. Five in a row proves you own it. Consistency is what turns the electric from a party trick into a weapon you can bet a round on.",
          whenToUse:
            "Still training mode. The target is a repeatable motion under zero pressure — because match pressure will tax whatever consistency you bring, it needs to start high.",
          leverlessTip:
            "Groove the rhythm at one fixed tempo before chasing speed: f · d · chord. If your hands tense up after two or three, shake out and restart — tension is the main killer of just-frame consistency on leverless.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "One electric, in a row without a plain WGF or dropped input between them.",
          },
          difficulty: "hard",
          tags: ["just frame", "execution"],
          moveKeys: ["ewgf"],
        },
        {
          id: "ewgf-movement",
          stageId: "launchers",
          name: "EWGF — From Movement",
          notation: "wavedash → f,n,d,df+2",
          purpose:
            "The electric you'll actually use comes out of a wavedash or after a backdash — never from a polite standstill. This merges Stage 1 movement with the just-frame.",
          whenToUse:
            "This is the version that wins neutral: wavedash toward the opponent and the electric fires from the dash you're already in. Out of a backdash, it's your whiff punisher.",
          leverlessTip:
            "From a crouch dash you're already at df — so a wavedash electric is: complete the CD motion, release, then the full f · d · chord again. Don't try to shortcut by mashing 2 during the dash; the just-frame still requires the fresh df+2 chord.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "One electric fired directly out of a wavedash (at least two dashes deep).",
          },
          difficulty: "expert",
          tags: ["just frame", "movement", "neutral"],
          moveKeys: ["ewgf"],
        },
        {
          id: "df2-ch",
          stageId: "launchers",
          name: "df+2",
          notation: "df+2",
          purpose:
            "An i14 HOMING mid that launches on counter-hit only — on normal hit it's just +5. This is your keep-out button: it catches steps and crumples anyone pressing into it.",
          whenToUse:
            "When the opponent likes to press or step after blocking something. It's -12 on block, so it's a read, not a poke — but the counter-hit crumple converts into a full combo. Unlike most of the cast, this is NOT a whiff-punish launcher; that job belongs to the electric.",
          leverlessTip:
            "Same df chord as df+1: d and f and 2 arriving together. Practice it as a deliberate single press, not part of a dial — you throw this on a read, standing your ground.",
          drill: {
            type: "total-reps",
            target: 5,
            rep: "Counter-hit launch a CPU set to jab after block — block their poke, then interrupt the next one with df+2.",
          },
          difficulty: "medium",
          tags: ["mid", "homing", "CH launcher"],
          moveKeys: ["df2"],
        },
        {
          id: "ff3",
          stageId: "launchers",
          name: "f,f+3",
          notation: "f,F+3",
          purpose:
            "A long-range mid kick that launches on NORMAL hit and is only -3 on block. Your safest launcher and your keep-out counter to approaches.",
          whenToUse:
            "From range, when the opponent dashes in carelessly or whiffs something slow at distance. It's i20, so it's not a punish for small minuses — it's a neutral skim that happens to launch. When they start blocking it, you're plus enough at range that nothing bad happens.",
          leverlessTip:
            "Hold the second f while pressing 3 — the running-move input wants f held, not tapped. From a forward dash, just add 3 while still holding f.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Launch a CPU set to dash in / whiff with f,f+3 from range, and convert (any juggle).",
          },
          difficulty: "medium",
          tags: ["mid", "launcher", "safe on block"],
          moveKeys: ["ff3"],
        },
        {
          id: "ws2",
          stageId: "launchers",
          name: "ws+2",
          notation: "ws+2",
          purpose:
            "A homing while-standing mid that crumples for a full combo. Your reward for ducking things on purpose — the reason opponents can't throw highs at a crouching Kazuya.",
          whenToUse:
            "After ducking a high on a read (or a high-ending string you've labbed). It's i16 and -18 on block, so it's strictly a punish/read tool — but the payoff is a full launch. For faster crouch punishes, ws+1,2 (i13) launches too; that's covered in Punishment.",
          leverlessTip:
            "The 'while standing' state comes from releasing d — so the input is: hold d (crouch under the high), release, then 2 during the rise. Practice the release timing; pressing 2 while d is still held gives you a crouch jab instead.",
          drill: {
            type: "total-reps",
            target: 5,
            rep: "Duck a high (CPU set to jab strings) and launch the follow-up with ws+2.",
          },
          difficulty: "medium",
          tags: ["mid", "homing", "crumple launcher"],
          moveKeys: ["ws2"],
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
        "Punishment is the most reliable damage in Tekken — the opponent hands it to you. Kazuya's punish ladder is short and brutal. Learn one response per frame range until it's reflex.",
      items: [
        {
          id: "punish-10f",
          stageId: "punishment",
          name: "10f Punish",
          notation: "1,1,2",
          purpose:
            "Your answer to anything -10 to -11: 25 damage and a knockdown. Fast, consistent, no execution barrier — which is why it should be automatic before anything fancier.",
          whenToUse:
            "Blocked -10 moves: most strings' final hits, many jab strings, lots of common pokes. If you're not sure how minus something is, 1,1,2 is the punish that always comes out in time.",
          leverlessTip:
            "Buffer the string during blockstun — drum 1,1,2 the instant you feel the block. It will come out the first frame you're free. Punishing late is the same as not punishing.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "Punish a blocked -10 move (use practice mode punishment training) with the full 1,1,2.",
          },
          difficulty: "easy",
          tags: ["punish", "knockdown"],
          moveKeys: ["flash-punch"],
        },
        {
          id: "punish-12f",
          stageId: "punishment",
          name: "11–12f Punish",
          notation: "b+1,2 / 1+2",
          purpose:
            "b+1,2 (i11, 30 damage) is your heaviest fast punish; 1+2 (i12) knocks the opponent airborne for extra damage at the wall. These cover the -11 to -13 range where 1,1,2 works but underpays.",
          whenToUse:
            "Blocked moves in the -11 to -13 range — many mids and heavier pokes recover here. Knowing you get 30 instead of 25 seems small; over a set it decides rounds.",
          leverlessTip:
            "b+1,2: press b with 1, then 2 immediately — the string is tight. Buffer b during blockstun so only 1,2 remains to time. For 1+2, hit both punches as one clean chord.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "Punish a blocked -11/-12 move with b+1,2 (or 1+2), not with the lazier 1,1,2.",
          },
          difficulty: "medium",
          tags: ["punish"],
          moveKeys: ["b1-2", "one-plus-two"],
        },
        {
          id: "punish-13f",
          stageId: "punishment",
          name: "13f Punish — Electric",
          notation: "f,n,d,df+2 / db+1,2",
          purpose:
            "At -13, Kazuya gets a full combo: the electric's effective punish speed is 13 frames. This is where his punishment stops being good and becomes terrifying. db+1,2 is the execution-free backup — 30 damage and a heat engager.",
          whenToUse:
            "Blocked -13 or worse without launch-level minus: think many strings and stubby launchers. If your electric confidence is shaky mid-match, db+1,2 pays well and builds heat — a real choice, not a consolation prize.",
          leverlessTip:
            "Buffer the crouch dash during blockstun: f · d while still in block, then the df+2 chord as stun ends. The buffer window is generous — it's the same motion, started early. This is THE reason electrics from Stage 3 had to become automatic.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Punish a blocked -13 move with an electric (buffered during blockstun) and convert to a combo.",
          },
          difficulty: "expert",
          tags: ["punish", "launcher"],
          moveKeys: ["ewgf", "db12"],
        },
        {
          id: "punish-15f",
          stageId: "punishment",
          name: "15f Launch Punish",
          notation: "df+1,4",
          purpose:
            "At -15 (blocked launchers, big lows), df+1,4 launches for a full combo with none of the electric's execution tax. df+1,2 is the same start but banks a heat engager instead — take it when you want heat over the juggle.",
          whenToUse:
            "Blocked hopkicks, blocked sweeps, anything -15 or worse. Note this replaces the classic 'df+2 as launch punish' instinct from other games — in Tekken 8, Kazuya's df+2 does NOT launch grounded opponents on normal hit.",
          leverlessTip:
            "Buffer df+1 during blockstun, confirm it's punishing, then 4. Because it starts with your df+1, the same chord discipline from Stage 2 applies — direction fingers a hair before the button.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Launch punish a blocked -15 move with df+1,4 and convert with any juggle.",
          },
          difficulty: "medium",
          tags: ["punish", "launcher"],
          moveKeys: ["df1-4", "df1-2"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouch Punishment",
          notation: "ws+4,4 / ws+1,2",
          purpose:
            "The lows that hit you are also minus — while crouching, ws+4,4 (i11, 29 damage) punishes small minuses and ws+1,2 (i13) launches into a full combo with a Tornado built in.",
          whenToUse:
            "After blocking a low: -11 to -12 gets ws+4,4, -13 or worse gets ws+1,2 into ~60+ damage. Blocking a hellsweep-class low and answering with a jab is the most commonly donated damage in Tekken — stop donating.",
          leverlessTip:
            "You're already holding d to block the low. Release d and press the buttons during the rise — for ws+1,2 the 1 then 2 are two distinct presses, not a chord. Practice from down-back block, since that's where your hands will actually be.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Block a low (CPU set to sweep) and punish: ws+4,4 for small minus, ws+1,2 launch for -13 or worse.",
          },
          difficulty: "medium",
          tags: ["while standing", "punish"],
          moveKeys: ["ws44", "ws12"],
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
      focus: "Practical damage, not maximums",
      description:
        "You now launch people — get paid every time. These routes are the current Season 3 staples: practical first, optimal second. A combo you never drop beats one that's 5 damage bigger on paper.",
      items: [
        {
          id: "combo-core",
          stageId: "combos",
          name: "Universal BnB",
          notation: "3,1,4 → df+1,df+2 T! → 3,1~df~3",
          purpose:
            "One juggle that works from your regular launchers (f,f+3, df+1,4, ws+2 pickup and friends): 3,1,4 lifts, df+1,df+2 is your Tornado, and 3,1 into crouch-dash 3 carries them to the wall.",
          whenToUse:
            "Any launch that isn't an electric. Learning ONE route for every regular launcher means zero decision time when the launch actually happens — the combo starts itself.",
          leverlessTip:
            "The ender 3,1~df~3 means: 3,1, then slide into the df crouch-dash chord and press 3 out of the dash. It's your Stage 1 crouch dash spliced into a combo — same f·d·+f rhythm, with a 3 at the end.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full BnB off a f,f+3 launch without dropping: 3,1,4 → df+1,df+2 T! → 3,1~df~3.",
          },
          difficulty: "medium",
          tags: ["EASY", "bnb", "wall carry"],
        },
        {
          id: "combo-ewgf",
          stageId: "combos",
          name: "Electric Staple",
          notation: "EWGF → b+2,2 → df+1,df+2 T! → 3,1~df CD+3",
          purpose:
            "The Season 3 electric route — around 51 damage with strong carry. b+2,2 is the pickup, df+1,df+2 the Tornado, and the crouch-dash 3 ender leaves them at your feet.",
          whenToUse:
            "Every electric launch: punish, whiff punish, or neutral hit. The double-electric version (EWGF, micro-sidestep, EWGF, then the same route) is the optimization — add it only after this one is drop-proof.",
          leverlessTip:
            "The hard link is landing b+2,2 after the electric: you're recovering from a df chord and must get cleanly to b. Release everything after the electric, then b+2 as one deliberate press. Rushing the b is the drop.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full staple off an electric launch: EWGF → b+2,2 → df+1,df+2 T! → 3,1 into CD+3.",
          },
          difficulty: "hard",
          tags: ["OPTIMIZED", "ewgf", "~51 dmg"],
        },
        {
          id: "combo-wall",
          stageId: "combos",
          name: "Wall Combo",
          notation: "df+1,4 → 1+2  (basic: df+3+4,1,2)",
          purpose:
            "When a juggle splats them on the wall, the wall combo is pure bonus damage. df+1,4 → 1+2 is the practical standard; df+3+4,1,2 is the simpler fallback that always connects.",
          whenToUse:
            "After any wall splat — from a carried juggle or a raw hit near the wall. Higher splats fit the extended df+1,4 → df+1,df+2 → df+3+4,1,2 route; when unsure of the height, take the basic ender rather than whiffing greed.",
          leverlessTip:
            "Wall combos are about timing, not motion: wait for the wall-splat animation to settle before df+1,4. Early inputs whiff under them. Watch the character, not your hands.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Carry a BnB to the wall and land a clean wall ender (df+1,4 → 1+2 or df+3+4,1,2).",
          },
          difficulty: "medium",
          tags: ["WALL"],
        },
        {
          id: "combo-heat",
          stageId: "combos",
          name: "Heat Combo",
          notation: "launch → b+2,2 → df+1,df+2 T! → 2+3 → df+1,2~f !HD → uf+3",
          purpose:
            "Spending Heat Burst (2+3) mid-combo and Heat Dashing off df+1,2 converts a standard juggle into ~55+ with massive carry. This is your kill-round route — and remember that during heat, every Wind God Fist comes out as an electric automatically.",
          whenToUse:
            "When the extra damage closes a round or the carry reaches a wall that plain routes can't. It spends your heat — so use it to KILL, not to style on a full-health opponent.",
          leverlessTip:
            "The heat dash is df+1,2 with f held/tapped during the engager — notated df+1,2~f. Treat 2+3 as a strict chord; a mistimed 2+3 mid-juggle drops everything. Practice the tail (2+3 → df+1,2~f → uf+3) in isolation first.",
          drill: {
            type: "consecutive-reps",
            target: 3,
            rep: "Full heat route off any launch, ending in the heat-dash extension, without a drop.",
          },
          difficulty: "hard",
          tags: ["HEAT", "~55 dmg", "kill route"],
        },
        {
          id: "combo-ch-df2",
          stageId: "combos",
          name: "Counter-hit Conversions",
          notation: "CH df+2 → df+3 → df+1,df+2 T! → 3,1~df CD+3",
          purpose:
            "Your counter-hit tools (df+2 crumple, ws+1,2 launch) have their own pickups. df+3 lifts the df+2 crumple into the same Tornado route you already know.",
          whenToUse:
            "Every time df+2 counter-hits. The crumple is slow and generous — the only way to waste it is panic. One calm df+3 and you're back in familiar territory.",
          leverlessTip:
            "The df+3 pickup is unhurried — watch the crumple, then the df chord with 3. For ws+1,2 launches, the pickup is ws+1+2 → b+2,2 → b+2,2,1+2; you're already crouched, so it flows from the launch itself.",
          drill: {
            type: "consecutive-reps",
            target: 3,
            rep: "CH df+2 (CPU set to press) into the full conversion: df+3 → df+1,df+2 T! → 3,1 into CD+3.",
          },
          difficulty: "medium",
          tags: ["counter-hit", "conversion"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 06 — MIXUPS & PRESSURE                                 */
    /* ------------------------------------------------------------ */
    {
      id: "mixups",
      number: 6,
      name: "Mixups & Pressure",
      focus: "Making them guess wrong",
      description:
        "Everything so far was about being correct. This stage is about making the OPPONENT incorrect. Every tool here exists to force a decision — and punish whichever one they make.",
      items: [
        {
          id: "hellsweep",
          stageId: "mixups",
          name: "Hellsweep",
          notation: "f,n,d,DF+4,1",
          purpose:
            "The low half of the Mishima 50/50: a crouch-dash low that knocks down into guaranteed follow-up damage. Blocked, it's -23 — a free launch for them. It's a bet, and you should know the stakes before placing it.",
          whenToUse:
            "Against an opponent standing still, frozen by your wavedash. The ,1 follow-up connects when the sweep trips them. If they ever block it, you eat a launcher — which is exactly why it can't be your only crouch-dash threat.",
          leverlessTip:
            "Same crouch dash, but hold the df (keep d+f pressed) and hit 4 — the notation DF means the direction is held, not tapped. From a wavedash: on the final dash, keep the chord held and press 4, then 1 on the trip.",
          drill: {
            type: "consecutive-reps",
            target: 10,
            rep: "Hellsweep with the ,1 follow-up out of a wavedash — sweep connects, follow-up lands.",
          },
          difficulty: "hard",
          tags: ["low", "knockdown", "launch punishable"],
          moveKeys: ["hellsweep", "hellsweep1"],
        },
        {
          id: "fifty-fifty",
          stageId: "mixups",
          name: "The 50/50",
          notation: "CD → hellsweep / EWGF",
          purpose:
            "The famous Mishima coin flip: out of the same crouch dash, hellsweep hits standing blockers and the electric launches duckers. There is no correct defense — only guesses.",
          whenToUse:
            "When the opponent has stopped pressing and started guarding — usually after your wavedash has scared them stationary (Stage 1 paying off). Vary the timing: wave once then sweep, wave three times then electric. Predictable rhythm is the only counterplay you can give them.",
          leverlessTip:
            "Both options exit the same f·d·+f chord — the sweep holds the chord and presses 4, the electric releases and re-enters with 2. Drill switching between them cold, because your hands will otherwise default to whichever you practiced more.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "From a wavedash, call your option OUT LOUD before the dash, then execute it: 5 sweeps and 5 electrics, mixed order.",
          },
          difficulty: "expert",
          tags: ["mixup", "mishima", "50/50"],
          moveKeys: ["hellsweep1", "ewgf"],
        },
        {
          id: "ff2",
          stageId: "mixups",
          name: "Devil Fist",
          notation: "f,F+2",
          purpose:
            "An i16 lunging mid, heat engager, that forces crouch on hit (+13) and is only -9 blocked. Your mid-range battering ram: it starts pressure on hit and starts heat whenever you want it.",
          whenToUse:
            "As the approach when wavedashing in feels too risky, and as your heat activation of choice — on hit the opponent is crouching at -13 in front of you, and your entire mid arsenal is free. Also a fine long-range whiff punish when the electric window is gone.",
          leverlessTip:
            "Hold the second f and press 2 — same running-input rule as f,f+3. Out of a forward dash it's just 2 while f is still held, which makes dash-up Devil Fist one of your easiest strong options.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Hit f,F+2 from mid range, then immediately follow the +13 with a mid (df+1 or f+4) before the CPU can stand-block.",
          },
          difficulty: "medium",
          tags: ["mid", "heat engager", "forces crouch"],
          moveKeys: ["ff2"],
        },
        {
          id: "d1-2-low",
          stageId: "mixups",
          name: "d+1+2",
          notation: "d+1+2",
          purpose:
            "Your other real low: slower (i23) but it high-crushes, hits hard, and LAUNCHES on counter-hit. Where hellsweep punishes stillness, d+1+2 punishes movement and button-pressing.",
          whenToUse:
            "Against opponents pressing or backing off outside hellsweep range. It's -14 blocked — punishable but not launchable, a meaningfully cheaper bet than the sweep. On counter-hit, you're picking them up for a full combo.",
          leverlessTip:
            "d held with a clean 1+2 chord. Since it crushes highs from frame 6, it works as a delayed 'they always jab here' answer — input it slightly late on purpose and let the crush do the work.",
          drill: {
            type: "total-reps",
            target: 8,
            rep: "Counter-hit a pressing CPU with d+1+2 and convert the launch.",
          },
          difficulty: "medium",
          tags: ["low", "CH launcher", "high crush"],
          moveKeys: ["d1plus2"],
        },
        {
          id: "wavedash-pressure",
          stageId: "mixups",
          name: "Wavedash Pressure",
          notation: "CD → df+1 / f+4 / throw / block",
          purpose:
            "The 50/50 is the threat; this is the tax. Mixing safe mids, throws, and plain blocking into your wavedash means the opponent can't solve you by mashing — the scary options stay scary because the safe ones exist.",
          whenToUse:
            "When wavedashing against someone who presses buttons at it. CD into block catches their mash with your punishment stage; CD into df+1 checks their duck; a throw takes the passive ones. Only once they stop pressing do the sweep and electric come back out.",
          leverlessTip:
            "Practice EXITING the crouch-dash chord to neutral/block instantly — release everything and hold b. The ability to wavedash and then just block is what makes the whole act sustainable against good players.",
          drill: {
            type: "total-reps",
            target: 10,
            rep: "Wavedash up and end with a NON-committal option (df+1, f+4, throw, or clean block) against a CPU set to random attack — without eating a hit.",
          },
          difficulty: "hard",
          tags: ["pressure", "mishima"],
        },
        {
          id: "conditioning",
          stageId: "mixups",
          name: "Conditioning",
          notation: "—",
          purpose:
            "Mixups aren't random — they're scripted. You show mids until blocking high becomes a habit, then the lows print. Every option you throw should be chosen by what you've taught them, not by your own boredom.",
          whenToUse:
            "Constantly. Ask before every committal option: what have I trained this opponent to do? If you haven't landed df+1 and f+4 a few times, the hellsweep isn't 'mixing' anyone — it's a coin you're flipping against yourself.",
          leverlessTip:
            "None — this one lives entirely between the ears. If anything: because leverless makes your execution consistent, your PATTERNS become the readable thing. Vary the script, not the inputs.",
          drill: {
            type: "manual",
            checklist: [
              "I opened with mids/pokes for the first exchanges before throwing any committal low",
              "I watched whether the opponent ducked, stepped, pressed, or froze after blocking my mids",
              "I chose a low only AFTER seeing them commit to standing guard",
              "I punished their adaptation (ducking = electric/mid, pressing = df+2/block-punish)",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "mind game"],
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
        "Kazuya defense is not about a magic button — he doesn't have one. It's about movement, frame knowledge, and refusing the panic options that lose rounds. Every item here is a decision, drilled.",
      items: [
        {
          id: "duck-discipline",
          stageId: "defense",
          name: "When to Duck",
          notation: "d (on a read) → ws+2 / ws+1,2",
          purpose:
            "Ducking is a read with a payoff attached: crouch under a committed high and your while-standing launchers turn their pressure into your combo. Ducking randomly, though, is how you eat every mid in their movelist.",
          whenToUse:
            "Duck when you KNOW: a string that always ends high, a throw habit, a jab-happy rhythm. Don't duck 'because pressure' — that's a guess dressed up as defense. One labbed high-ender per opponent character is worth more than ten hopeful crouches.",
          leverlessTip:
            "A read-duck is a committed HOLD of d, not a tap — then release into ws+2. Practice the hold-release-launch as one planned action so the reward is automatic when the read is right.",
          drill: {
            type: "manual",
            checklist: [
              "I know at least 3 common strings (any characters) that end in duckable highs",
              "I ducked on a specific read this session — not as a reflex under pressure",
              "I converted a ducked high into ws+2 or ws+1,2 at least once",
              "I recognized a moment where ducking would have eaten a mid — and didn't",
            ],
          },
          difficulty: "medium",
          tags: ["defense", "decision"],
        },
        {
          id: "sidestep",
          stageId: "defense",
          name: "Sidestep Discipline",
          notation: "u~n / d~n (step) → block",
          purpose:
            "Tekken is 3D — stepping a linear move beats blocking it, because the whiff you create is a launch you collect. Step-BLOCK, though, not step-and-pray: the block covers the tracking moves your step loses to.",
          whenToUse:
            "Against linear offense: jab strings, most df+1s, running moves. Step after your minus frames to make their 'my turn' button whiff. Homing moves (like your own b+4 and df+2) exist to punish stepping — respect that they have them too.",
          leverlessTip:
            "A step is a single tap of u or d back to neutral, then immediately hold b to block. On leverless the tap-release is crisp — the discipline is the b afterward. Drill tap-u, hold-b until the block is part of the step.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 7,
            rep: "Sidestep a linear CPU attack (set CPU to jab or df+1) into block — and punish the whiff with at least a 1,1,2.",
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
            "Stage 4 gave you the punishes; this gives you the trigger. Recognizing WHICH minus you just blocked — in real time, against real strings — is what separates knowing punishment from doing it.",
          whenToUse:
            "Every single blocked move. The habits: big slow move blocked = launch it (df+1,4 or electric); sweep blocked = ws+1,2; string ender blocked = at least 1,1,2. When genuinely unsure, the 10f punish is the answer that never whiffs into a launcher.",
          leverlessTip:
            "Buffer punishes during blockstun as one rehearsed motion per frame-range — your hands should hold the answer while your eyes make the call.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 8,
            rep: "In punishment training with MIXED moves (-10 to -15), choose the correct-tier punish — right response, not just any response.",
          },
          difficulty: "hard",
          tags: ["defense", "punish", "recognition"],
        },
        {
          id: "movement-defense",
          stageId: "defense",
          name: "Movement as Defense",
          notation: "backdash → whiff → EWGF",
          purpose:
            "The best defense in Tekken is being somewhere the attack isn't. A backdash that makes a move whiff doesn't just avoid damage — it creates the whiff-punish launch you built three stages of execution for.",
          whenToUse:
            "When minus but not cornered: backdash instead of pressing or freezing. Their follow-up whiffs in front of you, and the electric (or f,f+3 from farther out) collects. This loop — retreat, whiff, launch — is the core of high-level Kazuya defense.",
          leverlessTip:
            "The b of your backdash and the f that starts the electric fight for the same hand — the transition needs a clean release between them. Drill backdash → release → f·d·chord as its own compound skill; it will feel like patting your head and rubbing your stomach at first.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 6,
            rep: "Backdash a CPU attack into a clean whiff, then launch the whiff with EWGF (or f,f+3) before they recover.",
          },
          difficulty: "expert",
          tags: ["defense", "whiff punish", "movement"],
        },
        {
          id: "panic-control",
          stageId: "defense",
          name: "Panic Control & Heat Awareness",
          notation: "—",
          purpose:
            "Most health bars are lost to panic: mashing at plus frames, ducking at random, pressing into heat pressure. Defense concludes with the discipline to do NOTHING when nothing is correct.",
          whenToUse:
            "When the opponent activates heat: their chip and mixups are temporarily better — block more, let the timer burn, and note that heat engagers on block often leave them merely +1-ish, not unchallengeable. When YOU'RE minus: hold back is a complete answer. The urge to press is the round leaving your body.",
          leverlessTip:
            "Panic mash on leverless is usually 1+2 chords sprayed during blockstun — they buffer and lose you your turn. Train resting fingers OFF the buttons while blocking; touch them only when you've chosen an action.",
          drill: {
            type: "manual",
            checklist: [
              "I blocked through an entire heat activation without pressing into it",
              "I identified my own panic habit (mash, random duck, backdash into wall) by name",
              "I survived plus-frame pressure by holding guard until it was actually my turn",
              "I used movement — not a button — to escape at least one pressure sequence",
            ],
          },
          difficulty: "medium",
          tags: ["defense", "heat", "discipline"],
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
      focus: "The complete Kazuya round",
      description:
        "You have every piece: movement, pokes, launchers, punishment, combos, mixups, defense. This stage assembles them into a round structure — what Kazuya is actually trying to DO, from the first dash to the kill.",
      items: [
        {
          id: "gameplan-neutral",
          stageId: "gameplan",
          name: "Phase 1 — Neutral",
          notation: "backdash / dash-block / whiff → punish",
          purpose:
            "Kazuya's neutral is patient larceny: move at the edge of their range, invite the whiff, collect with the electric or f,f+3. You are not rushing them down yet — you are teaching them that swinging costs money.",
          whenToUse:
            "Round start and every reset to distance. Win condition: they either whiff into your launch, or they stop pressing entirely — which is when Phase 2 begins. If YOU'RE the one whiffing, you've become the customer.",
          leverlessTip:
            "This phase is your movement stack under match conditions: dash-block forward, KBD out, backdash-electric loaded. If execution wobbles under pressure, drop back to Stage 1 drills for a session — neutral exposes movement debt instantly.",
          drill: {
            type: "manual",
            checklist: [
              "I won an opening exchange this session by making a move whiff — not by attacking first",
              "I collected a whiff punish (electric or f,f+3) off deliberate spacing",
              "I approached with dash-block instead of raw attacks at least three times",
              "I noticed the moment an opponent stopped pressing in neutral",
            ],
          },
          difficulty: "hard",
          tags: ["gameplan", "neutral"],
        },
        {
          id: "gameplan-threat",
          stageId: "gameplan",
          name: "Phase 2 — Establish the Electric",
          notation: "EWGF (early, visibly)",
          purpose:
            "The electric must be SEEN to be feared. Landing one or two early — whiff punish, blocked +5 pressure, anything — installs the threat that powers everything else. An unseen electric protects nothing.",
          whenToUse:
            "Early in the set, even at moderate risk. A blocked electric is +5 — the safest 'threat display' in the game. Once they've eaten one launch, watch their behavior change: less pressing, more standing guard. That fear is a resource; the next two phases spend it.",
          leverlessTip:
            "Match-condition electrics have a tell: tension. If your first attempt of a set becomes WGF, breathe, and take the next clean chance rather than forcing reps. One clean electric shown beats three sloppy ones donated.",
          drill: {
            type: "manual",
            checklist: [
              "I landed or showed an electric within the first two rounds of a set",
              "I used a blocked electric's +5 to continue pressure at least once",
              "I observed the opponent pressing less after eating a launch",
              "I whiff-punished with an electric in a real match (or player-match session)",
            ],
          },
          difficulty: "expert",
          tags: ["gameplan", "threat"],
        },
        {
          id: "gameplan-condition",
          stageId: "gameplan",
          name: "Phase 3 — Spend the Fear",
          notation: "CD → hellsweep / d+1+2",
          purpose:
            "A feared electric makes people stand still and guard high — which is precisely when the lows print. This phase converts the respect Phase 2 bought into hellsweep knockdowns and d+1+2 counter-hits.",
          whenToUse:
            "Only after the mid threat is real. The tell that it's time: they block your wavedash motionless instead of challenging it. Sweep them. When they start ducking the sweep, the electric is a full launch again — the 50/50 is now self-sustaining and you are playing Kazuya.",
          leverlessTip:
            "This is the Stage 6 execution under stakes: clean exits from the CD chord into either option. If your hands default to one option under pressure, you're flipping a rigged coin — re-drill the switch.",
          drill: {
            type: "manual",
            checklist: [
              "I landed a hellsweep on an opponent I had first conditioned with mids",
              "I caught a duck attempt with a mid/electric after showing lows",
              "I mixed timing (immediate vs delayed) on my crouch-dash options",
              "I recognized when respect ran out — and went back to Phase 1 instead of forcing",
            ],
          },
          difficulty: "expert",
          tags: ["gameplan", "mixup"],
        },
        {
          id: "gameplan-pressure",
          stageId: "gameplan",
          name: "Phase 4 — Convert Advantage",
          notation: "heat / wall / oki",
          purpose:
            "Kazuya kills from advantage states: heat spends into guaranteed chip and the devil moveset, wall splats add free damage to every combo, and knockdowns hand you another mixup they must guess through. Advantage should snowball, not dissipate.",
          whenToUse:
            "Heat: activate through f,F+2 or b+4 when it either kills this round or powers a wall push — hoarded heat is wasted heat. Wall: steer carry combos toward it; your wall game turns 50 damage into 80. Oki after hellsweep or 1,1,2: they must rise into your mids eventually. Keep the boot on.",
          leverlessTip:
            "Advantage states add new inputs (heat smash 2+3, heat dash ~f) on top of practiced material. Rehearse the heat-round specifically: activation → chip pressure → smash-or-dash decision, so the kill sequence is muscle memory, not improvisation.",
          drill: {
            type: "manual",
            checklist: [
              "I activated heat with a purpose (kill or wall push) — not just because it was available",
              "I carried a combo to the wall and finished with a wall ender",
              "I ran oki after a knockdown instead of backing off for free",
              "I closed a round during heat with chip, smash, or the 50/50",
            ],
          },
          difficulty: "hard",
          tags: ["gameplan", "heat", "wall"],
        },
        {
          id: "gameplan-complete",
          stageId: "gameplan",
          name: "The Complete Round",
          notation: "neutral → threat → condition → pressure → defense",
          purpose:
            "The full loop, plus the part that saves rounds: when it goes wrong, defense (Stage 7) resets you to neutral instead of to the rematch screen. If you can name your current phase mid-round, you understand what Kazuya is trying to accomplish.",
          whenToUse:
            "Every round, as a running self-commentary: 'neutral... they whiffed, launch... they're scared, sweep... heat, wall, kill.' When you drop the thread — eating mixups, mashing minus — that's not a Kazuya problem, it's a phase problem. Find which phase you abandoned and re-enter the loop there.",
          leverlessTip:
            "Final execution audit: electrics from all entries (standstill, wavedash, backdash, blockstun buffer), both 50/50 exits, wall route, heat tail. Anything below ~80% under pressure gets its stage re-drilled. The curriculum is circular — mastery is maintenance.",
          drill: {
            type: "manual",
            checklist: [
              "I played a full set consciously naming my phase between rounds",
              "I recovered from a lost exchange by re-entering neutral instead of panicking",
              "I won at least one round where I could narrate WHY each phase transition happened",
              "I identified my weakest phase and know which stage of this curriculum re-trains it",
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
      situation: "You blocked a string ender. You're standing.",
      options: ["1,1,2", "b+1,2", "EWGF", "ws+4,4"],
      correctIndex: 0,
      explain:
        "Only the 10-frame string reaches. b+1,2 is i11 — one frame late. The electric's punish speed is 13f. ws+4,4 needs crouch.",
    },
    {
      id: "q-11",
      prompt: "-11",
      situation: "You blocked a heavier poke. Standing.",
      options: ["b+1,2", "1+2", "df+1,4", "EWGF"],
      correctIndex: 0,
      explain:
        "b+1,2 is i11 for 30 damage — your best paid fast punish. 1+2 (i12) is a frame late; 1,1,2 also works but underpays.",
    },
    {
      id: "q-13",
      prompt: "-13",
      situation: "You blocked a launcher-class mid. Standing.",
      options: ["EWGF", "1,1,2", "db+1,2", "df+2"],
      correctIndex: 0,
      explain:
        "-13 is where Kazuya gets a full combo — the electric's effective punish speed is 13f. db+1,2 is the execution-free backup (30 + heat engager). df+2 doesn't launch grounded opponents.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "Blocked a hopkick — and you don't trust your electric today.",
      options: ["df+1,4", "uf+4", "df+2", "1,1,2"],
      correctIndex: 0,
      explain:
        "df+1,4 launches at i15 with zero just-frame tax. uf+4 is NOT a launcher in Tekken 8, and df+2 only launches on counter-hit. (With clean electrics, EWGF outdamages everything here.)",
    },
    {
      id: "q-ws11",
      prompt: "-11",
      situation: "You blocked a low poke. You're crouching.",
      options: ["ws+4,4", "ws+1,2", "ws+2", "d+4"],
      correctIndex: 0,
      explain:
        "ws+4,4 is i11 for 29 damage. ws+1,2 needs -13; ws+2 needs -16. Answering a blocked low with your own low is donated damage.",
    },
    {
      id: "q-ws13",
      prompt: "-13",
      situation: "You blocked a slow sweep. Crouching.",
      options: ["ws+1,2", "ws+4,4", "ws+2", "d+1"],
      correctIndex: 0,
      explain:
        "ws+1,2 is your i13 while-standing launcher with a built-in Tornado — full combo. ws+2 (i16) doesn't reach at -13; ws+4,4 works but throws away the launch.",
    },
    {
      id: "q-hellsweep",
      prompt: "-23",
      situation: "You blocked a hellsweep. Crouching.",
      options: ["ws+1,2", "ws+4,4", "d+4", "Block again"],
      correctIndex: 0,
      explain:
        "-23 gives you all the time in the world — take the full launch. Poking after blocking a sweep is the most commonly donated damage in Tekken.",
    },
    {
      id: "q-whiff",
      prompt: "WHIFF",
      situation: "Their big mid just whiffed in front of you.",
      options: ["EWGF", "1,1,2", "d+4", "Backdash"],
      correctIndex: 0,
      explain:
        "A whiff is a free launch — this is what your backdash exists to create. From farther out, f,F+3 collects too.",
    },
    {
      id: "q-12wall",
      prompt: "-12",
      situation: "Blocked a string ender — their back is at the wall.",
      options: ["1+2", "1,1,2", "d+1+2", "d+4"],
      correctIndex: 0,
      explain:
        "1+2 (i12) puts them airborne — at the wall that converts to a splat and bonus damage. Midscreen, b+1,2 pays more raw damage.",
    },
    {
      id: "q-rage-art",
      prompt: "-18",
      situation: "You blocked a Rage Art.",
      options: ["EWGF", "Throw", "1,1,2", "df+2"],
      correctIndex: 0,
      explain:
        "A blocked Rage Art is the biggest punish moment in the game — take maximum damage with the electric launch. Anything less is leaving a round on the table.",
    },
  ],
};
