package cps.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "verifiers")
public class VerifierEO {

    @Id
    private ObjectId _id;

    private String name;

    private String email;

    private String password;

    private boolean available;

    private List<String> claimTypesAuthorized;
    
    @JsonProperty("_id")
	public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}
}
