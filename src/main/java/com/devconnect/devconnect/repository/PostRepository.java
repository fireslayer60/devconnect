package com.devconnect.devconnect.repository;

import com.devconnect.devconnect.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
