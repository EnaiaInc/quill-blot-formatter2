import { Resizer } from "./Resizer"
import BlotFormatter from "../../BlotFormatter"

export interface Toolbar {
  create(formatter: BlotFormatter, sizeHelper: Resizer): HTMLElement
  destroy(): void
  getElement(): HTMLElement | null
}
