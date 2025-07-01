package com.devconnect.devconnect.service;

import com.devconnect.devconnect.dto.LoginRequestDTO;
import com.devconnect.devconnect.dto.UserProfileDTO;
import com.devconnect.devconnect.dto.UserRequestDTO;
import com.devconnect.devconnect.dto.UserResponseDTO;
import com.devconnect.devconnect.search.UserDocument;
import com.devconnect.devconnect.model.User;
import com.devconnect.devconnect.repository.UserRepository;
import com.devconnect.devconnect.search.UserSearchService;
import com.devconnect.devconnect.security.CustomUserDetailsService;
import com.devconnect.devconnect.security.JwtUtil;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserSearchService userSearchService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private ElasticsearchClient elasticsearchClient;
       

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

        User saved = userRepository.save(user);
        userSearchService.indexUser(new UserDocument(
            saved.getId().toString(),
            saved.getUsername(),
            saved.getBio()


        ));
        
        return mapToResponse(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Autowired


    public void indexAllUsers() throws IOException {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            UserDocument doc = UserDocument.builder()
                .id(user.getId().toString())
                .username(user.getUsername())
                .bio(user.getBio())
                .build();

            elasticsearchClient.index(i -> i
                .index("username")
                .id(user.getId().toString())
                .document(doc)
            );
        }
    }


    public UserProfileDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        return new UserProfileDTO(
            user.getId(),
            user.getUsername(),
            user.getBio(),
            user.getFollowers().size(),
            user.getFollowing().size());
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
    public void followUser(String followerEmail, Long userIdToFollow) {
        User follower = userRepository.findByEmail(followerEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        User toFollow = userRepository.findById(userIdToFollow)
            .orElseThrow(() -> new UsernameNotFoundException("Target user not found"));

        toFollow.getFollowers().add(follower);
        userRepository.save(toFollow);
    }

    public void unfollowUser(String followerEmail, Long userIdToUnfollow) {
        User follower = userRepository.findByEmail(followerEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        User toUnfollow = userRepository.findById(userIdToUnfollow)
            .orElseThrow(() -> new UsernameNotFoundException("Target user not found"));

        toUnfollow.getFollowers().remove(follower);
        userRepository.save(toUnfollow);
    }
    

    public Page<UserProfileDTO> getFollowersSorted(Long userId, Pageable pageable) {
        return userRepository.findFollowersSortedByFollowerCount(userId, pageable)
            .map(user -> new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getBio(),
                user.getFollowers().size(),
                user.getFollowing().size()
            ));
    }

    public Page<UserProfileDTO> getFollowingSorted(Long userId, Pageable pageable) {
        return userRepository.findFollowingSortedByFollowerCount(userId, pageable)
            .map(user -> new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getBio(),
                user.getFollowers().size(),
                user.getFollowing().size()
            ));
    }

    public boolean isFollowing(Long currentUserId, Long targetUserId) {
        return userRepository.existsByIdAndFollowing_Id(currentUserId, targetUserId);
    }

    





}
