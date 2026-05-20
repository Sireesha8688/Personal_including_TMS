package cps.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import cps.entities.ClaimTypesEO;

public interface ClaimTypesService {
    ClaimTypesEO addClaimType(ClaimTypesEO claimType);
    List<ClaimTypesEO> getAllClaimTypes();
    Optional<ClaimTypesEO> getClaimTypeById(ObjectId id);
    ClaimTypesEO updateClaimType(ObjectId id, ClaimTypesEO claimType);
    void deleteClaimType(ObjectId id);
}
