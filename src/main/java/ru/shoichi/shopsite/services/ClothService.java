package ru.shoichi.shopsite.services;

import jakarta.transaction.Transactional;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.shoichi.shopsite.exceptions.ValidationException;
import ru.shoichi.shopsite.models.Cloth;
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
        validateCard(obj);
        return super.create(obj);
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



    @ResponseBody
    public void validateCard(Cloth obj) {
        if (obj.getDescription().length() < 5 || obj.getDescription().length() > 250) {
            log.warn("Описание не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано описание");
        } else if (obj.getImage() == null) {
            log.warn("Изображение не может быть пустое");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Изображение должно быть введено");
        }
    }

}
