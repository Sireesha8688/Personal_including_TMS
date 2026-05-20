package training.iqgateway.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.entities.TmVehicleDetails;
import training.iqgateway.service.COPOperationService;

@RestController
@RequestMapping("/cop")
@CrossOrigin(origins = "http://localhost:5173")
public class COPOperationController {

    @Autowired
    private COPOperationService copService;

    @PostMapping(value = "/report-offence", consumes = {"multipart/form-data"})
    public String reportOffence(
        @RequestPart("offenceDetails") String offenceDetailsJson,
        @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            TmOffenceDetails offenceDetails = mapper.readValue(offenceDetailsJson, TmOffenceDetails.class);
            return copService.reportOffenceWithImage(offenceDetails, image);
        } catch (Exception e) {
            throw new RuntimeException("Invalid offence details JSON", e);
        }
    }

    @GetMapping("/uncleared-offences")
    public List<TmOffenceDetails> fetchUnclearedOffenceDetails() {
        return copService.fetchUnclearedOffenceDetails();
    }

    @GetMapping("/owner/{ownerId}")
    public TmOwnerDetails fetchOwnerDetails(@PathVariable Long ownerId) {
        return copService.fetchOwnerDetails(ownerId);
    }

 // Fetch vehicle details by vehicle number
    @GetMapping("/vehicle-details-by-vehno/{vehNo}")
    public TmVehicleDetails fetchVehicleDetailsByVehNo(@PathVariable String vehNo) {
        return copService.fetchVehicleDetailsByVehNo(vehNo);
    }


    

    @GetMapping("/offence-types")
    public List<TmOffence> fetchOffenceTypes() {
        return copService.fetchOffenceTypes();
    }
    
 
    @GetMapping("/owner-by-vehno/{vehNo}")
    public TmOwnerDetails fetchOwnerDetailsByVehNo(@PathVariable String vehNo) {
        return copService.fetchOwnerDetailsByVehNo(vehNo);
    }

    // Clear an offence (change status to cleared)
    @PostMapping("/clear-offence/{offenceDetailId}")
    public String clearOffence(@PathVariable Long offenceDetailId) {
        return copService.clearOffence(offenceDetailId);
    }

}
