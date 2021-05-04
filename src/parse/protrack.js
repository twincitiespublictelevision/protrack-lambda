import moment from 'moment-timezone';

function protrackDateToTimestamp(date) {
  return moment.tz(date, process.env.PROTRACK_TZ).unix();
}

let durationRegex = /^P(\d+)H(\d+)M(\d+)S$/;

function durationToNumber(duration) {
  let matches = duration.match(durationRegex);

  if (matches && matches.length > 3) {
    return parseInt(matches[1]) * 60 * 60
      + parseInt(matches[2]) * 60
      + parseInt(matches[3]);
  }

  return 0;
}

function buildAiring(schedule, episode, show) {
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

function toGenreList(genres) {
  let genreList = [];

  if (genres && genres.genre && genres.genre instanceof Array) {
    genreList = genres.genre;
  } else if (genres && genres.genre && !(genres.genre instanceof Array)) {
    genreList = [genres.genre];
  }

  return genreList.filter(
    function (genre) {
      return genre.genrecd && genre.genrecd.trim() && genre.genrecd && genre.genretxt.trim();
    }
  );
}

function extractEpisode(episode) {
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

function extractSeries(series) {
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

export default function mapToAirings(input) {
  let series = Array.isArray(input.schedule_data.series) ? input.schedule_data.series : [input.schedule_data.series];

  let airings = [].concat.apply([], series.map(function (series) {

    let episodes = Array.isArray(series.episode) ? series.episode : [series.episode];
    return [].concat.apply([], episodes.map(function (episode) {

      let schedules = Array.isArray(episode.schedule) ? episode.schedule : [episode.schedule];
      return [].concat.apply([], schedules.map(function (schedule) {
        return buildAiring(schedule, extractEpisode(episode), extractSeries(series));
      }));
    }));
  })).filter(x => x);

  return expandToCompositeShows(airings);
}

function extractShows(airings) {
  let shows = new Map();

  airings.forEach(function (airing) {
    shows.set(airing.show.id, airing.show);
  });

  return shows;
}

function findEpisodesForSeriesId(airings, seriesId) {
  let episodes = new Map();

  airings
    .filter(a => a.show.id === seriesId)
    .forEach(a => episodes.set(a.episode.id, a.episode));

  return episodes;
}

function extractGenreCount(episodes) {
  let genres = new Map();

  episodes.forEach(function (episode) {
    episode.genres.forEach(function (genre) {
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
function expandToCompositeShows(airings) {
  let shows = extractShows(airings);

  shows.forEach(function (show) {

    let episodes = findEpisodesForSeriesId(airings, show.id);

    // Lift common genre information from the episode level up to the show
    let episodeGenres = extractGenreCount(episodes);

    let showGenres = new Set(show.genres);

    episodeGenres.forEach(function (count, genre) {
      if (count / episodes.size > 0.5) {
        showGenres.add(genre);
      }
    });

    show.genres = [...showGenres];

    // Lift an episode description if the show is missing one, and there is a
    // single representative episode
    if (!show.desc) {
      console.debug('Show is missing description', show.id, JSON.stringify(show));

      if (episodes.size === 1) {
        console.debug('Show has a single episode');
        let ep = episodes.values().next().value;

        if (ep) {
          console.debug('Borrowing episode description for show', show.id, ep.id, ep.desc);
          show.desc = ep.desc;
        }
      }
    }
  });

  return airings;
}