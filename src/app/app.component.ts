import { Component, OnInit } from '@angular/core';
import { dutyModel } from "./Duties/dutyModel";
import { DutyService } from './Duties/duty.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  title = 'dutieslist';

  // when a task is being edited  

  edited = false;

  // initialize sample duty

  myDuty = new dutyModel('','', false);

  // this array will always store list of duties retrieved from server

  mydutieslist:  dutyModel [] = [];

  //injecting the dataservice

  constructor (private dataservice: DutyService) {
  }

  // submitting the form 
  onSubmit() {      
      this.saveDuty(this.myDuty);
      // resetting the duty value
      this.myDuty = new dutyModel('','', false);
    }

  saveDuty(myDuty: dutyModel){
    // if it is not an editing
    if (!this.edited) {
      if (this.myDuty.name=='') return;
      // saving new duty
        this.dataservice.createDuty({
          name: this.myDuty.name,
          completed: this.myDuty.completed
        }).subscribe(data=> {

          this.displayDutiesList();

      });
    }
    // if we are editing an existing duty
    else {
      this.edited=false;
      console.log('this is being edited',myDuty);
            // update existing duty
      this.dataservice.updateDuty(this.myDuty._id,this.myDuty).subscribe(data =>
        {     
          this.displayDutiesList();
        }       
        );
    }    
  }

  ngOnInit(){
    this.displayDutiesList();
  }
  //this function retrieves the whole array of duties from server, using api service injected
  displayDutiesList() {
    this.dataservice.getDutiesList().subscribe(data =>
      {

        // as the Web Api doesn't sort the list of duties, we do here in the frontend
        this.mydutieslist = data.sort((a,b)=> {
          if (a._id>b._id) return -1;
          if (a._id<b._id) return 1;
          return 0;
        });
        console.log('display', this.mydutieslist);
      });
  }

  //deleting an existing duty

  Delete(id: string) { // without type info
    console.log('delete', id);    
    this.dataservice.deleteDuty(id).subscribe(data =>{
        this.displayDutiesList();
      });
  }
  //editing an existing duty
  Edit(eid: string) { // without type info
    console.log('editing',eid);
    this.myDuty = this.mydutieslist.filter(x=>x._id === eid)[0];
    this.edited = true;   
  }
    //finalizing(crossing) an existing duty
  FinishDuty(eid: string) { // without type info
    console.log('finishing', eid);   
    const myDutyFinished = this.mydutieslist.filter(x=>x._id ==eid )[0];
    myDutyFinished.completed =  !myDutyFinished.completed;
    //calling the update observable
    this.dataservice.updateDuty(eid,myDutyFinished).subscribe(data =>{     
        this.displayDutiesList();
      });
  }
}