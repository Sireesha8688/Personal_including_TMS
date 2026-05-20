package cps.repository;


import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import cps.entities.HospitalClaimEO;

public interface HospitalClaimRepository extends MongoRepository<HospitalClaimEO, ObjectId> {
    List<HospitalClaimEO> findByVerifierAssignedAndVerifierId(Boolean assigned, String verifierId);
}