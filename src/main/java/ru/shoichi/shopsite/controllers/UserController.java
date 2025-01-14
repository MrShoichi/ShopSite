package ru.shoichi.shopsite.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shoichi.shopsite.models.Role;
import ru.shoichi.shopsite.models.User;
import ru.shoichi.shopsite.services.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    private UserService service;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        final List<User> users = service.readAll();
        if (users == null || users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id,@RequestBody Role role) {
        final boolean updated = service.updateRole(id, role);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }
}