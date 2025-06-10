package com.devconnect.devconnect.service;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.Suggest;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.elasticsearch.search.suggest.completion.CompletionSuggestionBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostSearchService {

    private final RestHighLevelClient elasticsearchClient;

    public List<String> autocompletePostContent(String prefix) throws Exception {
        CompletionSuggestionBuilder suggestionBuilder = SuggestBuilders
                .completionSuggestion("suggest")
                .prefix(prefix)
                .skipDuplicates(true)
                .size(5);

        SuggestBuilder suggestBuilder = new SuggestBuilder();
        suggestBuilder.addSuggestion("post-suggest", suggestionBuilder);

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.suggest(suggestBuilder);

        SearchRequest searchRequest = new SearchRequest("posts");
        searchRequest.source(sourceBuilder);

        SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

        Suggest.Suggestion<? extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>> suggest =
                response.getSuggest().getSuggestion("post-suggest");

        return suggest.getEntries().stream()
                .flatMap(entry -> entry.getOptions().stream())
                .map(option -> option.getText().string())
                .collect(Collectors.toList());
    }
}
