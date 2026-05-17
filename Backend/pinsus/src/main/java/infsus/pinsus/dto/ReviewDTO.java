package infsus.pinsus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private String comment;
    private Double score;
    private String reviewer;
    private String reviewed;
}
