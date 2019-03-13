// @flow

import type { Result } from "./mapResults";
import type { Airing, Channel } from "../types";

type ShowEntry = {
  show: Result<Airing>,
  secondsInSlot: number
}

class ChannelData {
  endTime: number;
  timeslotStart: number;
  interval: number;
  timeslotEnd: number;
  timeslotShows: Array<ShowEntry>;
  schedule: Array<Airing>;
  missingInitialSlots: number;

  constructor(start: number, end: number, interval: number) {
    this.endTime = end;
    this.timeslotStart = start;
    this.interval = interval;
    this.timeslotEnd = start + interval - 1;
    this.timeslotShows = [];
    this.schedule = [];
    this.missingInitialSlots = 0;
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
      // Current entry extends past end of duration, computer again for next timeslot
      this.calculateCurrentTimeslot();
      this.slotEntry(entry);
    }
  }

  calculateCurrentTimeslot() {
    if (this.timeslotShows.length === 0) {

      // No shows fit the schedule of this timeslot!
      // just fill it out with the previous, if available
      if (this.schedule.length === 0) {
        // Incoming schedule data is very poorly formed, and my contain large
        // time gaps that need to be filled by something. If these gaps appear
        // at the start of the day, there may not even be a show to extend in to
        // that timeslot! If that is the case, then we keep a count of how many
        // timeslots need to be back filled. Then once a program is found, then
        // will get filled with its airing information to try and make a best
        // guess at what might be airing at that time.
        this.missingInitialSlots++;
      } else {
        this.schedule.push(this.schedule[this.schedule.length - 1]);
      }
    } else {
      var highestTimeInSlot = Math.max.apply(Math, this.timeslotShows.map(function (o) {
        return o.secondsInSlot;
      }));

      // $FlowFixMe - Given that we checked above that timeslotShows is not empty,
      // $FlowFixMe - we can be confident that find will return an element
      let showToAdd = this.timeslotShows.find(function (o) {
        return o.secondsInSlot === highestTimeInSlot;
      }).show.data;

      // Just before adding a show to the schedule, check to see if there were
      // any empty spaces that were not covered by the schedule that should have
      // been. If there are any timeslots requesting show information, provide
      // the current show as a best guess
      if (this.missingInitialSlots > 0) {
        for (let i = 0; i < this.missingInitialSlots; i++) {
          this.schedule.push(showToAdd);
        }

        this.missingInitialSlots = 0;
      }

      this.schedule.push(showToAdd);
    }
    // Clean up and advance the timeslot
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

export default function buildSchedule(airings: Object, interval: number, start: number, end: number): Array<Channel> {
  interval = interval * 60; // Keep everything in seconds
  let channels = {};

  airings.forEach(function (entry) {
    let channel = entry.data.channel;

    if (!channels[channel]) {
      channels[channel] = new ChannelData(start, end, interval);
    }

    channels[channel].slotEntry(entry);
  });

  let schedule = [];
  for (let k in channels) {
    if (channels.hasOwnProperty(k)) {
      channels[k].finalize();
      schedule.push({ id : k, airings : channels[k].schedule});
    }
  }

  return schedule;
}
