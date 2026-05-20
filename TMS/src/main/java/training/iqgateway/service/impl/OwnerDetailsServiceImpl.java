package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.repositories.OwnerDetailsRepository;
import training.iqgateway.service.OwnerDetailsService;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerDetailsServiceImpl implements OwnerDetailsService {

    private final OwnerDetailsRepository ownerDetailsRepository;

    @Autowired
    public OwnerDetailsServiceImpl(OwnerDetailsRepository ownerDetailsRepository) {
        this.ownerDetailsRepository = ownerDetailsRepository;
    }

    @Override
    public void insert(TmOwnerDetails ownerdetails) {
        ownerDetailsRepository.save(ownerdetails);
    }

    @Override
    public TmOwnerDetails getByOwnerId(Long ownerId) {
        Optional<TmOwnerDetails> opt = ownerDetailsRepository.findById(ownerId);
        return opt.orElse(null);
    }

    @Override
    public List<TmOwnerDetails> getAll() {
        return ownerDetailsRepository.findAll();
    }

    @Override
    public void update(TmOwnerDetails ownerdetails) {
        if (ownerDetailsRepository.existsById(ownerdetails.getOwnerId())) {
            ownerDetailsRepository.save(ownerdetails);
        } else {
            throw new RuntimeException("Owner not found with id: " + ownerdetails.getOwnerId());
        }
    }

    @Override
    public void delete(Long ownerId) {
        ownerDetailsRepository.deleteById(ownerId);
    }
}
