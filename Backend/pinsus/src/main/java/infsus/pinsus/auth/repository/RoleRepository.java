package infsus.pinsus.auth.repository;

import java.util.Optional;

import infsus.pinsus.auth.models.ERole;
import infsus.pinsus.auth.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

