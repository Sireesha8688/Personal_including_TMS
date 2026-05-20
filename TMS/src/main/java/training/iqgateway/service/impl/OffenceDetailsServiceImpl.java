package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.repositories.OffenceDetailsRepository;
import training.iqgateway.service.OffenceDetailsService;

import java.util.List;
import java.util.Optional;

@Service
public class OffenceDetailsServiceImpl implements OffenceDetailsService {

    private final OffenceDetailsRepository offenceDetailsRepository;

    @Autowired
    public OffenceDetailsServiceImpl(OffenceDetailsRepository offenceDetailsRepository) {
        this.offenceDetailsRepository = offenceDetailsRepository;
    }

    @Override
    public void insert(TmOffenceDetails offenceDetails) {
        offenceDetailsRepository.save(offenceDetails);
    }

    @Override
    public TmOffenceDetails getByOffenceDetailId(Long offenceDetailId) {
        Optional<TmOffenceDetails> opt = offenceDetailsRepository.findById(offenceDetailId);
        return opt.orElse(null);
    }

    @Override
    public List<TmOffenceDetails> getAll() {
        return offenceDetailsRepository.findAll();
    }

    @Override
    public void update(TmOffenceDetails offenceDetails) {
        if (offenceDetailsRepository.existsById(offenceDetails.getOffenceDetailId())) {
            offenceDetailsRepository.save(offenceDetails);
        } else {
            throw new RuntimeException("OffenceDetails not found with id: " + offenceDetails.getOffenceDetailId());
        }
    }

    @Override
    public void delete(Long offenceDetailId) {
        offenceDetailsRepository.deleteById(offenceDetailId);
    }

    @Override
    public List<TmOffenceDetails> getByVehNo(String vehNo) {
        return offenceDetailsRepository.findByVehNo(vehNo);
    }
}
