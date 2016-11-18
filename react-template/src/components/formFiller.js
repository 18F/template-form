import React, { Component } from 'react';
import * as helpers from '../helpers'
import * as request from 'superagent';
import DataButton from './dataButton';

export default class FormFiller extends Component {
  constructor(props) {
    super(props);
    this.state = {templateSchema: '',
                  lastTemplate: false,
                  emptySchema: ''};

    this.handleChange = this.handleChange.bind(this);
    this.clearData = this.clearData.bind(this);
    this.copyData = this.copyData.bind(this);
  }

  componentDidUpdate() {
    this.getSchema();
  }

  getSchema(){
    var self = this;
    if(this.props.templateLoaded && this.props.templateLoaded !== this.state.lastTemplate){
      const url = 'https://api.github.com/repos/18F/'+this.props.templateRepo+'/contents/'+ this.props.availableSchemas[0].path;
      request
      .get(url)
      .query({ ref: this.props.remoteBranch })
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

  copyData(targ){
    let inp = (targ ? document.querySelector(targ) : null);
        // is element selectable?
    if (inp && inp.select) {
      // select text
      inp.select();

      try {
        // copy text
        document.execCommand('copy');
        inp.blur();
      }
      catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
      }
    }
  }

  render() {
    if(this.props.templateLoaded){
      return (
        <div id="template_form_container">
            <form id="template_form">
            <textarea value={this.state.templateSchema} onChange={this.handleChange} className="yaml-textarea" />
            </form>
            <DataButton text="Clear Data" fxn={this.clearData} />
            <DataButton text="Copy Data" fxn={this.copyData('.yaml-textarea')} />
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
