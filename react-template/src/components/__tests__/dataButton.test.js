import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { DataButton } from '../index';

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
