package ru.shoichi.shopsite.services;

import jakarta.transaction.Transactional;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.shoichi.shopsite.dtos.ClothRequest;
import ru.shoichi.shopsite.exceptions.ValidationException;
import ru.shoichi.shopsite.models.Cloth;
import ru.shoichi.shopsite.models.Image;
import ru.shoichi.shopsite.repositories.BaseRepository;

import java.util.List;

@Slf4j
@Service
public class ClothService extends DBService<Cloth> {

    public ClothService(BaseRepository<Cloth, Integer> repository) {
        super(repository);
    }

    @Transactional
    @Override
    public boolean create(Cloth obj) {
        return super.create(obj);
    }

    public boolean create(ClothRequest obj) {
        validateCard(obj);
        var cloth = fromDto(obj);
        return super.create(cloth);
    }

    @Override
    public boolean update(Cloth obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }

    public boolean update(ClothRequest obj, int id) {
        var cloth = fromDto(obj);
        final boolean updated = super.update(cloth, id);
        if (updated)
        {
            cloth.setId(id);
            repository.save(cloth);
        }
        return updated;
    }

    public Cloth fromDto(ClothRequest dto) {
        return Cloth.builder()
                .image(Image.builder()
                        .id(dto.getImage().getId())
                        .imageData(dto.getImage().getImageData())
                        .type(dto.getImage().getType())
                        .name(dto.getImage().getName())
                        .build())
                .type(dto.getType())
                .price(dto.getPrice())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    @ResponseBody
    public void validateCard(ClothRequest obj) {
        if (obj.getDescription().length() < 5 || obj.getDescription().length() > 250) {
            log.warn("Описание не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано описание");
        } else if (obj.getImage() == null) {
            log.warn("Изображение не может быть пустое");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Изображение должно быть введено");
        }
    }

}
