package cps.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FinalClaimSettlementEO {
	
	private Long insurerApprovedAmount;
    private String insurerFinalBill;
    private String insurerMessage;
    
	public FinalClaimSettlementEO() {	
	}
	
	public FinalClaimSettlementEO(Long insurerApprovedAmount, String insurerFinalBill, String insurerMessage) {
		super();
		this.insurerApprovedAmount = insurerApprovedAmount;
		this.insurerFinalBill = insurerFinalBill;
		this.insurerMessage = insurerMessage;
	}
	
	@Override
	public String toString() {
		return "FinalClaimSettlement [insurerApprovedAmount=" + insurerApprovedAmount + ", insurerFinalBill="
				+ insurerFinalBill + ", insurerMessage=" + insurerMessage + "]";
	}
    
    
}
