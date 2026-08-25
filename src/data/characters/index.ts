import type { Character, ComingSoonCharacter } from "@/types";
import { kazuya } from "./kazuya";
import { lars } from "./lars";
import { bryan } from "./bryan";
import { jin } from "./jin";
import { king } from "./king";
import { dragunov } from "./dragunov";
import { steve } from "./steve";
import { hwoarang } from "./hwoarang";

/**
 * Character registry. Adding a new character = add a data file and list it here.
 * The UI never special-cases individual characters.
 */
export const characters: Character[] = [
  kazuya,
  lars,
  bryan,
  jin,
  king,
  dragunov,
  steve,
  hwoarang,
];

export const comingSoon: ComingSoonCharacter[] = [
  { id: "reina", name: "Reina", style: "Taido & Mishima Style", available: false },
  { id: "devil-jin", name: "Devil Jin", style: "Advanced Mishima Style", available: false },
  { id: "paul", name: "Paul Phoenix", style: "Integrated Martial Arts", available: false },
  { id: "law", name: "Marshall Law", style: "Martial Arts", available: false },
  { id: "xiaoyu", name: "Ling Xiaoyu", style: "Chinese Martial Arts", available: false },
  { id: "nina", name: "Nina Williams", style: "Assassination Arts", available: false },
  { id: "asuka", name: "Asuka Kazama", style: "Kazama-Style Martial Arts", available: false },
  { id: "jun", name: "Jun Kazama", style: "Kazama-Style Martial Arts", available: false },
  { id: "lili", name: "Lili", style: "Freestyle Fighting", available: false },
  { id: "yoshimitsu", name: "Yoshimitsu", style: "Manji Ninjutsu", available: false },
  { id: "claudio", name: "Claudio Serafino", style: "Sirius Exorcism Arts", available: false },
  { id: "victor", name: "Victor Chevalier", style: "Polyvalent CQC", available: false },
  { id: "azucena", name: "Azucena", style: "Mixed Martial Arts", available: false },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export const defaultCharacterId = kazuya.id;
