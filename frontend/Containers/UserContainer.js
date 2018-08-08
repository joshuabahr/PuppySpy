import { Container } from 'unstated';

class UserContainer extends Container {
  state = {
    loggedIn: false,
    name: null,
    email: null,
    phone: null
  }

  logInUser(profile) {
    this.setState({
      loggedIn: true,
      name: profile.name,
      email: profile.email,
      phone: null
    })
  }

  setPhoneNumber(phone) {
    this.setState({
      phone
    })
  }

  logOutUser() {
    this.setState({
      loggedIn: false,
      name: null,
      email: null,
      phone: null
    })
  }
}

export default UserContainer;