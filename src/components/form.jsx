import React, { Component } from 'react';
import '../App.css';
import isPhoneNumber from "is-phone-number";

export default class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastname:"",
      email: "",
      phone:"",
      vEmail: true,
      vPhone: true
    };

    this.nameChange = this.nameChange.bind(this);
    this.lastnameChange = this.lastnameChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.phoneChange = this.phoneChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  verify(type, text) {
    text = text.toString();
    if(type === "email") {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(text).toLowerCase());
    } else if(type === "phone") {
      console.log(text.length)
      if(text.length === 10) {
        var text = text.split("");
        text.splice(3, 0, " ");
        text.splice(7, 0, " ");
        text = text.join("");
      }
      return isPhoneNumber(text);
    }
  }

  handleSubmit(event) {
    if(this.verify("email", this.state.email) && this.verify("phone", this.state.phone)){
      this.setState({vEmail: true, vPhone: true});
      this.props.onFormSubmit(JSON.stringify(this.state));
    }
    if(this.verify("email", this.state.email)) {
      this.setState({vEmail: true})
    } else {
      this.setState({vEmail: false})
    }
    if(this.verify("phone", this.state.phone)) {
      this.setState({vPhone: true})
    } else {
      this.setState({vPhone: false})
    }
    event.preventDefault();
  }

  nameChange(event) {
    this.setState({name: event.target.value});
  }
  lastnameChange(event) {
    this.setState({lastname: event.target.value});
  }
  emailChange(event) {
    this.setState({email: event.target.value});
  }
  phoneChange(event) {
    this.setState({phone: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
       <label for="fname">First Name</label>
       <input placeholder="name" id="fname" onChange={this.nameChange}></input>
       <label for="lname">Last Name</label>
       <input placeholder="lastname" id="lname" onChange={this.lastnameChange}></input>
       {this.state.vEmail ? <label for="email">Email Address</label> : <label for="email">Email <span className="error">*Please Enter a Valid Email</span></label> }
       <input placeholder="email" id="email" onChange={this.emailChange}></input>
       {this.state.vPhone ? <label for="phone">Phone Number</label> : <label for="phone">Phone Number <span className="error">*Please Enter a Valid Phone Number</span></label> }
       <input placeholder="phone number" id="phone" onChange={this.phoneChange}></input>
       <input type="submit" value="Submit" />
      </form>
    );
  }
}
