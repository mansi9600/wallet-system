package com.mansi.wallet_system.controller;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{walletId}")
    public List<Transaction> getTransactionsByWalletId(@PathVariable Long walletId) {
        return transactionService.getTransactionsByWalletId(walletId);
    }
}
