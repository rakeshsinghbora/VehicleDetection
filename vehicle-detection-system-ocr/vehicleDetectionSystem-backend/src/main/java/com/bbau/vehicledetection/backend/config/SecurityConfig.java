 package com.bbau.vehicledetection.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    //disabling password for madarchod endpoints 
    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**", "/error", "/actuator/**").permitAll() // ✅ Allow error and actuator endpoints
            .anyRequest().authenticated()
        );

    return http.build();
}

}


