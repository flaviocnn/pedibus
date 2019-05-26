import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let lines = [
            {
                id: 'A',
                date: new Date(2011, 9, 11),
                path: [
                    {
                        id: 253,
                        name: 'Porta Nuova',
                        passengers: [
                            { name: 'Silvia' },
                            { name: 'Giulia' },
                            { name: 'Flavio' },
                        ]
                    },
                    {
                        id: 254,
                        name: 'Porta Susa',
                        passengers: [
                            { name: 'Silvio' },
                            { name: 'Alessandro' },
                            { name: 'Francesco' },
                        ]
                    },
                    {
                        id: 255,
                        name: 'XVIII Dicembre',
                        passengers: [
                            { name: 'Gabriella' },
                            { name: 'Carmelo' },
                            { name: 'Mattia' },
                        ]
                    }
                ]
            },

            {
                id: 'A',
                date: new Date(2011, 9, 12),
                path: [
                    {
                        id: 253,
                        name: 'Porta Nuova',
                        passengers: [
                            { name: 'Giulia' },
                            { name: 'Flavio' },
                        ]
                    },
                    {
                        id: 254,
                        name: 'Porta Susa',
                        passengers: [
                            { name: 'Francesco' },
                        ]
                    },
                    {
                        id: 255,
                        name: 'XVIII Dicembre',
                        passengers: [
                            { name: 'Gabriella' },
                            { name: 'Carmelo' },
                            { name: 'Mattia' },
                        ]
                    }
                ]
            },

            {
                id: 'A',
                date: new Date(2011, 9, 13),
                path: [
                    {
                        id: 253,
                        name: 'Porta Nuova',
                        passengers: [
                            { name: 'Flavio' },
                        ]
                    },
                    {
                        id: 254,
                        name: 'Porta Susa',
                        passengers: [
                            { name: 'Silvio' },
                        ]
                    },
                    {
                        id: 255,
                        name: 'XVIII Dicembre',
                        passengers: [
                            { name: 'Mattia' },
                        ]
                    }
                ]
            },
        ];

        let stops = [
            {
                id: 1,
                name: 'XVIII Dicembre',
                time: '7:45',
                passengers: [
                    {
                        id: 21,
                        name: 'Mattia',
                        reserved: 'false'
                    },
                ]
            },
            {
                id: 2,
                name: 'Porta Susa',
                time: '8:05',
                passengers: [
                    {
                        id: 22,
                        name: 'Giulia',
                        reserved: 'true'
                    },
                    {
                        id: 23,
                        name: 'Flavio',
                        reserved: 'false'
                    },
                ]
            },
            {
                id: 3,
                name: 'Porta Nuova',
                time: '8:15',
                passengers: [
                    {
                        id: 24,
                        name: 'Pier',
                        reserved: 'true'
                    },
                ]
            },

            {
                id: 1,
                name: 'Porta Nuova',
                time: '13:45',
                passengers: [
                    {
                        id: 21,
                        name: 'Mattia',
                        reserved: 'true'
                    },
                ]
            },
            {
                id: 2,
                name: 'Porta Susa',
                time: '14:05',
                passengers: [
                    {
                        id: 22,
                        name: 'Giulia',
                        reserved: 'true'
                    },
                    {
                        id: 23,
                        name: 'Flavio',
                        reserved: 'false'
                    },
                ]
            },
            {
                id: 3,
                name: 'XVII Dicembre',
                time: '14:15',
                passengers: [
                    {
                        id: 24,
                        name: 'Pier',
                        reserved: 'true'
                    },
                ]
            }

        ]

        return { lines, stops };
    }
}
