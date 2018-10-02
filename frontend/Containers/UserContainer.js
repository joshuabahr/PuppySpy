import { Container } from 'unstated';
import axios from 'axios';

class UserContainer extends Container {
  state = {
    loggedIn: false,
    name: null,
    email: null,
    phone: null,
    id: null,
    updatePhone: '',
    modalShow: false
  };

  logInUser = profile => {
    this.setState({
      id: profile.id,
      loggedIn: true,
      name: profile.name,
      email: profile.email,
      phone: profile.phone
    }).then(() => {
      console.log('userStore login state ', this.state);
    });
  };

  handleInputChange = e => {
    this.setState({
      updatePhone: e.target.value
    });
  };

  handleModalShow = () => {
    this.setState({ modalShow: true });
  };

  handleModalClose = () => {
    this.setState({ modalShow: false });
  };

  updateUserPhone = () => {
    const { updatePhone, id } = this.state;
    axios
      .put(`/api/user/profile/${id}`, {
        phone: updatePhone
      })
      .then(response => {
        console.log('update response ', response);
        if (response.data === 'BLOCKED') {
          alert('This number has been blocked from use on this site');
          this.invalidNumber();
        } else {
          console.log('successfully updated phone no ', response);
          this.setState({
            phone: updatePhone,
            updatePhone: '',
            modalShow: false
          }).then(() => {
            this.sendSubscribeAlert();
          });
        }
      })
      .catch(error => {
        console.log('error updating phone no ', error);
      });
  };

  logOutUser = () => {
    this.setState({
      id: null,
      loggedIn: false,
      name: null,
      email: null,
      phone: null
    });
    console.log('user logged out ', this.state);
  };

  sendSubscribeAlert = () => {
    axios
      .post(`api/sms/subscribe`, {
        phone: this.state.phone
      })
      .then(response => {
        console.log('subscribe alert sent ', response);
        if (response.data.status === 400) {
          alert('invalid phone number entered');
          this.invalidNumber();
        }
      })
      .catch(error => console.log('error subscribing ', error));
  };

  invalidNumber = () => {
    const { id } = this.state;
    axios
      .put(`/api/user/profile/${id}`, { phone: null })
      .then(response => {
        console.log('invalid phone number updated ', response);
        this.setState({
          phone: null,
          modalShow: false,
          updatePhone: ''
        });
      })
      .catch(error => console.log('error updating invalid phone number ', error));
  };
}

export default UserContainer;
