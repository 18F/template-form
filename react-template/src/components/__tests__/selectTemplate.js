import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { SelectTemplate } from '../index';

describe('SelectTemplate Component', () => {
  beforeEach(() => {
    let repoResp = {text: '{"tree": [{"path": "sow", "type": "tree"}, {"path": "sow/schema.yml", "type": "blob"}, {"path": "sow/agile-test.md", "type": "blob"}, {"path": "sow/agile-beta.md", "type": "blob"}]}'};
    request.__setMockResponse(repoResp);
  });
  it('renders SelectTemplate without crashing', () => {
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

  it.skip('expects that renderListItem(items, initKey) a list of options', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    const testSelect = selectBloc.instance().renderListItem([{path:'this_is_cool.md'},{path:'this_is_not.md'}], 'boo')
    console.log(testSelect);
    expect(testSelect).toEqual(mount(<option value={false}>Select a template type</option>,
          <option value="this_is_cool">This Is Cool</option>,
          <option value="this_is_not">This Is Not</option>).nodes);
    // expect(selectBloc.find('select').containsMatchingElement(
    //   <option key="boo" value="false">Select a template type</option>
    // )).toBeTruthy();
  });

  it('renderFileSelect() builds a list', () => {
    function handleSelectTemplate(templateSelected){
      return true;
    }
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.setState({templateDirectorySelected: 'sow'})
    selectBloc.instance().renderFileSelect();
  });

  it('handles the change of the directory select and sets the directory state', () => {
    const handleSelectTemplate = jest.fn();
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.instance().handleChange({target: {value: 'sow'}});
    expect(selectBloc.state('templateDirectorySelected')).toEqual('sow');
  });

  it('expects that the props on user change will be called and template selected will be loade', () => {
    const handleSelectTemplate = jest.fn();
    let selectBloc = mount(<SelectTemplate onUserChange={handleSelectTemplate}
                    templateLoaded={false}
                    templateRepo={'acq-templates'}
                    remoteBranch={'develop'} />);
    selectBloc.setState({templateDirectorySelected:'sow'});
    selectBloc.instance().handleChangeSub({target: {value: 'sow/agile-test.md'}});
    expect(handleSelectTemplate).toHaveBeenLastCalledWith({loaded: 'sow/agile-test.md', schemas: [{"filename": "schema.yml", "path": "sow/schema.yml", "type": "blob"}]});
    expect(selectBloc.state('templateSelected')).toEqual('sow/agile-test.md');
  });
});
