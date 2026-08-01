package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.repository.TransactionRepository;
import com.mansi.wallet_system.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletService {
    private static final Logger logger = LoggerFactory.getLogger(WalletService.class);
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

    @Transactional(noRollbackFor = RuntimeException.class)
    public Transaction transferMoney(Long fromWalletId, Long toWalletId, Double amount) {

        // Transfer start log
        logger.info("Transfer started: fromWallet={}, toWallet={}, amount={}",
                fromWalletId, toWalletId, amount);

        Wallet fromWallet = walletRepository.findById(fromWalletId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet toWallet = walletRepository.findById(toWalletId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (fromWallet.getBalance() < amount) {

            // Transfer failed log
            logger.warn("Transfer failed: fromWallet={}, toWallet={}, amount={}, reason=Insufficient balance",
                    fromWalletId, toWalletId, amount);

            throw new RuntimeException("Insufficient balance");
        }

        fromWallet.setBalance(fromWallet.getBalance() - amount);
        toWallet.setBalance(toWallet.getBalance() + amount);

        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        Transaction transaction = new Transaction();
        transaction.setFromWalletId(fromWalletId);
        transaction.setToWalletId(toWalletId);
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Transfer success log
        logger.info("Transfer successful: fromWallet={}, toWallet={}, amount={}",
                fromWalletId, toWalletId, amount);

        return savedTransaction;
    }
}