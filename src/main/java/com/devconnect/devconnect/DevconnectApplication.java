package com.devconnect.devconnect;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class DevconnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevconnectApplication.class, args);
    }

    @Bean
    CommandLineRunner printDbUrl(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("📌 Connected to DB: " + conn.getMetaData().getURL());
            }
        };
    }
}
