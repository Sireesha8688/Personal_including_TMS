package training.iqgateway.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.entities.TmVehicleDetails;

public interface COPOperationService {
	String reportOffenceWithImage(TmOffenceDetails offence, MultipartFile image);
    List<TmOffenceDetails> fetchUnclearedOffenceDetails();
    TmOwnerDetails fetchOwnerDetails(Long ownerId);
    TmVehicleDetails fetchVehicleDetailsByVehNo(String vehNo);

    
    List<TmOffence> fetchOffenceTypes();
    
    
    
 // Fetch owner details using vehicle number
    TmOwnerDetails fetchOwnerDetailsByVehNo(String vehNo);

    // Clear an offence by ID (change status to "cleared")
    String clearOffence(Long offenceDetailId);

}
