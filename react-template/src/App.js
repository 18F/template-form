import React, { Component } from 'react';
import './App.css';
import * as request from 'superagent';

const templateRepo = 'acq-templates';
const remoteBranch = 'develop';

class SelectTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {repoForTemplates: templateRepo,
                  branchForTemplates: remoteBranch,
                  availableTemplateDirectories: [],
                  availableTemplateFiles: [],
                  templateDirectorySelected: 'false',
                  templateSelected: "",
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
    this.setState({templateSelected: event.target.value});
    console.log(this.state.templateSelected);
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
  constructor(props) {
    super(props);
    this.state = {templateLoded: false};
  }

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
