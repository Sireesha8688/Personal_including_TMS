package training.iqgateway.service.impl;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.dto.OwnerDto;
import training.iqgateway.dto.RegistrationDto;
import training.iqgateway.dto.VehicleDto;
import training.iqgateway.entities.*;
import training.iqgateway.repositories.*;
import training.iqgateway.service.RTOOperationService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RTOOperationsServiceImpl implements RTOOperationService {

    @Autowired
    private OwnerDetailsRepository ownerRepo;

    @Autowired
    private RegDetailsRepository regRepo;

    @Autowired
    private VehicleDetailsRepository vehicleRepo;

    @Autowired
    private OffenceDetailsRepository offenceDetailsRepo;

    @Autowired
    private TmOffenceRepository offenceRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String ownerRegistration(TmOwnerDetails owner) {
        ownerRepo.save(owner);
        return "Owner registered successfully with ID: " + owner.getOwnerId();
    }

    @Override
    public String vehicleRegistration(TmVehicleDetails vehicle) {
        vehicleRepo.save(vehicle);
        return "Vehicle registered successfully with ID: " + vehicle.getVehId();
    }

    @Override
    public String transferOfOwnership(Long oldOwnerId, Long newOwnerId, String vehNo) {
        TmRegDetails reg = regRepo.findByVehNo(vehNo);
        if (reg == null) return "Vehicle not found";
        if (!reg.getOwner().getOwnerId().equals(oldOwnerId)) {
            return "Old owner does not match vehicle owner";
        }
        Optional<TmOwnerDetails> newOwnerOpt = ownerRepo.findById(newOwnerId);
        if (newOwnerOpt.isEmpty()) return "New owner not found";
        reg.setOwner(newOwnerOpt.get());
        regRepo.save(reg);
        return "Ownership transferred successfully.";
    }

    @Override
    public List<TmOffenceDetails> fetchUnpaidOffenceDetails(String vehNo) {
        return offenceDetailsRepo.findByVehNoAndOffenceStatusNotIgnoreCase(vehNo, "cleared");
    }

    @Override
    public String registrationOfOwnerWithVehicle(TmOwnerDetails owner, TmRegDetails registration) {
        ownerRepo.save(owner);
        registration.setOwner(owner);
        regRepo.save(registration);
        return "Owner and vehicle registered successfully.";
    }

    @Override
    public String addOffenceType(TmOffence offenceType) {
        offenceRepo.save(offenceType);
        return "Offence type added with ID: " + offenceType.getOffenceId();
    }

    @Override
    public List<TmOffence> listOffenceTypes() {
        return offenceRepo.findAll();
    }

    @Override
    public String deleteOffenceType(Long offenceTypeId) {
        if (!offenceRepo.existsById(offenceTypeId)) {
            return "Offence type not found";
        }
        offenceRepo.deleteById(offenceTypeId);
        return "Offence type deleted successfully.";
    }

    @Override
    public String updateOffenceType(TmOffence offenceType) {
        Optional<TmOffence> existing = offenceRepo.findById(offenceType.getOffenceId());
        if (existing.isEmpty()) {
            return "Offence type not found";
        }
        offenceRepo.save(offenceType);
        return "Offence type updated successfully.";
    }

    @Override
    public String transferOwnershipOnly(Long appNo, Long newOwnerId) {
        Optional<TmRegDetails> regOpt = regRepo.findById(appNo);
        if (regOpt.isEmpty()) return "Vehicle registration not found";
        Optional<TmOwnerDetails> newOwnerOpt = ownerRepo.findById(newOwnerId);
        if (newOwnerOpt.isEmpty()) return "New owner not found";
        TmRegDetails reg = regOpt.get();
        reg.setOwner(newOwnerOpt.get());
        regRepo.save(reg);
        return "Ownership transferred successfully.";
    }

    @Override
    public String clearOffence(Long offenceDetailId) {
        Optional<TmOffenceDetails> offenceOpt = offenceDetailsRepo.findById(offenceDetailId);
        if (offenceOpt.isEmpty()) return "Offence not found";
        TmOffenceDetails offence = offenceOpt.get();
        offence.setOffenceStatus("cleared");
        offenceDetailsRepo.save(offence);
        return "Offence cleared successfully.";
    }

    @Override
    public String deleteOwner(Long ownerId) {
        if (!ownerRepo.existsById(ownerId)) {
            return "Owner not found";
        }
        ownerRepo.deleteById(ownerId);
        return "Owner deleted successfully.";
    }

    @Override
    public String deleteVehicle(String vehNo) {
        TmRegDetails reg = regRepo.findByVehNo(vehNo);
        if (reg == null) {
            return "Vehicle registration not found";
        }
        TmVehicleDetails vehicle = reg.getVehicle();
        regRepo.delete(reg); // Delete the registration first
        if (vehicle != null) {
            vehicleRepo.delete(vehicle); // Then delete the vehicle
        }
        return "Vehicle and registration deleted successfully.";
    }

    @Override
    public List<TmOwnerDetails> listAllOwners() {
        return ownerRepo.findAll();
    }

    @Override
    public List<RegistrationDto> listAllVehicles() {
        List<TmRegDetails> registrations = regRepo.findAllWithVehicleAndOwner();
        return registrations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private RegistrationDto convertToDto(TmRegDetails reg) {
        RegistrationDto regDto = modelMapper.map(reg, RegistrationDto.class);
        if (reg.getVehicle() != null) {
            VehicleDto vehicleDto = modelMapper.map(reg.getVehicle(), VehicleDto.class);
            regDto.setVehicle(vehicleDto);
        }
        return regDto;
    }
    
   
    
    @Override
    public TmRegDetails getRegistrationByVehNoWithVehicleAndOwner(String vehNo) {
        return regRepo.fetchFullRegistration(vehNo);
    }
    
    @Override
    public RegistrationDto getRegistrationDtoByVehNo(String vehNo) {
        TmRegDetails reg = regRepo.fetchFullRegistration(vehNo); // your JOIN FETCH query
        if (reg == null)
            return null;

        RegistrationDto dto = modelMapper.map(reg, RegistrationDto.class);
        dto.setVehicle(modelMapper.map(reg.getVehicle(), VehicleDto.class));
        dto.setOwner(modelMapper.map(reg.getOwner(), OwnerDto.class));
        return dto;
    }

    @Override
    public List<TmOffenceDetails> getTransferBlockingOffences(String vehNo) {
        List<TmOffenceDetails> all = offenceDetailsRepo.findByVehNo(vehNo);
        return all.stream()
            .filter(o -> {
                String status = o.getOffenceStatus();
                return status != null && (status.equalsIgnoreCase("pending") || status.equalsIgnoreCase("penging"));
            })
            .collect(Collectors.toList());
    }

    @Override
    public String markOffenceAsCleared(Long offenceDetailId) {
        Optional<TmOffenceDetails> opt = offenceDetailsRepo.findById(offenceDetailId);
        if (opt.isPresent()) {
            TmOffenceDetails details = opt.get();
            details.setOffenceStatus("cleared");
            offenceDetailsRepo.save(details);
            return "Offence marked as cleared.";
        } else {
            return "Offence not found.";
        }
    }

}
