package com.mansi.wallet_system.controller;

import com.mansi.wallet_system.dto.ApiResponse;
import com.mansi.wallet_system.dto.TransferRequest;
import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.service.IdempotencyService;
import com.mansi.wallet_system.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private IdempotencyService idempotencyService;

    // Create wallet
    @PostMapping
    public ApiResponse<Wallet> createWallet(@Valid @RequestBody Wallet wallet) {
        Wallet savedWallet = walletService.createWallet(wallet);

        return new ApiResponse<>(
                true,
                "Wallet created successfully",
                savedWallet
        );
    }

    // Get all wallets
    @GetMapping
    public ApiResponse<List<Wallet>> getAllWallets() {
        List<Wallet> wallets = walletService.getAllWallets();

        return new ApiResponse<>(
                true,
                "Wallets fetched successfully",
                wallets
        );
    }

    // Get wallet by id
    @GetMapping("/{id}")
    public ApiResponse<Wallet> getWalletById(@PathVariable Long id) {
        Wallet wallet = walletService.getWalletById(id);

        return new ApiResponse<>(
                true,
                "Wallet fetched successfully",
                wallet
        );
    }

    // Transfer money
    @PostMapping("/transfer")
    public ApiResponse<Transaction> transferMoney(
            @RequestHeader(value = "Idempotency-Key", required = true)
            String idempotencyKey,
            @Valid @RequestBody TransferRequest request) {

        if (idempotencyService.isDuplicate(idempotencyKey)) {
            return new ApiResponse<>(
                    true,
                    "Duplicate request ignored",
                    null
            );
        }

        Transaction result = walletService.transferMoney(
                request.getSenderWalletId(),
                request.getReceiverWalletId(),
                request.getAmount()
        );

        return new ApiResponse<>(
                true,
                "Transfer completed successfully",
                result
        );
    }

}