import {Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {
  Schedule, Button, InputText, Calendar, Dialog, Checkbox, TabPanel, TabView,
  CodeHighlighter, Dropdown, SplitButton, SplitButtonItem, MultiSelect, InputSwitch, Growl, InputMask
} from "primeng/primeng";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup, FormArray, REACTIVE_FORM_DIRECTIVES
} from '@angular/forms';
import {OrderModel} from './order';
import {OrderService} from '../../service/order.service';
import {SelectorsService} from '../../service/selectors.service';
import {HeavyItemType} from './enums/heavy-item.enum';
import {StorageSizeType} from './enums/storage-size.enum';
import {TotalHourType} from './enums/total-hour.enum';
import {StatusType} from './enums/status.enum';
import {PaymentPrice} from './payment-price';
import {CompanyPrice} from './company-price';

import {MoversType,PaymentMethodType,TariffType,RatePerHourType,
  PackageMaterialType,ShrinkType, TapeType,CompanyType,AdvertisementType,
SizeOfMoveType, TruckType} from './enums/all-enums'
// import { CompanyType1 } from './advertisement-type'
//TODO: Попрорбовать еще раз enum в другом классе!


@Component({
  templateUrl: 'app_ts/content/order/template/order.html',
  styleUrls: ['src/css/ghoul.css'],
  directives: [Schedule, Button, InputText, Calendar,
    Dialog, Checkbox, TabPanel, TabView,
    Button, CodeHighlighter, SplitButton,InputMask,
    SplitButtonItem, MultiSelect, InputSwitch, Growl,
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES],
  providers: [HTTP_PROVIDERS, OrderService, SelectorsService],
})

export class OrderComponent implements OnInit {
  private selectedCompany:string;
  private orderForm:FormGroup;
  private timeModel:OrderModel;
  private paymentPrice:PaymentPrice;
  private companyPrice:{[id:string]:CompanyPrice};
  private val2:number;


  private moverType:MoversType;//текущее количество выбранных movers


  // Arrays for selectors...
  private time:string [];
  private sizeOfMove:SizeOfMoves[];
  private companies:Companies[];
  private advertisements:Advertisements[];
  private tariffs:Tariffs[];
  private trucks:Trucks[];
  private movers:Movers[];
  private paymentMethods:PaymentMethods[];
  private ratePerHour:RatePerHours[];
  private packageMaterials:PackingMaterial[];
  private shrinks:Shrinks[];
  private tapes:Tape[];
  private heavyItems:HeavyItem[];
  private storageSizes:StorageSize[];
  private totalHours:TotalHour[];
  private display:boolean = false;
  private msgs:Message[];
  private status:Status[];
  private date:Date = new Date();

  private initCompanyPrice() {

    this.companyPrice = {
      'Shark': {
        two: 75,
        three: 105,
        four: 135,
        five: 165,
        six: 225,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },
      'Apple': {
        two: 75,
        three: 105,
        four: 135,
        five: 165,
        six: 225,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },
      'Muscle': {
        two: 75,
        three: 105,
        four: 135,
        five: 165,
        six: 225,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },
      'Pacific': {
        two: 85,
        three: 115,
        four: 145,
        five: 175,
        six: 235,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },
      'Lions': {
        two: 75,
        three: 105,
        four: 135,
        five: 165,
        six: 225,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },
      'Royal': {
        two: 75,
        three: 105,
        four: 135,
        five: 165,
        six: 225,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      }
    }
  }

  private initPaymentPrice() {
    this.paymentPrice = new PaymentPrice();
    this.paymentPrice.ratePerHourPrice = 0;
    this.paymentPrice.serviceChargePrice = 30;
    this.paymentPrice.discount = 0;
    this.paymentPrice.heavyItemPrice = 0;
    this.paymentPrice.packingMaterialPrice = 0;
    this.paymentPrice.shrinkPrice = 0;
    this.paymentPrice.sizeOfStorageSizePrice = 0;
    this.paymentPrice.tapesPrice = 0;
    this.paymentPrice.totalHourPrice = 0;
    this.paymentPrice.ddtPrice = 0;

  }

