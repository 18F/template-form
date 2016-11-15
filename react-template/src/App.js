import React, { Component } from 'react';
import './App.css';
import * as request from 'superagent';
import { Markdown } from 'react-showdown';
import 'handlebars';
import * as helpers from './helpers';

const templateRepo = 'acq-templates';
const remoteBranch = 'sow-yaml-schema';
// const markdown = new showdown.Converter({'tables': true});

class SelectTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {repoForTemplates: templateRepo,
                  branchForTemplates: remoteBranch,
                  availableTemplateDirectories: [],
                  availableTemplateFiles: {},
                  availableSchemaFiles: {},
                  templateDirectorySelected: false,
                  templateSelected: false,
                };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSub = this.handleChangeSub.bind(this);
  }
  componentDidMount() {
    this.getGitFiles();
  }

  componentWillUnmount() {

  }

  getGitFiles(){
    const url = 'https://api.github.com/repos/18F/'+this.state.repoForTemplates+'/git/trees/'+this.state.branchForTemplates+'?recursive=1';
    const self = this;
    request
    .get(url)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if(err){
        console.log(err.toString());
      }
      if(res){
        const parsedData = JSON.parse(res.text);
        const directories = parsedData.tree.filter(gitPath => gitPath.type === 'tree');
        const templateFileHash = helpers.createFileHash(parsedData.tree, 'md');
        const schemaFileHash = helpers.createFileHash(parsedData.tree, 'yml');
        self.setState({availableTemplateDirectories: directories,
                      availableTemplateFiles: templateFileHash,
                      availableSchemaFiles: schemaFileHash});
      }
    });
  }

  renderListItem(items){
    const selectors = [];
    selectors.push(<option key={false} value={false}>Select a template type</option>);
    items.forEach(item => {
      selectors.push(<option key={item.path} value={item.path}>{helpers.labelMaker(item.path)}</option>)
    })
    return selectors;
  }

  handleChange(event){
    this.setState({templateDirectorySelected: event.target.value})
  }

  handleChangeSub(event){
    this.props.onUserChange({loaded: event.target.value, schemas: this.state.availableSchemaFiles[this.state.templateDirectorySelected]});
  }

  renderFileSelect(){
    if(this.state.templateDirectorySelected){
      const selectedTemplates = this.state.availableTemplateFiles[this.state.templateDirectorySelected];

      return(
        <div>
        Please choose a template.
        <select value={this.state.templateDirectorySelected} onChange={this.handleChangeSub}>
          {this.renderListItem(selectedTemplates)}
        </select>
        </div>
      )
    }
  }

  render() {
    return (
      <div id="select_template">
      Please Select what type of template you would like to complete.
        <select onChange={this.handleChange}>
          {this.renderListItem(this.state.availableTemplateDirectories)}
        </select>
        {this.renderFileSelect()}
      </div>
    );
  }
}

class FormFiller extends Component {
  constructor(props) {
    super(props);
    this.state = {templateSchema: '',
                  lastTemplate: false};
  }

  componentDidUpdate() {
    this.getSchema();
  }

  getSchema(){
    var self = this;
    if(this.props.templateLoaded && this.props.templateLoaded !== this.state.lastTemplate){
      console.log(this.props.availableSchemas);
      const url = 'https://api.github.com/repos/18F/'+templateRepo+'/contents/'+ this.props.availableSchemas[0].path;
      request
      .get(url)
      .query({ ref: remoteBranch })
      .set('Accept', 'application/json')
      .end(function(err, res){
        if(err){
          console.log(err.toString());
        }
        if(res){
          var schemaData = helpers.decodeContent(res);
          console.log(schemaData);
          self.setState({templateSchema:schemaData});
        }
      });
      self.setState({lastTemplate: this.props.templateLoaded})
    }
  }

  render() {
    if(this.props.templateLoaded){
      return (
        <div id="template_form_container">
            <form id="template_form">
            <textarea value={this.state.templateSchema}></textarea>
            </form>
        </div>
      );
    } else {
      return (
        <div id="template_form_container">
        </div>
      )
    }
  }
}

class RenderedTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    if(this.props.templateText === ''){
      return (
        <div id="rendered_template">Please Select a Template to View</div>
      );
    } else {
      return (
        <div id="rendered_template"><Markdown markup={ this.props.templateText } tables={true} components={{ }} /></div>
      );
    }

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
  constructor(props) {
    super(props);
    this.state = {templateLoded: false,
                  templateText: '',
                  availableSchemas: []};
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
  }

  handleSelectTemplate(templateSelected){
    this.setState({templateLoaded: templateSelected.loaded,
                   availableSchemas: templateSelected.schemas});
    if(this.state.templateLoaded){
      console.log(this.state.availableSchemas);
      this.getTemplateData();
    }
  }

  getTemplateData(){
    var self = this;
    const url = 'https://api.github.com/repos/18F/'+templateRepo+'/contents/'+this.state.templateLoaded;
    request
    .get(url)
    .set('Accept', 'application/json')
    .query({ ref: remoteBranch })
    .end(function(err, res){
      var rawMarkdown = helpers.decodeContent(res);
      self.setState({templateText: rawMarkdown});
    });
  }

  render() {
    return (
      <div className="usa-grid">
          <div className="row">
              <div className="usa-width-one-half">
              <SelectTemplate onUserChange={this.handleSelectTemplate} templateLoaded={this.state.templateLoaded}/>
              <FormFiller templateLoaded={this.state.templateLoaded} availableSchemas={this.state.availableSchemas}/>
              </div>
              <div className="usa-width-one-half">
                  <RenderedTemplate templateText={this.state.templateText}/>
                  <DownloadButton />
              </div>
          </div>
      </div>
    );
  }
}

export default App;
