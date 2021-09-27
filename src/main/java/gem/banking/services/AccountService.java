package gem.banking.services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import gem.banking.models.Account;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class AccountService {

    public static final String COL_NAME="users";

    public String createAccount(Account account) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_NAME).document(account.getDocumentId()).set(account);
        return "Successfully created account at " + collectionsApiFuture.get().getUpdateTime().toString();
    }

    public Account getAccount(String documentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COL_NAME).document(documentId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Account account;

        if (document.exists()) {
            account = document.toObject(Account.class);
            return account;
        }
        return null;
    }

    public String updateAccount(Account account) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_NAME).document(account.getDocumentId()).set(account);
        return "Account successfully updated at " + collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String deleteAccount(String documentId) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResultApiFuture = dbFirestore.collection(COL_NAME).document(documentId).delete();
        return "Successfully deleted " + documentId;
    }
}
