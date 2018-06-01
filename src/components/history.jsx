import React, { Component } from 'react';
import '../App.css';

export default class History extends Component {

  render() {
    return (
      <div>
        <table>
            <thead>
            <tr>
                <th>Address</th>
                <th>Rent Estimate</th>
                <th>User Estimate</th>
            </tr>
            </thead>
            <tbody>
            {this.props.history.map(function(v){
                return (
                    <tr>
                        <th>
                            {v.address.fulladdress}
                        </th>
                        <th>
                            ${Number(0.9*parseInt(v.estimate, 10).toFixed(1)).toLocaleString()} - ${Number(1.1*parseInt(v.estimate, 10).toFixed(1)).toLocaleString()}
                        </th>
                        <th>
                            ${Number(0.9*parseInt(v.userEstimate, 10).toFixed(1)).toLocaleString()} - ${Number(1.1*parseInt(v.userEstimate, 10).toFixed(1)).toLocaleString()}
                        </th>
                    </tr>
                )
            })}
            </tbody>
        </table>
      </div>
    );
  }
}
