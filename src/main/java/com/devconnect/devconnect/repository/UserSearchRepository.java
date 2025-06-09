package com.devconnect.devconnect.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.devconnect.devconnect.elasticsearch.UserDocument;

import java.util.List;

public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, String> {
    List<UserDocument> findByUsernameContainingIgnoreCase(String username);
}
