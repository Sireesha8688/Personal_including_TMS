package cps.entities;

import lombok.Data;

import java.util.List;

@Data
public class ClaimDocuments {
    private List<VerifierDocument> hospitalReports;
    private VerifierDocument preApprovalLetter;
    private List<VerifierDocument> hospitalBills;
}