package com.productservice.controllers;

import com.productservice.controllers.dto.ProductDTO;
import com.productservice.controllers.dto.QuantityUpdate;
import com.productservice.models.ProductModel;
import com.productservice.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/product")
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductModel> createProduct(@RequestBody ProductModel product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(product));
    }

    @GetMapping
    public ResponseEntity<List<ProductModel>> getAllProducts() {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> getProduct(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(productService.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductModel> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO){
        ProductModel productFound = productService.get(id);
        BeanUtils.copyProperties(productDTO, productFound);
        ProductModel productUpdated = productService.create(productFound);
        return ResponseEntity.status(HttpStatus.OK).body(productUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id){
        productService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("product deleted");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductModel> purchase(@PathVariable Long id, @RequestBody QuantityUpdate quantityUpdate){
        ProductModel productUpdated = productService.updateQuantity(id, quantityUpdate);
        return ResponseEntity.status(HttpStatus.OK).body(productUpdated);
    }
}
