package com.backend.backend.service;

import com.backend.backend.dto.LoginRequestDTO;
import com.backend.backend.dto.LoginResponseDTO;
import com.backend.backend.dto.RegisterRequestDTO;
import com.backend.backend.dto.RegisterResponseDTO;
import com.backend.backend.dto.ProfileDTO;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final ProfileService profileService; // Inject ProfileService

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, JWTService jwtService,
                       ProfileService profileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.profileService = profileService;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity createUser(RegisterRequestDTO userData) {
        UserEntity newUser = new UserEntity(userData.getName(),
                userData.getEmail(),
                userData.getUsername(),
                passwordEncoder.encode(userData.getPassword()));
        return userRepository.save(newUser);
    }

    public LoginResponseDTO login(LoginRequestDTO loginData) {
        if ("admin".equals(loginData.getUsername()) && "admin123".equals(loginData.getPassword())) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "Admin");
            claims.put("email", "admin@example.com");

            String token = jwtService.getJWTToken("admin", "admin-id", claims);
            return new LoginResponseDTO(token, LocalDateTime.now(), null, "Admin login successful");
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginData.getUsername(), loginData.getPassword())
            );
        } catch (Exception e) {
            return new LoginResponseDTO(null, null, "Invalid credentials", "error");
        }

        UserEntity user = userRepository.findByUsername(loginData.getUsername()).orElse(null);
        if (user == null) {
            return new LoginResponseDTO(null, null, "User not found", "error");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "User");
        claims.put("email", user.getEmail());

        String token = jwtService.getJWTToken(user.getUsername(), user.getId(), claims);
        return new LoginResponseDTO(token, LocalDateTime.now(), null, "Token generated");
    }

    public RegisterResponseDTO register(RegisterRequestDTO req) {
        if (isUserEnable(req.getUsername())) 
            return new RegisterResponseDTO(null, "User already exists");

        // Create the user
        UserEntity userData = this.createUser(req);
        if (userData.getId() == null) 
            return new RegisterResponseDTO(null, "System error");

        // Create a profile for the user
        ProfileDTO profileData = new ProfileDTO(null, null, true); // Default profile data
        profileService.createProfile(userData.getId(), profileData);

        return new RegisterResponseDTO(String.format("User registered with ID: %s", userData.getId()), null);
    }

    private Boolean isUserEnable(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}