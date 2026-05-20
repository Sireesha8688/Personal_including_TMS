package training.iqgateway.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import training.iqgateway.entities.TmRegDetails;

public interface RegDetailsRepository extends JpaRepository<TmRegDetails, Long> {

    TmRegDetails findByVehNo(String vehNo); // basic

    void deleteByVehNo(String vehNo); // for deleting by vehNo

    @Query("SELECT r FROM TmRegDetails r JOIN FETCH r.vehicle JOIN FETCH r.owner")
    List<TmRegDetails> findAllWithVehicleAndOwner(); // for lists

    // ✅ Get one registration with full details
    @Query("SELECT r FROM TmRegDetails r JOIN FETCH r.vehicle JOIN FETCH r.owner WHERE r.vehNo = :vehNo")
    TmRegDetails fetchFullRegistration(@Param("vehNo") String vehNo);
}
