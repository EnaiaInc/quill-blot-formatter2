import Quill from "quill"
import { Resizer } from "./Align"
import type { Size } from "./Alignment"
import type { Blot } from "../../specs/BlotSpec"
import type { ResizeOptions } from "../../Options"
import { ImageResize } from "./AlignFormats"

const parchment = Quill.import("parchment") as any
const { Scope } = parchment

const LEFT_ALIGN: string = "left"
const CENTER_ALIGN: string = "center"
const RIGHT_ALIGN: string = "right"

export default class DefaultResizer implements Resizer {
  sizes: { [key: string]: Size }

  constructor(options: ResizeOptions) {
    this.sizes = {
      [LEFT_ALIGN]: {
        name: LEFT_ALIGN,
        icon: options.icons.left,
        apply: (blot: Blot | null) => {
          this.setSize(blot, LEFT_ALIGN)
        },
      },
      [CENTER_ALIGN]: {
        name: CENTER_ALIGN,
        icon: options.icons.center,
        apply: (blot: Blot | null) => {
          this.setSize(blot, CENTER_ALIGN)
        },
      },
      [RIGHT_ALIGN]: {
        name: RIGHT_ALIGN,
        icon: options.icons.right,
        apply: (blot: Blot | null) => {
          this.setSize(blot, RIGHT_ALIGN)
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
