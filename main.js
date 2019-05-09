function processHistogram(histogram) {
  var days = histogram.results.day

  var daysArray = _.map(_.keys(days), function(key) {
    return { day: key, obs: days[key] }
  })

  var streaks = []

  var currentStreakStartDate = null

  for (let i = 0; i < daysArray.length; i++) {
    const day = daysArray[i];
    if (currentStreakStartDate) {
      // in a streak
      if (day.obs === 0) {
        // end streak
        currentStreakStartDate = null
      } else {
        // continue streak
        var currentStreak = streaks[streaks.length - 1]
        currentStreak.endDate = day.day
        currentStreak.duration += 1
      }
    } else {
      // check for new streak
      if (day.obs === 0) {
        // no new streak
        currentStreakStartDate = null
      } else {
        // new streak
        currentStreakStartDate = day.day
        streaks.push({
          startDate: day.day,
          endDate: day.day,
          duration: 1
        })
      }
    }
  }

  var topSortedStreaks = _.take(_.reverse(_.sortBy(streaks, ['duration'])), 10)

  var tableElement = document.getElementById('table')

  var tableHTML = `
    <div id="table">
      <h2>Your streaks</h2>
      <table>
        <thead><td>Start date</td><td>End date</td><td>Streak duration</td></thead>`

  _.forEach(topSortedStreaks, function(streak) {
    tableHTML += `<tr><td>${streak.startDate}</td><td>${streak.endDate}</td><td>${streak.duration}</td></tr>`
  })

  tableHTML += `
      </table>
    </div>
  `

  tableElement.outerHTML = tableHTML
}

function requestHistogram(username) {
  fetch(`https://api.inaturalist.org/v1/observations/histogram?user_id=${username}&interval=day&d1=1900-01-01`)
    .then(function(resp) {
      return resp.json()
    })
    .then(function(respJSON) {
      processHistogram(respJSON)
    })
}

function getStreak() {
  var username = document.getElementById('username').value
  requestHistogram(username)
}
