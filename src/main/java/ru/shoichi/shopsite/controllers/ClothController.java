package ru.shoichi.shopsite.controllers;

import jakarta.security.auth.message.AuthException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shoichi.shopsite.exceptions.ValidationException;
import ru.shoichi.shopsite.image.ImageUtil;
import ru.shoichi.shopsite.jwt.JwtRequest;
import ru.shoichi.shopsite.jwt.JwtResponse;
import ru.shoichi.shopsite.models.Cloth;
import ru.shoichi.shopsite.services.ClothService;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/cloth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ClothController {
    private final ClothService service;

    @GetMapping
    public ResponseEntity<?> getClothes() {
        final List<Cloth> cloths = service.readAll();
        if (cloths == null || cloths.isEmpty()) {
            return new ResponseEntity<>("Товаров нет", HttpStatus.NOT_FOUND);
        }
        cloths.forEach(cloth -> ImageUtil.decompressImage(cloth.getImage()));
        return new ResponseEntity<>(cloths, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable(name = "id") int id) {
        final Cloth obj = service.read(id);

        if (obj != null) {
            ImageUtil.decompressImage(obj.getImage());
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody Cloth cloth) {
        try {
            service.create(cloth);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (ValidationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getReason());
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody Cloth cloth) {
        final boolean updated = service.update(cloth, id);

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
