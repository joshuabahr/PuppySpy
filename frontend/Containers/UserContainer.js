import { Container } from 'unstated';

class UserContainer extends Container {
  state = {
    loggedIn: false,
    name: null,
    email: null,
    phone: null
  }

  logInUser = (profile) => {
    this.setState({
      loggedIn: true,
      name: profile.name,
      email: profile.email,
      phone: null
    })
    .then(() => {
      console.log('userStore login state ', this.state);
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
      loggedIn: false,
      name: null,
      email: null,
      phone: null
    })
    console.log('user logged out ', this.state);
  }
}

export {UserContainer};