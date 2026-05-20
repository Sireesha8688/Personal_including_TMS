package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import training.iqgateway.entities.TmOffence;
import training.iqgateway.service.TmOffenceService;

import java.util.List;

@RestController
@RequestMapping("/api/offences")
public class TmOffenceController {

    private final TmOffenceService offenceService;

    @Autowired
    public TmOffenceController(TmOffenceService offenceService) {
        this.offenceService = offenceService;
    }

    @PostMapping
    public ResponseEntity<TmOffence> insertOffence(@RequestBody TmOffence offence) {
        offenceService.insert(offence);
        return ResponseEntity.ok(offence);
    }

    @GetMapping("/{offenceId}")
    public ResponseEntity<TmOffence> getByOffenceId(@PathVariable Long offenceId) {
        TmOffence offence = offenceService.getByOffenceId(offenceId);
        if (offence != null) {
            return ResponseEntity.ok(offence);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public List<TmOffence> getAllOffences() {
        return offenceService.getAll();
    }

    @PutMapping("/{offenceId}")
    public ResponseEntity<TmOffence> updateOffence(
            @PathVariable Long offenceId,
            @RequestBody TmOffence offence) {
        if (offenceService.getByOffenceId(offenceId) != null) {
            offence.setOffenceId(offenceId);
            offenceService.update(offence);
            return ResponseEntity.ok(offence);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{offenceId}")
    public ResponseEntity<Void> deleteOffence(@PathVariable Long offenceId) {
        if (offenceService.getByOffenceId(offenceId) != null) {
            offenceService.delete(offenceId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
