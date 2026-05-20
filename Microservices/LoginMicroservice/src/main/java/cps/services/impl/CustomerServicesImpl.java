package cps.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cps.entities.CustomerEO;
import cps.services.CustomerServices;
import reactor.core.publisher.Mono;

@Service
public class CustomerServicesImpl implements CustomerServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplate;

	@Override
	public Mono<CustomerEO> getCustomerByEmail(String email) {
		Query query = new Query(Criteria.where("email").is(email));
	    return reactiveMongoTemplate.findOne(query,CustomerEO.class);
	}

}
