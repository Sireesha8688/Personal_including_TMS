package cps.entities;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DocumentsEO {

    private List<DocumentDetailEO> hospitalReports;
    private DocumentDetailEO preApprovalLetter;
    private List<DocumentDetailEO> hospitalBills;

    public DocumentsEO() {}

    public DocumentsEO(List<DocumentDetailEO> hospitalReports, DocumentDetailEO preApprovalLetter, List<DocumentDetailEO> hospitalBills) {
        this.hospitalReports = hospitalReports;
        this.preApprovalLetter = preApprovalLetter;
        this.hospitalBills = hospitalBills;
    }
}
