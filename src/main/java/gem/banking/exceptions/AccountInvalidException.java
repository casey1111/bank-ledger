package gem.banking.exceptions;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@AllArgsConstructor
public class AccountInvalidException extends Exception {
    public AccountInvalidException(String message) {
        super(message);
    }
}
