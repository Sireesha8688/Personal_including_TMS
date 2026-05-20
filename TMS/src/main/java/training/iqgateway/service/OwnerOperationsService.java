package training.iqgateway.service;

import java.util.List;

import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmRegDetails;

public interface OwnerOperationsService {

    TmRegDetails viewVehicleDetails(String vehNo);

    List<TmOffenceDetails> viewOffencesByVehNo(String vehNo);
}
