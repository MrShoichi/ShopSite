import axios from "axios";
import authHeader from "./auth-header";
import config from "bootstrap/js/src/util/config";

const API_URL = "http://localhost:8081/basket";

class BasketService {
    async getAll() {
        return await axios.get(API_URL, {headers: await authHeader()});
    }

    async getById(id) {
        return await axios.get(API_URL + "/" + id, {headers: await authHeader()});
    }

    async getByUserId(id, isBought) {
        return await axios.get(API_URL + "/user/" + id,
            {
                params: {
                    isBought: isBought
                }
            },
            {headers: await authHeader()});
    }

    async buy(user, cloth) {
        let authHeaders = await authHeader();

        await this.getByUserId(user.id).then(
            async (response) => {
                const basket = response.data[0];
                const basket_items = basket.items.filter(item => item.clothId === cloth.id);
                if (basket_items.length !== 0) {
                    basket_items[0].quantity++;
                } else {
                    cloth.quantity = 1;
                    basket.items += cloth;

                }

                return await axios.put(
                    API_URL + "/" + basket.id, basket,
                    {headers: authHeaders}
                );
            }
        ).catch(async () => {
            cloth.quantity = 1
            return await axios.post(
                API_URL, {
                    userId: user.id,
                    cloths: [cloth],
                    isBought: false
                },
                {headers: authHeaders}
            );
        })
    }

    async remove(basket, cloth) {
        let authHeaders = await authHeader();
        let basketChange = basket;
        const basket_items = basket.items.filter(item => item.clothId === cloth.id);
        if (basket_items.length !== 0) {
            var basket_item = basket_items[0];
            basket_item.quantity--;
            if (basket_item.quantity === 0) {
                basketChange.items = basket.items.filter(item => item.clothId !== basket_item.clothId);
            }
        }
        else {
            return;
        }



        return await axios.put(
            API_URL + "/" + basket.id, basketChange,
            {headers: authHeaders}
        );


    }



    async deleteById(id) {

        return await axios.delete(API_URL + "/" + id, {
            headers: await authHeader(),
        });
    }

    async buyBasket(id) {
        let authHeaders = await authHeader();

        return await axios.put(
            API_URL + "/buy/" + id, {}, {headers: authHeaders}
        );
    }
}

const basketService = new BasketService();

export default basketService;