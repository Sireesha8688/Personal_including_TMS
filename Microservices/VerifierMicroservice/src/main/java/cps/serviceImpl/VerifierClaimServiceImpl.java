package cps.serviceImpl;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cps.entities.CustomerClaimEO;
import cps.entities.HospitalClaimEO;
import cps.entities.VerifierDocument;
import cps.repository.CustomerClaimRepository;
import cps.repository.HospitalClaimRepository;
import cps.service.VerifierClaimService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;

@Service
@RequiredArgsConstructor
public class VerifierClaimServiceImpl implements VerifierClaimService {
	@Autowired
    private  HospitalClaimRepository hospitalClaimRepo;
	@Autowired
    private  CustomerClaimRepository customerClaimRepo;

    @Override
    public List<HospitalClaimEO> getHospitalClaimsByVerifier(String verifierId) {
        return hospitalClaimRepo.findByVerifierAssignedAndVerifierId(true, verifierId);
    }

    @Override
    public List<CustomerClaimEO> getCustomerClaimsByVerifier(String verifierId) {
        return customerClaimRepo.findByVerifierAssignedAndVerifierId(true, verifierId);
    }

    @Override
    public HospitalClaimEO updateHospitalClaim(String claimId, String verifierComments, String verifierStatus, List<VerifierDocument> documents) {

        ObjectId objId;
        try {
            objId = new ObjectId(claimId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid ObjectId format for claimId: " + claimId);
        }

        Optional<HospitalClaimEO> optional = hospitalClaimRepo.findById(objId);
        if (optional.isEmpty()) {
            throw new RuntimeException("Hospital Claim not found for id: " + claimId);
        }

        HospitalClaimEO claim = optional.get();
        claim.setVerifierComments(verifierComments);
        claim.setVerifierStatus(verifierStatus);
        claim.setVerifierDocuments(documents);
        claim.setUpdatedAt(Instant.now());

        return hospitalClaimRepo.save(claim);
    }

    @Override
    public CustomerClaimEO updateCustomerClaim(String claimId, String verifierComments, String verifierStatus, List<VerifierDocument> documents) {

        ObjectId objId;
        try {
            objId = new ObjectId(claimId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid ObjectId format for claimId: " + claimId);
        }

        Optional<CustomerClaimEO> optional = customerClaimRepo.findById(objId);
        if (optional.isEmpty()) {
            throw new RuntimeException("Customer Claim not found for id: " + claimId);
        }

        CustomerClaimEO claim = optional.get();
        claim.setVerifierComments(verifierComments);
        claim.setVerifierStatus(verifierStatus);
        claim.setVerifierDocuments(documents);
        claim.setUpdatedAt(Instant.now());

        return customerClaimRepo.save(claim);
    }
}
