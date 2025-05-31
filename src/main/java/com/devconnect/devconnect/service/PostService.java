package com.devconnect.devconnect.service;

import com.devconnect.devconnect.dto.PostRequestDTO;
import com.devconnect.devconnect.dto.PostResponseDTO;
import com.devconnect.devconnect.model.Post;
import com.devconnect.devconnect.model.User;
import com.devconnect.devconnect.repository.PostRepository;
import com.devconnect.devconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponseDTO createPost(String userEmail, PostRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        Post post = Post.builder()
                .content(dto.content())
                .imageUrl(dto.imageUrl())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Post saved = postRepository.save(post);

        return new PostResponseDTO(saved.getId(), saved.getContent(), saved.getImageUrl(),
                saved.getCreatedAt(), saved.getUser().getUsername());
    }

    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(p -> new PostResponseDTO(p.getId(), p.getContent(), p.getImageUrl(),
                        p.getCreatedAt(), p.getUser().getUsername()))
                .collect(Collectors.toList());
    }
}
