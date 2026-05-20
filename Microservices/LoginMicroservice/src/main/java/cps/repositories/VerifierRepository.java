package cps.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import cps.entities.VerifierEO;

public interface VerifierRepository extends MongoRepository<VerifierEO, ObjectId>{

}
