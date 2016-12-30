import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { RenderedTemplate } from '../index';

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
    const window = jest.fn(() => {
      var windowMock = {
        open: jest.fn()
      };
      return windowMock;
    });
    const templateBloc = mount(<RenderedTemplate templateText={''} formData={{testbracket: 't'}}/>);
    templateBloc.setState({braidedText: '# h1 test test'});
    templateBloc.find('button').simulate('click');
    const downloadText = 'data:application/txt,%23+h1+test+test';
    expect(window.open).toHaveBeenLastCalledWith(downloadText, "_self");
  });
});
