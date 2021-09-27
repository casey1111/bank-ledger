package gem.banking.services;

import gem.banking.models.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.concurrent.ExecutionException;

@Service
public class AuthenticationService {
    @Autowired
    PasswordEncoder passwordEncoder;

    @Resource(name="authenticationManager")
    private AuthenticationManager authManager;


    private final AccountService accountService;

    @Autowired
    public AuthenticationService(AccountService accountService) {
        this.accountService = accountService;
    }

    public String getCurrentUser() {
        String username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }

        return username;
    }

    public void createUser(String documentId, String username, String password) throws ExecutionException, InterruptedException {
        accountService.createAccount(new Account(documentId, username, passwordEncoder.encode(password)));
    }

    public void login(HttpServletRequest request, String username, String password) {
        UsernamePasswordAuthenticationToken authReq =
                new UsernamePasswordAuthenticationToken(username, password);
        Authentication auth = authManager.authenticate(authReq);
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(auth);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", sc);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
