import React from 'react';

const SMSSender = ({ initialCoordinates }) => {
  const promptPhoneNumber = () => {
    let phoneNumber;
    do {
      phoneNumber = prompt('Please enter a phone number (including country code, e.g., 447827060226):');
      if (phoneNumber === null || phoneNumber.trim() === '') {
        return null; 
      }
    } while (!isValidPhoneNumber(phoneNumber));
    return phoneNumber;
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{8,15}$/; // Assuming the phone number consists of 8 to 15 digits
    const isValid = phoneNumberRegex.test(phoneNumber);
    
    if (!isValid) {
      alert('Invalid phone number. Please enter a phone number consisting of 8 to 15 digits.');
      return false;
    }
    
    return true; // Return true to indicate valid phone number
  };

  const handleSendSMS = async () => {
    try {
      const toPhoneNumber = promptPhoneNumber();
  
      // Check if phone number is empty
      if (!toPhoneNumber) {
        throw new Error('Phone number is empty');
      }
  
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Vonage APIs',
          to: toPhoneNumber,
          text: initialCoordinates
        })
      });
  
      const responseData = await response.json();
      console.log('SMS sent successfully:', responseData);
      
      alert(`SMS sent successfully to: ${toPhoneNumber}\nMessage: ${initialCoordinates}`);
  
    } catch (error) {
      console.error('Error sending SMS:', error);
      // Show error message if phone number is empty
      if (error.message === 'Phone number is empty') {
        alert('Error: Phone number cannot be empty');
      }
    }
  };

  return (
    <button onClick={handleSendSMS} style={{backgroundImage: 'url("images/sms.png")', backgroundSize: 'cover', width: '30px', height: '30px'}}></button> 
  );
};

export default SMSSender;