  constructor(private _fb:FormBuilder,
              private _orderService:OrderService,
              private _selectorsService:SelectorsService) {
    this.timeModel = new OrderModel();

    this.orderForm = this._fb.group({

      // 'client': _fb.group({
      //     name: [this.timeModel.client.fullName, Validators.required],
      //     email: new FormControl(this.timeModel.client.mail,Validators.required),
      //     phone: new FormControl(this.timeModel.client.phone,Validators.required),

      // }),
      // 'name': new FormControl(this.timeModel.client.fullName,Validators.required),
      // 'email': new FormControl(this.timeModel.client.mail,Validators.required),
      // 'phone': new FormControl(this.timeModel.client.phone,Validators.required),

      'fullName': new FormControl(this.timeModel.orderForm.fullName, Validators.required),
      'mail': new FormControl(this.timeModel.orderForm.mail, Validators.required),
      'phoneNumber': new FormControl(this.timeModel.orderForm.phoneNumber, Validators.required),
      // 'client':this._fb.array([
      //     this.initClientInfo(),
      // ]),
      'loadingAddress': this._fb.array([
        this.initAddressFrom(),
      ]),
      'unLoadingAddress': this._fb.array([
        this.initAddressTo(),
      ]),

 
      'addressTo': new FormControl('', Validators.required),
      'zipTo': new FormControl(this.timeModel.orderForm.zipTo, Validators.required),

      'moveDate': new FormControl(this.timeModel.orderForm.moveDate, Validators.required),
      'startTime': new FormControl(this.timeModel.orderForm.moveDateTime, Validators.required),

      'packageDate': new FormControl(this.timeModel.orderForm.packingDate, Validators.required),
      'packingStartTime': new FormControl(this.timeModel.orderForm.packingDateTime, Validators.required),

      'estimateDate': new FormControl(this.timeModel.orderForm.estimateDate, Validators.required),
      'estimateStartTime': new FormControl(this.timeModel.orderForm.estimateDateTime, Validators.required),
      'estimateEndTime': new FormControl(this.timeModel.estimateEndTime, Validators.required),

      'isLabor': new FormControl(this.timeModel.orderForm.isLabor, Validators.required),
      'storageDate': new FormControl(this.timeModel.paymentDetailsForm.storageDate, Validators.required),

      //Payment-details Form:

      'selectCompany': new FormControl('', Validators.required),
  


    });
  }

  initAddressFrom() {
    // initialize our address
    return this._fb.group({
      address: ['', Validators.required],
      zip: ['']
    });
  }

  initAddressTo() {
    // initialize our address
    return this._fb.group({
      address: ['', Validators.required],
      zip: ['']
    });
  }

  initClientInfo() {
    // initialize our address
    return this._fb.group({
      'fullName': ['', Validators.required],
      'mail': ['', Validators.required],
      'phoneNumber': ['', Validators.required],
    });
  }

/**
 * Добавляет новое поле для адресса и зипа
 */
  addAddressFrom() {
    // add address to the list
    const control = <FormArray>this.orderForm.controls['loadingAddress'];
    control.push(this.initAddressFrom());
    console.log('selectedCompany:' + this.selectedCompany);
    console.log('formValue:' + JSON.stringify(this.orderForm.value));
  }

  addAddressTo() {
    const control = <FormArray>this.orderForm.controls['unLoadingAddress'];
    control.push(this.initAddressTo());
    console.log('formValue:' + JSON.stringify(this.orderForm.value));
  }

/**
 * Удаляет выбранное поле адресса и зипа
 */
  removeAddressFrom(i:number) {
    const control = <FormArray>this.orderForm.controls['loadingAddress'];
    control.removeAt(i);
  }

