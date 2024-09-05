import type { Blot } from "../../specs/BlotSpec"

export type Size = {
  name: string
  icon: string
  apply: (blot: Blot | null) => void
}
