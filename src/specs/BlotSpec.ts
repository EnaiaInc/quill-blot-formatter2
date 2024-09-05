import BlotFormatter from "../BlotFormatter"
import Action from "../actions/Action"
import ResizeAction from "../actions/resize/ResizeAction"
import DeleteAction from "../actions/DeleteAction"

export interface Blot {
  domNode: HTMLElement
  parent: Blot | null
  next: Blot | null
  prev: Blot | null
  statics: any | null
  format(name: string, value: any): void | undefined
  formats(): { [key: string]: any }
  length(): number
}

export default class BlotSpec {
  formatter: BlotFormatter

  constructor(formatter: BlotFormatter) {
    this.formatter = formatter
  }

  init(): void {}

  getActions(): Array<Action> {
    return [new ResizeAction(this.formatter), new DeleteAction(this.formatter)]
  }

  getTargetElement(): HTMLElement | null {
    return null
  }

  getOverlayElement(): HTMLElement | null {
    return this.getTargetElement()
  }

  setSelection(): void {
    this.formatter.quill.setSelection(null)
  }

  onHide() {}
}
