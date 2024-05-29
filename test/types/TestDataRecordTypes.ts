
  export interface BaseTestData {
    id: string;
    isActive: boolean;
    username: string;
    description?: string; // Optional attribute
  }
  export interface TransferPositiveTestCase extends BaseTestData {
    
    from_account_alias: string;
    to_account_alias: string;
    transfer_amount: number;
    expect_transfer_amount: string;
  }
  export interface UserTestData extends BaseTestData {
    
    password: string;
  }
  export interface BankAccountTestData extends BaseTestData {
    
    account_alias: string;
    account_type: string;
    created_from: string;
  }
  export interface TransferNegativeTestCase extends BaseTestData {
    
    from_account_alias: string;
    to_account_alias: string;
    transfer_amount: number;
    description: string;
    expect_error_message: string; // Optional field for expected error message
}