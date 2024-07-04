import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ClientService } from './clients.service';
import { ErrorHandlingService } from './error-handling.service';
import { CLIENTS } from '../clients/client.model';


describe('Clients service', () => {
    let service: ClientService;
    let errorService: ErrorHandlingService;
    let httpTesting: HttpTestingController;

    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [ClientService, provideHttpClient(), provideHttpClientTesting(), ErrorHandlingService]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        service = TestBed.inject(ClientService);
        errorService = TestBed.inject(ErrorHandlingService);
    });

    it('should get clients', async () => {
        const clients$ = service.getClients();
        const clientsPromise = firstValueFrom(clients$);
        const req = httpTesting.expectOne('/api/clients');
        expect(req.request.method).toBe('GET');

        req.flush(CLIENTS);
        expect(await clientsPromise).toEqual(CLIENTS);
    });

    it('should add client', async () => {
        const clients$ = service.addClient(CLIENTS[0]);
        const clientsPromise = firstValueFrom(clients$);
        const req = httpTesting.expectOne('/api/clients');
        expect(req.request.method).toBe('POST');

        req.flush(CLIENTS[0]);
        expect(await clientsPromise).toEqual(CLIENTS[0]);
    });

    it('should del client', async () => {
        const clients$ = service.delClient('1');
        const clientsPromise = firstValueFrom(clients$);
        const req = httpTesting.expectOne('/api/clients/1');
        expect(req.request.method).toBe('DELETE');

        req.flush(CLIENTS[0]);
        expect(await clientsPromise).toEqual(CLIENTS[0]);
    });

    it('should update client', async () => {
        const clients$ = service.updateClient('1', CLIENTS[0]);
        const clientsPromise = firstValueFrom(clients$);
        const req = httpTesting.expectOne('/api/clients/1');
        expect(req.request.method).toBe('PATCH');

        req.flush(CLIENTS[0]);
        expect(await clientsPromise).toEqual(CLIENTS[0]);
    });

    it('should handle backend error client', async () => {
        const mySpy = spyOn(errorService , 'handleError');
        const clients$ = service.delClient('1');
        const clientsPromise = firstValueFrom(clients$);
        const req = httpTesting.expectOne('/api/clients/1');
        expect(req.request.method).toBe('DELETE');

        req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});
        expect(mySpy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        httpTesting.verify();
    });
});