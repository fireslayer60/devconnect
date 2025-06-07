package com.devconnect.devconnect.controller;

import com.devconnect.devconnect.dto.LoginRequestDTO;
import com.devconnect.devconnect.dto.UserRequestDTO;
import com.devconnect.devconnect.dto.UserResponseDTO;
import com.devconnect.devconnect.model.UserProfileDTO;
import com.devconnect.devconnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public UserResponseDTO createUser(@Valid @RequestBody UserRequestDTO dto) {
        return userService.createUser(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>>  login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return userService.login(loginRequestDTO);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @PostMapping("/{userId}/follow")
    public ResponseEntity<String> follow(@PathVariable Long userId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        userService.followUser(userDetails.getUsername(), userId);
        return ResponseEntity.ok("Followed user");
    }

    @PostMapping("/{userId}/unfollow")
    public ResponseEntity<String> unfollow(@PathVariable Long userId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        userService.unfollowUser(userDetails.getUsername(), userId);
        return ResponseEntity.ok("Unfollowed user");
    }
    @GetMapping("/{userId}/followers")
    public ResponseEntity<Page<UserProfileDTO>> getFollowers(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(userService.getFollowersSorted(userId, pageable));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<Page<UserProfileDTO>> getFollowing(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(userService.getFollowingSorted(userId, pageable));
    }




}

