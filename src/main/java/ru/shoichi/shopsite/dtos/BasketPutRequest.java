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
public class BasketPutRequest {
    private int id;
    private Set<BasketItemRequest> items;
    @Builder
    @Slf4j
    @Data
    public static class BasketItemRequest {
        private int id;
        private int quantity;
    }
}