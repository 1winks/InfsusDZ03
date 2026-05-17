package infsus.pinsus.controller;

import infsus.pinsus.domain.Profile;
import infsus.pinsus.dto.ProfileDTO;
import infsus.pinsus.dto.ProfileDTO2;
import infsus.pinsus.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/profiles")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @GetMapping("/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<ProfileDTO> listProfiles(@PathVariable String name){
        return profileService.getAllByInstructor(name);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Profile createProfile(@RequestBody ProfileDTO2 profileDTO2) {
        return profileService.createProfile(profileDTO2);
    }
}
