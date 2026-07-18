import { User } from './user.model';

export interface AdminSummary extends User {
    userCount: number;
    machineCount: number;
}
