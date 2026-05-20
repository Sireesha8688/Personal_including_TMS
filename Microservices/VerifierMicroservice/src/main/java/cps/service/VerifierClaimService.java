package cps.service;

import cps.entities.CustomerClaimEO;
import cps.entities.HospitalClaimEO;
import cps.entities.VerifierDocument;

import java.util.List;

public interface VerifierClaimService {

    List<HospitalClaimEO> getHospitalClaimsByVerifier(String verifierId);

    List<CustomerClaimEO> getCustomerClaimsByVerifier(String verifierId);

    HospitalClaimEO updateHospitalClaim(String claimId, String verifierComments, String verifierStatus, List<VerifierDocument> documents);

    CustomerClaimEO updateCustomerClaim(String claimId, String verifierComments, String verifierStatus, List<VerifierDocument> documents);
}
