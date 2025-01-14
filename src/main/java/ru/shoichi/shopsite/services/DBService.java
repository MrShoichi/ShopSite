package ru.shoichi.shopsite.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import ru.shoichi.shopsite.repositories.BaseRepository;

import java.util.List;
import java.util.Optional;


public abstract class DBService<T> {
    protected BaseRepository<T, Integer> repository;
    public DBService(BaseRepository<T, Integer> repository) {
        this.repository = repository;
    }
    public boolean create(T obj) {
        repository.save(obj);
        return true;
    }

    @Transactional
    public List<T> readAll() {
        return repository.findAll();
    }

    public T read(int id) {
        Optional<T> obj = repository.findById(id);
        return obj.orElse(null);
    }

    public boolean update(T obj, int id) {
        return repository.existsById(id);
    }

    public boolean delete(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
