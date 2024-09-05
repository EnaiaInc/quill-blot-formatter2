import BlotSpec from "./specs/BlotSpec"
import ImageSpec from "./specs/ImageSpec"

type Constructor<T> = new (...args: any[]) => T

export type OverlayOptions = {
  // classname applied to the overlay element
  className: string
  // style applied to overlay element, or null to prevent styles
  style?: { [key: string]: any } | null | undefined
  // String literal labels rendered in the user interface
  labels: { [key: string]: any }
}

export type ResizeOptions = {
  // the name of the attribute for an element that has its size changed
  attribute: string
  // labels used for size
  labels: {
    small: string
    best_fit: string
    original: string
    attribute: string
  }
  // the toolbar so users can change sizes
  toolbar: {
    // whether or not users can deselect an size. it's up to you to set the initial size
    allowDeselect: boolean
    // class name applied to the root toolbar element
    mainClassName: string
    // style applied to root toolbar element, or null to prevent styles
    mainStyle?: { [key: string]: any } | null | undefined
    // class name applied to each button in the toolbar
    buttonClassName: string
    /* whether or not to add the selected style to the buttons.
    they'll always get the is-selected class */
    addButtonSelectStyle: boolean
    // style applied to buttons, or null to prevent styles
    buttonStyle?: { [key: string]: any } | null | undefined
    // style applied to the buttonChilds in the buttons
    buttonChildStyle?: { [key: string]: any } | null | undefined
  }
}

export type ImageOptions = {
  registerImageTitleBlot: Boolean
}

export type Options = {
  // the BlotSpecs supported
  specs: Array<Constructor<BlotSpec>>
  overlay: OverlayOptions
  resize: ResizeOptions
  image: ImageOptions
}

const DefaultOptions: Options = {
  specs: [ImageSpec],
  overlay: {
    className: "blot-formatter__overlay",
    style: {
      position: "absolute",
      boxSizing: "border-box",
      border: "1px dashed #444",
    },
    labels: {
      alt: "Alt Text",
      title: "Image Title",
    },
  },
  resize: {
    attribute: "data-resize",
    labels: {
      small: "Small",
      best_fit: "Best fit",
      original: "Original",
      attribute: "Edit alt text",
    },
    toolbar: {
      allowDeselect: true,
      mainClassName: "blot-formatter__toolbar",
      mainStyle: {
        position: "absolute",
        top: "-12px",
        right: "0",
        left: "0",
        height: "0",
        minWidth: "100px",
        font: "12px/1.0 Arial, Helvetica, sans-serif",
        textAlign: "center",
        color: "#333",
        boxSizing: "border-box",
        cursor: "default",
        zIndex: "1",
      },
      buttonClassName: "blot-formatter__toolbar-button",
      addButtonSelectStyle: true,
      buttonStyle: {
        display: "inline-block",
        height: "18px",
        padding: "0.25rem",
        background: "white",
        border: "1px solid #ccc",
        verticalAlign: "middle",
        cursor: "pointer",
      },
      buttonChildStyle: {},
    },
  },
  image: {
    registerImageTitleBlot: false,
  },
}

export default DefaultOptions
