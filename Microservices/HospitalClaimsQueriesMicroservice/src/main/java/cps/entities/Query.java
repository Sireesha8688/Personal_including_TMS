package cps.entities;


import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
public class Query {

private String queryId;               
    
    private String queryText;
    
    private String queryRequest;
    
    private Boolean attachmentRequired;
    
    private Instant dateRaised;
    
    private String queryResponse;
    
    private List<DocumentDetailEO> attachment;

    public Query() {
    }
}
