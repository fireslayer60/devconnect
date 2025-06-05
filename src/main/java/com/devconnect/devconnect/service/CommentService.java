package com.devconnect.devconnect.service;

import java.time.LocalDateTime;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.devconnect.devconnect.dto.CommentRequestDTO;
import com.devconnect.devconnect.dto.CommentResponseDTO;
import com.devconnect.devconnect.model.Comment;
import com.devconnect.devconnect.model.Post;
import com.devconnect.devconnect.model.User;
import com.devconnect.devconnect.repository.CommentRepository;
import com.devconnect.devconnect.repository.PostRepository;
import com.devconnect.devconnect.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public CommentResponseDTO addComment(Long postId, String email, CommentRequestDTO dto) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();

        Comment comment = Comment.builder()
                .content(dto.content())
                .createdAt(LocalDateTime.now())
                .user(user)
                .post(post)
                .build();

        Comment saved = commentRepository.save(comment);

        return new CommentResponseDTO(saved.getId(), saved.getContent(), user.getUsername(), saved.getCreatedAt());
    }

    public Page<CommentResponseDTO> getCommentsForPost(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable)
                .map(c -> new CommentResponseDTO(
                    c.getId(),
                    c.getContent(),
                    c.getUser().getUsername(),
                    c.getCreatedAt()
                ));
    }
}
