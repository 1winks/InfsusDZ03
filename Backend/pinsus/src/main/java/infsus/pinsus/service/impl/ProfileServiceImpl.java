package infsus.pinsus.service.impl;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.domain.Profile;
import infsus.pinsus.domain.Subject;
import infsus.pinsus.dto.ProfileDTO;
import infsus.pinsus.dto.ProfileDTO2;
import infsus.pinsus.dto.ProfileDTO3;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.repository.ProfileRepository;
import infsus.pinsus.repository.SubjectRepository;
import infsus.pinsus.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public List<ProfileDTO> getAllByInstructor(String name) {
        List<ProfileDTO> profileDTOS = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(name);
        Instructor instructor = user.get().getInstructor();
        List<Profile> profiles = profileRepository.findAllByInstructorId(instructor.getId());
        for (Profile profile : profiles) {
            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setDescription(profile.getDescription());
            profileDTO.setPrice(profile.getPrice());
            profileDTO.setSubject(profile.getSubject().getName());
            profileDTOS.add(profileDTO);
        }
        return profileDTOS;
    }

    @Override
    public Profile createProfile(ProfileDTO2 profileDTO2) {
        Profile profile = new Profile();
        profile.setDescription(profileDTO2.getDescription());
        profile.setPrice(profileDTO2.getPrice());

        Optional<User> user = userRepository.findByUsername(profileDTO2.getName());
        Instructor instructor = user.get().getInstructor();
        Long instructorId = instructor.getId();
        Subject subject = subjectRepository.findByName(profileDTO2.getSubject());
        if (profileRepository.existsByInstructorIdAndSubject(instructorId, subject)) {
            throw new RuntimeException(
                    "Profile for this subject already exists"
            );
        }

        profile.setInstructor(instructor);
        List<Profile> profiles = instructor.getProfiles();
        profiles.add(profile);
        instructorRepository.save(instructor);

        profile.setSubject(subject);
        List<Profile> profiles2 = subject.getProfiles();
        profiles2.add(profile);
        subjectRepository.save(subject);
        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfile(ProfileDTO2 profileDTO2) {
        Optional<User> user = userRepository.findByUsername(profileDTO2.getName());
        Instructor instructor = user.get().getInstructor();
        Long instructorId = instructor.getId();
        Subject subject = subjectRepository.findByName(profileDTO2.getSubject());
        Profile profile = profileRepository.findByInstructorIdAndSubject(instructorId, subject);

        profile.setDescription(profileDTO2.getDescription());
        profile.setPrice(profileDTO2.getPrice());
        return profileRepository.save(profile);
    }

    @Override
    public void deleteProfile(ProfileDTO3 profileDTO3) {
        Optional<User> user = userRepository.findByUsername(profileDTO3.getName());
        Instructor instructor = user.get().getInstructor();
        Long instructorId = instructor.getId();
        Subject subject = subjectRepository.findByName(profileDTO3.getSubject());
        Profile profile = profileRepository.findByInstructorIdAndSubject(instructorId, subject);

        profileRepository.delete(profile);
    }
}
