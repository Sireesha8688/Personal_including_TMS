package cps.entities;

import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Document(collection="customerclaims")
public class CustomerClaimsEO {
	
	@Id
	private ObjectId _id;
	
	private String customerId;
	
	private String claimTypeId;
	
	private Long costOfTreatment;
	
	private String customerStatus;
	
	private DocumentsEO documents;
	
	private String insurerId;
	
	private String insurerStatus;
	
	private Boolean verifierAssigned;
	
	private String verifierId;
	
	private String verifierComments;
	
	private Boolean verifierStatus;
	
	private List<DocumentDetailEO> verifierDocuments;
	
	private FinalClaimSettlementEO finalClaimSettlement;
	
	private String customerReRaiseClaimMessage;
	
	private Instant createdAt;
	
	private Instant updatedAt;
	
	@JsonProperty("_id")
    public String get_id_asString() {
        return _id != null ? _id.toHexString() : null;
    }

}
