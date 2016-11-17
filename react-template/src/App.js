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
    this.setState({templateSelected: event.target.value})
  }

  renderFileSelect(){
    if(this.state.templateDirectorySelected){
      const selectedTemplates = this.state.availableTemplateFiles[this.state.templateDirectorySelected];

      return(
        <div>
        Please choose a template.
        <select value={this.state.templateSelected} onChange={this.handleChangeSub}>
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
                  lastTemplate: false,
                  emptySchema: ''};

    this.handleChange = this.handleChange.bind(this);
    this.clearData = this.clearData.bind(this);
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
          self.setState({templateSchema:schemaData,
                        emptySchema: schemaData});
        }
      });
      self.setState({lastTemplate: this.props.templateLoaded});
    }
  }

  handleChange(event){
    this.setState({templateSchema: event.target.value});
    this.props.formData(event.target.value);
  }

  clearData(){
    this.setState({templateSchema: this.state.emptySchema});
    this.props.formData(this.state.emptySchema);
  }


  render() {
    if(this.props.templateLoaded){
      return (
        <div id="template_form_container">
            <form id="template_form">
            <textarea value={this.state.templateSchema} onChange={this.handleChange} className="yaml-textarea" />
            </form>
            <DataButton text="Clear Data" fxn={this.clearData} />
            <DataButton text="Copy Data" fxn={helpers.copyData('.yaml-textarea')} />
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

class DataButton extends Component {
  constructor(props){
    super(props);
  }
  render () {
    return (
      <button onClick={this.props.fxn}>{this.props.text}</button>
    )
  }
}

class RenderedTemplate extends Component {
  constructor(props) {
    super(props);
    this.state =  {formObject: {},
                braidedText: ''};
   this.downloadMD = this.downloadMD.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.parseYml(nextProps);
  }

  parseYml(updatedProps){
    if(updatedProps.formData !== this.props.formData){
      const parsedYml = YAML.parse(updatedProps.formData);
      this.setState({formObject: parsedYml});
      this.handlingBars(updatedProps, parsedYml);
    } else if (updatedProps.templateText !== this.props.templateText){
        this.handlingBars(updatedProps, this.state.formObject);
    }

  }

  handlingBars(updatedProps, handlesObject){
      const template = Handlebars.compile(updatedProps.templateText);
      const handledBar = template(handlesObject);
      this.setState({braidedText: handledBar});
  }

  downloadMD(){
    window.open("data:application/txt," + encodeURIComponent(this.state.braidedText), "_self");
  }

  render() {

    if(this.props.templateText === ''){
      return (

        <div id="rendered_template">Please Select a Template to View</div>
      );
    } else {
      return (
        <div id="rendered_template"><DataButton text="Download Markdown" fxn={this.downloadMD }  /><DataButton text="Copy Markdown" fxn={helpers.copyData('.rendered-markdown')}  /><Markdown markup={ this.state.braidedText } tables={true} components={{ }} /><input type='hidden' name='hidden-markdown-value' className='rendered-markdown' value={this.state.braidedText} /></div>
      );
    }

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
  }

  componentWillUpdate(nextProps, nextState) {
  if (nextState.templateLoaded !== this.state.templateLoaded) {
    this.getTemplateData(nextState);
  }
 }

  getTemplateData(updatedState){
    var self = this;
    const url = 'https://api.github.com/repos/18F/'+templateRepo+'/contents/'+updatedState.templateLoaded;
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
              </div>
          </div>
      </div>
    );
  }
}

export default App;
