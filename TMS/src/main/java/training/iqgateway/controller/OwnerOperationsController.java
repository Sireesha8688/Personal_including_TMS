package training.iqgateway.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.service.OwnerOperationsService;

@RestController
@RequestMapping("/owner")
public class OwnerOperationsController {

    @Autowired
    private OwnerOperationsService ownerOperationsService;

    // Endpoint to view vehicle registration details by vehicle number
    @GetMapping("/vehicle-details/{vehNo}")
    public Map<String, Object> viewVehicleDetails(@PathVariable String vehNo) {
        TmRegDetails reg = ownerOperationsService.viewVehicleDetails(vehNo);
        if (reg == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("vehNo", reg.getVehNo());
        response.put("appNo", reg.getAppNo());
        response.put("dateOfPurchase", reg.getDateOfPurchase());
        response.put("distributerName", reg.getDistributerName());

        // Extract vehicle details
        if (reg.getVehicle() != null) {
            Map<String, Object> vehicle = new HashMap<>();
            vehicle.put("vehName", reg.getVehicle().getVehName());
            vehicle.put("vehType", reg.getVehicle().getVehType());
            
            vehicle.put("engineNo", reg.getVehicle().getEngineNo());
            response.put("vehicle", vehicle);
        }

        // Extract owner details
        if (reg.getOwner() != null) {
            Map<String, Object> owner = new HashMap<>();
            owner.put("fname", reg.getOwner().getFname());
            owner.put("lname", reg.getOwner().getLname());
            owner.put("mobileNo", reg.getOwner().getMobileNo());
            owner.put("gender", reg.getOwner().getGender());
            response.put("owner", owner);
        }

        return response;
    }


    // Endpoint to view offences by vehicle number
    @GetMapping("/offences/{vehNo}")
    public List<Map<String, Object>> viewOffencesByVehNo(@PathVariable String vehNo) {
        return ownerOperationsService.viewOffencesByVehNo(vehNo)
            .stream()
            .map(o -> {
                Map<String, Object> map = new HashMap<>();
                map.put("offenceDetailId", o.getOffenceDetailId());
                map.put("vehNo", o.getVehNo());
                map.put("offenceStatus", o.getOffenceStatus());
                map.put("time", o.getTime());
                map.put("place", o.getPlace());
                map.put("offence", Map.of("offenceType", o.getOffence().getOffenceType()));
                map.put("reportedBy", o.getReportedBy() != null ? o.getReportedBy().getUsername() : null);
                map.put("image", o.getImage() != null ? Base64.getEncoder().encodeToString(o.getImage()) : null);
                return map;
            })
            .collect(Collectors.toList());
    }

}
