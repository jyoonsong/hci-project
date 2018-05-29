/*
 * Variables
 */

let colors = [ "FarRight", "MidRight", "Mid", "MidLeft", "FarLeft" ];
let locations = [ "중국관내", "연해주", "국내", "만주", "화북" ];

let taskStatus = {
    "FarRight" : "blue",
    "MidRight" : "blue-purple",
    "Mid" : "purple",
    "MidLeft" : "red-purple",
    "FarLeft" : "red"
};

let task_data = {
      "orgName": "대한민국임시정부",
      "orgLeader": "김구",
      "orgEvent": [
        {
          "name": "대한민국 임시헌장",
          "startDate": makeYearMonth(1919, 4),
          "endDate": makeYearMonth(1919, 6)
        },
        {
          "name": "이승만의 위임통치청원",
          "startDate": makeYearMonth(1920, 1),
          "endDate": makeYearMonth(1920, 12)
        },
        {
          "name": "국민대표회의",
          "startDate": makeYearMonth(1923, 1),
          "endDate": makeYearMonth(1923, 12)
        },
        {
          "name": "이승만 탄핵",
          "startDate": makeYearMonth(1925, 1),
          "endDate": makeYearMonth(1925, 12)
        },
        {
          "name": "한인애국단",
          "startDate": makeYearMonth(1932, 1),
          "endDate": makeYearMonth(1933, 12)
        },
        {
          "name": "이동(상하이~항저우)",
          "startDate": makeYearMonth(1934, 1),
          "endDate": makeYearMonth(1940, 12)
        },
        {
          "name": "대한민국건국강령",
          "startDate": makeYearMonth(1941, 1),
          "endDate": makeYearMonth(1941, 12)
        },
        {
          "name": "주석 및 부수적제 개헌",
          "startDate": makeYearMonth(1944, 1),
          "endDate": makeYearMonth(1944, 12)
        }
      ],
      "orgDescription": "1919년 3월, 3.1운동이라는 거대한 움직임의 영향으로 설립되었다. 연해주에서는 손병희가 이끄는 전로한족회중앙총회가, 서울에서는 이승만이 이끄는 한성정부가, 상하이에서는 신한청년당이 중심이 된 대한민국 임시정부가 구성된 것이다. 상하이에서는 대한민국 임시헌장을 발표하였다."
    };

var tasks = [
    {
      "startDate" : makeYearMonth(1919, 3), //d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
      "endDate" : makeYearMonth(1945, 12), // d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
      "color" : colors[2], // 성향
      "status" : colors[2], // 성향별색상 데이터 분리 (중복데이터)
      "location" : "중국관내",
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

let width = (document.body.offsetWidth < 1200) ? 1200 : document.body.offsetWidth;

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

let gantt = d3.gantt().taskTypes(colors).currentTaskMode('Color').taskStatus(taskStatus).tickFormat(format).height(document.querySelector("#chart").offsetHeight - 80);

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

console.log(tasks);


/*
* Functions
*/

function changeTime(idx) {
//    console.log( d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0), PossibleTimeDomain[idx]['endDate']);
    document.querySelectorAll('[class="scrollable"]')[0].scrollLeft = 0

    gantt.timeDomain([ d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0),
        PossibleTimeDomain[idx]['endDate'] ]);

    gantt.hideText(idx == 0)
    console.log(idx, gantt.hideText)
    gantt.redraw(tasks)
}

function swapAxisModeInto(mode) {
    _taskTypes = (mode == 'Pos') ? locations : colors
    gantt.currentTaskMode(mode).taskTypes(_taskTypes).redraw(tasks)
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

function addTask(task) {
    tasks.push(task);

    // changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
    Index.init();

};

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