package gem.banking.models;

import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.exceptions.InsufficientFundsException;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Slf4j
public class AccountInfo {
    @Getter
    String accountName;

    // track list of transactions
    List<Transaction> transactionHistory = new ArrayList<>();

    // track current balance for account
    Double balance = 0.0;

    public AccountInfo(String accountName) {
        this.accountName = accountName;
    }

    public double getBalance() {
        return balance;
    }

    // return immutable array of transactions
    public List<Transaction> getTransactionHistory() {
        return Collections.unmodifiableList(transactionHistory);
    }

    public void recordTransaction(Transaction transaction) throws InsufficientFundsException, InvalidTransactionException {
        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");

        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }

        if (transaction.getTransactionType() == Transaction.TransactionType.DEPOSIT) {
            transactionHistory.add(transaction);
            balance += transaction.getAmount();
        } else if (transaction.getTransactionType() == Transaction.TransactionType.WITHDRAWAL) {
            if (balance - transaction.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", balance));
            }
            transactionHistory.add(transaction);
            balance -= transaction.getAmount();
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        log.debug("Transaction memo:" + transaction.getMemo() + " - Amount: " + transaction.getTransactionType() + " - New Balance: " + balance);
    }
}
