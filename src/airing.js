// @flow

export type Genre = {
  genrecd: string,
  genretxt: string
};

export type Episode = {
  id: number,
  program: {
    id: number
  },
  version: {
    id: number,
    rating: string,
    caption: boolean
  },
  title: string,
  number: number,
  desc: string,
  url: string,
  language: string,
  dvi: boolean,
  stereo: string,
  hdtv: boolean,
  package_type: string,
  orig_broadcast_date: string,
  genres: Array<Genre>
};

export type Show = {
  id: number,
  code: string,
  title: string,
  desc: string,
  url: string,
  pgmtype: string,
  genres: Array<Genre>
};

export type Airing = {
  id: number,
  channel: string,
  date: string,
  end_date: number,
  duration: number,
  episode: Episode,
  show: Show
};