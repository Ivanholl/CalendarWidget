function CalendarWidget(args){
    if (!args?.container) {
        console.error('Please provide a element for CalendarWidget to attach');
        return
    }

    //setting the locales and configurations
    let locale = args.locale || window.navigator.userLanguage || window.navigator.language;
    // moment.locale(...locale);
    moment.updateLocale(...locale);
    this.container = $(args.container);

    //some basic constants
    this.monthsArr = moment.months();
    this.weekdaysShortArr = moment.weekdaysShort(true);
    this.now = moment().date();

    //initial data is taken as todays month
    this.currentMonthInt = Number(args.currentMonth) - 1 || moment().month();
    this.currentYear = args.currentYear || moment().year();
    this.currentMonthLong = this.monthsArr[this.currentMonthInt];
    this.currentMonthNumberOfDays = moment(`${this.currentYear}-${this.currentMonthLong}`, "YYYY-MM").daysInMonth();
    this.storageKeys = Object.keys(localStorage).filter(entry => entry.includes(`-${this.currentMonthInt + 1}-`));

    //create container elements for easier use later
    this.header = $('<div/>').addClass('header');
    this.weekdaysContainer = $('<div/>').addClass('weekdays-container');
    this.daysContainer = $('<div/>').addClass('days-container');

    //using arrow functions because they do not create new scope
    drawContainers = () => {
        $(this.container).append(
            this.header,
            this.weekdaysContainer,
            this.daysContainer,
        );
    }

    drawHeader = () => {
        this.header.empty() //some cleanup is nesessery to remove old data  because we have no  two way data binding like with react or other framework

        this.header.append(
            $('<button/>').addClass('btn prev').text('<').click(e => this.changeMonth(-1)),
            $('<div/>').addClass('year-month').text(`${this.currentMonthLong}-${this.currentYear}`),
            $('<button/>').addClass('btn next').text('>').click(e => this.changeMonth(1)),
        )
    }

    drawWeekDays = () => {
        this.weekdaysShortArr.forEach(item => {
            this.weekdaysContainer.append(
                $('<div/>').addClass('day weekdays')
                    .append(
                        $('<div/>').addClass('weekday-num').text(item)
                    )
            )
        });
    }
    checkIfEventOnDate = (date) => {
        // let event = {
        //     title: "Meeting with the CEO",
        //     date: moment('2020-05-01',"YYYY-MM-DD"),
        //     participants: 'Gosho, Tosho, Pesho',
        //     details: 'New bisiness cards.'
        // }

        //checking by keys so we don't trigger the storage for
        let dateToCheck = `${this.currentYear}-${this.currentMonthInt + 1}-${date}`;
        let hasEvent = this.storageKeys.filter(entry => entry.includes(dateToCheck));

        let noInfo = [
            $('<div/>').addClass('plus').text('+'),
            $('<p/>').addClass('info noAdded').html('No Events'),
        ]

        if (hasEvent.length) {
            //so far i have place only to show one
            let event = JSON.parse(localStorage.getItem(hasEvent[0]));
            if (event && moment(dateToCheck, 'YYYY-MM-DD').isSame(event?.date)) {
                let info = [
                    $('<div/>').addClass('minus').text('-'),
                    $('<div/>').addClass('info')
                    .append(
                        $('<p/>').addClass('info-title').html(event.title),
                        $('<p/>').addClass('info-details').html(event.details),
                    )
                ]
                return info
            } else {
                return noInfo
            }
        } else {
            return noInfo
        }
    }

    drawDates = () => {
        this.daysContainer.empty() //some cleanup is nesessery to remove old data  because we have no  two way data binding like with react or other framework

        for (var date = 1; date <= this.currentMonthNumberOfDays; date++) {
            this.daysContainer.append(
                $('<div/>').addClass('day').addClass(date == this.now ? 'today' : '')
                    .append(
                        $('<div/>').addClass('day-num')
                            .append(
                                $('<span/>').text(date),
                                checkIfEventOnDate(date)
                            )
                    )
            )
        }
    }

    fillFirstWeek = () => {
        let firstDateOfMonth = `${this.currentYear}-${this.currentMonthInt + 1}-01`;
        let firstWeekDayOfMonth = moment(firstDateOfMonth, "YYYY-MM-DD").weekday() + 1; //because they start from 0
        if(firstWeekDayOfMonth == 1) firstWeekDayOfMonth = 8;

        for (var i = 1; i < firstWeekDayOfMonth; i++) {
            let previousDay = moment(firstDateOfMonth, "YYYY-MM-DD").subtract(i, 'days').date();

            this.daysContainer.prepend(
                $('<div/>').addClass('day')
                    .append(
                        $('<div/>').addClass('day-num old').text(previousDay)
                    )
            )
        }

    }

    fillLastWeek = () => {
        let lastDateOfMonth = `${this.currentYear}-${this.currentMonthInt + 1}-${this.currentMonthNumberOfDays}`;
        let lastWeekDayOfMonth = moment(lastDateOfMonth, "YYYY-MM-DD").weekday() + 1;
        let daysToAdd = 7 - lastWeekDayOfMonth;

        //if the last week is full we add another row
        if(daysToAdd == 0) daysToAdd = 7;
        for (var i = 1; i <= daysToAdd; i++) {
            var nextDay = moment(lastDateOfMonth, "YYYY-MM-DD").add(i, 'days').date();

            this.daysContainer.append(
                $('<div/>').addClass('day')
                    .append(
                        $('<div/>').addClass('day-num old').text(nextDay)
                    )
            )
        }
    }

    drawMonth = () => {
        drawDates();
        fillFirstWeek();
        fillLastWeek();
    }

    changeMonth = (value) => {
        let yearAndMonth = `${this.currentYear}-${this.currentMonthLong}`;
        let newDateToSet = moment(yearAndMonth, 'YYYY-MMMM').add(value, 'months');
        debugger
        this.currentMonthInt = newDateToSet.month();
        this.currentYear = newDateToSet.year();
        this.currentMonthLong = this.monthsArr[this.currentMonthInt]
        this.currentMonthNumberOfDays = moment(newDateToSet, "YYYY-MMMM").daysInMonth();
        this.storageKeys = Object.keys(localStorage).filter(entry => entry.includes(`-${this.currentMonthInt + 1}-`));

        drawHeader();
        drawMonth();
    }

    //binded to  this so it can be called outside the class manually
    this.drawDates = drawDates;
    this.changeMonth = changeMonth;

    !function init () {
        drawContainers();
        drawHeader();
        drawWeekDays();
        drawMonth();
    }();
}

$(document).ready(function() {

    const calendar = new CalendarWidget({
        container: '#calendar-container', //mandatory
        locale: ['en', { //optional it uses the browser metadata if not provided
            week: {
                dow : 1 //0 sunday is first day of the week 1 monday is the first day of the week
            }
        }],
        currentYear: '2020',  //optional it uses the browser metadata if not provided YYYY/2020
        currentMonth: '01',  //optional it uses the browser metadata if not provided MM/02
    });

    //this can be called outside if someone needs to change the month from somewhere else
    //calendar.drawDates(5)
    // calendar.changeMonth(-19)
    // calendar.changeMonth(16)

})
