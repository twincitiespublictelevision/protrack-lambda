// @flow

import type {Airing, Episode, Genre, Show} from './../types';
import moment from 'moment-timezone';

type ProTrackSchedule = {
  schedule_id: string,
  schedule_channel: string,
  schedule_date: string,
  schedule_duration: string
};

type ProTrackEpisode = {
  program_id: number,
  version_id: number,
  episode_title: string,
  episode_number: number,
  episode_desc: string,
  episode_url: string,
  episode_language: string,
  episode_dvi: boolean,
  episode_stereo: string,
  episode_hdtv: boolean,
  version_rating: string,
  version_caption: boolean,
  package_type: string,
  orig_broadcast_date: string,
  epi_genrelist_loc: ProTrackGenreWrapped|ProTrackGenreList,
  epi_genrelist_nat: ProTrackGenreWrapped|ProTrackGenreList,
  schedule: any
};

type ProTrackSeries = {
  series_id: number,
  series_code: string,
  series_title: string,
  series_desc: string,
  series_url: string,
  series_pgmtype: string,
  series_genrelist_loc: ProTrackGenreWrapped|ProTrackGenreList,
  episode: any
};

type ProTrackGenre = {
  genrecd: string,
  genretxt: string
};

type ProTrackGenreWrapped = {
  genre: ProTrackGenre
};

type ProTrackGenreList = {
  genre: Array<ProTrackGenre>
};

function protrackDateToTimestamp(date) {
  return moment.tz(date, process.env.PROTRACK_TZ).unix();
}

let durationRegex = /^P(\d+)H(\d+)M(\d+)S$/;

function durationToNumber(duration: string): number {
  let matches = duration.match(durationRegex);

  if (matches && matches.length > 3) {
    return parseInt(matches[1]) * 60 * 60
      + parseInt(matches[2]) * 60
      + parseInt(matches[3]);
  }

  return 0;
}

function buildAiring(schedule: ProTrackSchedule, episode: Episode, show: Show): ?Airing {
  let { schedule_id, schedule_channel, schedule_date, schedule_duration } = schedule;

  let format = iso => {
    return moment.tz(
      moment.tz(schedule_date, process.env.PROTRACK_TZ).unix() * 1000,
      process.env.PROTRACK_TZ
    ).format('YYYY-MM-DDTHH:mm:ss');
  }

  // Check for timestamp that doesn't convert back, which is only possible during a "spring ahead"
  // DST hour. Such entries should be dismissed.
  if (format(schedule_date) !== schedule_date) {
    console.log(
      'Ignoring due to invalid daylight savings time',
      schedule,
      format(schedule_date),
      schedule_date
    );

    return null;
  }

  let date = protrackDateToTimestamp(schedule_date);
  let duration = durationToNumber(schedule_duration);

  let channelMap = {
    "TPT2": 1,
    "TPTLIFE": 2,
    "TPTMN": 3,
    "TPTKIDS": 4
  }

  let id;

  if (typeof schedule_id !== 'undefined') {
    id = schedule_id;
  } else {
    id = channelMap[schedule_channel] + '' + date;
  }

  return {
    id: parseInt(id),
    channel: schedule_channel,
    date: date,
    end_date: date + duration,
    duration: duration,
    episode,
    show
  }
}

function toGenreList(genres: ProTrackGenreWrapped|ProTrackGenreList): Array<ProTrackGenre> {
  let genreList = [];

  if (genres && genres.genre && genres.genre instanceof Array) {
    genreList = genres.genre;
  } else if (genres && genres.genre && !(genres.genre instanceof Array)) {
    genreList = [genres.genre];
  }

  return genreList.filter(
    function(genre) {
      return genre.genrecd && genre.genrecd.trim() && genre.genrecd && genre.genretxt.trim();
    }
  );
}

