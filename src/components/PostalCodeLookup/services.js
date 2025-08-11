import axios from 'axios';

export const fetchLocationByPostalCode = async (postalCode) => {
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${postalCode}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data[0].Status === "Error") {
      throw new Error(response.data[0].Message);
    }
    
    if (!response.data[0].PostOffice || response.data[0].PostOffice.length === 0) {
      throw new Error('No post offices found for this PIN code');
    }
    
    return response.data[0].PostOffice;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch location data');
  }
};