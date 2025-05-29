package com.devconnect.devconnect.service;

import com.devconnect.devconnect.dto.LoginRequestDTO;
import com.devconnect.devconnect.dto.UserRequestDTO;
import com.devconnect.devconnect.dto.UserResponseDTO;
import com.devconnect.devconnect.model.User;
import com.devconnect.devconnect.repository.UserRepository;
import com.devconnect.devconnect.security.CustomUserDetailsService;
import com.devconnect.devconnect.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    public UserResponseDTO createUser(UserRequestDTO dto) {
        User user = User.builder()
                .username(dto.username())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password())) 
                .bio(dto.bio())
                .build();

        userRepository.save(user);
        return mapToResponse(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

     public ResponseEntity<Map<String, String>> login(LoginRequestDTO loginRequestDTO) {
    // Load user entity
    User user = userRepository.findByEmail(loginRequestDTO.email())
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Verify password
    if (!passwordEncoder.matches(loginRequestDTO.password(), user.getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }

    // Load UserDetails (needed for JWT token generation)
    UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());

    // Generate JWT token
    String token = jwtUtil.generateToken(userDetails);

    // Prepare response
    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    response.put("message", "Login successful");

    return ResponseEntity.ok(response);
}


    private UserResponseDTO mapToResponse(User user) {
        return new UserResponseDTO(user.getId(), user.getUsername(), user.getEmail(), user.getBio());
    }
}
