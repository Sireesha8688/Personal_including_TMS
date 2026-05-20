package cps.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BankAccountDetailsEO {

	private String bankName;
	private String accountNumber;
	private String ifscCode;

}
