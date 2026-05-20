package training.iqgateway.service.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.entities.TmUserMaster;
import training.iqgateway.entities.TmVehicleDetails;
import training.iqgateway.repositories.OffenceDetailsRepository;
import training.iqgateway.repositories.OwnerDetailsRepository;
import training.iqgateway.repositories.RegDetailsRepository;
import training.iqgateway.repositories.TmOffenceRepository;
import training.iqgateway.repositories.UserMasterRepository;
import training.iqgateway.repositories.VehicleDetailsRepository;
import training.iqgateway.service.COPOperationService;

@Service
public class COPOperationsServiceImpl implements COPOperationService {

    @Autowired
    private OffenceDetailsRepository offenceDetailsRepo;
    @Autowired
    private TmOffenceRepository offenceRepo;
    @Autowired
    private OwnerDetailsRepository ownerRepo;
    @Autowired
    private RegDetailsRepository regRepo;
    @Autowired
    private VehicleDetailsRepository vehicleRepo;
    @Autowired
    private UserMasterRepository userMasterRepository;

    public String reportOffenceWithImage(TmOffenceDetails offence, MultipartFile image) {
        try {
            if (image != null && !image.isEmpty()) {
                byte[] imageBytes = image.getBytes();
                offence.setImage(imageBytes);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image bytes", e);
        }

        // Fetch persistent user entity by username
        String username = offence.getReportedBy().getUsername();
        TmUserMaster user = userMasterRepository.findById(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        offence.setReportedBy(user);

        // Set default offence status
        offence.setOffenceStatus("PENDING");

        offenceDetailsRepo.save(offence);

        return "Offence reported with ID: " + offence.getOffenceDetailId();
    }

    @Override
    public List<TmOffenceDetails> fetchUnclearedOffenceDetails() {
        // Case-insensitive search for "pending"
        return offenceDetailsRepo.findByOffenceStatusIgnoreCase("pending");
        // Or, if you want to match multiple possible values:
        // return offenceDetailsRepo.findByOffenceStatusIgnoreCaseIn(List.of("pending", "penging"));
    }

    @Override
    public TmOwnerDetails fetchOwnerDetails(Long ownerId) {
        return ownerRepo.findById(ownerId).orElse(null);
    }

    @Override
    public TmVehicleDetails fetchVehicleDetailsByVehNo(String vehNo) {
        TmRegDetails reg = regRepo.findByVehNo(vehNo);
        if (reg != null) {
            return reg.getVehicle();
        }
        return null;
    }
   

    @Override
    public List<TmOffence> fetchOffenceTypes() {
        return offenceRepo.findAll();
    }
    
    @Override
    public TmOwnerDetails fetchOwnerDetailsByVehNo(String vehNo) {
        TmRegDetails reg = regRepo.findByVehNo(vehNo);
        return reg != null ? reg.getOwner() : null;
    }

    @Override
    public String clearOffence(Long offenceDetailId) {
        TmOffenceDetails offence = offenceDetailsRepo.findById(offenceDetailId)
            .orElseThrow(() -> new RuntimeException("Offence not found: " + offenceDetailId));
        offence.setOffenceStatus("cleared"); // or "CLEARED" as per your convention
        offenceDetailsRepo.save(offence);
        return "Offence ID " + offenceDetailId + " status set to cleared.";
    }

}
