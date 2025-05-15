package com.productservice.services;

import com.productservice.services.impl.dto.NotificationRequest;
import org.springframework.boot.web.client.RestTemplateBuilder;

public interface NotificationService {

    void sendNotification(NotificationRequest request);
}
