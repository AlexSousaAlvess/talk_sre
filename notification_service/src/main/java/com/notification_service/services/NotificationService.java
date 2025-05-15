package com.notification_service.services;

import com.notification_service.controllers.dto.NotificationRequest;
import com.notification_service.models.NotificationModel;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.List;

public interface NotificationService {
    void createAndSendNotification(String message, List<SseEmitter> emitters);

    void save(NotificationRequest request);

    List<NotificationModel> findAll();

    List<NotificationModel> findByUser(Long UserId);

    List<NotificationModel> findAllByUserId(Long id);

    long countByUserIdAndReadFalse(Long userId);
}
