import { Container } from 'unstated';
import axios from 'axios';

class UserContainer extends Container {
  state = {
    loggedIn: false,
    name: null,
    email: null,
    phone: null,
    id: null,
    updatePhone: ''
  }

  logInUser = (profile) => {
    this.setState({
      id: profile.id,
      loggedIn: true,
      name: profile.name,
      email: profile.email,
      phone: profile.phone
    })
    .then(() => {
      console.log('userStore login state ', this.state);
    })
  }

  handleInputChange = (e) => {
    this.setState({
      updatePhone: e.target.value
    })
  }

  updateUserPhone = (phone) => {
    axios.put(`/api/user/profile/${this.state.id}`, {
      phone
    })
    .then((response) => {
      console.log('successfully updated phone no ', response);
      this.setState({
        phone,
        updatePhone: ''
      })
    })
    .catch((error) => {
      console.log('error updating phone no ', error);
    })
  }

  setPhoneNumber = (phone) => {
    this.setState({
      phone
    })
    console.log('register phone number ', this.state);
  }

  logOutUser = () => {
    this.setState({
      id: null,
      loggedIn: false,
      name: null,
      email: null,
      phone: null
    })
    console.log('user logged out ', this.state);
  }
}

export default UserContainer;