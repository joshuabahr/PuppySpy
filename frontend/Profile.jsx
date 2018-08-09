import React, { Component } from 'react';

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      phone: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    console.log(this.state);
  }



  handleInputChange(e) {
    this.setState({
      phone: e.target.value
    })
  }



  render() {
    console.log('profile ', this.props);
    let phoneNo;

    const {
      userStore: {
        handleInputChange,
        updateUserPhone,
        state: {
          name,
          email,
          phone,
          updatePhone
        }
      }
    } = this.props;

    if (!phone) {
      phoneNo = 'N/A'
    } else {
      phoneNo = phone
    }

    return (
      <div>
        <ul>
          <li>E-mail: {email}</li>
          <li>Name: {name}</li>
          <li>Phone: {phoneNo}</li>
          <li><input type='number' value={updatePhone} onChange={handleInputChange} placeholder="Phone No" />
            <button type="button" onClick={() => updateUserPhone(updatePhone)}>click to update phone</button>
          </li>
        </ul>
      </div>
    )
  }
};

export default Profile;
