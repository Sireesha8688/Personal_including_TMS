package cps.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cps.entities.VerifierEO;
import cps.services.VerifierService;
import reactor.core.publisher.Mono;

@Service
public class VerifierServiceImpl implements VerifierService {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplate;

	@Override
	public Mono<VerifierEO> getVerifierByEmail(String email) {
		Query query = new Query(Criteria.where("email").is(email));
	    return reactiveMongoTemplate.findOne(query, VerifierEO.class);
	}

   
}
