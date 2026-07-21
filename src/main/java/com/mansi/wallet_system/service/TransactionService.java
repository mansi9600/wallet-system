package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        transaction.setTransactionTime(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByWalletId(Long walletId) {
        return transactionRepository.findByFromWalletIdOrToWalletId(walletId, walletId);
    }
}