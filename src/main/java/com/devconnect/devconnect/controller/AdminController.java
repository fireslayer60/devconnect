package com.devconnect.devconnect.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devconnect.devconnect.service.PostService;
import com.devconnect.devconnect.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final PostService postService;

    @PostMapping("/reindex-users")
    public ResponseEntity<String> reindexUsers() throws IOException {
        userService.indexAllUsers();
        return ResponseEntity.ok("Users reindexed.");
    }

    @PostMapping("/reindex-posts")
    public ResponseEntity<String> reindexPosts() throws IOException {
        postService.indexAllPosts();
        return ResponseEntity.ok("Posts reindexed.");
    }
}
