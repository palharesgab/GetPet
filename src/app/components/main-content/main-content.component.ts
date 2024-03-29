import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonAltComponent } from '../button-alt/button-alt.component';
import { PetService, Animal, ImageAnimal } from '../../service/pet.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ButtonAltComponent, CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  @Output() notifyParentEdit = new EventEmitter<void>();
  @Output() notifyParentDelete = new EventEmitter<void>();

  animaisList$: ImageAnimal[] | undefined;
  animaisAbrigoList: ImageAnimal[] | undefined;

  animaisAbrigoMap:Map<number, string> = new Map();

  recieveEditEvent() {
    this.notifyParentEdit.emit();
  }

  recieveDeleteEvent() {
    this.notifyParentDelete.emit();
  }

  createAnnouncement() {
    this.route.params.subscribe((params) => {
    let id = Number(params['id']);
    var url = ('animal-cadastro/' + id)
    this.router.navigate([url]);
  });

  }

  getAnimalByAbrigo(abrigoId: number) {
    if (this.animaisList$ == undefined) return;

    return this.animaisList$.filter(animal => animal.abrigoId === abrigoId);
  }

  constructor(
    private service: PetService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = Number(params['id']);

      this.service.getAnimalList().subscribe((animais: ImageAnimal[]) => {
        this.animaisList$ = animais;
        this.animaisAbrigoList = this.getAnimalByAbrigo(id);
        this.animaisAbrigoList?.forEach(animal => {
          animal.image = `../../../assets/${animal.id}.png`
        })
      });
    });
  }

  deleteAnimal(id: number){
    this.service.deleteAnimal(id).subscribe(res=>{
      location.reload()
    });
  }
}


