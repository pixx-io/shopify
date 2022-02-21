import React from "react";
import { setLocale, getAvailableLocale } from "../shared/translation";
import MainPage from "./main-page";

class Index extends React.Component {
  state = { locale: "" };

  componentDidMount() {
    setLocale();
    this.setState({ locale: getAvailableLocale() });
  }

  render() {
    return this.state.locale ? <MainPage /> : null;
  }
}

export default Index;
