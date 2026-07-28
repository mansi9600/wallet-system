package com.mansi.wallet_system.controller;

import com.mansi.wallet_system.dto.TransferRequest;
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

    @PostMapping
    public Wallet createWallet(@Valid @RequestBody Wallet wallet) {
        return walletService.createWallet(wallet);
    }

    @GetMapping
    public List<Wallet> getAllWallets() {
        return walletService.getAllWallets();
    }

    @GetMapping("/{id}")
    public Wallet getWalletById(@PathVariable Long id) {
        return walletService.getWalletById(id);
    }

    @PostMapping("/transfer")
    public String transferMoney(
            @RequestHeader(value = "Idempotency-Key", required = true)
            String idempotencyKey,
            @Valid @RequestBody TransferRequest request) {

        if (idempotencyService.isDuplicate(idempotencyKey)) {
            return "Duplicate request ignored";
        }

        return walletService.transferMoney(
                request.getSenderWalletId(),
                request.getReceiverWalletId(),
                request.getAmount()
        );
    }
}