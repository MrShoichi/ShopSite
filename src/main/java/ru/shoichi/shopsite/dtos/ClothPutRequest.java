package ru.shoichi.shopsite.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;
import ru.shoichi.shopsite.models.ClothesType;

@Slf4j
public class ClothPutRequest extends ClothRequest {
    private int id;

    public ClothPutRequest(String name, ImageRequest image, String description, int price, ClothesType type) {
        super(name, image, description, price, type);
    }
}
