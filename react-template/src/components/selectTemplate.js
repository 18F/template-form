import React, { Component } from 'react';
import * as helpers from '../helpers';
import * as request from 'superagent';

export default class SelectTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const url = 'https://api.github.com/repos/18F/'+this.props.repoForTemplates+'/git/trees/'+this.props.branchForTemplates+'?recursive=1';
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
    this.props.onUserChange({loaded: event.target.value,
                              schemas: this.state.availableSchemaFiles[this.state.templateDirectorySelected]});
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
