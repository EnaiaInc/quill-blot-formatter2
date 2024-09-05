import type { Blot } from "../../specs/BlotSpec"

export type Size = {
  name: string
  label: string
  apply: (blot: Blot | null) => void
}
