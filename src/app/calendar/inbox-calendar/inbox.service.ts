import { map } from 'rxjs/operators';
import { User } from './../../model/user.model';
import { InboxData } from '../../model/inbox.model';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/model/roles.enum';
import { AuthService } from 'src/app/services/auth.service';
import { TimeslotCheck, TimeSlotResponse } from 'src/app/model/timeslot.model';


@Injectable({ providedIn: 'root' })
export class InboxService implements OnInit {
  userphysician:number=0;
  public user: User;
  timeCheck:TimeslotCheck = new TimeslotCheck();
  timeSlotServiceRes:TimeSlotResponse;
  constructor(private http: HttpClient,private authService: AuthService) {
    //this.getAllAppointmentData();
    this.getAllStaffData();
    this.getAllPaientData();
  }
  ngOnInit(): void {
    this.loadStaffData();
    }
  staffNameList: User[] = [];
  patientNameList: User[] = [];
  userEmpId:number=0;
  userRoleId:number=0;
  userEmp:number=0;
  uPhyisicanName:string='';
  disablePhysician:boolean=false;
  //---patient data-----
  patientId:number=0;
  UIpatientName:string='';
  disablePatient:boolean=false;
  onloadFun(){
    this.authService.userInfo.subscribe((res) => {
      this.user = res;
    });
     if( this.user.roleId === 2){
        this.disablePhysician=true;
        this.uPhyisicanName = this.user.title+" "+this.user.firstName+" "+this.user.lastName;
        this.userEmpId=this.user.empId;
        this.timeCheck.physicianEmpId = this.user.empId;
        this.timeCheck.roleId=this.user.roleId;
        this.userRoleId=this.user.roleId;
       
     }else if(this.user.roleId === 4){
      console.log("patient details---------"); 
      console.log(this.user); 
      this.disablePatient=true;
      this.UIpatientName = this.user.firstName+" "+this.user.lastName;
      this.patientId = this.user.userId;
      this.userEmpId=this.user.userId;
      this.userRoleId=this.user.roleId;
      this.timeCheck.patientId = this.user.userId;
     }else{
      this.disablePhysician=false;
      this.userEmpId=this.user.empId;
      this.userRoleId=this.user.roleId;
      this.timeCheck.roleId=this.user.roleId;
      this.timeCheck.patientId = 2;
     }
   }
   getAllAppointmentData(): Observable<InboxData[]> {
    //return this.http.get<InboxData[]>(`${this.HOST_URL}/appointments`)
    console.log(this.userEmpId);
    console.log(this.userRoleId);
    return this.http.get<InboxData[]>(`${this.HOST_URL}/appointments/`+this.userRoleId+"/"+this.userEmpId);
  }

  addAppointment(inbox: InboxData) {
    return this.http
      .post<InboxData>(`${this.HOST_URL}/appointments`, inbox)
      .subscribe(
        (data: any) => {
          console.log('Sucess Post');
        },
        (erorror) => {
          console.log(erorror);
        }
      );
  }

  updateAppointment(appointment: InboxData) {
    this.http
      .put<InboxData>(`${this.HOST_URL}/appointments`, appointment)
      .subscribe(
        (data: any) => {
          console.log('Sucess update');
        },
        (erorror) => {
          console.log(erorror);
        }
      );
  }

  getAppointment(index: number) {
    this.http.get<InboxData>(`${this.HOST_URL}/appointments` + index).subscribe(
      (data: any) => {
        console.log('Sucess get method');
      },
      (erorror) => {
        console.log(erorror);
      }
    );
  }

  deleteAppointment(index: number) {
    this.http
      .delete<InboxData>(`${this.HOST_URL}/appointments/` + index)
      .subscribe(
        (data: any) => {
          console.log('Sucess delete record ' + data);
        },
        (erorror) => {
          console.log(erorror);
        }
      );
  }
  //==================================service data========DB Data===============================================
  HOST_URL = 'http://localhost:8072/api';
  listOfInboxData: InboxData[] = [];
  // getAllAppointmentData(): Observable<InboxData[]> {
  //   return this.http.get<InboxData[]>(`${this.HOST_URL}/appointments`)
  //   //return this.http.get<InboxData[]>(`${this.HOST_URL}/appointments/`+this.roleId+"/"+this.userEmpId);
  // }

  getAllStaffData(): Observable<User[]> {
    return this.http.get<User[]>(`${this.HOST_URL}/appointments/employees`);
  }

  getAllPaientData(): Observable<User[]> {
    return this.http.get<User[]>(`${this.HOST_URL}/appointments/patients`);
  } 
  loadStaffData() {
    this.getAllStaffData().subscribe((res) => {
      res
        .filter((val) => val.roleId == 2)
        .forEach((data:any) => {
          let obj: any = {
            staffName: data.title + ' ' + data.firstName + ' ' + data.lastName,
            id: data.empId,
          };
          this.staffNameList.push(obj);
        });
    });
  }

loadPatientNameData() {
  this.getAllPaientData().subscribe((res) => {
    res.forEach((data) => {
     // console.log(data.firstName);  
      let obj:any = {
          patientName: data.firstName + ' ' + data.lastName,
          pId: data.userId,
        };
        this.patientNameList.push(obj);
      });
  });
}

timeSlotcheck(slotcheck: TimeslotCheck):Observable<TimeSlotResponse> {
  return this.http .post<TimeSlotResponse>(`${this.HOST_URL}/appointments/timeSlotCheck`, slotcheck);
}




}

