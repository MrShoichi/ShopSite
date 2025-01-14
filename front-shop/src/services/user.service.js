import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8081/users";

class UsersService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async update(id, role) {
    return await axios.put(API_URL + "/" + id, {id:role.id, name: role.name},{ headers: await authHeader() });
  }
}

const usersService = new UsersService();

export default usersService;
