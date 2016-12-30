import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from './App';

it('renders app without crashing', () => {
  let repoResp = {text: '{"tree": [{"path": "sow", "type": "tree"}, {"path": "sow/schema.yml", "type": "blob"}, {"path": "sow/agile-test.md", "type": "blob"}, {"path": "sow/agile-beta.md", "type": "blob"}]}'};
  request.__setMockResponse(repoResp);
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
