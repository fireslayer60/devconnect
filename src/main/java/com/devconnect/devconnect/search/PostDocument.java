package com.devconnect.devconnect.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDocument {
    private String id;
    private String content;
    private String username;
}
