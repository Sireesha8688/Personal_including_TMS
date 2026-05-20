package cps.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.HospitalEO;


@Repository
public interface HospitalRepository extends MongoRepository<HospitalEO, ObjectId> {

}
