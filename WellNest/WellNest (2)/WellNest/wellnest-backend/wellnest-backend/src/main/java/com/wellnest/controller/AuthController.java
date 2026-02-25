package com.wellnest.controller;

import com.wellnest.dto.LoginRequest;
import com.wellnest.dto.RegisterRequest;
import com.wellnest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        authService.register(signUpRequest);
        return ResponseEntity.ok(java.util.Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody com.wellnest.dto.TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return authService.findByToken(requestRefreshToken)
                .map(authService::verifyExpiration)
                .map(com.wellnest.entity.RefreshToken::getUser)
                .map(user -> {
                    String token = authService.generateTokenFromUsername(user.getUsername(), user.getRole().name());
                    return ResponseEntity.ok(new com.wellnest.dto.TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
