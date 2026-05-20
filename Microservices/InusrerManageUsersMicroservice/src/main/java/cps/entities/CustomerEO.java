package cps.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Document(collection="customers")
public class CustomerEO {
	
	@Id
    private ObjectId _id;
    private String name;
    private String email;
    private String password;
    private String aadharCardNumber;
    private String date_of_birth;
    private String gender;
    private String blood_group;
    private String mobile_number;
    private AddressEO address;
    private BankAccountDetailsEO bank_account_details;
    private List<PolicyDetailEO> policies;
    
    @JsonProperty("_id")
	public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

}
