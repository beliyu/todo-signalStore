export type Client = {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    lastSeen: string;
}
export type ClientOmitId = Omit<Client, "id">;


export const CLIENTS: Client[] = [
    {
        id: '1', name: 'Petar', surname: 'Petrovic', email: 'petar@gmail.com',
        role: 'Admin', lastSeen: "2023-12-20T10:12:11.351Z"
    },
    {
        id: '2', name: 'Kristina', surname: 'Markovic', email: 'kristina@gmail.com',
        role: 'Commercialist', lastSeen: "2023-12-22T18:18:11.351Z"
    },
    {
        id: '3', name: 'Aleksandar', surname: 'Jovanovic', email: 'aleks@gmail.com',
        role: 'Support', lastSeen: "2023-12-25T15:15:11.351Z"
    },
]

