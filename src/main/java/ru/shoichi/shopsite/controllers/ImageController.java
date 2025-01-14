package ru.shoichi.shopsite.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.shoichi.shopsite.image.ImageResponse;
import ru.shoichi.shopsite.models.Image;
import ru.shoichi.shopsite.services.ImageService;

import java.io.IOException;

@RestController
@RequestMapping("/image")
@AllArgsConstructor
public class ImageController {

    private ImageService imageDataService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        Image response = imageDataService.uploadImage(file);

        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping("/info/{name}")
    public ResponseEntity<?>  getImageInfoByName(@PathVariable("name") String name){
        Image image = imageDataService.getInfoByImageByName(name);

        return ResponseEntity.status(HttpStatus.OK)
                .body(image);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?>  updateImage(@PathVariable(name = "id") int id, @RequestParam("image") MultipartFile image) throws IOException {
        Image newImage = imageDataService.updateImage(image, id);

        return newImage != null ?  ResponseEntity.status(HttpStatus.OK).body(newImage)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @GetMapping("/content/{name}")
    public ResponseEntity<?>  getImageByName(@PathVariable("name") String name){
        byte[] image = imageDataService.getImage(name);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(image);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?>  getImageById(@PathVariable("id") int id){
        Image image = imageDataService.getImageById(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = imageDataService.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }


}