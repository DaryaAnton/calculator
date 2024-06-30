'use strict';
const title = document.getElementsByTagName('h1')[0];

const btnHandlerStart = document.getElementsByClassName('handler_btn')[0];
const btnHandlerReset = document.getElementsByClassName('handler_btn')[1];

const btnPluse = document.querySelector('.screen-btn');

const itemsPercent = document.querySelectorAll('.other-items.percent');
const itemsNumber = document.querySelectorAll('.other-items.number');

const rangeInput = document.querySelector('.rollback [type=range]');
const rangeValueSpan = document.querySelector('.rollback span.range-value');

const inputTotal = document.getElementsByClassName('total-input')[0];
const inputTotalCount = document.getElementsByClassName('total-input')[1];
const inputTotalCountOther = document.getElementsByClassName('total-input')[2];
const inputTotalFullCount = document.getElementsByClassName('total-input')[3];
const inputTotalCountRollback = document.getElementsByClassName('total-input')[4];

let screenType = document.querySelectorAll('.screen');

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    rollback: 0, 
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    servicePercentPrice: 0, 
    fullPrice: 0, 
    servicesPercent: {},
    servicesNumber: {},
    count: 0,
    
    init: function() {
        this.addTitle();
        btnHandlerStart.addEventListener('click', this.addBtnCheck.bind(this));
        btnPluse.addEventListener('click', this.addScreenBlock.bind(this));
        rangeInput.addEventListener('input', this.getRange.bind(this));
        btnHandlerReset.addEventListener('click', this.reset.bind(this));
    },
    addTitle: function() {
        document.title = title.textContent;
    },

    reset: function() {
        this.screens =  [];
        this.screenPrice = 0;
        this.adaptive = true;
        this.rollback = 0; 
        this.servicePricesPercent = 0;
        this.servicePricesNumber = 0;
        this.servicePercentPrice = 0; 
        this.fullPrice = 0; 
        this.servicesPercent = {};
        this.servicesNumber = {};
        this.count = 0;

        for(let i = 0; i < screenType.length; i++) {
            if (i !== 0 ) {
                screenType[i].remove();
                
            };
        };

        screenType = document.querySelectorAll('.screen');
        rangeValueSpan.textContent = '0%';
        btnPluse.disabled = false;


        for (let item of document.getElementsByClassName('total-input')) {
            item.value = '0';
        };

        screenType.forEach((screen) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');

            select.value = '';
            input.value = '';

            select.disabled = false;
            input.disabled = false;
        });

        const checkbox = document.querySelectorAll('.custom-checkbox')
        checkbox.forEach((checkbox) => {
            checkbox.checked = false;
        });
        
        const range = document.querySelectorAll('input[type="range"]');
        range.forEach((elem) => {
            elem.value = 0;
        });

        btnHandlerReset.style.display = 'none';
        btnHandlerStart.style.display = 'block';
    },

    addBtnCheck: function() {

        screenType = document.querySelectorAll('.screen');
        this.isError = false;
        // this.start = this.start.bind(this);
        screenType.forEach((screen) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            if (select.value === '' || input.value === '') {
                this.isError = true;
            }else if(!this.isError) {
                input.disabled = true;
                select.disabled = true;

                btnHandlerStart.style.display = 'none';
                btnHandlerReset.style.display = 'block';
                btnPluse.disabled = true;
            };
        });
        this.start();
    },

    start: function () {
        this.addScreens();
        this.addServices();
        this.addPrices();
        this.logger();
        this.showResult();
    },

    showResult: function() {
        inputTotal.value = this.screenPrice;
        inputTotalCountOther.value = this.servicePricesPercent + this.servicePricesNumber;
        inputTotalFullCount.value = this.fullPrice;
        inputTotalCountRollback.value = this.servicePercentPrice;
        inputTotalCount.value = this.count;
    },

    addScreens: function() {
        screenType = document.querySelectorAll('.screen');

        screenType.forEach((screen, index) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input')
            const selectName = select.options[select.selectedIndex].textContent;
            const count = screen.querySelector('input').value;

            this.screens.push({
                id: index, 
                name: selectName, 
                price: +select.value * +input.value,
                count: +input.value,
            });
        });
    },

    addScreenBlock: function() {
        const cloneScreen = screenType[0].cloneNode(true);
        screenType[screenType.length -1].after(cloneScreen);
        console.log('клон: ', screenType);
    },

    addServices: function() {
        itemsPercent.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if(check.checked) {
                this.servicesPercent[label.textContent] = +input.value;
            };
        });

        itemsNumber.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if(check.checked) {
                this.servicesNumber[label.textContent] = +input.value;
            };
        });
    },

    addPrices: function() {
        for (let screen of this.screens) {
            this.screenPrice += +screen.price;
        };
        this.count = this.screens.reduce((sum,item) => {
            return sum + item.count
        }, 0);

        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key]
            console.log('допы в руб: ', this.servicePricesNumber);
        };

        for (let key in this.servicesPercent) {
            this.servicePricesPercent += Math.ceil((this.screenPrice * (this.servicesPercent[key] / 100)));
            console.log('допы в %: ', this.servicePricesPercent);
        };

        this.fullPrice = this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;

        this.servicePercentPrice = Math.ceil(this.fullPrice - (this.fullPrice * (this.rollback / 100)));
    },

    getRange: function(event) {
        // rangeValueSpan.textContent = event.target.value + '%';
        // this.rollback = rangeValueSpan.value;
        
        rangeValueSpan.textContent = rangeInput.value + '%';
        this.rollback = rangeInput.value;

    },

    logger: function() {
        console.log('count: ', this.count);
        console.log('rollback: ', this.rollback);
        console.log('Экран: ', this.screens);
        console.log('Сумма за экран: ',this.screenPrice);
        console.log('адаптив: ',this.adaptive);
        console.log('Сумма + допы: ', this.fullPrice);
        console.log('Сумма за вычетом отката: ',this.servicePercentPrice);


        // for (let key in appData) {
        //     console.log('Ключ: ' + key + " " + 'Значение: ' + appData[key]);
        // };
    },
};
appData.init();