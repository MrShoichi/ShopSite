package ru.shoichi.shopsite.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shoichi.shopsite.dtos.BasketPutRequest;
import ru.shoichi.shopsite.dtos.BasketRequest;
import ru.shoichi.shopsite.models.Basket;
import ru.shoichi.shopsite.models.Cloth;
import ru.shoichi.shopsite.models.User;
import ru.shoichi.shopsite.services.BasketService;
import ru.shoichi.shopsite.services.ClothService;
import ru.shoichi.shopsite.services.UserService;

import java.util.Date;
import java.util.List;
import java.util.Set;

@CrossOrigin
@RestController
@RequestMapping("/basket")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BasketController {
    private final BasketService service;

    @GetMapping
    public ResponseEntity<?> getBasket() {
        final List<Basket> baskets = service.readAll();
        if (baskets == null || baskets.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(baskets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable(name = "id") int id) {
        final Basket obj = service.read(id);

        if (obj != null) {
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> readByUserId(@PathVariable(name = "id") int id, @RequestParam(defaultValue = "false") boolean isBought) {
        final List<Basket> obj = service.readByUserId(id, isBought);

        if (obj != null && !obj.isEmpty()) {
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody BasketRequest basketRequest) {
        try {
            if(service.create(basketRequest)) {
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody BasketPutRequest basket) {
        final boolean updated = service.update(basket, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @PutMapping("/buy/{id}")
    public ResponseEntity<?> buy(@PathVariable(name = "id") int id) {
        final boolean updated = service.buy(id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = service.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

}
