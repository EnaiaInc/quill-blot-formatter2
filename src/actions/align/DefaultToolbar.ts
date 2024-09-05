import Quill from "quill"
import { Toolbar } from "./Toolbar"
import { Resizer } from "./Align"
import type { Size } from "./Alignment"
import BlotFormatter from "../../BlotFormatter"
import type { Blot } from "../../specs/BlotSpec"
import AttributeAction from "../AttributeAction"

export default class DefaultToolbar implements Toolbar {
  toolbar: HTMLElement | null
  buttons: HTMLElement[]

  constructor() {
    this.toolbar = null
    this.buttons = []
  }

  create(formatter: BlotFormatter, resizer: Resizer): HTMLElement {
    const toolbar = document.createElement("div")
    toolbar.classList.add(formatter.options.resize.toolbar.mainClassName)
    this.addToolbarStyle(formatter, toolbar)
    this.addButtons(formatter, toolbar, resizer)

    this.toolbar = toolbar
    return this.toolbar
  }

  destroy() {
    this.toolbar = null
    this.buttons = []
  }

  getElement() {
    return this.toolbar
  }

  addToolbarStyle(formatter: BlotFormatter, toolbar: HTMLElement) {
    if (formatter.options.resize.toolbar.mainStyle) {
      Object.assign(toolbar.style, formatter.options.resize.toolbar.mainStyle)
    }
  }

  addButtonStyle(button: HTMLElement, index: number, formatter: BlotFormatter) {
    if (formatter.options.resize.toolbar.buttonStyle) {
      Object.assign(button.style, formatter.options.resize.toolbar.buttonStyle)
      if (index > 0) {
        button.style.borderLeftWidth = "0" // eslint-disable-line no-param-reassign
      }
    }

    if (formatter.options.resize.toolbar.svgStyle) {
      const childElement = button.children[0] as HTMLElement // Type assertion
      if (childElement) {
        Object.assign(
          childElement.style,
          formatter.options.resize.toolbar.svgStyle,
        )
      }
    }
  }

  addButtons(formatter: BlotFormatter, toolbar: HTMLElement, resizer: Resizer) {
    let resize_counter: number = 0
    resizer.getSizes().forEach((size, i) => {
      const button = document.createElement("span")
      button.classList.add(formatter.options.resize.toolbar.buttonClassName)
      button.innerHTML = size.icon
      button.addEventListener("click", () => {
        this.onButtonClick(button, formatter, size, resizer)
      })
      this.preselectButton(button, size, formatter, resizer)
      this.addButtonStyle(button, i, formatter)
      this.buttons.push(button)
      toolbar.appendChild(button)
      resize_counter = i
    })
    // Add alt/title button if target is image
    const targetElement = formatter.currentSpec?.getTargetElement()
    if (targetElement?.tagName === "IMG") {
      const attributeAction = new AttributeAction(formatter)
      const button = document.createElement("span")
      button.classList.add(formatter.options.resize.toolbar.buttonClassName)
      button.innerHTML = attributeAction.icon
      button.addEventListener("click", (event) => {
        attributeAction.showAltTitleModal(event)
      })
      this.addButtonStyle(button, ++resize_counter, formatter)
      this.buttons.push(button)
      toolbar.appendChild(button)
    }
  }

  preselectButton(
    button: HTMLElement,
    size: Size,
    formatter: BlotFormatter,
    resizer: Resizer,
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    const blot = Quill.find(target) as Blot | null
    if (resizer.isResized(blot, size)) {
      this.selectButton(formatter, button)
    }
  }

  onButtonClick(
    button: HTMLElement,
    formatter: BlotFormatter,
    size: Size,
    resizer: Resizer,
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    this.clickButton(button, target, formatter, size, resizer)
  }

  clickButton(
    button: HTMLElement,
    resizeTarget: HTMLElement,
    formatter: BlotFormatter,
    size: Size,
    resizer: Resizer,
  ) {
    this.buttons.forEach((b) => {
      this.deselectButton(formatter, b)
    })
    const blot = Quill.find(resizeTarget) as Blot | null
    if (resizer.isResized(blot, size)) {
      if (formatter.options.resize.toolbar.allowDeselect) {
        resizer.clear(blot)
      } else {
        this.selectButton(formatter, button)
      }
    } else {
      this.selectButton(formatter, button)
      size.apply(blot)
    }

    formatter.update()
  }

  selectButton(formatter: BlotFormatter, button: HTMLElement) {
    button.classList.add("is-selected")
    if (formatter.options.resize.toolbar.addButtonSelectStyle) {
      button.style.setProperty("filter", "invert(20%)")
    }
  }

  deselectButton(formatter: BlotFormatter, button: HTMLElement) {
    button.classList.remove("is-selected")
    if (formatter.options.resize.toolbar.addButtonSelectStyle) {
      button.style.removeProperty("filter")
    }
  }
}
