import { Passenger } from './passenger';

export class Stop {
    id: number;
    name: string;
    time?: string;
    passengers?: Passenger[];
}
