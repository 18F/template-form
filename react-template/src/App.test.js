import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders app without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders DataButton without crashing', () => {
  const div = document.createElement('div');
  function testThis(){
    console.log("hi");
  }
  ReactDOM.render(<DataButton text="text" fxn={testThis} />, div);
});

it('braid markdown and yaml into handlebards', () => {
  const div = document.createElement('div');
  function testThis(){
    console.log("hi");
  }
  ReactDOM.render(<RenderedTemplate templateText={'# h1 test {testbracket}'} formData={'testbracket:"test"'}/>, div);
});
