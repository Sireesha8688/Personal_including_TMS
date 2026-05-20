package training.iqgateway.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import training.iqgateway.entities.TmVehicleDetails;

public interface VehicleDetailsRepository extends JpaRepository<TmVehicleDetails, Long> {
    TmVehicleDetails findByEngineNo(String engineNo);
    @Query("SELECT v FROM TmVehicleDetails v WHERE v.vehId NOT IN (SELECT r.vehicle.vehId FROM TmRegDetails r)")
    List<TmVehicleDetails> findUnregisteredVehicles();

}
