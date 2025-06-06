package com.devconnect.devconnect.controller;

import com.devconnect.devconnect.dto.PostRequestDTO;
import com.devconnect.devconnect.dto.PostResponseDTO;
import com.devconnect.devconnect.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostRequestDTO dto,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.createPost(userDetails.getUsername(), dto));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @AuthenticationPrincipal UserDetails userDetails) {
        
        String currentUserEmail = userDetails != null ? userDetails.getUsername() : null;

        return ResponseEntity.ok(postService.getAllPosts(pageable, currentUserEmail));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, Principal principal) {
        
        postService.likePost(postId, principal.getName());
        return ResponseEntity.ok("Post liked");
    }

    @PostMapping("/{postId}/unlike")
    public ResponseEntity<String> unlikePost(@PathVariable Long postId, Principal principal) {
        postService.unlikePost(postId, principal.getName());
        return ResponseEntity.ok("Post unliked");
    }

}
