package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.service.OffenceDetailsService;

import java.util.List;

@RestController
@RequestMapping("/api/offence-details")
public class OffenceDetailsController {

    private final OffenceDetailsService offenceDetailsService;

    @Autowired
    public OffenceDetailsController(OffenceDetailsService offenceDetailsService) {
        this.offenceDetailsService = offenceDetailsService;
    }

    @PostMapping
    public ResponseEntity<TmOffenceDetails> insert(@RequestBody TmOffenceDetails details) {
        offenceDetailsService.insert(details);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{offenceDetailId}")
    public ResponseEntity<TmOffenceDetails> getById(@PathVariable Long offenceDetailId) {
        TmOffenceDetails details = offenceDetailsService.getByOffenceDetailId(offenceDetailId);
        if (details != null) {
            return ResponseEntity.ok(details);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public List<TmOffenceDetails> getAll() {
        return offenceDetailsService.getAll();
    }

    @PutMapping("/{offenceDetailId}")
    public ResponseEntity<TmOffenceDetails> update(
            @PathVariable Long offenceDetailId,
            @RequestBody TmOffenceDetails details) {
        if (offenceDetailsService.getByOffenceDetailId(offenceDetailId) != null) {
            details.setOffenceDetailId(offenceDetailId);
            offenceDetailsService.update(details);
            return ResponseEntity.ok(details);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{offenceDetailId}")
    public ResponseEntity<Void> delete(@PathVariable Long offenceDetailId) {
        if (offenceDetailsService.getByOffenceDetailId(offenceDetailId) != null) {
            offenceDetailsService.delete(offenceDetailId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/vehicle/{vehNo}")
    public List<TmOffenceDetails> getByVehNo(@PathVariable String vehNo) {
        return offenceDetailsService.getByVehNo(vehNo);
    }
    
   

}
