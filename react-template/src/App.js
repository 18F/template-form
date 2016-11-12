import React, { Component } from 'react';
import './App.css';
import * as request from 'superagent';
import * as base64 from 'js-base64';
import { Markdown } from 'react-showdown';
import 'handlebars';

const templateRepo = 'acq-templates';
const remoteBranch = 'develop';
// const markdown = new showdown.Converter({'tables': true});

class SelectTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {repoForTemplates: templateRepo,
                  branchForTemplates: remoteBranch,
                  availableTemplateDirectories: [],
                  availableTemplateFiles: [],
                  templateDirectorySelected: 'false',
                  templateSelected: 'false',
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
        const subFiles = parsedData.tree.filter((file) => {
            return file.path.split('/').length > 1 && file.path.split('.').pop() === 'md';
        });
        let subFileHash = {};
        subFiles.forEach(file => {
          const pathArray = file.path.split('/');
          file.filename = pathArray.pop();
          if (pathArray[0] in subFileHash){
            subFileHash[pathArray[0]].push(file);
          } else {
          subFileHash[pathArray[0]] = [file];
          }
        });
        self.setState({availableTemplateDirectories: directories,
                      availableTemplateFiles: subFileHash});
      }
    });
  }

  renderListItem(items){
    const selectors = [];
    selectors.push(<option key='false' value='false'>Select a template type</option>);
    items.forEach(item => {
      selectors.push(<option key={item.path} value={item.path}>{item.path}</option>)
    })
    return selectors;
  }

  handleChange(event){
    console.log(event.target.value)
    this.setState({templateDirectorySelected: event.target.value})
    console.log(this.state.templateDirectorySelected);
  }

  handleChangeSub(event){
    console.log(event.target.value);
    this.props.onUserChange(event.target.value);
  }

  renderFileSelect(){
    let directory = false;
    if(this.state.templateDirectorySelected !== 'false'){
      directory = this.state.templateDirectorySelected;
    }

    if(directory){
      const selectedTemplates = this.state.availableTemplateFiles[directory];

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
        // <div id="rendered_template">{markdown.makeHtml(this.props.templateText)}</div>
        <div id="rendered_template"><Markdown markup={ this.props.templateText } /></div>
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
      templateText: ''};
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
  }

  handleSelectTemplate(templateLoaded){
    this.setState({templateLoaded: templateLoaded});
    console.log(this.state.templateLoaded);
    if(this.state.templateLoaded !== false){
      this.getTemplateData();
    }
  }

  getTemplateData(){
    var self = this;
    const url = 'https://api.github.com/repos/18F/'+templateRepo+'/contents/'+this.state.templateLoaded;
    request
    .get(url)
    .set('Accept', 'application/json')
    .end(function(err, res){
      var rawMarkdown = decodeContent(res);
      self.setState({templateText: rawMarkdown});
    });
  }
  render() {
    return (
      <div className="usa-grid">
          <div className="row">
              <div className="usa-width-one-half">
              <SelectTemplate onUserChange={this.handleSelectTemplate} templateLoaded={this.state.templateLoaded}/>
              <FormFiller templateLoaded={this.state.templateLoaded}/>
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

function decodeContent(gitResource){
   var obj = JSON.parse(gitResource.text);
   console.log(obj);
   var txt = base64.Base64.decode(obj.content);
   return txt;
 }
