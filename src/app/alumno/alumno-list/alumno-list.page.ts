import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, getDocs, limit, query, where, startAfter } from '@angular/fire/firestore';
import { InfiniteScrollCustomEvent } from '@ionic/angular';




@Component({
  selector: 'app-alumno-list',
  templateUrl: './alumno-list.page.html',
  styleUrls: ['./alumno-list.page.scss'],
})
export class AlumnoListPage implements OnInit {

  constructor(private readonly firestore: Firestore) { 
    
  }

  listaAlumnos = new Array();
  isSearch: boolean = false;
  query = "";
  lastVisible: any = null;
  li = 10;
  results: any[] = [];
 
 
  
  ngOnInit() {
    console.log("ngOnInit");
    this.listaAlumnos = new Array();
    this.lastVisible = null;
    this.listarAlumnos();
  }

  ionViewWillEnter() {
    console.log("Registro Actualizado")
    this.listaAlumnos = [];
    this.lastVisible = null;
    this.listarAlumnos();
  }

  

  
  
  listarAlumnosSinFiltro = () => {
   
    const alumnosRef = collection(this.firestore, 'alumno');
    let q;
  
    if (!this.lastVisible){
      q = query(alumnosRef, limit(this.li));
    } else {
      q = query(alumnosRef, limit(this.li), startAfter(this.lastVisible));
    }
  
    getDocs(q).then(re => {
      if (!re.empty) {
        this.lastVisible = re.docs[re.docs.length - 1];
        re.forEach(doc => {
          let alumno: any = doc.data();
          alumno.id = doc.id;
  
          // Formatear la fecha
          if (alumno.fecha_inscripcion && alumno.fecha_inscripcion.toDate) {
            alumno.fecha_inscripcion = alumno.fecha_inscripcion.toDate().toLocaleDateString();
          }
  
          this.listaAlumnos.push(alumno);
        });
      }
    });
  }
  

  listarAlumnos = () => {
    console.log("listar alumnos");
    const alumnosRef = collection(this.firestore, 'alumno');
  
    if ((this.query + "").length > 0) {
      let q = undefined;
      if (this.lastVisible) {
        q = query(alumnosRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li),
          startAfter(this.lastVisible));
      } else {
        q = query(alumnosRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li));
      }
  
      getDocs(q).then(re => {
        if (!re.empty) {
          // Retirar lo que no corresponde
          let nuevoArray = new Array();
          for (let i = 0; i < re.docs.length; i++) {
            const doc: any = re.docs[i].data();
  
            if (doc.nombre.toUpperCase().startsWith(this.query.toUpperCase().charAt(0))) {
              nuevoArray.push(re.docs[i]);
            }
          }
  
          this.lastVisible = re.docs[nuevoArray.length - 1];
          for (let i = 0; i < nuevoArray.length; i++) {
            const doc: any = nuevoArray[i];
            let alumno: any = doc.data();
            alumno.id = doc.id;
  
            // Formatear la fecha
            if (alumno.fecha_inscripcion && alumno.fecha_inscripcion.toDate) {
              alumno.fecha_inscripcion = alumno.fecha_inscripcion.toDate().toLocaleDateString();
            }
  
            this.listaAlumnos.push(alumno);
          }
        }
      });
    } else {
      this.listarAlumnosSinFiltro();
    }
  }
  
  

onIonInfinite(ev: any) {
  this.listarAlumnos();
  setTimeout(() => {
    (ev as InfiniteScrollCustomEvent).target.complete();
  }, 500);
}


  clickSearch = () => {
    this.isSearch = true;
  }

  clearSearch = () => {
    this.isSearch = false;
    this.query = "";

    this.listaAlumnos = new Array();
    this.lastVisible = null;
    this.listarAlumnos();
  }

  buscarSearch = (e:any) => {
    this.isSearch = false;
    this.query = e.target.value;

    this.listaAlumnos = new Array();
    this.lastVisible = null;
    this.listarAlumnos();

  }

  


}
