package ru.shoichi.shopsite.dtos;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import ru.shoichi.shopsite.models.BasketItem;
import ru.shoichi.shopsite.models.ClothesType;
import ru.shoichi.shopsite.models.Image;

import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@Builder
@Slf4j
@Data
public class ClothRequest {

    private String name;

    private ImageRequest image;

    private String description;

    private int price;

    private ClothesType type;
    @Builder
    @Slf4j
    @Data
    public static class ImageRequest {
        private int id;
        private String name;
        private String type;
        private byte[] imageData;
    }

}
