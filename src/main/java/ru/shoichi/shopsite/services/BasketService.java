package ru.shoichi.shopsite.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.shoichi.shopsite.dtos.BasketPutRequest;
import ru.shoichi.shopsite.dtos.BasketRequest;
import ru.shoichi.shopsite.exceptions.ValidationException;
import ru.shoichi.shopsite.models.Basket;
import ru.shoichi.shopsite.models.BasketItem;
import ru.shoichi.shopsite.models.Cloth;
import ru.shoichi.shopsite.models.User;
import ru.shoichi.shopsite.repositories.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BasketService extends DBService<Basket> {
    private final BasketRepository basketRepository;
    private final UserRepository userRepository;
    private final ClothRepository clothRepository;
    private final BasketItemRepository basketItemRepository;

    public BasketService(BasketRepository repository, UserRepository userRepository,
                         ClothRepository clothRepository, BasketItemRepository basketItemRepository) {
        super(repository);
        this.basketRepository = repository;
        this.userRepository = userRepository;
        this.clothRepository = clothRepository;
        this.basketItemRepository = basketItemRepository;
    }

    @Override
    public boolean update(Basket obj, int id) {
        var baksetItems = obj.getItems();
        final boolean updated = super.update(obj, id);
        if (updated) {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }

    public boolean update(BasketPutRequest basketRequest, int id) {

        Basket basket = basketRepository.findById(basketRequest.getId()).orElse(null);
        if (basket == null) {
            return false;
        }
        var itemsIds = basketRequest
                .getItems()
                .stream()
                .collect(Collectors.
                        toMap(BasketPutRequest.BasketItemRequest::getId,
                                BasketPutRequest.BasketItemRequest::getQuantity));
        basketItemRepository.findByBasketId(basket.getId()).forEach((item) -> {
            if (itemsIds.containsKey(item.getId())) {
                item.setQuantity(itemsIds.get(item.getId()));
                basketItemRepository.save(item);
            } else {
                basketItemRepository.delete(item);
                itemsIds.remove(item.getId());
            }
        });
        if(itemsIds.isEmpty()) {
            basketRepository.delete(basket);
        }

        return true;
    }

    public boolean create(BasketRequest basketRequest) throws RuntimeException {
        User user = userRepository.findById(basketRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Basket basket = basketRepository.findFirstByUserIdAndBought(user.getId(), false)
                .orElseGet(() -> Basket.builder()
                        .user(user)
                        .isBought(basketRequest.isBought())
                        .dateCreated(new Date())
                        .build());

        Set<BasketItem> basketItems = basketRequest.getCloths().stream()
                .map(clothRequest -> {
                    Cloth cloth = clothRepository.findById(clothRequest.getId())
                            .orElseThrow(() -> new RuntimeException("Cloth not found: " + clothRequest.getId()));

                    // Создаем новый BasketItem для каждого товара с указанным количеством
                    return BasketItem.builder()
                            .quantity(clothRequest.getQuantity())
                            .cloth(cloth)
                            .clothId(cloth.getId())
                            .basket(basket)
                            .build();
                })
                .collect(Collectors.toSet());
        basketRepository.save(basket);

        basketItemRepository.saveAll(basketItems);


        return true;

    }


    public List<Basket> readByUserId(int id, boolean isBought) {
        return basketRepository.findByUserId(id).stream().filter(b -> b.isBought() == isBought).toList();
    }

    public boolean buy(int id) {
        Basket basket = basketRepository.findById(id).orElse(null);
        if(basket == null) {
            return false;
        }
        basket.setBought(true);
        basketRepository.save(basket);
        return true;
    }
}
