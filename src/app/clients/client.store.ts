import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { ClientService } from "../services/clients.service";
import { computed, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Client, ClientOmitId } from "./client.model";
import { SnackbarService } from "../services/snackbar.service";

export type ServerFilter = "all" | "Admin" | "Commercialist"

type ClientsState = {
    clients: Client[];
    loading: boolean;
    filter: {
        name: string;
        email: string;
        role: string
    };
    page: {
        pageSize: number;
        pageIndex: number
    }
}

const inicialState: ClientsState = {
    clients: [],
    loading: true,
    filter: {
        name: '', email: '', role: ''
    },
    page: {
        pageSize: 5,
        pageIndex: 0,
    }
}

export const ClientsStore = signalStore(
    { providedIn: 'root' },
    withState(inicialState),

    withMethods(
        (store, clientsService = inject(ClientService), snackBarService = inject(SnackbarService)) => ({

            async loadAll() {
                patchState(store, { loading: true });
                const clients = await firstValueFrom(clientsService.getClients())
                patchState(store, { clients, loading: false })
            },
            async addClient(cli: ClientOmitId) {
                const client = await firstValueFrom(clientsService.addClient(cli));
                if (client) {
                    patchState(store, (state) => ({
                        clients: [...state.clients, client]
                    }))
                }
            },
            async delClients(id: string) {
                const delClient = await firstValueFrom(clientsService.delClient(id));
                if (delClient) {
                    patchState(store, (state) => ({
                        clients: state.clients.filter((client) => client.id !== id)
                    }))
                    snackBarService.showSnackbar('Uspesno obrisan klijent', true, 5000);
                }
            },
            async updateClient(id: string, cli: Client) {
                const updCli = await firstValueFrom(clientsService.updateClient(id, cli));
                if (updCli) {
                    patchState(store, (state) => ({
                        clients: state.clients.map((c) =>
                            c.id == id ? updCli : c)
                    })
                    )
                }
            },

            setFilter(filt: { name: string; email: string; role: string; }) {
                patchState(store, (state) => ({ filter: filt }))
            },
            setPage(page: { pageIndex: number; pageSize: number; }) {
                patchState(store, (state) => ({ page: page }))
            },

        })
    ),

    withComputed((state) => ({

        filteredClients: computed(() => {
            let temp = state.clients().filter((c) => {
                return c.role.indexOf(state.filter.role()) > -1;
            });
            temp = temp.filter((c) => {
                return c.email.toLowerCase().indexOf(state.filter.email()) > -1;
            })
            temp = temp.filter((c) => {
                return c.name.toLowerCase().indexOf(state.filter.name()) > -1;
            })

            return temp;
        }),

    }))

);