package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.entities.TmVehicleDetails;
import training.iqgateway.repositories.VehicleDetailsRepository;
import training.iqgateway.service.VehicleDetailsService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleDetailsController {

    private final VehicleDetailsService vehicleDetailsService;

    @Autowired
    public VehicleDetailsController(VehicleDetailsService vehicleDetailsService) {
        this.vehicleDetailsService = vehicleDetailsService;
    }
    @Autowired
    private VehicleDetailsRepository vehicleRepo;

    // Create Vehicle
    @PostMapping
    public ResponseEntity<TmVehicleDetails> insertVehicle(@RequestBody TmVehicleDetails vehicledetails) {
        vehicleDetailsService.insert(vehicledetails);
        return ResponseEntity.ok(vehicledetails);
    }

    // Get Vehicle by ID
    @GetMapping("/{vehId}")
    public ResponseEntity<TmVehicleDetails> getVehicleById(@PathVariable Long vehId) {
        TmVehicleDetails vehicle = vehicleDetailsService.getByVehId(vehId);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get All Vehicles
    @GetMapping
    public List<TmVehicleDetails> getAllVehicles() {
        return vehicleDetailsService.getAll();
    }

    // Update Vehicle
    @PutMapping("/{vehId}")
    public ResponseEntity<TmVehicleDetails> updateVehicle(
            @PathVariable Long vehId,
            @RequestBody TmVehicleDetails vehicledetails) {
        if (vehicleDetailsService.getByVehId(vehId) != null) {
            vehicledetails.setVehId(vehId); // Ensure path and body match
            vehicleDetailsService.update(vehicledetails);
            return ResponseEntity.ok(vehicledetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete Vehicle
    @DeleteMapping("/{vehId}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long vehId) {
        if (vehicleDetailsService.getByVehId(vehId) != null) {
            vehicleDetailsService.delete(vehId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/api/vehicles/unregistered")
    public List<TmVehicleDetails> getUnregisteredVehicles() {
        return vehicleRepo.findUnregisteredVehicles();
    }


    // Get Vehicle by Engine Number
    @GetMapping("/engine/{engineNo}")
    public ResponseEntity<TmVehicleDetails> getVehicleByEngineNo(@PathVariable String engineNo) {
        TmVehicleDetails vehicle = vehicleDetailsService.getByEngineNo(engineNo);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
