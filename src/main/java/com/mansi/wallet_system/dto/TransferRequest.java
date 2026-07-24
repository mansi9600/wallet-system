package com.mansi.wallet_system.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


public class TransferRequest {

    @NotNull(message = "Sender Wallet ID is required")
    private Long senderWalletId;

    @NotNull(message = "Receiver Wallet ID is required")
    private Long receiverWalletId;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Double amount;

    public Long getSenderWalletId() {
        return senderWalletId;
    }

    public void setSenderWalletId(Long senderWalletId) {
        this.senderWalletId = senderWalletId;
    }

    public Long getReceiverWalletId() {
        return receiverWalletId;
    }

    public void setReceiverWalletId(Long receiverWalletId) {
        this.receiverWalletId = receiverWalletId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}