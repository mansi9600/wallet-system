package com.mansi.wallet_system.repository;

import com.mansi.wallet_system.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

}