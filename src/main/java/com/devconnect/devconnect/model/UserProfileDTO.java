package com.devconnect.devconnect.model;



public record UserProfileDTO(
    Long id,
    String username,
    String bio,
    int followerCount,
    int followingCount
) {}

