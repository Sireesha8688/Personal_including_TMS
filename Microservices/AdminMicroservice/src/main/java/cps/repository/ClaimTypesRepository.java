package cps.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.ClaimTypesEO;

@Repository
public interface ClaimTypesRepository extends MongoRepository<ClaimTypesEO, ObjectId>{

}
