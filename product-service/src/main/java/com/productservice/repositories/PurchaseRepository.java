package com.productservice.repositories;

import com.productservice.models.PurchaseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseRepository extends JpaRepository<PurchaseModel, Long> {

    @Query("SELECT COALESCE(SUM(p.purchase),0) FROM PurchaseModel p")
    Double getTotalSales();
}
