package infsus.pinsus.controller.responses;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SystemException extends RuntimeException {
    public SystemException(String message) {
        super(message);
    }
}