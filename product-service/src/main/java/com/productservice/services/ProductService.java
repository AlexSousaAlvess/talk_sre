package com.productservice.services;

import com.productservice.controllers.dto.QuantityUpdate;
import com.productservice.models.ProductModel;

import java.util.List;

public interface ProductService {
    ProductModel create(ProductModel product);

    List<ProductModel> getAll();

    ProductModel get(Long id);

    void delete(Long id);

    ProductModel updateQuantity(Long id, QuantityUpdate quantityUpdate);
}
