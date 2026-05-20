package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.service.RegDetailsService;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegDetailsController {

    private final RegDetailsService regDetailsService;

    @Autowired
    public RegDetailsController(RegDetailsService regDetailsService) {
        this.regDetailsService = regDetailsService;
    }

    // Create registration
    @PostMapping
    public ResponseEntity<TmRegDetails> insertReg(@RequestBody TmRegDetails regdetails) {
        regDetailsService.insert(regdetails);
        return ResponseEntity.ok(regdetails);
    }

    @GetMapping("/vehno/{vehNo}")
    public ResponseEntity<TmRegDetails> getByVehNo(@PathVariable String vehNo) {
        TmRegDetails reg = regDetailsService.getByVehNo(vehNo);
        if (reg != null) {
            return ResponseEntity.ok(reg);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // Get all registrations
    @GetMapping
    public List<TmRegDetails> getAllRegs() {
        return regDetailsService.getAll();
    }

    // Update registration
    @PutMapping("/{appNo}")
    public ResponseEntity<TmRegDetails> updateReg(
            @PathVariable Long appNo,
            @RequestBody TmRegDetails regdetails) {
        regdetails.setAppNo(appNo);
        try {
            regDetailsService.update(regdetails);
            return ResponseEntity.ok(regdetails);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete registration by vehicle number
    @DeleteMapping("/vehno/{vehNo}")
    public ResponseEntity<Void> deleteReg(@PathVariable String vehNo) {
        TmRegDetails reg = regDetailsService.getByVehNo(vehNo);
        if (reg != null) {
            regDetailsService.delete(vehNo);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Transfer ownership
    @PutMapping("/{appNo}/transfer/{newOwnerId}")
    public ResponseEntity<Void> transferOwnership(
            @PathVariable Long appNo,
            @PathVariable Long newOwnerId) {
        try {
            regDetailsService.transferOwnership(appNo, newOwnerId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
