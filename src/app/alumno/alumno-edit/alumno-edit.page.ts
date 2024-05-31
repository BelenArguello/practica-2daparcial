import { Component, OnInit } from '@angular/core';
import { collection, addDoc, updateDoc, Firestore, doc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alumno-edit',
  templateUrl: './alumno-edit.page.html',
  styleUrls: ['./alumno-edit.page.scss'],
})
export class AlumnoEditPage implements OnInit {
  id: any; //atributo que recibe el id del registro desde la ruta
  isNew : boolean=false;
  alumno: any={};
  
 

  constructor(
    private readonly firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    
    ){}
  

    //metodo de la interfaz OnInit
    ngOnInit() {
      this.route.params.subscribe((params: any) => {
        console.log("params", params);
        this.id = params.id;
        if (params.id == 'new') {
          this.isNew = true;
        } else {
          this.obtenerAlumno(this.id);
        }
      });
    }

  nuevoAlumno = () => {
    this.alumno = {};

    this.router.navigate(["/alumno-edit/new"])
  }

 

  //EditarAlumno
  editarAlumno = () => {
    console.log("Aqui editar firebase");
    const document = doc(this.firestore, "alumno", this.id);

    updateDoc(document, {
      nombre : this.alumno.nombre,
      apellido : this.alumno.apellido,
      ci : this.alumno.ci,
      edad : this.alumno.edad,
      regular : this.alumno.regular,
      fecha_inscripcion : new Date (this.alumno.fecha_inscripcion),
    }).then(doc => {
      console.log("Registro Editado");
      this.router.navigate(['/alumno-list']);
    })
  }

  guardarAlumno = () => {
    if (this.isNew){
      this.incluirAlumno();
    }else{
      this.editarAlumno()
    }
  }

  incluirAlumno = () =>{
    console.log("Aqui incluir en firebase");
    let alumnosRef = collection(this.firestore, "alumno");

    addDoc(alumnosRef, {

      nombre : this.alumno.nombre,
      apellido : this.alumno.apellido,
      ci : this.alumno.ci,
      edad : this.alumno.edad,
      regular : this.alumno.regular,
      fecha_inscripcion : new Date (this.alumno.fecha_inscripcion),
    }).then(doc => {
      console.log("Registro Incluido");
      this.router.navigate(['/alumno-list']);
    }).catch(error => {

    });
  }

  

  obtenerAlumno = async (id: string) => {
    console.log("Aqui editar firebase")
    const document = doc(this.firestore, "alumno", id);
    getDoc(document).then(doc => {
      console.log("Registro a editar", doc.data());
      if(doc.data()){
        this.alumno = doc.data();

        this.alumno.fecha_inscripcion = this.alumno.fecha_inscripcion.toDate().toISOString().substring(0, 10)+"";
      }else{
        this.alumno = {};
      }
      
    });


  }

  // eliminar alumno
  eliminarAlumno = () => {
    console.log("Aqui eliminar en firebase");
    const document = doc(this.firestore, "alumno", this.id);
    deleteDoc(document).then( doc => {
      console.log("Registro Eliminado");
     
      this.router.navigateByUrl('/alumno-list');
    }).catch(error => {
      console.error("Error al eliminar el registro:", error);
    });
  }

}