package ru.shoichi.shopsite.repositories;

import ru.shoichi.shopsite.models.BasketItem;

import java.util.List;

public interface BasketItemRepository extends BaseRepository<BasketItem, Integer> {
    List<BasketItem> findByBasketId(int id);
}
