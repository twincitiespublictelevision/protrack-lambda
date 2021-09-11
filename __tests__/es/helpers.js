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

export function mockSingleChannelAirings() {
  return [
    {
      data: {
        channel: "TPT2",
        date: 1547791200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547791200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547791200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547791200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547794800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547794800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547794800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547794800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547798400,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547798400,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547798400,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547798400,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547802000,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547807400,
        duration: 1629
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547807400,
        duration: 1629
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547809200,
        duration: 1743
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547809200,
        duration: 1743
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547811000,
        duration: 1640
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547811000,
        duration: 1640
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547812800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547812800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547814600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547814600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547816400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547816400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547818200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547818200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547820000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547820000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547821800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547821800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547823600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547823600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547825400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547825400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547827200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547827200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547829000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547829000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547830800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547830800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547832600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547832600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547834400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547834400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547836200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547836200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547838000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547838000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547839800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547839800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547841600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547841600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547843400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547843400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547845200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547845200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547847000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547847000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547848800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547848800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547850600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547850600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547852400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547852400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547854200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547854200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547856000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547856000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547856000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547856000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547859600,
        duration: 3400
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547859600,
        duration: 3400
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547859600,
        duration: 3400
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547859600,
        duration: 3400
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547863200,
        duration: 7006
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547870400,
        duration: 3376
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547870400,
        duration: 3376
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547870400,
        duration: 3376
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547870400,
        duration: 3376
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547874000,
        duration: 1432
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547874000,
        duration: 1432
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547875500,
        duration: 1334
      }
    }
  ];
}

export function mockAllChannelAirings() {
  return [
    {
      data: {
        channel: "TPTLIFE",
        date: 1547704800,
        duration: 3391
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547704800,
        duration: 3391
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547704800,
        duration: 3391
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547704800,
        duration: 3391
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547708280,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547708280,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547708280,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547708280,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547712360,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547712360,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547712360,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547712360,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547715840,
        duration: 5071
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547721000,
        duration: 1683
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547721000,
        duration: 1683
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547722800,
        duration: 1692
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547722800,
        duration: 1692
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547724600,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547724600,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547726400,
        duration: 825
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547727300,
        duration: 826
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547728200,
        duration: 1625
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547728200,
        duration: 1625
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547730000,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547730000,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547731800,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547731800,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547733600,
        duration: 1680
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547733600,
        duration: 1680
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547735400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547735400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547737200,
        duration: 1440
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547737200,
        duration: 1440
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547739000,
        duration: 1537
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547739000,
        duration: 1537
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547740800,
        duration: 1602
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547740800,
        duration: 1602
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547742600,
        duration: 1493
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547742600,
        duration: 1493
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547744400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547744400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547746200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547746200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547748000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547748000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547748000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547748000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547751600,
        duration: 1683
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547751600,
        duration: 1683
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547753400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547753400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547755140,
        duration: 3310
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547755140,
        duration: 3310
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547755140,
        duration: 3310
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547755140,
        duration: 3310
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547758500,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547758500,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547758500,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547758500,
        duration: 3976
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547762520,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547762520,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547764200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547764200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547766000,
        duration: 1638
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547766000,
        duration: 1638
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547767800,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547767800,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547769600,
        duration: 3371
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547769600,
        duration: 3371
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547769600,
        duration: 3371
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547769600,
        duration: 3371
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547773200,
        duration: 2695
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547773200,
        duration: 2695
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547773200,
        duration: 2695
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547773200,
        duration: 2695
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547776800,
        duration: 3265
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547776800,
        duration: 3265
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547776800,
        duration: 3265
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547776800,
        duration: 3265
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547780400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547780400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547780400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547780400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547784000,
        duration: 1698
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547784000,
        duration: 1698
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547785800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547785800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547785800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547785800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPTLIFE",
        date: 1547789400,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547704800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547704800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547706600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547706600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547708400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547708400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547710200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547710200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547712000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547712000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547713800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547713800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547715600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547715600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547717400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547717400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547719200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547719200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547721000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547721000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547722800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547722800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547724600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547724600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547726400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547726400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547728200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547728200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547730000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547730000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547731800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547731800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547733600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547733600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547735400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547735400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547737200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547737200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547739000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547739000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547740800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547740800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547742600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547742600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547744400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547744400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547746200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547746200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547748000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547748000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547749800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547749800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547751600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547751600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547753400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547753400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547755200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547755200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547757000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547757000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547758800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547758800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547760600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547760600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547762400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547762400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547764200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547764200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547766000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547766000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547767800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547767800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547769600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547769600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547771400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547771400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547773200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547773200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547775000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547775000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547776800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547776800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547778600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547778600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547780400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547780400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547782200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547782200,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547784000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547784000,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547785800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547785800,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547787600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547787600,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPTKIDS",
        date: 1547789400,
        duration: 1735
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547704800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547704800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547704800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547704800,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547708400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547708400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547708400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547708400,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547712000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547712000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547712000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547712000,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547715600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547715600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547715600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547715600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547719200,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547719200,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547721000,
        duration: 1351
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547721000,
        duration: 1351
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547722800,
        duration: 3241
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547722800,
        duration: 3241
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547722800,
        duration: 3241
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547722800,
        duration: 3241
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547726400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547726400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547728200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547728200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547730000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547730000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547731800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547731800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547733600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547733600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547735400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547735400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547737200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547737200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547739000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547739000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547740800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547740800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547742600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547742600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547744400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547744400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547746200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547746200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547748000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547748000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547749800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547749800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547751600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547751600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547753400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547753400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547755200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547755200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547757000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547757000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547758800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547758800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547760600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547760600,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547762400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547762400,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547764200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547764200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547766000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547766000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547767800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547767800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547769600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547769600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547769600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547769600,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547773200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547773200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547773200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547773200,
        duration: 3406
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547776800,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547776800,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547776800,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547776800,
        duration: 3333
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547780400,
        duration: 5291
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547785800,
        duration: 1629
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547785800,
        duration: 1629
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547787600,
        duration: 1743
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547787600,
        duration: 1743
      }
    },
    {
      data: {
        channel: "TPT2",
        date: 1547789400,
        duration: 1640
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547704800,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547704800,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547706600,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547706600,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547708400,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547708400,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547710200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547710200,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547712000,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547712000,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547712000,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547712000,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547715600,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547715600,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547715600,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547715600,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547719200,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547719200,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547721000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547721000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547722800,
        duration: 1658
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547722800,
        duration: 1658
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547724600,
        duration: 1597
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547724600,
        duration: 1597
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547726400,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547726400,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547728200,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547728200,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547730000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547730000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547731800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547731800,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547733600,
        duration: 35940
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547769600,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547769600,
        duration: 1725
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547771400,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547771400,
        duration: 1605
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547773200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547773200,
        duration: 1606
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547775000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547775000,
        duration: 1726
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547776800,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547776800,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547776800,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547776800,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547780400,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547780400,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547780400,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547780400,
        duration: 3420
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547784000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547784000,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547785800,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547785800,
        duration: 1600
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547787600,
        duration: 1658
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547787600,
        duration: 1658
      }
    },
    {
      data: {
        channel: "TPTMN",
        date: 1547789400,
        duration: 1597
      }
    }
  ];
}

