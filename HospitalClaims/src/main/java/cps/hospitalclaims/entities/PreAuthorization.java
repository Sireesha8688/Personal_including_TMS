package cps.hospitalclaims.entities;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PreAuthorization {

    private Instant responseDateTime;

    private Integer approvedAmount;

    private String insurerComments;

    public PreAuthorization() {
    }

    public PreAuthorization(Instant responseDateTime, Integer approvedAmount, String insurerComments) {
        this.responseDateTime = responseDateTime;
        this.approvedAmount = approvedAmount;
        this.insurerComments = insurerComments;
    }
//
//    public Instant getResponseDateTime() {
//        return responseDateTime;
//    }
//
//    public void setResponseDateTime(Instant responseDateTime) {
//        this.responseDateTime = responseDateTime;
//    }
//
//    public Integer getApprovedAmount() {
//        return approvedAmount;
//    }
//
//    public void setApprovedAmount(Integer approvedAmount) {
//        this.approvedAmount = approvedAmount;
//    }
//
//    public String getInsurerComments() {
//        return insurerComments;
//    }
//
//    public void setInsurerComments(String insurerComments) {
//        this.insurerComments = insurerComments;
//    }
//
    @Override
    public String toString() {
        return "PreAuthorization{" +
                "responseDateTime=" + responseDateTime +
                ", approvedAmount=" + approvedAmount +
                ", insurerComments='" + insurerComments + '\'' +
                '}';
    }
}
