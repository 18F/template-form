import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';
import { DataButton, FormFiller, Header, RenderedTemplate, SelectTemplate } from './components';

it('renders app without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

// Data button Tests
it('renders DataButton without crashing', () => {
  const div = document.createElement('div');
  function testThis(){
    return true;
  }
  ReactDOM.render(<DataButton text="text" fxn={testThis} />, div);
});

it('It expect DataButton text to equal text', () => {
  const div = document.createElement('div');
  function testThis(){
    return true;
  }
  const wrapper = shallow(<DataButton text="text" fxn={testThis} />);
const textButton = <button>text</button>;
expect(wrapper.props('text')).toEqual({'text'});

});

it('It expects testThis to be called when the button is clicked', () => {
  const div = document.createElement('div');
  function testThis(){
    return true;
  }
  ReactDOM.render(<DataButton text="text" fxn={testThis} />, div);
});

//Header tests
it('renders Header without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header />, div);
});

//Rendered Template Tests
it('renders RenderedTemplate without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});

it('braid markdown and yaml into handlebards and expects the braidedText to be "# h1 test test"', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});

it('parsesyaml to be {testbracket: "test"}', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});

it('handles bars to set state of braided test to be "# h1 test test"', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});

it('opens up a new window event', () => {
  //need to mock window open and check encodeURIComponent called with '# h1 test test'
  // const div = document.createElement('div');
  // ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});

//selectedTemplate tests
it('renders SelectTemplate without crashing', () => {
  const div = document.createElement('div');

  function handleSelectTemplate(templateSelected){
    return true;
  }

  ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
                  templateLoaded={false}
                  repoForTemplates={'acq-templates'}
                  branchForTemplates={'develop'} />, div);
});

it('gets a gittree from github', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }
  //
  // ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
  //                 templateLoaded={false}
  //                 repoForTemplates={'acq-templates'}
  //                 branchForTemplates={'develop'} />, div);
});

it('expects that renderListItem(items, initKey) a list of options', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }
  //
  // ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
  //                 templateLoaded={false}
  //                 repoForTemplates={'acq-templates'}
  //                 branchForTemplates={'develop'} />, div);
});

it('renderFileSelect() builds a list', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }
  //
  // ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
  //                 templateLoaded={false}
  //                 repoForTemplates={'acq-templates'}
  //                 branchForTemplates={'develop'} />, div);
});

//FormFiller tests
it('renderFileSelect() builds a list', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }

  ReactDOM.render(<FormFiller templateLoaded={false}
                              availableSchemas={['schema.yml']}
                              formData={handleSelectTemplate} templateRepo={'template-form'}
                              remoteBranch={'develop'}  />, div);
});

it('gets schema from git hub and set the templateSchema', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }

  // ReactDOM.render(<FormFiller templateLoaded={false}
  //                             availableSchemas={['schema.yml']}
  //                             formData={handleSelectTemplate} templateRepo={'template-form'}
  //                             remoteBranch={'develop'}  />, div);
});

it('setstate when handling change', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }

  // ReactDOM.render(<FormFiller templateLoaded={false}
  //                             availableSchemas={['schema.yml']}
  //                             formData={handleSelectTemplate} templateRepo={'template-form'}
  //                             remoteBranch={'develop'}  />, div);
});

it('expects to cleardata of the text area', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }

  // ReactDOM.render(<FormFiller templateLoaded={false}
  //                             availableSchemas={['schema.yml']}
  //                             formData={handleSelectTemplate} templateRepo={'template-form'}
  //                             remoteBranch={'develop'}  />, div);
});

it('expects copydata to call exect command with the text from a query selector with the given class', () => {
  // request will need to be mocked
  const div = document.createElement('div');
  function handleSelectTemplate(templateSelected){
    return true;
  }

  // ReactDOM.render(<FormFiller templateLoaded={false}
  //                             availableSchemas={['schema.yml']}
  //                             formData={handleSelectTemplate} templateRepo={'template-form'}
  //                             remoteBranch={'develop'}  />, div);
});
