package com.notification_service.controllers;

import com.notification_service.controllers.dto.NotificationRequest;
import com.notification_service.controllers.dto.NotificationResponse;
import com.notification_service.models.NotificationModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.notification_service.services.NotificationService;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/stream")
    public SseEmitter stream() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendNotification(@RequestBody NotificationRequest request) {
        System.out.println("Mensagem recebida: " + request.getMessage() + request.getUserId());
        notificationService.save(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<NotificationModel>> getAll(){
        return ResponseEntity.status(HttpStatus.OK).body(notificationService.findAll());
    }

    @GetMapping("/by-user/{id}")
    public ResponseEntity<List<NotificationResponse>> getByUser(@PathVariable Long id){
        List<NotificationModel> notifications = notificationService.findByUser(id);

        List<NotificationResponse> response = notifications.stream()
                .map(n->new NotificationResponse(
                n.getId(),
                n.getMessage(),
                n.getRead(),
                n.getCreatedAt()
                )).toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.countByUserIdAndReadFalse(userId);
        return ResponseEntity.ok(count);
    }

}
