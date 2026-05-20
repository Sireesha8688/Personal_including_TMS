package cps.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cps.entities.AdminsEO;


@Repository
public interface AdminRepository extends MongoRepository<AdminsEO, ObjectId> {
    // You can define custom query methods here if needed
	
}
