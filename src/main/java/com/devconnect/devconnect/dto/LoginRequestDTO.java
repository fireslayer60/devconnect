package com.devconnect.devconnect.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public record LoginRequestDTO (
    @Email String email,
    @NotBlank String password
){}
