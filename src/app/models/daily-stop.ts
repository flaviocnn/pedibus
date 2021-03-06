// generated with http://json2ts.com/

export interface Notification { id?: any; date: string; isRead: boolean; text: string; priority: number; }

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
    name?: string;
    latitude?: number;
    longitude?: number;
    timeGo?: string;
    timeBack?: string;
    line?: Line2;
    runs?: any[];
    requestedStartAvailabilities?: any[];
    requestedFinishAvailabilities?: any[];
    assignedStartAvailabilities?: any[];
    assignedFinishAvailabilities?: any[];
}

export interface Authority3 {
    authority: string;
}

export interface User {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    status?: any;
    address?: any;
    defaultStop?: Stop;
    administeredLines?: Line[];
    availabilities?: any[];
    parent?: any;
    children: any[];
    roles?: string[];
    enabled?: boolean;
    authorities?: Authority3[];
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    accountNonLocked?: boolean;
}

export interface Reservation {
    id?: number;
    date: string;
    isGo?: boolean;
    isBooked: boolean;
    isConfirmed?: any;
    stop: Stop;
    child: Child;
}

export interface DailyStop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timeGo: string;
    timeBack: string;
    line: Line;
    reservations?: Reservation[];
    runs: any[];
    requestedStartAvailabilities: any[];
    requestedFinishAvailabilities: any[];
    assignedStartAvailabilities: any[];
    assignedFinishAvailabilities: any[];
}

export interface Child {
    id?: number;
    firstName?: string;
    lastName?: string;
    defaultStop?: any;
    parent?: User;
    reservations?: Reservation[];
}

export interface Availability {
    id?: number;
    date?: string;
    isConfirmed?: boolean;
    isGo?: boolean;
    user?: User;
    requestedStop: Stop;
    isModified: boolean;
}


export interface RequestedStartStop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timeGo: string;
    timeBack: string;
    line: Line;
    reservations?: Reservation[];
    runs: any[];
}

export interface JSONLine {
    name?: string;
    stops: Stop[];
    admins: Admin[];
}
