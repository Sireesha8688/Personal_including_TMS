package cps.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import cps.entities.CustomerEO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CustomerServices {
	
	public Mono<CustomerEO> addNewCustomer(CustomerEO customerEO);
	
	public Flux<CustomerEO> getAllCustomers();
	
	public Mono<CustomerEO> getCustomerById(ObjectId id);
	
	public Mono<CustomerEO> getCustomerByAadharNumber(String aadharCardNumber);
	
	public Mono<UpdateResult> updateCustomer(ObjectId id, CustomerEO customerEO);
	
	public Mono<CustomerEO> deleteCustomer(ObjectId id);

}
