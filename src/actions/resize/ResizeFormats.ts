import Quill from "quill"
export const InlineBlot = Quill.import("blots/inline") as any
const Delta = Quill.import("delta")
const parchment = Quill.import("parchment") as any
const { ClassAttributor, Scope } = parchment

interface ImageResizeValue {
  resize: string
  title: string
}

class ImageResizeAttributor extends ClassAttributor {
  constructor() {
    super("imageResize", "ql-image-resize", {
      scope: Scope.INLINE,
      whitelist: ["small", "bestfit", "original"],
    })
  }

  add(node: Element, value: ImageResizeValue): boolean {
    if (typeof value === "object") {
      super.add(node, value.resize)
      node.setAttribute("data-title", value.title)
      return true
    } else {
      return super.add(node, value)
    }
  }

  value(node: Element): ImageResizeValue {
    const className = super.value(node)
    const title = node.getAttribute("data-title") || ""
    return {
      resize: className,
      title: title,
    }
  }
}

const ImageResize = new ImageResizeAttributor()

// Register the custom resize formats with Quill
Quill.register(
  {
    "formats/imageResize": ImageResize,
    "attributors/class/imageResize": ImageResize,
  },
  true,
)

export { ImageResize }
