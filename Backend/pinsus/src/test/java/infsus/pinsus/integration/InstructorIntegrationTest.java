package infsus.pinsus.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class InstructorIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void applicationStartsAndEndpointExists() {
        String url = "http://localhost:" + port + "/api/resources/instructors";

        var response = restTemplate.getForEntity(url, String.class);

        assertTrue(
                response.getStatusCode().is2xxSuccessful()
                        || response.getStatusCode().is4xxClientError()
        );
    }
}