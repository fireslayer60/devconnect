package com.devconnect.devconnect.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devconnect.devconnect.dto.CommentRequestDTO;
import com.devconnect.devconnect.dto.CommentResponseDTO;
import com.devconnect.devconnect.service.CommentService;
import org.springframework.data.domain.Sort;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(@PathVariable Long postId,
                                                          @RequestBody CommentRequestDTO dto,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(commentService.addComment(postId, userDetails.getUsername(), dto));
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponseDTO>> getComments(
        @PathVariable Long postId,
        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId, pageable));
    }
}

