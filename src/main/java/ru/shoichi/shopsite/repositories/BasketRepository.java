package ru.shoichi.shopsite.repositories;

import org.springframework.data.jpa.repository.Query;
import ru.shoichi.shopsite.models.Basket;
import ru.shoichi.shopsite.models.Image;

import java.util.List;
import java.util.Optional;

public interface BasketRepository extends BaseRepository<Basket, Integer> {
    List<Basket> findByUserId(int userId);
    @Query("SELECT b FROM Basket b WHERE b.user.id = :userId AND b.isBought = :isBought")
    Optional<Basket> findFirstByUserIdAndBought(int userId, boolean isBought);
}
