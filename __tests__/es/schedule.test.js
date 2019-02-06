import buildSchedule from './../../src/es/schedule';
import { receive, getShow, getEpisode, getAiring, getViews } from './../../src/scheduleData';
import { mockAllChannelAirings, mockSingleChannelAirings, mockNormalizedMultiChannelScheduleData, mockNormalizedSingleChannelScheduleData, mockScheduleDataShow, mockScheduleDataEpisode, mockScheduleDataAiring, mockScheduleDataView} from './helpers';
import moment from "moment-timezone";

describe('schedule', function() {

  it('receives normalized multi channel data into the schedule data store', function() {
    receive(mockNormalizedMultiChannelScheduleData(), false);
    expect(getShow(30479)).toBeTruthy();
  });

  it('receives normalized single channel data into the schedule data store', function() {
    receive(mockNormalizedSingleChannelScheduleData(), true);
    expect(getShow(30479)).toBeTruthy();
  });

  it('returns the correct show from the schedule data store', function() {
    expect(getShow(30479)).toEqual(mockScheduleDataShow());
  });

  it('returns the correct airing from the schedule data store', function() {
    expect(getAiring(195068388602)).toEqual(mockScheduleDataAiring());
  });

  it('returns the correct episode from the schedule data store', function() {
    expect(getEpisode(329203381780)).toEqual(mockScheduleDataEpisode());
  });

  it('verifies view data in the schedule data store', function() {
    expect(getViews('TPTLIFE')).toEqual(mockScheduleDataView());
  });

  it('for a single channel schedule returns 1 day / interval rows', function() {
    let airings = mockSingleChannelAirings();
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = (Math.floor(Math.random() * 12) + 1) * 5;
    expect(Object.keys(buildSchedule(airings, interval, startTime, endTime)).length).toEqual(Math.ceil(1440 / interval));
  });

  it('for all channel schedule each channel contains (1 day / interval rows)', function() {
    let airings = mockAllChannelAirings();
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = (Math.floor(Math.random() * 12) + 1) * 5;
    let schedule = buildSchedule(airings, interval, startTime, endTime);

    schedule.forEach( function(value) {
      expect(value.airings.length).toEqual(Math.ceil(1440 / interval));
    });
  });

  it('empty timeslots fill with previous slot episode', function() {
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: 1547791200,
          duration: 3406
        }
      }
    ];
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = 30;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    expect(schedule[0]).toEqual(schedule.pop());
  });

  it('"Nothing Scheduled" row if first timeslot has no entry', function() {
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: 1547795000,
          duration: 1800
        }
      }
    ];
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = 30;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    let keys = Object.keys(schedule);
    let firstElement = schedule[keys[0]];
    expect(firstElement.show.title).toEqual("Nothing Scheduled");
  });

  it('chooses the show with the most duration in a timeslot when multiple shows are in the same timeslot', function() {
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: 1547789200,
          duration: 2900, // starts before beginning of first timeslot, 15 minutes in slot
          show: {
            id: 1
          }
        }
      },{
        data: {
          channel: "TPT2",
          date: 1547792100,
          duration: 1800, // definitely longest in the timeslot, 30 minutes in slot
          show: {
            id: 2
          }
        }
      },{
        data: {
          channel: "TPT2",
          date: 1547793000,
          duration: 6000, // ends after the first timeslot, 15 minutes in slot
          show: {
            id: 3
          }
        }
      }
    ];
    let startTime = moment(airings[1].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[1].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = 60;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    let keys = Object.keys(schedule);
    let firstElement = schedule[keys[0]];
    expect(firstElement.show.id).toEqual(airings[1].data.show.id);
  });

  it('chooses the first show on the schedule when multiple shows in a slot have the same duration', function() {
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: 1547791200,
          duration: 900,
          show: {
            id: 1
          }
        }
      },{
        data: {
          channel: "TPT2",
          date: 1547792100,
          duration: 900,
          show: {
            id: 2
          }
        }
      },{
        data: {
          channel: "TPT2",
          date: 1547793000,
          duration: 900,
          show: {
            id: 3
          }
        }
      }
    ];
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = 60;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    let keys = Object.keys(schedule);
    let firstElement = schedule[keys[0]];
    expect(firstElement.show.id).toEqual(airings[0].data.show.id);
  });

  it('has one fewer hour when daylight savings time begins', function() {
    // Daylight Savings Time skips 2:00AM to 3:00AM
    let startTime = moment().month(2).date(1).isoWeekday(7).add(7, 'd').tz("America/Chicago").startOf('day').unix();
    let endTime = moment().month(2).date(1).isoWeekday(7).add(7, 'd').tz("America/Chicago").endOf('day').unix();
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: startTime,
          duration: 3600,
          show: {
            id: 1
          }
        }
      }];
    let interval = 30;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    expect(schedule.length).toEqual(46);
    interval = 15;
    schedule = buildSchedule(airings, interval, startTime, endTime);
    expect(schedule.length).toEqual(92);
  });

  it('has one additional hour when daylight savings time ends', function() {
    let schedule_date = '2018-03-11T02:00:00';
    let tzDate = moment.tz(schedule_date, process.env.PROTRACK_TZ).unix();
    let date = moment(schedule_date).unix();

    console.log("tzDate " + tzDate);
    console.log("utcDate " + date);
    console.log("midnight: " + moment(1548309600));

    let startTime = moment().month(10).date(1).isoWeekday(7).tz("America/Chicago").startOf('day').unix();
    let endTime = moment().month(10).date(1).isoWeekday(7).tz("America/Chicago").endOf('day').unix();
    let airings = [
      {
        data: {
          channel: "TPT2",
          date: startTime,
          duration: 3600,
          show: {
            id: 1
          }
        }
      }];
    let interval = 30;
    let schedule = buildSchedule(airings, interval, startTime, endTime);
    expect(schedule.length).toEqual(50);
    interval = 15;
    schedule = buildSchedule(airings, interval, startTime, endTime);
    expect(schedule.length).toEqual(100);
  });
});