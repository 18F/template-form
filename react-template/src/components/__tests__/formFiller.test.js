import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { FormFiller } from '../index';

describe('FormFiller Components', () => {
  beforeEach(() => {
    let repoResp = {text: '{"content": "eWFtbDogaGk="}'};
    request.__setMockResponse(repoResp);
    const handleSelectTemplate = jest.fn();
  });
  it('renderFileSelect() builds a list', () => {
    const handleSelectTemplate = jest.fn();
    const div = document.createElement('div');
    const reqMock = jest.fn(request);  // replace with superagent
    ReactDOM.render(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />, div);
  });

  it('gets schema from git hub and set the templateSchema', () => {
    const handleSelectTemplate = jest.fn();
    const formFilling = mount(<FormFiller templateLoaded={true}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps({availableSchemas:[{'path':'sow/schema.yml'}], templateLoaded: true});
    expect(request.end).toBeCalled();
    expect(formFilling.state('templateSchema')).toEqual('yaml: hi');
    expect(formFilling.state('emptySchema')).toEqual('yaml: hi');
  });

  it('setstate when handling change', () => {
    const handleSelectTemplate = jest.fn();
    const formFilling = mount(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps({availableSchemas:[{'path':'sow/schema.yml'}], templateLoaded: true});
    formFilling.instance().handleChange({target: {value: 'foo'}});
    expect(formFilling.state('templateSchema')).toEqual('foo');
    expect(handleSelectTemplate).toHaveBeenLastCalledWith('foo');
  });

  it('expects to cleardata of the text area', () => {
    const handleSelectTemplate = jest.fn();
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps({availableSchemas:[{'path':'sow/schema.yml'}], templateLoaded: true});
    formFilling.setState({templateSchema: "wow"});
    formFilling.instance().clearData();
    expect(formFilling.state('templateSchema')).toEqual('yaml: hi');
    expect(handleSelectTemplate).toHaveBeenLastCalledWith('yaml: hi');
  });

  it.skip('expects copydata to call exect command with the text from a query selector with the given class', () => {
    const handleSelectTemplate = jest.fn();
    let document = jest.fn();
    document.querySelector = jest.fn(() => {
      var mockedInp = {
        select: function(){
          return true;
        },
        blur: function(){
          return true;
        }
      }
      return mockedInp;
    });
    document.execCommand = jest.fn();
    const formFilling = shallow(<FormFiller templateLoaded={false}
                                availableSchemas={[]}
                                formData={handleSelectTemplate}
                                templateRepo={'template-form'}
                                remoteBranch={'develop'}  />);
    formFilling.setProps({availableSchemas:[{'path':'sow/schema.yml'}], templateLoaded: true});
    formFilling.instance().copyData();
    expect(document.execCommand).toHaveBeenCalled();
  });

});
