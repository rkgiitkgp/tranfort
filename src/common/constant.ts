import e from 'express';

export const postgresErrorCode = {
  uniqueViolation: '23505',
};

export enum AddressType {
  Company_Address = 'company_address',
  Load_Address = 'load_address',
}
