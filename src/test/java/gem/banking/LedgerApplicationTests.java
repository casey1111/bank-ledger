package gem.banking;

import io.restassured.RestAssured;
import io.restassured.http.Cookie;
import io.restassured.response.ResponseBody;
import org.json.JSONArray;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(
        classes = LedgerApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class LedgerApplicationTests {
    private static String CONTENT_TYPE = "application/json";

    @LocalServerPort
    int port;

    @Before
    public void setUp() {
        RestAssured.port = port;
    }

    private Cookie login(String username, String password) {
        String loginJson = "{\"username\": \"" + username + "\", \"password\": \"" + password + "\"}";

        return given().contentType(CONTENT_TYPE).body(loginJson).post("/api/login").thenReturn().getDetailedCookie("JSESSIONID");
    }

    @Test
    public void A_givenNotLoggedIn_whenRequestSecuredEndPoint_thenUnauthorized() {
        given().contentType(CONTENT_TYPE).get("/api/transactions").then().statusCode(401);
    }

    @Test
    public void B_givenInvalidLogin_whenRequestLogin_thenUnauthorized() {
        String loginJson = "{\"username\": \"bad\", \"password\": \"bad\"}";
        given().contentType(CONTENT_TYPE).body(loginJson).post("/api/login").then().statusCode(401);
    }


    @Test
    public void C_givenNewAccount_whenRequestCreateAccount_thenOk() {
        String loginJson = "{\"username\": \"good\", \"password\": \"password\"}";

        given().contentType(CONTENT_TYPE).body(loginJson).post("/api/account").then().statusCode(201);
    }

    @Test
    public void D_givenValidLogin_whenCreateTransaction_thenOk() {
        String trans = "{\"memo\": \"NEWTRANS\", \"amount\": 5.00, \"transactionType\": \"DEPOSIT\"}";

        Cookie cookie = login("good", "password");
        given().cookie(cookie).contentType(CONTENT_TYPE).body(trans).post("/api/transactions").then().statusCode(201);
    }

    @Test
    public void E_givenValidLogin_whenRequestTransactions_thenOk() throws Exception {
        Cookie cookie = login("good", "password");
        ResponseBody b = given().cookie(cookie).contentType(CONTENT_TYPE).get("/api/transactions").getBody();
        JSONArray j = new JSONArray(b.asString());
        assertEquals(j.getJSONObject(0).getString("memo"), "NEWTRANS");
        assertEquals(j.getJSONObject(0).getDouble("amount"), 5, 0.0001);
    }


}