//    .subscribe(
//     (res)=>{
//       res.map((val:Staff)=>{

//        const obj ={
//         staffName : val.firstName +" "+val.lastName,
//         id:val.empId,
//        }
//         this.staffNameList.push(obj);
//         //console.log(this.count++)
//       })
//     }

//  )

// listOfInboxData:InboxData[]=[

//         new InboxData(
//             1,
//             'Surgery - Andrew',
//             new Date(2021, 9, 25, 12, 30),
//             new Date(2021, 9, 25, 13, 0),
//             'Surgery - Andrew description',
//             222,
//             3
//         ),     new InboxData(
//             2,
//            'Consulting - John',
//            new Date(2021, 9, 25, 14, 0),
//            new Date(2021, 9, 25, 14, 30),
//           'Consulting - John description',
//            223,
//            4
//       ),
//    new InboxData(
//            3,
//            'Therapy - Robert',
//            new Date(2021, 9, 25, 15, 30),
//            new Date(2021, 9, 25, 16, 30),
//            'Therapy - Robert description',
//           226,
//           9),
//    new InboxData(
//            4,
//            'Observation - Steven',
//            new Date(2021, 9, 26, 12, 30),
//            new Date(2021, 9, 26, 13, 30),
//            'Observation - Steven description',
//           229,
//           7),
//    new InboxData(
//            5,
//            'Extraction - Nancy',
//            new Date(2021, 9, 26, 17, 30),
//            new Date(2021, 9, 26, 18, 0),
//            'Extraction - Nancy description',
//           224,
//           1
//    )
// ]

// getAllAppointmentData() {
//     console.log("getAll appointment---------");
//     console.log(this.listOfInboxData);

//     return this.listOfInboxData;
// }

// addAppointment(inbox: InboxData) {

//     this.listOfInboxData.push(inbox);
//     console.log("after push ---------");
//    console.log(this.listOfInboxData);

// }

// updateAppointment(appointment: InboxData){

//     const obj = this.listOfInboxData.find(ele=>ele.Id==appointment.Id);
//     const pos = this.listOfInboxData.indexOf(appointment);
//     console.log("pos ---------"+pos);
//     this.getAllAppointmentData();
// }

// getAppointmentData(index: number) {
//    // if(this.listOfInboxData.filter(find=>find.Id === index))
//    console.log("get appointment---------");
//    console.log(index);
//     return this.listOfInboxData.filter(find=>find.Id === index).map(a=>a);
// }

// deleteAppointment(appointment: InboxData){
//     console.log("Delete appointment---------");
//     console.log(appointment);
//     const pos = this.listOfInboxData.indexOf(appointment);
//     this.listOfInboxData.splice(pos, 1);

// }

//------------------------------------------------------------------------
//console.log("api---"+this.getListOfAppointments());

// listOfInboxData: InboxData[] = [
//     {
//         id: 1,
//         title: 'Surgery - Andrew5',
//         startTime:  'Tue Oct 26 2021 12:30:00 GMT+0530 (India Standard Time)',
//         endTime:  'Tue Oct 26 2021 13:00:00 GMT+0530 (India Standard Time)',
//         description: 'Surgery - Andrew description',
//         physicianId:223,
//         patiendId:36

//     }, {
//         id: 2,
//         title: 'Consulting - John4',
//         startTime: 'Tue Oct 26 2021 14:30:00 GMT+0530 (India Standard Time)',
//         endTime: 'Tue Oct 26 2021 15:00:00 GMT+0530 (India Standard Time)',
//         description: 'Consulting - John description',
//         physicianId:224,
//         patiendId:37
//     }, {
//         id: 3,
//         title: 'Therapy - Robert3',
//         startTime: 'Mon Oct 25 2021 15:30:00 GMT+0530 (India Standard Time)',
//         endTime: 'Mon Oct 25 2021 16:30:00 GMT+0530 (India Standard Time)',
//         description: 'Therapy - Robert description',
//         physicianId:228,
//         patiendId:39
//     }, {
//         id: 4,
//         title: 'Observation - Steven2',
//         startTime: 'Mon Oct 25 2021 12:30:00 GMT+0530 (India Standard Time)',
//         endTime: 'Mon Oct 25 2021 13:00:00 GMT+0530 (India Standard Time)',
//         description: 'Observation - Steven description',
//         physicianId:229,
//         patiendId:31
//     }, {
//         id: 5,
//         title: 'Extraction - Nancy11',
//         startTime: 'Mon Oct 25 2021 14:00:00 GMT+0530 (India Standard Time)',
//         endTime: 'Mon Oct 25 2021 14:30:00 GMT+0530 (India Standard Time)',
//         description: 'Extraction - Nancy description',
//         physicianId:225,
//         patiendId:32
//     }
// ];
//mock data method
// getAllAppointmentData() {
//     console.log(this.listOfInboxData);

//     return this.listOfInboxData;
//     }


// this.getAllStaffData().subscribe((data) => {
//   data.filter(val=>(val.empId === this.userphysician)).map(
//     (userData:any)=>{
        
//     }
//   )
// });