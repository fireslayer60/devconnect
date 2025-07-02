package com.devconnect.devconnect.controller;

import com.devconnect.devconnect.dto.PostRequestDTO;
import com.devconnect.devconnect.dto.PostResponseDTO;
import com.devconnect.devconnect.search.PostDocument;
import com.devconnect.devconnect.search.PostSearchService;
import com.devconnect.devconnect.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
   
    private final PostService postService;
    private final PostSearchService postSearchService;
    
   

    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostRequestDTO dto,
                                                      @AuthenticationPrincipal UserDetails userDetails) {



        return ResponseEntity.ok(postService.createPost(userDetails.getUsername(), dto));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
        @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @AuthenticationPrincipal UserDetails userDetails) {
        
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
    @GetMapping("/get/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId, Principal principal) {
        //TODO: process POST request
        
        
        return ResponseEntity.ok(postService.getPostById(postId, principal.getName()));
    }
    
    @GetMapping("/posts")
    public ResponseEntity<List<PostDocument>> searchPosts(@RequestParam String q) throws IOException {
        return ResponseEntity.ok(postSearchService.searchPosts(q));
    }
    

    


}
