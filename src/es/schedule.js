import moment from "moment-timezone";

class ChannelData {
  constructor(start: number, interval: number) {
    this.timeslotStart = start;
    this.interval = interval;
    this.timeslotEnd = start + interval - 1;
    this.timeslotShows = [];
    this.schedule = {};
  }

  slotEntry(entry) {
    console.log(entry);
    if (entry.data.date >= this.timeslotEnd) {
      this.calculateCurrentTimeslot();
      this.advanceToNextTimeslot();
    }

    let secondsInSlot = Math.min(this.timeslotEnd, entry.data.date + entry.data.duration) - Math.max(this.timeslotStart, entry.data.date);

    if (secondsInSlot > 0) {
      this.timeslotShows.push({
        show: entry,
        secondsInSlot: secondsInSlot
      });
    }

    if (entry.data.date + entry.data.duration > this.timeslotEnd) {
      this.calculateCurrentTimeslot();
      this.advanceToNextTimeslot();
      this.slotEntry(entry);
    }
  }

  calculateCurrentTimeslot() {
    if (this.timeslotShows.length === 0) {
      console.log("big fat nothing at " + this.timeslotStart + " and " + this.timeslotEnd);
      // No shows fit the schedule of this timeslot!
      this.schedule[this.timeslotStart] = { show: { title: "Nothing Scheduled" } };
    } else {
      var highestTimeInSlot = Math.max.apply(Math, this.timeslotShows.map(function (o) {
        return o.secondsInSlot;
      }));

      let index = moment(this.timeslotStart * 1000).format("MMMM Do YYYY, h:mm:ss a");
      this.schedule[index] = this.timeslotShows.find(function (o) {
        return o.secondsInSlot === highestTimeInSlot;
      }).show.data;

//      this.schedule[index] = this.timeslotShows.find(function (o) {
  //      return o.secondsInSlot === highestTimeInSlot;
    //  }).show.data.show.title;
    }
  }

  advanceToNextTimeslot() {
    this.timeslotStart += this.interval;
    this.timeslotEnd = this.timeslotStart + this.interval - 1;
    this.timeslotShows = [];
  }
}

export default function buildSchedule(airings: Object, interval: number, start: number): Array {
  console.log('building schedule');
  interval = interval * 60; // Keep everything in seconds
  let channels = {};
  let schedule = {};

  console.log(moment(start * 1000).format("MMMM Do YYYY, h:mm:ss a"));
  airings.forEach(function (entry) {
    let channel = entry.data.channel;

    if (!channels[channel]) {
      channels[channel] = new ChannelData(start, interval);
    }

    channels[channel].slotEntry(entry);
  });

  for (var k in channels) {
    if (channels.hasOwnProperty(k)) { schedule[k] = channels[k].schedule; }
  }
  return schedule;
}
