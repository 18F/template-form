import React, { Component } from 'react';
import { Markdown } from 'react-showdown';
import * as Handlebars from 'handlebars';
import * as YAML from 'yamljs';
import DataButton from './dataButton';

export default class RenderedTemplate extends Component {
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
        <div id="rendered_template">
        <DataButton text="Download Markdown" fxn={this.downloadMD }  />
        <Markdown markup={ this.state.braidedText } tables={true} components={{ }} />
        <hr />
        <br />
        <h3> Copy the Markdown Below</h3>
        <textarea name='hidden-markdown-value' className='rendered-markdown' value={this.state.braidedText} />
        </div>
      );
    }

  }
}

RenderedTemplate.propTypes = {
  templateText: React.PropTypes.string.isRequired,
  formData: React.PropTypes.string.isRequired
}
