package ru.shoichi.shopsite.services;

import io.jsonwebtoken.*;
import jakarta.security.auth.message.AuthException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.shoichi.shopsite.jwt.JwtRequest;
import ru.shoichi.shopsite.jwt.JwtResponse;
import ru.shoichi.shopsite.models.*;
import ru.shoichi.shopsite.providers.JwtProvider;
import ru.shoichi.shopsite.repositories.JwtRepository;


@Slf4j
@Service
@RequiredArgsConstructor
public final class AuthService {
    private final UserService service;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder bCryptPasswordEncoder;

    private final JwtRepository jwtRepository;


    public JwtResponse login(@NonNull JwtRequest authRequest) throws AuthException {
        final User user = service.findByEmail(authRequest.getEmail());
        if (user == null) {
            throw new AuthException("Пользователь с такой почтой не найден");
        }
        if (bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword()) ||
                authRequest.getPassword().equals(user.getPassword())) {
            final String accessToken = jwtProvider.generateAccessToken(user);
            final String refreshToken = jwtProvider.generateRefreshToken(user);
            JwtToken token = jwtRepository.findByEmail(user.getEmail());
            if (token != null) {
                token.setName(refreshToken);
                jwtRepository.save(token);
            } else {
                JwtToken newToken = JwtToken.builder()
                        .email(user.getEmail())
                        .name(refreshToken)
                        .build();
                jwtRepository.save(newToken);
            }
            return new JwtResponse(accessToken, refreshToken, user);
        } else {
            throw new AuthException("Неправильный пароль");
        }
    }

    public JwtResponse getAccessToken(@NonNull String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            JwtToken token = jwtRepository.findByEmail(email);
            if (token == null) {
                throw new AuthException("На такого пользователя токен не зарегестрирован");
            }
            final String saveRefreshToken = token.getName();
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final User user = service.findByEmail(email);
                if (user == null) {
                    throw new AuthException("Пользователь не найден");
                }
                final String accessToken = jwtProvider.generateAccessToken(user);
                return new JwtResponse(accessToken, null, null);
            }
        }
        return new JwtResponse(null, null, null);
    }

    public JwtResponse refresh(@NonNull String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            final JwtToken token = jwtRepository.findByEmail(email);
            if (token != null && token.getName().equals(refreshToken)) {
                final User user = service.findByEmail(email);
                if (user == null) {
                    throw new AuthException("Пользователь не найден");
                }
                final String accessToken = jwtProvider.generateAccessToken(user);
                final String newRefreshToken = jwtProvider.generateRefreshToken(user);
                token.setName(newRefreshToken);
                jwtRepository.save(token);
                    return new JwtResponse(accessToken, newRefreshToken, user);
            }
        }
        throw new AuthException("Невалидный JWT токен");
    }

    public boolean validateToken(String token) {
        return jwtProvider.validateAccessToken(token);
    }

}