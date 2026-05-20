package cps.entities;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "hospitalclaims")
public class HospitalClaimEO {

    @Id
    private ObjectId _id;  // MongoDB ObjectId

    private String hospitalId;
    private String customerName;
    private String customerAadharNumber;
    private String customerId;
    private String treatmentOffered;
    private Integer claimTypeId;
    private Integer estimatedCostToHospital;

    private String hospitalStatus;   // e.g., PRE_AUTH_INITIATED
    private String insurerId;
    private String insurerStatus;

    private PreAuthorization preAuthorization;
    private TreatmentDetails treatmentDetails;

    // ✅ Verifier Section
    private Boolean verifierAssigned;
    private String verifierId;
    private String verifierComments;
    private String verifierStatus; // e.g., approved, pending, rejected
    private List<VerifierDocument> verifierDocuments;

    private FinalClaimSettlement finalClaimSettlement;
    private String hospitalReRaiseClaimMessage;

    private Instant createdAt;
    private Instant updatedAt;

    // Optional helper - expose ObjectId as string if needed
    public String get_id_asString() {
        return (_id != null) ? _id.toHexString() : null;
    }
}