  removeAddressTo(i:number) {
    const control = <FormArray>this.orderForm.controls['unLoadingAddress'];
    control.removeAt(i);
  }

/*
  Метод, присваивающий значения с формы в поля бизнесс сущности
**/
  private createEntityes() {
    this.timeModel.orderForm.fullName = this.orderForm.controls['fullName'].value;
    this.timeModel.orderForm.mail = this.orderForm.controls['mail'].value;
    this.timeModel.orderForm.phoneNumber = this.orderForm.controls['phoneNumber'].value;


    this.timeModel.orderForm.loadingAddress = this.orderForm.controls['loadingAddress'].value;
    this.timeModel.orderForm.unloadingAddress = this.orderForm.controls['unLoadingAddress'].value;
    this.timeModel.orderForm.moveDate = this.orderForm.controls['moveDate'].value;
    this.timeModel.orderForm.moveDateTime = this.orderForm.controls['startTime'].value;
    this.timeModel.orderForm.packingDate = this.orderForm.controls['packageDate'].value;
    this.timeModel.orderForm.packingDateTime = this.orderForm.controls['packingStartTime'].value;
    this.timeModel.orderForm.estimateDate = this.orderForm.controls['estimateDate'].value;
    this.timeModel.orderForm.estimateDateTime = this.orderForm.controls['estimateStartTime'].value;
    this.timeModel.orderForm.storageDate = this.orderForm.controls['storageDate'].value;


    this.timeModel.orderForm.moveDateTime = this.timeMove;
    this.timeModel.orderForm.packingDateTime = this.timePackage;
    this.timeModel.orderForm.estimateDateTime = this.timeEstimate;

    
    //Prices
     this.timeModel.paymentDetailsForm.ratePerHour = this.paymentPrice.ratePerHourPrice;
     this.timeModel.paymentDetailsForm.ddt = this.paymentPrice.ddtPrice;
     this.timeModel.paymentDetailsForm.tapeValue = this.paymentPrice.tapesPrice;
     this.timeModel.paymentDetailsForm.shrinkValue = this.paymentPrice.shrinkPrice;
     this.timeModel.paymentDetailsForm.discount = this.paymentPrice.discount;
     this.timeModel.paymentDetailsForm.packingMaterialsValue = this.paymentPrice.packingMaterialPrice;

  }

  private createTestEntityes(){
    //fill orderFrom
    this.timeModel.orderForm.advertisement='advertisement';
     this.timeModel.orderForm.company='testCompany';
      this.timeModel.orderForm.estimateDate='2016-08-08';
       this.timeModel.orderForm.estimateDateTime='03:00-04:00 a.m.'
        this.timeModel.orderForm.fullName='testFullName';
         this.timeModel.orderForm.isLabor=true;
          this.timeModel.orderForm.loadingAddress= [
            {address:'testAddressFrom1',zip:1111,floor:1},
            {address:'testAddressFrom2',zip:2222,floor:2}]
          this.timeModel.orderForm.unloadingAddress=[
            {address:'testAddressTo1',zip:1111,floor:1},
            {address:'testAddressTo2',zip:2222,floor:2}]
          this.timeModel.orderForm.mail='test@gmail.com';
          this.timeModel.orderForm.moveDate='2016-08-08';
          this.timeModel.orderForm.moveDateTime='03:00-04:00 a.m.';
          this.timeModel.orderForm.packingDate='2016-08-08';
          this.timeModel.orderForm.packingDateTime='03:00-04:00 p.m.';
           this.timeModel.orderForm.phoneNumber='0631113322';
           this.timeModel.orderForm.sizeOfMove='sizeOfMoveTest'
            this.timeModel.orderForm.storageDate='2016-08-08'
             this.timeModel.orderForm.storageSize='storageSizeTest';
             this.timeModel.orderForm.tariff='testTariff';

            //PaimtenDeatilsForm
             this.timeModel.paymentDetailsForm.company='testCompany';
             this.timeModel.paymentDetailsForm.ddt=111;
             this.timeModel.paymentDetailsForm.discount=2222;
             this.timeModel.paymentDetailsForm.heavyItem='heavyItem';
             this.timeModel.paymentDetailsForm.moveDate='2016-08-08';
             this.timeModel.paymentDetailsForm.movers=2;
             this.timeModel.paymentDetailsForm.packingDate='2016-08-08';
             this.timeModel.paymentDetailsForm.packingMaterial='packMaterialTest';
             this.timeModel.paymentDetailsForm.packingMaterialsValue=333;
             this.timeModel.paymentDetailsForm.paymentMethod='perHour';
             this.timeModel.paymentDetailsForm.ratePerHour=444;
             this.timeModel.paymentDetailsForm.rateType='perHour';
             this.timeModel.paymentDetailsForm.serviceCharge='serviceChargeTest';
             this.timeModel.paymentDetailsForm.shrink=555;
             this.timeModel.paymentDetailsForm.shrinkValue=666;
             this.timeModel.paymentDetailsForm.sizeOfMove='sizeOfMoveTest';
             this.timeModel.paymentDetailsForm.status='status';
             this.timeModel.paymentDetailsForm.storageDate='2016-08-08';
             this.timeModel.paymentDetailsForm.storageSize='storageSize';
             this.timeModel.paymentDetailsForm.tape=5;
             this.timeModel.paymentDetailsForm.tapeValue=55;
             this.timeModel.paymentDetailsForm.tariff='2222';
             this.timeModel.paymentDetailsForm.totalForFirstHours=222;
             this.timeModel.paymentDetailsForm.truck=5;
  }

