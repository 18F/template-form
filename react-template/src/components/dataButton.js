import React, { Component } from 'react';

export default class DataButton extends Component {
  render () {
    return (
      <button onClick={this.props.fxn} className={this.props.className}>{this.props.text}</button>
    )
  }
}

DataButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  fxn: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}
