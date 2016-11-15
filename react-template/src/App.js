import React, { Component } from 'react';
import './App.css';
import * as request from 'superagent';
import { Markdown } from 'react-showdown';
import * as Handlebars from 'handlebars';
import * as helpers from './helpers';
import * as YAML from 'yamljs';

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

  renderListItem(items, initKey){
    const selectors = [];
    selectors.push(<option key={initKey} value={false}>Select a template type</option>);
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
          {this.renderListItem(selectedTemplates, 'directory')}
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
          {this.renderListItem(this.state.availableTemplateDirectories, 'template')}
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

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    this.getSchema();
  }

  getSchema(){
    var self = this;
    if(this.props.templateLoaded && this.props.templateLoaded !== this.state.lastTemplate){
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
          self.setState({templateSchema:schemaData});
        }
      });
      self.setState({lastTemplate: this.props.templateLoaded});
    }
  }

  handleChange(event){
    this.setState({templateSchema: event.target.value});
    this.props.formData(event.target.value);
  }

  render() {
    if(this.props.templateLoaded){
      return (
        <div id="template_form_container">
            <form id="template_form">
            <textarea value={this.state.templateSchema} onChange={this.handleChange} />
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
    this.state =  {formObject: {},
                braidedText: '',
                lastData: false,
                lastBraided: false};
  }

  componentWillReceiveProps() {
    this.parseYml();
  }

  componentWillUpdate(){
    const handledBarText = this.handlingBars();
    if(handledBarText !== this.state.lastBraided){
          this.setState({braidedText: handledBarText,
                         lastBraided: handledBarText});
    }
  }

  parseYml(){
    if(this.props.formData !== '' & this.props.formData !== this.state.lastData){
      const parsedYml = YAML.parse(this.props.formData);
      this.setState({formObject: parsedYml,
                    lastData: parsedYml});
      // this.handlingBars();
    }
  }

  handlingBars(){
    if(this.props.templateText !== ''){
      const template = Handlebars.compile(this.props.templateText);
      const handledBar = template(this.state.formObject);
      return handledBar;
      // this.setState({braidedText: handledBar});

    }
  }
  render() {

    if(this.props.templateText === ''){
      return (
        <div id="rendered_template">Please Select a Template to View</div>
      );
    } else {
      return (
        <div id="rendered_template"><Markdown markup={ this.state.braidedText } tables={true} components={{ }} /></div>
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
                  availableSchemas: [],
                  formData: ''};
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
  }

  handleSelectTemplate(templateSelected){
    this.setState({templateLoaded: templateSelected.loaded,
                   availableSchemas: templateSelected.schemas});
    if(this.state.templateLoaded){
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

  handleFormEntry(formData){
    this.setState({formData: formData})
  }

  render() {
    return (
      <div className="usa-grid">
          <div className="row">
              <div className="usa-width-one-half">
              <SelectTemplate onUserChange={this.handleSelectTemplate} templateLoaded={this.state.templateLoaded}/>
              <FormFiller templateLoaded={this.state.templateLoaded} availableSchemas={this.state.availableSchemas} formData={this.handleFormEntry}/>
              </div>
              <div className="usa-width-one-half">
                  <RenderedTemplate templateText={this.state.templateText} formData={this.state.formData}/>
                  <DownloadButton />
              </div>
          </div>
      </div>
    );
  }
}

export default App;
