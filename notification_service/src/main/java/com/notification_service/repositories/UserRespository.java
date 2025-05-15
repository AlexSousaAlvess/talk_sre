package com.notification_service.repositories;

import com.notification_service.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<UserModel, Long> {
}
