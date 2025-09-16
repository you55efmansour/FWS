import { makeAutoObservable } from "mobx";
import usersService from "../services/usersService";

class UsersStore {
  error = null;
  doneMsg = null;
  constructor() {
    makeAutoObservable(this);
  }

  // get user

  userData = null;
  userRoles = null;
  async getUser(id, token) {
    try {
      const response = await usersService.getUser(id, token);

      this.userData = response.data.result;
      this.userRoles = this.userData.roleNames;
    } catch (error) {
      this.error = error.response?.data?.message;
      console.log(this.error);
    }
  }

  // get all users
  allUsers = null;
  async getAllUsers(token) {
    try {
      const response = await usersService.getAllUsers(token)

      this.allUsers = response.data.result.items;
    } catch (error) {
      console.log(error);
    }
  }

  // create new user

  async createNewUser(data, token) {
    this.loading = true;
    try {
      await usersService.createNewUser(data, token);

      this.doneMsg = "Created!";
      this.loading = false;
    } catch (error) {
      this.error = error.response.data.error.message;

      this.loading = false;
    }
  }
  // create new user

  async editUser(inf, token) {
    try {
      await usersService.editUser(inf, token);
      this.doneMsg = "Change successfully";
    } catch (error) {
      console.log(error);
      
    }
  }
  // delete user
  async deleteUser(id, token) {
    try {
      await usersService.deleteUser(id, token);
    } catch (error) {
      console.log(error);
    }
  }
  // active user
  async active(id, token) {
    try {
      await usersService.active(id, token);
    } catch (error) {
      this.error = error.response?.data?.message;
      console.log(error);
    }
  }
  // deactivate user
  async deactivate(id, token) {
    try {
      await usersService.deactivate(id, token);
    } catch (error) {
      console.log(error);
    }
  }
  // reset password
  async resetPassword(passwordInf, token) {
    this.loading = true;
    try {
      await usersService.resetPassword(passwordInf, token);
      this.doneMsg = "Reset completed successfully";
      this.loading = false;
    } catch (error) {
      console.log(error);
      

      this.loading = false;
    }
  }
  // change password
  async changePassword(passwordInf, token) {
    this.loading = true;
    try {
      await usersService.changePassword(passwordInf, token);

      this.doneMsg = "Change Password successfully";
      this.loading = false;
    } catch (error) {
      this.error = error.response.data.error.message;

      this.loading = false;
    }
  }
}
const userStore = new UsersStore();

export default userStore;
