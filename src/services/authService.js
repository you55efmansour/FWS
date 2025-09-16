import apiClient from "./apiClient";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// auth
async function authenticate(credentials) {
  return apiClient.post("/api/TokenAuth/Authenticate", credentials);
}
async function GetComprehensiveApplicationInfo() {
  return apiClient.get("/api/services/app/Session/GetComprehensiveApplicationInfo");
}

// roles
async function fetchAllRoles(token) {
  return apiClient.get("/api/services/app/Role/GetAll", {
    headers: authHeaders(token),
  });
}

async function fetchUserRoles(token) {
  return apiClient.get("/api/services/app/User/GetRoles", {
    headers: authHeaders(token),
  });
}

async function fetchRoleById(id, token) {
  return apiClient.get("/api/services/app/Role/Get", {
    params: { Id: id },
    headers: authHeaders(token),
  });
}

async function createRole(data, token) {
  return apiClient.post("/api/services/app/Role/Create", data, {
    headers: authHeaders(token),
  });
}

async function updateRole(data, token) {
  return apiClient.put("/api/services/app/Role/Update", data, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
  });
}

async function deleteRole(id, token) {
  return apiClient.delete("/api/services/app/Role/Delete", {
    params: { Id: id },
    headers: authHeaders(token),
  });
}

async function fetchAllPermissions(token) {
  return apiClient.get("/api/services/app/Role/GetAllPermissions", {
    headers: authHeaders(token),
  });
}

const authService = {
  authenticate,
  fetchAllRoles,
  fetchUserRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  fetchAllPermissions,
  GetComprehensiveApplicationInfo
};

export default authService;
