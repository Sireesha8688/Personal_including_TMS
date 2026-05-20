package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import training.iqgateway.entities.TmOffence;
import training.iqgateway.repositories.TmOffenceRepository;
import training.iqgateway.service.TmOffenceService;

import java.util.List;
import java.util.Optional;

@Service
public class TmOffenceServiceImpl implements TmOffenceService {

    private final TmOffenceRepository offenceRepository;

    @Autowired
    public TmOffenceServiceImpl(TmOffenceRepository offenceRepository) {
        this.offenceRepository = offenceRepository;
    }

    @Override
    public void insert(TmOffence offence) {
        offenceRepository.save(offence);
    }

    @Override
    public TmOffence getByOffenceId(Long offenceId) {
        Optional<TmOffence> opt = offenceRepository.findById(offenceId);
        return opt.orElse(null);
    }

    @Override
    public List<TmOffence> getAll() {
        return offenceRepository.findAll();
    }

    @Override
    public void update(TmOffence offence) {
        if (offenceRepository.existsById(offence.getOffenceId())) {
            offenceRepository.save(offence);
        } else {
            throw new RuntimeException("Offence not found with id: " + offence.getOffenceId());
        }
    }

    @Override
    public void delete(Long offenceId) {
        offenceRepository.deleteById(offenceId);
    }
}
