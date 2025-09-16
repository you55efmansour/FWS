import apiClient from "./apiClient";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

async function getUser(id, token) {
    return apiClient.get(`/api/services/app/User/Get`,
        {params: { Id: id },headers: authHeaders(token),}
    );
}

async function getAllUsers(token) {
      return apiClient.get(`/api/services/app/User/GetAll`,
        {headers: authHeaders(token)}
      );
}

async function createNewUser(data, token) {
  return apiClient.post(`/api/services/app/User/Create`, data, {
    headers: authHeaders(token),
  });
}

async function editUser(data, token) {
  return apiClient.put(`/api/services/app/User/Update`, data, {
    headers: authHeaders(token),
  });
}

async function deleteUser(id, token) {
  return apiClient.delete(`/api/services/app/User/Delete`, {
    params: { Id: id },
    headers: authHeaders(token),
  });
}

async function active(id, token) {
  return apiClient.post(`/api/services/app/User/Activate`, {id: id}, {
    headers: authHeaders(token),
  });
}

async function deactivate(id, token) {
  return apiClient.post(`/api/services/app/User/DeActivate`, {id: id}, {
    headers: authHeaders(token),
  });
}

async function resetPassword(passwordInf, token) {
  return apiClient.post(`/api/services/app/User/ResetPassword`, passwordInf, {
    headers: authHeaders(token),
  });
}

async function changePassword(passwordInf, token) {
  return apiClient.post(`/api/services/app/User/ChangePassword`, passwordInf, {
    headers: authHeaders(token),
  });
}

const usersService = {
  getUser,
  getAllUsers,
  createNewUser,
  editUser,
  deleteUser,
  active,
  deactivate,
  resetPassword,
  changePassword,
};

export default usersService;
