package infsus.pinsus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO2 {
    private String name;
    private String description;
    private Double price;
    private String subject;
}
