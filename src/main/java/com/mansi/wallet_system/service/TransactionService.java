package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    // Pagination + Sorting
    public Page<Transaction> getTransactionsByWalletId(Long walletId, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("transactionTime").descending()
        );

        return transactionRepository.findByFromWalletIdOrToWalletId(
                walletId,
                walletId,
                pageable
        );
    }
}