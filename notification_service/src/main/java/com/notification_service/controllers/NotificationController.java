package com.notification_service.controllers;

import com.notification_service.controllers.dto.NotificationRequest;
import com.notification_service.controllers.dto.NotificationResponse;
import com.notification_service.models.NotificationModel;
import com.notification_service.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final Map<Long, List<SseEmitter>> emittersByUser = new ConcurrentHashMap<>();

    @GetMapping("/stream")
    public SseEmitter stream(@RequestParam Long userId) {
        //Cria um novo SseEmitter, que representa uma conexão aberta entre servidor e navegador.
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        // guarda os emitters por usuário.
        emittersByUser.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        //Quando o cliente encerra a conexão (fecha a aba ou desconecta), essa função é executada.
        emitter.onCompletion(() -> emittersByUser.get(userId).remove(emitter));

        //Se a conexão expirar por inatividade, o emitter também é removido da lista.
        emitter.onTimeout(() -> emittersByUser.get(userId).remove(emitter));

        return emitter;
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendNotification(@RequestBody NotificationRequest request) {
        System.out.println("Mensagem recebida: " + request.getMessage() + request.getUserId());

        // salva a notificação
        NotificationModel savedNotification = notificationService.save(request);

        // conta notificações do usuário
        long unreadCount = notificationService.countByUserIdAndReadFalse(request.getUserId());

        NotificationResponse response = new NotificationResponse(
                savedNotification.getId(),
                savedNotification.getMessage(),
                savedNotification.getRead(),
                savedNotification.getCreatedAt()
        );

        //objeto que será enviado como o corpo do evento SSE
        Map<String, Object> ssePayload = new HashMap<>();
        ssePayload.put("notification", response);
        ssePayload.put("unreadCount", unreadCount);
        ssePayload.put("userId", request.getUserId());

        //Recupera a lista de SseEmitters (conexões abertas) associadas ao userId que está no request.
        List<SseEmitter> userEmitters = emittersByUser.get(request.getUserId());

        if (userEmitters != null) {
            List<SseEmitter> deadEmitters = new ArrayList<>();
            userEmitters.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name("notification")
                            .data(ssePayload));
                } catch (IOException e) {
                    //Se ocorrer algum erro (ex: o cliente fechou a aba), o emitter é adicionado à lista deadEmitters.
                    deadEmitters.add(emitter);
                }
            });
            //limpa as conexões mortas
            userEmitters.removeAll(deadEmitters);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<NotificationModel>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(notificationService.findAll());
    }

    @GetMapping("/by-user/{id}")
    public ResponseEntity<List<NotificationResponse>> getByUser(@PathVariable Long id) {
        List<NotificationModel> notifications = notificationService.findByUser(id);
        List<NotificationResponse> response = notifications.stream()
                .map(n -> new NotificationResponse(
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
