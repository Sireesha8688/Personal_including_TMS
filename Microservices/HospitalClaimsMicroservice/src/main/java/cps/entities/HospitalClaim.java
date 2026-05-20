package cps.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;


@Data
@Document(collection = "hospitalclaims")
public class HospitalClaim {

    @Id
    private ObjectId _id;
    
    private String hospitalId;


    private String customerName;

    private String customerAadharNumber;

    private String customerId;

    private String treatmentOffered;

    private String claimTypeId;

    private Integer estimatedCostToHospital;

    private String hospitalStatus;

    private String insurerId;

    private String insurerStatus;

    private PreAuthorization preAuthorization;

    private TreatmentDetails treatmentDetails;

    private Boolean verifierAssigned;

    private String verifierId;

    private String verifierComments;

    private String verifierStatus;

    private FinalClaimSettlement finalClaimSettlement;

    private String hospitalReRaiseClaimMessage;

    private Instant createdAt;

    private Instant updatedAt;

    private List<VerifierDocument> verifierDocuments;

    // No-args constructor
    public HospitalClaim() {
        super();
    }

//    // Full-args constructor
//    public HospitalClaim(ObjectId _id, String customerName, String customerAadharNumber, String customerId,
//                         String treatmentOffered, Integer claimTypeId, Integer estimatedCostToHospital, String hospitalStatus,
//                         String insurerId, String insurerStatus, PreAuthorization preAuthorization,
//                         TreatmentDetails treatmentDetails, Boolean verifierAssigned, String verifierId,
//                         String verifierComments, String verifierStatus, FinalClaimSettlement finalClaimSettlement,
//                         String hospitalReRaiseClaimMessage, Instant createdAt, Instant updatedAt,
//                         List<VerifierDocument> verifierDocuments) {
//        this._id = _id;
//        this.customerName = customerName;
//        this.customerAadharNumber = customerAadharNumber;
//        this.customerId = customerId;
//        this.treatmentOffered = treatmentOffered;
//        this.claimTypeId = claimTypeId;
//        this.estimatedCostToHospital = estimatedCostToHospital;
//        this.hospitalStatus = hospitalStatus;
//        this.insurerId = insurerId;
//        this.insurerStatus = insurerStatus;
//        this.preAuthorization = preAuthorization;
//        this.treatmentDetails = treatmentDetails;
//        this.verifierAssigned = verifierAssigned;
//        this.verifierId = verifierId;
//        this.verifierComments = verifierComments;
//        this.verifierStatus = verifierStatus;
//        this.finalClaimSettlement = finalClaimSettlement;
//        this.hospitalReRaiseClaimMessage = hospitalReRaiseClaimMessage;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//        this.verifierDocuments = verifierDocuments;
//    }
//
//    // Id getters and setters
//    public ObjectId get_id() {
//        return _id;
//    }
//
//    public void set_id(ObjectId _id) {
//        this._id = _id;
//    }

//    // JSON friendly id getter - returns hex string representation of ObjectId
    @JsonProperty("_id")
    public String get_id_asString() {
        return (_id != null) ? _id.toHexString() : null;
    }
//
//    // Other getters and setters
//
//    public String getCustomerName() {
//        return customerName;
//    }
//
//    public void setCustomerName(String customerName) {
//        this.customerName = customerName;
//    }
//
//    public String getCustomerAadharNumber() {
//        return customerAadharNumber;
//    }
//
//    public void setCustomerAadharNumber(String customerAadharNumber) {
//        this.customerAadharNumber = customerAadharNumber;
//    }
//
//    public String getCustomerId() {
//        return customerId;
//    }
//
//    public void setCustomerId(String customerId) {
//        this.customerId = customerId;
//    }
//
//    public String getTreatmentOffered() {
//        return treatmentOffered;
//    }
//
//    public void setTreatmentOffered(String treatmentOffered) {
//        this.treatmentOffered = treatmentOffered;
//    }
//
//    public Integer getClaimTypeId() {
//        return claimTypeId;
//    }
//
//    public void setClaimTypeId(Integer claimTypeId) {
//        this.claimTypeId = claimTypeId;
//    }
//
//    public Integer getEstimatedCostToHospital() {
//        return estimatedCostToHospital;
//    }
//
//    public void setEstimatedCostToHospital(Integer estimatedCostToHospital) {
//        this.estimatedCostToHospital = estimatedCostToHospital;
//    }
//
//    public String getHospitalStatus() {
//        return hospitalStatus;
//    }
//
//    public void setHospitalStatus(String hospitalStatus) {
//        this.hospitalStatus = hospitalStatus;
//    }
//
//    public String getInsurerId() {
//        return insurerId;
//    }
//
//    public void setInsurerId(String insurerId) {
//        this.insurerId = insurerId;
//    }
//
//    public String getInsurerStatus() {
//        return insurerStatus;
//    }
//
//    public void setInsurerStatus(String insurerStatus) {
//        this.insurerStatus = insurerStatus;
//    }
//
//    public PreAuthorization getPreAuthorization() {
//        return preAuthorization;
//    }
//
//    public void setPreAuthorization(PreAuthorization preAuthorization) {
//        this.preAuthorization = preAuthorization;
//    }
//
//    public TreatmentDetails getTreatmentDetails() {
//        return treatmentDetails;
//    }
//
//    public void setTreatmentDetails(TreatmentDetails treatmentDetails) {
//        this.treatmentDetails = treatmentDetails;
//    }
//
//    public Boolean getVerifierAssigned() {
//        return verifierAssigned;
//    }
//
//    public void setVerifierAssigned(Boolean verifierAssigned) {
//        this.verifierAssigned = verifierAssigned;
//    }
//
//    public String getVerifierId() {
//        return verifierId;
//    }
//
//    public void setVerifierId(String verifierId) {
//        this.verifierId = verifierId;
//    }
//
//    public String getVerifierComments() {
//        return verifierComments;
//    }
//
//    public void setVerifierComments(String verifierComments) {
//        this.verifierComments = verifierComments;
//    }
//
//    public String getVerifierStatus() {
//        return verifierStatus;
//    }
//
//    public void setVerifierStatus(String verifierStatus) {
//        this.verifierStatus = verifierStatus;
//    }
//
//    public FinalClaimSettlement getFinalClaimSettlement() {
//        return finalClaimSettlement;
//    }
//
//    public void setFinalClaimSettlement(FinalClaimSettlement finalClaimSettlement) {
//        this.finalClaimSettlement = finalClaimSettlement;
//    }
//
//    public String getHospitalReRaiseClaimMessage() {
//        return hospitalReRaiseClaimMessage;
//    }
//
//    public void setHospitalReRaiseClaimMessage(String hospitalReRaiseClaimMessage) {
//        this.hospitalReRaiseClaimMessage = hospitalReRaiseClaimMessage;
//    }
//
//    public Instant getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(Instant createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public Instant getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(Instant updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//
//    public List<VerifierDocument> getVerifierDocuments() {
//        return verifierDocuments;
//    }
//
//    public void setVerifierDocuments(List<VerifierDocument> verifierDocuments) {
//        this.verifierDocuments = verifierDocuments;
//    }
//
//    @Override
//    public String toString() {
//        return "HospitalClaim{" +
//                "_id=" + _id +
//                ", customerName='" + customerName + '\'' +
//                ", customerAadharNumber='" + customerAadharNumber + '\'' +
//                ", customerId='" + customerId + '\'' +
//                ", treatmentOffered='" + treatmentOffered + '\'' +
//                ", claimTypeId=" + claimTypeId +
//                ", estimatedCostToHospital=" + estimatedCostToHospital +
//                ", hospitalStatus='" + hospitalStatus + '\'' +
//                ", insurerId='" + insurerId + '\'' +
//                ", insurerStatus='" + insurerStatus + '\'' +
//                ", preAuthorization=" + preAuthorization +
//                ", treatmentDetails=" + treatmentDetails +
//                ", verifierAssigned=" + verifierAssigned +
//                ", verifierId='" + verifierId + '\'' +
//                ", verifierComments='" + verifierComments + '\'' +
//                ", verifierStatus='" + verifierStatus + '\'' +
//                ", finalClaimSettlement=" + finalClaimSettlement +
//                ", hospitalReRaiseClaimMessage='" + hospitalReRaiseClaimMessage + '\'' +
//                ", createdAt=" + createdAt +
//                ", updatedAt=" + updatedAt +
//                ", verifierDocuments=" + verifierDocuments +
//                '}';
//    }
}
