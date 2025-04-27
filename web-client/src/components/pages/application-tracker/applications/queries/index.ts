// This is where I write function to get data from backend

import { api } from '@/utils/axios';

export const getApplicationsData = async () => {
  // const response = await axios.get('http://localhost:8000/getAllApplications');
  // First need to login to get the token. Send post request to /login
  const email = 'abc-user0-vtmp@gmail.com';
  const password = 'password';

  const loginResponse = await api.post('/auth/login', { email, password });
  const token = loginResponse.data.data.token;
  console.log('Token returned from login: ', token);

  // Now use token to get applications for this user
  const response = await api.get('/applications', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  console.log(localStorage);
  // // return response.data;
};
