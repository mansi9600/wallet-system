package com.mansi.wallet_system.dto;

public class TransferResponse {

    private String message;
    private Double senderBalance;
    private Double receiverBalance;

    public TransferResponse() {
    }

    public TransferResponse(String message, Double senderBalance, Double receiverBalance) {
        this.message = message;
        this.senderBalance = senderBalance;
        this.receiverBalance = receiverBalance;
    }

    public String getMessage() {
        return message;
    }

    public Double getSenderBalance() {
        return senderBalance;
    }

    public Double getReceiverBalance() {
        return receiverBalance;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setSenderBalance(Double senderBalance) {
        this.senderBalance = senderBalance;
    }

    public void setReceiverBalance(Double receiverBalance) {
        this.receiverBalance = receiverBalance;
    }
}