import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Home } from "./routes/home/index";
import { Route, BrowserRouter } from "react-router-dom";

const App = () => {

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Route exact path="/"  component={Home} key="home" />
    </div>
  );
};
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
