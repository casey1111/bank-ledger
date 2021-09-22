package gem.banking.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Transaction {
    private String memo = "";
    private double  amount;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date date;
    private TransactionType transactionType;

    public enum TransactionType {
        WITHDRAWAL, DEPOSIT;
    }
}
