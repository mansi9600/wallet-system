package com.mansi.wallet_system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mansi.wallet_system.dto.TransferRequest;
import com.mansi.wallet_system.entity.Wallet;
import com.mansi.wallet_system.security.SecurityConfig;
import com.mansi.wallet_system.service.WalletService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WalletController.class)
@Import(SecurityConfig.class)
class WalletControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WalletService walletService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateWallet() throws Exception {

        Wallet wallet = new Wallet();
        wallet.setOwnerName("Mansi");
        wallet.setBalance(5000.0);

        when(walletService.createWallet(any(Wallet.class))).thenReturn(wallet);

        mockMvc.perform(post("/wallets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wallet)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ownerName").value("Mansi"))
                .andExpect(jsonPath("$.balance").value(5000.0));
    }

    @Test
    void testGetAllWallets() throws Exception {

        Wallet wallet = new Wallet();
        wallet.setOwnerName("Mansi");
        wallet.setBalance(5000.0);

        when(walletService.getAllWallets()).thenReturn(Arrays.asList(wallet));

        mockMvc.perform(get("/wallets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ownerName").value("Mansi"));
    }

    @Test
    void testTransferMoney() throws Exception {

        TransferRequest request = new TransferRequest();
        request.setSenderWalletId(1L);
        request.setReceiverWalletId(2L);
        request.setAmount(1000.0);

        when(walletService.transferMoney(1L, 2L, 1000.0))
                .thenReturn("Transfer Successful");

        mockMvc.perform(post("/wallets/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Transfer Successful"));
    }
}