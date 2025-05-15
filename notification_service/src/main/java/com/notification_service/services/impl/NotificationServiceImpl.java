package com.notification_service.services.impl;

import com.notification_service.controllers.dto.NotificationRequest;
import com.notification_service.models.NotificationModel;
import com.notification_service.models.UserModel;
import com.notification_service.repositories.NotificationRepository;
import com.notification_service.repositories.UserRespository;
import com.notification_service.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRespository userRepository;

    @Override
    public void createAndSendNotification(String message, List<SseEmitter> emitters) {
        UserModel user = getOperatorUser();

        NotificationModel notification = NotificationModel.builder()
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        notificationRepository.save(notification);

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(message));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }

    @Override
    public void save(NotificationRequest request) {
        System.out.println("Recebendo request: "+request);

        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(()-> new RuntimeException(("Usuario nao encontrado")));

        System.out.println("Buscando usuário ID: " + user.getName());

        NotificationModel notification = NotificationModel.builder()
                .message(request.getMessage())
                .read(false)
                .user(user)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationModel> findAll() {
        return null;
    }

    @Override
    public List<NotificationModel> findByUser(Long userId) {
        return notificationRepository.findAllByUserId(userId);
    }

    @Override
    public List<NotificationModel> findAllByUserId(Long id) {
        return null;
    }

    @Override
    public long countByUserIdAndReadFalse(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private UserModel getOperatorUser() {
        return new UserModel();
    }
}
