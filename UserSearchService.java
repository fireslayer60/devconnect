package com.devconnect.devconnect.service;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import lombok.RequiredArgsConstructor;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.*;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.search.suggest.*;
import org.elasticsearch.search.suggest.completion.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserSearchService {

    private final RestHighLevelClient client;

    public void indexUser(String id, String username) throws IOException {
        String json = """
            {
              "username": "%s",
              "suggest": {
                "input": ["%s"]
              }
            }
            """.formatted(username, username);

        IndexRequest request = new IndexRequest("users")
            .id(id)
            .source(json, XContentType.JSON);

        client.index(request, RequestOptions.DEFAULT);
    }

    public List<String> autocompleteUser(String prefix) throws IOException {
        CompletionSuggestionBuilder suggestionBuilder = SuggestBuilders
            .completionSuggestion("suggest")
            .prefix(prefix)
            .skipDuplicates(true)
            .size(5);

        SuggestBuilder suggestBuilder = new SuggestBuilder()
            .addSuggestion("user-suggest", suggestionBuilder);

        SearchRequest searchRequest = new SearchRequest("users")
            .source(new org.elasticsearch.search.builder.SearchSourceBuilder().suggest(suggestBuilder));

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

        CompletionSuggestion suggestion =
            response.getSuggest().getSuggestion("user-suggest");

        return suggestion.getEntries().stream()
            .flatMap(entry -> entry.getOptions().stream())
            .map(option -> option.getText().string())
            .collect(toList());
    }
}
