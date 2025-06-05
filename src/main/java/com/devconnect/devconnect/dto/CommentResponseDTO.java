package com.devconnect.devconnect.dto;

import java.time.LocalDateTime;

public record CommentResponseDTO(Long id, String content, String username, LocalDateTime createdAt) {
    
}
