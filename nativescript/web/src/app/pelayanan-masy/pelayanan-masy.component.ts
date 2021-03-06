import {Component, OnInit, OnDestroy} from "@angular/core";
import {Kontak} from "../dataclass/kontak-class";
import {HttpservicesService} from "../services/httpservices.service";
import {StoreserviceService} from "../services/storeservice.service";

@Component({
  selector: 'app-pelayanan-masy',
  templateUrl: './pelayanan-masy.component.html',
  styleUrls: ['./pelayanan-masy.component.css']
})
export class PelayananMasyComponent implements OnInit, OnDestroy {


  private search_katakunci: string = "";
  private listDataKontak: Kontak[] = [];

  constructor(private httpserv: HttpservicesService,
              private stores: StoreserviceService) {
  }

  ngOnInit() {
    this.cekDataKontakStore();
  }

  ngOnDestroy(): void {
  }

  //cek status data yang tersimpan di store data sementara
  //jika data tersedia maka ambil dari cache
  cekDataKontakStore(): void {

    let listDataStore = this.stores.getStorePelayananMasyarakat();
    if (listDataStore.length === 0 || listDataStore === undefined ||
      listDataStore === null) {

      this.getDataKontakInternet();
    }
    else {
      this.listDataKontak = listDataStore;
    }

  }

  //ambil data kontak via internet, urutkan ascending, dan simpan ke store
  getDataKontakInternet(): void {

    this.httpserv.getDaftarPelayananMasyarakat()
      .subscribe(
        (hasils) => {

          if (hasils !== undefined) {
            try {
              this.listDataKontak = this.stores.sortKontakAscending(hasils.kontak);
              this.stores.setStorePelayananMasyarakat(this.listDataKontak);
            } catch (e) {
              console.log(e);
              this.listDataKontak = [];
            }
          }
          else {
            this.listDataKontak = [];
          }
        },
        (error) => {
          console.log(error);
        }
      )
  }

}
