package gem.banking.services;

import gem.banking.exceptions.AccountExistsException;
import gem.banking.exceptions.AccountInvalidException;
import gem.banking.exceptions.InsufficientFundsException;
import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
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
