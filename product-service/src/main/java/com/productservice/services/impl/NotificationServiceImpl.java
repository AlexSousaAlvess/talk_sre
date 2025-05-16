package com.productservice.services.impl;

import com.productservice.services.NotificationService;
import com.productservice.services.impl.dto.NotificationRequest;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final RestTemplate restTemplate;
    private final String notificationServiceUrl = "http://localhost:8081/notifications/send";

    public NotificationServiceImpl(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @Override
    public void sendNotification(NotificationRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<NotificationRequest> entity = new HttpEntity<>(request, headers);
        //Comunica com outro backend via RestTemplate
        restTemplate.postForEntity(notificationServiceUrl, entity, Void.class);
    }
}
