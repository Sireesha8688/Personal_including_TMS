package cps.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.HospitalClaim;

@Repository
public interface HospitalClaimRepository extends MongoRepository<HospitalClaim, ObjectId> {
	List<HospitalClaim> findByInsurerIdIsNull();
	List<HospitalClaim> findByHospitalIdAndHospitalStatusAndInsurerStatus(String hospitalId, String hospitalStatus, String insurerStatus);

}
