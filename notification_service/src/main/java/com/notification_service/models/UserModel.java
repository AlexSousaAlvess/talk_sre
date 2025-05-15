package com.notification_service.models;

import com.notification_service.models.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_user", schema = "sre")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
}