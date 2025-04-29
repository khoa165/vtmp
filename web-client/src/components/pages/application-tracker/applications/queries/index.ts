import {
  ApplicationTrackerSchema,
  IApplications,
} from '@/components/pages/application-tracker/applications/queries/validation';
import { api } from '@/utils/axios';

export const getApplicationsData = async (): Promise<IApplications> => {
  const email = 'abc-user0-vtmp@gmail.com';
  const password = 'password';
  const loginResponse = await api.post('/auth/login', { email, password });
  const token = loginResponse.data.data.token;
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGVmNTQ4YzU3YWE4ZDU1MzZkYjU4MSIsImlhdCI6MTc0NTgxMDgzOSwiZXhwIjoxNzU0NDUwODM5fQ.qyjecS4c4CdzRP1pZFdk5rkv-gGFxJQg-JbESskuiys';

  const response = await api.get('/applications', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data.data);
  return ApplicationTrackerSchema.parse(response.data).data;
};
