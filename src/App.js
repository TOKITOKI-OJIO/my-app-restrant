import * as React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./layout";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout></Layout>
      </Router>
    </div>
  );
}

export default App;
