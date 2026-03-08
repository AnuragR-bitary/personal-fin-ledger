import { v4 as uuidv4 } from 'uuid';
import {
    createPaymentRecord,
    listPaymentsRecord,
    getOwnerIdRecord,
    getBalancesRecord,
} from '../models/payment.model';
import { Payment, Balance, CreatePaymentInput } from '../types';

export const listPayments = async (): Promise<Payment[]> => {
    return await listPaymentsRecord();
};

export const createPayment = async (input: CreatePaymentInput): Promise<Payment> => {
    const ownerId = await getOwnerIdRecord();
    if (!ownerId) throw new Error('Owner not found in users table');

    const id = uuidv4();
    return await createPaymentRecord(id, input.fromUserId, ownerId, input.amount, input.method);
};

export const getBalances = async (): Promise<Balance[]> => {
    const ownerId = await getOwnerIdRecord();
    if (!ownerId) throw new Error('Owner not found in users table');
    return await getBalancesRecord(ownerId);
};
