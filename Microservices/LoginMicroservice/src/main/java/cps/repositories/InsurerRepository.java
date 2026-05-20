package cps.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.InsurersEO;

@Repository
public interface InsurerRepository extends MongoRepository<InsurersEO,ObjectId>  {

}
