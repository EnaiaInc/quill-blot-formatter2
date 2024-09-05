import Action from "../Action"
import BlotFormatter from "../../BlotFormatter"
import DefaultResizer from "./DefaultResizer"
import { Resizer } from "./Resizer"
import { Toolbar } from "./Toolbar"
import DefaultToolbar from "./DefaultToolbar"

export default class ResizeAction extends Action {
  toolbar: Toolbar
  resizer: Resizer

  constructor(formatter: BlotFormatter) {
    super(formatter)
    this.resizer = new DefaultResizer(formatter.options.resize)
    this.toolbar = new DefaultToolbar()
  }

  onCreate() {
    const toolbar = this.toolbar.create(this.formatter, this.resizer)
    this.formatter.overlay.appendChild(toolbar)
  }

  onDestroy() {
    const toolbar = this.toolbar.getElement()
    if (!toolbar) {
      return
    }

    this.formatter.overlay.removeChild(toolbar)
    this.toolbar.destroy()
  }
}
