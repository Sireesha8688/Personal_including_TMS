package cps.entities;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class QueryDetailsEO {
	
	private Integer queryId;
	
	private String queryText;
	
	private String queryRequest;
	
	private Boolean attachmentRequired;
	
	private Instant dateRaised;
	
	private String queryResponse;
	
	private List<DocumentDetailEO> attachment;

}
