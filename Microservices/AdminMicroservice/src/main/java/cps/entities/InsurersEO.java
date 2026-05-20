package cps.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "insurers")
public class InsurersEO {

    @Id
    private ObjectId _id;

    private String email;

    private String password;

    private String name;
    
    @JsonProperty("_id")
	public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

}
