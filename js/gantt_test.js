/*
 * Variables
 */

let colors = [ "FarRight", "MidRight", "Mid", "MidLeft", "FarLeft" ];

let taskStatus = {
    "FarRight" : "blue",
    "MidRight" : "blue-purple",
    "Mid" : "purple",
    "MidLeft" : "red-purple",
    "FarLeft" : "red"
};

let task_data = {
      "orgName": "테스트2",
      "orgLeader": "김구",
      "orgEvent": [
        {
          "name": "사건3",
          "startDate": makeYearMonth(1910, 3),
          "endDate": makeYearMonth(1911, 12)
        },
        {
          "name": "사건4",
          "startDate": makeYearMonth(1913, 5),
          "endDate": makeYearMonth(1914, 1)
        }
      ],
      "orgDescription": "테스트 설명1"
    };

var tasks = [
    {
      "startDate" : makeYearMonth(1910, 2), //d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
      "endDate" : makeYearMonth(1914, 5), // d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
      "color" : colors[3], // 성향
      "status" : colors[3], // 성향별색상 데이터 분리 (중복데이터)
      "location" : "국내",
      "data" : task_data
    }
];

let startYear = makeYearMonth(1910, 0);
let endYear = makeYearMonth(1945, 0);

let PossibleTimeDomain = [
    {"startDate": makeYearMonth(1910, 0),"endDate": makeYearMonth(1945, 0)},
    {"startDate": makeYearMonth(1910, 0),"endDate": makeYearMonth(1920, 0)},
    {"startDate": makeYearMonth(1920, 0),"endDate": makeYearMonth(1930, 0)},
    {"startDate": makeYearMonth(1930, 0),"endDate": makeYearMonth(1940, 0)},
    {"startDate": makeYearMonth(1940, 0),"endDate": makeYearMonth(1945, 0)},
];

let format = "%H:%M";
let timeDomainString = "1day";

/*
 * Sort Data
 */

// tasks.sort(function(a, b) {
//     return a.endDate - b.endDate;
// });
// let maxDate = tasks[tasks.length - 1].endDate;
//
// tasks.sort(function(a, b) {
//     return a.startDate - b.startDate;
// });
// let minDate = tasks[0].startDate;


/*
 * Draw Chart
 */

let gantt = d3.gantt().taskTypes(colors).taskStatus(taskStatus).tickFormat(format).height(document.querySelector("#chart").offsetHeight - 80).width(5000);

gantt.timeDomainMode("fixed");
gantt.timeDomain([ d3.time.month.offset(Date.UTC(year=1910,0,0,0,0), 0), Date.UTC(year=1945,0,0,0,0) ]);
gantt.tickFormat("%m")
console.log([ d3.time.month.offset(Date.UTC(year=1910,0,0,0,0), 0), Date.UTC(year=1945,0,0,0,0) ])

// changeTimeDomain(timeDomainString);
// tasks = [task_new, task_new2]
// gantt(tasks);
// gantt()

tasks = []

d3.json("js/data.json", function(error, data) {
  if (error)
    throw error;
  for (let i = 0; i < data.length; i++) {
    let start = data[i].startDate.split("/");
    let end = data[i].endDate.split("/");
    
    
    data[i].startDate = makeYearMonth(start[0], start[1]);
    data[i].endDate = makeYearMonth(end[0], end[1]);
    
    data[i].data.orgEvent.forEach( function(e) {
      let eventStart = e.startDate.split("/");
      let eventEnd = e.endDate.split("/");
      e.startDate = makeYearMonth(eventStart[0], eventStart[1]);
      e.endDate = makeYearMonth(eventEnd[0], eventEnd[1]);
    });
    
    addTask(data[i]);
  }
});
//
//addTask(makeYearMonth(1910, 3), makeYearMonth(1915, 5), colors[0], task_data);
//addTask(makeYearMonth(1910, 4), makeYearMonth(1913, 7), colors[1], task_data);
//addTask(makeYearMonth(1910, 6), makeYearMonth(1914, 9), colors[2], task_data);

console.log(tasks);


/*
* Functions
*/

function changeTime(idx) {
//    console.log( d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0), PossibleTimeDomain[idx]['endDate']);
    document.querySelectorAll('[class="scrollable"]')[0].scrollLeft = 0

    gantt.timeDomain([ d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0),
        PossibleTimeDomain[idx]['endDate'] ]);
    gantt.redraw(tasks)
}

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
        case "1hr":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
            break;
        case "3hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
            break;

        case "6hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
            break;

        case "1day":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
            break;

        case "1week":
            format = "%a %H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
            break;
        default:
            format = "%H:%M"

    }
    gantt.tickFormat(format);
    // gantt.redraw(tasks);
}

function getEndDate() {
    let lastEndDate = Date.now();
    if (tasks.length > 0) {
        lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

let i = 0
function addTask(task) {
    tasks.push(task);

    // changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function addRandomHistory() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    date1_year = getRandomInt(1910, 1945), date1_month = getRandomInt(0, 6)
    date2_year = date1_year + getRandomInt(0, 3), date2_month = getRandomInt(7,11)
    date1 = makeYearMonth(date1_year, date1_month)
    date2 = makeYearMonth(date2_year, date2_month)

    i = getRandomInt(0, 5)

    addTask(date1, date2, colors[i], taskStatus[colors[i]])
}

function makeYearMonth(y, m) {
    return Date.UTC(y, m, 0, 0, 0)
}

console.log(tasks)
// tasks = []
// addTask(makeYearMonth(1910, 3), makeYearMonth(1910, 5), colors[0], colors[0])
// addTask(makeYearMonth(1910, 4), makeYearMonth(1910, 7), colors[1], colors[1])
// addTask(makeYearMonth(1910, 6), makeYearMonth(1910, 9), colors[0], colors[0])
// tasks.push(task_new)
// tasks.push(task_new2)
gantt(tasks);
changeTime(0)