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
  const dataButton = shallow(<DataButton text="text" fxn={testThis} />);
  expect(dataButton .find('button').text()).toEqual('text');

});

it('It expects testThis to be called when the button is clicked', () => {
  let testPropFunction = jest.fn();
  const dataButton = shallow(<DataButton text="text" fxn={testPropFunction} />);
  dataButton.find('button').simulate('click')
  expect(testPropFunction).toHaveBeenCalled();
});

//Header tests
it('renders Header without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header />, div);
});

//Rendered Template Tests
it('renders RenderedTemplate without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RenderedTemplate templateText={'# h1 test {{ testbracket }}'} formData={'testbracket:"test"'}/>, div);
});

it('braid markdown and yaml into handlebards and expects the braidedText to be "# h1 test test"', () => {
  const templateBlock = shallow(<RenderedTemplate templateText={'# h1 test {{ testbracket }}'} formData={'testbracket:"test"'}/>);
  expect(templateBlock.state('braidedText')).toBe('');
});

it('parsesyaml to be {testbracket: "test"}', () => {
  const templateBloc = shallow(<RenderedTemplate templateText={''} formData={''}/>);
  templateBloc.instance().parseYml({templateText: '# h1 test {{ testbracket }}', formData: 'testbracket: test'})
  expect(templateBloc.state('formObject')).toEqual({testbracket: 'test'})
});

it('handles bars to set state of braided test to be "# h1 test test"', () => {
  const templateBloc = shallow(<RenderedTemplate templateText={''} formData={''}/>);
  templateBloc.instance().handlingBars('# h1 test {{ testbracket }}', {testbracket: 'test'})
  expect(templateBloc.state('braidedText')).toEqual('# h1 test test')
});

it.skip('opens up a new window event', () => {
  //need to mock window open and check encodeURIComponent called with '# h1 test test'
  // let window.open = jest.fn();
  const templateBloc = shallow(<RenderedTemplate templateText={''} formData={''}/>);
  templateBloc.instance().handlingBars('# h1 test {{ testbracket }}', {testbracket: 'test'})
  templateBloc.find('button').simulate('click');
  const downloadText = 'data:application/txt,%23+h1+test+test'
  expect(window.open).toHaveBeenLastCalledWith(downloadText, "_self");
});

//selectedTemplate tests
it.skip('renders SelectTemplate without crashing', () => {
  const div = document.createElement('div');

  function handleSelectTemplate(templateSelected){
    return true;
  }

  // ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
  //                 templateLoaded={false}
  //                 repoForTemplates={'acq-templates'}
  //                 branchForTemplates={'develop'} />, div);
});

it.skip('gets a gittree from github', () => {
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

it.skip('expects that renderListItem(items, initKey) a list of options', () => {
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

it.skip('renderFileSelect() builds a list', () => {
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
it.skip('renderFileSelect() builds a list', () => {
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

it.skip('gets schema from git hub and set the templateSchema', () => {
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

it.skip('setstate when handling change', () => {
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

it.skip('expects to cleardata of the text area', () => {
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

it.skip('expects copydata to call exect command with the text from a query selector with the given class', () => {
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
