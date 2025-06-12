package com.devconnect.devconnect.search;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSearchService {
    
    
    private final ElasticsearchClient client;

    public void indexUser(UserDocument doc) {
        try {
            IndexResponse response = client.index(IndexRequest.of(i -> i
                .index("username") // index name
                .id(doc.getId())
                .document(doc)
            ));
            System.out.println("Indexed usernames with ID: " + response.id());
        } catch (ElasticsearchException | IOException e) {
            e.printStackTrace();
        }
    }

    public List<UserDocument> searchUsers(String keyword) throws IOException {
        SearchResponse<UserDocument> response = client.search(s -> s
            .index("username")
            .query(q -> q
                .match(m -> m
                    .field("username")
                    .query(keyword)
                )
            ),
            UserDocument.class
        );

        return response.hits().hits().stream()
            .map(Hit::source)
            .collect(Collectors.toList());
    }

}
