package ru.shoichi.shopsite.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.shoichi.shopsite.image.ImageResponse;
import ru.shoichi.shopsite.models.Image;
import ru.shoichi.shopsite.repositories.ImageRepository;
import ru.shoichi.shopsite.image.ImageUtil;

import java.io.IOException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ImageService {

    private ImageRepository imageRepository;

    public Image uploadImage(MultipartFile file) throws IOException {
        Image image = Image.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .imageData(file.getBytes()).build();
        ImageUtil.compressImage(image);
        imageRepository.save(image);

        return image;

    }

    @Transactional
    public Image getInfoByImageByName(String name) {
        Optional<Image> dbImage = imageRepository.findByName(name);
        Image image = Image.builder()
                .name(dbImage.get().getName())
                .type(dbImage.get().getType())
                .imageData(dbImage.get().getImageData()).build();
        ImageUtil.decompressImage(image);
        return image;

    }

    @Transactional
    public byte[] getImage(String name) {
        Image dbImage = imageRepository.findByName(name).orElse(null);
        if(dbImage == null)
        {
            return null;
        }
        ImageUtil.decompressImage(dbImage);
        return dbImage.getImageData();
    }

    @Transactional
    public Image updateImage(MultipartFile image, int id) throws IOException {
        if(imageRepository.existsById(id))
        {
            Image newImage = Image.builder()
                    .id(id)
                    .name(image.getOriginalFilename())
                    .type(image.getContentType())
                    .imageData(image.getBytes()).build();
            ImageUtil.compressImage(newImage);
            imageRepository.save(newImage);
            return newImage;
        }

        return null;
    }

    @Transactional
    public Image getImageById(int id) {
        return imageRepository.findById(id).orElse(null);
    }


    public boolean delete(int id) {
        if (imageRepository.existsById(id)) {
            imageRepository.deleteById(id);
            return true;
        }
        return false;
    }

}