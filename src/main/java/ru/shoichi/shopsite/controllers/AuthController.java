package ru.shoichi.shopsite.controllers;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shoichi.shopsite.jwt.JwtRequest;
import ru.shoichi.shopsite.jwt.JwtResponse;
import ru.shoichi.shopsite.jwt.JwtTokenRequest;
import ru.shoichi.shopsite.models.User;
import ru.shoichi.shopsite.services.AuthService;
import ru.shoichi.shopsite.services.UserService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthController {

    private final AuthService authService;
    private final UserService service;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody JwtRequest authRequest) {
        try {
            final JwtResponse token = authService.login(authRequest);
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Object> validate(@RequestBody JwtTokenRequest token) {
        try {
            return ResponseEntity.ok(authService.validateToken(token.getToken()));
        } catch (Exception exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/token")
    public ResponseEntity<Object> getNewAccessToken(@RequestBody JwtTokenRequest request) {
        try {
            final JwtResponse token = authService.getAccessToken(request.getToken());
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Object> getNewRefreshToken(@RequestBody JwtTokenRequest request) {
        try {
            final JwtResponse token = authService.refresh(request.getToken());
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }

    }

    @PostMapping("/registration")
    public ResponseEntity<Object> registration(@RequestBody User user) {
        try {
            if (!service.create(user)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Пользователь с такой почтой уже есть");
            }
            final JwtResponse token = authService.login(JwtRequest.valueOf(user));
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }
}
