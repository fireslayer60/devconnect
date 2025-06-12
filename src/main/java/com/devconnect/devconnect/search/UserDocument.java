package com.devconnect.devconnect.search;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDocument{
    private String id;
    private String username;
    private String bio;
}