export function mockScheduleDataShow() {
  return { "id": 30479, "code": "DIPL", "title": "Dictator's Playbook", "desc": "Learn how six dictators, from Mussolini to Saddam Hussein, shaped the world. How did they seize and lose power? What forces were against them? Learn the answers in these six immersive hours, each a revealing portrait of brutality and power.", "url": null, "pgmtype": 0, "genres": [] };
}

export function mockScheduleDataEpisode() {
  return { "program": { "id": 329203 }, "version": { "id": 381780, "rating": "TVRE", "caption": true }, "title": null, "number": 12456, "desc": null, "url": null, "language": "English", "dvi": false, "stereo": "STEREO", "hdtv": true, "package_type": "HDBA", "orig_broadcast_date": 1549260000, "genres": [{ "genrecd": "PA", "genretxt": "PUBLIC AFFAIRS" }] };
}

export function mockScheduleDataAiring() {
  return { "id": 195068388602, "channel": "TPTLIFE", "date": 1549427400, "duration": 3406, "episode": 334533388602, "show": 29652 };
}

export function mockScheduleDataView() {
  return [187705337040, 195316324439, 195317363565, 194639270983, 194725377073, 187607316375, 175478364555, 184317400691, 192745263504, 189810288812, 179327322143, 194810388601, 194853377074, 195415262694, 190536324439, 179340322143, 194937271446, 190566332129, 195203262400, 190430382095, 195220341079, 195068388602];
}

import multiSchedule from './normalizedMultiScheduleData.json';

export function mockNormalizedMultiChannelScheduleData() {
  return multiSchedule;
}

import singleSchedule from './normalizedSingleScheduleData.json';

export function mockNormalizedSingleChannelScheduleData() {
  return singleSchedule;
}