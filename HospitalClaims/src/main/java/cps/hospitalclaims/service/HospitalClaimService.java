package cps.hospitalclaims.service;

import cps.hospitalclaims.entities.HospitalClaim;
import java.util.List;
import java.util.Optional;

public interface HospitalClaimService {

    List<HospitalClaim> getAllClaims();

    Optional<HospitalClaim> getClaimById(String id);

    HospitalClaim createClaim(HospitalClaim claim);

    Optional<HospitalClaim> updateClaim(String id, HospitalClaim claimDetails);

    boolean deleteClaim(String id);

    List<HospitalClaim> getClaimsWhereInsurerIdIsNull();

}
