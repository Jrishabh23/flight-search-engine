
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
// range value update
document.querySelector('.min-range').textContent = 0;
document.querySelector('.max-range').textContent = document.querySelector('.range').value;
document.querySelector('.range').addEventListener('change', (e) => {
    document.querySelector('.max-range').textContent = document.querySelector('.range').value;
    getFlightData(e);
})
//Set Min date
function minDate() {
    // let tag = document.querySelectorAll(".date");
    // let date = new Date();
    // let year = date.getFullYear();
    // let month = date.getMonth() + 1;
    // month = month >= 10 ? month : '0' + month;
    // let day = date.getDate();
    // day = day >= 10 ? day : '0' + day;
    // tag.forEach((t) => {
    //     t.min = `${year}-${month}-${day}`;
    // });
}

minDate();
const tabs = document.querySelectorAll('.tab-button');
const container = document.querySelector('.left-nav');
//select type of journey
container.addEventListener('click', function (e) {
    const click = e.target.closest('.tab-button');
    if (!click) return;
    tabs.forEach(t => t.classList.remove('tab-active'))
    click.classList.add('tab-active')
    document.querySelector('.return-error').innerHTML = '';
    //set max pries 
    document.querySelector('#return-date').style.display = e.target.value == 'return' ? '' : 'none';
    document.querySelector('#return-date').value = ''
})
//submit form 
document.querySelector('.search-button, .range').addEventListener('click', function (e) { getFlightData(e) });
//fetch flight details form json 
function getFlightData(e) {
    e.preventDefault();
    var data = {
        origin: '',
        destination: '',
        departure: '',
        return: '',
        range: ''
    };
    const tripType = document.querySelector(".tab-active").value; // check trip type
    const formData = document.querySelector('.form-data').querySelectorAll('input');
    formData.forEach(t => {
        t.name != 'passenger' ? formValidation(t.name, t.value) : '';
        if (t.value != '')
            data[t.name] = t.value;
    })

    data['range'] = document.querySelector('.range').value;
    if (data['origin'] != '' && data['destination'] != '' && data['departure'] != '') {

        data['departure'] = dateFormat(data['departure'])
        data['return'] = dateFormat(data['return'])
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'assests/data/result.json');
        xmlHttp.send();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status == 200) {
                try {
                    const { flights } = JSON.parse(this.responseText);
                    const searchData = flights.filter((u) => {
                        if (u.origin.toLowerCase() == (data['origin'].toLowerCase()) && u.destination.toLowerCase() == (data['destination'].toLowerCase()) && Number(u.amount) <= Number(data['range']) && (dateFormat(u.date) - data['departure']) == 0) {
                            return u;
                        }
                    })

                    var returnData = [];
                    if (tripType == 'return') {
                        returnData = flights.filter((u) => {
                            if (u.origin.toLowerCase() == (data['destination'].toLowerCase()) && u.destination.toLowerCase() == (data['origin'].toLowerCase()) && Number(u.amount) <= Number(data['range']) && (dateFormat(u.date) - data['return']) == 0) {
                                return u;
                            }
                        })
                    }
                    let d = document.querySelector(".city-name");
                    d.innerHTML = ''; // remove old data
                    let cityName = `<h3 class="text-left f-30">${data['origin'].toUpperCase()} > ${data['destination'].toUpperCase()} ${tripType == 'return' ? '>' + data['origin'].toUpperCase() : ''}</h3> <span class="text-right">Depart: ${data['departure'].getDate()}, ${monthNames[data['departure'].getMonth()]} ${data['departure'].getFullYear()}</span><br><span class="m-25"><span class="text-right"> ${tripType == 'return' ? 'Return: ' + data['return'].getDate() + ',' + monthNames[data['return'].getMonth()] + ',' + data['return'].getFullYear() : ''}</span></span>`;
                    d.innerHTML = cityName;
                    flightCard(searchData, returnData);
                } catch (e) {
                    console.log(e.message)
                }
            }

        }
    } else {
        const formData = document.querySelector('.form-data').querySelectorAll('input');
        formData.forEach(t => {
            t.name != 'passenger' ? formValidation(t.name, t.value) : '';
        })
    }

}
//convert date formate
function dateFormat(date) {
    if (date == '') return '';
    var date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
// create flight data card
function flightCard(flightData, returnFlight = []) {
    let flightCard = document.querySelector(".flight-details");
    flightCard.innerHTML = '';
    flightCardData = '';
    returnFlag = returnFlight.length == 0 ? false : true;
    flightData.forEach((d) => {
        if (returnFlag) {
            returnFlight.forEach((r) => {
                flightCardData += `<div class="flight">
                            <h2> Rs: ${Number(d.amount) + Number(r.amount)}.00 <sub class="person">per person</sub></h2>
                            <div class="row">
                                <div class="column">
                                    <p>${d.flightNo}</p>
                                    <h3 class="m-t-0"> ${d.origin.toUpperCase()} > ${d.destination.toUpperCase()}</h3>
                                    <p class="m-0"> Depart: ${timeFormate(d.time.depart)}</p>
                                    <p class="m-0"> Arrive:${timeFormate(d.time.arrive)}</p>
                                </div>
                                <div class="column">
                                    <p>${r.flightNo}</p>
                                    <h3 class="m-t-0"> ${r.origin.toUpperCase()} > ${r.destination.toUpperCase()}</h3>
                                    <p class="m-0"> Depart: ${timeFormate(r.time.depart)}</p>
                                    <p class="m-0"> Arrive:${timeFormate(r.time.arrive)}</p>
                                </div>
                            </div>
                            <button class="btn text-right" data-id-1="${d.id}" data-id-2="${r.id}">Book</button>
                        </div>`;
            })
        } else {
            flightCardData += `<div class="flight">
                            <h2> Rs: ${d.amount}.00 <sub class="person">per person</sub></h2>
                            <div class="row">
                                <div class="column">
                                    <p>${d.flightNo}</p>
                                    <h3 class="m-t-0"> ${d.origin.toUpperCase()} > ${d.destination.toUpperCase()}</h3>
                                    <p class="m-0"> Depart: ${timeFormate(d.time.depart)}</p>
                                    <p class="m-0"> Arrive:${timeFormate(d.time.arrive)}</p>
                                </div>
                            </div>
                            <div class="book-button">
                            <button class="btn text-right"  data-id-1= "${d.id}">Book</button>
                            </div>
                            
                        </div>`;
        }

    })
    flightCard.innerHTML = flightCardData != '' ? flightCardData : `<div class="no-flight">No Flight Found.</div>`;
}
//convert time formate
function timeFormate(date) {
    if (date == '') return '';
    let fullDate = new Date(date);
    let hours = fullDate.getHours();
    let minutes = fullDate.getMinutes() >= 10 ? fullDate.getMinutes() : '0' + fullDate.getMinutes();
    let meridian = hours > 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours >= 10 ? hours : '0' + hours;
    return `${hours}.${minutes} ${meridian}`;
}
// form validations
function formValidation(name, value) {
    if (value == '' && name != 'return') {
        this.isValidate = false;
        document.querySelector(`.${name}-error`).innerHTML = `${name.slice(0, 1).toUpperCase()}${name.slice(1)} is require`;
    } else if (value == '' && document.querySelector(".tab-active").value == 'return' && name == 'return') {
        document.querySelector(`.${name}-error`).innerHTML = `${name.slice(0, 1).toUpperCase()}${name.slice(1)} is require`;
    } else {
        document.querySelector(`.${name}-error`).innerHTML = '';
    }
}


