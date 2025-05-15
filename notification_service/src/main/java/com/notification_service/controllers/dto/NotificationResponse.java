package com.notification_service.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationResponse {
    private Long id;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
}
