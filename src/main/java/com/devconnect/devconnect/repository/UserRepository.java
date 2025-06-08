package com.devconnect.devconnect.repository;
import com.devconnect.devconnect.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    @Query("""
        SELECT u FROM User u
        JOIN u.following f
        WHERE f.id = :userId
        ORDER BY SIZE(u.followers) DESC
        """)
    Page<User> findFollowersSortedByFollowerCount(@Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT u FROM User u
        JOIN u.followers f
        WHERE f.id = :userId
        ORDER BY SIZE(u.followers) DESC
        """)
    Page<User> findFollowingSortedByFollowerCount(@Param("userId") Long userId, Pageable pageable);

    boolean existsByIdAndFollowing_Id(Long currentUserId, Long targetUserId);


}