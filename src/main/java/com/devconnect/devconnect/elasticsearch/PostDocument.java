package com.devconnect.devconnect.elasticsearch;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.CompletionField;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.core.suggest.Completion;

@Document(indexName = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDocument {

    @Id
    private String id;

    private String content;
    private String username;
    private String imageUrl;

    @CompletionField
    private Completion suggest;
}
