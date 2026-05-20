package training.iqgateway.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import training.iqgateway.entities.TmOwnerDetails;

public interface OwnerDetailsRepository extends JpaRepository<TmOwnerDetails, Long> {
}
