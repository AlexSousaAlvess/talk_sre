package com.productservice.services.impl;

import com.productservice.models.PurchaseModel;
import com.productservice.repositories.PurchaseRepository;
import com.productservice.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PurchaseServiceImpl implements PurchaseService {
    private final PurchaseRepository purchaseRepository;

    @Override
    public Double get() {
        return purchaseRepository.getTotalSales();
    }
}
