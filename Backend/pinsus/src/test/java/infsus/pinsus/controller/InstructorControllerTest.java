package infsus.pinsus.controller;

import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.service.InstructorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InstructorController.class)
class InstructorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InstructorService instructorService;

    @MockBean
    private InstructorRepository instructorRepository;

    @MockBean
    private UserRepository userRepository;

    @Test
    @WithMockUser(roles = "USER")
    void listInstructors_returnsInstructors() throws Exception {
        InstructorDTO dto = new InstructorDTO();
        dto.setName("admin");

        when(instructorService.listAllActive()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/resources/instructors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("admin"));
    }
}