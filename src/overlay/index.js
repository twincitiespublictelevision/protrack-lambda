import util from 'util';

export function removeCoveredScheduleEntries(base, overlay) {
  return base.filter(
    airing => {
      return overlay.reduce(
        (shouldKeepRecord, overlayAiring) => {
          // Check if the current airing could possibly overlap with the overlay record
          let airingDoesNotOverlapWithOverlay = overlayAiring.channel !== airing.channel ||
            (overlayAiring.date >= airing.end_date || overlayAiring.end_date <= airing.date);

          console.debug('Overlay check', {
            airing_channel: airing.channel,
            airing_date: airing.date,
            airing_end_date: airing.end_date,
            overlay_channel: overlayAiring.channel,
            overlay_date: overlayAiring.date,
            overlay_end_date: overlayAiring.end_date
          });

          return shouldKeepRecord && airingDoesNotOverlapWithOverlay;
        },
        true
      );
    }
  );
}

export function applyOverlay(base, overlay) {
  console.debug(`Applying overlay to ${base.length} base records`);

  let filteredRecords = removeCoveredScheduleEntries(base, overlay);

  console.debug(`Overlay filtered resulted in ${filteredRecords.length} base records`);

  return filteredRecords.concat(overlay);
}