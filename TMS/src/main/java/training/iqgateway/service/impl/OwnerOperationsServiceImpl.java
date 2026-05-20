package training.iqgateway.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmRegDetails;
import training.iqgateway.repositories.OffenceDetailsRepository;
import training.iqgateway.repositories.RegDetailsRepository;
import training.iqgateway.service.OwnerOperationsService;

@Service
public class OwnerOperationsServiceImpl implements OwnerOperationsService {

    @Autowired
    private RegDetailsRepository regDetailsRepository;

    @Autowired
    private OffenceDetailsRepository offenceDetailsRepository;

    @Override
    public TmRegDetails viewVehicleDetails(String vehNo) {
        // Fetch vehicle registration details by vehicle number
        return regDetailsRepository.findByVehNo(vehNo);
    }

    @Override
    public List<TmOffenceDetails> viewOffencesByVehNo(String vehNo) {
        // Fetch all offence details associated with the vehicle number
        return offenceDetailsRepository.findByVehNo(vehNo);
    }
}
