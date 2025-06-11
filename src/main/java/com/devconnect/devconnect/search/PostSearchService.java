package com.devconnect.devconnect.search;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostSearchService {

    private final ElasticsearchClient client;

    public void indexPost(PostDocument doc) {
        try {
            IndexResponse response = client.index(IndexRequest.of(i -> i
                .index("posts") // index name
                .id(doc.getId())
                .document(doc)
            ));
            System.out.println("Indexed post with ID: " + response.id());
        } catch (ElasticsearchException | IOException e) {
            e.printStackTrace();
        }
    }
    public List<PostDocument> searchPosts(String keyword) throws IOException {
        SearchResponse<PostDocument> response = client.search(s -> s
            .index("posts")
            .query(q -> q
                .match(m -> m
                    .field("content")
                    .query(keyword)
                )
            ),
            PostDocument.class
        );

        return response.hits().hits().stream()
            .map(Hit::source)
            .collect(Collectors.toList());
    }
}
