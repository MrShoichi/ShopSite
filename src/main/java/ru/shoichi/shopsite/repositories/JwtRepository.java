package ru.shoichi.shopsite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shoichi.shopsite.models.JwtToken;

@Repository
public interface JwtRepository extends BaseRepository<JwtToken, Integer> {
    JwtToken findByEmail(String email);
}
