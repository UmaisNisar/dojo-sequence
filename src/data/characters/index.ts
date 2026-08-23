import type { Character, ComingSoonCharacter } from "@/types";
import { kazuya } from "./kazuya";
import { lars } from "./lars";
import { bryan } from "./bryan";

/**
 * Character registry. Adding a new character = add a data file and list it here.
 * The UI never special-cases individual characters.
 */
export const characters: Character[] = [kazuya, lars, bryan];

export const comingSoon: ComingSoonCharacter[] = [
  { id: "jin", name: "Jin Kazama", style: "Traditional Karate", available: false },
  { id: "reina", name: "Reina", style: "Taido & Mishima Style", available: false },
  { id: "devil-jin", name: "Devil Jin", style: "Advanced Mishima Style", available: false },
  { id: "king", name: "King", style: "Pro Wrestling", available: false },
  { id: "dragunov", name: "Sergei Dragunov", style: "Commando Sambo", available: false },
  { id: "paul", name: "Paul Phoenix", style: "Integrated Martial Arts", available: false },
  { id: "law", name: "Marshall Law", style: "Martial Arts", available: false },
  { id: "hwoarang", name: "Hwoarang", style: "Taekwondo", available: false },
  { id: "xiaoyu", name: "Ling Xiaoyu", style: "Chinese Martial Arts", available: false },
  { id: "steve", name: "Steve Fox", style: "Boxing", available: false },
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
