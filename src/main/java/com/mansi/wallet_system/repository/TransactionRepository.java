package com.mansi.wallet_system.repository;

import com.mansi.wallet_system.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByFromWalletIdOrToWalletId(
            Long fromWalletId,
            Long toWalletId,
            Pageable pageable
    );
}
