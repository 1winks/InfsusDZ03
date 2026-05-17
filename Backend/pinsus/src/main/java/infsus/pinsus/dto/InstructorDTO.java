package infsus.pinsus.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO {
    private String name;
    private String email;
    private Integer age;
    private String phone;
    private List<SubjectDTO> subjects;
}
