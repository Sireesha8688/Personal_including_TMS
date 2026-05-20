package cps.services.impl;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

import cps.entities.HospitalEO;
import cps.services.HospitalServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class HospitalServicesImpl implements HospitalServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplate;

	@Override
	public Mono<HospitalEO> addNewHospital(HospitalEO hospitalEO) {
		return reactiveMongoTemplate.save(hospitalEO);
	}
	
	@Override
	public Flux<HospitalEO> getAllHospitals() {
		return reactiveMongoTemplate.findAll(HospitalEO.class);
	}

	@Override
	public Mono<HospitalEO> getHospitalById(ObjectId id) {
		Query query = new Query(Criteria.where("_id").is(id));
	    return reactiveMongoTemplate.findOne(query, HospitalEO.class);
	}

	@Override
	public Mono<UpdateResult> updateHospital(ObjectId id, HospitalEO hospitalEO) {
		Query query = new Query(Criteria.where("_id").is(id));
		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(hospitalEO, Map.class);
		map.forEach((key, value) -> {
			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		Mono<UpdateResult> result = reactiveMongoTemplate.update(HospitalEO.class).matching(query).apply(update)
				.upsert();

		return result;
	}

	@Override
	public Mono<HospitalEO> deletehospital(ObjectId id) {
		Query query = new Query(Criteria.where("_id").is(id));
	    return reactiveMongoTemplate.findAndRemove(query, HospitalEO.class);
	}
	
	


}
