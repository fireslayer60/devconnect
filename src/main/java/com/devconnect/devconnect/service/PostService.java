package com.devconnect.devconnect.service;

import com.devconnect.devconnect.dto.PostRequestDTO;
import com.devconnect.devconnect.dto.PostResponseDTO;

import com.devconnect.devconnect.model.Post;
import com.devconnect.devconnect.model.User;
import com.devconnect.devconnect.repository.PostRepository;

import com.devconnect.devconnect.repository.UserRepository;
import com.devconnect.devconnect.search.PostDocument;
import com.devconnect.devconnect.search.PostSearchService;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class PostService {


    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostSearchService postSearchService;
    private ElasticsearchClient elasticsearchClient;
   
  

    public PostResponseDTO createPost(String userEmail, PostRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        Post post = Post.builder()
                .content(dto.content())
                .imageUrl(dto.imageUrl())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        

        Post saved = postRepository.save(post);
        postSearchService.indexPost(new PostDocument(
                saved.getId().toString(),
                saved.getContent(),
                saved.getUser().getUsername()
        ));

        

        return new PostResponseDTO(saved.getId(), saved.getContent(), saved.getImageUrl(),
                saved.getCreatedAt(), saved.getUser().getUsername(),saved.getUser().getId(),0,false);
    }
    public void indexAllPosts() throws IOException {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
                PostDocument doc = PostDocument.builder()
                .id(post.getId().toString())
                .content(post.getContent())
                .username(post.getUser().getUsername())
                .build();

                Post saved = postRepository.save(post);
                postSearchService.indexPost(new PostDocument(
                        saved.getId().toString(),
                        saved.getContent(),
                        saved.getUser().getUsername()
                ));
        }
        }


    public Page<PostResponseDTO> getAllPosts(Pageable pageable, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        return postRepository.findAll(pageable)
                .map(p -> {
                boolean likedByCurrentUser = currentUser != null && p.getLikedByUsers().contains(currentUser);

                return new PostResponseDTO(
                        p.getId(),
                        p.getContent(),
                        p.getImageUrl(),
                        p.getCreatedAt(),
                        p.getUser().getUsername(),
                        p.getUser().getId(),
                        p.getLikedByUsers().size(),
                        likedByCurrentUser
                );
                });
        }

     public PostResponseDTO getPostById(Long Id,String currentUserEmail){
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
      
        Post p = postRepository.findById(Id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        boolean likedByCurrentUser = currentUser != null && p.getLikedByUsers().contains(currentUser);
        return new PostResponseDTO(
                        p.getId(),
                        p.getContent(),
                        p.getImageUrl(),
                        p.getCreatedAt(),
                        p.getUser().getUsername(),
                        p.getUser().getId(),
                        p.getLikedByUsers().size(),
                        likedByCurrentUser
                );
     }

    public void likePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        user.getLikedPosts().add(post);
        userRepository.save(user); // or postRepository.save(post);
        }

    public void unlikePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        user.getLikedPosts().remove(post);
        userRepository.save(user);
        }




}
