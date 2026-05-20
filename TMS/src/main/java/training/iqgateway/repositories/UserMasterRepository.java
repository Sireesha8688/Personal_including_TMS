package training.iqgateway.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import training.iqgateway.entities.TmUserMaster;

public interface UserMasterRepository extends JpaRepository<TmUserMaster, String> {
}
