package com.devconnect.devconnect.dto;

import java.time.LocalDateTime;

public record PostResponseDTO(Long id, String content, String imageUrl, LocalDateTime createdAt, String username,Long userId, int likeCount, boolean likedByCurrentUser) {
}
