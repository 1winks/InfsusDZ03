package infsus.pinsus.dto;

import infsus.pinsus.domain.Subject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {
    private String description;
    private Double price;
    private String subject;
}
