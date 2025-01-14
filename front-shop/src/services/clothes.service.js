import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8081/cloth";

class ClothesService {
    async getAll() {
        return await axios.get(API_URL, { headers: await authHeader() });
    }

    async getById(id) {
        return await axios.get(API_URL + "/" + id, { headers: await authHeader() });
    }

    async createNewCloth(cloth) {
        let authHeaders = await authHeader();
        return await axios.post(
            API_URL,
            {
                name: cloth.name,
                description: cloth.description,
                image: cloth.image,
                price: cloth.price,
                type: cloth.type
            },
            { headers: authHeaders }
        );
    }

    async updateCloth(cloth) {
        let authHeaders = await authHeader();
        return await axios.put(
            API_URL + "/" + cloth.id,
            {
                id: cloth.id,
                name: cloth.name,
                description: cloth.description,
                image: cloth.image,
                price: cloth.price,
                type: cloth.type
            },
            { headers: authHeaders }
        ).then((response)=>{
            return response;
        });
    }

    async deleteById(id) {
        return await axios.delete(API_URL + "/" + id, {
            headers: await authHeader(),
        });
    }
}

const clothesService = new ClothesService();

export default clothesService;