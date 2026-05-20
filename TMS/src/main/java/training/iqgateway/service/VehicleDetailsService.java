package training.iqgateway.service;

import java.util.List;
import training.iqgateway.entities.TmVehicleDetails;

public interface VehicleDetailsService {
    void insert(TmVehicleDetails vehicledetails);
    TmVehicleDetails getByVehId(Long vehId);
    List<TmVehicleDetails> getAll();
    void update(TmVehicleDetails vehicledetails);
    void delete(Long vehId);
    TmVehicleDetails getByEngineNo(String engineNo);
}