  private companyPickPrice() {

  }

  selectCompany(item:any) {
    this.selectedCompany = item;
    console.log('selectedCompany:' + item.name)
    this.timeModel.orderForm.company = item.name;
    this.changeMoverPrice();

  }

  selectPackMaterial(item:any) {
    console.log('packingMaterial:' + item)
    this.timeModel.paymentDetailsForm.packingMaterial = item.name;
  }

  selectAdvertisement(item:any) {
    console.log('Advertisement:' + item.name)
    this.timeModel.orderForm.advertisement = item.name;
  }

  selectSizeOfMoves(item:SizeOfMoves) {
    console.log('selectSizeOfMoves:' + item.name)
    this.timeModel.orderForm.sizeOfMove = item.name;
  }

  selectTariff(item:any) {
    console.log('Tariff:' + item);
    this.timeModel.orderForm.tariff = item.name;
  }

  selectPaymentMethod(item:any) {
    console.log('PaymentMethod:' + item.name)
    this.timeModel.paymentDetailsForm.paymentMethod = item.name;
  }

  selectTruck(item:any) {
    console.log('Truck:' + item.name);
    this.timeModel.paymentDetailsForm.truck = item.name;
  }

  selectMover(item:Movers) {
    console.log('Movers:' + item.name);
    this.timeModel.paymentDetailsForm.movers = item.name;
    this.moverType = item.type;
    this.changeMoverPrice();
  }


