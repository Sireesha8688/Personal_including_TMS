package cps.hospitalclaims.entities;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class TreatmentDetails {

    private Boolean isAdmitted;

    private Instant dateOfAdmission;

    private String admissionNotes;

    private Boolean isDischarged;

    private Instant dateOfDischarge;

    private Integer patientPaidNonMedicalExpenses;

    private String hospitalFinalBill;

    private Integer hospitalFinalBillAmount;

    private String dischargeSummaryUrl;

	public TreatmentDetails() {
		super();
	}

	public TreatmentDetails(Boolean isAdmitted, Instant dateOfAdmission, String admissionNotes, Boolean isDischarged,
			Instant dateOfDischarge, Integer patientPaidNonMedicalExpenses, String hospitalFinalBill,
			Integer hospitalFinalBillAmount, String dischargeSummaryUrl) {
		super();
		this.isAdmitted = isAdmitted;
		this.dateOfAdmission = dateOfAdmission;
		this.admissionNotes = admissionNotes;
		this.isDischarged = isDischarged;
		this.dateOfDischarge = dateOfDischarge;
		this.patientPaidNonMedicalExpenses = patientPaidNonMedicalExpenses;
		this.hospitalFinalBill = hospitalFinalBill;
		this.hospitalFinalBillAmount = hospitalFinalBillAmount;
		this.dischargeSummaryUrl = dischargeSummaryUrl;
	}

//	public Boolean getIsAdmitted() {
//		return isAdmitted;
//	}
//
//	public void setIsAdmitted(Boolean isAdmitted) {
//		this.isAdmitted = isAdmitted;
//	}
//
//	public Instant getDateOfAdmission() {
//		return dateOfAdmission;
//	}
//
//	public void setDateOfAdmission(Instant dateOfAdmission) {
//		this.dateOfAdmission = dateOfAdmission;
//	}
//
//	public String getAdmissionNotes() {
//		return admissionNotes;
//	}
//
//	public void setAdmissionNotes(String admissionNotes) {
//		this.admissionNotes = admissionNotes;
//	}
//
//	public Boolean getIsDischarged() {
//		return isDischarged;
//	}
//
//	public void setIsDischarged(Boolean isDischarged) {
//		this.isDischarged = isDischarged;
//	}
//
//	public Instant getDateOfDischarge() {
//		return dateOfDischarge;
//	}
//
//	public void setDateOfDischarge(Instant dateOfDischarge) {
//		this.dateOfDischarge = dateOfDischarge;
//	}
//
//	public Integer getPatientPaidNonMedicalExpenses() {
//		return patientPaidNonMedicalExpenses;
//	}
//
//	public void setPatientPaidNonMedicalExpenses(Integer patientPaidNonMedicalExpenses) {
//		this.patientPaidNonMedicalExpenses = patientPaidNonMedicalExpenses;
//	}
//
//	public String getHospitalFinalBill() {
//		return hospitalFinalBill;
//	}
//
//	public void setHospitalFinalBill(String hospitalFinalBill) {
//		this.hospitalFinalBill = hospitalFinalBill;
//	}
//
//	public Integer getHospitalFinalBillAmount() {
//		return hospitalFinalBillAmount;
//	}
//
//	public void setHospitalFinalBillAmount(Integer hospitalFinalBillAmount) {
//		this.hospitalFinalBillAmount = hospitalFinalBillAmount;
//	}
//
//	public String getDischargeSummaryUrl() {
//		return dischargeSummaryUrl;
//	}
//
//	public void setDischargeSummaryUrl(String dischargeSummaryUrl) {
//		this.dischargeSummaryUrl = dischargeSummaryUrl;
//	}

	@Override
	public String toString() {
		return "TreatmentDetails [isAdmitted=" + isAdmitted + ", dateOfAdmission=" + dateOfAdmission
				+ ", admissionNotes=" + admissionNotes + ", isDischarged=" + isDischarged + ", dateOfDischarge="
				+ dateOfDischarge + ", patientPaidNonMedicalExpenses=" + patientPaidNonMedicalExpenses
				+ ", hospitalFinalBill=" + hospitalFinalBill + ", hospitalFinalBillAmount=" + hospitalFinalBillAmount
				+ ", dischargeSummaryUrl=" + dischargeSummaryUrl + "]";
	}

    
    
}
