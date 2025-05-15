package com.productservice.controllers;

import com.productservice.models.PurchaseModel;
import com.productservice.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final PurchaseService purchaseService;

    @GetMapping()
    public ResponseEntity<Double> quantitySale(){
        return ResponseEntity.status(HttpStatus.OK).body(purchaseService.get());
    }
}
