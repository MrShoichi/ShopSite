package ru.shoichi.shopsite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shoichi.shopsite.models.User;

@Repository
public interface UserRepository extends BaseRepository<User, Integer> {
    User findByEmail(String email);

}
