package cps.entities;

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
@Document(collection="hospitals")
public class HospitalEO {
	
	@Id
    private ObjectId _id;
    private String name;
    private String email;
    private String password;
    private AddressEO address;
    private ContactInfoEO contact_info;
    private BankAccountDetailsEO bankDetails;
    
    @JsonProperty("_id")
	public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

}
