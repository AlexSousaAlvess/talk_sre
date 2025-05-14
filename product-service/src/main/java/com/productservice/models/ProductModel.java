package com.productservice.models;

import jakarta.persistence.*;
import lombok.*;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Data
@Entity
@Table(name = "tb_product", schema = "sre")
public class ProductModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
}
