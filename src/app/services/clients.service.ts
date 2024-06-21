import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";
import { Client, ClientOmitId } from "../clients/client.model";

@Injectable({ providedIn: 'root' })

export class ClientService {
    http = inject(HttpClient)
    errorService = inject(ErrorHandlingService)


    getClients() {
        return this.http.get<Client[]>(`/api/clients`).pipe(
            catchError(this.errorService.handleError))
    }

    addClient(client: ClientOmitId) {
        return this.http.post<Client>('/api/clients', client).pipe(
            catchError(this.errorService.handleError))
    }

    delClient(id: string) {
        return this.http.delete<Client>(`/api/clients/${id}`).pipe(
            catchError(this.errorService.handleError))
    }

    updateClient(id: string, cli: Client) {
        return this.http.patch<Client>(`/api/clients/${id}`, cli).pipe(
            catchError(this.errorService.handleError))
    }
}

