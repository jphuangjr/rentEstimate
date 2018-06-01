import React, { Component } from 'react';
import '../App.css';
import Autocomplete from 'react-google-autocomplete';

export default class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      placeSelected: undefined
    };
  }

  onEnter() {
    this.props.onAddressSubmit(this.state.placeSelected, this.state.userInput)
  }
  onChange(e) {
    this.setState({userInput: e.target.value})
  }

  onPlaceSelect(place) {
    this.setState({placeSelected: place})
  }

  render() {
    return (
      <div>
        <label className="searchLabels">Enter Address</label>
        <Autocomplete
            style={{width: '90%'}}
            onPlaceSelected={this.onPlaceSelect.bind(this)}
            types={['address']}/>
        <label className="searchLabels">Enter Estimate Rent (optional)</label>
        <input value={this.state.userInput} onChange={this.onChange.bind(this)}></input>
        <button className="addressSubmitButton" onClick={this.onEnter.bind(this)}>Submit</button>
      </div>
    );
  }
}