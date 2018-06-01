import React, { Component } from 'react';
import '../App.css';

export default class ProgressBar extends Component {

  render() {
    return (
      <div className="myProgress">
            <div className="myBar" style={{width: this.props.percent + "%"}}>{this.props.percent + "%"}</div>
      </div>
    );
  }
}
