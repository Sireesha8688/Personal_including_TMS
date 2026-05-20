package training.iqgateway.service;

import java.util.List;

import training.iqgateway.dto.RegistrationDto;
import training.iqgateway.entities.*;

public interface RTOOperationService {

    String ownerRegistration(TmOwnerDetails owner);

    String vehicleRegistration(TmVehicleDetails vehicle);

    String transferOfOwnership(Long oldOwnerId, Long newOwnerId, String vehNo);

    List<TmOffenceDetails> fetchUnpaidOffenceDetails(String vehNo);

    String registrationOfOwnerWithVehicle(TmOwnerDetails owner, TmRegDetails registration);

    String addOffenceType(TmOffence offenceType);

    List<TmOffence> listOffenceTypes();

    String deleteOffenceType(Long offenceTypeId);

    String updateOffenceType(TmOffence offenceType);

    String transferOwnershipOnly(Long appNo, Long newOwnerId);

    String clearOffence(Long offenceDetailId);

    String deleteOwner(Long ownerId);

    String deleteVehicle(String vehNo);

    List<TmOwnerDetails> listAllOwners();

    List<RegistrationDto> listAllVehicles(); 
    
    TmRegDetails getRegistrationByVehNoWithVehicleAndOwner(String vehNo);
    RegistrationDto getRegistrationDtoByVehNo(String vehNo);
    List<TmOffenceDetails> getTransferBlockingOffences(String vehNo);
    String markOffenceAsCleared(Long offenceDetailId);

}
