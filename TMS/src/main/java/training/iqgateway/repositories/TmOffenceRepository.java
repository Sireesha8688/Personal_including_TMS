package training.iqgateway.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import training.iqgateway.entities.TmOffence;

public interface TmOffenceRepository extends JpaRepository<TmOffence, Long> {
}
