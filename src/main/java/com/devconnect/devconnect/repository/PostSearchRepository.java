package com.devconnect.devconnect.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.devconnect.devconnect.elasticsearch.PostDocument;

import java.util.List;

public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {
    List<PostDocument> findByContentContainingIgnoreCase(String keyword);
}
