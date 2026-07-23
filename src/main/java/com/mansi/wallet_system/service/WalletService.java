package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.repository.TransactionRepository;
import com.mansi.wallet_system.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Wallet createWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    @Cacheable(value = "wallets", key = "#id")
    public Wallet getWalletById(Long id) {
        return walletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    @CacheEvict(value = "wallets", key = "#wallet.id")
    public Wallet updateWallet(Wallet wallet) {
        return walletRepository.save(wallet);
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

        // Save transaction automatically
        Transaction transaction = new Transaction();
        transaction.setFromWalletId(senderId);
        transaction.setToWalletId(receiverId);
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");
        transaction.setTransactionTime(LocalDateTime.now());

        transactionRepository.save(transaction);

        return "Transfer Successful";
    }
}