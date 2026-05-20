package cps.entities;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "customerclaims")
public class CustomerClaimEO {

    @Id
    private ObjectId _id; // MongoDB ObjectId

    private String customerId;
    private String claimTypeId;
    private Integer costOfTreatment;
    private String customerStatus;

    private ClaimDocuments documents;

    private String insurerId;
    private String insurerStatus;

    // ✅ Verifier Section
    private Boolean verifierAssigned;
    private String verifierId;
    private String verifierComments;
    private String verifierStatus;

    private List<VerifierDocument> verifierDocuments;

    private FinalClaimSettlement finalClaimSettlement;
    private String customerReRaiseClaimMessage;

    private Instant createdAt;
    private Instant updatedAt;

    // Optional: JSON-friendly version of the ObjectId
    public String get_id_asString() {
        return (_id != null) ? _id.toHexString() : null;
    }
}
