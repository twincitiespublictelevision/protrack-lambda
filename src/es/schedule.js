import moment from "moment-timezone";

class ChannelData {
  constructor(start: number, end: number, interval: number) {
    this.endTime = end;
    this.timeslotStart = start;
    this.interval = interval;
    this.timeslotEnd = start + interval - 1;
    this.previousTimeslotStart = 0;
    this.timeslotShows = [];
    this.schedule = {};
  }

  slotEntry(entry) {
    while (entry.data.date >= this.timeslotEnd) {
      this.calculateCurrentTimeslot();
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
      this.slotEntry(entry);
    }
  }

  calculateCurrentTimeslot() {
    let index = this.timeslotStart;

    if (this.timeslotShows.length === 0) {
      // No shows fit the sc.hedule of this timeslot!
      // just fill it out with the previous, if available
      if (this.previousTimeslotStart === 0) {
        this.schedule[index] = { show: { title: "Nothing Scheduled" } };
      } else {
        this.schedule[index] = this.schedule[this.previousTimeslotStart];
      }
    } else {
      var highestTimeInSlot = Math.max.apply(Math, this.timeslotShows.map(function (o) {
        return o.secondsInSlot;
      }));

      this.schedule[index] = this.timeslotShows.find(function (o) {
        return o.secondsInSlot === highestTimeInSlot;
      }).show.data;

      let o = this.timeslotShows.find(function (o) {
        return o.secondsInSlot === highestTimeInSlot;
      }).show.data;
      /*
      this.schedule[index] = {
        data: {
          channel: o.channel,
          date: o.date,
          duration: o.duration
        }
      }*/
    }
    // Clean up and advance the timeslot
    this.previousTimeslotStart = this.timeslotStart;
    this.timeslotStart += this.interval;
    this.timeslotEnd = this.timeslotStart + this.interval - 1;
    this.timeslotShows = [];
  }

  finalize() {
    // Calculate the last entry entered, and buffer slots up to the end time if necessary
    while (this.timeslotEnd < this.endTime) {
      this.calculateCurrentTimeslot();
    }
    this.calculateCurrentTimeslot();
  }
}

export default function buildSchedule(airings: Object, interval: number, start: number, end: number): Array {
  interval = interval * 60; // Keep everything in seconds
  let channels = {};

  airings.forEach(function (entry) {
    let channel = entry.data.channel;

    if (!channels[channel]) {
      channels[channel] = new ChannelData(start, end, interval);
    }

    channels[channel].slotEntry(entry);
  });

  let schedule = {};
  var k;
  for (k in channels) {
    if (channels.hasOwnProperty(k)) {
      channels[k].finalize();
      schedule[k] = channels[k].schedule;
    }
  }

  if (Object.keys(schedule).length > 1) {
    return schedule;
  } else {
    // Only one channel worth of data, so do not return keyed object
    return schedule[k];
  }
}
