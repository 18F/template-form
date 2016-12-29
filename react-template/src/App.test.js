import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from './App';
import { DataButton, FormFiller, Header, RenderedTemplate, SelectTemplate } from './components';

it.skip('renders app without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('DataButton Component', () => {
  it('renders DataButton without crashing', () => {
    const div = document.createElement('div');
    function testThis(){
      return true;
    }
    ReactDOM.render(<DataButton text="text" fxn={testThis} />, div);
  });

  it('It expect DataButton text to equal text', () => {
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
});

describe('Header Component', () => {
  it('renders Header without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Header />, div);
  });
});

describe('RenderedTemplate Component', () => {
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
    const window = {};
    const openMock = jest.fn();
    window.mockImplementation(() => {
      return {
        open: openMock
      }
    })
    const templateBloc = mount(<RenderedTemplate templateText={''} formData={{testbracket: 't'}}/>);
    templateBloc.setState({braidedText: '# h1 test test'});
    templateBloc.find('button').simulate('click');
    const downloadText = 'data:application/txt,%23+h1+test+test';
    expect(window.open).toHaveBeenLastCalledWith(downloadText, "_self");
  });
});

describe('SelectTemplate Component', () => {
  beforeEach(() => {
  // jest.resetModules();
});

  it('renders SelectTemplate without crashing', () => {
    let repoResp = {text: '{ "tree": [ { "path": ".about.yml"} ]} '};
    request.__setMockResponse(repoResp);
    const div = document.createElement('div');
    function handleSelectTemplate(templateSelected){
      return true;
    }

    ReactDOM.render(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />, div);
  });

  it('gets a gittree from github', () => {
    let repoResp = {text: '{ "tree": [ { "path": ".about.yml"} ]} '};
    request.__setMockResponse(repoResp);
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);

    let url = 'https://api.github.com/repos/18F/acq-templates/git/trees/develop?recursive=1'
    expect(request.end).toBeCalled();
  });

  it('expects the parsed yml to set the state of availableSchemas, the directoires, and the available templates', () => {
    let repoResp = {text: '{"tree": [{"path": "sow", "type": "tree"}, {"path": "sow/schema.yml", "type": "blob"}, {"path": "sow/agile-test.md", "type": "blob"}, {"path": "sow/agile-beta.md", "type": "blob"}]}'};
    request.__setMockResponse(repoResp);
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    expect(selectBloc.state('availableSchemaFiles')).toEqual({"sow": [{"filename": "schema.yml", "path": "sow/schema.yml", "type": "blob"}]});
    expect(selectBloc.state('availableTemplateFiles')).toEqual({'sow':[{"filename": "agile-test.md", "path": "sow/agile-test.md", "type": "blob"}, {"filename": "agile-beta.md", "path": "sow/agile-beta.md", "type": "blob"}]});// will need to udate
    expect(selectBloc.state('availableTemplateDirectories')).toEqual([{"path": "sow", "type": "tree"}]);
  });

  it('expects that renderListItem(items, initKey) a list of options', () => {
    const repoResp = {text: '{ "tree": [ { "path": ".about.yml"} ]} '};
    request.__setMockResponse(repoResp);
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.instance().renderListItem([{path:'this_is_cool.md'},{path:'this_is_not.md'}], 'boo');
    expect(selectBloc.find('select').containsAllMatchingElements([
      <option value="boo">Select a template type</option>,
      <option value="this_is_cool">This Is Cool</option>,
      <option value="this_is_not">This Is Not</option>
    ])).toBeTruthy();
  });

  it.skip('renderFileSelect() builds a list', () => {
    // request will need to be mocked
    let repoResp = {text: '{"tree": [  {"path": "sow", "type": "tree"}, { "path": "sow/agile-test.md", "type": "blob"}, { "path": "sow/agile-beta.md", "type": "blob"}, { "path": "sow/schema.yml", "type": "blob"}], "truncated": false }'};
    request.__setMockResponse(repoResp);
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = shallow(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.instance().renderFileSelect()
  });

  it.skip('handles the change of the directory select and sets the directory state', () => {
    // request will need to be mocked
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request);
    let selectBloc = shallow(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.instance().handleChange({target: {value: 'foo'}})
    expect(selectBloc.state('templateDirectorySelected')).toEqual('foo');
  });

  it.skip('expects that the props on user change will be called and template selected will be loade', () => {
    // request will need to be mocked
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request);
    let selectBloc = shallow(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.setState(availableSchemaFiles: {foo: ['hi', 'cool'], sow: ['no', 'bye']});
    const onChangeMock = jest.fn(selectBloc.props('onUserChange'));
    selectBloc.instance().handleChange({target: {value: 'foo'}});
    expect(onChangeMock).toHaveBeenLastCalledWith({loaded: 'foo', schemas: ['hi', 'cool']});
    expect(selectBloc.state('templateSelected')).toEqual('foo');
  });
});


describe('FormFiller Components', () => {
  it.skip('renderFileSelect() builds a list', () => {
    // request will need to be mocked
    const div = document.createElement('div');
    function handleSelectTemplate(templateSelected){
      return true;
    }

    const reqMock = jest.fn(request);  // replace with superagent
    ReactDOM.render(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />, div);
  });

  it.skip('gets schema from git hub and set the templateSchema', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request).mockImplementation(() => {text: {content: 'eWFtbDogXCdcJw=='}});
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps(availableSchemas:['schema.yml']);
    expect(formFilling.state('templateSchema')).toEqual('yaml: \'\'');
  });

  it.skip('setstate when handling change', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request).mockImplementation(() => {text: {content: 'eWFtbDogXCdcJw=='}});
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps(availableSchemas:['schema.yml']);
    formFilling.instance().handleChange({target: {value: 'foo'}});
    expect(formFilling.state('templateSchema')).toEqual('foo');
    expect(formFilling.props('formData')).toHaveBeenLastCalledWith('foo');
  });

  it.skip('expects to cleardata of the text area', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request).mockImplementation(() => {text: {content: 'eWFtbDogXCdcJw=='}});
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps(availableSchemas:['schema.yml']);
    formFilling.instance().cleardata();
    expect(formFilling.state('templateSchema')).toEqual('yaml: \'\'');
    expect(formFilling.props('formData')).toHaveBeenLastCalledWith('yaml: \'\'');
  });

  it.skip('expects copydata to call exect command with the text from a query selector with the given class', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    const reqMock = jest.fn(request).mockImplementation(() => {text: {content: 'eWFtbDogXCdcJw=='}});
    const copyMock = jest.fn(document.execCommand('copy'));
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps(availableSchemas:['schema.yml']);
    formFilling.instance().copyData();
    expect(copyMock).toHaveBeenCalled();
  });

});
