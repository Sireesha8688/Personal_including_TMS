package cps.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentDetailEO {
    private String fileName;
    private String fileUrl;

    public DocumentDetailEO() {}

    public DocumentDetailEO(String fileName, String fileUrl) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
    }
}
