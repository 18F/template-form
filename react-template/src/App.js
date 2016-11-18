import React, { Component } from 'react';
import './App.css';
import * as helpers from './helpers';
import * as request from 'superagent';
import { FormFiller, Header, RenderedTemplate, SelectTemplate } from './components'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {templateLoded: false,
                  templateText: '',
                  availableSchemas: [],
                  formData: '',
                  templateRepo: 'acq-templates',
                  remoteBranch: 'sow-yaml-schema'
                  };
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
  }

  handleSelectTemplate(templateSelected){
    this.setState({templateLoaded: templateSelected.loaded,
                   availableSchemas: templateSelected.schemas});
  }

  componentWillUpdate(nextProps, nextState) {
  if (nextState.templateLoaded !== this.state.templateLoaded) {
    this.getTemplateData(nextState);
  }
 }

 getTemplateData(updatedState){
    var self = this;
    const url = 'https://api.github.com/repos/18F/'+this.state.templateRepo+'/contents/'+updatedState.templateLoaded;
    request
    .get(url)
    .set('Accept', 'application/json')
    .query({ ref: this.state.remoteBranch })
    .end(function(err, res){
      var rawMarkdown = helpers.decodeContent(res);
      self.setState({templateText: rawMarkdown});
    });
  }

  handleFormEntry(formData){
    this.setState({formData: formData})
  }

  render() {
    return (
      <div>
      <Header />
      <div className="usa-overlay"></div>
      <main id="main-content">
      <div className="usa-grid">
          <div className="row">
              <div className="usa-width-one-half">
                <SelectTemplate onUserChange={this.handleSelectTemplate}
                                templateLoaded={this.state.templateLoaded}
                                repoForTemplates={this.state.templateRepo}
                                branchForTemplates={this.state.remoteBranch}
                />

                <FormFiller templateLoaded={this.state.templateLoaded}
                            availableSchemas={this.state.availableSchemas}
                            formData={this.handleFormEntry} templateRepo={this.state.templateRepo}
                            remoteBranch={this.state.remoteBranch}
                />
              </div>
              <div className="usa-width-one-half">
                <RenderedTemplate templateText={this.state.templateText}
                                  formData={this.state.formData}
                />
              </div>
          </div>
      </div>
      </main>
      </div>
    );
  }
}

export default App;
