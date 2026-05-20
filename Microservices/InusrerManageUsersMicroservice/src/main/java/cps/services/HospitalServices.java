package cps.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import cps.entities.HospitalEO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface HospitalServices {

	public Mono<HospitalEO> addNewHospital(HospitalEO hospitalEO);

	public Flux<HospitalEO> getAllHospitals();

	public Mono<HospitalEO> getHospitalById(ObjectId id);

	public Mono<UpdateResult> updateHospital(ObjectId id, HospitalEO hospitalEO);

	public Mono<HospitalEO> deletehospital(ObjectId id);
}
