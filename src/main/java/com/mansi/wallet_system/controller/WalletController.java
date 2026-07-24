package com.mansi.wallet_system.controller;

import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.mansi.wallet_system.dto.TransferRequest;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;
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
    public String transferMoney(@Valid @RequestBody TransferRequest request) {

        return walletService.transferMoney(
                request.getSenderWalletId(),
                request.getReceiverWalletId(),
                request.getAmount()
        );
    }
}
