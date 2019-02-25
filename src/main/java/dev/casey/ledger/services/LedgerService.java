package dev.casey.ledger.services;

import dev.casey.ledger.exceptions.AccountExistsException;
import dev.casey.ledger.exceptions.AccountInvalidException;
import dev.casey.ledger.exceptions.InsufficientFundsException;
import dev.casey.ledger.exceptions.InvalidTransactionException;
import dev.casey.ledger.models.AccountInfo;
import dev.casey.ledger.models.Transaction;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LedgerService {
    private Map<String, AccountInfo> accounts = new HashMap<>();

    public AccountInfo getAccount(String accountName) throws AccountInvalidException {
        AccountInfo account = accounts.get(accountName);
        if (account == null) throw new AccountInvalidException(accountName + " account not valid.");
        return account;
    }

    public void createAccount(String accountName) throws AccountExistsException {
        if (accounts.get(accountName) != null) {
            throw new AccountExistsException();
        }
        accounts.put(accountName, new AccountInfo(accountName));
    }

    public void recordTransaction(String accountName, Transaction transaction) throws AccountInvalidException, InsufficientFundsException, InvalidTransactionException {
        getAccount(accountName).recordTransaction(transaction);
    }
}
