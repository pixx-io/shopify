import React from "react";
// next line is needed, don't remove "PIXXIO import" even if your linter says it is not used
import * as PIXXIO from "@pixx.io/jsdk/build/pixxio.jsdk.min.js";
import "@pixx.io/jsdk/build/pixxio.jsdk.css";

const mediaConfig = {
  allowedTypes: ["jpg", "png"],
  allowedFormats: ["original", "preview"],
  showFileSize: true,
  max: 30,
};

class PixxioJsdk extends React.Component {
  constructor(props) {
    super(props);
    this.onSelection = this.selection.bind(this);
    this.pixxioRef = React.createRef();
  }

  componentDidMount() {
    this.setUpJsdk();
  }

  setUpJsdk() {
    this.p = new global.PIXXIO({
      appKey: this.props.appKey,
      element: this.pixxioRef.current,
      language: this.props.language,
      askForProxy: false,
    });
    this.promiseMedia();
  }

  promiseMedia() {
    this.p.getMedia(mediaConfig).then((files) => this.selection(files));
  }

  selection(files) {
    this.props.onSelection(files);
    this.promiseMedia();
  }

  render() {
    return <div className="pixxioJsdkContainer" ref={this.pixxioRef}></div>;
  }
}

export default PixxioJsdk;