function extractEpisode(episode: ProTrackEpisode): Episode {
  let {
    program_id,
    version_id,
    episode_title,
    episode_number,
    episode_desc,
    episode_url,
    episode_language,
    episode_dvi,
    episode_stereo,
    episode_hdtv,
    version_rating,
    version_caption,
    package_type,
    orig_broadcast_date,
    epi_genrelist_loc,
    epi_genrelist_nat
  } = episode;

  let genres = toGenreList(epi_genrelist_nat).concat(toGenreList(epi_genrelist_loc));

  return {
    id: program_id,
    program: { id: program_id },
    version: { id: version_id, rating: version_rating, caption: version_caption },
    title: episode_title,
    number: episode_number,
    desc: episode_desc,
    url: episode_url,
    language: episode_language,
    dvi: episode_dvi,
    stereo: episode_stereo,
    hdtv: episode_hdtv,
    package_type,
    orig_broadcast_date: protrackDateToTimestamp(orig_broadcast_date),
    genres: genres
  };
}

function extractSeries(series: ProTrackSeries): Show {
  let {
    series_id,
    series_code,
    series_title,
    series_desc,
    series_url,
    series_pgmtype,
    series_genrelist_loc
  } = series;

  let genres = toGenreList(series_genrelist_loc);

  return {
    id: series_id,
    code: series_code,
    title: series_title,
    desc: series_desc,
    url: series_url,
    pgmtype: series_pgmtype,
    genres: genres
  };
}

export default function mapToAirings(input: Object): Array<Airing> {
  let airings = [].concat.apply([], input.schedule_data.series.map(function(series) {

    let episodes = Array.isArray(series.episode) ? series.episode : [series.episode];
    return [].concat.apply([], episodes.map(function(episode) {

      let schedules = Array.isArray(episode.schedule) ? episode.schedule : [episode.schedule];
      return [].concat.apply([], schedules.map(function(schedule) {
        return buildAiring(schedule, extractEpisode(episode), extractSeries(series));
      }));
    }));
  })).filter(x => x);

  return expandToCompositeShows(airings);
}

function extractShows(airings: Array<Airing>): Map<number, Show> {
  let shows = new Map();

  airings.forEach(function(airing: Airing) {
    shows.set(airing.show.id, airing.show);
  });

  return shows;
}

function findEpisodesForSeriesId(airings: Array<Airing>, seriesId: number): Map<number, Episode> {
  let episodes = new Map();

  airings
    .filter(a => a.show.id === seriesId)
    .forEach(a => episodes.set(a.episode.id, a.episode));

  return episodes;
}

function extractGenreCount(episodes: Map<number, Episode>): Map<Genre, number> {
  let genres = new Map();

  episodes.forEach(function(episode) {
    episode.genres.forEach(function(genre) {
      genres.set(genre, (genres.get(genre) || 0) + 1);
    })
  });

  return genres;
}

/**
 * ProTrack data is rarely in a clean enough form to be usable. Descriptions
 * and genres may be scattered across series and episode objects. To try and
 * create a better set of data we compute a composite Show object that contains
 * a combination of series and episode information.
 *
 * This mutates the passed in structure and returns it back
 *
 * @param airings
 * @returns {Array}
 */
function expandToCompositeShows(airings: Array<Airing>): Array<Airing> {
  let shows = extractShows(airings);

  shows.forEach(function(show: Show) {

    let episodes = findEpisodesForSeriesId(airings, show.id);

    // Lift common genre information from the episode level up to the show
    let episodeGenres = extractGenreCount(episodes);

    let showGenres = new Set(show.genres);

    episodeGenres.forEach(function(count, genre) {
      if (count / episodes.size > 0.5) {
        showGenres.add(genre);
      }
    });

    show.genres = [...showGenres];

    // Lift an episode description if the show is missing one, and there is a
    // single representative episode
    if (!show.desc) {
      console.log('Show is missing description', show.id, JSON.stringify(show));

      if (episodes.size === 1) {
        console.log('Show has a single episode');
        let ep = episodes.values().next().value;

        if (ep) {
          console.log('Borrowing episode description for show', show.id, ep.id, ep.desc);
          show.desc = ep.desc;
        }
      }
    }
  });

  return airings;
}