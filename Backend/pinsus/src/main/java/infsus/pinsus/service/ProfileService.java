package infsus.pinsus.service;

import infsus.pinsus.domain.Profile;
import infsus.pinsus.dto.ProfileDTO;
import infsus.pinsus.dto.ProfileDTO2;
import infsus.pinsus.dto.ProfileDTO3;

import java.util.List;

public interface ProfileService {
    List<ProfileDTO> getAllByInstructor(String name);

    Profile createProfile(ProfileDTO2 profileDTO2);

    Profile updateProfile(ProfileDTO2 profileDTO2);

    void deleteProfile(ProfileDTO3 profileDTO3);
}
