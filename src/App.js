import React, { Component } from 'react';
import './App.css';
import Zillow from 'node-zillow';

import Form from "./components/form";
import Address from "./components/address";
import ProgressBar from "./components/progessBar";
import History from "./components/history";
import Tools from "./tools";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      step: 1,
      history: [],
      addressV: true
    };

    this.saveData.bind(this);
    this.getData.bind(this);
    this.saveUser.bind(this);
  }
// ------------- Start Local Storage Functions --------------//
  saveData() {
    window.localStorage.setItem("belongData", JSON.stringify(this.state))
  }
  getData() {
    return window.localStorage.getItem("belongData")
  }

  saveUser(data) {
    window.localStorage.setItem("belongUser", data)
    this.setState({step: 2})
  }

  logOff () {
    window.localStorage.removeItem("belongUser");
    this.setState({step:1});
  }
  // ------------- End Local Storage Functions --------------//

  // ------------- Add searches to history --------------//
  addToHistory(address, estimate, userEstimate) {
    var newHistory = this.state.history.concat([{
      user: this.state.user,
      address: address,
      estimate: estimate,
      userEstimate: userEstimate
    }]).slice();
    this.setState({history: newHistory, step: 3});
    this.saveData.call(this);
    // this.sendMail.call(this)
  }

  onAddressSubmit(e, userEstimate) {
    userEstimate = userEstimate.length > 0 ? userEstimate : 0;
    var address = {};
    var user = this.state.user;
    if(!e.address_components || e.address_components.filter(function(v){return v.types.indexOf("street_number") > -1}).length === 0) {
      this.setState({addressV: false})
    } else {
      this.setState({addressV: true})
      var fulladdress = e.formatted_address;
      address.fulladdress = fulladdress;
      address.houseNumber = e.address_components.filter(function(v){return v.types.indexOf("street_number") > -1})[0].long_name;
      address.street = e.address_components.filter(function(v){return v.types.indexOf("route") > -1})[0].long_name;
      address.city = e.address_components.filter(function(v){return v.types.indexOf("locality") > -1})[0].long_name;
      address.state = e.address_components.filter(function(v){return v.types.indexOf("administrative_area_level_1") > -1})[0].long_name;
      address.zip = e.address_components.filter(function(v){return v.types.indexOf("postal_code") > -1})[0].long_name;
      var zillow = new Zillow('X1-ZWz18kypre179n_6a5jo', {mode: 'no-cors'});
      const parameters = {
        address: address.houseNumber + " " + address.street,
        citystatezip: address.city + ", " + address.state,
        rentzestimate: true
      }
    
      zillow.get('GetSearchResults', parameters)
        .then(results => {
            var rent = !!results.response.results.result[0].rentzestimate ? results.response.results.result[0].rentzestimate[0].amount[0]._ : parseInt(results.response.results.result[0].zestimate[0].amount[0]._, 10) * .05
            this.addToHistory.call(this, address, rent, userEstimate)
            return results
        })
    }
  }

  enterAnotherAddress() {
    this.setState({step: 2});
  }
  // ------------- End Add searches to historys --------------//

  sendMail() {
    var name = this.state.user.name + " " + this.state.user.lastname;
    var email = this.state.user.email;
    var phone = this.state.user.phone;
    var address = this.state.history[this.state.history.length-1].address.fulladdress;
    var estimate = this.state.history[this.state.history.length-1].estimate;
    var userEstimate= this.state.history[this.state.history.length-1].userEstimate;
    var ip = this.state.ip;
    var email = {
      subject: "Congrats on Signing up!",
      text: "Thank you for signing up and getting your Rent Estimate " + name + " (" +email+ " - " + phone + ").\n\n The rent estimate for " +address+ " is $" + estimate +".\n\n" + (userEstimate != 0 ? "You provided an estimate rent value of " + userEstimate +"\n": "\n") + "\n\n\n\n - Seach Made by " + ip,
      access_token: "zagrna8vqp1zc2zscj76cqnn",
      success_url: ".?message=Email+Successfully+Sent%21&isError=0",
      error_url: ".?message=Email+could+not+be+sent.&isError=1"
    }
    fetch("https://postmail.invotes.com/send", {
      method: 'POST',
      body: JSON.stringify(email),
      mode: 'no-cors', // no-cors, cors, *same-origin
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  }

  componentDidMount() {
    const scope = this;
    if(window.localStorage.belongUser) {
      this.setState({user: JSON.parse(window.localStorage.belongUser), step: 2})
    }
    if(window.localStorage.belongData) {
      this.setState(JSON.parse(window.localStorage.belongData));
    }
    Tools.getUserIP(function(ip){
      console.log(ip)
      scope.setState({ip: ip})
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Rent Estimator</h1>
        </header>
        <div className="wholeSection">
        <div className="bodySection">
          <div className="instructionsSection">
            <p>Instructions</p>
            <ol>
              <li>Register with your First Name, Last Name, Phone number, and Email</li>
              <li>Enter an address to see the Rent Estimate of the Property. You can enter an optional estimated rent for the property</li>
            </ol>

          </div>
          <div className="historySection">
            <History history={this.state.history}/> 
          </div>
        </div>
        <div className="bodySection">
          {this.state.step === 1 && <div className="formSection">
            <Form onFormSubmit={this.saveUser}/>
          </div>}
          {this.state.step === 2 && <div className="mapSection">
            {!this.state.addressV && <p className="error"> Please Enter a Valid Address</p>}
            <Address onAddressSubmit={this.onAddressSubmit.bind(this)}/>
          </div>}
          {this.state.step === 3 && <div className="congratsSection">
            <div>Congrats on checking your rent! Please click below to enter another address</div>
            <button onClick={this.enterAnotherAddress.bind(this)}>Enter Another Address</button>
          </div>}
          <div className="progressSection">
            Progress
            <ProgressBar percent={(this.state.step/3 * 100).toFixed(1)}/>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
