package ru.shoichi.shopsite.repositories;

import org.springframework.stereotype.Repository;
import ru.shoichi.shopsite.models.Image;


import java.util.Optional;

@Repository
public interface ImageRepository extends BaseRepository<Image, Integer>{
    Optional<Image> findByName(String name);
    Optional<Image> findById(int id);
}
