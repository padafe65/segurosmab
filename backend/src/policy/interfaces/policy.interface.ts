export interface PolicyInterface {
  id_policy: string;
  policy_number: string;
  acquisition_date: Date;
  expiration_date: Date;
  cost: number;
  coverage: string;
  insurance_company: string;
  policy_type: string;
  active: boolean;
  user: any;
}
