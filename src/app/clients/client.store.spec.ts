import { TestBed } from "@angular/core/testing";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { of } from "rxjs";
import { ClientsStore } from "./client.store";
import { ClientService } from "../services/clients.service";
import { CLIENTS } from "./client.model";

describe('clientsStore', () => {
    let clientsStore: any;

    beforeEach(async () => {
        const fakeClientService = jasmine.createSpyObj(
            'ClientsService',
            {
                getClients: of(CLIENTS),
                addClient: of(CLIENTS[0]),
                delClient: of(CLIENTS[0]),
                updateClient: of({ ...CLIENTS[0], name: 'Pera' })
            }
        );

        await TestBed.configureTestingModule({
            providers: [ClientsStore, provideAnimationsAsync(),
                {
                    provide: ClientService,
                    useValue: fakeClientService
                },]
        }).compileComponents();

        clientsStore = TestBed.inject(ClientsStore);
    });

    it('inicial store is corect', () => {

        expect(clientsStore.clients()).toEqual([]);
        expect(clientsStore.loading()).toEqual(true);
        expect(clientsStore.page()).toEqual({
            pageSize: 5,
            pageIndex: 0,
        });
        expect(clientsStore.filter()).toEqual({ name: '', email: '', role: '' });
        expect(clientsStore.filteredClients()).toEqual([]);
    });

    it('loadAll() ', async () => {
        await clientsStore.loadAll();

        expect(await clientsStore.clients()).toEqual(CLIENTS);
        expect(await clientsStore.clients().length).toEqual(3);
    });

    it('addClient() ', async () => {
        await clientsStore.loadAll();
        expect(await clientsStore.clients().length).toEqual(3);
        await clientsStore.addClient(CLIENTS[0])
        expect(await clientsStore.clients().length).toEqual(4);
    });

    it('delClient() ', async () => {
        await clientsStore.loadAll();
        expect(await clientsStore.clients().length).toEqual(3);
        await clientsStore.delClients('1')
        expect(await clientsStore.clients().length).toEqual(2);
    });

    it('updateClient() ', async () => {
        await clientsStore.loadAll();
        await clientsStore.updateClient('1', { id: '1', name: 'Pera' })

        expect(await clientsStore.clients()[0].name).toEqual('Pera');
    });

    it('setFilter() & filteredClients() ', async () => {
        await clientsStore.loadAll();
        expect(await clientsStore.clients().length).toEqual(3);
        expect(await clientsStore.filteredClients().length).toEqual(3);

        await clientsStore.setFilter({ name: '', email: '', role: 'Admin' });
        expect(await clientsStore.filter()).toEqual({ name: '', email: '', role: 'Admin' });
        expect(await clientsStore.filteredClients().length).toEqual(1);
    });

    it('setPage() ', async () => {
        await clientsStore.setPage({ pageSize: 10, pageIndex: 0, });
        expect(await clientsStore.page().pageSize).toEqual(10);

    });
})
