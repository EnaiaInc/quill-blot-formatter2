import type { Size } from "./Alignment"
import type { Blot } from "../../specs/BlotSpec"

export interface Resizer {
  getSizes(): Size[]
  isResized(blot: Blot | null, size: Size): boolean
  clear(blot: Blot | null): void
}
