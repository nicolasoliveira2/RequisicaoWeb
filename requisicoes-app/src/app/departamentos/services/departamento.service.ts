import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private registros: AngularFirestoreCollection<Departamento>

  constructor(private toastr: ToastrService, private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Departamento>("departamentos");
  }

  public async inserir(registro: Departamento): Promise<any> {
    if (registro.nome === null) {
      this.toastr.error('Preencha todas as informações', 'Departamento incompleto')
      this.excluir(registro)
    }
    if (registro.telefone === null) {
      this.toastr.error('Preencha todas as informações', 'Departamento incompleto')
      this.excluir(registro)
    }

    const res = await this.registros.add(registro).then(res => {
      registro.id = res.id;
      this.registros.doc(res.id).set(registro);
    })
    this.toastr.success('Departamento inserido com sucesso');
  }

  public async editar(registro: Departamento): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Departamento): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Departamento[]> {
    return this.registros.valueChanges();
  }
}
