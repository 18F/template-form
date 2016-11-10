import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class SelectTemplate extends Component {
  render() {
    return (
      <div id="select_template"><select></select></div>
    );
  }
}
class FormFiller extends Component {
  render() {
    return (
      <div id="template_form_container">
          <form id="template_form">
          </form>
      </div>
    );
  }
}

class RenderedTemplate extends Component {
  render() {
    return (
      <div id="rendered_template">Please Select a Template to View</div>
    );
  }
}

class DownloadButton extends Component {
  render() {
    return (
      <button>Download</button>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="usa-grid">
          <div className="row">
              <div className="usa-width-one-half">
              <SelectTemplate />
              <FormFiller />
              </div>
              <div className="usa-width-one-half">
                  <RenderedTemplate />
                  <DownloadButton />
              </div>
          </div>

      </div>
    );
  }
}

export default App;
