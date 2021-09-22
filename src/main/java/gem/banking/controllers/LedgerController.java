package gem.banking.controllers;

import gem.banking.models.Account;
import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
import gem.banking.services.AuthenticationService;
import gem.banking.services.LedgerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api")
@Slf4j
public class LedgerController {
    @Autowired
    LedgerService ledgerService;

    @Autowired
    AuthenticationService authenticationService;

    @GetMapping("/transactions")
    public List<Transaction> retrieveTransactionHistory() throws Exception  {
        return ledgerService.getAccount(authenticationService.getCurrentUser()).getTransactionHistory();
    }

    @GetMapping("/account")
    public AccountInfo retrieveAccount() throws Exception  {
        return ledgerService.getAccount(authenticationService.getCurrentUser());
    }

    @PostMapping("/transactions")
    public ResponseEntity<Void> createTransaction(@RequestBody Transaction createTransactionRequest) throws Exception {
        ledgerService.recordTransaction(authenticationService.getCurrentUser(), createTransactionRequest);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/account")
    public ResponseEntity<Void> createAccount(@RequestBody Account createAccountRequest) throws Exception {
        authenticationService.createUser(createAccountRequest.getUsername(), createAccountRequest.getPassword());
        ledgerService.createAccount(createAccountRequest.getUsername());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/balance")
        public Map<String, Double> getAccountInfo() throws Exception  {
            AccountInfo accountInfo = ledgerService.getAccount(authenticationService.getCurrentUser());

            Map<String, Double> response = new HashMap<String, Double>() {
                {
                    put("balance", accountInfo.getBalance());
                }
            };

            return response;
        }

    @PostMapping(value = "/login")
    public ResponseEntity<Void> login(@RequestBody Account loginAccountRequest, final HttpServletRequest request) {
        authenticationService.login(request, loginAccountRequest.getUsername(), loginAccountRequest.getPassword());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
        authenticationService.logout();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
