package com.devconnect.devconnect.dto;



public record UserProfileDTO(
    Long id,
    String username,
    String bio,
    int followerCount,
    int followingCount
) {}

