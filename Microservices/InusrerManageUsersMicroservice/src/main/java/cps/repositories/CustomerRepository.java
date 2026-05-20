package cps.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.CustomerEO;


@Repository
public interface CustomerRepository extends MongoRepository<CustomerEO, ObjectId> {

}
