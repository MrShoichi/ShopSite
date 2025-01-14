import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8081/image";

class ImagesService {

    async addNewImage(image) {
        let headers = await authHeader();
        headers["Content-Type"] = "multipart/form-data";
        return await axios.post(API_URL, {image}, {headers:  headers});
    }

    async getImageById(id) {
        let headers = await authHeader();
        return await axios.get(API_URL + "/" + id, {headers:  headers});
    }

    async updateImageById(image, id) {
        let headers = await authHeader();
        headers["Content-Type"] = "multipart/form-data";
        return await axios.put(API_URL + "/" + id, {image},{headers:  headers});
    }


    async deleteById(id)
    {
        return await axios.delete(API_URL + "/" + id, { headers: await authHeader()});
    }
}

const imageService = new ImagesService();

export default imageService;