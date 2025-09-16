import { makeAutoObservable } from "mobx";
import authService from "../services/authService";
import apiClient from "../services/apiClient";

class AuthStore {
  userId = null;
  token = null;
  error = null;
  inf = null;
  doneMsg = null;
  Loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  
  // Login an existing user
  async login(logInf) {
    try {
      this.Loading = true;
      const response = await authService.authenticate(logInf);
      this.userId = response.data.result.userId;
      this.token = response.data.result.accessToken;
      sessionStorage.setItem("userId", JSON.stringify(this.userId));
      sessionStorage.setItem("token", this.token);
    } catch (er) {
      if (er.response && er.response.data && er.response.data.error) {
        this.error =
          er.response.data.error.details ||
          er.response.data.error.message ||
          "Login failed";
      } else if (er.message) {
        this.error = er.message;
      } else {
        this.error = "Network error or server unavailable";
      }
    } finally {
      this.Loading = false;
    }
  }

async GetComprehensiveApplicationInfo() {
  try {
    return await authService.GetComprehensiveApplicationInfo();
    
  } catch (error) {
    console.log(error);
    
  }
}

  // Logout the user
  logout() {
    this.userId = null;
    this.token = null;
    sessionStorage.clear();
  }

  //get all roles
  allRoles = null;

  async getAllRoles(token) {
    try {
      const response = await authService.fetchAllRoles(token);

      this.allRoles = response.data.result.items;
    } catch (error) {
      console.log(error);
    }
  }
  // get roles
  roles = null;
  async getRoles(token) {
    try {
      const response = await authService.fetchUserRoles(token);

      this.roles = response.data.result.items;
    } catch (error) {
      console.log(error);
    }
  }

  // get user Permissions
  userPermissions = null;
  async getUserRole(id, token) {
    try {
      const response = await authService.fetchRoleById(id, token);

      this.userPermissions = response.data.result.grantedPermissions;
    } catch (error) {
      console.log(error);
    }
  }

  //create new role
  async createNewRole(data, token) {
    console.log(data);

    try {
      await authService.createRole(data, token);

      this.doneMsg = "Created!";
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        this.error = error.response.data.error.message || "Operation failed";
      } else if (error.message) {
        this.error = error.message;
      } else {
        this.error = "Network error or server unavailable";
      }
      console.log(error);
    }
  }

  // edit roles
  async editRole(inf, token) {
    try {
      await authService.updateRole(inf, token);
      this.doneMsg = "Change successfully";
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        this.error = error.response.data.error.message || "Operation failed";
      } else if (error.message) {
        this.error = error.message;
      } else {
        this.error = "Network error or server unavailable";
      }
    }
  }

  // delete role
  async deleteRole(id, token) {
    try {
      await authService.deleteRole(id, token);
    } catch (error) {
      this.error = error.response?.data?.message;
      console.log(error);
    }
  }

  // get all permissions
  allPermissions = null;
  async getAllPermissions(token) {
    try {
      const response = await authService.fetchAllPermissions(token);

      this.allPermissions = response.data.result.items;
    } catch (error) {
      this.error = error.response?.data?.message;
      console.log(this.error);
    }
  }

  // get role permissions
  rolePermissions = null;
  async getRolePermissions(id, token) {
    try {
      const response = await apiClient.get(`/api/services/app/Role/Get`, {
        params: { Id: id },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      this.rolePermissions = response.data.result.grantedPermissions;
    } catch (error) {
      console.log(error);
    }
  }

  initialize() {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("userId");
    const savedError = sessionStorage.getItem("error");

    if (savedToken && savedUser) {
      this.userId = JSON.parse(savedUser);
      this.token = savedToken;
    }

    savedError ? (this.error = JSON.parse(savedError)) : (this.error = "");
  }
}

const authStore = new AuthStore();
authStore.initialize();
export default authStore;
