package com.notification_service.repositories;

import com.notification_service.models.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findAllByUserId(Long userId);

    Long countByUserIdAndReadFalse(Long userId);
}
