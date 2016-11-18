import React, { Component } from 'react';

export default class DataButton extends Component {
  render () {
    return (
      <button onClick={this.props.fxn}>{this.props.text}</button>
    )
  }
}
