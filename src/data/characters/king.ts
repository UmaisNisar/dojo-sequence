import type { Character } from "@/types";

/**
 * King — Tekken 8 (Season 3, v3.02.01) curriculum.
 *
 * Frame data cross-verified against Wavu Wiki's live Cargo database
 * (wavu.wiki/t/King, _movelist, _punishers, _combos) and TekkenDocs,
 * August 2026. Facts baked in — each checked against the live table:
 *  - THROW BREAKS are the character. Giant Swing (f,hcf+1) breaks with 1;
 *    Tomahawk / Shining Wizard (f,f,F+2+4) breaks with 1+2; Tijuana Twister
 *    (f,hcf+2) breaks with 2. Both signature throws are i10.
 *  - Crouch throws (d+1+3, d+1+4, d+2+4) CANNOT be broken at all. Neither
 *    can JGR.1+3. These are the answer to opponents who duck throws.
 *  - Bluespark = perfect input: Giant Swing 45 -> 50 dmg, Tomahawk 40 -> 45,
 *    Tijuana 50 -> 55. Wavu rates Giant Swing dexterity 2, rhythm 0 —
 *    it is the most IMPORTANT technique on the character, not the hardest.
 *  - Punish ladder: -10 2,1 | -12 b+1,2 | -14 b+2,1 | -15 uf+4 or f+2,1 |
 *    -16 b+3:1+2. Crouching: -11 ws4 | -14 ws2,2 | -15 FC.df+2 | -18 ws1+2.
 *    He also has a GROUNDED punish table: -17 d+3 | -23 db+3 | -33 d+2+3.
 *  - Stances: CD (Beast Step) f,n,d,DF · JGS (Jaguar Step) 3+4 ·
 *    JGR (Jaguar Sprint) f+3+4. JGR is fully ARMORED during Heat.
 *  - Heat Engagers: f+2,1 · f+2+3 · db+1+2,2 · d+1+4 · JGR.1+3
 *  - Heat Smash H.2+3 is +12 on block AND transitions to Jaguar Sprint.
 *  - b+3:1+2 looks like a just frame but the window is frames 2~17 of b+3
 *    (Wavu dexterity 0). f+3,1+2 is frames 2~20. Both are generous.
 *  - Honest weaknesses per Wavu: large hurtbox, below-average movement, an
 *    awkwardly slow backdash cancel, risky panic moves, prominent whiff
 *    recovery.
 */

