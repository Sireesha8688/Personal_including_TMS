package cps.hospitalclaimqueries.entities;

import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
@Document(collection = "hospitalclaimqueries")
public class HospitalClaimsQuery{

    @Id
    private ObjectId _id;

    

    private String claimRaisedId;

    private String raisedByInsurerId;

    private String queryStatus;

    private List<Query> query;

    private Instant createdAt;

    private Instant updatedAt;

    public HospitalClaimsQuery() {}

    @JsonProperty("_id")
    public String get_id_asString() {
        return _id != null ? _id.toHexString() : null;
    }
}
