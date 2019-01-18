import buildSchedule from './../../src/es/schedule';
import { mockAllChannelAirings, mockSingleChannelAirings } from './helpers';
import moment from "moment-timezone";

describe('schedule', function() {
  it('for a single channel schedule returns 1 day / interval rows', function() {
    let airings = mockSingleChannelAirings();
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = (Math.floor(Math.random() * 12) + 1) * 5;
    expect(Object.keys(buildSchedule(airings, interval, startTime, endTime)).length).toEqual(Math.ceil(1440 / interval));
  });

  it('for all channel schedule returns (1 day / interval rows) * number of channels', function() {
    let airings = mockAllChannelAirings();
    let startTime = moment(airings[0].data.date * 1000).tz("America/Chicago").startOf('day').unix();
    let endTime = moment(airings[0].data.date * 1000).tz("America/Chicago").endOf('day').unix();
    let interval = (Math.floor(Math.random() * 12) + 1) * 5;
    let schedule = buildSchedule(airings, interval, startTime, endTime);

    for (var k in schedule) {
      if (schedule.hasOwnProperty(k)) {
        expect(Object.keys(schedule[k]).length).toEqual(Math.ceil(1440 / interval));
      }
    }
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
    let keys = Object.keys(schedule);
    let firstElement = schedule[keys[0]];
    let lastElement = schedule[keys[keys.length-1]];
    expect(firstElement).toEqual(lastElement);
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
});