export const king: Character = {
  id: "king",
  name: "King",
  style: "Pro Wrestling",
  tagline:
    "Suplex City. The strongest throw game in Tekken, wrapped around mids that punish everyone who tries to duck it.",
  available: true,
  accent: { base: "#f5b301", bright: "#fcd34d", deep: "#b45309" },
  stages: [
    /* ------------------------------------------------------------ */
    /* STAGE 01 — MOVEMENT & APPROACH                               */
    /* ------------------------------------------------------------ */
    {
      id: "movement",
      number: 1,
      name: "Movement & Approach",
      focus: "Get in — because everything happens up close",
      description:
        "King's whole game is at grappling range, and Wavu is blunt about the cost: he has a large hurtbox, below-average movement and an awkwardly slow backdash cancel. You will not dance around anybody. What you have instead are genuinely excellent approach tools, and this stage is about using them to close the gap on your terms.",
      items: [
        {
          id: "forward-dash",
          stageId: "movement",
          name: "Forward Dash",
          notation: "f,f",
          purpose:
            "The most important movement input on the character, because every throw King cares about starts with a forward motion. Dashing IS threatening for him in a way it is not for most of the cast.",
          whenToUse:
            "Constantly. A dash toward the opponent already looks like the start of a Giant Swing, which is exactly the ambiguity you want.",
          leverlessTip:
            "Tap f twice with a full release between taps. Get comfortable dashing without committing — the threat of the throw does work even when you do not throw.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Dash into throw range and block, without pressing anything.",
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
            "Creates space and baits whiffs. King's whiff punishment is strong even if his movement is not — 1,2, 2,1, b+1,2, b+2,1, uf+4 and f+2,1 are all listed whiff punishers.",
          whenToUse:
            "After blocking a string that ends close. Be realistic: you are backing up to punish, not to escape.",
          leverlessTip:
            "Full release between the two b presses. Because King's backdash is slow and his hurtbox is large, a backdash that does not lead to a punish is usually just lost ground.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Backdash a CPU attack and punish the whiff with 2,1.",
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
            "Chained backdash cancels. Wavu specifically calls King's backdash cancel awkwardly slow, so treat this as damage control rather than a strength — you use it to reset to a range you can re-approach from.",
          whenToUse:
            "When you have genuinely lost your turn and need to reset. Do not plan a gameplan around out-spacing people with it.",
          leverlessTip:
            "Anchor b, drum d. Learn it so you are not helpless, then spend your practice time on the throw game where the actual value is.",
          drill: {
            type: "consecutive-reps",
            target: 4,
            rep: "Four clean backdash cancels in a row.",
          },
          difficulty: "hard",
          tags: ["fundamental", "execution"],
        },
        {
          id: "running-game",
          stageId: "movement",
          name: "The Running Game",
          notation: "f,f,F+3 · f,f,n,1+2 · f,f,F+3+4",
          purpose:
            "King's approach is unusually strong for a grappler. f,f,F+3 is +3 on block, f,f,n,1+2 is an i9 mid out of a run, and f,f,F+3+4 is +17 on block. You arrive with the turn, not asking for it.",
          whenToUse:
            "Closing from long range. Running also sets up the Tomahawk, which is a running throw — the same approach threatens both.",
          leverlessTip:
            "A run is f, f, then HOLD f. Every one of these comes out of that same held forward, which is why the run is worth drilling as its own skill.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Approach from full screen with a run and end plus on block.",
          },
          difficulty: "medium",
          tags: ["approach", "plus on block"],
          moveKeys: ["fff3", "ffn1plus2", "fff3plus4", "ffn2"],
        },
        {
          id: "beast-step",
          stageId: "movement",
          name: "Beast Step",
          notation: "f,n,d,DF",
          purpose:
            "King's crouch dash. It ducks highs as it travels and opens two chain throws (CD.1+3 and CD.2+4) plus CD.DF+4, a knee that gives +49a on hit.",
          whenToUse:
            "As a mixup platform at close range. The opponent has to respect a mid, a low and two grabs at once.",
          leverlessTip:
            "f, release, d, then add f so d and f are held together — and note the DF is HELD, not tapped. Same Mishima motion as Kazuya and Jin, but King uses it to set up grabs rather than an electric.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Clean Beast Step from neutral, then a CD follow-up.",
          },
          difficulty: "medium",
          tags: ["stance", "execution"],
          moveKeys: ["cd-df4", "cd-df1plus2", "ab-entry", "shh-entry"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 02 — CORE MIDS                                         */
    /* ------------------------------------------------------------ */
    {
      id: "mids",
      number: 2,
      name: "Core Mids",
      focus: "Punish everyone who ducks",
      description:
        "This stage exists because of the throw game. Ducking beats every standing throw King has, so the correct counter-play against a bad King is simply to crouch. Wavu calls these his Backstage Brawler tools: devastating mids that make crouching cost you. Learn them before the throws, so the throws actually work.",
      items: [
        {
          id: "df1",
          stageId: "mids",
          name: "Elbow",
          notation: "df+1 → df+1,2",
          purpose:
            "His mid check: i14 and only -1 on block. This is the button you press to keep your turn and to remind them that standing still is not safe either.",
          whenToUse:
            "Constantly at close range. At -1 you are effectively still in the exchange.",
          leverlessTip:
            "df is a d+f chord, not a roll. Because it is nearly neutral on block, df+1 is the safest way to stay in the range where your grabs reach.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "df+1 as a turn check, then hold your ground.",
          },
          difficulty: "easy",
          tags: ["i14", "mid", "poke"],
          moveKeys: ["df1", "df1-2"],
        },
        {
          id: "df2-1",
          stageId: "mids",
          name: "Double Hook Disaster",
          notation: "df+2,1",
          purpose:
            "An i13 mid that counter-hit launches for +24a, and the full string is only -4 on block. One of the two Turn Stealer tools Wavu lists.",
          whenToUse:
            "When you expect them to press. It is safe enough to throw as a check and rewarding enough to be worth the read.",
          leverlessTip:
            "The string combos from a 1st-hit counter-hit with up to 13 frames of delay, so you can genuinely react to the counter-hit flash before committing to the second hit.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit with df+2 and confirm into the launcher.",
          },
          difficulty: "medium",
          tags: ["i13", "CH launcher", "mid"],
          moveKeys: ["df2", "df2-1"],
        },
        {
          id: "b1-2",
          stageId: "mids",
          name: "Quick Hook",
          notation: "b+1,2",
          purpose:
            "i12, and if the first hit counter-hits the string LAUNCHES for +70a. It also carries the Tornado, which is why it appears in almost every combo you will learn.",
          whenToUse:
            "As a fast interrupt and a counter-hit fish. It is also his -12 punisher and a listed whiff punisher.",
          leverlessTip:
            "It is a high, so it loses to the crouching you are trying to punish — pair it with your mids rather than leaning on it.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Counter-hit with b+1 and take the full launch.",
          },
          difficulty: "medium",
          tags: ["i12", "CH launcher", "tornado", "punisher"],
          moveKeys: ["b1", "b1-2"],
        },
        {
          id: "jab-punishers",
          stageId: "mids",
          name: "The Jab Strings",
          notation: "1,2 · 2,1 · 1,2,1",
          purpose:
            "Fast, safe, and useful. 2,1 is his i10 punisher at only -3; 1,2,1 is -4. Both are listed whiff punishers, and the strings can end in a throw.",
          whenToUse:
            "Close range as interrupts and punishes. 1,2,1,2+4 and 1,2,d+2+4 end the string in a grab — a reminder that with King every string is a possible throw.",
          leverlessTip:
            "The throw enders are the point. Once an opponent has been thrown out of a jab string, they start hesitating in every jab exchange for the rest of the set.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Punish with 2,1 and occasionally take the throw ender.",
          },
          difficulty: "easy",
          tags: ["i10", "punisher", "throw"],
          moveKeys: ["jab-2", "right-1", "jab-2-1", "jab-2-1-throw"],
        },
        {
          id: "f2-1",
          stageId: "mids",
          name: "Elbow Impact",
          notation: "f+2,1 · f+2+3",
          purpose:
            "Two Heat Engagers. f+2,1 is his -15 punisher and a whiff punisher; f+2+3 is a shoulder tackle at only -5 on block. Heat matters enormously for King, so having safe ways into it is valuable.",
          whenToUse:
            "As punishes and as your route into Heat. f+2+3 being -5 means you can throw it in neutral without fear.",
          leverlessTip:
            "f+2,1 can be delayed 10 frames and the input delayed 11 — you have time to confirm before finishing.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Engage Heat with f+2,1 or f+2+3.",
          },
          difficulty: "easy",
          tags: ["heat engager", "punisher"],
          moveKeys: ["f2", "f2-1", "f2plus3"],
        },
        {
          id: "uf4",
          stageId: "mids",
          name: "Jumping Knee Lift",
          notation: "uf+4",
          purpose:
            "His hopkick and his -15 launch punish. It crushes lows and gives a full combo — the single biggest thing in his punishment ladder.",
          whenToUse:
            "Blocked -15 moves, and as a read on a low. It is -13 on block, so it is a punish or a read, never a habit.",
          leverlessTip:
            "uf is a two-button chord and you are airborne, so you cannot block. Commit only when the read is real.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish a -15 move with uf+4 and convert the combo.",
          },
          difficulty: "medium",
          tags: ["launcher", "punisher", "low crush"],
          moveKeys: ["uf4"],
        },
        {
          id: "homing-mids",
          stageId: "mids",
          name: "The Homing Mids",
          notation: "f,F+1 · f+4",
          purpose:
            "Two homing mids that track sidesteps. f,F+1 is only -5 on block with a +38d counter-hit; f+4 is a Balcony Break. Grapplers get stepped, and these are the answer.",
          whenToUse:
            "Against opponents who sidestep out of your throw range. If they cannot step, they have to block — and if they have to block, you can grab.",
          leverlessTip:
            "f,F+1 needs the second f held. Because it is safe and homing, it is the cleanest way to shut down sidestepping without risking your turn.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Catch a sidestepping CPU with f,F+1 or f+4.",
          },
          difficulty: "easy",
          tags: ["homing", "anti-step", "mid"],
          moveKeys: ["ff1", "f4", "ff2"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 03 — THE THROW GAME                                    */
    /* ------------------------------------------------------------ */
    {
      id: "throws",
      number: 3,
      name: "The Throw Game",
      focus: "Suplex City",
      description:
        "This is the character. Wavu rates King as having the strongest throw game of anyone in the cast, and the reason is not damage — it is that his throws break on different buttons and look alike on startup. Everything in this stage is about making the opponent guess which button to press, and punishing them when they guess by ducking instead.",
      items: [
        {
          id: "throw-break-concept",
          stageId: "throws",
          name: "How Throw Breaks Work",
          notation: "1 · 2 · 1+2",
          purpose:
            "Understand the system before the moves. Every standard throw is escaped with a specific button: throws built on 1 break with 1, throws built on 2 break with 2, and 1+2 throws break with 1+2. Your whole offense is built on making that choice ambiguous.",
          whenToUse:
            "Every round, in both directions — you also need to break throws yourself. Knowing which break a throw needs is the single most valuable King knowledge there is.",
          leverlessTip:
            "Breaks are pure button presses with no direction, so a leverless has no disadvantage here. Practise 1+2 as a two-finger chord that lands on one frame — a split input reads as 1 or 2 alone and fails the break.",
          drill: {
            type: "manual",
            checklist: [
              "State the break for Giant Swing, Tomahawk and Tijuana Twister from memory.",
              "Set the CPU to throw and break ten throws in Practice mode.",
              "Name one King throw that cannot be broken at all.",
              "Explain why ducking beats standing throws — and what King does about it.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "throws", "core"],
        },
        {
          id: "giant-swing",
          stageId: "throws",
          name: "Giant Swing",
          notation: "f,hcf+1",
          purpose:
            "The single most important technique on the character — Wavu scores its importance at maximum. i10, 45 damage, breaks with 1, and it side-switches. Note the difficulty ratings: dexterity 2, rhythm 0. This is not a hard move, it is an essential one.",
          whenToUse:
            "As your primary throw threat. It is -13 on block, so it is a read — but the read is the entire gameplan, not a gamble you take occasionally.",
          leverlessTip:
            "f, then a half circle forward — b, db, d, df, f — then 1. On a stick you roll and hope; on a leverless you press five discrete directions, so it either comes out or it obviously does not. Wavu notes the input is forgiving on the early directions and tight only at the end.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Land Giant Swing from a forward dash with a clean motion.",
          },
          difficulty: "medium",
          tags: ["throw", "signature", "core"],
          moveKeys: ["giant-swing"],
        },
        {
          id: "tomahawk",
          stageId: "throws",
          name: "Tomahawk (Shining Wizard)",
          notation: "f,f,F+2+4",
          purpose:
            "The other half of the mixup, and Wavu's second key technique. Also i10, but it breaks with 1+2 instead of 1 — and it is only -5 on block, which makes it far safer than Giant Swing.",
          whenToUse:
            "Interchangeably with Giant Swing. Because it is a running throw off the same forward motion, the opponent cannot tell which one is coming.",
          leverlessTip:
            "This is a run throw: f, f, then hold F with 2+4. The instant version — pressing F+2+4 within six frames of the dash — is what Wavu calls Instant Shining Wizard, and it is what makes the throw genuinely ambiguous.",
          drill: {
            type: "consecutive-reps",
            target: 8,
            rep: "Land Tomahawk out of a dash with the fastest possible input.",
          },
          difficulty: "medium",
          tags: ["throw", "signature", "core"],
          moveKeys: ["tomahawk"],
        },
        {
          id: "the-mixup",
          stageId: "throws",
          name: "The 1 / 1+2 Mixup",
          notation: "f,hcf+1 vs f,f,F+2+4",
          purpose:
            "The heart of King. Two i10 throws off the same forward approach that require different escapes: Giant Swing needs 1, Tomahawk needs 1+2. Guessing wrong costs 45 damage. Guessing at all is the trap.",
          whenToUse:
            "Every time they are standing and blocking. This is not a gimmick you save — it is the reason to play King.",
          leverlessTip:
            "Alternate genuinely rather than in a pattern. Good opponents will notice a habit long before they notice a frame. Mix in the crouch throws from the next item and the guess becomes three-way.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Alternate Giant Swing and Tomahawk unpredictably against a blocking CPU.",
          },
          difficulty: "medium",
          tags: ["mixup", "signature", "core"],
          moveKeys: ["giant-swing", "tomahawk"],
        },
        {
          id: "bluespark",
          stageId: "throws",
          name: "Bluespark",
          notation: "f,hcf:1 · f,f,F:2+4",
          purpose:
            "A perfect input flashes blue and does more damage: Giant Swing goes from 45 to 50, Tomahawk from 40 to 45, Tijuana Twister from 50 to 55. Small margins, but they are free once the timing is habit.",
          whenToUse:
            "Every throw, eventually. Combo enders in particular — Wavu's staple routes all specify the bluespark version and note the damage lost on an imperfect input.",
          leverlessTip:
            "Do not chase this until the normal versions are automatic. A bluespark you drop half the time is worth less than a plain Giant Swing you always land.",
          drill: {
            type: "accuracy",
            attempts: 20,
            required: 8,
            rep: "Attempt Giant Swing and count only the ones that flash blue.",
          },
          difficulty: "hard",
          tags: ["throw", "execution", "damage"],
          moveKeys: ["giant-swing", "tomahawk", "tijuana"],
        },
        {
          id: "crouch-throws",
          stageId: "throws",
          name: "Crouch Throws — the Unbreakable Answer",
          notation: "d+1+3 · d+1+4 · d+2+4",
          purpose:
            "The answer to ducking. These are crouch throws — they catch a CROUCHING opponent, and they CANNOT be thrown break at all. 35 damage with no escape, and d+1+4 is a Heat Engager on top.",
          whenToUse:
            "The moment an opponent starts ducking to avoid your standing throws. This is the punish for the correct counter-play, which is what makes the whole mixup unfair.",
          leverlessTip:
            "d+1+3 also works as db+1+3 and from full crouch, so you do not need a precise stance — you need the read. Learn d+1+4 first since it also builds Heat.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Catch a crouching opponent with an unbreakable crouch throw.",
          },
          difficulty: "medium",
          tags: ["throw", "unbreakable", "heat engager", "signature"],
          moveKeys: ["crouch-lariat", "crouch-facebuster", "crouch-vdriver"],
        },
        {
          id: "throw-arsenal",
          stageId: "throws",
          name: "The Wider Arsenal",
          notation: "qcb+1+2 · db,n,f+2+4 · f,hcf+2 · uf+1+2",
          purpose:
            "More breaks to guess. Muscle Buster (1+2) floor breaks, Tombstone (2) does 53, Tijuana Twister (2) does 50, and Executioner Drop (1+2) can be reversed to throw them backwards with b.",
          whenToUse:
            "To widen the guess once opponents have learned your two main throws. Every additional break they have to consider makes the core mixup stronger.",
          leverlessTip:
            "Tombstone has a specific restriction worth knowing: it cannot be buffered from crouch and cannot be done while standing up. Learn where it does and does not come out before relying on it.",
          drill: {
            type: "total-reps",
            target: 15,
            rep: "Land each of the four throws once and note which button breaks it.",
          },
          difficulty: "medium",
          tags: ["throw", "mixup"],
          moveKeys: ["muscle-buster", "tombstone", "tijuana", "executioner", "pile-driver"],
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
      focus: "Including the one nobody else has",
      description:
        "King's punishment is solid rather than spectacular — but he has something almost no one else does: a full punishment ladder against GROUNDED opponents. Knowing what to do to someone lying on the floor is a real, separate skill, and it is worth free damage every single round.",
      items: [
        {
          id: "punish-10",
          stageId: "punishment",
          name: "The i10 Punish",
          notation: "2,1",
          purpose:
            "Your fastest punish, and unusually it is only -3 on block itself. Small damage, always available.",
          whenToUse: "Anything blocked at -10 or -11.",
          leverlessTip:
            "Buffer during blockstun. Being -3 means a mistimed 2,1 is not a disaster, which is rare for a punish.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 12,
            rep: "Punish a -10 move with 2,1.",
          },
          difficulty: "easy",
          tags: ["i10", "punisher"],
          moveKeys: ["right-1"],
        },
        {
          id: "punish-12-14",
          stageId: "punishment",
          name: "-12 and -14",
          notation: "b+1,2 · b+2,1",
          purpose:
            "b+1,2 covers -12 and carries the Tornado. b+2,1 covers -14 and wall splats, which near a wall is worth far more than the extra damage of anything else.",
          whenToUse: "Blocked pokes and string enders. Near a wall, prioritise b+2,1.",
          leverlessTip:
            "b+2,1 has a 15-frame input delay window, so there is no rush on the second hit once the first is out.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Alternate -12 and -14 punishes correctly.",
          },
          difficulty: "medium",
          tags: ["punisher", "wall splat"],
          moveKeys: ["b1-2", "b2-1"],
        },
        {
          id: "punish-15",
          stageId: "punishment",
          name: "-15 — the Launch",
          notation: "uf+4 · f+2,1",
          purpose:
            "At -15 you launch with uf+4 for a full combo. f+2,1 is the alternative when you would rather have Heat than damage.",
          whenToUse:
            "Blocked -15 moves. Take the launch by default; take the Heat Engager when Heat is close and you want the JGR pressure.",
          leverlessTip:
            "Deciding between damage and Heat is a real choice for King, because Heat makes his Jaguar Sprint fully armored. Sometimes the Engager is worth more than the combo.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Punish -15 with uf+4 and convert into the bread and butter.",
          },
          difficulty: "medium",
          tags: ["launcher", "punisher", "heat engager"],
          moveKeys: ["uf4", "f2-1"],
        },
        {
          id: "punish-16",
          stageId: "punishment",
          name: "-16 — Guillotine Drop",
          notation: "b+3:1+2",
          purpose:
            "The heavy standing punish, and a move whose notation is scarier than it is. The colon suggests a just frame, but the window is frames 2~17 of b+3 — Wavu rates its dexterity at zero.",
          whenToUse:
            "Big blocked commitments. It is also the listed answer to several specific matchup problems, so it earns its place beyond raw damage.",
          leverlessTip:
            "Sixteen frames is a generous window. Throw b+3, then press 1+2 — you are not racing anything. It also shifts into a throw against a grounded opponent.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Punish a -16 move with b+3:1+2.",
          },
          difficulty: "medium",
          tags: ["punisher", "throw"],
          moveKeys: ["b3", "b3-throw", "f3-throw"],
        },
        {
          id: "ws-punish",
          stageId: "punishment",
          name: "Crouching Punishment",
          notation: "ws4 · ws2,2 · FC.df+2 · ws1+2",
          purpose:
            "After blocking a low: ws4 at -11, ws2,2 at -14 (which wall splats and goes into Jaguar Sprint on hit), FC.df+2 LAUNCHES at -15, and ws1+2 at -18.",
          whenToUse:
            "Every blocked low. ws2,2 transitioning into Jaguar Sprint is the standout — a punish that ends with you in your best stance.",
          leverlessTip:
            "You are already holding d to block the low. The while-standing punish is a release plus a button — the cheapest big damage in his kit.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 11,
            rep: "Block a low and take the correct while-standing punish.",
          },
          difficulty: "medium",
          tags: ["crouch", "punisher", "launcher"],
          moveKeys: ["ws4", "ws2-2", "fc-df2", "ws1plus2"],
        },
        {
          id: "grounded-punish",
          stageId: "punishment",
          name: "Punishing a Grounded Opponent",
          notation: "d+3 · db+3 · db+4 · d+2+3",
          purpose:
            "The ladder nobody else teaches. Against someone lying on the floor King has a real frame ladder: d+3 at -17, db+3 at -23, db+4 at -29 and d+2+3 at -33. Free damage most players never take.",
          whenToUse:
            "Every knockdown where they do not tech. King knocks people down constantly, so this comes up several times a round.",
          leverlessTip:
            "Learn the two ends first — d+3 for the common case and d+2+3 when they are staying down a long time. The middle of the ladder can wait.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Knock the CPU down and take the correct grounded punish for how long they stay down.",
          },
          difficulty: "medium",
          tags: ["okizeme", "punisher", "unusual"],
          moveKeys: ["d3", "db3", "db4", "d2plus3"],
        },
        {
          id: "whiff-punish",
          stageId: "punishment",
          name: "Whiff Punishment",
          notation: "1,2 · 2,1 · b+1,2 · b+2,1 · uf+4 · f+2,1",
          purpose:
            "Six listed whiff punishers covering every range and reward. Wavu also names prominent whiff recovery as one of King's own weaknesses — so this is a skill you need in both directions.",
          whenToUse:
            "Every whiffed move in front of you. Pick by distance: jabs up close, b+2,1 for wall carry, uf+4 when you have time for the launch.",
          leverlessTip:
            "Because King's own recovery is poor, be honest about which of your moves are safe to throw at range. Punishing a whiff with a move that whiffs is how grapplers lose rounds.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Backdash a CPU attack and whiff punish with the right tool for the distance.",
          },
          difficulty: "medium",
          tags: ["whiff punish", "core"],
          moveKeys: ["jab-2", "right-1", "b1-2", "b2-1", "uf4", "f2-1"],
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 05 — CHAIN THROWS                                      */
    /* ------------------------------------------------------------ */
    {
      id: "chains",
      number: 5,
      name: "Chain Throws",
      focus: "The multi-throws nobody else has",
      description:
        "King's chain throws are the most distinctive mechanic in Tekken. Land the entry grab and you enter a sequence where each link can be broken — but each successful link does more damage and leads deeper. The Cobra Clutch chain runs seven stages to the Screwdriver. These are not combos: they are a series of guesses your opponent has to win repeatedly.",
      items: [
        {
          id: "chain-concept",
          stageId: "chains",
          name: "How Chain Throws Work",
          notation: "",
          purpose:
            "Understand the structure. An entry throw puts the opponent into a hold; from there you input the next link, which they can break. Break windows are per-link, so a full chain means they guessed wrong several times in a row.",
          whenToUse:
            "Any time you land a chain entry. Even a broken chain has usually already done damage — you are rarely worse off for trying.",
          leverlessTip:
            "Learn ONE chain end to end before touching the others. Four half-remembered chains are worth less than one you can complete without thinking.",
          drill: {
            type: "manual",
            checklist: [
              "Name King's chain-throw entry points and which button breaks each.",
              "Complete one full chain in Practice mode with break off.",
              "Complete the same chain with the CPU set to break randomly.",
              "Explain why a broken chain is usually still worth attempting.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "throws"],
        },
        {
          id: "mmd-chain",
          stageId: "chains",
          name: "The Cobra Clutch Chain",
          notation: "JGS.1+3 → ... → Screwdriver",
          purpose:
            "The famous one. Entered from Jaguar Step, it runs seven stages and finishes with the Screwdriver. This is the chain that shows up in highlight reels, and completing it in a real match is a genuine milestone.",
          whenToUse:
            "Out of Jaguar Step when you have earned a grab. The entry is only 20 damage on its own — the value is entirely in how far you get.",
          leverlessTip:
            "The links are direction-plus-button sequences, which a leverless handles cleanly. Write the chain on paper, learn it in three-link chunks, then join them.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 5,
            rep: "Enter from Jaguar Step and complete the chain as far as you can.",
          },
          difficulty: "expert",
          tags: ["chain throw", "signature"],
          moveKeys: ["mmd-entry", "jgs2"],
        },
        {
          id: "arm-breaker",
          stageId: "chains",
          name: "The Arm Breaker Chain",
          notation: "CD.1+3 → Rolling Death Cradle",
          purpose:
            "Entered from Beast Step and breaking with 1. Its best branch ends in the Rolling Death Cradle for 60 damage — the biggest single payoff of any chain.",
          whenToUse:
            "Out of Beast Step, where you are already threatening a mid and a low. The grab is the third option they have to worry about.",
          leverlessTip:
            "This chain shares its entry motion with the Standing Heel Hold below — same Beast Step, different button. That makes them a mixup on their own.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 5,
            rep: "Enter Arm Breaker from Beast Step and reach the Rolling Death Cradle.",
          },
          difficulty: "hard",
          tags: ["chain throw", "damage"],
          moveKeys: ["ab-entry"],
        },
        {
          id: "heel-hold",
          stageId: "chains",
          name: "The Standing Heel Hold Chain",
          notation: "CD.2+4 → King's Bridge",
          purpose:
            "The 2-break partner to the Arm Breaker, from the identical Beast Step entry. Its branches include the Scorpion Death Lock, the Indian Death Lock and King's Bridge at 40 damage.",
          whenToUse:
            "Alternating with CD.1+3. Same motion, different break — the crouch-dash version of the Giant Swing / Tomahawk guess.",
          leverlessTip:
            "Because the entries are identical up to the final button, this pair is the most deceptive grab mixup King has. Drill entering Beast Step and choosing at the last moment.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 5,
            rep: "Alternate CD.1+3 and CD.2+4 from Beast Step unpredictably.",
          },
          difficulty: "hard",
          tags: ["chain throw", "mixup"],
          moveKeys: ["shh-entry", "ab-entry"],
        },
        {
          id: "ras-rssb",
          stageId: "chains",
          name: "The Homing Chains",
          notation: "df+1+3 · df+2+4",
          purpose:
            "Two slow, HOMING chain throws that both end in a choice between Giant Swing and Muscle Buster. Being homing means they catch sidesteppers, which no other King grab does.",
          whenToUse:
            "Against opponents who have started sidestepping your throws entirely. They are slow, so they are a hard read — but they cover the one gap your other grabs have.",
          leverlessTip:
            "Both are genuinely slow. Use them when you have conditioned someone into stepping, not as a general option.",
          drill: {
            type: "accuracy",
            attempts: 10,
            required: 5,
            rep: "Catch a sidestepping opponent with a homing chain throw and finish it.",
          },
          difficulty: "hard",
          tags: ["chain throw", "homing"],
          moveKeys: ["ras-entry", "rssb-entry", "tackle"],
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
      focus: "Short routes, thrown enders",
      description:
        "King's combos are refreshingly short, and most of them end in a throw — which means the same Giant Swing and Tomahawk you drilled in Stage 3 are also your combo enders. Learn the two bread-and-butters, then the mini-combos, and pay attention to the last item: some of King's most-used 'combos' are not actually guaranteed.",
      items: [
        {
          id: "bnb-regular",
          stageId: "combos",
          name: "The Bread and Butter",
          notation: "4 → b+3 → T! → f,f,F+2+4",
          purpose:
            "The route off any standard launcher such as uf+4. Four inputs, ending in a Tomahawk — short enough that you will never drop it under pressure.",
          whenToUse: "Off uf+4, ws1+2, uf,n,4 and a counter-hit ub+4.",
          leverlessTip:
            "The ender is a throw, so your combo practice doubles as throw practice. Use the bluespark version once the route itself is automatic.",
          drill: {
            type: "consecutive-reps",
            target: 6,
            rep: "Full combo from a uf+4 launch with no drops.",
          },
          difficulty: "medium",
          tags: ["BNB", "combo"],
          moveKeys: ["kick4", "b3", "tomahawk", "uf4"],
        },
        {
          id: "bnb-low",
          stageId: "combos",
          name: "Off a Low Launcher",
          notation: "df+4,3 → 1,2 → uf+3+4 → T! → JGR.1+3",
          purpose:
            "The route off db+2 and his other low launchers. It ends in the unbreakable Jaguar Sprint throw — a combo that finishes with a Heat Engager grab.",
          whenToUse: "Off db+2, and as the shape for most of his longer staple routes.",
          leverlessTip:
            "df+4,3 is the filler that appears in nearly every King combo. Drill that link alone and most of his combo list opens up at once.",
          drill: {
            type: "consecutive-reps",
            target: 5,
            rep: "Full combo from a db+2 launch with no drops.",
          },
          difficulty: "hard",
          tags: ["BNB", "combo", "heat engager"],
          moveKeys: ["df4-3", "jab-2", "uf3plus4", "jgr-throw", "db2"],
        },
        {
          id: "mini-combos",
          stageId: "combos",
          name: "Guaranteed Mini-Combos",
          notation: "JGS.2 → d+1+4 · CH 4 → d+2+3 → d+3+4",
          purpose:
            "Free damage most King players miss. JGS.2 on hit guarantees an unbreakable crouch throw for 35 — a stance poke that turns into a grab they cannot escape. A counter-hit standing 4 gives 31 more.",
          whenToUse:
            "Every JGS.2 that lands, and every counter-hit 4. These need no execution — only that you notice.",
          leverlessTip:
            "The JGS.2 into crouch throw is the most King thing in the game: a mid that leads to an unbreakable grab. Make it a habit and opponents stop knowing how to defend the stance at all.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Land JGS.2 and take the guaranteed crouch throw.",
          },
          difficulty: "easy",
          tags: ["mini-combo", "unbreakable", "damage"],
          moveKeys: ["jgs2", "crouch-facebuster", "kick4", "d2plus3", "d3plus4"],
        },
        {
          id: "fake-combos",
          stageId: "combos",
          name: "Fake Combos — What Is Not Guaranteed",
          notation: "CH 4 → micro-dash d+2+4 (breakable)",
          purpose:
            "An honesty item. A counter-hit 4 into a micro-dashed crouch throw looks like a combo and is used like one, but it CAN be broken — with 2 for d+2+4, with 1 for d+1+3. Knowing the difference stops you from blaming execution when a good opponent escapes.",
          whenToUse:
            "Deliberately, as a mixup rather than as damage you are counting on. Against opponents who do not know the break it is free; against those who do, it is a guess.",
          leverlessTip:
            "Wavu maintains a separate Fake Combos list for exactly this reason. Treat anything on it as a strong option, never as guaranteed damage.",
          drill: {
            type: "manual",
            checklist: [
              "Land the CH 4 into crouch throw with CPU break set to off.",
              "Set the CPU to break and watch it escape.",
              "State which button breaks each of the two versions.",
              "Decide when it is worth using anyway.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty"],
          moveKeys: ["kick4", "crouch-vdriver", "crouch-lariat"],
        },
        {
          id: "wall-game",
          stageId: "combos",
          name: "The Wall",
          notation: "b+1,2 T! f,hcf+1 · f,F+4 T! 3,2,2 (hold)",
          purpose:
            "At the wall, b+1,2 into a Tornado then Giant Swing is the simple high-damage ender. The charged Stampede Crush version leaves you in a Jaguar Sprint mixup instead of ending the round quietly.",
          whenToUse:
            "Any wall splat. b+2,1 and ws2,2 are his wall splat moves, so getting them there is usually the easy part.",
          leverlessTip:
            "Pick one ender and drill it. King's wall damage is high enough that consistency beats optimisation by a wide margin.",
          drill: {
            type: "manual",
            checklist: [
              "Identify King's two wall splat moves (b+2,1 and ws2,2).",
              "Carry an opponent to the wall in one combo.",
              "Land the b+1,2 into Giant Swing wall ender three times.",
              "Land the charged Stampede Crush ender and continue with Jaguar Sprint pressure.",
            ],
          },
          difficulty: "hard",
          tags: ["wall", "damage"],
          moveKeys: ["b1-2", "giant-swing", "ff4", "stampede-hold", "b2-1", "ws2-2"],
          verifyInGame:
            "Wall routes depend on stage geometry and carry angle. Build yours in Practice mode on the stages you actually play.",
        },
      ],
    },

    /* ------------------------------------------------------------ */
    /* STAGE 07 — STANCES & HEAT                                    */
    /* ------------------------------------------------------------ */
    {
      id: "stances",
      number: 7,
      name: "Stances & Heat",
      focus: "Jaguar Step, Jaguar Sprint, and armor",
      description:
        "King's two stances do different jobs. Jaguar Step is a fast low crush that hides a grab; Jaguar Sprint is a running mixup between a mid, a homing mid, a low and an unbreakable throw. In Heat, Jaguar Sprint becomes fully ARMORED — Wavu's summary of King in Heat is simply that he is broken in half.",
      items: [
        {
          id: "jaguar-step",
          stageId: "stances",
          name: "Jaguar Step",
          notation: "3+4 (JGS)",
          purpose:
            "A spinning stance with a faster-than-average low crush — one of the Turn Stealer tools Wavu lists. It also hides the Cobra Clutch chain throw.",
          whenToUse:
            "Against opponents leaning on lows, and as a way to enter a grab from an unexpected place.",
          leverlessTip:
            "You can hold 3+4 to keep spinning and power up the follow-ups, but King gets dizzy and falls over after the sixth spin. Know where that limit is before you find it in a match.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Jaguar Step, crush a low, and follow with a stance move.",
          },
          difficulty: "medium",
          tags: ["stance", "low crush"],
          moveKeys: ["jgs1", "jgs2", "jgs3"],
        },
        {
          id: "jgs-moves",
          stageId: "stances",
          name: "Jaguar Step Options",
          notation: "JGS.2 · JGS.4 · JGS.1+3",
          purpose:
            "JGS.2 is an i11 mid that guarantees an unbreakable crouch throw on hit. JGS.4 is hugely plus on block. JGS.1+3 is the Cobra Clutch. Three completely different threats from one stance.",
          whenToUse:
            "JGS.2 as the default, JGS.4 when you want to keep the turn, the grab when they have started blocking everything.",
          leverlessTip:
            "JGS.2 at i11 is fast enough to genuinely contest a turn. Combined with the guaranteed crouch throw it is the best single button in the stance.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 9,
            rep: "Run all three Jaguar Step options based on what the CPU does.",
          },
          difficulty: "medium",
          tags: ["stance", "mixup", "plus on block"],
          moveKeys: ["jgs2", "jgs4", "jgs-df4", "mmd-entry"],
        },
        {
          id: "jaguar-sprint",
          stageId: "stances",
          name: "Jaguar Sprint",
          notation: "f+3+4 (JGR)",
          purpose:
            "The stance Season 3 built around him. It powers up over time and is instantly powered up in Heat — and during Heat it gains armor on frames 7 through 89, which is close to the whole stance.",
          whenToUse:
            "As a pressure platform, especially in Heat where you can simply walk through their buttons.",
          leverlessTip:
            "It cancels to standing block with b, so entering it is not a full commitment. Get comfortable entering and cancelling before you start attacking out of it.",
          drill: {
            type: "total-reps",
            target: 12,
            rep: "Enter Jaguar Sprint and cancel to block before committing.",
          },
          difficulty: "medium",
          tags: ["stance", "armor"],
          moveKeys: ["jgr1", "jgr2"],
        },
        {
          id: "jgr-mixup",
          stageId: "stances",
          name: "The Jaguar Sprint Mixup",
          notation: "JGR.1 · JGR.3 · JGR.4 · JGR.1+3",
          purpose:
            "Four options and no good answer: an elbow mid that becomes a launcher when powered up, a homing mid, a low dropkick, and a throw that CANNOT be broken and engages Heat.",
          whenToUse:
            "Out of Jaguar Sprint. The unbreakable throw is what makes the other three work — they cannot simply duck or block their way out.",
          leverlessTip:
            "Start with two options, not four. JGR.1 and the unbreakable throw already force a real guess; add the low and the homing mid once those two are automatic.",
          drill: {
            type: "accuracy",
            attempts: 15,
            required: 10,
            rep: "Run the Jaguar Sprint mixup unpredictably against a blocking CPU.",
          },
          difficulty: "hard",
          tags: ["mixup", "stance", "unbreakable", "signature"],
          moveKeys: ["jgr1", "jgr1-charged", "jgr3", "jgr4", "jgr-throw"],
        },
        {
          id: "muscle-armor",
          stageId: "stances",
          name: "Muscle Armor",
          notation: "db+1+2 → db+1+2,2",
          purpose:
            "His power crush, and Wavu notes it comes out one frame faster than a typical power crush — allowing retaliation where other power crushes simply lose. Damage taken during it is recoverable, and the follow-up is a Heat Engager.",
          whenToUse:
            "Against pressure you have read. It also cancels into movement, into crouch, or into Jaguar Sprint with 3+4.",
          leverlessTip:
            "The cancels are the real value: absorbing a hit and then entering Jaguar Sprint turns their offense into your mixup. Power crush does not absorb lows or throws.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 8,
            rep: "Absorb a string with Muscle Armor and take your turn back with the Emerald Elbow or a JGR cancel.",
          },
          difficulty: "medium",
          tags: ["power crush", "defense", "heat engager"],
          moveKeys: ["db1plus2-2"],
        },
        {
          id: "heat",
          stageId: "stances",
          name: "Heat: Broken In Half",
          notation: "f+2,1 · f+2+3 · db+1+2,2 · d+1+4 · JGR.1+3",
          purpose:
            "Heat transforms him. Jaguar Sprint becomes fully armored, JGR moves are powered up, and his signature throws become HOMING — meaning Giant Swing and Tomahawk start catching sidesteppers. His Heat Smash is +12 on block and transitions straight into Jaguar Sprint.",
          whenToUse:
            "Engage with any of the five Engagers and immediately start Jaguar Sprint pressure. Wavu notes the Heat Smash does the most damage in the game and can even hit grounded opponents.",
          leverlessTip:
            "Homing throws are the detail to internalise. Outside Heat, sidestepping beats your grabs; inside Heat it does not — so Heat is when you push the throw mixup hardest.",
          drill: {
            type: "manual",
            checklist: [
              "Name all five Heat Engagers without looking.",
              "Engage Heat and land an armored Jaguar Sprint move through a jab.",
              "Land a homing Giant Swing on a sidestepping opponent in Heat.",
              "Land the Heat Smash and continue from the Jaguar Sprint transition.",
            ],
          },
          difficulty: "medium",
          tags: ["heat", "armor", "signature"],
          moveKeys: ["heat-smash", "f2-1", "f2plus3", "db1plus2-2", "crouch-facebuster", "jgr-throw"],
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
      focus: "Survive the trip in, then close the deal",
      description:
        "King has real defensive tools but they are specific rather than general — two parries that each cover exactly one thing, and a low parry that converts into a full combo. This stage covers them, states his weaknesses plainly, and then assembles the character.",
      items: [
        {
          id: "parries",
          stageId: "gameplan",
          name: "The Two Parries",
          notation: "b+1+3 · b+2+4",
          purpose:
            "Precise tools. b+1+3 parries the opponent's RIGHT punch; b+2+4 parries their LEFT kick. Each covers one specific attack, so they are reads on a known string rather than general defense.",
          whenToUse:
            "Against strings you have seen and can name. b+2+4 gives +24d on success, which is a substantial reward for a correct read.",
          leverlessTip:
            "Both are two-button chords with b. Because each covers only one limb, these are matchup knowledge as much as execution — learn the specific strings they beat.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 6,
            rep: "Parry a right punch with b+1+3 and a left kick with b+2+4.",
          },
          difficulty: "hard",
          tags: ["defense", "parry", "read"],
          moveKeys: ["parry-punch", "parry-kick"],
        },
        {
          id: "low-parry",
          stageId: "gameplan",
          name: "Low Parry",
          notation: "df",
          purpose:
            "The generic low parry, but King's converts unusually well: it applies Tornado on success, so a parried low becomes an instant-tornado combo straight into a Tomahawk.",
          whenToUse:
            "Against predictable lows. Wavu's combo list includes a low-parry route worth 49 damage that is essentially just the parry and a throw.",
          leverlessTip:
            "Tap df as the low comes out. The conversion is the easiest big damage in his kit — the parry does the hard work and the ender is a throw you already drilled.",
          drill: {
            type: "accuracy",
            attempts: 12,
            required: 7,
            rep: "Low parry and convert with the instant-tornado Tomahawk route.",
          },
          difficulty: "medium",
          tags: ["defense", "parry", "tornado"],
          moveKeys: ["low-parry", "tomahawk"],
        },
        {
          id: "lows",
          stageId: "gameplan",
          name: "The Low Game",
          notation: "d+3 · db+3 · FC.df+1 · f,f,n,2",
          purpose:
            "Lows exist to make them crouch — which is exactly what your crouch throws punish. db+3 counter-hits for +25a and tracks the left side; FC.df+1 is a low that LAUNCHES for +73a.",
          whenToUse:
            "In small doses to keep them honest. Every low you land makes the standing throw mixup more effective, and vice versa.",
          leverlessTip:
            "FC.df+1 is a genuine launcher off a low, but it is slow and -12. Use it as a hard read, and let db+3 and d+3 do the day-to-day work.",
          drill: {
            type: "total-reps",
            target: 20,
            rep: "Mix lows into your pressure without being launched for them.",
          },
          difficulty: "medium",
          tags: ["low", "mixup"],
          moveKeys: ["d3", "db3", "fc-df1", "ffn2", "db4"],
        },
        {
          id: "weaknesses",
          stageId: "gameplan",
          name: "Knowing Your Weaknesses",
          notation: "",
          purpose:
            "Wavu is specific about King's problems, and playing him well means routing around all of them: a large hurtbox, below-average movement, an awkwardly slow backdash cancel, risky panic moves, and prominent whiff recovery.",
          whenToUse:
            "Every time you are tempted to play neutral like a poker. You are big, slow to retreat, and punished hard for whiffing — so you win by getting in and staying in, not by trading at range.",
          leverlessTip:
            "The practical rule: do not throw long moves speculatively. King's whiff recovery means a missed swing at range is frequently a full combo against you.",
          drill: {
            type: "manual",
            checklist: [
              "Name King's five listed weaknesses from memory.",
              "Play a round where you never throw a move outside its effective range.",
              "Review one loss and identify whether you lost in neutral or in your own pressure.",
              "Name which of your panic options is safest, and when it is still wrong.",
            ],
          },
          difficulty: "medium",
          tags: ["concept", "honesty"],
        },
        {
          id: "the-plan",
          stageId: "gameplan",
          name: "The King Gameplan",
          notation: "",
          purpose:
            "Assemble it. Approach with the run and Beast Step. Make them block with df+1 and the homing mids. Then start the guess: Giant Swing breaks with 1, Tomahawk with 1+2 — and if they duck to avoid both, the crouch throws cannot be broken at all.",
          whenToUse:
            "Every round. King does not out-neutral people; he makes standing in front of him a series of unwinnable decisions.",
          leverlessTip:
            "Track what your opponent is doing about throws. Are they breaking? Ducking? Stepping? Each answer has a different punishment in your kit — breaking loses to the mid game, ducking loses to crouch throws, stepping loses to the homing chains and to Heat.",
          drill: {
            type: "manual",
            checklist: [
              "Win a round where every knockdown comes from a throw.",
              "Punish a ducking opponent with an unbreakable crouch throw.",
              "Catch a sidestepping opponent with a homing tool.",
              "Spend one full Heat window on armored Jaguar Sprint pressure.",
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
      options: ["2,1", "b+2,1", "uf+4", "b+3:1+2"],
      correctIndex: 0,
      explain:
        "2,1 is his i10 punish and is only -3 on block itself. b+2,1 needs -14, uf+4 needs -15 and b+3:1+2 needs -16.",
    },
    {
      id: "q-12",
      prompt: "-12",
      situation: "You blocked a heavier poke. Standing.",
      options: ["b+1,2", "2,1", "b+2,1", "f+2,1"],
      correctIndex: 0,
      explain:
        "b+1,2 is the -12 punish and carries the Tornado. If b+1 lands as a counter-hit instead, the string LAUNCHES for +70a.",
    },
    {
      id: "q-14",
      prompt: "-14",
      situation: "You blocked an unsafe mid, and their back is to a wall.",
      options: ["b+2,1", "b+1,2", "2,1", "ws4"],
      correctIndex: 0,
      explain:
        "b+2,1 is the -14 punish and it WALL SPLATS — near a wall that is worth far more than raw damage.",
    },
    {
      id: "q-15",
      prompt: "-15",
      situation: "You blocked a launcher-class move. Standing.",
      options: ["uf+4", "b+2,1", "b+1,2", "2,1"],
      correctIndex: 0,
      explain:
        "uf+4 launches at -15 for a full combo. f+2,1 also covers -15 and is a Heat Engager — take that instead when Heat is worth more than damage.",
    },
    {
      id: "q-16",
      prompt: "-16",
      situation: "They whiffed something huge. Standing, in range.",
      options: ["b+3:1+2", "2,1", "b+1,2", "df+1"],
      correctIndex: 0,
      explain:
        "b+3:1+2 is the -16 punish. The colon looks like a just frame but the window is frames 2~17 of b+3 — Wavu rates its dexterity requirement at zero.",
    },
    {
      id: "q-ws11",
      prompt: "-11 ws",
      situation: "You blocked a low. You are crouching.",
      options: ["ws4", "ws2,2", "FC.df+2", "ws1+2"],
      correctIndex: 0,
      explain:
        "ws4 is the -11 crouching punish at only -6. ws2,2 needs -14, FC.df+2 needs -15 and ws1+2 needs -18.",
    },
    {
      id: "q-ws15",
      prompt: "-15 ws",
      situation: "You blocked a badly unsafe low. Crouching.",
      options: ["FC.df+2", "ws4", "ws2,2", "d+3"],
      correctIndex: 0,
      explain:
        "FC.df+2 LAUNCHES at -15 and crumples on hit for a big combo. ws2,2 at -14 is the safer pick if you are unsure of the number.",
    },
    {
      id: "q-grounded",
      prompt: "GROUNDED",
      situation: "They are lying on the floor and not teching.",
      options: ["d+3", "uf+4", "2,1", "b+1,2"],
      correctIndex: 0,
      explain:
        "King has a full grounded punish ladder that most players never use: d+3 at -17, db+3 at -23, db+4 at -29 and d+2+3 at -33. Free damage every knockdown.",
    },
    {
      id: "q-break-gs",
      prompt: "GIANT SWING",
      situation: "A King is winding up f,hcf+1 on you. Which button breaks it?",
      options: ["1", "2", "1+2", "It cannot be broken"],
      correctIndex: 0,
      explain:
        "Giant Swing is a 1 throw, so it breaks with 1. Its partner Tomahawk breaks with 1+2 — guessing between those two is the entire King mixup.",
    },
    {
      id: "q-break-crouch",
      prompt: "CROUCH THROW",
      situation: "You ducked to avoid a throw and got caught by d+1+4 instead.",
      options: ["It cannot be broken", "1", "2", "1+2"],
      correctIndex: 0,
      explain:
        "Crouch throws cannot be thrown break at all. That is why ducking is not a real answer to King — the correct counter-play to his standing throws walks straight into 35 unbreakable damage.",
    },
  ],
};
