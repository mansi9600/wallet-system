package com.mansi.wallet_system.service;

import com.mansi.wallet_system.entity.Transaction;
import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.repository.TransactionRepository;
import com.mansi.wallet_system.repository.WalletRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private WalletService walletService;

    @Test
    void testTransferMoneySuccess() {

        Wallet sender = new Wallet();
        sender.setBalance(5000.0);

        Wallet receiver = new Wallet();
        receiver.setBalance(2000.0);

        when(walletRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(receiver));

        String result = walletService.transferMoney(1L, 2L, 1000.0);

        assertEquals("Transfer Successful", result);
        assertEquals(4000.0, sender.getBalance());
        assertEquals(3000.0, receiver.getBalance());

        verify(walletRepository, times(2)).save(any(Wallet.class));
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
}
