package training.iqgateway.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.dto.OwnerVehicleDTO;
import training.iqgateway.dto.RegistrationDto;
import training.iqgateway.entities.*;
import training.iqgateway.repositories.RegDetailsRepository;
import training.iqgateway.repositories.VehicleDetailsRepository;
import training.iqgateway.service.RTOOperationService;

@RestController
@RequestMapping("/rto")

public class RTOOperationsController {

    @Autowired
    private RTOOperationService rtoService;

    @Autowired
    private RegDetailsRepository regRepo;

    @Autowired
    private VehicleDetailsRepository vehicleRepo;

    @PostMapping("/owner/register")
    public String registerOwner(@RequestBody TmOwnerDetails owner) {
        return rtoService.ownerRegistration(owner);
    }

    @PostMapping("/vehicle/register")
    public String registerVehicle(@RequestBody TmVehicleDetails vehicle) {
        return rtoService.vehicleRegistration(vehicle);
    }

    @PostMapping("/ownership/transfer")
    public String transferOwnership(@RequestParam Long oldOwnerId,
                                    @RequestParam Long newOwnerId,
                                    @RequestParam String vehNo) {
        return rtoService.transferOfOwnership(oldOwnerId, newOwnerId, vehNo);
    }

    @GetMapping("/offences/unpaid/{vehNo}")
    public List<TmOffenceDetails> getUnpaidOffences(@PathVariable String vehNo) {
        return rtoService.fetchUnpaidOffenceDetails(vehNo);
    }

    @PostMapping("/owner-vehicle/register")
    public String registerOwnerWithVehicle(@RequestBody OwnerVehicleDTO dto) {
        return rtoService.registrationOfOwnerWithVehicle(dto.getOwner(), dto.getRegistration());
    }

    @PostMapping("/offence-type/add")
    public String addOffenceType(@RequestBody TmOffence offenceType) {
        return rtoService.addOffenceType(offenceType);
    }

    @GetMapping("/offence-types")
    public List<TmOffence> listOffenceTypes() {
        return rtoService.listOffenceTypes();
    }

    @DeleteMapping("/offence-type/delete/{id}")
    public String deleteOffenceType(@PathVariable Long id) {
        return rtoService.deleteOffenceType(id);
    }

    @PutMapping("/offence-type/update")
    public String updateOffenceType(@RequestBody TmOffence offenceType) {
        return rtoService.updateOffenceType(offenceType);
    }

    @PostMapping("/ownership/transfer-only")
    public String transferOwnershipOnly(@RequestParam Long appNo, @RequestParam Long newOwnerId) {
        return rtoService.transferOwnershipOnly(appNo, newOwnerId);
    }

    @PostMapping("/offence/clear/{id}")
    public String clearOffence(@PathVariable Long id) {
        return rtoService.clearOffence(id);
    }

    @DeleteMapping("/owner/delete/{id}")
    public String deleteOwner(@PathVariable Long id) {
        return rtoService.deleteOwner(id);
    }

    @DeleteMapping("/vehicle/delete/{vehNo}")
    public String deleteVehicle(@PathVariable String vehNo) {
        return rtoService.deleteVehicle(vehNo);
    }

    @GetMapping("/owners")
    public List<TmOwnerDetails> listAllOwners() {
        return rtoService.listAllOwners();
    }

    @GetMapping("/vehicles")
    public List<RegistrationDto> listAllVehicles() {
        return rtoService.listAllVehicles();
    }

    @GetMapping("/api/vehicles/unregistered")
    public List<TmVehicleDetails> getUnregisteredVehicles() {
        List<Long> usedVehicleIds = regRepo.findAll().stream()
            .map(reg -> reg.getVehicle().getVehId())
            .collect(Collectors.toList());
        return vehicleRepo.findAll().stream()
            .filter(v -> !usedVehicleIds.contains(v.getVehId()))
            .collect(Collectors.toList());
    }
    
    @GetMapping("/ownership/details/{vehNo}")
    public ResponseEntity<RegistrationDto> getVehicleRegistrationByVehNo(@PathVariable String vehNo) {
        RegistrationDto dto = rtoService.getRegistrationDtoByVehNo(vehNo);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/transfer-blocking-offences/{vehNo}")
    public ResponseEntity<List<TmOffenceDetails>> getTransferBlockingOffences(@PathVariable String vehNo) {
        List<TmOffenceDetails> list = rtoService.getTransferBlockingOffences(vehNo);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/mark-offence-cleared/{id}")
    public ResponseEntity<String> markOffenceCleared(@PathVariable Long id) {
        String result = rtoService.markOffenceAsCleared(id);
        return ResponseEntity.ok(result);
    }


   
}
