package ru.shoichi.shopsite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shoichi.shopsite.models.Role;

@Repository
public interface RoleRepository extends BaseRepository<Role,Integer> {
    Role findByName(String name);
}
