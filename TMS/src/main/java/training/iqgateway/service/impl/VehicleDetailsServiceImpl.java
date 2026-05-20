package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import training.iqgateway.entities.TmVehicleDetails;
import training.iqgateway.repositories.VehicleDetailsRepository;
import training.iqgateway.service.VehicleDetailsService;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleDetailsServiceImpl implements VehicleDetailsService {

    private final VehicleDetailsRepository vehicleDetailsRepository;

    @Autowired
    public VehicleDetailsServiceImpl(VehicleDetailsRepository vehicleDetailsRepository) {
        this.vehicleDetailsRepository = vehicleDetailsRepository;
    }

    @Override
    public void insert(TmVehicleDetails vehicledetails) {
        vehicleDetailsRepository.save(vehicledetails);
    }

    @Override
    public TmVehicleDetails getByVehId(Long vehId) {
        Optional<TmVehicleDetails> opt = vehicleDetailsRepository.findById(vehId);
        return opt.orElse(null);
    }

    @Override
    public List<TmVehicleDetails> getAll() {
        return vehicleDetailsRepository.findAll();
    }

    @Override
    public void update(TmVehicleDetails vehicledetails) {
        if (vehicleDetailsRepository.existsById(vehicledetails.getVehId())) {
            vehicleDetailsRepository.save(vehicledetails);
        } else {
            throw new RuntimeException("Vehicle not found with id: " + vehicledetails.getVehId());
        }
    }

    @Override
    public void delete(Long vehId) {
        vehicleDetailsRepository.deleteById(vehId);
    }

    @Override
    public TmVehicleDetails getByEngineNo(String engineNo) {
        return vehicleDetailsRepository.findByEngineNo(engineNo);
    }
}
