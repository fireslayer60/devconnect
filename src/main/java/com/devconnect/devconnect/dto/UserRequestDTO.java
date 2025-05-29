package com.devconnect.devconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO(
    @NotBlank String username,
    @Email String email,
    @NotBlank String password,
    String bio
) {}
