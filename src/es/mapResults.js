export function mapResults(results) {
  let { hits: { hits: data } } = results;
  return data.map(function (res) {
    return {
      score: res._score,
      data: res._source
    }
  });
}