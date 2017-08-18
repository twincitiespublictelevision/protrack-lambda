export function r(s, e) {
  return Math.floor(Math.random() * (e - s)) + s;
}

export function mockResult() {
  return {
    _id: 'id-' + r(255, 500),
    _index: 'test-index',
    _score: r(5, 100),
    _source: {
      title: 'The title ' + r(255, 999),
      desc: 'The description ' + r(255, 999)
    },
    _type: 'test-type'
  }
}

export function mockAiring() {
  let id = r(100, 99999);
  let f = tag => tag + '_' + id;
  return {
    channel: '2',
    date: '2222-12-12T00:00:00',
    duration: r(60, 2000),
    episode: {
      program: {
        id: r(1, 500)
      },
      version: {
        id: r(1, 500),
        rating: f('rating'),
        caption: false
      },
      title: f('title_'),
      number: r(1000, 3000),
      desc: f('desc_'),
      url: f('url'),
      language: f('language'),
      dvi: false,
      stereo: f('stereo)'),
      hdtv: false,
      package_type: f('package_type'),
      orig_broadcast_date: '2222-12-12',
      genres: []
    },
    show: {
      id: r(1, 500),
      code: f('code'),
      title: f('title'),
      desc: f('desc'),
      url: f('url'),
      pgmtype: f('pgmtype'),
      genres: []
    }
  }
}