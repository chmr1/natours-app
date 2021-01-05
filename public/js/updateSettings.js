/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const endPoint = type === 'Password' ? 'updateMyPassword' : 'updateMe';
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${endPoint}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} Updated Successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
