package cps.hospitalclaimqueries.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import cps.hospitalclaimqueries.entities.HospitalClaimsQuery;

public interface HospitalClaimsQueryRepository extends MongoRepository<HospitalClaimsQuery, ObjectId> {
	List<HospitalClaimsQuery> findByClaimRaisedId(String claimRaisedId);
}
