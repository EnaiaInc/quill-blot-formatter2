import Quill from "quill"
import { Resizer } from "./Resizer"
import type { Size } from "./Size"
import type { Blot } from "../../specs/BlotSpec"
import type { ResizeOptions } from "../../Options"
import { ImageResize } from "./ResizeFormats"

const parchment = Quill.import("parchment") as any
const { Scope } = parchment

const SMALL_SIZE: string = "small"
const BEST_FIT_SIZE: string = "bestfit"
const ORIGINAL_SIZE: string = "original"

export default class DefaultResizer implements Resizer {
  sizes: { [key: string]: Size }

  constructor(options: ResizeOptions) {
    this.sizes = {
      [SMALL_SIZE]: {
        name: SMALL_SIZE,
        icon: options.icons.small,
        apply: (blot: Blot | null) => {
          this.setSize(blot, SMALL_SIZE)
        },
      },
      [BEST_FIT_SIZE]: {
        name: BEST_FIT_SIZE,
        icon: options.icons.best_fit,
        apply: (blot: Blot | null) => {
          this.setSize(blot, BEST_FIT_SIZE)
        },
      },
      [ORIGINAL_SIZE]: {
        name: ORIGINAL_SIZE,
        icon: options.icons.original,
        apply: (blot: Blot | null) => {
          this.setSize(blot, ORIGINAL_SIZE)
        },
      },
    }
  }

  getSizes(): Size[] {
    return Object.keys(this.sizes).map((k) => this.sizes[k])
  }

  clear(blot: Blot | null): void {
    if (blot != null) {
      if (blot.domNode.tagName === "IMG") {
        if (blot.parent !== null && blot.parent.domNode.tagName === "SPAN") {
          blot.parent.format(ImageResize.attrName, false)
        }
      }
    }
  }

  isInlineBlot(blot: Blot): boolean {
    return (blot.statics?.scope & Scope.INLINE) === Scope.INLINE_BLOT
  }

  isBlockBlot(blot: Blot): boolean {
    return (blot.statics?.scope & Scope.BLOCK) === Scope.BLOCK_BLOT
  }

  hasInlineScope(blot: Blot): boolean {
    return (blot.statics.scope & Scope.INLINE) === Scope.INLINE
  }

  hasBlockScope(blot: Blot): boolean {
    return (blot.statics.scope & Scope.BLOCK) === Scope.BLOCK
  }

  isResized(blot: Blot | null, size: Size): boolean {
    if (blot != null) {
      if (this.isInlineBlot(blot) || this.hasInlineScope(blot)) {
        // .formats() only returns value on parent for inline class attributers
        const imageSize = blot.parent?.formats()[ImageResize.attrName]?.resize
        return imageSize === size.name
      }
    }
    return false
  }

  setSize(blot: Blot | null, size: string) {
    if (blot != null) {
      const hasSize = this.isResized(blot, this.sizes[size])
      this.clear(blot)
      if (!hasSize) {
        if (this.isInlineBlot(blot) || this.hasInlineScope(blot)) {
          blot.format(ImageResize.attrName, {
            resize: this.sizes[size].name,
            title: blot.domNode.getAttribute("title") || "",
          })
        }
      }
    }
  }
}