  /*
   Метод, который динамически изменяет цены в зависимости от выбранной компании и количества movers
   **/
  private changeMoverPrice() {
      console.log('changeMoverPrice')
    let company = this.timeModel.orderForm.company;
    console.log('changeMoverPrice')
    switch (this.moverType) {
      case MoversType.TWO:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].two;
        break;
      case MoversType.THREE:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].three;
        break;
      case MoversType.FOUR:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].four;
        break;
      case MoversType.FIVE:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].five;
        break;
      case MoversType.SIX:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].six;
        break;
      case MoversType.SEVEN:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].seven;
        break;
      case MoversType.EIGHT:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].eight;
        break;
      case MoversType.NINE:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].nine
        break;
      case MoversType.TEN:
        this.paymentPrice.ratePerHourPrice = this.companyPrice[company].ten;
        break;
    }
    console.log('moverPrice:' + this.paymentPrice.ratePerHourPrice)
    this.changeTotalPrice();
  }


  /*
    Метод, подсчитывающий общую стоимость
  **/
  changeTotalPrice() {
    let discount = this.paymentPrice.discount === 0 ? 1 : this.paymentPrice.discount;
    let perHour = this.timeModel.paymentDetailsForm.totalForFirstHours == undefined ? 1 : this.timeModel.paymentDetailsForm.totalForFirstHours;

    console.log('changeTotalPrice:');
    console.log(' this.paymentPrice.ddtPrice:' + this.paymentPrice.ddtPrice);
    console.log(' this.paymentPrice.heavyItemPrice' + this.paymentPrice.heavyItemPrice);
    console.log(' t this.paymentPrice.packingMaterialPrice' + this.paymentPrice.packingMaterialPrice);
    console.log(' this.paymentPrice.ratePerHourPrice' + this.paymentPrice.ratePerHourPrice);
    console.log('this.paymentPrice.serviceChargePrice' + this.paymentPrice.serviceChargePrice);
    console.log('this.paymentPrice.shrinkPrice' + this.paymentPrice.shrinkPrice);
    console.log('this.paymentPrice.sizeOfStorageSizePrice' + this.paymentPrice.sizeOfStorageSizePrice);
    console.log('this.paymentPrice.tapesPrice' + this.paymentPrice.tapesPrice);
    console.log('this.paymentPrice.discount' + this.paymentPrice.discount);
    this.paymentPrice.totalHourPrice = (
      this.paymentPrice.ddtPrice +
      this.paymentPrice.heavyItemPrice +
      this.paymentPrice.packingMaterialPrice +
      this.paymentPrice.ratePerHourPrice +
      this.paymentPrice.serviceChargePrice +
      this.paymentPrice.shrinkPrice +
      this.paymentPrice.sizeOfStorageSizePrice +
      this.paymentPrice.tapesPrice) * perHour;

  }

  selectRateperhour(item:RatePerHours) {
    console.log('RatePerHour:' + item.name);
    console.log('RatePerHour:' + this.timeModel.paymentDetailsForm.ratePerHour);
  }

  selectPackingMaterials(item:any) {
    console.log('PackingMaterials:' + item.name);
    this.timeModel.paymentDetailsForm.packingMaterial = item.name;
  }

  selectShrink(item:any) {//shrink - Пленка
    console.log('SelectShrink:' + item.name);
    this.timeModel.paymentDetailsForm.shrink = item.name;
  }

  selectTape(item:any) {
    console.log('SelectTape:' + item.name);
    this.timeModel.paymentDetailsForm.tape = item.name;
  }

  selectHeavyItem(item:any) {
    console.log('selectHeavyItem:' + item.name);
    this.timeModel.paymentDetailsForm.heavyItem = item.name;
  }

  selectSizeOfStorageUnit(item:any) {
    console.log('SizeOfStorageUnit:' + item.name);
    this.timeModel.paymentDetailsForm.storageSize = item.name;
  }

  selectTotalForFirst(item:any) {
    console.log('TotalForFirst:' + item.name);
    this.timeModel.paymentDetailsForm.totalForFirstHours = item.name;
    this.changeTotalPrice();
  }

  selectStatus(item:Status) {
    if (item.type === StatusType.COMPLETED) {
      console.log('status Completed selected');
    }
    console.log('Status:' + item.type + ', name:' + item.name);
    this.timeModel.paymentDetailsForm.status = item.name;
  }

  //TODO Создать переменные для ценовых полей с двойной связью

  private timeMove:string;
  private timePackage:string;
  private timeEstimate:string;

  selectMoveTime(item:string) {
    console.log('MoveTime:' + item);
    this.timeMove = item;
    this.timeModel.orderForm.moveDateTime = 'dasdsadsa';
    console.log('MoveTime2:' + this.timeModel.orderForm.moveDateTime);
    console.log('TimeMove:' + this.timeMove);
  }

  selectPackingTime(item:string) {
    console.log('PackingTime:' + item);
    this.timePackage = item;
    //   this.timeModel.orderForm.packingDateTime = item;
  }

  selectEstimateTime(item:string) {
    console.log('MoveTime:' + item);
    this.timeEstimate = item;
    // this.timeModel.orderForm.estimateDateTime = item;
  }

  /*
   Инициализация массива для вывода времени
   **/
  private initTime() {
    this.time = ["08:00-09:00 a.m.", "08:30-09:30 a.m.", "09:00-10:00 a.m", "09:30-10:30 a.m.", "10:00-11:00 a.m."
      , "10:30-11:30 a.m.", "11:00-12:00 a.m.", "11:30-12:30 a.m.", "12:00-01:00 p.m.", "12:30-01:30 p.m.",
      "01:00-02:00 p.m.", "01:30-02:30 p.m.", "02:00-03:00 p.m.", "02:30-03:30 p.m.", "03:00-04:00 p.m.", "03:30-04:30 p.m.",
      "04:00-05:00 p.m.", "04:30-05:30 p.m.", "05:00-06:00 p.m.", "05:30-06:30 p.m.", "06:00-07:00 p.m.",]
  }

  openTemp1() {
    console.log('openTemp1');
  }

  openTemp2() {
    console.log('openTemp2');
  }

  choosedate() {
    console.log('choosedate1');
  }

  choosedate2() {
    console.log('choosedate2');
  }

  sent() {
    console.log('Sent: TimeMove:' + this.timeMove);
    this.createEntityes();

    this._orderService.saveOrder(this.timeModel)
      .subscribe(
        data => {
        },
        error => {
          console.log('login error: ' + error)
        });
  }
  sentTest(){
    console.log('SentTest');
    this.createTestEntityes();
     this._orderService.saveOrder(this.timeModel)
      .subscribe(
        data => {
        },
        error => {
          console.log('login error: ' + error)
        });
  }

  ngOnInit() {
    this.initPaymentPrice();
    this.initCompanyPrice();
    this.initCompanies();
    this.initAdvertisements();
    this.initSizeOfMoves();
    this.initTime();
    this.initTariff();
    this.initTrucks();
    this.initMovers();
    this.initPaymentMethods();
    this.initRatePerHour();
    this.initPackageMaterials();
    this.initShrinks();
    this.initTapes();
    this.initHeavyItems();
    this.initStorageSize();
    this.initTotalHours();
    this.initStatus();
    this.timeModel.orderForm.company = 'Apple';
    this.moverType = MoversType.TWO;
    // this.timeModel.paymentDetailsForm.movers = 2;

    this.changeMoverPrice();
    console.log('perHourPriceOnInitMethod:' + this.paymentPrice.ratePerHourPrice)
    console.log('priceServiceCharge:' + this.paymentPrice.serviceChargePrice)
    console.log('perHour:' + this.paymentPrice.ratePerHourPrice)
  }

  calendarDateSelect(event:any) {
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Info Message', detail: '' + this.orderForm.controls['moveDate'].value});
  }

  showInfo() {
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks'});
  }

  private initCompanies() {
    this.companies = [{
      type: CompanyType.APPLE_MOVING,
      name: 'Apple'
    }
      , {
        type: CompanyType.LIONS_MOVING,
        name: 'Lions'
      }, {
        type: CompanyType.MUSCLE_MOVERS,
        name: 'Muscle'
      }
      , {
        type: CompanyType.PACIFIC_MOVING,
        name: 'Pacific'
      },
      {
        type: CompanyType.ROYAL_MOVING,
        name: 'Royal'
      },
      {
        type: CompanyType.SHARK_MOVING,
        name: 'Shark'
      }]
  }

  private initAdvertisements() {
    this.advertisements = [{
      type: AdvertisementType.HOW,
      name: 'How did you hear about us?'
    },
      {
        type: AdvertisementType.GOOGLE,
        name: 'Google Ads'
      },
      {
        type: AdvertisementType.SEARCH_ENGINE,
        name: 'Search engine'
      },
      {
        type: AdvertisementType.MOSS,
        name: 'Moss'
      },
      {
        type: AdvertisementType.ANGIES_LIST,
        name: 'Angies list'
      },
      {
        type: AdvertisementType.REFERENCE,
        name: 'Reference'
      },
      {
        type: AdvertisementType.SEARCH_ENGINE,
        name: 'Search engine'
      },
      {
        type: AdvertisementType.TRUCK_ADS,
        name: 'Truck ads'
      }]
  }

  private initSizeOfMoves() {
    this.sizeOfMove = [{
      type: SizeOfMoveType.COMMERCIAL,
      name: 'Commercial'
    },
      {
        type: SizeOfMoveType.FEW_ITEMS,
        name: 'Few items'
      },
      {
        type: SizeOfMoveType.FOUR_PLUS_BEDROOM,
        name: '4+ bedroom'
      },
      {
        type: SizeOfMoveType.ONE_BEDROOM_LARGE,
        name: '1 bedroom(large)'
      },
      {
        type: SizeOfMoveType.ONE_BEDROOM_SMALL,
        name: '1 bedroom(Small)'
      },
      {
        type: SizeOfMoveType.STUDIO,
        name: 'Studio'
      },
      {
        type: SizeOfMoveType.THREE_BADROOM,
        name: '3 bedroom'
      },
      {
        type: SizeOfMoveType.TWO_BEDROOM,
        name: '2 bedroom'
      },
    ]
  }

  initTariff() {
    this.tariffs = [{
      type: TariffType.STANDARD,
      name: 'Standart'
    },
      {
        type: TariffType.ALL_INCLUSIVE,
        name: 'All inclusive'
      }]
  }

  initTrucks() {
    this.trucks = [{
      type: TruckType.ONE,
      name: 1
    },
      {
        type: TruckType.TWO,
        name: 2
      }, {
        type: TruckType.THREE,
        name: 3
      }, {
        type: TruckType.FOUR,
        name: 4
      }, {
        type: TruckType.FIVE,
        name: 5
      }]
  }

  initMovers() {
    this.movers = [
      {
        type: MoversType.TWO,
        name: 2
      },
      {
        type: MoversType.THREE,
        name: 3
      },
      {
        type: MoversType.FOUR,
        name: 4
      },
      {
        type: MoversType.FIVE,
        name: 5
      },
      {
        type: MoversType.SIX,
        name: 6
      },
      {
        type: MoversType.SEVEN,
        name: 7
      },
      {
        type: MoversType.EIGHT,
        name: 8
      },
      {
        type: MoversType.NINE,
        name: 9
      },
      {
        type: MoversType.EIGHT,
        name: 10
      },]
  }

  initPaymentMethods() {
    this.paymentMethods = [{
      type: PaymentMethodType.CASH,
      name: 'Cash'
    },
      {
        type: PaymentMethodType.CREDIT_CART,
        name: 'Credit card'
      },
      {
        type: PaymentMethodType.PAYPAL,
        name: 'Paypal'
      },
      {
        type: PaymentMethodType.CHEQUE,
        name: 'Cheque'
      }]
  }

  initRatePerHour() {
    this.ratePerHour = [
      {
        type: RatePerHourType.RATE_PER_HOUR,
        name: 'Rate per hour'
      }, {
        type: RatePerHourType.FLAT_RATE,
        name: 'Flat rate'
      }];
  }

  initPackageMaterials() {
    this.packageMaterials = [
      {
        type: PackageMaterialType.EXTRA,
        name: 'Extra'
      },
      {
        type: PackageMaterialType.FREE,
        name: 'Free'
      }]
  }

  initShrinks() {
    this.shrinks = [{
      type: ShrinkType.S1,
      name: 1
    },
      {
        type: ShrinkType.S2,
        name: 2
      }, {
        type: ShrinkType.S3,
        name: 3
      }, {
        type: ShrinkType.S4,
        name: 4
      }, {
        type: ShrinkType.S5,
        name: 5
      }]
  }

  initTapes() {
    this.tapes = [{
      type: TapeType.T1,
      name: 1
    }, {
      type: TapeType.T2,
      name: 2
    }, {
      type: TapeType.T3,
      name: 3
    }, {
      type: TapeType.T4,
      name: 4
    }, {
      type: TapeType.T5,
      name: 5
    }]
  }

  initHeavyItems() {
    this.heavyItems = [{
      type: HeavyItemType.GRAND_PIANO,
      name: 'Grand piano'
    }, {
      type: HeavyItemType.HEAVY_ITEM,
      name: 'Heavy item'
    }, {
      type: HeavyItemType.PIANO,
      name: 'Piano'
    }]
  }

  initStorageSize() {
    this.storageSizes = [{
      type: StorageSizeType.S5X10,
      name: '5x10'
    }, {
      type: StorageSizeType.S10X10,
      name: '10x10'
    }, {
      type: StorageSizeType.S10X20,
      name: '10x20'
    }, {
      type: StorageSizeType.S20X20,
      name: '20x20'
    }]
  }

  initTotalHours() {
    this.totalHours = [{
      type: TotalHourType.THREE,
      name: 3
    }, {
      type: TotalHourType.TWO,
      name: 2
    }, {
      type: TotalHourType.ONE,
      name: 1
    }]
  }

  initStatus() {
    this.status = [{
      type: StatusType.BOOKED,
      name: 'Booked'
    }, {
      type: StatusType.COMPLETED,
      name: 'Completed'
    }, {
      type: StatusType.IN_PROCESS,
      name: 'In progress'
    }, {
      type: StatusType.SOLD,
      name: 'Sold'
    }]
  }


}

export class Cars {
  title:string;
  label:string;
}

export interface Message {
  severity:string,
  summary:string,
  detail:string
}

export interface Tape {
  type:TapeType;
  name:number;
}

export interface Shrinks {
  type:ShrinkType;
  name:number;
}

export interface PackingMaterial {
  type:PackageMaterialType,
  name:string;
}

export interface RatePerHours {
  type:RatePerHourType,
  name:string;
}

export interface Tariffs {
  type:TariffType,
  name:string;
}

export interface Companies {
  type:CompanyType;
  name:string;
}

export interface Advertisements {
  type:AdvertisementType;
  name:string;
}

export interface SizeOfMoves {
  type:SizeOfMoveType;
  name:string;
}

export interface Trucks {
  type:TruckType;
  name:number;
}

export interface Movers {
  type:MoversType;
  name:number;
}

export interface PaymentMethods {
  type:PaymentMethodType,
  name:string;
}

export interface HeavyItem {
  type:HeavyItemType,
  name:string
}

export interface StorageSize {
  type:StorageSizeType,
  name:string
}

export interface TotalHour {
  type:TotalHourType,
  name:number
}

export interface Status {
  type:StatusType,
  name:string
}



