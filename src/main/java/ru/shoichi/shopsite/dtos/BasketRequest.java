package ru.shoichi.shopsite.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.Set;
@AllArgsConstructor
@Builder
@Slf4j
@Data
public class BasketRequest {
    private int userId;
    private Set<ClothRequest> cloths;
    private boolean isBought;
    @Builder
    @Slf4j
    @Data
    public static class ClothRequest {
        private int id;
        private int quantity;
    }
}