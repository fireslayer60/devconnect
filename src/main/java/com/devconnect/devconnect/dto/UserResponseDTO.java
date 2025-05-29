package com.devconnect.devconnect.dto;

public record UserResponseDTO(
    Long id,
    String username,
    String email,
    String bio
) {}
