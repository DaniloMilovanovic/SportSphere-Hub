import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FacilityService } from '../../services/facility-service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { Facility } from '../../models/facility';
import { Trainer } from '../../models/trainer';
import { TrainerService } from '../../services/trainer-service';

@Component({
  selector: 'app-admin-component',
  imports: [FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  private trainerService = inject(TrainerService)

  users: User[] = []
  editingUser: User | null = null
  pendingUsers: User[] = []

  pendingFacilities: Facility[] = []

  trainers: Trainer[] = []
  sports: String[] = []
  newSport: String = ""

  ngOnInit(){
    this.userService.setPreviousPath("")

    this.userService.getAllUsers().subscribe(data =>{
      this.users = data
    })

    this.userService.getPendingUsers().subscribe(data =>{
      this.pendingUsers = data
    })

    this.facilityService.getPendingFacilities().subscribe(data =>{
      this.pendingFacilities = data
    })

    this.trainerService.getAllTrainers().subscribe(data =>{
      this.trainers = data
    })

    this.userService.getAvailableSports().subscribe(data =>
      this.sports = data
    )
  }

  modifyUser(u:User){
    this.editingUser = structuredClone(u);
  }

  deleteUser(u:User){
    this.editingUser = null
    this.userService.deleteUser(u).subscribe(data =>{
      this.userService.getAllUsers().subscribe(data =>{
        this.users = data
      })
      this.userService.getPendingUsers().subscribe(data =>{
        this.pendingUsers = data
      })
    })
  }

  acceptUser(u:User){
    this.userService.updateUserStatus(u, "active").subscribe(data =>{
      if(data){
        
        this.userService.getAllUsers().subscribe(data =>{
          this.users = data
        })
        this.userService.getPendingUsers().subscribe(data =>{
          this.pendingUsers = data
        })
      }
    })
  }

  rejectUser(u:User){
    
    this.userService.updateUserStatus(u, "rejected").subscribe(data =>{
      this.userService.getAllUsers().subscribe(data =>{
        this.users = data
      })
      this.userService.getPendingUsers().subscribe(data =>{
        this.pendingUsers = data
      })
    })
  }

  approveFacility(f: Facility){
    f.status = "active"
    this.facilityService.updateFacilityStatus(f).subscribe(data =>{
      this.facilityService.getPendingFacilities().subscribe(data =>{
        this.pendingFacilities = data
      })
    })
  }

  rejectFacility(f: Facility){
    f.status = "rejected"
    this.facilityService.updateFacilityStatus(f).subscribe(data =>{
      this.facilityService.getPendingFacilities().subscribe(data =>{
        this.pendingFacilities = data
      })
    })
  }

  saveEdit(){
    this.userService.updateUser(this.editingUser).subscribe(data =>{
      this.userService.getAllUsers().subscribe(data =>{
        this.users = data
      })
      this.userService.getPendingUsers().subscribe(data =>{
        this.pendingUsers = data
      })
      this.editingUser = null
    })
  }

  cancelEdit(){
    this.editingUser = null
  }

  activateTrainer(t: Trainer){
    t.status = "active"
    this.trainerService.updateTrainerStatus(t).subscribe(data =>{
      this.trainerService.getAllTrainers().subscribe(data =>{
        this.trainers = data
      })
    })
  }

  deactivateTrainer(t: Trainer){
    t.status = "inactive"
    this.trainerService.updateTrainerStatus(t).subscribe(data =>{
      this.trainerService.getAllTrainers().subscribe(data =>{
        this.trainers = data
      })
    })
  }

  addSport(){
    this.userService.addSport(this.newSport).subscribe(data =>{
      this.userService.getAvailableSports().subscribe(data =>
        this.sports = data
      )
    })
  }

  deleteSport(s:String){
    this.userService.deleteSport(s).subscribe(data =>{
      this.userService.getAvailableSports().subscribe(data =>
        this.sports = data
      )
    })
  }

  getUserStatusText(status: String): String{
    switch(status){
      case 'active': return 'Aktivan';
      case 'pending': return 'Na čekanju';
      case 'rejected': return 'Odbijen';
      default: return status;
    }
}

}
