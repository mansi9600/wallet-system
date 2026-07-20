package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    public Wallet createWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }
    public String transferMoney(Long senderId, Long receiverId, Double amount) {

        Wallet sender = walletRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiver = walletRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (sender.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        walletRepository.save(sender);
        walletRepository.save(receiver);

        return "Transfer Successful";
    }
}