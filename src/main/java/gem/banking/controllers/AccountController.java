package gem.banking.controllers;

import gem.banking.models.Account;
import gem.banking.services.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1")
public class AccountController {

    public AccountService accountService;

    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public String createAccount(@RequestBody Account account) throws InterruptedException, ExecutionException {
        return accountService.createAccount(account);
    }

    @GetMapping("/get")
    public Account getAccount(@RequestParam String documentId) throws InterruptedException, ExecutionException {
        return accountService.getAccount(documentId);
    }

    @PutMapping("/update")
    public String updateAccount(@RequestBody Account account) throws InterruptedException, ExecutionException {
        return accountService.updateAccount(account);
    }

    @DeleteMapping("/delete")
    public String deleteAccount(@RequestParam String documentId) throws InterruptedException, ExecutionException {
        return accountService.deleteAccount(documentId);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndpoint() { return ResponseEntity.ok("Test Get Endpoint is Working!"); }

}
