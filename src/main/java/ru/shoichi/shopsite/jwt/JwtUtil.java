package ru.shoichi.shopsite.jwt;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.shoichi.shopsite.models.Role;
import ru.shoichi.shopsite.repositories.RoleRepository;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class JwtUtil {

    private final RoleRepository repository;

    public JwtAuthentication generate(Claims claims) {
        final JwtAuthentication jwtInfoToken = new JwtAuthentication();
        jwtInfoToken.setRoles(getRoles(claims));
        jwtInfoToken.setFirstName(claims.get("name", String.class));
        jwtInfoToken.setUsername(claims.getSubject());
        return jwtInfoToken;
    }

    private Set<Role> getRoles(Claims claims) {
        ObjectMapper objectMapper = new ObjectMapper(); // Используйте Jackson
        List<LinkedHashMap<String, String>> roles = objectMapper.convertValue(
                claims.get("roles"),
                new TypeReference<>() {}
        );

        return roles.stream()
                .map(role -> {
                    assert repository != null;
                    return repository.findByName(role.get("authority"));
                })
                .collect(Collectors.toSet());

    }

}