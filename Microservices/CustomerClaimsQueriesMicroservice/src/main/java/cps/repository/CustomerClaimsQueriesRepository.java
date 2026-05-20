package cps.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.CustomerClaimsQueriesEO;


@Repository
public interface CustomerClaimsQueriesRepository extends MongoRepository<CustomerClaimsQueriesEO, ObjectId> {

}
