package ru.shoichi.shopsite.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.shoichi.shopsite.filters.JWTFilter;
import ru.shoichi.shopsite.providers.AuthProvider;
import ru.shoichi.shopsite.services.UserService;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserService userService;
    private final AuthProvider authProvider;
    private final JWTFilter jwtFilter;

    // Конфигурируем AuthenticationManager через конструктор
    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(authProvider)
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptionHandler -> exceptionHandler.authenticationEntryPoint(
                        (request, response, ex) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage())))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cloth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/basket/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/cloth/**").hasAnyAuthority("admin")
                        .requestMatchers(HttpMethod.POST, "/cloth/**").hasAnyAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/cloth/**").hasAnyAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/basket/**").hasAnyAuthority("user", "admin")
                        .requestMatchers(HttpMethod.POST, "/basket/**").hasAnyAuthority("user", "admin")
                        .requestMatchers(HttpMethod.DELETE, "/basket/**").hasAnyAuthority("user", "admin")
                        .requestMatchers(HttpMethod.PUT, "/image/**").hasAnyAuthority("admin")
                        .requestMatchers(HttpMethod.POST, "/image/**").hasAnyAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/image/**").hasAnyAuthority("admin")
                        .anyRequest().authenticated())
                .addFilterAfter(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userService);
        return authenticationProvider;
    }
}
