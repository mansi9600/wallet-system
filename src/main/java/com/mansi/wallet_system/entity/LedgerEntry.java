package com.mansi.wallet_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private String type; // CREDIT or DEBIT

    private String description;

    private LocalDateTime transactionTime;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
}
