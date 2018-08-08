import React, { Component } from 'react';
import axios from 'axios';
import Auth from './Auth/Auth';

const auth0 = new Auth();

class Home extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  /*
  static fetchProfile(profile) {
    axios.get(`api/user/profile/${profile.id}`)
    .then((response) => {
      console.log('fetched user profile ', response.data);
    })
    .catch((error) => {
      console.log('error in fetchProfile ', error);
    })
  }
  */
 
 
 componentDidMount() {
   console.log('props ', this.props);
   auth0.getProfile((error, profile) => {
     if (!profile) {
       console.log('error in getProfile ', error);
      } else {
        this.registerUser(profile);
      }
    });
  }
  
  registerUser(profile) {
    axios
    .post(`api/user/signup`, profile)
    .then(response => {
      console.log(response.data);
      this.props.userStore.logInUser(response.data);
    })
    .catch(error => {
      console.log('error in registerUser ', error);
    });
  }

  logout() {
    auth0.logout();
  }

  render() {
    return (
      <div>
        <h1>This is the Home Page</h1>
        <h4>Thanks for loggin in </h4>
      </div>
    );
  }
}

export default Home;
