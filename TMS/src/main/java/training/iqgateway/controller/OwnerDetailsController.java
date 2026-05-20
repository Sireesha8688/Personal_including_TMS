package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.service.OwnerDetailsService;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerDetailsController {

    private final OwnerDetailsService ownerDetailsService;

    @Autowired
    public OwnerDetailsController(OwnerDetailsService ownerDetailsService) {
        this.ownerDetailsService = ownerDetailsService;
    }

    // Create Owner
    @PostMapping
    public ResponseEntity<TmOwnerDetails> insertOwner(@RequestBody TmOwnerDetails ownerdetails) {
        ownerDetailsService.insert(ownerdetails);
        return ResponseEntity.ok(ownerdetails);
    }

    // Get Owner by ID
    @GetMapping("/{ownerId}")
    public ResponseEntity<TmOwnerDetails> getOwnerById(@PathVariable Long ownerId) {
        TmOwnerDetails owner = ownerDetailsService.getByOwnerId(ownerId);
        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get All Owners
    @GetMapping
    public List<TmOwnerDetails> getAllOwners() {
        return ownerDetailsService.getAll();
    }

    // Update Owner
    @PutMapping("/{ownerId}")
    public ResponseEntity<TmOwnerDetails> updateOwner(
            @PathVariable Long ownerId,
            @RequestBody TmOwnerDetails ownerdetails) {
        if (ownerDetailsService.getByOwnerId(ownerId) != null) {
            ownerdetails.setOwnerId(ownerId); // Ensure path and body match
            ownerDetailsService.update(ownerdetails);
            return ResponseEntity.ok(ownerdetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete Owner
    @DeleteMapping("/{ownerId}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long ownerId) {
        if (ownerDetailsService.getByOwnerId(ownerId) != null) {
            ownerDetailsService.delete(ownerId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
