package infsus.pinsus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO2 {
    private String name;
    private Integer age;
    private String phone;
    private Boolean active;
}
