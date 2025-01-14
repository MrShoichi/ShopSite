package ru.shoichi.shopsite.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.shoichi.shopsite.models.User;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class JwtResponse implements Serializable {
    private final String type = "Bearer";
    private String accessToken;
    private String refreshToken;
    private User user;

}