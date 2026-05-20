package training.iqgateway.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import training.iqgateway.entities.TmOffenceDetails;
import java.util.List;

public interface OffenceDetailsRepository extends JpaRepository<TmOffenceDetails, Long> {
    List<TmOffenceDetails> findByVehNo(String vehNo);

    // Case-insensitive search for 'pending'
    List<TmOffenceDetails> findByOffenceStatusIgnoreCase(String status);

    // If you want to support multiple statuses (e.g., "pending", "penging")
    List<TmOffenceDetails> findByOffenceStatusIgnoreCaseIn(List<String> statuses);
    List<TmOffenceDetails> findByVehNoAndOffenceStatusNotIgnoreCase(String vehNo, String offenceStatus);
}
