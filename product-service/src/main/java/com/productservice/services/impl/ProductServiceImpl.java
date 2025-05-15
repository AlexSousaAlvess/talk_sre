package com.productservice.services.impl;

import com.productservice.controllers.dto.QuantityUpdate;
import com.productservice.models.ProductModel;
import com.productservice.models.PurchaseModel;
import com.productservice.repositories.ProductRepository;
import com.productservice.repositories.PurchaseRepository;
import com.productservice.services.NotificationService;
import com.productservice.services.ProductService;
import com.productservice.services.impl.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;
    private final NotificationService notificationService;

    @Override
    public ProductModel create(ProductModel product) {
        return productRepository.save(product);
    }

    @Override
    public List<ProductModel> getAll() {
        return productRepository.findAll();
    }

    @Override
    public ProductModel get(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public ProductModel updateQuantity(Long id, QuantityUpdate quantityUpdate) {
        ProductModel productModel = productRepository.findById(id).orElseThrow();
        productModel.setQuantity(productModel.getQuantity() - quantityUpdate.getQuantity());

        PurchaseModel purchaseModel = new PurchaseModel();
        purchaseModel.setPurchase(productModel.getPrice());
        purchaseRepository.save(purchaseModel);

        String message = "Produto " + productModel.getName() + " foi comprado. Valor: R$ " + productModel.getPrice();
        notificationService.sendNotification(new NotificationRequest(quantityUpdate.getUserId(), message));

        return productRepository.save(productModel);
    }
}
