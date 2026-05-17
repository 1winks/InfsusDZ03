package infsus.pinsus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO3 {
    private String name;
    private Boolean active;
    private Boolean blocked;
}
