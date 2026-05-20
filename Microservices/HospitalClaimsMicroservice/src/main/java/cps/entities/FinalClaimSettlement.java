package cps.entities;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class FinalClaimSettlement {

    private Integer insurerApprovedAmount;

    private String insurerFinalBill;

    private String insurerMessage;

    public FinalClaimSettlement() {}

    public FinalClaimSettlement(Integer insurerApprovedAmount, String insurerFinalBill, String insurerMessage) {
        this.insurerApprovedAmount = insurerApprovedAmount;
        this.insurerFinalBill = insurerFinalBill;
        this.insurerMessage = insurerMessage;
    }
//
//    public Integer getInsurerApprovedAmount() { return insurerApprovedAmount; }
//    public void setInsurerApprovedAmount(Integer insurerApprovedAmount) { this.insurerApprovedAmount = insurerApprovedAmount; }
//
//    public String getInsurerFinalBill() { return insurerFinalBill; }
//    public void setInsurerFinalBill(String insurerFinalBill) { this.insurerFinalBill = insurerFinalBill; }
//
//    public String getInsurerMessage() { return insurerMessage; }
//    public void setInsurerMessage(String insurerMessage) { this.insurerMessage = insurerMessage; }
//
    @Override
    public String toString() {
        return "FinalClaimSettlement{" +
                "insurerApprovedAmount=" + insurerApprovedAmount +
                ", insurerFinalBill='" + insurerFinalBill + '\'' +
                ", insurerMessage='" + insurerMessage + '\'' +
                '}';
    }
}
