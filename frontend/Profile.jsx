import React from 'react';

const Profile = ({
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
}) => {
  let phoneNo;

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
};

export default Profile;
