// generated with http://json2ts.com/

export interface Authority {
    authority: string;
}

export interface Admin {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    status?: any;
    address: string;
    defaultStop?: any;
    availabilities: any[];
    reservations: any[];
    parent?: any;
    children: any[];
    roles: string[];
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}

export interface Line {
    id: number;
    name: string;
    admins: Admin[];
}

export interface Authority2 {
    authority: string;
}

export interface Admin2 {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    status?: any;
    address: string;
    defaultStop?: any;
    availabilities: any[];
    reservations: any[];
    parent?: any;
    children: any[];
    roles: string[];
    enabled: boolean;
    authorities: Authority2[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}

export interface Line2 {
    id: number;
    name: string;
    admins: Admin2[];
}

export interface Stop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timeGo: string;
    timeBack: string;
    line: Line2;
    runs: any[];
    requestedStartAvailabilities: any[];
    requestedFinishAvailabilities: any[];
    assignedStartAvailabilities: any[];
    assignedFinishAvailabilities: any[];
}

export interface Authority3 {
    authority: string;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    status?: any;
    address?: any;
    defaultStop?: any;
    administeredLines: any[];
    availabilities: any[];
    parent?: any;
    children: any[];
    roles: string[];
    enabled: boolean;
    authorities: Authority3[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}

export interface Reservation {
    id?: number;
    date: string;
    isGo?: boolean;
    isBooked: boolean;
    isConfirmed?: any;
    stop: Stop;
    user: User;
}

export interface DailyStop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timeGo: string;
    timeBack: string;
    line: Line;
    reservations: Reservation[];
    runs: any[];
    requestedStartAvailabilities: any[];
    requestedFinishAvailabilities: any[];
    assignedStartAvailabilities: any[];
    assignedFinishAvailabilities: any[];
}

