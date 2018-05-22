
var taskNames = [ "FarRight", "CenterRight", "Center", "CenterLeft", "FarLeft" ];

var tasks = [
    {
        "startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),
        "endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),
        "taskName":"E Job",
        "status":"RUNNING"
    }
];

var taskStatus = {
    "FarRight" : "far-right",
    "CenterRight" : "center-right",
    "Center" : "center",
    "CenterLeft" : "center-left",
    "FarLeft" : "far-left"
};

var taskSkull = {
    "startDate" : makeYearMonth(0, 0), //d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
    "endDate" : makeYearMonth(0, 0), // d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
    "taskName" : taskNames[0],
    "status" : taskStatus[0], // 데이터 분리 (중복데이터)
    "data" : {
        "orgName": "",
        "orgEvent": [{
            "name": "",
            "startDate": "",
            "endDate": ""
        }, {
            "name": "",
            "startDate": "",
            "endDate": ""
        }],
        "orgDescription": ""
    }
}


task_new = taskSkull
task_new["startDate"] = makeYearMonth(1945, 0)
task_new["endDate"] = makeYearMonth(1946, 2)
task_new["status"] = taskNames[4]
task_new["taskName"] = taskNames[4]
task_new["data"] = {
    "orgName": "테스트1",
    "orgEvent": [{
        "name": "사건1",
        "startDate": makeYearMonth(1945, 2),
        "endDate": makeYearMonth(1945, 11)
    }, {
        "name": "사건2",
        "startDate": makeYearMonth(1946, 0),
        "endDate": makeYearMonth(1946, 2)
    }],
    "orgDescription": "테스트 설명1"
}

task_new2 = Object.assign({}, task_new);
task_new2["startDate"] = makeYearMonth(1945, 1)
task_new2["endDate"] = makeYearMonth(1946, 4)
task_new2["status"] = taskNames[2]
task_new2["taskName"] = taskNames[2]

// tasks.sort(function(a, b) {
//     return a.endDate - b.endDate;
// });
// var maxDate = tasks[tasks.length - 1].endDate;
//
// tasks.sort(function(a, b) {
//     return a.startDate - b.startDate;
// });
// var minDate = tasks[0].startDate;

var format = "%H:%M";
var timeDomainString = "1day";

var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format).height(document.querySelector("#chart").offsetHeight - 80).width(5000);


gantt.timeDomainMode("fixed");
gantt.timeDomain([ d3.time.month.offset(Date.UTC(year=1945,0,0,0,0), 0), Date.UTC(year=1970,11,0,0,0) ]);
gantt.tickFormat("%m")

// changeTimeDomain(timeDomainString);
tasks = [task_new, task_new2]
gantt(tasks);
// gantt()

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
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
        lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

var i = 0
function addTask(startMonth, endMonth, taskName = taskNames[0], status = "CenterRight") {
    tasks.push({
        "startDate" : startMonth, //d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
        "endDate" : endMonth, // d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
        "taskName" : taskName,
        "status" : status,
        "data" : {
            "orgName": "",
            "orgEvent": [],
            "orgDescription": ""
        }
    });

    // changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);

};

function addRandomHistory() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    date1_year = getRandomInt(1945, 1970), date1_month = getRandomInt(0, 6)
    date2_year = date1_year + getRandomInt(0, 3), date2_month = getRandomInt(7,11)
    date1 = makeYearMonth(date1_year, date1_month)
    date2 = makeYearMonth(date2_year, date2_month)

    i = getRandomInt(0, 5)

    addTask(date1, date2, taskNames[i], taskStatus[taskNames[i]])
}

function makeYearMonth(y, m) {
    return Date.UTC(y, m, 0, 0, 0)
}

addTask(makeYearMonth(1945, 3), makeYearMonth(1945, 5), taskNames[0], taskNames[0])
addTask(makeYearMonth(1945, 4), makeYearMonth(1945, 7), taskNames[1], taskNames[1])
addTask(makeYearMonth(1945, 6), makeYearMonth(1945, 9), taskNames[0], taskNames[0])

console.log(tasks)